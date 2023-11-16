from django.db import models

# Create your models here.

class Grafik(models.Model):
    Nazwa = models.CharField(max_length=200, null=True)
    Author = models.IntegerField()

class GrafikGrupa(models.Model):
    Nazwa = models.CharField(max_length=200, null=True)
    Algorytm = models.BooleanField(default=False)

class GrafikPracownik(models.Model):
    Imie_i_nazwisko = models.CharField(max_length=200, null=True)
    Grupa = models.ForeignKey(GrafikGrupa, on_delete=models.CASCADE)
    Czy_niepelnosprawny = models.BooleanField(default=False)

class GrafikZmiana(models.Model):
    Nazwa = models.CharField(max_length=50, null=True)
    Godz_pracy = models.CharField(max_length=20, null=True)

class GrafikDzien(models.Model):
    Grafik = models.ForeignKey(Grafik, on_delete=models.CASCADE)
    Pracownik = models.ForeignKey(GrafikPracownik, on_delete=models.CASCADE)
    Rok = models.IntegerField(null=True)
    Miesiac = models.IntegerField(null=True)
    Dzien = models.IntegerField(null=True)
    Czy_pracuje = models.BooleanField(default=False)
    Zmiana = models.ForeignKey(GrafikZmiana, on_delete=models.CASCADE)
