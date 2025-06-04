from functools import partial
from .models import UserProfile
from django.contrib import messages

def get_avatar(backend, user, response, *args, **kwargs):
    """Get the user's avatar from the Google response"""
    if backend.name == 'google-oauth2':
        try:
            # Create profile if it doesn't exist
            profile, created = UserProfile.objects.get_or_create(user=user)
            profile.profile_image = response['picture']
            profile.save()
        except Exception as e:
            print(f"Error updating avatar: {str(e)}")
    return {'user': user}

def create_user_profile(backend, user, response, *args, **kwargs):
    """Create a user profile if it doesn't exist"""
    try:
        UserProfile.objects.get_or_create(user=user)
    except Exception as e:
        print(f"Error creating user profile: {str(e)}")
    return {'user': user}

def update_user_social_data(backend, user, response, *args, **kwargs):
    """Update user data from social auth response"""
    if backend.name == 'google-oauth2':
        try:
            user.first_name = response.get('given_name', '')
            user.last_name = response.get('family_name', '')
            user.email = response.get('email', '')
            user.save()
        except Exception as e:
            print(f"Error updating user data: {str(e)}")
    return {'user': user}

def check_email_domain(backend, user, response, *args, **kwargs):
    """Check if the user's email domain is allowed"""
    # Add your email domain restrictions here
    return {'user': user}

def set_user_role(backend, user, response, *args, **kwargs):
    """Set user role based on certain criteria"""
    # Add your role assignment logic here
    return {'user': user}

def handle_social_auth_exception(backend, user, response, *args, **kwargs):
    """Handle exceptions during social authentication"""
    if not user:
        messages.error(None, "Authentication failed. Please try again.")
        return None
    return {'user': user} 