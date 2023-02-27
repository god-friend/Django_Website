from django.db import models
from quiz.models import CustomUser

class Articles(models.Model):
    title = models.CharField(max_length=256)
    category = models.CharField(max_length=100, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    article = models.TextField()

    def __str__(self):
        return self.title
    
    def get_comments(self):
        return self.comment.filter(parent=None)
    
    
class Comments(models.Model):
    for_article = models.ForeignKey(Articles, on_delete=models.CASCADE, related_name="comment")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="by_user")
    created = models.DateTimeField(auto_now_add=True, null=True)
    comment = models.CharField(max_length=256)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')

    def __str__(self) -> str:
        return self.comment
    

    @property
    def all_replies(self):
        return Comments.objects.filter(parent=self)

    @property
    def is_parent(self):
        if self.parent is None:
            return True
        return False


class Notification(models.Model):
    is_read = models.BooleanField(default=False)
    notification = models.CharField(max_length=256)
    by_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='byUser', null=True)
    created = models.DateTimeField(auto_now_add=True, null=True)
    for_article = models.ForeignKey(Articles, on_delete=models.CASCADE, related_name='forArticle')
    for_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_notification')
    
    
