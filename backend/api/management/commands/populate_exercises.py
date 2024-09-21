from django.core.management.base import BaseCommand
from api.models import MuscleGroup, Exercise

class Command(BaseCommand):
    help = 'Populates the database with initial exercises'

    def handle(self, *args, **kwargs):
        # Create muscle groups
        chest = MuscleGroup.objects.create(name="Chest")
        legs = MuscleGroup.objects.create(name="Legs")
        back = MuscleGroup.objects.create(name="Back")
        shoulders = MuscleGroup.objects.create(name="Shoulders")
        arms = MuscleGroup.objects.create(name="Arms")
        core = MuscleGroup.objects.create(name="Core")

        # Create exercises
        Exercise.objects.create(name="Push-ups", muscle_group=chest, exercise_type="Bodyweight")
        Exercise.objects.create(name="Bench Press", muscle_group=chest, exercise_type="Strength")
        Exercise.objects.create(name="Squats", muscle_group=legs, exercise_type="Strength")
        Exercise.objects.create(name="Lunges", muscle_group=legs, exercise_type="Bodyweight")
        Exercise.objects.create(name="Pull-ups", muscle_group=back, exercise_type="Bodyweight")
        Exercise.objects.create(name="Deadlifts", muscle_group=back, exercise_type="Strength")
        Exercise.objects.create(name="Shoulder Press", muscle_group=shoulders, exercise_type="Strength")
        Exercise.objects.create(name="Bicep Curls", muscle_group=arms, exercise_type="Strength")
        Exercise.objects.create(name="Tricep Extensions", muscle_group=arms, exercise_type="Strength")
        Exercise.objects.create(name="Plank", muscle_group=core, exercise_type="Bodyweight")
        Exercise.objects.create(name="Running", muscle_group=legs, exercise_type="Cardio")
        Exercise.objects.create(name="Jumping Jacks", muscle_group=legs, exercise_type="Cardio")
        Exercise.objects.create(name="Yoga", muscle_group=core, exercise_type="Flexibility")

        self.stdout.write(self.style.SUCCESS('Successfully populated exercises'))
