from rest_framework.response import Response
from rest_framework.views import APIView
from theme.modules.plancreator.classes.Employee import Employee
from theme.modules.plancreator.models import GrafikZmiana


class WorkHours(APIView):
    
    def get(self, request):
        return Response("", content_type="application/json")
    
    def post(self, request):
        data = request.data
        if data['method'] == 'countHours':
            workhours = self.count_workhours(int(data['employeeId']), int(data['month']), int(data['year']))
            return Response(workhours, content_type="application/json")
        return Response("", content_type="application/json")
        
    def put(self, request):
        ...
        
    def delete(self, request):
        ...
        
    def count_workhours(self, employee_id: int, month: int, year: int) -> int:
        """ Counting all workhours for single employee. """
        workhours: int = 0
        for shift in Employee.employee_shifts_generator(employee_id, month, year):
            shift_workhours = self.sum_workhours_in_shift(shift[0]['Godz_pracy'])
            workhours += shift_workhours
        return workhours
            
    def sum_workhours_in_shift(self, shift: str) -> int:
        from_to = shift.split("-")
        if len(from_to) != 2:
            return 0
        return int(from_to[1]) - int(from_to[0])

    def get_all_workhours():
        all_workhours = list(GrafikZmiana.objects.all().values())
        return all_workhours
