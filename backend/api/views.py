from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta,datetime
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, get_user_model
from rest_framework.authtoken.models import Token
from .models import MuscleGroup, Exercise, Routine, RoutineExercise, CompletedWorkout, FavoriteExercise, ExerciseOfTheDay,CompletedExercise, Reminder,WorkoutChallenge,UserChallenge,UserChallengeExercise
from django.views.decorators.csrf import csrf_exempt
import logging
from rest_framework.views import APIView
from django.db.models import Sum, Count
from django.utils.dateparse import parse_date
from django.db.models.functions import TruncDate, TruncWeek
from .utils import parse_date_or_default
from random import choice
from django.contrib.auth.decorators import login_required

from .serializers import (
    UserSerializer, MuscleGroupSerializer, ExerciseSerializer,
    RoutineSerializer, RoutineExerciseSerializer, CompletedExerciseSerializer,
    ReminderSerializer, RoutineDetailSerializer, CompletedWorkoutSerializer,UserProfileSerializer, UserProfileUpdateSerializer,
    RoutineDetailSerializer,FavoriteExerciseSerializer, ExerciseOfTheDaySerializer,ProgressSerializer,WorkoutChallengeSerializer,UserChallengeSerializer,
)


User = get_user_model()
logger = logging.getLogger(__name__)


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
    permission_classes = [IsAuthenticated]


    @action(detail=False, methods=['GET'])
    def today(self, request):
        today = timezone.now().date()
        try:
            exercise_of_the_day = ExerciseOfTheDay.objects.get(date=today)
        except ExerciseOfTheDay.DoesNotExist:
            # If there's no exercise for today, create one randomly
            random_exercise = choice(Exercise.objects.all())
            exercise_of_the_day = ExerciseOfTheDay.objects.create(date=today, exercise=random_exercise)

        serializer = self.get_serializer(exercise_of_the_day)
        return Response(serializer.data)


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
        started_at = self.request.data.get('started_at', timezone.now())
        completed_at = timezone.now()
        duration = completed_at - datetime.fromisoformat(started_at)
        serializer.save(user=self.request.user, started_at=started_at, completed_at=completed_at, duration=duration)

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
                'user_id': user.pk,
                'username': user.username
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error during user creation: {str(e)}")
            return Response({'error': 'An error occurred during registration.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    logger.error(f"Invalid registration data: {serializer.errors}")

    # Flatten the error messages
    error_messages = []
    for field, errors in serializer.errors.items():
        for error in errors:
            error_messages.append(f"{field.capitalize()}: {error}")

    return Response({'errors': error_messages}, status=status.HTTP_400_BAD_REQUEST)

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


class ProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = parse_date_or_default(request.query_params.get('start_date'))
        end_date = parse_date_or_default(request.query_params.get('end_date'), default_days=0)

        completed_workouts = CompletedWorkout.objects.filter(
            user=request.user,
            started_at__date__range=[start_date, end_date]
        ).order_by('started_at')

        progress_data = completed_workouts.annotate(
            date=TruncDate('started_at')
        ).values('date').annotate(
            completedExercises=Count('completed_exercises'),
            totalWorkoutTime=Sum('duration'),
            caloriesBurned=Sum('calories_burned')
        ).order_by('date')

        for entry in progress_data:
            entry['totalWorkoutTime'] = entry['totalWorkoutTime'].total_seconds() // 60 if entry['totalWorkoutTime'] else 0

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
        weekly_progress = completed_workouts.annotate(
            week=TruncWeek('started_at')
        ).values('week').annotate(
            workouts=Count('id'),
            exercises=Count('completed_exercises')
        ).order_by('week')

        return [
            {
                'week': item['week'].strftime('%Y-%m-%d'),
                'workouts': item['workouts'],
                'exercises': item['exercises']
            }
            for item in weekly_progress
        ]

from django.contrib.auth import update_session_auth_hash

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    if request.method == 'POST':
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not request.user.check_password(current_password):
            return Response({'error': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new_password)
        request.user.save()
        update_session_auth_hash(request, request.user)
        return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    if request.method == 'DELETE':
        user = request.user
        user.delete()
        return Response({'message': 'Account deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)



from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import WorkoutChallenge, UserChallenge, UserChallengeExercise
from .serializers import WorkoutChallengeSerializer, UserChallengeSerializer, UserChallengeExerciseSerializer

class WorkoutChallengeViewSet(viewsets.ModelViewSet):
    queryset = WorkoutChallenge.objects.all()
    serializer_class = WorkoutChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['POST'])
    def join(self, request, pk=None):
        challenge = self.get_object()
        user = request.user
        user_challenge, created = UserChallenge.objects.get_or_create(user=user, challenge=challenge)

        if created:
            for exercise in challenge.exercises.all():
                UserChallengeExercise.objects.create(user_challenge=user_challenge, exercise=exercise)
            return Response({"message": "Successfully joined the challenge."}, status=status.HTTP_201_CREATED)
        return Response({"message": "You've already joined this challenge."}, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        user_challenge = UserChallenge.objects.filter(user=request.user, challenge=instance).first()
        if user_challenge:
            exercise_progress = UserChallengeExercise.objects.filter(user_challenge=user_challenge)
            data['exercises'] = [
                {
                    'id': progress.exercise.id,
                    'name': progress.exercise.name,
                    'completed': progress.completed
                }
                for progress in exercise_progress
            ]
            data['user_challenge_id'] = user_challenge.id
            data['progress'] = user_challenge.progress
            data['completed'] = user_challenge.completed
            data['has_joined'] = True
        else:
            data['exercises'] = [
                {
                    'id': exercise.id,
                    'name': exercise.name,
                    'completed': False
                }
                for exercise in instance.exercises.all()
            ]
            data['user_challenge_id'] = None
            data['progress'] = 0
            data['completed'] = False
            data['has_joined'] = False
        return Response(data)

class UserChallengeViewSet(viewsets.ModelViewSet):
    serializer_class = UserChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserChallenge.objects.filter(user=self.request.user)

    @action(detail=True, methods=['POST'])
    def update_progress(self, request, pk=None):
        user_challenge = self.get_object()
        exercise_id = request.data.get('exercise_id')

        if not exercise_id:
            return Response({"message": "Exercise ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        exercise_progress = get_object_or_404(UserChallengeExercise, user_challenge=user_challenge, exercise_id=exercise_id)
        exercise_progress.completed = True
        exercise_progress.save()

        user_challenge.progress = UserChallengeExercise.objects.filter(user_challenge=user_challenge, completed=True).count()
        if user_challenge.progress >= user_challenge.challenge.goal:
            user_challenge.completed = True
        user_challenge.save()

        # Fetch updated challenge data
        challenge_data = WorkoutChallengeSerializer(user_challenge.challenge).data
        challenge_data['exercises'] = [
            {
                'id': progress.exercise.id,
                'name': progress.exercise.name,
                'completed': progress.completed
            }
            for progress in UserChallengeExercise.objects.filter(user_challenge=user_challenge)
        ]
        challenge_data['user_challenge_id'] = user_challenge.id
        challenge_data['progress'] = user_challenge.progress
        challenge_data['completed'] = user_challenge.completed
        challenge_data['has_joined'] = True

        return Response(challenge_data)
