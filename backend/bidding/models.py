from django.db import models
from django.conf import settings
from projects.models import Project


class Qualification(models.Model):
    """企业资质"""

    TYPE_CHOICES = [
        ('qualification', '资质'),
        ('license', '许可'),
        ('certification', '认证'),
    ]

    LEVEL_CHOICES = [
        ('special', '特级'),
        ('first', '一级'),
        ('second', '二级'),
        ('third', '三级'),
    ]

    name = models.CharField('资质名称', max_length=200)
    code = models.CharField('资质编码', max_length=50, blank=True)
    type = models.CharField('类型', max_length=20, choices=TYPE_CHOICES)
    level = models.CharField('等级', max_length=20, choices=LEVEL_CHOICES, blank=True)
    issue_org = models.CharField('发证机关', max_length=100, blank=True)
    issue_date = models.DateField('发证日期', null=True, blank=True)
    expire_date = models.DateField('有效期至', null=True, blank=True)
    document = models.FileField('资质文件', upload_to='qualifications/', null=True, blank=True)
    is_valid = models.BooleanField('是否有效', default=True)
    remarks = models.TextField('备注', blank=True)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'qualifications'
        verbose_name = '企业资质'
        verbose_name_plural = '企业资质'

    def __str__(self):
        return self.name


class ProjectCase(models.Model):
    """业绩案例"""

    name = models.CharField('项目名称', max_length=200)
    code = models.CharField('项目编号', max_length=50, blank=True)
    category = models.CharField('项目类型', max_length=50, blank=True)
    amount = models.DecimalField('合同金额(万)', max_digits=12, decimal_places=2, null=True, blank=True)
    start_date = models.DateField('开工日期', null=True, blank=True)
    end_date = models.DateField('完工日期', null=True, blank=True)
    owner = models.CharField('业主单位', max_length=200, blank=True)
    description = models.TextField('项目描述', blank=True)
    result = models.CharField('中标结果', max_length=20, blank=True, help_text='中标/未中')
    document = models.FileField('证明文件', upload_to='cases/', null=True, blank=True)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'project_cases'
        verbose_name = '业绩案例'
        verbose_name_plural = '业绩案例'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class TeamMember(models.Model):
    """团队人员"""

    name = models.CharField('姓名', max_length=50)
    position = models.CharField('职位', max_length=50)
    cert_name = models.CharField('证书名称', max_length=100, blank=True)
    cert_no = models.CharField('证书编号', max_length=50, blank=True)
    expire_date = models.DateField('证书有效期', null=True, blank=True)
    phone = models.CharField('联系电话', max_length=20, blank=True)
    email = models.EmailField('邮箱', blank=True)
    resume = models.FileField('简历', upload_to='resumes/', null=True, blank=True)
    is_active = models.BooleanField('是否在职', default=True)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'team_members'
        verbose_name = '团队人员'
        verbose_name_plural = '团队人员'

    def __str__(self):
        return f"{self.name} - {self.position}"


class BidTemplate(models.Model):
    """投标文件模板"""

    name = models.CharField('模板名称', max_length=200)
    code = models.CharField('模板编码', max_length=50, unique=True)
    template_type = models.CharField(
        '模板类型',
        max_length=20,
        choices=[('business', '商务标'), ('technical', '技术标')]
    )
    content = models.TextField('模板内容', blank=True)
    file = models.FileField('模板文件', upload_to='templates/', null=True, blank=True)
    is_active = models.BooleanField('是否启用', default=True)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'bid_templates'
        verbose_name = '投标模板'
        verbose_name_plural = '投标模板'

    def __str__(self):
        return self.name


class BidSubmission(models.Model):
    """投标提交"""

    STATUS_CHOICES = [
        ('draft', '草稿'),
        ('submitted', '已提交'),
        ('under_review', '审核中'),
        ('approved', '已通过'),
        ('rejected', '已驳回'),
    ]

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='bid_submissions',
        verbose_name='投标项目'
    )
    bidder = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bid_submissions',
        verbose_name='投标人'
    )
    bid_type = models.CharField(
        '投标类型',
        max_length=20,
        choices=[('business', '商务标'), ('technical', '技术标'), ('both', '商务+技术')]
    )
    template = models.ForeignKey(
        BidTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='submissions',
        verbose_name='使用模板'
    )
    bid_price = models.DecimalField('投标报价(万)', max_digits=12, decimal_places=2, null=True, blank=True)
    period = models.IntegerField('工期(天)', null=True, blank=True)
    payment_terms = models.TextField('付款条件', blank=True)
    business_content = models.TextField('商务标内容', blank=True)
    technical_content = models.TextField('技术标内容', blank=True)
    status = models.CharField('状态', max_length=20, choices=STATUS_CHOICES, default='draft')
    submitted_at = models.DateTimeField('提交时间', null=True, blank=True)
    reviewed_at = models.DateTimeField('审核时间', null=True, blank=True)
    review_comment = models.TextField('审核意见', blank=True)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'bid_submissions'
        verbose_name = '投标提交'
        verbose_name_plural = '投标提交'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.project.name} - {self.bidder.username}"
