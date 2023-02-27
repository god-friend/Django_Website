from rest_framework.serializers import ModelSerializer, Serializer
from .models import Articles, Comments
from rest_framework.response import Response



class CommentSerializer(ModelSerializer):
    
    class Meta:
        model = Comments
        fields = "__all__"

    


class ArticleSerializer(ModelSerializer):
    # comment = CommentSerializer(many=True)

    class Meta:
        model = Articles
        fields = "__all__"


    

class ArticlesCategories(Serializer):

    def to_representation(self, instance):
        return instance


class UserofArticle(Serializer):

    def to_representation(self, instance):
        return instance