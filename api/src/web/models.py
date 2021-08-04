from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class Camera(models.Model):
    name = models.CharField(max_length=80, default="")
    latitude = models.FloatField()
    longitude = models.FloatField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.latitude}, {self.longitude})"


class Image(models.Model):
    camera = models.ForeignKey(Camera, related_name="images", on_delete=models.CASCADE)
    object_key = models.CharField(max_length=80, primary_key=True)
    fox = models.FloatField(default=-1.0)
    rodent = models.FloatField(default=-1.0)
    bird = models.FloatField(default=-1.0)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance, created, **kwargs):
    if created:
        Token.objects.create(user=instance)
