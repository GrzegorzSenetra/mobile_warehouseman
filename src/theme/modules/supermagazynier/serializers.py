from rest_framework import serializers
from .models import Document, FavouriteTags, ListOfProducts, VerifyDocument, VerifyProducts, LabelPrinters, UserSettings

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'Nazwa', 'Data_dodania', 'Author']


class ListOfProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListOfProducts
        fields = ['Document', 'Product', 'Quantity']


class VerifyDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerifyDocument
        fields = ['Author', 'Title']
        

class VerifyProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerifyProducts
        fields = ['Document', 'Index', 'Name', 'Code_variants', 'Unit', 'Quantity_counted', 'Quantity_in_store', 'Price', 'ProductId']
        

class FavouriteTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavouriteTags
        fields = ['User', 'Tag']
        
class LabelPrintersSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabelPrinters
        fields = ['id', 'Name', 'Exec_name']
        
class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ['User', 'Label_printer']

    