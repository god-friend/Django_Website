"""Website URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from quiz.urls import routeList as Qr
from main.urls import routeList as Mr
from article.urls import routeList as Ar

api_router = DefaultRouter()
main_router = DefaultRouter()

routesList = [Qr, Ar]

for routes in routesList:
    for route in routes:
        api_router.register(route[0], route[1], basename=route[2])

for route in Mr:
    main_router.register(route[0], route[1], basename=route[2])


urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('rest_framework.urls'), name='rest_frame'),
    path('api/', include('quiz.urls')),
    path('api/', include(api_router.urls)),
    path('api/', include('article.urls')),
    path('', include("main.urls")),
    path('', include(main_router.urls)),
    
]
