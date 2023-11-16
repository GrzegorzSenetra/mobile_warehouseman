from rest_framework.views import APIView
from rest_framework.response import Response

from theme.modules.supermagazynier.models import LabelPrinters as LabelPrintersModel, UserSettings as UserSettingsModel
from theme.modules.supermagazynier.serializers import LabelPrintersSerializer, UserSettingsSerializer

class Settings(APIView):
    """ User settings view. """
    
    def post(self, request, method, user):
        ...
        
    def get(self, request, method, user):
        return Response(self.method_manager(method, user), content_type="application/json")
    
    def put(self, request, method, user):
        self.update_settings(method, request.data)
        return Response('Ok', content_type="application/json")
        
    def method_manager(self, method, user):
        if method == 'get_printers':
            all_printers = LabelPrintersModel.objects.all()
            serializer = LabelPrintersSerializer(all_printers, many=True)
            return serializer.data
        if method == 'get_user_settings':
            user_settings = UserSettingsModel.objects.all().filter(User=user)
            serializer = UserSettingsSerializer(user_settings, many=True)
            if len(serializer.data) == 0:
                serializer = self.assign_default_settings('printer', user)
            return serializer.data
        
    def assign_default_settings(self, setting, user):
        if setting == 'printer':
            new_user_settings = {
                "User": user,
                "Label_printer": 1
            }
            serializer = UserSettingsSerializer(data=new_user_settings)
            if serializer.is_valid():
                serializer.save()
                serializer.data
                return serializer
    
    def update_settings(self, setting, request_settings):
        old_user_settings = UserSettingsModel.objects.get(User=request_settings['User'])
        if old_user_settings.Label_printer != request_settings['Label_printer']:
            old_user_settings.Label_printer = request_settings['Label_printer']
        old_user_settings.save()
        
    def getPrinterExecName(user_id):
        user_settings = UserSettingsModel.objects.get(User=user_id)
        printer = LabelPrintersModel.objects.get(id=user_settings.Label_printer)
        return printer.Exec_name
    