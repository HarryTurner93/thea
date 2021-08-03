# System Imports
import os

# Third Party
from celery import Celery

# Application Relative
from .config.config import CONFIG

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "api.settings")

# Create celery application.
CELERY_APP = Celery("project_thea_revamped")

# Load Celery config.
CELERY_APP.conf.update(
    # Base Config
    broker_url=CONFIG.CELERY_URL,
    result_backend=CONFIG.CELERY_URL,
    task_serializer="json",
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_default_queue="default",
    accept_content=["application/json"],
    # Enforce Celery to reserve just one task at a time
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    concurrency=1,
    # For unit-testing
    task_always_eager=False,
)

# Load task modules from all registered Django apps.
CELERY_APP.autodiscover_tasks()
