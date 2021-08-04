"""Define Celery tasks for the Web App."""

# System Imports
import tempfile

# Third Party
from api.config.config import CONFIG
from celery import shared_task
from PIL import Image as PImage

# Application Relative
from .ml import input_transform, model, output_transform
from .models import Image


@shared_task
def process_image(object_key: str) -> None:
    """Process an image with an ML model and write results to database.

    Parameters:
        object_key: The image name identifying the image in the database.

    """
    try:
        # Get Image.
        with tempfile.NamedTemporaryFile(mode='w+b') as f:
            CONFIG.S3_CLIENT.download_fileobj('images', object_key, f)

            # Prepare Image for Model.
            image = PImage.open(f.name)
            x = input_transform(image).unsqueeze(0)
            preds = model(x)
            output = output_transform(preds)

            # 0 - Empty, 1 - Fox, 3 - Rodent, 4 - Bird
            empty, fox, rodent, bird = output

            # Write the values to the database.
            image_object = Image.objects.get(object_key=object_key)
            image_object.fox = float(fox)
            image_object.rodent = float(rodent)
            image_object.bird = float(bird)
            image_object.save()

    except Exception as e:
        print(f"Error processing {object_key} with error {e}.")
