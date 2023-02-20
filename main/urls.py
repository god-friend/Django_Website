from django.urls import path
from .views import user_logout, AllQuiz, UserView, UserQuiz, profile_page, create_quiz_user, StudentDataView, filter_quiz
from .views import ArticlesView, create_article, UserArticle, filter_articles
from .views import get_fullname, index, loginUser, signupUser

routeList = (
    ('profile/userDetails', UserView, 'user_details'),
)

urlpatterns = [
    path('fullname/<str:pk>', get_fullname, name='fullname'),
    path('', index, name='index'),
    path('login', loginUser, name="login"),
    path('signup', signupUser, name='signup'),

    path('allQuiz/', AllQuiz.as_view(), name='quiz'),
    path('profile/', profile_page, name='profile'),
    path('profile/newQuiz', create_quiz_user, name='createQuiz'),
    path('profile/userQuiz', UserQuiz.as_view(), name='userQuiz'),
    path('profile/stdData/<str:pk>', StudentDataView.as_view(), name='stdData'),
    path('filterQuiz/', filter_quiz, name='fQuiz'),

    path('article/', ArticlesView.as_view(), name='article'),
    path('profile/newArticle/', create_article, name='createArticle'),
    path('profile/myArticles/', UserArticle.as_view(), name='userArticles'),
    path('filterArticle/', filter_articles, name='fArticle'),
    path('logout/', user_logout, name='logout'),
]