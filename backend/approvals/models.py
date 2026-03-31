from django.db import models
from django.conf import settings


class ApprovalFlow(models.Model):
    """审批流程"""

    FLOW_TYPE_CHOICES = [
        ('bid_submit', '投标提交审批'),
        ('project_approve', '项目立项审批'),
        ('bid_confirm', '中标确认审批'),
    ]

    name = models.CharField('流程名称', max_length=100)
    code = models.CharField('流程编码', max_length=50, unique=True)
    flow_type = models.CharField('流程类型', max_length=20, choices=FLOW_TYPE_CHOICES)
    description = models.TextField('描述', blank=True)
    is_active = models.BooleanField('是否启用', default=True)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'approval_flows'
        verbose_name = '审批流程'
        verbose_name_plural = '审批流程'

    def __str__(self):
        return self.name


class ApprovalNode(models.Model):
    """审批节点"""

    flow = models.ForeignKey(
        ApprovalFlow,
        on_delete=models.CASCADE,
        related_name='nodes',
        verbose_name='所属流程'
    )
    name = models.CharField('节点名称', max_length=100)
    order = models.IntegerField('顺序', default=0)
    approver_role = models.CharField('审批人角色', max_length=20, blank=True)
    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approval_nodes',
        verbose_name='指定审批人'
    )
    is_required = models.BooleanField('是否必审', default=True)

    class Meta:
        db_table = 'approval_nodes'
        verbose_name = '审批节点'
        verbose_name_plural = '审批节点'
        ordering = ['order']

    def __str__(self):
        return f"{self.flow.name} - {self.name}"


class ApprovalRecord(models.Model):
    """审批记录"""

    STATUS_CHOICES = [
        ('pending', '待审批'),
        ('approved', '已通过'),
        ('rejected', '已驳回'),
    ]

    flow = models.ForeignKey(
        ApprovalFlow,
        on_delete=models.CASCADE,
        related_name='records',
        verbose_name='审批流程'
    )
    bid_submission = models.ForeignKey(
        'bidding.BidSubmission',
        on_delete=models.CASCADE,
        related_name='approval_records',
        verbose_name='投标提交',
        null=True,
        blank=True
    )
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        related_name='approval_records',
        verbose_name='项目',
        null=True,
        blank=True
    )
    current_node = models.ForeignKey(
        ApprovalNode,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='current_records',
        verbose_name='当前节点'
    )
    status = models.CharField('状态', max_length=20, choices=STATUS_CHOICES, default='pending')
    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='submitted_approvals',
        verbose_name='提交人'
    )
    submitted_at = models.DateTimeField('提交时间', auto_now_add=True)
    completed_at = models.DateTimeField('完成时间', null=True, blank=True)

    class Meta:
        db_table = 'approval_records'
        verbose_name = '审批记录'
        verbose_name_plural = '审批记录'
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.flow.name} - {self.get_status_display()}"


class ApprovalAction(models.Model):
    """审批操作记录"""

    record = models.ForeignKey(
        ApprovalRecord,
        on_delete=models.CASCADE,
        related_name='actions',
        verbose_name='审批记录'
    )
    node = models.ForeignKey(
        ApprovalNode,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='审批节点'
    )
    approver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='approval_actions',
        verbose_name='审批人'
    )
    action = models.CharField('操作', max_length=20, choices=[('approve', '通过'), ('reject', '驳回')])
    comment = models.TextField('审批意见', blank=True)
    created_at = models.DateTimeField('审批时间', auto_now_add=True)

    class Meta:
        db_table = 'approval_actions'
        verbose_name = '审批操作'
        verbose_name_plural = '审批操作'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.approver.username} - {self.get_action_display()}"
