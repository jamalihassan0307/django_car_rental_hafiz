from django.contrib import admin
from .models import UserProfile, Car, Booking, Review, Contact

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'created_at')
    search_fields = ('user__username', 'phone_number')

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_type', 'price_per_day', 'is_available')
    list_filter = ('car_type', 'is_available')
    search_fields = ('name', 'description')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'car', 'start_date', 'end_date', 'status', 'total_price')
    list_filter = ('status', 'start_date')
    search_fields = ('user__username', 'car__name')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'car', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'car__name', 'comment')

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
