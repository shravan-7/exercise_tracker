from django.core.management.base import BaseCommand
from api.models import MuscleGroup, Exercise

class Command(BaseCommand):
    help = 'Cleans existing exercise and muscle group data and repopulates with a comprehensive list'

    def handle(self, *args, **kwargs):
        # Clean existing data
        self.stdout.write('Cleaning existing data...')
        Exercise.objects.all().delete()
        MuscleGroup.objects.all().delete()

        # Create muscle groups
        self.stdout.write('Creating muscle groups...')
        muscle_groups = {}
        for name in [
            "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Forearms",
            "Quadriceps", "Hamstrings", "Calves", "Glutes", "Abs", "Obliques",
            "Lower Back", "Trapezius", "Cardiovascular", "Full Body"
        ]:
            muscle_groups[name] = MuscleGroup.objects.create(name=name)

        # List of exercises with their muscle groups, types, and descriptions
        exercises = [
            # Chest exercises
            ("Bench Press", "Chest", "Strength", "Lie on a bench and press a barbell upwards from chest level."),
            ("Incline Bench Press", "Chest", "Strength", "Similar to bench press but on an inclined bench to target upper chest."),
            ("Decline Bench Press", "Chest", "Strength", "Bench press on a declined bench to focus on lower chest."),
            ("Push-ups", "Chest", "Bodyweight", "Classic bodyweight exercise, lowering and raising body with arms."),
            ("Dumbbell Flyes", "Chest", "Strength", "Lie on bench, arms outstretched, and bring dumbbells together over chest."),
            ("Cable Crossovers", "Chest", "Strength", "Using cable machine, bring hands together in front of chest."),
            ("Dips", "Chest", "Bodyweight", "Lower and raise body using parallel bars, leaning forward for chest focus."),

            # Back exercises
            ("Pull-ups", "Back", "Bodyweight", "Hang from bar and pull body upwards until chin is over the bar."),
            ("Lat Pulldowns", "Back", "Strength", "Seated exercise, pull a bar down to chest level."),
            ("Bent-over Rows", "Back", "Strength", "Bend at hips, pull weight to lower chest while keeping back straight."),
            ("Deadlifts", "Back", "Strength", "Lift a barbell from the ground to hip level, engaging multiple muscle groups."),
            ("T-Bar Rows", "Back", "Strength", "Bent-over row variation using a T-bar attachment."),
            ("Face Pulls", "Back", "Strength", "Pull rope attachment towards face, focusing on rear deltoids and upper back."),
            ("Chin-ups", "Back", "Bodyweight", "Similar to pull-ups but with palms facing you, engaging biceps more."),

            # Shoulder exercises
            ("Overhead Press", "Shoulders", "Strength", "Press a barbell or dumbbells overhead from shoulder level."),
            ("Lateral Raises", "Shoulders", "Strength", "Raise dumbbells to sides until arms are parallel with ground."),
            ("Front Raises", "Shoulders", "Strength", "Raise dumbbells in front of body to shoulder height."),
            ("Reverse Flyes", "Shoulders", "Strength", "Bend forward and raise dumbbells to sides, targeting rear deltoids."),
            ("Shrugs", "Shoulders", "Strength", "Lift shoulders towards ears while holding weights."),
            ("Arnold Press", "Shoulders", "Strength", "Rotating dumbbell press, starting with palms facing body."),

            # Biceps exercises
            ("Barbell Curls", "Biceps", "Strength", "Curl a barbell from waist to shoulder level."),
            ("Dumbbell Curls", "Biceps", "Strength", "Curl dumbbells one at a time or simultaneously."),
            ("Hammer Curls", "Biceps", "Strength", "Dumbbell curls with palms facing each other."),
            ("Preacher Curls", "Biceps", "Strength", "Curls performed with upper arms resting on a bench."),
            ("Concentration Curls", "Biceps", "Strength", "Seated single-arm curl with elbow braced against inner thigh."),

            # Triceps exercises
            ("Tricep Pushdowns", "Triceps", "Strength", "Push cable attachment down using triceps."),
            ("Skull Crushers", "Triceps", "Strength", "Lie on bench, lower weight to forehead, then extend arms."),
            ("Overhead Tricep Extensions", "Triceps", "Strength", "Extend weight overhead using triceps."),
            ("Dips", "Triceps", "Bodyweight", "Lower and raise body on parallel bars, keeping body upright for tricep focus."),
            ("Close-grip Bench Press", "Triceps", "Strength", "Bench press with hands closer together to target triceps."),

            # Forearm exercises
            ("Wrist Curls", "Forearms", "Strength", "Curl wrist upwards while holding weight with palms up."),
            ("Reverse Wrist Curls", "Forearms", "Strength", "Curl wrist upwards with palms facing down."),
            ("Farmer's Walk", "Forearms", "Strength", "Walk while carrying heavy weights in each hand."),

            # Leg exercises
            ("Squats", "Quadriceps", "Strength", "Lower body by bending knees and hips, then stand back up."),
            ("Leg Press", "Quadriceps", "Strength", "Push weight away using legs while seated on machine."),
            ("Lunges", "Quadriceps", "Bodyweight", "Step forward into a lunge position, alternating legs."),
            ("Leg Extensions", "Quadriceps", "Strength", "Extend legs to straighten knees while seated on machine."),
            ("Romanian Deadlifts", "Hamstrings", "Strength", "Hinge at hips with slight knee bend, lowering weight along legs."),
            ("Leg Curls", "Hamstrings", "Strength", "Curl legs towards buttocks while lying face down on machine."),
            ("Calf Raises", "Calves", "Strength", "Raise heels off ground while standing."),
            ("Hip Thrusts", "Glutes", "Strength", "Thrust hips upward while upper back rests on a bench."),

            # Ab exercises
            ("Crunches", "Abs", "Bodyweight", "Lie on back and curl upper body towards knees."),
            ("Planks", "Abs", "Bodyweight", "Hold body in straight line, supported by forearms and toes."),
            ("Russian Twists", "Obliques", "Bodyweight", "Seated twist, moving weight from side to side."),
            ("Leg Raises", "Abs", "Bodyweight", "Lie on back and raise legs towards ceiling."),
            ("Ab Wheel Rollouts", "Abs", "Bodyweight", "Kneel and roll wheel forward, then back, keeping core tight."),

            # Lower back exercises
            ("Hyperextensions", "Lower Back", "Bodyweight", "Extend lower back while lying face down on hyperextension bench."),
            ("Good Mornings", "Lower Back", "Strength", "Bend at hips with weight on shoulders, keeping back straight."),

            # Trapezius exercises
            ("Barbell Shrugs", "Trapezius", "Strength", "Shrug shoulders while holding a barbell."),
            ("Upright Rows", "Trapezius", "Strength", "Pull barbell or dumbbells vertically close to body."),

            # Cardiovascular exercises
            ("Running", "Cardiovascular", "Cardio", "Continuous running at a steady pace."),
            ("Cycling", "Cardiovascular", "Cardio", "Riding a bicycle or stationary bike."),
            ("Swimming", "Cardiovascular", "Cardio", "Full-body workout in water using various strokes."),
            ("Jumping Rope", "Cardiovascular", "Cardio", "Skipping rope for cardiovascular endurance."),
            ("Rowing", "Cardiovascular", "Cardio", "Using a rowing machine for full-body cardio."),
            ("Elliptical", "Cardiovascular", "Cardio", "Low-impact cardio on an elliptical machine."),
            ("Stair Climbing", "Cardiovascular", "Cardio", "Climbing stairs or using a stair-climbing machine."),

            # Full body exercises
            ("Burpees", "Full Body", "Bodyweight", "Combination of squat thrust and jump, engaging entire body."),
            ("Mountain Climbers", "Full Body", "Bodyweight", "Alternating knee drives in plank position."),
            ("Thrusters", "Full Body", "Strength", "Combination of front squat and overhead press."),
            ("Turkish Get-ups", "Full Body", "Strength", "Complex movement from lying to standing while holding weight overhead."),

            # Flexibility exercises
            ("Yoga", "Full Body", "Flexibility", "Series of postures and breathing exercises for flexibility and mindfulness."),
            ("Pilates", "Full Body", "Flexibility", "Low-impact exercises focusing on core strength and flexibility."),
            ("Static Stretching", "Full Body", "Flexibility", "Holding stretches for extended periods to improve flexibility."),
            ("Dynamic Stretching", "Full Body", "Flexibility", "Active movements to improve range of motion and prepare for exercise."),

            # Plyometric exercises
            ("Box Jumps", "Full Body", "Plyometric", "Explosive jumps onto a raised platform."),
            ("Jump Squats", "Full Body", "Plyometric", "Explosive jumps from squat position."),
            ("Plyo Push-ups", "Full Body", "Plyometric", "Explosive push-ups where hands leave the ground."),

            # Olympic lifts
            ("Clean and Jerk", "Full Body", "Strength", "Two-part lift: pulling barbell to shoulders, then overhead."),
            ("Snatch", "Full Body", "Strength", "Single motion lift of barbell from ground to overhead."),

            # Functional fitness
            ("Kettlebell Swings", "Full Body", "Strength", "Swinging kettlebell using hip hinge movement."),
            ("Battle Ropes", "Full Body", "Strength", "Creating waves with heavy ropes for full-body workout."),
            ("Sled Pushes", "Full Body", "Strength", "Pushing a weighted sled across a distance."),
            ("Tire Flips", "Full Body", "Strength", "Flipping a large, heavy tire for explosive strength."),
        ]
        # Create exercises
        self.stdout.write('Creating exercises...')
        for name, muscle_group, exercise_type, description in exercises:
            Exercise.objects.create(
                name=name,
                muscle_group=muscle_groups[muscle_group],
                exercise_type=exercise_type,
                description=description
            )

        self.stdout.write(self.style.SUCCESS(f'Successfully populated {len(exercises)} exercises with descriptions'))
