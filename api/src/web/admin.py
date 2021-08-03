# Third Party
from django.contrib import admin

# Application Relative
from .models import Camera, Image

# Register your models here.
admin.site.register(Camera)
admin.site.register(Image)
