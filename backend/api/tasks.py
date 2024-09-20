from celery import shared_task
from django.utils import timezone
from .models import Reminder, CompletedExercise, RoutineExercise

@shared_task
def send_reminders():
    now = timezone.now()
    reminders = Reminder.objects.filter(reminder_date__lte=now, is_sent=False)
    for reminder in reminders:
        # Here you would typically send an email or push notification
        print(f"Sending reminder to {reminder.user.email}: {reminder.message}")
        reminder.is_sent = True
        reminder.save()

@shared_task
def create_missed_exercise_reminders():
    yesterday = timezone.now().date() - timezone.timedelta(days=1)
    users = User.objects.all()
    for user in users:
        total_exercises = RoutineExercise.objects.filter(routine__user=user).count()
        completed_exercises = CompletedExercise.objects.filter(user=user, completed_at__date=yesterday).count()
        if completed_exercises < total_exercises:
            Reminder.objects.create(
                user=user,
                message="You missed some exercises yesterday. Don't forget to catch up!",
                reminder_date=timezone.now()
            )


from celery import shared_task

@shared_task
def add(x, y):
    return x + y
