from django.core.management.base import BaseCommand
from api.models import MuscleGroup, Exercise
from django.db.models import Count, Min

class Command(BaseCommand):
    help = 'Removes duplicate muscle groups from the database, keeping the one with the lowest ID'

    def handle(self, *args, **options):
        # Get all muscle group names that have duplicates
        duplicate_names = MuscleGroup.objects.values('name').annotate(
            name_count=Count('name')
        ).filter(name_count__gt=1).values_list('name', flat=True)

        total_removed = 0

        for name in duplicate_names:
            # Get all muscle groups with this name
            muscle_groups = MuscleGroup.objects.filter(name=name)

            # Find the muscle group with the lowest ID
            muscle_group_to_keep = muscle_groups.order_by('id').first()

            # Get the duplicates (excluding the one to keep)
            duplicates = muscle_groups.exclude(id=muscle_group_to_keep.id)

            # Update exercises that use the duplicate muscle groups
            for duplicate in duplicates:
                Exercise.objects.filter(muscle_group=duplicate).update(muscle_group=muscle_group_to_keep)

            # Count and delete duplicates
            count = duplicates.count()
            duplicates.delete()

            total_removed += count
            self.stdout.write(f"Removed {count} duplicate(s) for muscle group: {name}")

        self.stdout.write(self.style.SUCCESS(f"Successfully removed {total_removed} duplicate muscle groups"))
