from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import MuscleGroup, Exercise, Routine, RoutineExercise, CompletedExercise, Reminder
from .serializers import (
    UserSerializer, MuscleGroupSerializer, ExerciseSerializer,
    RoutineSerializer, RoutineExerciseSerializer, CompletedExerciseSerializer,
    ReminderSerializer
)

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

class RoutineViewSet(viewsets.ModelViewSet):
    serializer_class = RoutineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Routine.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def today(self, request):
        today = timezone.now().date()
        routine = Routine.objects.filter(user=request.user).first()  # Assuming one routine per user
        if routine:
            exercises = RoutineExercise.objects.filter(routine=routine)
            serializer = RoutineExerciseSerializer(exercises, many=True)
            return Response(serializer.data)
        return Response({'detail': 'No routine found for today'}, status=404)

    @action(detail=False, methods=['get'])
    def progress(self, request):
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)  # Get last 30 days of progress
        progress_data = []
        for day in range((end_date - start_date).days + 1):
            date = start_date + timedelta(days=day)
            completed = CompletedExercise.objects.filter(user=request.user, completed_at__date=date).count()
            total = RoutineExercise.objects.filter(routine__user=request.user).count()
            missed = max(0, total - completed)
            progress_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'completedExercises': completed,
                'missedExercises': missed
            })
        return Response(progress_data)

class RoutineExerciseViewSet(viewsets.ModelViewSet):
    queryset = RoutineExercise.objects.all()
    serializer_class = RoutineExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RoutineExercise.objects.filter(routine__user=self.request.user)

class CompletedExerciseViewSet(viewsets.ModelViewSet):
    queryset = CompletedExercise.objects.all()
    serializer_class = CompletedExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CompletedExercise.objects.filter(user=self.request.user)

class ReminderViewSet(viewsets.ModelViewSet):
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user, is_sent=False)

    @action(detail=False, methods=['get'])
    def today(self, request):
        today = timezone.now().date()
        reminders = Reminder.objects.filter(
            user=request.user,
            reminder_date__date=today,
            is_sent=False
        )
        serializer = self.get_serializer(reminders, many=True)
        return Response(serializer.data)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data['password'])
        user.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
