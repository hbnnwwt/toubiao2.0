from rest_framework import serializers
from .models import ProjectCategory, Project, ProjectRisk


class ProjectCategorySerializer(serializers.ModelSerializer):
    """项目分类序列化器"""

    class Meta:
        model = ProjectCategory
        fields = ['id', 'name', 'code', 'description', 'created_at']


class ProjectRiskSerializer(serializers.ModelSerializer):
    """项目风险序列化器"""

    class Meta:
        model = ProjectRisk
        fields = ['id', 'risk_type', 'level', 'score', 'description', 'suggestion', 'created_at']


class ProjectListSerializer(serializers.ModelSerializer):
    """项目列表序列化器"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'code', 'category', 'category_name', 'budget', 'region', 'status', 'deadline', 'created_at', 'created_by_name']


class ProjectDetailSerializer(serializers.ModelSerializer):
    """项目详情序列化器"""
    category = ProjectCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ProjectCategory.objects.all(),
        source='category',
        write_only=True,
        required=False
    )
    created_by = serializers.StringRelatedField()
    risks = ProjectRiskSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'code', 'category', 'category_id', 'description', 'budget', 'period',
            'bid_method', 'qualifications', 'bidder', 'contact', 'contact_phone', 'region', 'address',
            'publish_date', 'deadline', 'status', 'risk_level', 'risks', 'remarks',
            'created_by', 'created_at', 'updated_at'
        ]


class ProjectCreateSerializer(serializers.ModelSerializer):
    """项目创建序列化器"""

    class Meta:
        model = Project
        fields = [
            'name', 'code', 'category', 'description', 'budget', 'period', 'bid_method',
            'qualifications', 'bidder', 'contact', 'contact_phone', 'region', 'address',
            'publish_date', 'deadline', 'status', 'risk_level', 'remarks'
        ]
