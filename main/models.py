from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.db import models

class CustomUserManager(BaseUserManager):

    def create_user(self, username, password, **others):

        if not username:
            raise ValueError("Username is Needed")

        user = self.model(username=username, **others)
        user.password = make_password(password)
        user.save()
        return user

    
    def create_superuser(self, username, password, **others):

        others.setdefault('is_staff', True)
        others.setdefault('is_superuser', True)
        others.setdefault('is_active', True)


        if others.get('is_staff') is not True:
            raise ValueError("SuperUser must be Staff")

        if others.get('is_superuser') is not True:
            raise ValueError('Error')

        user = self.create_user(username, password, **others)

        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=20, primary_key=True)
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    is_staff = models.BooleanField(default=False)  
    is_active = models.BooleanField(default=True)
    Choices = [
        ('AD', 'Admin'),
        ('TE', 'Teacher'),
        ('ST', 'Student'),
    ]
    role = models.CharField(max_length=2, choices=Choices, default=Choices[0][0])

    objects = CustomUserManager()
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
