from django.contrib import admin
from .models import ApprovalFlow, ApprovalNode, ApprovalRecord, ApprovalAction


@admin.register(ApprovalFlow)
class ApprovalFlowAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'flow_type', 'is_active', 'created_at']
    list_filter = ['flow_type', 'is_active']
    search_fields = ['name', 'code']
    ordering = ['-created_at']


@admin.register(ApprovalNode)
class ApprovalNodeAdmin(admin.ModelAdmin):
    list_display = ['flow', 'name', 'order', 'approver_role', 'is_required']
    list_filter = ['flow', 'approver_role']
    search_fields = ['flow__name', 'name']
    ordering = ['flow', 'order']


@admin.register(ApprovalRecord)
class ApprovalRecordAdmin(admin.ModelAdmin):
    list_display = ['flow', 'status', 'submitted_by', 'current_node', 'submitted_at', 'completed_at']
    list_filter = ['status', 'flow']
    search_fields = ['flow__name']
    date_hierarchy = 'submitted_at'
    ordering = ['-submitted_at']


@admin.register(ApprovalAction)
class ApprovalActionAdmin(admin.ModelAdmin):
    list_display = ['record', 'node', 'approver', 'action', 'created_at']
    list_filter = ['action']
    search_fields = ['record__flow__name', 'approver__username']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
