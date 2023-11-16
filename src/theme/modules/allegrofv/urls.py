from django.conf.urls import url
from django.urls import path

from theme.modules.allegrofv.views import AllegroFVFinder
from . import views


urlpatterns = [
    path('fvfinder', views.AllegroFVFinder.as_view()),
    path('fvfinder/<str:filename>', views.AllegroFVFinder.as_view()),
]