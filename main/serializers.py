from django.contrib.auth.models import Group, Permission
from main.models import CustomUser
from rest_framework.serializers import ModelSerializer, Serializer


def create_group():
    groups = Group.objects.all()
    if not groups.exists():
        perm = Permission.objects.filter(content_type__model='quiz')
        st_perm = Permission.objects.get(codename="view_quiz",content_type__model='quiz')
        stData_perm = Permission.objects.filter(content_type__model='studentdata')
        T_group = Group.objects.create(name='Teachers')
        S_group = Group.objects.create(name='Students')
        T_group.permissions.set(perm)
        S_group.permissions.set(stData_perm)
        S_group.permissions.add(st_perm.id)
    else:
        return
    

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
        create_group()
        if utype == 'TE':
            teacher = Group.objects.get(name="Teachers")
            new_user.groups.add(teacher)
        elif utype == 'ST':
            student = Group.objects.get(name="Students")
            new_user.groups.add(student)
        return new_user
   
    
class UsernameOrCategorySerializer(Serializer):

    def to_representation(self, instance):
        return instance
    