from django.shortcuts import redirect, render, HttpResponse
from django.contrib.auth import logout, login
from rest_framework.decorators import api_view
from quiz.models import Quiz, StudentData
from quiz.serializers import QuizSerializer, StudentDataSerializer
from .serializers import UserSerializer, UsernameOrCategorySerializer
from .models import CustomUser
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.authentication import SessionAuthentication
from rest_framework.status import HTTP_405_METHOD_NOT_ALLOWED
from article.models import Articles
from article.serializers import ArticleSerializer
from article.permissions import IsUserPost
from rest_framework.authentication import authenticate
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .extraFunc import formatData


@api_view(['get'])
def index(request):
    first5Quiz = Quiz.objects.order_by("-created")[:5]
    first5Articles = Articles.objects.order_by("-created")[:5]
    result = {
        "quizes": first5Quiz,
        "articles": first5Articles,
    }
    return render(request, "index.html", context=result)

@api_view(['get','post'])
def loginUser(request):
    if request.method == 'GET':
        msg = {
            "message": "Please Enter Username and Password",
        }
        return render(request, 'account/login.html', context=msg)
    
    if request.method == 'POST':
        user = request.data['username']
        pwd = request.data['password']
        user_auth = authenticate(request, username=user, password=pwd)
        if user_auth:
            if user_auth.is_active:
                login(request, user_auth)
            return redirect('/')
        msg = {
            "message": "Username and Password doesn't match",
        }
        return render(request, 'account/login.html', context=msg)

@api_view(['get', 'post'])
def signupUser(request):
    if request.method == 'GET':
        msg = {
            "message": "Please Enter Your Details"
        }
        return render(request, 'account/signup.html', context=msg)

    if request.method == 'POST':
        new_user_data = request.data
        new_user_data._mutable = True
        del new_user_data['csrfmiddlewaretoken']
        serialize = UserSerializer(data=new_user_data)
        if serialize.is_valid():
            user = serialize.create(serialize.validated_data)
            if user.role == 'ST':
                StudentData.objects.create(student=user)
            return redirect('login')
        msg = {
            "message": "Username Already Exists",
        }
        return render(request, 'account/signup.html', context=msg)

@api_view(['get', 'post'])
def create_quiz_user(request):
    if request.user.is_authenticated and request.user.role == "TE":
        if request.method == 'GET':
            return render(request, 'quiz/create_quiz.html', context={"add": 0})
        if request.method == 'POST':
            try:
                total = int(request.data['num'])
                data = {
                    "add": 1, 
                    "total": range(1, total+1),
                    "num": request.data['num'],
                }
                return render(request, 'quiz/create_quiz.html', context=data)
            except ValueError:
                return render(request, 'quiz/create_quiz.html', context={"add": 0})
            
    
    return HttpResponse("403 Not Allowed")

@api_view(['get', 'post'])
def search_quiz(request):
    print(request.path, request.META['HTTP_REFERER'])
    search = request.data['search']
    return redirect('/allQuiz/?search='+search)

@api_view(['get', 'post'])
def filter_quiz(request):
    if request.method == 'GET':
        return render(request, 'quiz/filter.html', context={"btns": 1})
    if request.method == 'POST':
        if request.data['type'] == "category":
            qType = "Categories"
            queryset = Quiz.objects.values_list('category', flat=True).distinct().order_by("-category")
            serialize = UsernameOrCategorySerializer(queryset, many=True)
        elif request.data['type'] == "teacher":
            qType = "Teachers"
            queryset = Quiz.objects.values_list('teacher', flat=True).distinct().order_by("-teacher")
            serialize = UsernameOrCategorySerializer(queryset, many=True)
            
        return render(request, 'quiz/filter.html', context={"btns": 0, "data": serialize.data, "type": qType})

@api_view(['get'])
def profile_page(request):
    if request.user.is_authenticated:
        return render(request, "account/user_account.html")
    return HttpResponse("Please Login To Continue")

