from rest_framework.serializers import ModelSerializer, Serializer
from .models import Articles
from rest_framework.response import Response

class ArticleSerializer(ModelSerializer):
     
    class Meta:
        model = Articles
        fields = "__all__"


    

class ArticlesCategories(Serializer):

    def to_representation(self, instance):
        return instance


class UserofArticle(Serializer):

    def to_representation(self, instance):
        return instance