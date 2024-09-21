from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from .models import MuscleGroup, Exercise, Routine, RoutineExercise, CompletedWorkout, CompletedExercise, Reminder

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'confirm_password', 'name', 'gender')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        validated_data['password'] = make_password(validated_data.get('password'))
        return User.objects.create(**validated_data)


    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data.get('password'))
        return super(UserSerializer, self).update(instance, validated_data)

class MuscleGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = MuscleGroup
        fields = '__all__'

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'muscle_group', 'description', 'exercise_type']

class RoutineExerciseSerializer(serializers.ModelSerializer):
    exercise = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all())

    class Meta:
        model = RoutineExercise
        fields = ['id', 'exercise', 'sets', 'reps', 'duration', 'distance']

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





class RoutineDetailSerializer(RoutineSerializer):
    is_owner = serializers.SerializerMethodField()

    class Meta(RoutineSerializer.Meta):
        fields = RoutineSerializer.Meta.fields + ['is_owner']

    def get_is_owner(self, obj):
        request = self.context.get('request')
        return request and request.user == obj.user

class CompletedExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompletedExercise
        fields = '__all__'

class CompletedWorkoutSerializer(serializers.ModelSerializer):
    completed_exercises = CompletedExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = CompletedWorkout
        fields = ['id', 'routine', 'started_at', 'completed_at', 'duration', 'notes', 'completed_exercises']

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
