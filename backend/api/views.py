from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, get_user_model
from rest_framework.authtoken.models import Token
from .models import MuscleGroup, Exercise, Routine, RoutineExercise, CompletedWorkout, FavoriteExercise, ExerciseOfTheDay,CompletedExercise, Reminder
from .serializers import (
    UserSerializer, MuscleGroupSerializer, ExerciseSerializer,
    RoutineSerializer, RoutineExerciseSerializer, CompletedExerciseSerializer,
    ReminderSerializer, RoutineDetailSerializer, CompletedWorkoutSerializer,UserProfileSerializer, UserProfileUpdateSerializer,
    RoutineDetailSerializer,FavoriteExerciseSerializer, ExerciseOfTheDaySerializer


)
from django.views.decorators.csrf import csrf_exempt
User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class MuscleGroupViewSet(viewsets.ModelViewSet):
    queryset = MuscleGroup.objects.all()
    serializer_class = MuscleGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        exercises = self.get_queryset()
        serializer = self.get_serializer(exercises, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def favorites(self, request):
        favorite_exercises = FavoriteExercise.objects.filter(user=request.user).values_list('exercise', flat=True)
        return Response(favorite_exercises)

    @action(detail=False, methods=['POST'])
    def toggle_favorite(self, request):
        exercise_id = request.data.get('exercise_id')
        try:
            exercise = Exercise.objects.get(id=exercise_id)
        except Exercise.DoesNotExist:
            return Response({'error': 'Exercise not found'}, status=status.HTTP_404_NOT_FOUND)

        favorite, created = FavoriteExercise.objects.get_or_create(user=request.user, exercise=exercise)
        if not created:
            favorite.delete()

        favorite_exercises = FavoriteExercise.objects.filter(user=request.user).values_list('exercise', flat=True)
        return Response(favorite_exercises)

class ExerciseOfTheDayViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ExerciseOfTheDay.objects.all()
    serializer_class = ExerciseOfTheDaySerializer

    @action(detail=False, methods=['GET'])
    def today(self, request):
        today = timezone.now().date()
        try:
            exercise_of_the_day = ExerciseOfTheDay.objects.get(date=today)
        except ExerciseOfTheDay.DoesNotExist:
            # If there's no exercise for today, create one randomly
            random_exercise = Exercise.objects.order_by('?').first()
            exercise_of_the_day = ExerciseOfTheDay.objects.create(date=today, exercise=random_exercise)

        serializer = self.get_serializer(exercise_of_the_day)
        return Response(serializer.data)


import logging

logger = logging.getLogger(__name__)

class RoutineViewSet(viewsets.ModelViewSet):
    serializer_class = RoutineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Routine.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        logger.info(f"Received data for update: {request.data}")

        if not serializer.is_valid():
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            self.perform_update(serializer)
        except Exception as e:
            logger.exception(f"Error during update: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def detail(self, request, pk=None):
        routine = self.get_object()
        serializer = RoutineDetailSerializer(routine)
        return Response(serializer.data)


    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "Routine deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


from .models import Exercise

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_exercise_types(request):
    exercise_types = Exercise.EXERCISE_TYPES
    return Response(dict(exercise_types))


class RoutineExerciseViewSet(viewsets.ModelViewSet):
    queryset = RoutineExercise.objects.all()
    serializer_class = RoutineExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]

class CompletedWorkoutViewSet(viewsets.ModelViewSet):
    serializer_class = CompletedWorkoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CompletedWorkout.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CompletedExerciseViewSet(viewsets.ModelViewSet):
    queryset = CompletedExercise.objects.all()
    serializer_class = CompletedExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]

class ReminderViewSet(viewsets.ModelViewSet):
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

import logging
logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    logger.info(f"Received registration request: {request.data}")
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            logger.info(f"User registered successfully: {user.username}")
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error during user creation: {str(e)}")
            return Response({'error': 'An error occurred during registration.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    logger.error(f"Invalid registration data: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    logger.info(f"Login attempt for username: {username}")
    logger.info(f"Request data: {request.data}")

    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        logger.info(f"Login successful for user: {username}")
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username
        })
    logger.warning(f"Login failed for username: {username}")
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_completed_workout(request):
    routine_id = request.data.get('routine')
    try:
        routine = Routine.objects.get(id=routine_id, user=request.user)
        completed_workout = CompletedWorkout.objects.create(user=request.user, routine=routine)
        return Response({'message': 'Workout completed successfully'}, status=status.HTTP_201_CREATED)
    except Routine.DoesNotExist:
        return Response({'error': 'Routine not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    serializer = UserProfileSerializer(request.user, context={'request': request})
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from rest_framework.views import APIView
from .serializers import ProgressSerializer


class ProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)

        if not start_date:
            start_date = timezone.now() - timezone.timedelta(days=30)
        if not end_date:
            end_date = timezone.now()

        completed_workouts = CompletedWorkout.objects.filter(
            user=request.user,
            started_at__gte=start_date,
            started_at__lte=end_date
        ).order_by('started_at')

        progress_data = []
        for workout in completed_workouts:
            progress_data.append({
                'date': workout.started_at.date(),
                'completedExercises': workout.completed_exercises.count(),
                'totalWorkoutTime': workout.duration.total_seconds() // 60,
                'caloriesBurned': workout.calories_burned,
            })

        summary_data = {
            'totalWorkouts': completed_workouts.count(),
            'totalCaloriesBurned': completed_workouts.aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0,
            'totalWorkoutTime': (completed_workouts.aggregate(Sum('duration'))['duration__sum'] or timezone.timedelta()).total_seconds() // 60,
            'totalExercisesCompleted': CompletedExercise.objects.filter(completed_workout__in=completed_workouts).count(),
            'workoutDistribution': self.get_workout_distribution(completed_workouts),
            'weeklyProgress': self.get_weekly_progress(completed_workouts),
        }

        return Response({
            'progress': progress_data,
            'summary': summary_data,
        })

    def get_workout_distribution(self, completed_workouts):
        distribution = completed_workouts.values('routine__name').annotate(count=Count('id'))
        return [{'name': item['routine__name'], 'value': item['count']} for item in distribution]

    def get_weekly_progress(self, completed_workouts):
        weekly_progress = []
        start_date = completed_workouts.first().started_at.date()
        end_date = completed_workouts.last().started_at.date()
        current_week = start_date - timezone.timedelta(days=start_date.weekday())

        while current_week <= end_date:
            week_end = current_week + timezone.timedelta(days=6)
            workouts_this_week = completed_workouts.filter(started_at__date__range=[current_week, week_end])
            weekly_progress.append({
                'week': current_week.strftime('%Y-%m-%d'),
                'workouts': workouts_this_week.count(),
                'exercises': CompletedExercise.objects.filter(completed_workout__in=workouts_this_week).count(),
            })
            current_week += timezone.timedelta(days=7)

        return weekly_progress
