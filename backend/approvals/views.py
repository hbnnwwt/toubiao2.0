from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import ApprovalFlow, ApprovalNode, ApprovalRecord, ApprovalAction
from .serializers import (
    ApprovalFlowSerializer,
    ApprovalRecordSerializer,
    ApprovalActionSerializer
)


class ApprovalFlowViewSet(viewsets.ModelViewSet):
    """审批流程视图集"""
    queryset = ApprovalFlow.objects.all()
    serializer_class = ApprovalFlowSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['created_at']

    def get_queryset(self):
        return ApprovalFlow.objects.filter(is_active=True)


class ApprovalRecordViewSet(viewsets.ModelViewSet):
    """审批记录视图集"""
    queryset = ApprovalRecord.objects.all()
    serializer_class = ApprovalRecordSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['flow__name']
    ordering_fields = ['submitted_at']

    @action(detail=True, methods=['get'])
    def actions(self, request, pk=None):
        """获取审批记录的操作历史"""
        record = self.get_object()
        actions = record.actions.all()
        serializer = ApprovalActionSerializer(actions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """审批通过"""
        record = self.get_object()
        if record.status != 'pending':
            return Response({'error': '该记录已处理'}, status=400)

        comment = request.data.get('comment', '')

        # 创建审批操作记录
        ApprovalAction.objects.create(
            record=record,
            node=record.current_node,
            approver=request.user,
            action='approve',
            comment=comment
        )

        # 更新记录状态
        record.status = 'approved'
        record.completed_at = timezone.now()
        record.save()

        # 更新投标提交状态
        if record.bid_submission:
            record.bid_submission.status = 'approved'
            record.bid_submission.reviewed_at = timezone.now()
            record.bid_submission.review_comment = comment
            record.bid_submission.save()

        return Response(ApprovalRecordSerializer(record).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """审批驳回"""
        record = self.get_object()
        if record.status != 'pending':
            return Response({'error': '该记录已处理'}, status=400)

        comment = request.data.get('comment', '')

        # 创建审批操作记录
        ApprovalAction.objects.create(
            record=record,
            node=record.current_node,
            approver=request.user,
            action='reject',
            comment=comment
        )

        # 更新记录状态
        record.status = 'rejected'
        record.completed_at = timezone.now()
        record.save()

        # 更新投标提交状态
        if record.bid_submission:
            record.bid_submission.status = 'rejected'
            record.bid_submission.reviewed_at = timezone.now()
            record.bid_submission.review_comment = comment
            record.bid_submission.save()

        return Response(ApprovalRecordSerializer(record).data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """获取待审批的记录"""
        records = ApprovalRecord.objects.filter(status='pending')
        serializer = ApprovalRecordSerializer(records, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_pending(self, request):
        """获取我待审批的记录"""
        records = ApprovalRecord.objects.filter(
            status='pending',
            current_node__approver=request.user
        )
        serializer = ApprovalRecordSerializer(records, many=True)
        return Response(serializer.data)
