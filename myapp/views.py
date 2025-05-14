from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth import logout
from .models import Car, UserProfile
from django.core.paginator import Paginator
from datetime import datetime
from decimal import Decimal
from django.http import JsonResponse

def home(request):
    featured_cars = Car.objects.filter(is_available=True)[:3]
    return render(request, 'myapp/home.html', {'featured_cars': featured_cars})

def about(request):
    return render(request, 'myapp/about.html')

def car_detail(request, car_id):
    car = get_object_or_404(Car, id=car_id)
    return render(request, 'myapp/car_detail.html', {'car': car})

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            UserProfile.objects.create(user=user)
            messages.success(request, 'Registration successful! Please login.')
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})

def custom_logout(request):
    if request.method == 'POST':
        logout(request)
        messages.success(request, 'You have been successfully logged out.')
        return redirect('home')
    return redirect('home')

@login_required
def profile(request):
    try:
        profile = request.user.userprofile
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=request.user)
    return render(request, 'myapp/profile.html', {'profile': profile})

@login_required
def edit_profile(request):
    try:
        profile = request.user.userprofile
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=request.user)
    
    if request.method == 'POST':
        # Update user info
        request.user.first_name = request.POST.get('first_name')
        request.user.last_name = request.POST.get('last_name')
        request.user.email = request.POST.get('email')
        request.user.save()
        
        # Update profile info
        profile.phone_number = request.POST.get('phone_number')
        profile.address = request.POST.get('address')
        if 'profile_image' in request.FILES:
            profile.profile_image = request.FILES['profile_image']
        profile.save()
        
        messages.success(request, 'Profile updated successfully!')
        return redirect('profile')
    
    return render(request, 'myapp/edit_profile.html', {'profile': profile})

def is_admin(user):
    try:
        return user.is_authenticated and user.userprofile.role == 'admin'
    except UserProfile.DoesNotExist:
        return False

def cars_view(request):
    cars = Car.objects.all()
    is_admin_user = is_admin(request.user)
    context = {
        'cars': cars,
        'is_admin': is_admin_user
    }
    return render(request, 'myapp/cars.html', context)

@login_required
def add_car(request):
    if not is_admin(request.user):
        messages.error(request, 'You do not have permission to add cars.')
        return redirect('cars')
    
    if request.method == 'POST':
        name = request.POST.get('name')
        car_type = request.POST.get('car_type')
        description = request.POST.get('description')
        price_per_day = request.POST.get('price_per_day')
        image = request.FILES.get('image')
        is_available = request.POST.get('is_available') == 'on'
        
        car = Car.objects.create(
            name=name,
            car_type=car_type,
            description=description,
            price_per_day=price_per_day,
            image=image,
            is_available=is_available
        )
        messages.success(request, 'Car added successfully!')
        return redirect('cars')
    
    return render(request, 'myapp/add_car.html')

@login_required
def edit_car(request, car_id):
    if not is_admin(request.user):
        messages.error(request, 'You do not have permission to edit cars.')
        return redirect('cars')
    
    car = get_object_or_404(Car, id=car_id)
    
    if request.method == 'POST':
        car.name = request.POST.get('name')
        car.car_type = request.POST.get('car_type')
        car.description = request.POST.get('description')
        car.price_per_day = request.POST.get('price_per_day')
        car.is_available = request.POST.get('is_available') == 'on'
        
        if 'image' in request.FILES:
            car.image = request.FILES['image']
        
        car.save()
        messages.success(request, 'Car updated successfully!')
        return redirect('cars')
    
    return render(request, 'myapp/edit_car.html', {'car': car})

@login_required
def delete_car(request, car_id):
    if not is_admin(request.user):
        messages.error(request, 'You do not have permission to delete cars.')
        return redirect('cars')
    
    car = get_object_or_404(Car, id=car_id)
    car.delete()
    messages.success(request, 'Car deleted successfully!')
    return redirect('cars')
