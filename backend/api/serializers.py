from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from .models import MuscleGroup, Exercise, Routine, RoutineExercise, CompletedWorkout, CompletedExercise, Reminder,FavoriteExercise, ExerciseOfTheDay

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'gender']

class MuscleGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = MuscleGroup
        fields = '__all__'

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'muscle_group', 'description', 'exercise_type']

class RoutineExerciseSerializer(serializers.ModelSerializer):
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)
    exercise_type = serializers.CharField(source='exercise.exercise_type', read_only=True)

    class Meta:
        model = RoutineExercise
        fields = ['id', 'exercise', 'exercise_name', 'exercise_type', 'sets', 'reps', 'duration', 'distance']

class RoutineSerializer(serializers.ModelSerializer):
    exercises = RoutineExerciseSerializer(many=True)

    class Meta:
        model = Routine
        fields = ['id', 'name', 'exercises']

    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises')
        routine = Routine.objects.create(**validated_data)
        for exercise_data in exercises_data:
            RoutineExercise.objects.create(routine=routine, **exercise_data)
        return routine

    def update(self, instance, validated_data):
        exercises_data = validated_data.pop('exercises', [])
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        # Keep track of existing exercises
        existing_exercises = {exercise.id: exercise for exercise in instance.exercises.all()}

        # Update or create exercises
        updated_exercises = []
        for exercise_data in exercises_data:
            exercise_id = exercise_data.get('id')
            if exercise_id and exercise_id in existing_exercises:
                exercise = existing_exercises[exercise_id]
                for attr, value in exercise_data.items():
                    setattr(exercise, attr, value)
                exercise.save()
            else:
                exercise = RoutineExercise.objects.create(routine=instance, **exercise_data)
            updated_exercises.append(exercise)

        # Delete exercises not in the update data
        for exercise in existing_exercises.values():
            if exercise not in updated_exercises:
                exercise.delete()

        return instance

    def validate_exercises(self, value):
        if not value:
            raise serializers.ValidationError("At least one exercise is required.")
        return value



class RoutineDetailSerializer(RoutineSerializer):
    class Meta(RoutineSerializer.Meta):
        fields = RoutineSerializer.Meta.fields + ['created_at']

class CompletedExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompletedExercise
        fields = '__all__'

class CompletedWorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompletedWorkout
        fields = ['id', 'routine', 'started_at', 'completed_at', 'duration', 'calories_burned', 'notes']
        read_only_fields = ['id', 'started_at', 'completed_at']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = '__all__'



class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'gender', 'profile_picture']
        read_only_fields = ['id']
    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return self.context['request'].build_absolute_uri(obj.profile_picture.url)
        return None


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'gender', 'profile_picture']

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.name = validated_data.get('name', instance.name)
        instance.gender = validated_data.get('gender', instance.gender)
        if 'profile_picture' in validated_data:
            instance.profile_picture = validated_data['profile_picture']
        instance.save()
        return instance


class FavoriteExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteExercise
        fields = ['exercise']


class ExerciseOfTheDaySerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer()

    class Meta:
        model = ExerciseOfTheDay
        fields = ['date', 'exercise']


class ProgressSerializer(serializers.Serializer):
    date = serializers.DateField()
    completedExercises = serializers.IntegerField()
    totalWorkoutTime = serializers.IntegerField()
    caloriesBurned = serializers.IntegerField()
