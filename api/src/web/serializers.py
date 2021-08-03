# Third Party
from django.contrib.auth.models import User
from rest_framework import serializers

# Application Relative
from .models import Camera, Image


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class ImageSerializer(serializers.ModelSerializer):
    waiting = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = "__all__"

    def get_waiting(self, obj):
        return any([obj.fox == 0, obj.badger == 0, obj.cat == 0])


class CameraSerializer(serializers.ModelSerializer):
    image_count = serializers.SerializerMethodField()

    class Meta:
        model = Camera
        fields = "__all__"

    def get_image_count(self, obj) -> int:
        return obj.images.count()
