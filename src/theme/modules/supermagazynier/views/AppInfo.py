from rest_framework.views import APIView
from rest_framework.response import Response

class AppInfo(APIView):
    """ Class that returns information about app version. """
    def get(self, request, version):
        current_version = "1.3.5"
        print(request.data)
        if current_version == version:
            return Response(1)
        else:
            return Response(0)