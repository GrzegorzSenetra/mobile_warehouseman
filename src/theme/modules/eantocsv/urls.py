from django.conf.urls import url
from django.urls import path

from theme.modules.eantocsv.views import KonwerterCSV
from . import views


urlpatterns = [
    path('konwertcsv', views.KonwerterCSV.as_view()),
    path('konwertexcel/<str:filename>', views.KonwerterExcel.as_view()),
]