from django.db import connection
from rest_framework.response import Response
from rest_framework.views import APIView
from theme.modules.plancreator.classes.WorkHours import WorkHours
from theme.modules.plancreator.models import Grafik, GrafikDzien, GrafikPracownik, GrafikZmiana
from theme.modules.plancreator.serializers import GrafikDzienSerializer
import json
from types import SimpleNamespace
import datetime, calendar
import holidays
import math


class Day(APIView):
    def get(self, request):
        ...
    
    def post(self, request):
        ...
        
    def put(self, request):
        if not request.data['id']:
            return self.days_fill_switch(request.data)
        else:
            GrafikDzien.objects.filter(
                Dzien=request.data['day'], 
                Miesiac=request.data['month'], 
                Rok=request.data['year']
                ).update(
                Grafik = Grafik.objects.filter(id=1)[0],
                Pracownik = GrafikPracownik.objects.filter(id=request.data['employee'])[0],
                Rok = request.data['year'],
                Miesiac = request.data['month'],
                Dzien = request.data['day'],
                Czy_pracuje = request.data['do_employee_work'],
                Zmiana = GrafikZmiana.objects.filter(id=request.data['workhour'])[0]
                )
        return Response(request.data, content_type='application/json', status=200)
        
    def delete(self, request):
        ...
        
    def days_fill_switch(self, request_data):
        """Switches between methods of filling calendar

        Args:
            request_data (Object): object that comes from request

        Returns:
            Response: Response to request
        """
        day_adapted = self.adapt_day(request_data)
        if request_data['radio_type'] == 'single':
            single_day = self.save_single_day(day_adapted)
            return Response(single_day, content_type="application/json", status=200)
        elif request_data['radio_type'] == 'tostartfrom':
            filled_row = self.fill_all_workdays_tostartfrom(day_adapted)
            return Response(filled_row, content_type="application/json", status=200)
        elif request_data['radio_type'] == 'onlyone':
            filled_row = self.fill_all_workdays_with_only_one_workhours(day_adapted)
            return Response(filled_row, content_type="application/json", status=200)
        
    def fill_alternately(self, starting_day):
        month = starting_day['Miesiac']
        year = starting_day['Rok']
        
        for day in range(starting_day['Dzien'], calendar.monthrange(year, month)[1]+1):
            ...
        ...
        
    def fill_all_workdays_tostartfrom(self, day_to_start_from):
        """Fills all employee workdays in month. Changes filling week by week.

        Args:
            day_to_start_from ([type]): Clicked day to start filling from

        Returns:
            saved_days (list): list of days that were saved in database
        """
        month = day_to_start_from['Miesiac']
        year = day_to_start_from['Rok']
        saved_days = list()
        i = day_to_start_from['Dzien'] + 1
        
        tmp = day_to_start_from['Zmiana'] - 1
        
        for day in range(day_to_start_from['Dzien'], calendar.monthrange(year, month)[1]+1):
            
            if calendar.weekday(year, month, day) == 6:
                tmp += 1
            
            if calendar.weekday(year, month, day) < 5:
                
                day_to_save = day_to_start_from.copy()
                day_to_save['Dzien'] = day
                
                day_to_save['Zmiana'] = tmp % 3 + 1
                
                if datetime.date(year, month, day) in holidays.PL():
                    continue
                saved_day = self.save_single_day(day_to_save)
                saved_days.append(saved_day)
            i += 1
        
        
        return saved_days
        
    def fill_all_workdays_with_only_one_workhours(self, day_to_start_from):
        """Fills all employee workdays in month from mon to fri with one type of workhours.

        Args:
            day_to_start_from (Object): Clicked day to start filling from
        """
        month = day_to_start_from['Miesiac']
        year = day_to_start_from['Rok']
        saved_days = list()
        for day in range(day_to_start_from['Dzien'], calendar.monthrange(year, month)[1]+1):
            if calendar.weekday(year, month, day) < 5:
                day_to_save = day_to_start_from.copy()
                day_to_save['Dzien'] = day
                if datetime.date(year, month, day) in holidays.PL():
                    continue
                saved_day = self.save_single_day(day_to_save)
                saved_days.append(saved_day)
        return saved_days
        
    def adapt_day(self, data):
        day_adapter = {
                'Grafik': data['plan'],
                'Pracownik': data['employee'], 
                'Rok': data['year'],
                'Miesiac': data['month'],
                'Dzien': data['day'],
                'Czy_pracuje': data['do_employee_work'],
                'Zmiana': data['workhour']
            }
        return day_adapter
        
    def save_single_day(self, day_adapter):
        """Serialize and saves single workday in database

        Args:
            day_adapter ([Object]): Day object adapted for serialization

        Returns:
            Object: Object adapted for response
        """
        serializer = GrafikDzienSerializer(data=[day_adapter], many=True)
        try:
            day = GrafikDzien.objects.filter(
                Dzien=day_adapter['Dzien'], 
                Miesiac=day_adapter['Miesiac'], 
                Rok=day_adapter['Rok'],
                Pracownik=day_adapter['Pracownik'])
            
            if day.exists():
                if day_adapter['Zmiana'] == 69: # 69 == delete code send from frontend action
                    print(f"DELETED RECORD {day[0].id}")
                    with connection.cursor() as cursor:
                        cursor.execute(f'DELETE FROM plancreator_grafikdzien WHERE id = {day[0].id}')
                else:
                    with connection.cursor() as cursor:
                        cursor.execute(f'UPDATE plancreator_grafikdzien SET Zmiana_id = {day_adapter["Zmiana"]} WHERE id = {day[0].id}')
                # TU JE BŁĄD GDZIEŚ
                obj_adapter = {
                    'Grafik_id': day_adapter['Grafik'],
                    'id': day[0].id,
                    'Pracownik_id': day_adapter['Pracownik'],
                    'Rok': day[0].Rok,
                    'Miesiac': day[0].Miesiac,
                    'Dzien': day[0].Dzien,
                    'Czy_pracuje': day[0].Czy_pracuje,
                    'Zmiana_id': day_adapter['Zmiana'],
                    'Zmiana': GrafikZmiana.objects.filter(id = day_adapter['Zmiana']).values()[0]
                }
                print("DAY EXIST !!!!!!!!!!!!!!!!!!!!!!!!")
                return obj_adapter
        except Exception:
            print("EXCEPT")
        if serializer.is_valid():
            obj = serializer.save()
            obj_adapter = {
                'Grafik_id': obj[0].Grafik.id,
                'id': obj[0].id,
                'Pracownik_id': obj[0].Pracownik.id,
                'Rok': obj[0].Rok,
                'Miesiac': obj[0].Miesiac,
                'Dzien': obj[0].Dzien,
                'Czy_pracuje': obj[0].Czy_pracuje,
                'Zmiana_id': obj[0].Zmiana.id,
                'Zmiana': GrafikZmiana.objects.filter(id = obj[0].Zmiana.id).values()[0]
            }
            print("DAY DOESNT EXIST !!!!!!!!!!!!!!!!!!!!!!!!")
            return obj_adapter

    def get_all_days():
        # all_groups = list(GrafikGrupa.objects.all().values())
        # return all_groups
        ...
