from django.http.response import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from os import listdir, read
from os.path import isfile, join
from theme.modules.supermagazynier.views.Zpl2Generator import Zpl2Generator
from PIL import Image
import base64
try:
    from urllib.request import urlopen
except ImportError:
    from urllib2 import urlopen

class TagsGetter(APIView):
    def get(self, request):
        tags_path = '/home/grzegorz/metalzbyt_panel/src/theme/modules/supermagazynier/etykiety/'
        onlyfiles = [f for f in listdir(tags_path) if isfile(join(tags_path, f))]
        return Response(onlyfiles, content_type="application/json")
    
    def post(self, request, filename):
        product = request.data
        Generator = Zpl2Generator(product)
        readed_file = Generator.read_file(filename)
        image = readed_file[1]
        image_path = "/home/grzegorz/metalzbyt_panel/src/theme/modules/supermagazynier/assets/preview.png"
        image.save(image_path,"png")
        encoded_string = ''
        with open(image_path, 'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read())
        width, height = image.size
        image.close()
        return Response([encoded_string, width, height], content_type="application/json")