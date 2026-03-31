from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'department', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'is_staff', 'date_joined']
    search_fields = ['username', 'email', 'phone', 'department']
    ordering = ['-date_joined']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('基本信息', {'fields': ('role', 'phone', 'department', 'avatar')}),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('基本信息', {'fields': ('role', 'phone', 'department')}),
    )
