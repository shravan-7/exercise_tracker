from django.core.management.base import BaseCommand
from api.models import MuscleGroup, Exercise

class Command(BaseCommand):
    help = 'Populates the database with a comprehensive list of exercises'

    def handle(self, *args, **kwargs):
        # Create muscle groups
        muscle_groups = {
            "Chest": MuscleGroup.objects.create(name="Chest"),
            "Back": MuscleGroup.objects.create(name="Back"),
            "Shoulders": MuscleGroup.objects.create(name="Shoulders"),
            "Biceps": MuscleGroup.objects.create(name="Biceps"),
            "Triceps": MuscleGroup.objects.create(name="Triceps"),
            "Forearms": MuscleGroup.objects.create(name="Forearms"),
            "Quadriceps": MuscleGroup.objects.create(name="Quadriceps"),
            "Hamstrings": MuscleGroup.objects.create(name="Hamstrings"),
            "Calves": MuscleGroup.objects.create(name="Calves"),
            "Glutes": MuscleGroup.objects.create(name="Glutes"),
            "Abs": MuscleGroup.objects.create(name="Abs"),
            "Obliques": MuscleGroup.objects.create(name="Obliques"),
            "Lower Back": MuscleGroup.objects.create(name="Lower Back"),
            "Trapezius": MuscleGroup.objects.create(name="Trapezius"),
            "Cardiovascular": MuscleGroup.objects.create(name="Cardiovascular"),
            "Full Body": MuscleGroup.objects.create(name="Full Body"),
        }

        # List of exercises with their muscle groups and types
        exercises = [
            # Chest exercises
            ("Bench Press", "Chest", "Strength"),
            ("Incline Bench Press", "Chest", "Strength"),
            ("Decline Bench Press", "Chest", "Strength"),
            ("Push-ups", "Chest", "Bodyweight"),
            ("Dumbbell Flyes", "Chest", "Strength"),
            ("Cable Crossovers", "Chest", "Strength"),
            ("Dips", "Chest", "Bodyweight"),

            # Back exercises
            ("Pull-ups", "Back", "Bodyweight"),
            ("Lat Pulldowns", "Back", "Strength"),
            ("Bent-over Rows", "Back", "Strength"),
            ("Deadlifts", "Back", "Strength"),
            ("T-Bar Rows", "Back", "Strength"),
            ("Face Pulls", "Back", "Strength"),
            ("Chin-ups", "Back", "Bodyweight"),

            # Shoulder exercises
            ("Overhead Press", "Shoulders", "Strength"),
            ("Lateral Raises", "Shoulders", "Strength"),
            ("Front Raises", "Shoulders", "Strength"),
            ("Reverse Flyes", "Shoulders", "Strength"),
            ("Shrugs", "Shoulders", "Strength"),
            ("Arnold Press", "Shoulders", "Strength"),

            # Biceps exercises
            ("Barbell Curls", "Biceps", "Strength"),
            ("Dumbbell Curls", "Biceps", "Strength"),
            ("Hammer Curls", "Biceps", "Strength"),
            ("Preacher Curls", "Biceps", "Strength"),
            ("Concentration Curls", "Biceps", "Strength"),

            # Triceps exercises
            ("Tricep Pushdowns", "Triceps", "Strength"),
            ("Skull Crushers", "Triceps", "Strength"),
            ("Overhead Tricep Extensions", "Triceps", "Strength"),
            ("Dips", "Triceps", "Bodyweight"),
            ("Close-grip Bench Press", "Triceps", "Strength"),

            # Forearm exercises
            ("Wrist Curls", "Forearms", "Strength"),
            ("Reverse Wrist Curls", "Forearms", "Strength"),
            ("Farmer's Walk", "Forearms", "Strength"),

            # Leg exercises
            ("Squats", "Quadriceps", "Strength"),
            ("Leg Press", "Quadriceps", "Strength"),
            ("Lunges", "Quadriceps", "Bodyweight"),
            ("Leg Extensions", "Quadriceps", "Strength"),
            ("Romanian Deadlifts", "Hamstrings", "Strength"),
            ("Leg Curls", "Hamstrings", "Strength"),
            ("Calf Raises", "Calves", "Strength"),
            ("Hip Thrusts", "Glutes", "Strength"),

            # Ab exercises
            ("Crunches", "Abs", "Bodyweight"),
            ("Planks", "Abs", "Bodyweight"),
            ("Russian Twists", "Obliques", "Bodyweight"),
            ("Leg Raises", "Abs", "Bodyweight"),
            ("Ab Wheel Rollouts", "Abs", "Bodyweight"),

            # Lower back exercises
            ("Hyperextensions", "Lower Back", "Bodyweight"),
            ("Good Mornings", "Lower Back", "Strength"),

            # Trapezius exercises
            ("Barbell Shrugs", "Trapezius", "Strength"),
            ("Upright Rows", "Trapezius", "Strength"),

            # Cardiovascular exercises
            ("Running", "Cardiovascular", "Cardio"),
            ("Cycling", "Cardiovascular", "Cardio"),
            ("Swimming", "Cardiovascular", "Cardio"),
            ("Jumping Rope", "Cardiovascular", "Cardio"),
            ("Rowing", "Cardiovascular", "Cardio"),
            ("Elliptical", "Cardiovascular", "Cardio"),
            ("Stair Climbing", "Cardiovascular", "Cardio"),

            # Full body exercises
            ("Burpees", "Full Body", "Bodyweight"),
            ("Mountain Climbers", "Full Body", "Bodyweight"),
            ("Thrusters", "Full Body", "Strength"),
            ("Turkish Get-ups", "Full Body", "Strength"),

            # Flexibility exercises
            ("Yoga", "Full Body", "Flexibility"),
            ("Pilates", "Full Body", "Flexibility"),
            ("Static Stretching", "Full Body", "Flexibility"),
            ("Dynamic Stretching", "Full Body", "Flexibility"),

            # Plyometric exercises
            ("Box Jumps", "Full Body", "Plyometric"),
            ("Jump Squats", "Full Body", "Plyometric"),
            ("Plyo Push-ups", "Full Body", "Plyometric"),

            # Olympic lifts
            ("Clean and Jerk", "Full Body", "Strength"),
            ("Snatch", "Full Body", "Strength"),

            # Functional fitness
            ("Kettlebell Swings", "Full Body", "Strength"),
            ("Battle Ropes", "Full Body", "Strength"),
            ("Sled Pushes", "Full Body", "Strength"),
            ("Tire Flips", "Full Body", "Strength"),
        ]

        # Create exercises
        for name, muscle_group, exercise_type in exercises:
            Exercise.objects.create(
                name=name,
                muscle_group=muscle_groups[muscle_group],
                exercise_type=exercise_type
            )

        self.stdout.write(self.style.SUCCESS(f'Successfully populated {len(exercises)} exercises'))
