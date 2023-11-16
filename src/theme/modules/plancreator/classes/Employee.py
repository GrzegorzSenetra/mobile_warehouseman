from rest_framework.response import Response
from rest_framework.views import APIView
from theme.modules.plancreator.serializers import GrafikPracownikSerializer
from theme.modules.plancreator.models import GrafikDzien, GrafikPracownik, GrafikZmiana

class Employee(APIView):
    def get(self):
        ...
        
    def post(self, request):
        print(request.data)
        employee_adapter = {
            'Imie_i_nazwisko': request.data['name']+" "+request.data['surname'],
            'Grupa': request.data['group'],
            'Czy_niepelnosprawny': request.data['disabled']
        }
        serializer = GrafikPracownikSerializer(data=[employee_adapter], many=True)
        if serializer.is_valid():
            obj = serializer.save()
            return Response(obj[0].id, content_type="application/json", status=200)
        else:
            return Response("Błędne dane pracownika!", content_type="application/json" ,status=400)
    
    def put(self, request):
        GrafikPracownik.objects.filter(id=request.data['id']).update(
            Imie_i_nazwisko=request.data['name']+" "+request.data['surname'],
            Grupa=request.data['group'],
            Czy_niepelnosprawny=request.data['disabled'])
        return Response(request.data, content_type="application/json", status=200)
    
    def delete(self, request, id):
        GrafikPracownik.objects.filter(id=id).delete()
        return Response(status=200)

    def employee_shifts_generator(employee_id: int, month: int, year: int):
        """ Yield generator for employee shifts in given month. """
        employee_shifts = GrafikDzien.objects.filter(
            Pracownik=GrafikPracownik.objects.filter(id=employee_id)[0], 
            Miesiac=month,
            Rok=year
            ).values('Zmiana_id')
        for shift_id in employee_shifts:
            yield GrafikZmiana.objects.filter(id = int(shift_id['Zmiana_id'])).values('Godz_pracy')

    def get_all_employees():
        all_employees = list(GrafikPracownik.objects.all().values())
        return all_employees
        