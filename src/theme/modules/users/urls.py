from django.conf.urls import url
from django.urls import path
from . import views


urlpatterns = [
    path('<str:type>', views.Account.as_view()),
]