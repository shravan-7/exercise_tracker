from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, MuscleGroupViewSet, ExerciseViewSet, RoutineViewSet,
    RoutineExerciseViewSet, CompletedExerciseViewSet, ReminderViewSet,
    login, register
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'muscle-groups', MuscleGroupViewSet)
router.register(r'exercises', ExerciseViewSet)
router.register(r'routines', RoutineViewSet, basename='routine')
router.register(r'routine-exercises', RoutineExerciseViewSet)
router.register(r'completed-exercises', CompletedExerciseViewSet)
router.register(r'reminders', ReminderViewSet, basename='reminder')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login, name='login'),
    path('register/', register, name='register'),
]
