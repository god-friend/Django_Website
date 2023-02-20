from django.urls import path
from .views import LoginUser, LogoutUser, SignupUser, QuizCRUD, AllQuiz, get_all_Categories, get_all_Teachers, StudentView
routeList = (
    ("quiz", QuizCRUD, "create"),
    ("std", StudentView, "student_data"),
    ("all", AllQuiz, "all_quiz"),
)

urlpatterns = [
    path("login/", LoginUser.as_view()),
    path("logout/", LogoutUser.as_view()),
    path("signup/", SignupUser.as_view()),
    path("cat/", get_all_Categories.as_view()),
    path("teach/", get_all_Teachers.as_view()),
]