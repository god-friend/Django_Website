from django.db import models
from main.models import CustomUser

class Quiz(models.Model):
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'TE'}, related_name='user')
    title = models.CharField(max_length=256, primary_key=True)
    category = models.CharField(max_length=100, default="Programming")
    created = models.DateTimeField(auto_now=True)
    questions = models.JSONField(null=True)
    
    def __str__(self):
        return self.title


def default_data():
    return {
        "attempted": [],
        "leaved": [],
        "passed": [],
        "failed": [],
        "cleared":[],
    }

class StudentData(models.Model):
    student = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'ST'}, primary_key=True)
    data = models.JSONField(default=default_data)

    def __str__(self):
        return self.student.username

        



