from rest_framework.permissions import BasePermission

class IsUserPost(BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True
        return obj.created_by == request.user