"""Define Celery tasks for the Web App."""

# System Imports
import random
import time

# Third Party
from celery import shared_task

# Application Relative
from .models import Image


@shared_task
def process_image(object_key: str) -> None:
    """Process an image with an ML model and write results to database.

    Parameters:
        object_key: The image name identifying the image in the database.

    """
    time.sleep(5)
    image = Image.objects.get(object_key=object_key)
    image.fox = round(random.random(), 3)
    image.badger = round(random.random(), 3)
    image.cat = round(random.random(), 3)
    image.save()
