from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApprovalFlowViewSet, ApprovalRecordViewSet

router = DefaultRouter()
router.register(r'flows', ApprovalFlowViewSet, basename='approval-flow')
router.register(r'records', ApprovalRecordViewSet, basename='approval-record')

urlpatterns = [
    path('', include(router.urls)),
]
