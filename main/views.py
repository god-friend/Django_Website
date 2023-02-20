from django.shortcuts import redirect, render, HttpResponse
from django.contrib.auth import logout, login
from rest_framework.decorators import api_view
from quiz.models import Quiz, CustomUser, StudentData
from quiz.serializers import QuizSerializer, UserSerializer, StudentDataSerializer
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.generics import ListAPIView, RetrieveAPIView
from quiz.paginators import AllQuizPagination
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.status import HTTP_405_METHOD_NOT_ALLOWED
from article.models import Articles
from article.serializers import ArticleSerializer
from article.paginators import ArticlePagination
from rest_framework.authentication import authenticate


@api_view(['get'])
def get_fullname(request, pk: str):
    user = CustomUser.objects.get(pk=pk)
    return Response({"fullname": user.firstname + " " + user.lastname})

@api_view(['get'])
def index(request):
    first5Quiz = Quiz.objects.order_by("-created")[:5]
    first5Articles = Articles.objects.order_by("-created")[:5]
    result = {
        "quizes": first5Quiz,
        "articles": first5Articles,
    }
    # print(first5Quiz)
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

class AllQuiz(ListAPIView):
    queryset = Quiz.objects.all().order_by('-created')
    serializer_class = QuizSerializer
    pagination_class = AllQuizPagination
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'quiz/quiz.html'

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
    
class UserQuiz(ListAPIView):
    queryset = Quiz.objects.all().order_by("-created")
    serializer_class = QuizSerializer
    pagination_class = AllQuizPagination
    renderer_classes = [TemplateHTMLRenderer]
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    template_name = 'quiz/my_quiz.html'

    def get_queryset(self):
        return Quiz.objects.filter(teacher=self.request.user).order_by('-created')

class StudentDataView(RetrieveAPIView):
    queryset = StudentData.objects.all()
    serializer_class = StudentDataSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'account/student_data.html'

def filter_quiz(request):
    return render(request, 'quiz/filter.html')

def create_quiz_user(request):
    if request.user.is_authenticated and request.user.role == "TE":
        return render(request, 'quiz/create_quiz.html')
    
    return HttpResponse("403 Not Allowed")

def profile_page(request):
    return render(request, "account/user_account.html")

class ArticlesView(ListAPIView):
    queryset = Articles.objects.all().order_by("-created")
    serializer_class = ArticleSerializer
    pagination_class = ArticlePagination
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'article/article.html'

class UserArticle(ListAPIView):
    serializer_class = ArticleSerializer
    pagination_class = ArticlePagination
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    renderer_classes = [TemplateHTMLRenderer]
    template_name = "article/m_articles.html"

    def get_queryset(self):
        return Articles.objects.filter(created_by=self.request.user).order_by("-created")

def filter_articles(request):
    return render(request, 'article/filter.html')

def create_article(request):
    return render(request, 'article/createArticle.html')

def user_logout(request):
    if request.user.is_authenticated:
        logout(request)
    return redirect('/')
