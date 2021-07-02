from django.db import models
from django.contrib.auth.models import User

class Camera(models.Model):
    name = models.CharField(max_length=80, default='')
    latitude = models.FloatField()
    longitude = models.FloatField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Image(models.Model):
    camera = models.ForeignKey(Camera, related_name='images', on_delete=models.CASCADE)
    object_key = models.CharField(max_length=80)
    labels = models.JSONField(default={})


