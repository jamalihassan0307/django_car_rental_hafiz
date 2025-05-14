from django.contrib import admin
from .models import UserProfile, Car

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'role', 'created_at')
    list_filter = ('role', 'created_at')
    search_fields = ('user__username', 'phone_number')

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_type', 'price_per_day', 'is_available', 'created_at')
    list_filter = ('car_type', 'is_available', 'created_at')
    search_fields = ('name', 'description')


