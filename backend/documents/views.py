from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Document, DocumentVersion
from .serializers import DocumentSerializer, DocumentVersionSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    """文档视图集"""
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['uploaded_at']

    def perform_create(self, serializer):
        file = self.request.FILES.get('file')
        if file:
            serializer.save(
                uploader=self.request.user,
                file_size=file.size,
                file_type=file.content_type
            )
        else:
            serializer.save(uploader=self.request.user)

    @action(detail=False, methods=['get'])
    def by_project(self, request):
        """获取项目关联的文档"""
        project_id = request.query_params.get('project_id')
        if not project_id:
            return Response({'error': '需要project_id参数'}, status=400)

        documents = Document.objects.filter(project_id=project_id)
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_documents(self, request):
        """获取我上传的文档"""
        documents = Document.objects.filter(uploader=request.user)
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)


class DocumentVersionViewSet(viewsets.ModelViewSet):
    """文档版本视图集"""
    queryset = DocumentVersion.objects.all()
    serializer_class = DocumentVersionSerializer
    ordering_fields = ['uploaded_at']

    def get_queryset(self):
        document_id = self.request.query_params.get('document_id')
        if document_id:
            return DocumentVersion.objects.filter(document_id=document_id)
        return DocumentVersion.objects.none()
