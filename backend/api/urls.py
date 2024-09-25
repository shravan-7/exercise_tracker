from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, MuscleGroupViewSet, ExerciseViewSet, RoutineViewSet,
    RoutineExerciseViewSet, CompletedExerciseViewSet, ReminderViewSet,
    register, login, save_completed_workout, user_profile, update_profile, get_exercise_types, ExerciseOfTheDayViewSet, ProgressView
)
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'muscle-groups', MuscleGroupViewSet)
router.register(r'exercises', ExerciseViewSet)
router.register(r'routines', RoutineViewSet, basename='routine')
router.register(r'routine-exercises', RoutineExerciseViewSet, basename='routineexercise')
router.register(r'completed-exercises', CompletedExerciseViewSet, basename='completedexercise')
router.register(r'reminders', ReminderViewSet, basename='reminder')
router.register(r'exercise-of-the-day', ExerciseOfTheDayViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('completed-workouts/', save_completed_workout, name='save_completed_workout'),
    path('user-profile/', user_profile, name='user_profile'),
    path('update-profile/', update_profile, name='update_profile'),
    path('exercise-types/', get_exercise_types, name='exercise-types'),
    path('favorite-exercises/', ExerciseViewSet.as_view({'get': 'favorites'}), name='favorite-exercises'),
    path('toggle-favorite-exercise/', ExerciseViewSet.as_view({'post': 'toggle_favorite'}), name='toggle-favorite-exercise'),
    path('progress/', ProgressView.as_view(), name='progress'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
