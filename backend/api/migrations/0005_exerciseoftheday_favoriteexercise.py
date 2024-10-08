# Generated by Django 3.2.9 on 2024-09-23 14:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20240923_0714'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExerciseOfTheDay',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(unique=True)),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.exercise')),
            ],
        ),
        migrations.CreateModel(
            name='FavoriteExercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.exercise')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'exercise')},
            },
        ),
    ]
