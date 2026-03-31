from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Qualification, ProjectCase, TeamMember, BidTemplate, BidSubmission
from .serializers import (
    QualificationSerializer,
    ProjectCaseSerializer,
    TeamMemberSerializer,
    BidTemplateSerializer,
    BidSubmissionListSerializer,
    BidSubmissionDetailSerializer,
    BidSubmissionCreateSerializer
)


class QualificationViewSet(viewsets.ModelViewSet):
    """企业资质视图集"""
    queryset = Qualification.objects.all()
    serializer_class = QualificationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['created_at', 'expire_date']


class ProjectCaseViewSet(viewsets.ModelViewSet):
    """业绩案例视图集"""
    queryset = ProjectCase.objects.all()
    serializer_class = ProjectCaseSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code', 'owner']
    ordering_fields = ['created_at', 'start_date']


class TeamMemberViewSet(viewsets.ModelViewSet):
    """团队人员视图集"""
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'cert_name', 'cert_no']
    ordering_fields = ['created_at']


class BidTemplateViewSet(viewsets.ModelViewSet):
    """投标模板视图集"""
    queryset = BidTemplate.objects.all()
    serializer_class = BidTemplateSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['created_at']

    def get_queryset(self):
        return BidTemplate.objects.filter(is_active=True)


class BidSubmissionViewSet(viewsets.ModelViewSet):
    """投标提交视图集"""
    queryset = BidSubmission.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['project__name', 'bidder__username']
    ordering_fields = ['created_at', 'submitted_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return BidSubmissionListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return BidSubmissionCreateSerializer
        return BidSubmissionDetailSerializer

    def perform_create(self, serializer):
        serializer.save(bidder=self.request.user)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """提交投标"""
        submission = self.get_object()
        if submission.status != 'draft':
            return Response({'error': '只有草稿状态可以提交'}, status=400)

        submission.status = 'submitted'
        submission.submitted_at = timezone.now()
        submission.save()
        return Response(BidSubmissionDetailSerializer(submission).data)

    @action(detail=False, methods=['get'])
    def my_bids(self, request):
        """获取我的投标列表"""
        submissions = BidSubmission.objects.filter(bidder=request.user)
        serializer = BidSubmissionListSerializer(submissions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """获取待审批的投标"""
        submissions = BidSubmission.objects.filter(status='submitted')
        serializer = BidSubmissionListSerializer(submissions, many=True)
        return Response(serializer.data)
