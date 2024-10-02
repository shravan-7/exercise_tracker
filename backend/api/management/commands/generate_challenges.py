from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import WorkoutChallenge, Exercise
from datetime import timedelta
import random

class Command(BaseCommand):
    help = 'Generates workout challenges based on exercise types'

    def handle(self, *args, **kwargs):
        exercise_types = ['Strength', 'Cardio', 'Flexibility', 'Balance', 'Plyometric', 'Bodyweight']

        for exercise_type in exercise_types:
            exercises = Exercise.objects.filter(exercise_type=exercise_type)

            if exercises.exists():
                challenge_name = f"{exercise_type} Challenge"
                description = f"A 30-day challenge focusing on {exercise_type.lower()} exercises to improve your overall fitness."
                start_date = timezone.now().date()
                end_date = start_date + timedelta(days=30)
                goal = random.randint(15, 25)
                difficulty = random.choice(['Easy', 'Medium', 'Hard'])

                challenge = WorkoutChallenge.objects.create(
                    name=challenge_name,
                    description=description,
                    start_date=start_date,
                    end_date=end_date,
                    goal=goal,
                    difficulty=difficulty,
                    exercise_type=exercise_type
                )

                selected_exercises = random.sample(list(exercises), min(5, exercises.count()))
                challenge.exercises.set(selected_exercises)

                self.stdout.write(self.style.SUCCESS(f'Successfully created {challenge_name}'))

        self.stdout.write(self.style.SUCCESS('Finished generating challenges'))
