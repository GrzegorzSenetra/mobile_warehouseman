from rest_framework.response import Response
from rest_framework.views import APIView
from theme.modules.plancreator.classes.Employee import Employee
from theme.modules.plancreator.classes.Group import Group
from theme.modules.plancreator.classes.WorkHours import WorkHours

class ViewPlanCreator(APIView):
    def get(self, request):
        init_data = self.initialize_data()
        return Response(init_data, content_type="application/json", status=200)
        
    def post(self):
        ...
        
    def initialize_data(self):
        all_employees = Employee.get_all_employees()
        all_groups = Group.get_all_groups()
        all_workHours = WorkHours.get_all_workhours()
               
        init_data_obj = {
            'employees': all_employees,
            'groups': all_groups,
            'workhours': all_workHours
        }
        return init_data_obj