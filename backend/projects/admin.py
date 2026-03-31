from django.contrib import admin
from .models import ProjectCategory, Project, ProjectRisk


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'created_at']
    search_fields = ['name', 'code']
    ordering = ['name']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'category', 'status', 'budget', 'region', 'deadline', 'created_at']
    list_filter = ['status', 'category', 'region', 'bid_method']
    search_fields = ['name', 'code', 'bidder', 'description']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']

    fieldsets = (
        ('基本信息', {
            'fields': ('name', 'code', 'category', 'status', 'description')
        }),
        ('项目信息', {
            'fields': ('budget', 'period', 'bid_method', 'qualifications', 'region', 'address')
        }),
        ('招标单位', {
            'fields': ('bidder', 'contact', 'contact_phone')
        }),
        ('时间信息', {
            'fields': ('publish_date', 'deadline')
        }),
        ('其他', {
            'fields': ('risk_level', 'remarks', 'created_by')
        }),
    )


@admin.register(ProjectRisk)
class ProjectRiskAdmin(admin.ModelAdmin):
    list_display = ['project', 'risk_type', 'level', 'score', 'created_at']
    list_filter = ['risk_type', 'level']
    search_fields = ['project__name', 'description']
    ordering = ['-created_at']
