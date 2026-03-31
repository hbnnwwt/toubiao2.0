from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ProjectCategory, Project, ProjectRisk
from .serializers import (
    ProjectCategorySerializer,
    ProjectListSerializer,
    ProjectDetailSerializer,
    ProjectCreateSerializer,
    ProjectRiskSerializer
)


class ProjectCategoryViewSet(viewsets.ModelViewSet):
    """项目分类视图集"""
    queryset = ProjectCategory.objects.all()
    serializer_class = ProjectCategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'created_at']


class ProjectViewSet(viewsets.ModelViewSet):
    """项目视图集"""
    queryset = Project.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code', 'bidder', 'description']
    ordering_fields = ['created_at', 'deadline', 'budget']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return ProjectCreateSerializer
        return ProjectDetailSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get'])
    def risks(self, request, pk=None):
        """获取项目风险列表"""
        project = self.get_object()
        risks = project.risks.all()
        serializer = ProjectRiskSerializer(risks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_risk(self, request, pk=None):
        """添加项目风险"""
        project = self.get_object()
        serializer = ProjectRiskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    @action(detail=False, methods=['get'])
    def bidding(self, request):
        """获取招标中项目列表"""
        projects = Project.objects.filter(status='bidding')
        serializer = ProjectListSerializer(projects, many=True)
        return Response(serializer.data)
