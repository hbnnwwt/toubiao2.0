from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    QualificationViewSet,
    ProjectCaseViewSet,
    TeamMemberViewSet,
    BidTemplateViewSet,
    BidSubmissionViewSet
)

router = DefaultRouter()
router.register(r'qualifications', QualificationViewSet, basename='qualification')
router.register(r'cases', ProjectCaseViewSet, basename='project-case')
router.register(r'members', TeamMemberViewSet, basename='team-member')
router.register(r'templates', BidTemplateViewSet, basename='bid-template')
router.register(r'submissions', BidSubmissionViewSet, basename='bid-submission')

urlpatterns = [
    path('', include(router.urls)),
]
