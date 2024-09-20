import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exercise_tracker.settings')

# Create the Celery app instance
app = Celery('exercise_tracker')

# Load configuration from Django settings using the 'CELERY' namespace.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Automatically discover tasks.py files in installed apps
app.autodiscover_tasks()

# Simple debug task for testing
@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
