from django.contrib import admin
from .models import Articles, Comments, Notification


class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_by', 'created', 'article')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'for_article', 'user', 'created', 'comment', 'parent')

class NotifyAdmin(admin.ModelAdmin):
    list_display = ('id', 'by_user', 'notification', 'for_article', 'for_user', 'is_read')

admin.site.register(Articles, ArticleAdmin)
admin.site.register(Comments, CommentAdmin)
admin.site.register(Notification, NotifyAdmin)

# Register your models here.
