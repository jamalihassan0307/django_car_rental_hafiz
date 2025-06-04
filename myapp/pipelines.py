from social_core.pipeline.partial import partial
from .models import UserProfile
from django.contrib import messages

def get_avatar(backend, response, user=None, *args, **kwargs):
    """
    Get user's avatar from social provider if available
    """
    if backend.name == 'google-oauth2':
        if response.get('picture'):
            user.userprofile.profile_image = response['picture']
            user.userprofile.save()

def create_user_profile(backend, user, response, *args, **kwargs):
    """
    Create user profile if it doesn't exist
    """
    # Skip if this is not a new user and profile exists
    if not kwargs.get('is_new'):
        try:
            profile = user.userprofile
            return
        except UserProfile.DoesNotExist:
            pass  # Continue to create profile

    try:
        # Create new profile with user role by default
        UserProfile.objects.create(
            user=user,
            role='user',
            profile_image=response.get('picture', ''),
            phone_number='',
            address=''
        )
    except Exception as e:
        print(f"Error creating profile: {str(e)}")
        UserProfile.objects.get_or_create(user=user, defaults={'role': 'user'})

def update_user_social_data(backend, user, response, *args, **kwargs):
    """
    Update user data from social provider
    """
    if backend.name == 'google-oauth2':
        if response.get('name'):
            name_parts = response['name'].split(' ', 1)
            if len(name_parts) >= 2:
                user.first_name = name_parts[0]
                user.last_name = name_parts[1]
            else:
                user.first_name = name_parts[0]
                user.last_name = ''
            
        if response.get('email'):
            user.email = response['email']
            
        user.save()

def check_email_domain(backend, response, user=None, *args, **kwargs):
    """
    Optional: Check email domain for restrictions
    """
    if backend.name == 'google-oauth2':
        email = response.get('email', '')
        # Add your domain restrictions here if needed
        pass

@partial
def set_user_role(backend, user, response, *args, **kwargs):
    """
    Optional: Set user role based on email domain or other criteria
    """
    if backend.name == 'google-oauth2':
        try:
            profile = user.userprofile
            # Add your role setting logic here if needed
            pass
        except UserProfile.DoesNotExist:
            pass

def handle_social_auth_exception(backend, strategy, details, response, *args, **kwargs):
    """
    Handle exceptions during social authentication
    """
    try:
        social = kwargs.get('social')
        if social:
            if 'access_token' in response:
                social.extra_data['access_token'] = response['access_token']
            if 'refresh_token' in response:
                social.extra_data['refresh_token'] = response['refresh_token']
            social.save()
    except Exception as e:
        messages.error(kwargs['request'], 'An error occurred during social authentication.')
        return None 