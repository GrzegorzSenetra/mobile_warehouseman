from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import connections
from urllib.parse import unquote

from theme.modules.supermagazynier.models import VerifyProducts as VerifyProductsObject
from theme.modules.supermagazynier.serializers import VerifyProductsSerializer

class VerifyProduct(APIView):
    def __init__(self):
        product = {
            'id': 0,
            'Document': 0,
            'Index': 0,
            'Name': '',
            'Code_variants': '',
            'Unit': '',
            'Quantity_counted': 0,
            'Quantity_in_store': 0,
            'Price': 0.0,
            'ProductId': 0
        }
        searched_products = list()
    
    def get(self, request, method, document, phrase):
        if method == 'searchproduct':
            self.get_product_by_phrase(document, phrase)
            return Response(self.searched_products, content_type="application/json")
        if method == 'checkdocumentcorrectness':
            documentCorrectness = self.check_document_correctness(document)
            self.update_document_correctness(document, documentCorrectness)
            
            print(documentCorrectness)
            return Response(documentCorrectness, content_type="application/json")
        return Response(phrase, content_type="application/json")
    
    def post():
        ...
    
    def put(self, request):
        self.save_product(request.data["id"], request.data["quantity"])
        quantity_correctness = self.check_quantity_correctness(request.data["id"])
        return Response(quantity_correctness, content_type="application/json")
    
    def delete():
        ...
        
    def update_document_correctness(self, documentId, correctness):
        with connections['default'].cursor() as cursor:
            sql = f"""
            UPDATE supermagazynier_verifydocument
            SET Correctness = {correctness}
            WHERE id = {documentId}
            """
            cursor.execute(sql)
        
    def check_document_correctness(self, documentId):
        with connections['default'].cursor() as cursor:
            sql = f"""
            SELECT *
            FROM supermagazynier_verifyproducts
            WHERE Document_id = {documentId}
            """
            cursor.execute(sql)
            rows = cursor.fetchall()
            correctness: bool = True
            for row in rows:
                print(row)
                if row[3] != row[4]:
                    correctness = False
                    break
        return correctness
        
        
    def check_quantity_correctness(self, productId):
        with connections['default'].cursor() as cursor:
            sql = f"""
            SELECT Quantity_counted, Quantity_in_store
            FROM supermagazynier_verifyproducts
            WHERE id = {productId}
            """
            cursor.execute(sql)
            row = cursor.fetchall()[0]
        return row[0] == row[1]
        
    def get_product_by_phrase(self, document, phrase):
        phrase = unquote(phrase)
        searched_products = list()
        with connections['default'].cursor() as cursor:
            sql = f"""
            SELECT * FROM supermagazynier_verifyproducts 
            WHERE `Document_id` = {document} AND (`Index` LIKE '%{phrase}%' OR `Name` LIKE '%{phrase}%')
            """
            cursor.execute(sql)
            rows = cursor.fetchall()
            for row in rows:
                product = {
                    'id': row[0],
                    'Document': row[2],
                    'Index': row[1],
                    'Name': row[6],
                    'Code_variants': row[5],
                    'Unit': row[7],
                    'Quantity_counted': row[3],
                    'Quantity_in_store': row[4],
                    'Price': row[8],
                    'ProductId': row[9]
                }
                searched_products.append(product)
        self.searched_products = searched_products
        return 0
    
    def save_product(self, id, quantity):
        with connections['default'].cursor() as cursor:
            sql = f"""
            UPDATE supermagazynier_verifyproducts 
            SET Quantity_counted = {quantity}
            WHERE id = {id}
            """
            cursor.execute(sql)
            row = cursor.fetchall()
        return row