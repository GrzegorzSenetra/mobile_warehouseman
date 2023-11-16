from django.conf.urls import include, url
from django.urls import path

from theme.views import index
from . import views

urlpatterns = [
    path('plancreator/', include('theme.modules.plancreator.urls')),
    path('plancreator', views.index),
    path('allegro_fv/', include('theme.modules.allegrofv.urls')),
    path('allegro_fv', views.index),
    path('inventoryturnoverratiocalculator/', include('theme.modules.inventoryturnoverratio.urls')),
    path('inventoryturnoverratiocalculator', views.index),
    path('winienima/', include('theme.modules.winienima.urls')),
    path('winienima', views.index),
    path('vatcomparer/', include('theme.modules.vatcomparer.urls')),
    path('vatcomparer', views.index),
    path('eantocsv/', include('theme.modules.eantocsv.urls')),
    path('eantocsv/',views.index),
    path('supercomparer',views.index),
    path('test', views.index),
    url(r'^supermagazynier', views.index),
    path('', include('theme.modules.supermagazynier.urls')),
    path('account/', include('theme.modules.users.urls')),
    # match the root
    url(r'^$', views.index),
    # match all other pages
    url('0.main.js', views.index),
    url('sign_in', views.index),
    url('panel', views.index)
]