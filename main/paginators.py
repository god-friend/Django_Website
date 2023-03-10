from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    max_page_size = 5
    page_size = 2
    page_query_param = "page"
    page_size_query_param = "show"
    last_page_strings = ('end', 'last')

    def get_paginated_response(self, data):
        res = {
            "next": self.get_next_link(),
            "prev": self.get_previous_link(),
            "result": data,
        }
        return Response(res)
