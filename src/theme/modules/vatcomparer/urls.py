from django.urls import path
from . import views

urlpatterns = [
    path('addfile', views.VatComparer.as_view()),
]