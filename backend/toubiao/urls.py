"""
URL configuration for toubiao project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # API Schema
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(template_name='swagger-ui.html'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(template_name='redoc.html'), name='redoc'),
    # API Apps
    path('api/users/', include('users.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/bidding/', include('bidding.urls')),
    path('api/documents/', include('documents.urls')),
    path('api/approvals/', include('approvals.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
