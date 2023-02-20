from django.contrib import admin
from .models import Articles


class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_by', 'created', 'article')

admin.site.register(Articles, ArticleAdmin)
# Register your models here.
