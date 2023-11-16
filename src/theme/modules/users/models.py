from django.db import models

# Create your models here.

class Account(models.Model):
    email = models.CharField(unique=True, max_length=200)
    username = models.CharField(unique=True, max_length=200)
    password = models.CharField(max_length=255)
    accepted = models.BooleanField(default=False)
    token = models.CharField(max_length=200)
    webtoken = models.CharField(max_length=200, default=0)