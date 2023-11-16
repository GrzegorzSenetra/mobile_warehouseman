from django.conf import settings
from django.conf.urls import url
from django.urls import path
from theme.modules.supermagazynier.views.ListOfProducts import ListOfProducts
from theme.modules.supermagazynier.views.Document import Document
from theme.modules.supermagazynier.views.AllDocuments import AllDocuments
from theme.modules.supermagazynier.views.PrintTag import PrintTag
from theme.modules.supermagazynier.views.Product import Product
from theme.modules.supermagazynier.views.AppInfo import AppInfo
from theme.modules.supermagazynier.views.TagsGetter import TagsGetter
from theme.modules.supermagazynier.views.VerifyDocument import VerifyDocument
from theme.modules.supermagazynier.views.VerifyProduct import VerifyProduct
from theme.modules.supermagazynier.views.FavouriteTags import FavouriteTags
from theme.modules.supermagazynier.views.PrintAllTags import PrintAllTags
from theme.modules.supermagazynier.views.LabelCreator import LabelCreator
from theme.modules.supermagazynier.views.Settings import Settings
from theme.modules.supermagazynier.views.NewPzFinder import NewPzFinder
from theme.modules.supermagazynier.views.MagAnalyzer import MagAnalyzer

urlpatterns = [
    path('analyze_mag/<str:ean>', MagAnalyzer.as_view()),
    path('analyze_mag', MagAnalyzer.as_view()),
    path('import_doc_to_app', NewPzFinder.as_view()),
    path('new_pz_find/<str:from_date>/<str:to_date>', NewPzFinder.as_view()),
    path('new_pz_find', NewPzFinder.as_view()),
    path('settings/<str:method>/<int:user>', Settings.as_view()),
    path('settings/<str:method>', Settings.as_view()),
    path('label_creator/<str:type>/<str:labelname>', LabelCreator.as_view()),
    path('label_creator/<str:type>', LabelCreator.as_view()),
    path('print_all_tags/<int:document_id>/<str:filename>', PrintAllTags.as_view()),
    path('favourite_tag/<int:user>/<str:tagname>', FavouriteTags.as_view()),
    path('favourite_tag/<int:user>', FavouriteTags.as_view()),
    path('tags/<str:filename>', TagsGetter.as_view()),
    path('tags', TagsGetter.as_view()),
    path('print_tag/<str:filename>/<int:user_id>', PrintTag.as_view()),
    path('print_tag/<str:filename>', PrintTag.as_view()),
    path('print_tag', PrintTag.as_view()),
    path('verify_product/<str:method>/document=<int:document>', VerifyProduct.as_view()),
    path('verify_product/<str:method>/document=<int:document>&phrase=<str:phrase>', VerifyProduct.as_view()),
    path('verify_product', VerifyProduct.as_view()),
    path('verify_document/<str:doc>/<int:id>', VerifyDocument.as_view()),
    path('verify_document/<str:doc>', VerifyDocument.as_view()),
    path('verify_document', VerifyDocument.as_view()),
    path('app_version/<str:version>', AppInfo.as_view()),
    path('listofproducts/<str:type>/<int:pk>', ListOfProducts.as_view()),
    path('listofproducts/<str:type>', ListOfProducts.as_view()),
    path('product/<str:type>/<str:value>', Product.as_view()),
    path('alldocuments/<str:value>', AllDocuments.as_view()),
    path('alldocuments/', AllDocuments.as_view()),
    path('document/<str:type>/<int:pk>', Document.as_view()),
    path('document/', Document.as_view()),
]