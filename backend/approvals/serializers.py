from rest_framework import serializers
from .models import ApprovalFlow, ApprovalNode, ApprovalRecord, ApprovalAction
from bidding.serializers import BidSubmissionListSerializer


class ApprovalNodeSerializer(serializers.ModelSerializer):
    """审批节点序列化器"""
    approver_name = serializers.CharField(source='approver.username', read_only=True)

    class Meta:
        model = ApprovalNode
        fields = ['id', 'name', 'order', 'approver_role', 'approver', 'approver_name', 'is_required']


class ApprovalFlowSerializer(serializers.ModelSerializer):
    """审批流程序列化器"""
    nodes = ApprovalNodeSerializer(many=True, read_only=True)

    class Meta:
        model = ApprovalFlow
        fields = ['id', 'name', 'code', 'flow_type', 'description', 'is_active', 'nodes', 'created_at']


class ApprovalRecordSerializer(serializers.ModelSerializer):
    """审批记录序列化器"""
    flow_name = serializers.CharField(source='flow.name', read_only=True)
    submitted_by_name = serializers.CharField(source='submitted_by.username', read_only=True)
    current_node_name = serializers.CharField(source='current_node.name', read_only=True)
    bid_submission = BidSubmissionListSerializer(read_only=True)

    class Meta:
        model = ApprovalRecord
        fields = [
            'id', 'flow', 'flow_name', 'bid_submission', 'current_node', 'current_node_name',
            'status', 'submitted_by', 'submitted_by_name', 'submitted_at', 'completed_at'
        ]


class ApprovalActionSerializer(serializers.ModelSerializer):
    """审批操作序列化器"""
    approver_name = serializers.CharField(source='approver.username', read_only=True)
    node_name = serializers.CharField(source='node.name', read_only=True)

    class Meta:
        model = ApprovalAction
        fields = ['id', 'record', 'node', 'node_name', 'approver', 'approver_name', 'action', 'comment', 'created_at']
