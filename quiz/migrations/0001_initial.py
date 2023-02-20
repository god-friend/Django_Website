# Generated by Django 4.1.7 on 2023-02-20 14:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import quiz.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentData',
            fields=[
                ('student', models.OneToOneField(limit_choices_to={'role': 'ST'}, on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('data', models.JSONField(default=quiz.models.default_data)),
            ],
        ),
        migrations.CreateModel(
            name='Quiz',
            fields=[
                ('title', models.CharField(max_length=256, primary_key=True, serialize=False)),
                ('category', models.CharField(default='Programming', max_length=100)),
                ('created', models.DateTimeField(auto_now=True)),
                ('questions', models.JSONField(null=True)),
                ('teacher', models.ForeignKey(limit_choices_to={'role': 'TE'}, on_delete=django.db.models.deletion.CASCADE, related_name='user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
