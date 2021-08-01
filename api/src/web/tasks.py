
from celery import shared_task
from .models import Image
import random
import time

@shared_task
def process_image(object_key: str):
    time.sleep(5)
    image = Image.objects.get(object_key=object_key)
    image.fox = round(random.random(), 3)
    image.badger = round(random.random(), 3)
    image.cat = round(random.random(), 3)
    image.save()