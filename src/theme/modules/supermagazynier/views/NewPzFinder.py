from re import A
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import connections
from datetime import date, timedelta

class NewPzFinder(APIView):
    def get(self, request, from_date, to_date):
        new_pzs = self.get_new_pz(from_date, to_date)
        return Response(new_pzs, content_type='application/json')
        
    def post(self, request):
        from theme.modules.supermagazynier.views.VerifyDocument import VerifyDocument
        from theme.modules.supermagazynier.models import VerifyDocument as VerifyDocumentObject
        
        doc = request.data['document_id']
        doc = doc.upper()
        existing_doc = VerifyDocumentObject.objects.filter(Title = doc)
        doc_id_to_return = 0
        if existing_doc.exists():
            print("ISTNIEJE TAKI DOC "+str(existing_doc[0].id))
            doc_id_to_return = existing_doc[0].id
        else:
            author = self.get_author_id(request.data['author'])
            doc_id_to_return = VerifyDocument.create_verify_document(VerifyDocument, doc, author)
            list_of_products = VerifyDocument.get_products_from_enova_document(VerifyDocument, doc)
            assigned_kods_to_products_dict = VerifyDocument.assign_kods_to_products(VerifyDocument, list_of_products)
            verify_products = VerifyDocument.DB_add_verify_products(VerifyDocument, doc_id_to_return, assigned_kods_to_products_dict)
        return Response(doc_id_to_return, content_type="application/json")
    
    def get_author_id(self, author_name):
        with connections['default'].cursor() as cursor:
            sql = f"SELECT id FROM users_account WHERE username like '%{author_name}%'"
            cursor.execute(sql)
            print(sql)
            row = cursor.fetchone()
            return row[0]
        
    def get_new_pz(self, from_date, to_date):
        with connections['METALZBYT_KOLEKTOR'].cursor() as cursor:
            sql = f"""
                SELECT 
                DH.[ID]
                ,DH.[NumerPelny]
                ,DH.[Data]
                ,K.[Nazwa]
                FROM [DokHandlowe] DH
                LEFT JOIN [Kontrahenci] K ON K.[ID] = DH.[Kontrahent]
                WHERE NumerPelny LIKE 'PZ%' 
                AND [Data] BETWEEN '{self.convert_date_to_mssql_date(from_date)}' AND '{self.convert_date_to_mssql_date(to_date)}'
                ORDER BY [Data] DESC
            """
            cursor.execute(sql)
            row = cursor.fetchall()
        return row
            
    def convert_to_python_date(self, date_var):
        return date_var[:4] + '-' + date_var[4:6] + '-' + date_var[6:]
            
    def convert_date_to_mssql_date(self, date_var):
        return date_var[:4] + '-' + date_var[4:6] + '-' + date_var[6:] + ' 00:00:00.000'