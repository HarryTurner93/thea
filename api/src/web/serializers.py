from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Camera, Image

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'

class CameraSerializer(serializers.ModelSerializer):
    image_count = serializers.SerializerMethodField()
    class Meta:
        model = Camera
        fields = '__all__'

    def get_image_count(self, obj):
        return obj.images.count()