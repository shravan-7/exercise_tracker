from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from cloudinary.models import CloudinaryField

class User(AbstractUser):
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10,
    choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    profile_picture = CloudinaryField('image', null=True, blank=True)

    def __str__(self):
        return self.username

class MuscleGroup(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return str(self.name)

class Exercise(models.Model):
    EXERCISE_TYPES = [
        ('Strength', 'Strength'),
        ('Cardio', 'Cardio'),
        ('Flexibility', 'Flexibility'),
        ('Balance', 'Balance'),
        ('Plyometric', 'Plyometric'),
        ('Bodyweight', 'Bodyweight'),
    ]

    name = models.CharField(max_length=100)
    muscle_group = models.ForeignKey(MuscleGroup, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    exercise_type = models.CharField(max_length=20, choices=EXERCISE_TYPES)

    def __str__(self):
        return str(self.name)



class Routine(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='routines')
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s {self.name}"


class RoutineExercise(models.Model):
    routine = models.ForeignKey(Routine, related_name='exercises', on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.IntegerField(null=True, blank=True)
    reps = models.IntegerField(null=True, blank=True)
    duration = models.IntegerField(null=True, blank=True)  # in minutes
    distance = models.FloatField(null=True, blank=True)  # in km

    def __str__(self):
        return f"{self.exercise.name} in {self.routine.name}"

class CompletedWorkout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(default=timezone.now)  # Add default here
    duration = models.DurationField(null=True, blank=True)
    calories_burned = models.IntegerField(default=0)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username}'s {self.routine.name} on {self.started_at.strftime('%Y-%m-%d')}"

class CompletedExercise(models.Model):
    completed_workout = models.ForeignKey(CompletedWorkout, related_name='completed_exercises', on_delete=models.CASCADE)
    routine_exercise = models.ForeignKey(RoutineExercise, on_delete=models.CASCADE)
    sets_completed = models.IntegerField(null=True, blank=True)
    reps_completed = models.IntegerField(null=True, blank=True)
    duration_completed = models.IntegerField(null=True, blank=True)  # in minutes
    distance_completed = models.FloatField(null=True, blank=True)  # in km
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.routine_exercise.exercise.name} in {self.completed_workout}"

class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE)
    reminder_time = models.DateTimeField()
    message = models.CharField(max_length=200)
    is_sent = models.BooleanField(default=False)

    def __str__(self):
        return f"Reminder for {self.user.username}: {self.routine.name}"


class FavoriteExercise(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'exercise')

class ExerciseOfTheDay(models.Model):
    date = models.DateField(unique=True)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.date}: {self.exercise.name}"


class WorkoutChallenge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    goal = models.IntegerField()
    exercises = models.ManyToManyField('Exercise')
    difficulty = models.CharField(max_length=20, choices=[('Easy', 'Easy'), ('Medium', 'Medium'), ('Hard', 'Hard')])
    image_url = models.URLField(blank=True, null=True)
    exercise_type = models.CharField(
        max_length=20,
        choices=[
            ('Strength', 'Strength'),
            ('Cardio', 'Cardio'),
            ('Flexibility', 'Flexibility'),
            ('Balance', 'Balance'),
            ('Plyometric', 'Plyometric'),
            ('Bodyweight', 'Bodyweight'),
        ],
        default='Strength'  # Added default value
    )

    def __str__(self):
        return self.name

class UserChallenge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(WorkoutChallenge, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    joined_date = models.DateTimeField(default=timezone.now)
    last_updated = models.DateTimeField(auto_now=True)  # Add this line

    class Meta:
        unique_together = ('user', 'challenge')

    def __str__(self):
        return f"{self.user.username}'s progress on {self.challenge.name}"
class UserChallengeExercise(models.Model):
    user_challenge = models.ForeignKey(UserChallenge, on_delete=models.CASCADE, related_name='exercise_progress')
    exercise = models.ForeignKey('Exercise', on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    completed_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user_challenge', 'exercise')
