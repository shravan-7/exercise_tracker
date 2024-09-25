from django.core.management.base import BaseCommand
from api.models import Exercise
from django.db.models import Count

class Command(BaseCommand):
    help = 'Removes duplicate exercises from the database, keeping the one with a description'

    def handle(self, *args, **options):
        # Get all exercise names that have duplicates
        duplicate_names = Exercise.objects.values('name').annotate(
            name_count=Count('name')
        ).filter(name_count__gt=1).values_list('name', flat=True)

        total_removed = 0

        for name in duplicate_names:
            # Get all exercises with this name
            exercises = Exercise.objects.filter(name=name)

            # Try to find an exercise with a non-empty description
            exercise_with_description = exercises.exclude(description='').first()

            if exercise_with_description:
                # If found, keep this one and delete the rest
                duplicates = exercises.exclude(id=exercise_with_description.id)
            else:
                # If no exercise has a description, keep the first one
                exercise_to_keep = exercises.first()
                duplicates = exercises.exclude(id=exercise_to_keep.id)

            # Count and delete duplicates
            count = duplicates.count()
            duplicates.delete()

            total_removed += count
            self.stdout.write(f"Removed {count} duplicate(s) for exercise: {name}")

        self.stdout.write(self.style.SUCCESS(f"Successfully removed {total_removed} duplicate exercises"))
