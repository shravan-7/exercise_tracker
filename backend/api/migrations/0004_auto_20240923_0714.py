# Generated by Django 3.2.9 on 2024-09-23 07:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_routineexercise_routine'),
    ]

    operations = [
        migrations.AlterField(
            model_name='routine',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='routines', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='routineexercise',
            name='routine',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exercises', to='api.routine'),
        ),
    ]
