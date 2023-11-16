from django.urls import path
from . import views

urlpatterns = [
    path('addfile/<str:filename>', views.WinienimaComparer.as_view()),
]