from rest_framework import serializers
from .models import Document, DocumentVersion


class DocumentSerializer(serializers.ModelSerializer):
    """文档序列化器"""
    uploader_name = serializers.CharField(source='uploader.username', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = Document
        fields = [
            'id', 'name', 'file', 'file_size', 'file_type', 'doc_type', 'status',
            'project', 'project_name', 'description', 'uploader', 'uploader_name',
            'uploaded_at', 'updated_at'
        ]
        read_only_fields = ['id', 'file_size', 'uploader', 'uploaded_at']


class DocumentVersionSerializer(serializers.ModelSerializer):
    """文档版本序列化器"""
    uploader_name = serializers.CharField(source='uploader.username', read_only=True)

    class Meta:
        model = DocumentVersion
        fields = ['id', 'document', 'version', 'file', 'file_size', 'uploader', 'uploader_name', 'comment', 'uploaded_at']
        read_only_fields = ['id', 'file_size', 'uploader', 'uploaded_at']
