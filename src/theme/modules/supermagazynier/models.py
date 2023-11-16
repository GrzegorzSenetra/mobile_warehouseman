from django.db import models

# Create your models here.
from django.forms import forms

class Document(models.Model):
    Nazwa = models.CharField(max_length=200, null=True)
    Data_dodania = models.DateField()
    Author = models.IntegerField()


class ListOfProducts(models.Model):
    Document = models.ForeignKey(Document, on_delete=models.CASCADE)
    Product = models.IntegerField()
    Quantity = models.FloatField(default=0, null=True)
    class Meta:
        unique_together = (("Document","Product"),)


class VerifyDocument(models.Model):
    Author = models.IntegerField()
    Title = models.CharField(max_length=50, default="default", unique=True)
    Correctness = models.BooleanField(default=False)
    Creation_date = models.CharField(max_length=50, default='')
    
    
class VerifyProducts(models.Model):
    Document = models.ForeignKey(VerifyDocument, on_delete=models.CASCADE)
    Index = models.CharField(max_length=70)
    Name = models.CharField(max_length=250, default="")
    Code_variants = models.CharField(max_length=250, default="")
    Unit = models.CharField(default='', max_length=20)
    Quantity_counted = models.IntegerField(default=0)
    Quantity_in_store = models.IntegerField(default=0)
    Price = models.FloatField(default=0, null=True)
    ProductId = models.IntegerField(default=0)
    

class FavouriteTags(models.Model):
    User = models.IntegerField()
    Tag = models.CharField(max_length=50)
    
class LabelPrinters(models.Model):
    Name = models.CharField(max_length=255)
    Exec_name = models.CharField(max_length=255)
    
class UserSettings(models.Model):
    User = models.IntegerField()
    Label_printer = models.IntegerField()
    