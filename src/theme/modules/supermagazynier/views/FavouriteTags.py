from django.http.response import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from os import listdir, read, system
from os.path import isfile, join
import urllib
import subprocess
from smb.SMBHandler import SMBHandler
from theme.modules.supermagazynier.models import FavouriteTags as FavouriteTagsObject
from theme.modules.supermagazynier.serializers import FavouriteTagsSerializer

class FavouriteTags(APIView):
    """ Handles favourite tags. """
    def get(self, request, user):
        onlyfiles = self.get_files()
        files_with_favs = self.generate_files_with_favs_dict(user, onlyfiles)
        return Response(files_with_favs, content_type="application/json")
    
    def post(self, request, user, tagname):
        self.favourites_action_handler(user, tagname)
        return Response(tagname, content_type="application/json")
    
    def myFunc(self, e):
        return e['is_fav']
    
    def generate_files_with_favs_dict(self, user, files):
        files_list = list()
        for file in files:
            file_with_fav = self.assign_fav2file(user, file)
            files_list.append(next(file_with_fav))
        files_list.sort(reverse=True, key=self.myFunc)
        return files_list
    
    def assign_fav2file(self, user, file):
        obj = FavouriteTagsObject.objects.filter(User=user, Tag=file)
        if obj.exists():
            yield {'filename': file, 'is_fav': True}
        else:
            yield {'filename': file, 'is_fav': False}

    def get_files(self):
        # TODO: soft code that path
        tags_path = '/home/grzegorz/metalzbyt_panel/src/theme/modules/supermagazynier/etykiety/'
        onlyfiles = [f for f in listdir(tags_path) if isfile(join(tags_path, f))]
        return onlyfiles

    def samba_get_files(self):
        command = "smbclient -U m.mazol%h3CQVVR6 //192.168.1.211/ETYKIETY/"
        system(command)
        list_files = subprocess.run(["ls", "-l"])
        print(list_files)
    
    def favourites_action_handler(self, user, tagname):
        """Obsługuje akcje dodania lub usunięcia metki do/z ulubionych."""
        obj = FavouriteTagsObject.objects.filter(User=user, Tag=tagname)
        if not obj.exists():
            serializer = FavouriteTagsSerializer(data={'User':user,'Tag':tagname})
            serializer.is_valid(raise_exception=True)
            serializer.save()
        else:
            obj.delete()