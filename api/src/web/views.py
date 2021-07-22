from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status, mixins, generics
from rest_framework.views import APIView
from .models import Camera, Image
from .serializers import CameraSerializer, SingleCameraSerializer, ImageSerializer, UserSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import PermissionDenied, ParseError

from .config.config import CONFIG

# Todo: Add type annotations
# Todo: Add docstrings.
# Todo: Lint

class CameraViewSet(viewsets.ModelViewSet):
    serializer_class = CameraSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Camera.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return CameraSerializer
        return SingleCameraSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(CustomObtainAuthToken, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key, 'id': token.user_id})

@api_view(['GET'])
def get_upload_presigned_url(request):
    response: dict = CONFIG.S3_CLIENT.generate_presigned_post(
        CONFIG.AWS_BUCKET_NAME,
        "OBJECT"
    )
    return Response(response)

class ListImages(mixins.ListModelMixin,
                 mixins.CreateModelMixin,
                 generics.GenericAPIView):

    serializer_class = ImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
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
        return self.create(request, *args, **kwargs)

#def get_queryset(self):
    #    requested_camera_id = self.request.GET.get('camera_id')
    #    cameras_belonging_to_user = list(Camera.objects.filter(user=self.request.user).values_list('pk', flat=True))
    #    print(requested_camera_id, cameras_belonging_to_user)
    #    print(requested_camera_id in cameras_belonging_to_user)
    #    return Image.objects.filter(camera=requested_camera_id)

@api_view(['POST'])
def register_image(request):
    serializer = ImageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        # Todo: Launch an ML celery task to process it.
        import random
        Image.objects.filter(object_key=serializer.data['object_key'])\
            .update(fox=random.random(),
                    cat=random.random(),
                    badger=random.random())
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


