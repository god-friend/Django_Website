from django.db import models
from quiz.models import CustomUser

class Articles(models.Model):
    title = models.CharField(max_length=256)
    category = models.CharField(max_length=100, blank=True)
    created = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    article = models.TextField()

    def __str__(self):
        return self.title