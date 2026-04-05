from celery import Celery

celery_app = Celery(
    "worker",
    broker="redis://redis:6379/0"
)

@celery_app.task
def process_doc_task(doc_id):
    print("Processing doc:", doc_id)