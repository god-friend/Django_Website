from django.contrib.auth import login, logout, authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_403_FORBIDDEN, HTTP_400_BAD_REQUEST
from .serializers import QuizSerializer, CategoriesSerializer, TeacherSerializer, StudentDataSerializer
from main.serializers import UserSerializer
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from .models import Quiz, CustomUser, StudentData
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import DjangoModelPermissionsOrAnonReadOnly, IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from .paginators import AllQuizPagination
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend


class LoginUser(APIView):

    def post(self, request, format=None):
        user = request.data["username"]
        pwd = request.data["password"]

        user_auth = authenticate(request, username=user, password=pwd)
        # print(user_auth, user, pwd)
        if user_auth is not None:
            if user_auth.is_active:
                login(request, user_auth)
                data = CustomUser.objects.get(pk=user)
                response = {
                    "user": data.username,
                    "fullname": data.firstname + " " + data.lastname,
                    "role": data.role
                }
                return Response(response, status=HTTP_200_OK)
            else:
                return Response(status=HTTP_403_FORBIDDEN)
        else:
            return Response(status=HTTP_403_FORBIDDEN)


class LogoutUser(APIView):

    def get(self, request, format=None):

        if request.user.is_authenticated:
            user = request.user
            logout(request)
            return Response(status=HTTP_200_OK)

        return Response(status=HTTP_200_OK)


class SignupUser(APIView):

    def post(self, request, format=None):
        data = request.data
        serialize_data = UserSerializer(data=data)
        if serialize_data.is_valid():
            user = serialize_data.create(serialize_data.validated_data)
            StudentData.objects.create(student=user)
            return Response(status=HTTP_200_OK)
        else:
            return Response(status=HTTP_400_BAD_REQUEST)
        

class QuizCRUD(ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = AllQuizPagination
    filter_backends = [OrderingFilter]
    ordering = '-created'

    def get_queryset(self):
        return Quiz.objects.filter(teacher=self.request.user)


class AllQuiz(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    pagination_class = AllQuizPagination
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    filterset_fields = ('category', 'teacher')
    ordering = '-created'


class get_all_Categories(ListAPIView):
    queryset = Quiz.objects.values_list('category', flat=True).distinct()
    serializer_class = CategoriesSerializer
    pagination_class = AllQuizPagination
    filter_backends = [OrderingFilter]
    ordering = 'category'
    
    
class get_all_Teachers(ListAPIView):
    queryset = Quiz.objects.values_list('teacher', flat=True).distinct()
    serializer_class = TeacherSerializer
    pagination_class = AllQuizPagination
    filter_backends = [OrderingFilter]
    ordering = 'teacher'


class StudentView(ModelViewSet):
    queryset = StudentData.objects.all()
    serializer_class = StudentDataSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudentData.objects.filter(pk=self.request.user)

