from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """扩展 Django 用户模型"""

    ROLE_CHOICES = [
        ('admin', '管理员'),
        ('manager', '项目经理'),
        ('bidder', '投标专员'),
        ('finance', '财务'),
        ('legal', '法务'),
    ]

    role = models.CharField('角色', max_length=20, choices=ROLE_CHOICES, default='bidder')
    phone = models.CharField('手机号', max_length=20, blank=True)
    department = models.CharField('部门', max_length=100, blank=True)
    avatar = models.ImageField('头像', upload_to='avatars/', null=True, blank=True)
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'users'
        verbose_name = '用户'
        verbose_name_plural = '用户'

    def __str__(self):
        return self.username
