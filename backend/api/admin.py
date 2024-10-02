from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, MuscleGroup, Exercise, Routine, RoutineExercise, CompletedExercise, Reminder

admin.site.register(User, UserAdmin)
admin.site.register(MuscleGroup)
admin.site.register(Exercise)
admin.site.register(Routine)
admin.site.register(RoutineExercise)
admin.site.register(CompletedExercise)
admin.site.register(Reminder)
# Register your models here.
