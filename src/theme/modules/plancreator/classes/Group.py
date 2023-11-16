import math
from rest_framework.response import Response
from rest_framework.views import APIView
from theme.modules.plancreator.classes.Day import Day
from theme.modules.plancreator.models import Grafik, GrafikGrupa, GrafikZmiana
from theme.modules.plancreator.serializers import GrafikGrupaSerializer
from theme.modules.plancreator.classes.Employee import Employee

class Group(APIView):
    def get(self, request, id):
        if id == 'fillByGroups':
            self.fill_by_groups(request.data['date'])
            return Response("FILL BY GROUPS", content_type="application/json", status=200)
        return Response("GET HEHE", content_type="application/json", status=200)
    
    def post(self, request):
        group = self.group_adapter(request.data)
        save_response = self.save_group(group)
        return Response(save_response, content_type="application/json", status=200)
        
    def put(self, request):
        resp = list()
        if request.data['method'] == 'fillByGroups':
            all_employees = Employee.get_all_employees()
            resp = self.fill_by_groups(request.data['date'], all_employees)
        return Response(resp, content_type="application/json", status=200)
        
    def delete(self, request, id):
        GrafikGrupa.objects.filter(id=id).delete()
        return Response(status=200)
    
    def fill_by_groups(self, date: list, employees: list) -> list:
        """
        Fills all days in month depending on groups and algorithm.

        Args:
            date (dict): date dict with args (month, year)
            employees (list): list of all employees
        Returns:
            saved_days (list): list of days that were saved in database
        """
        groups = Group.get_all_groups()
        groups_iterator = self.create_groups_iterator(groups)
        saved_days = list()
        for employee in employees:
            if not GrafikGrupa.objects.values('Algorytm').get(id = employee['Grupa_id'])['Algorytm']:
                day = self.adapt_day(employee, date, 1)
                saved_days = [*saved_days, *self.save_days(day, 'fill_all_workdays_with_only_one_workhours')]
                continue
            groups_iterator[employee['Grupa_id']] += 1
            shitf = (date['month'] + groups_iterator[employee['Grupa_id']]) % 3 + 1
            day = self.adapt_day(employee, date, shitf)
            saved_days = [*saved_days, *self.save_days(day, 'fill_all_workdays_tostartfrom')]
        return saved_days
    
    def create_groups_iterator(self, groups: list) -> dict:
        """ Creates groups iterator, which is dict with groups ids as keys and 0 as values. """
        groups_iterator = dict()
        for group in groups:
            groups_iterator.update({group['id']: 0})
        return groups_iterator
            
    def save_days(self, starting_day, method) -> list:
        """ Saves day to database. """
        d = Day()
        if method == 'fill_all_workdays_tostartfrom':
            return d.fill_all_workdays_tostartfrom(starting_day)
        elif method == 'fill_all_workdays_with_only_one_workhours':
            return d.fill_all_workdays_with_only_one_workhours(starting_day)
    
    def adapt_day(self, employee, date, shift):
        """ Adapts day to serializable object for saving needs. """
        day = {
            'Grafik': 1,
            'Pracownik': employee['id'],
            'Rok': date['year'],
            'Miesiac': date['month'],
            'Dzien': 1,
            'Czy_pracuje': False,
            'Zmiana': shift
        }
        return day
        
    def save_group(self, group):
        """ Saves group to database. """
        serializer = GrafikGrupaSerializer(data=[group], many=True)
        if serializer.is_valid(raise_exception=True):
            obj = serializer.save()
            return {'id': obj[0].id, 'name': obj[0].Nazwa, 'algorithm': obj[0].Algorytm}
        else:
            return "Błędne dane grupy!"
        
    def group_adapter(self, r_group):
        group = {
            'Nazwa': r_group['name'],
            'Algorytm': r_group['algorithm']
        }
        return group

    def get_all_groups():
        all_groups = list(GrafikGrupa.objects.all().values())
        return all_groups
