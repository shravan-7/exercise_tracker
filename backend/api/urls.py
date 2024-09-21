from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, MuscleGroupViewSet, ExerciseViewSet, RoutineViewSet,
    RoutineExerciseViewSet, CompletedExerciseViewSet, ReminderViewSet,
    register, login,save_completed_workout
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'muscle-groups', MuscleGroupViewSet)
router.register(r'exercises', ExerciseViewSet)
router.register(r'routines', RoutineViewSet, basename='routine')
router.register(r'routine-exercises', RoutineExerciseViewSet, basename='routineexercise')
router.register(r'completed-exercises', CompletedExerciseViewSet, basename='completedexercise')
router.register(r'reminders', ReminderViewSet, basename='reminder')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('api/completed-workouts/', save_completed_workout, name='save_completed_workout')

]
