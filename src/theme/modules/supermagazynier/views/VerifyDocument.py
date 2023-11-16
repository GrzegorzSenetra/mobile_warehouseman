from inspect import _void
from django.db import connections
from rest_framework.views import APIView
from rest_framework.response import Response
import urllib.parse
import json

from theme.modules.supermagazynier.models import VerifyDocument as VerifyDocumentObject, VerifyProducts as VerifyProductsObject
from theme.modules.supermagazynier.serializers import VerifyDocumentSerializer, VerifyProductsSerializer

class VerifyDocument(APIView):
    """Widok obsługujący funkcjonalność weryfikowania dokumentów."""
    def get(self, request, doc, id):
        """Zwraca listę dokumentów weryfikacyjnych, poj. dokument lub listę produktów w dokumencie.

        Args:
            doc (_type_): 
                get_all_documents zwraca wszystkie dokumenty weryfikacyjne.
                get_verify_products zwraca wszystkie produkty z danego dokumentu weryfikacyjnego.
            id (_type_): id dokumentu weryfikacyjnego.

        Returns:
            Response: Json response.
        """
        if(doc == 'get_all_documents'):
            all_documents = self.get_all_documents()
            return Response(all_documents, content_type="application/json")
        if(doc == 'get_verify_products'):
            verify_products = self.get_verify_products(id)
            return Response(verify_products, content_type="application/json")
        doc = doc.replace("$", "/")
        doc = doc.upper()
        existing_doc = VerifyDocumentObject.objects.filter(Title = doc)
        doc_id_to_return = 0
        if existing_doc.exists():
            print("ISTNIEJE TAKI DOC "+str(existing_doc[0].id))
            doc_id_to_return = existing_doc[0].id
        else:
            doc_id_to_return = self.create_verify_document(doc, id)
            list_of_products = self.get_products_from_enova_document(doc)
            assigned_kods_to_products_dict = self.assign_kods_to_products(list_of_products)
            verify_products = self.DB_add_verify_products(doc_id_to_return, assigned_kods_to_products_dict)
        return Response(doc_id_to_return, content_type="application/json")
    
    def post(self, request):
        req = request.data
        
        serialized_request = {
            'Author': req['author'],
            'Title': req['title'].upper()
        }
        
        if(req['action'] == 'get_collect_products'):
            existing_doc = VerifyDocumentObject.objects.filter(Title = req['title'].upper())
            doc_id_to_return = 0
            if existing_doc.exists():
                print("ISTNIEJE TAKI DOC "+str(existing_doc[0].id))
                doc_id_to_return = existing_doc[0].id
                return Response(doc_id_to_return, content_type="application/json")
            doc_id_to_return = self.create_verify_document(req['title'].upper(), req['author'])
            collect_products = self.get_collect_products_data_from_qr_code(req['qrurl'])
            self.DB_add_collect_products(doc_id_to_return, collect_products)
            return Response(doc_id_to_return, content_type="application/json")
        
        object_exist = VerifyDocumentObject.objects.filter(Title=req['title']).exists()
        if not object_exist:
            serializer = VerifyDocumentSerializer(data=serialized_request)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response(req, content_type="application/json")
    
    def delete(self, request, doc, id):
        VerifyDocumentObject.objects.filter(id=id).delete()
        return Response(f"Deleted {id}", content_type="application/json")
    
    def create_verify_document(self, doc_name, author):
        serializer_adapter = {
            "Author": author,
            "Title": doc_name
        }
        serializer = VerifyDocumentSerializer(data=serializer_adapter)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        return obj.id
        
    def DB_add_verify_products(self, id_doc, products):
        for product in products:
            serialized_obj = {
                "Document": id_doc,
                "Index": product,
                "Name": products[product][0][6],
                "Code_variants": self.stringify_code_variants(self, products[product]),
                "Unit": products[product][0][4],
                "Quantity_counted": 0,
                "Quantity_in_store": products[product][0][17],
                "Price": float("{:10.2f}".format(products[product][0][10] * 1.23))
            }
            serializer = VerifyProductsSerializer(data=serialized_obj)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        
    def stringify_code_variants(self, product):
        stringified_variants_arr = ""
        for variant in product:
            stringified_variants_arr += "'" + variant[19] + "'" + ","
        return stringified_variants_arr[:-1]

    def get_verify_products(self, id_doc):
        products = list()
        for product in VerifyProductsObject.objects.filter(Document_id = id_doc):
            serialized_obj = {
                "id": product.id,
                "Document": product.Document.id,
                "Index": product.Index,
                "Name": product.Name,
                "Code_variants": product.Code_variants,
                "Unit": product.Unit,
                "Quantity_counted": product.Quantity_counted,
                "Quantity_in_store": product.Quantity_in_store,
                "Price": product.Price,
                "ProductId": product.ProductId
            }
            products.append(serialized_obj)
        return products
    
    def duplicate_when_there_is_only_one_kod(self, products_dict):
        for product in products_dict:
            repeats = len(products_dict[product])
            if repeats == 1:
                products_dict[product] = [products_dict[product][0],products_dict[product][0]]
    
    def change_quantities_based_on_memory(self, list_of_products, document):
        products_with_quantities = list()
        for product in list_of_products:
            memory_product = VerifyProductsObject.objects.get(Index=product, Document_id=document)
            if memory_product:
                products_with_quantities.append([list_of_products[product], memory_product.Quantity])
            else:
                products_with_quantities.append([list_of_products[product], 0])
        return products_with_quantities
    
    def assign_kods_to_products(self, products_list):
        indexes_set = set()
        assigned_kods_to_products_dict = {}
        for product in products_list:
            indexes_set.add(product[5])
        for key in indexes_set:
            assigned_kods_to_products_dict[key] = []
        for index in indexes_set:
            for product in products_list:
                if index == product[5]:
                    assigned_kods_to_products_dict[index].append(product)
        return assigned_kods_to_products_dict
    
    def get_products_from_enova_document(self, doc_id):
        """Pobiera listę produktów z dokumentu enovy o podanym identyfikatorze.
        W liście znajdują się powtórzenia tych samych produktów ale z innymi kodami.

        Args:
            doc_id (str): Identyfikator dokumentu

        Returns:
            List_of_lists: Lista list (jeden produkt = jedna lista)
        """
        with connections['METALZBYT_KOLEKTOR'].cursor() as cursor:
            sql = f'''SELECT 
                    T0.ID,
                    T0.Guid,T0.EAN, T0.NumerKatalogowy,
                    T2.Kod as jm, T0.Kod, T0.Nazwa,CAST (T0.Opis AS NVARCHAR(MAX)) as Opis,
                    (SELECT sum(T1.[IloscValue]) FROM Zasoby T1
                    WHERE T1.Magazyn != 8 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as 'quantity',
                    (SELECT MAX(T8.PartiaWartosc/T8.IloscValue) FROM Zasoby T8
                    WHERE T0.id = T8.Towar AND T8.PartiaPierwotnaTyp = 1 GROUP BY T8.Towar) as 'cenazakupu',
                    T5.NettoValue as 'Cena hurtowa', T6.NettoValue as 'Cena detaliczna',
                    T7.NettoValue as 'Cena sklep internetowy',
                    (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 9 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m2,
                    (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 5 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m1,
                    (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 1 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m6
                    ,T21.NumerPelny,T22.IloscValue, T22.IloscSymbol,T11.Kod as 'PozostaleEan'
                    FROM DokHandlowe T21
                    JOIN PozycjeDokHan T22 ON T22.Dokument = T21.ID
                    JOIN Towary T0 ON T0.ID = T22.Towar
                    LEFT JOIN Jednostki T2 ON T2.ID = T0.Jednostka
                    LEFT JOIN Features T3 ON (T3.ParentType LIKE 'Towary'
                    AND T3.[Name] LIKE 'Sklep internetowy'
                    AND T3.Parent=T0.ID)
                    LEFT JOIN Features T10 ON (T10.Parent=T0.ID AND T10.ParentType LIKE 'Towary' AND T10.[Name] LIKE 'Producent')
                    LEFT JOIN  Features T9 ON (T9.Parent=T0.ID AND T9.ParentType LIKE 'Towary' AND T9.[Name] LIKE 'Asortyment')
                    LEFT JOIN  Ceny T5 ON (T5.Towar = T0.ID AND T5.Definicja = 2 AND T5.NettoSymbol='PLN')
                    LEFT JOIN  Ceny T6 ON (T6.Towar = T0.ID AND T6.Definicja = 3 AND T6.NettoSymbol='PLN')
                    LEFT JOIN  Ceny T7 ON (T7.Towar = T0.ID AND T7.Definicja = 9 AND T7.NettoSymbol='PLN')
                    LEFT JOIN  KodyKreskowe T11 ON T11.Zapis = T0.ID
                    WHERE T11.ZapisType LIKE 'Towary' AND T21.NumerPelny LIKE '{doc_id}' ORDER BY T21.ID DESC
                '''
            cursor.execute(sql)
            row = cursor.fetchall()
        return row
    
    def get_all_documents(self):
        with connections['default'].cursor() as cursor:
            sql = f"""
            SELECT * FROM supermagazynier_verifydocument 
            WHERE 1
            ORDER BY id DESC
            """
            cursor.execute(sql)
            row = cursor.fetchall()
        return row
    
    def get_collect_products_data_from_qr_code(self, url):
        import requests
        r = requests.get(url)
        rjson = r.json()
        return rjson
    
    def stringify_code_variants_4_collect_products(self, code_variants):
        stringified_variants_arr = ""
        for variant in code_variants:
            stringified_variants_arr += "'" + variant + "'" + ","
        return stringified_variants_arr[:-1]
    
    def DB_add_collect_products(self, id_doc: int, products: dict) -> _void:
        for product in products:
            serialized_obj = dict()
            for order_id in products[product]["info"]:
                serialized_obj = {
                    "Document": id_doc,
                    "Index": products[product]["info"][order_id]["product_reference"],
                    "Name": products[product]["info"][order_id]["product_name"],
                    "Code_variants": self.stringify_code_variants_4_collect_products([
                            products[product]["info"][order_id]["product_ean13"],
                            products[product]["info"][order_id]["ean13"],
                            products[product]["info"][order_id]["product_reference"],
                            products[product]["info"][order_id]["reference"],
                        ]),
                    "Unit": products[product]["info"][order_id]["unity"],
                    "Quantity_counted": 0,
                    "Price": float(products[product]["info"][order_id]["pricedetal"]),
                    "ProductId": int(products[product]["info"][order_id]["id_enova"])
                }
            serialized_obj["Quantity_in_store"] = products[product]["info"][order_id]["product_quantity"]
            serializer = VerifyProductsSerializer(data=serialized_obj)
            serializer.is_valid(raise_exception=True)
            serializer.save()