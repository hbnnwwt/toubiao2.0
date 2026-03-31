from django.db import models
from django.conf import settings


class Document(models.Model):

    TYPE_CHOICES = [
        ('tender', '招标文件'),
        ('technical', '技术方案'),
        ('qualification', '资质文件'),
        ('business', '商务文件'),
        ('case', '业绩材料'),
        ('other', '其他'),
    ]

    STATUS_CHOICES = [
        ('processing', '处理中'),
        ('completed', '已完成'),
        ('failed', '失败'),
    ]

    name = models.CharField('文件名', max_length=200)
    file = models.FileField('文件', upload_to='documents/%Y/%m/')
    file_size = models.BigIntegerField('文件大小(字节)', default=0)
    file_type = models.CharField('文件类型', max_length=50, blank=True)
    doc_type = models.CharField('文档类型', max_length=20, choices=TYPE_CHOICES)
    status = models.CharField('状态', max_length=20, choices=STATUS_CHOICES, default='completed')
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='documents',
        verbose_name='关联项目'
    )
    bid_submission = models.ForeignKey(
        'bidding.BidSubmission',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='documents',
        verbose_name='关联投标'
    )
    description = models.TextField('描述', blank=True)
    uploader = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_documents',
        verbose_name='上传人'
    )
    uploaded_at = models.DateTimeField('上传时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'documents'
        verbose_name = '文档'
        verbose_name_plural = '文档'
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.name


class DocumentVersion(models.Model):
    """文档版本"""

    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name='versions',
        verbose_name='文档'
    )
    version = models.CharField('版本号', max_length=20)
    file = models.FileField('文件', upload_to='document_versions/%Y/%m/')
    file_size = models.BigIntegerField('文件大小(字节)', default=0)
    uploader = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='上传人'
    )
    comment = models.TextField('版本说明', blank=True)
    uploaded_at = models.DateTimeField('上传时间', auto_now_add=True)

    class Meta:
        db_table = 'document_versions'
        verbose_name = '文档版本'
        verbose_name_plural = '文档版本'
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.document.name} v{self.version}"
