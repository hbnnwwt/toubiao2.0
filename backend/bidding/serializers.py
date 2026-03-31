from rest_framework import serializers
from .models import Qualification, ProjectCase, TeamMember, BidTemplate, BidSubmission


class QualificationSerializer(serializers.ModelSerializer):
    """企业资质序列化器"""

    class Meta:
        model = Qualification
        fields = ['id', 'name', 'code', 'type', 'level', 'issue_org', 'issue_date', 'expire_date', 'is_valid', 'created_at']


class ProjectCaseSerializer(serializers.ModelSerializer):
    """业绩案例序列化器"""

    class Meta:
        model = ProjectCase
        fields = ['id', 'name', 'code', 'category', 'amount', 'start_date', 'end_date', 'owner', 'result', 'created_at']


class TeamMemberSerializer(serializers.ModelSerializer):
    """团队人员序列化器"""

    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'position', 'cert_name', 'cert_no', 'expire_date', 'phone', 'email', 'is_active', 'created_at']


class BidTemplateSerializer(serializers.ModelSerializer):
    """投标模板序列化器"""

    class Meta:
        model = BidTemplate
        fields = ['id', 'name', 'code', 'template_type', 'content', 'is_active', 'created_at']


class BidSubmissionListSerializer(serializers.ModelSerializer):
    """投标提交列表序列化器"""
    project_name = serializers.CharField(source='project.name', read_only=True)
    bidder_name = serializers.CharField(source='bidder.username', read_only=True)

    class Meta:
        model = BidSubmission
        fields = ['id', 'project', 'project_name', 'bidder', 'bidder_name', 'bid_type', 'bid_price', 'status', 'submitted_at', 'created_at']


class BidSubmissionDetailSerializer(serializers.ModelSerializer):
    """投标提交详情序列化器"""
    project = serializers.StringRelatedField()
    bidder = serializers.StringRelatedField()
    template = serializers.StringRelatedField()

    class Meta:
        model = BidSubmission
        fields = [
            'id', 'project', 'bidder', 'bid_type', 'template', 'bid_price', 'period',
            'payment_terms', 'business_content', 'technical_content', 'status',
            'submitted_at', 'reviewed_at', 'review_comment', 'created_at', 'updated_at'
        ]


class BidSubmissionCreateSerializer(serializers.ModelSerializer):
    """投标提交创建序列化器"""

    class Meta:
        model = BidSubmission
        fields = ['project', 'bid_type', 'template', 'bid_price', 'period', 'payment_terms', 'business_content', 'technical_content']
