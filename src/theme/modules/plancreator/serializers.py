from rest_framework import serializers
from .models import Grafik, GrafikGrupa, GrafikPracownik, GrafikDzien, GrafikZmiana

class GrafikSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grafik
        fields = ['Nazwa', 'Author']
        
class GrafikGrupaSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrafikGrupa
        fields = ['Nazwa', 'Algorytm']
        
class GrafikPracownikSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrafikPracownik
        fields = ['id', 'Imie_i_nazwisko', 'Grupa', 'Czy_niepelnosprawny']
        
class GrafikDzienSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrafikDzien
        fields = ['Grafik', 'Pracownik', 'Rok', 'Miesiac', 'Dzien', 'Czy_pracuje', 'Zmiana']
        
    def update(self, instance, validated_data): 
        instance.Grafik = validated_data.get('Grafik', instance.Grafik)
        instance.Pracownik = validated_data.get('Pracownik', instance.Pracownik)
        instance.Rok = validated_data.get('Rok', instance.Rok)
        instance.Miesiac = validated_data.get('Miesiac', instance.Miesiac)
        instance.Dzien = validated_data.get('Dzien', instance.Dzien)
        instance.Czy_pracuje = validated_data.get('Czy_pracuje', instance.Czy_pracuje)
        instance.Zmiana = validated_data.get('Zmiana', instance.Zmiana)
        instance.save()
        return instance

class GrafikZmianaSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrafikZmiana
        fields = ['Nazwa', 'Godz_pracy']
