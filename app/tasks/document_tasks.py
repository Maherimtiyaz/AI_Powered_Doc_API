from app.core.celery_app import celery_app

@celery_app.task
def add_numbers(x, y):
    print("Task running:", x, y)
    return x + y

print("Task added to queue")