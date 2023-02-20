from django.contrib import admin
from .models import CustomUser, Quiz, StudentData
from django.contrib.auth.forms import UserCreationForm

class CustomUserForm(UserCreationForm):

    class Meta:
        model = CustomUser
        fields = ("username", "firstname", "lastname", "role", "groups")


class CustomUserAdminPanel(admin.ModelAdmin):
    form = CustomUserForm
    list_display = ('username', 'role')


class QuizAdminPanel(admin.ModelAdmin):
    list_display = ('teacher', 'title','created')


class StudentAdminPanel(admin.ModelAdmin):
    list_display = ('student', 'data')


admin.site.register(CustomUser, CustomUserAdminPanel)
admin.site.register(Quiz, QuizAdminPanel)
admin.site.register(StudentData, StudentAdminPanel)