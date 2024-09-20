from django.db import models
from django.contrib.auth.models import User

class MuscleGroup(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

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
        return self.name

class Routine(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s {self.name}"

class RoutineExercise(models.Model):
    EXERCISE_TYPES = [
        ('Strength', 'Strength'),
        ('Cardio', 'Cardio'),
        ('Flexibility', 'Flexibility'),
        ('Balance', 'Balance'),
        ('Plyometric', 'Plyometric'),
        ('Bodyweight', 'Bodyweight'),
    ]

    routine = models.ForeignKey(Routine, related_name='exercises', on_delete=models.CASCADE)
    exercise_type = models.CharField(max_length=20, choices=EXERCISE_TYPES)  # Changed from 'type' to 'exercise_type'
    sets = models.IntegerField(null=True, blank=True)
    reps = models.IntegerField(null=True, blank=True)
    duration = models.IntegerField(null=True, blank=True)
    distance = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.exercise_type} exercise in {self.routine.name}"

class CompletedExercise(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} completed {self.exercise.name}"

class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=200)
    reminder_date = models.DateTimeField()

    def __str__(self):
        return f"Reminder for {self.user.username}: {self.message}"
