from django.shortcuts import render
from rest_framework import viewsets
from .models import Camera, Image
from .serializers import CameraSerializer, ImageSerializer

class CameraViewSet(viewsets.ModelViewSet):
    queryset = Camera.objects.all()
    serializer_class = CameraSerializer

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer