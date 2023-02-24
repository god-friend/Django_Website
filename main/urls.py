from django.urls import path
from .views import user_logout, QuizView, UserView, profile_page, create_quiz_user, StudentDataView, filter_quiz, search_quiz
from .views import ArticlesView, create_article, filter_articles
from .views import index, loginUser, signupUser

routeList = (
    ('allQuiz', QuizView, 'quiz_view'),
    ('allQuiz/edit', QuizView, 'edit_quiz'),
    ('profile/userDetails', UserView, 'user_details'),
    ('article', ArticlesView, 'article_view'),
    ('article/edit', ArticlesView, 'edit_article'),
)

urlpatterns = [
    path('', index, name='index'),

    path('login', loginUser, name="login"),
    path('signup', signupUser, name='signup'),

    path('profile/', profile_page, name='profile'),
    path('profile/newQuiz', create_quiz_user, name='createQuiz'),
    path('profile/stdData/<str:pk>', StudentDataView.as_view(), name='stdData'),

    path('filterQuiz/', filter_quiz, name='fQuiz'),
    path('searchQuiz/', search_quiz, name='searchQuiz'),

    path('profile/newArticle/', create_article, name='createArticle'),
    path('filterArticle/', filter_articles, name='fArticle'),

    path('logout/', user_logout, name='logout'),
]