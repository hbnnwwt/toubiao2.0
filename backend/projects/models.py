from django.db import models
from django.conf import settings


class ProjectCategory(models.Model):
    """项目分类"""

    name = models.CharField('分类名称', max_length=100)
    code = models.CharField('编码', max_length=20, unique=True)
    description = models.TextField('描述', blank=True)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)

    class Meta:
        db_table = 'project_categories'
        verbose_name = '项目分类'
        verbose_name_plural = '项目分类'

    def __str__(self):
        return self.name


class Project(models.Model):
    """招标项目"""

    STATUS_CHOICES = [
        ('draft', '草稿'),
        ('bidding', '招标中'),
        ('submitting', '投标中'),
        ('evaluating', '评标中'),
        ('completed', '已结束'),
        ('cancelled', '已取消'),
    ]

    name = models.CharField('项目名称', max_length=200)
    code = models.CharField('项目编号', max_length=50, unique=True)
    category = models.ForeignKey(
        ProjectCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='projects',
        verbose_name='项目分类'
    )
    description = models.TextField('项目描述', blank=True)
    budget = models.DecimalField('预算金额(万)', max_digits=12, decimal_places=2, null=True, blank=True)
    period = models.CharField('建设周期', max_length=100, blank=True)
    bid_method = models.CharField('招标方式', max_length=50, blank=True)
    qualifications = models.TextField('资质要求', blank=True)
    bidder = models.CharField('招标单位', max_length=200, blank=True)
    contact = models.CharField('联系人', max_length=100, blank=True)
    contact_phone = models.CharField('联系电话', max_length=20, blank=True)
    region = models.CharField('地区', max_length=50, blank=True)
    address = models.CharField('项目地址', max_length=200, blank=True)
    publish_date = models.DateField('发布日期', null=True, blank=True)
    deadline = models.DateField('截止日期', null=True, blank=True)
    status = models.CharField('状态', max_length=20, choices=STATUS_CHOICES, default='draft')
    risk_level = models.IntegerField('风险等级', default=50, help_text='0-100，风险越高值越大')
    remarks = models.TextField('备注', blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_projects',
        verbose_name='创建人'
    )
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'projects'
        verbose_name = '招标项目'
        verbose_name_plural = '招标项目'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.code})"


class ProjectRisk(models.Model):
    """项目风险评估"""

    RISK_TYPE_CHOICES = [
        ('tech', '技术风险'),
        ('finance', '财务风险'),
        ('legal', '法律风险'),
        ('management', '管理风险'),
    ]

    LEVEL_CHOICES = [
        ('low', '低'),
        ('medium', '中'),
        ('high', '高'),
    ]

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='risks',
        verbose_name='项目'
    )
    risk_type = models.CharField('风险类型', max_length=20, choices=RISK_TYPE_CHOICES)
    level = models.CharField('风险等级', max_length=10, choices=LEVEL_CHOICES)
    score = models.IntegerField('风险评分', default=50, help_text='0-100')
    description = models.TextField('风险描述', blank=True)
    suggestion = models.TextField('应对建议', blank=True)
    created_at = models.DateTimeField('评估时间', auto_now_add=True)

    class Meta:
        db_table = 'project_risks'
        verbose_name = '项目风险'
        verbose_name_plural = '项目风险'

    def __str__(self):
        return f"{self.project.name} - {self.get_risk_type_display()}"
