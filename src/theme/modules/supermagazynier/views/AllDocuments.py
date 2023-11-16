from rest_framework.views import APIView
from rest_framework.response import Response
from theme.modules.users.models import Account as AccountObject
from theme.modules.supermagazynier.models import Document as DocumentObject, ListOfProducts as ListOfProductsObject
from theme.modules.supermagazynier.serializers import DocumentSerializer

class AllDocuments(APIView):
    """Widok zwracający listę dokumentów.
    
    Endpoints:
    - alldocuments/<str:value> value może przyjmować wartość 
        - 0<username> - endpoint zwraca dokumenty danego autora o jego username'ie
        - 1 - endpoint zwraca wszystkie dokumenty
        - <nazwa> - zwraca dokumenty zawierające podaną nazwę lub jej część
    """
    def get(self, request, value):
        if value[0] == '0':
            author = AccountObject.objects.get(username=value[1:])
            documents = DocumentObject.objects.filter(Author = author.id).order_by('-id')
            serializer = DocumentSerializer(documents, many=True)
            for i in range(len(documents)):
                author = AccountObject.objects.filter(id=serializer.data[i]['Author'])
                for a in author:
                    serializer.data[i]['Author'] = a.username
                serializer.data[i]['count_elements'] = len(ListOfProductsObject.objects.filter(Document_id = serializer.data[i]['id']))

            return Response(serializer.data, content_type='application/json')
        elif value == '1':
            documents = DocumentObject.objects.all().order_by('-id')
            serializer = DocumentSerializer(documents, many=True)
            for i in range(len(documents)):
                author = AccountObject.objects.filter(id=serializer.data[i]['Author'])
                for a in author:
                    serializer.data[i]['Author'] = a.username

            return Response(serializer.data, content_type='application/json')
        else:
            documents = DocumentObject.objects.all().filter(Nazwa__contains=value, Author = request.session['id_user']).order_by('-id')
            serializer = DocumentSerializer(documents, many=True)
            for i in range(len(documents)):
                author = AccountObject.objects.filter(id=serializer.data[i]['Author'])
                for a in author:
                    serializer.data[i]['Author'] = a.username
                serializer.data[i]['count_elements'] = len(ListOfProductsObject.objects.filter(Document_id=serializer.data[i]['id']))

            return Response(serializer.data, content_type='application/json')