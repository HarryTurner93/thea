from rest_framework import viewsets, permissions, status, mixins, generics
from .models import Camera, Image
from .serializers import CameraSerializer, ImageSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ParseError
from rest_framework import filters


# Todo: Add type annotations
# Todo: Add docstrings.
# Todo: Lint

class CameraViewSet(viewsets.ModelViewSet):
    queryset = CameraSerializer
    serializer_class = CameraSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        """Get the cameras that belong to this user."""
        return Camera.objects.filter(user=self.request.user)

class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(CustomObtainAuthToken, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key, 'id': token.user_id})

class ListImages(mixins.ListModelMixin,
                 generics.GenericAPIView):

    serializer_class = ImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['fox', 'badger', 'cat']

    def get_queryset(self):
        """Get the images that belong to the camera if the camera belongs to the user."""
        requested_camera_id = self.request.GET.get('camera_id', None)
        if not requested_camera_id:
            raise ParseError(detail="Missing 'camera_id'")

        cameras_belonging_to_user = list(Camera.objects.filter(user=self.request.user).values_list('pk', flat=True))

        if int(requested_camera_id) not in cameras_belonging_to_user:
             raise PermissionDenied(detail="Not your camera.")

        return Image.objects.filter(camera=requested_camera_id)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # Todo: Launch an ML celery task to process it.
            import random
            Image.objects.filter(object_key=serializer.data['object_key']) \
                .update(fox=random.random(),
                        cat=random.random(),
                        badger=random.random())
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)