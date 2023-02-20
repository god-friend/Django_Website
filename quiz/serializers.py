from .models import CustomUser, Quiz, StudentData
from rest_framework.serializers import ModelSerializer, Serializer
from django.contrib.auth.models import Group


class UserSerializer(ModelSerializer):

    class Meta:
        model = CustomUser
        fields = '__all__'

    def create(self, validated_data):
        user = validated_data['username']
        fname = validated_data['firstname']
        lname = validated_data['lastname']
        utype = validated_data['role']
        pwd = validated_data['password']
        new_user = CustomUser.objects.create_user(username=user, password=pwd, role=utype, firstname=fname, lastname=lname)
        if utype == 'TE':
            teacher = Group.objects.get(name="Teachers")
            new_user.groups.add(teacher)
        elif utype == 'ST':
            student = Group.objects.get(name="Students")
            new_user.groups.add(student)
        return new_user


class QuizSerializer(ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'


class CategoriesSerializer(Serializer):

    # Return Name of Category
    def to_representation(self, instance):
        return instance


class TeacherSerializer(Serializer):
    
    # Return (username, fullname) of teacher
    def to_representation(self, instance):
        teacher = CustomUser.objects.get(pk=instance)
        return (instance, teacher.firstname + " " + teacher.lastname)


class StudentDataSerializer(ModelSerializer):
    
    class Meta:
        model = StudentData
        fields = "__all__"


