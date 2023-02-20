from django.urls import path
from .views import ArticleCRUD, GetCategories, GetUsersofArticles

routeList = (
    ('articles', ArticleCRUD, 'article_crud'),
)

urlpatterns = [
    path('a_cat/', GetCategories.as_view(), name='Acat'),
    path("a_users/", GetUsersofArticles.as_view(), name="Auser"),
]