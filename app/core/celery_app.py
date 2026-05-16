# Celery has been removed — not needed for the current architecture.
# Document processing runs synchronously via the /docs/upload endpoint.
# If background tasks are needed later, consider FastAPI BackgroundTasks
# or re-add Celery with a managed Redis instance.