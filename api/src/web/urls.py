# Third Party
from django.conf.urls import url
from django.urls import include, path
from rest_framework.routers import DefaultRouter

# Application Relative
from .views import CameraViewSet, CustomObtainAuthToken, ListImages

router = DefaultRouter()
router.register("cameras", CameraViewSet, basename="Camera")

urlpatterns = [
    path("", include(router.urls)),
    url(r"^api-token-auth/", CustomObtainAuthToken.as_view()),
    url(r"^images/", ListImages.as_view()),
]
