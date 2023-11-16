from django.conf.urls import url
from django.urls import path
from theme.modules.plancreator.classes.Group import Group
from theme.modules.plancreator.classes.ViewPlanCreator import ViewPlanCreator
from theme.modules.plancreator.classes.Employee import Employee
from theme.modules.plancreator.classes.Day import Day
from theme.modules.plancreator.classes.Month import Month
from theme.modules.plancreator.classes.WorkHours import WorkHours

urlpatterns = [
    path('workhours/<str:id>', WorkHours.as_view()),
    path('workhours/', WorkHours.as_view()),
    path('group/<str:id>', Group.as_view()),
    path('group/', Group.as_view()),
    path('month/<str:action>/<int:month>/<int:year>', Month.as_view()),
    path('month/', Month.as_view()),
    path('day/', Day.as_view()),
    path('employee/<int:id>', Employee.as_view()),
    path('employee/', Employee.as_view()),
    path('init/', ViewPlanCreator.as_view()),
]
