from celery import Celery
import os

from celery import Celery

celery_app = Celery(
    "worker",
    broker="redis://127.0.0.1:6379/0",
    backend="redis://127.0.0.1:6379/0",
)

import app.tasks.document_tasks

celery_app.autodiscover_tasks(["app.tasks", "app.services"])