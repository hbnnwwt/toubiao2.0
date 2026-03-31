from django.contrib import admin
from .models import Document, DocumentVersion


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['name', 'doc_type', 'status', 'project', 'uploader', 'uploaded_at']
    list_filter = ['doc_type', 'status']
    search_fields = ['name', 'description']
    date_hierarchy = 'uploaded_at'
    ordering = ['-uploaded_at']


@admin.register(DocumentVersion)
class DocumentVersionAdmin(admin.ModelAdmin):
    list_display = ['document', 'version', 'file_size', 'uploader', 'uploaded_at']
    search_fields = ['document__name', 'version']
    date_hierarchy = 'uploaded_at'
    ordering = ['-uploaded_at']
