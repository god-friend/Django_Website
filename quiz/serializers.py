from .models import Quiz, StudentData
from rest_framework.serializers import ModelSerializer, Serializer
from main.models import CustomUser

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


