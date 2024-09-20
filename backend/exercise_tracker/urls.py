"""
URL configuration for exercise_tracker project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # This includes the API app URLs
]

# urlpatterns = [
#     path('admin/', admin.site.urls),
# ]
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from ..api.views import ReminderViewSet

# from django.contrib import admin
# from django.urls import path, include
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from ..api.views import UserViewSet, MuscleGroupViewSet, ExerciseViewSet, RoutineViewSet, RoutineExerciseViewSet, CompletedExerciseViewSet, ReminderViewSet, login, register

# router = DefaultRouter()
# router.register(r'users', UserViewSet)
# router.register(r'muscle-groups', MuscleGroupViewSet)
# router.register(r'exercises', ExerciseViewSet)
# router.register(r'routines', RoutineViewSet, basename='routine')
# router.register(r'routine-exercises', RoutineExerciseViewSet)
# router.register(r'completed-exercises', CompletedExerciseViewSet)
# router.register(r'reminders', ReminderViewSet, basename='reminder')

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include('api.urls')),
#     path('', include(router.urls)),
#     path('login/', login, name='login'),
#     path('register/', register, name='register'),
# ]