@api_view(['get', 'post'])
def filter_articles(request):
    if request.method == 'GET':
        return render(request, 'article/filter.html', context={"btns": 1})
    if request.method == 'POST':
        print(request.data)
        data = request.data
        if data['type'] == "category":
            qType = "Categories"
            a_cats = Articles.objects.values_list("category", flat=True).distinct().order_by("-category")
            serialize = UsernameOrCategorySerializer(a_cats, many=True)
        elif data['type'] == "user":
            qType = "Users"
            a_users = Articles.objects.values_list("created_by", flat=True).distinct().order_by("-created_by")
            serialize = UsernameOrCategorySerializer(a_users, many=True)
            
        return render(request, 'article/filter.html', context={"btns": 0, "type": qType, "data": serialize.data})

@api_view(['get'])
def create_article(request):
    if request.user.is_authenticated:
        return render(request, 'article/createArticle.html')
    
    return HttpResponse("Not Allowed<br>Please Login To Continue")

@api_view(['get'])
def user_logout(request):
    if request.user.is_authenticated:
        logout(request)
    return redirect('/')

class QuizView(ModelViewSet):
    queryset = Quiz.objects.all().order_by('-created')
    serializer_class = QuizSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsUserPost, IsAuthenticatedOrReadOnly]
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'quiz/quiz.html'
    filter_backends = [SearchFilter, DjangoFilterBackend]
    filterset_fields = ('category', 'teacher')
    search_fields = ['title', 'category']

    def create(self, request, *args, **kwargs):
        quiz = formatData(request.data)
        quiz['teacher'] = request.user
        serialize = self.get_serializer(data=quiz)
        if serialize.is_valid():
            serialize.save()
            return redirect('/profile/')
        return HttpResponse("Quiz Not Valid<br>Reasons: Quiz by name <b>'{name}'</b> already exsits".format(name=quiz['title']))

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        serialized_data = self.get_serializer(obj)
        if str(request.path) == "/allQuiz/{pk}/".format(pk=kwargs['pk']):
            return render(request, 'quiz/showQuiz.html', context={"quiz": serialized_data.data})
        elif str(request.path) == "/allQuiz/edit/{pk}/".format(pk=kwargs['pk']):
            if request.user.is_authenticated and request.user.role == "TE":
                return render(request, 'quiz/editQuiz.html', context={"quiz": serialized_data.data})
            else:
                return HttpResponse("Not Allowed")
        else:
            return HttpResponse("404 Not Found")
        
class UserView(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'account/userdetails.html'

    def list(self, request, *args, **kwargs):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)

    def create(self, request, *args, **kwargs):
        return Response(status=HTTP_405_METHOD_NOT_ALLOWED)
    
class StudentDataView(RetrieveAPIView):
    queryset = StudentData.objects.all()
    serializer_class = StudentDataSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'account/student_data.html'

class ArticlesView(ModelViewSet):
    queryset = Articles.objects.all().order_by("-created")
    serializer_class = ArticleSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'article/article.html'
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ("category", "created_by")
    search_fields = ['title', 'category']

    def create(self, request, *args, **kwargs):
        data = request.data
        data._mutable = True
        del data['csrfmiddlewaretoken']
        serialize = self.get_serializer(data=data)
        if serialize.is_valid():
            serialize.save()
            return render(request, 'article/createArticle.html')
        return HttpResponse("Not Valid Article")
    
    def retrieve(self, request, *args, **kwargs):
        article = self.get_object()
        serialize = self.get_serializer(article)
        if str(request.path) == "/article/{pk}/".format(pk=kwargs['pk']):
            return render(request, 'article/showArticle.html', context={"article": serialize.data})
        elif str(request.path) == "/article/edit/{pk}/".format(pk=kwargs['pk']):
            return render(request, 'article/editArticle.html', context={"article": serialize.data})
        
        return HttpResponse("Not Found")

