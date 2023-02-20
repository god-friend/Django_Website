from rest_framework.viewsets import ModelViewSet
from .models import Articles
from .serializers import ArticleSerializer, ArticlesCategories, UserofArticle
from .paginators import ArticlePagination
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .permissions import IsUserPost
from rest_framework.generics import ListAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK

class ArticleCRUD(ModelViewSet):
    queryset = Articles.objects.all().order_by("-created")
    serializer_class = ArticleSerializer
    pagination_class = ArticlePagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ('category', 'created_by',)
    permission_classes = [IsAuthenticatedOrReadOnly, IsUserPost]
    authentication_classes = [SessionAuthentication]

    def create(self, request, *args, **kwargs):
        if(request.data['created_by'] != str(request.user)):
            return Response({"detail": "You put {name} in created_by columns. It should be your username.".format(name=request.data['created_by'])})
        else:
            serialize = ArticleSerializer(data=request.data)
            if serialize.is_valid():
                obj = Articles.objects.create(**serialize.validated_data)
                obj_serialize = ArticleSerializer(obj)
                return Response(obj_serialize.data, status=HTTP_200_OK)
            return Response(status=HTTP_400_BAD_REQUEST)


class GetCategories(ListAPIView):
    queryset = Articles.objects.values_list("category", flat=True).distinct().order_by('-category')
    serializer_class = ArticlesCategories
    pagination_class = ArticlePagination


class GetUsersofArticles(ListAPIView):
    queryset = Articles.objects.values_list("created_by", flat=True).distinct().order_by('-created_by')
    serializer_class = UserofArticle
    pagination_class = ArticlePagination


