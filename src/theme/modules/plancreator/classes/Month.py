from rest_framework.response import Response
from rest_framework.views import APIView
import datetime, calendar
import holidays

from theme.modules.plancreator.models import GrafikDzien, GrafikZmiana


class Month(APIView):
    
    month: int
    year: int
    
    def get(self, request, action, month, year):
        
        self.month = month
        self.year = year
                
        if action == 'workdays':
            workdays = self.get_workdays(month, year)
            for day in workdays:
                day['Zmiana'] = GrafikZmiana.objects.filter(id = day['Zmiana_id']).values()[0]
            return Response(workdays, content_type="application/json", status=200)
        
        elif action == 'monthlynorm':
            monthly_norm = self.monthly_norm()
            print(monthly_norm)
            return Response(monthly_norm, content_type="application/json", status=200)
    
    def post(self, request):
        ...
        
    def put(self, request):
        ...
        
    def delete(self, request):
        ...
        
    def monthly_norm(self):
        
        norm: int = 0
        
        for day in range(1, calendar.monthrange(self.year, self.month)[1]+1):
            if calendar.weekday(self.year, self.month, day) < 5 and datetime.date(self.year, self.month, day) not in holidays.PL():
                norm += 8
            if calendar.weekday(self.year, self.month, day) == 5 and datetime.date(self.year, self.month, day) in holidays.PL():
                norm -= 8
        
        return norm

    def get_workdays(self, month, year):
        workdays = list(GrafikDzien.objects.filter(Miesiac = month, Rok = year).values())
        return workdays
