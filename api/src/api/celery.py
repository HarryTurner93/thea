import os
from celery import Celery
from api import settings
from api.config.config import CONFIG

# Create celery application.
CELERY_APP = Celery('project_thea_revamped')

# Load Celery config.
CELERY_APP.conf.update(

    # Base Config
    broker_url=CONFIG.CELERY_URL,
    result_backend = CONFIG.CELERY_URL,
    task_serializer = 'json',
    result_serializer = 'json',
    timezone = "UTC",
    enable_utc = True,
    task_default_queue = "default",
    accept_content = ['application/json'],

    # Enforce Celery to reserve just one task at a time
    task_acks_late = True,
    worker_prefetch_multiplier = 1,
    concurrency = 1,

    # For unit-testing
    task_always_eager = False,
)

@CELERY_APP.task
def life_beat():
    """Testing task for Celery"""
    return "hello from Celery worker"