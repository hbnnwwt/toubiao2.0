from django.contrib import admin
from .models import Qualification, ProjectCase, TeamMember, BidTemplate, BidSubmission


@admin.register(Qualification)
class QualificationAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'level', 'issue_org', 'expire_date', 'is_valid']
    list_filter = ['type', 'level', 'is_valid']
    search_fields = ['name', 'code', 'issue_org']
    ordering = ['-created_at']


@admin.register(ProjectCase)
class ProjectCaseAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'amount', 'start_date', 'end_date', 'result']
    list_filter = ['category', 'result']
    search_fields = ['name', 'code', 'owner']
    date_hierarchy = 'start_date'
    ordering = ['-created_at']


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'cert_name', 'expire_date', 'is_active']
    list_filter = ['position', 'is_active']
    search_fields = ['name', 'cert_name', 'cert_no']
    ordering = ['-created_at']


@admin.register(BidTemplate)
class BidTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'template_type', 'is_active']
    list_filter = ['template_type', 'is_active']
    search_fields = ['name', 'code']
    ordering = ['-created_at']


@admin.register(BidSubmission)
class BidSubmissionAdmin(admin.ModelAdmin):
    list_display = ['project', 'bidder', 'bid_type', 'status', 'bid_price', 'submitted_at']
    list_filter = ['status', 'bid_type']
    search_fields = ['project__name', 'bidder__username']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']

    fieldsets = (
        ('基本信息', {
            'fields': ('project', 'bidder', 'bid_type', 'template')
        }),
        ('投标内容', {
            'fields': ('bid_price', 'period', 'payment_terms', 'business_content', 'technical_content')
        }),
        ('状态', {
            'fields': ('status', 'submitted_at', 'reviewed_at', 'review_comment')
        }),
    )
