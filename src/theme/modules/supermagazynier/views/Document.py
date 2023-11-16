from rest_framework import status
from rest_framework.views import APIView
from django.http import Http404
from rest_framework.response import Response
from datetime import date
from django.db import connections
from theme.modules.supermagazynier.models import Document as DocumentObject, ListOfProducts as ListOfProductsObject
from theme.modules.supermagazynier.serializers import DocumentSerializer, ListOfProductsSerializer

class Document(APIView):
    """ Class that handles SuperMagazynier Document objects """
    @staticmethod
    def get_object(pk):
        try:
            return DocumentObject.objects.get(id=pk)
        except DocumentObject.DoesNotExist:
            raise Http404('Document doesnt exist')

    def get(self, request, pk, type):
        document = self.get_object(pk)
        serializer = DocumentSerializer(document)
        if type == 'export_to_csv':
            csvStr = self.exportToCSV(document)
            return Response(csvStr)
        else:
            return Response(serializer.data, content_type="application/json")

    def post(self, request):
        rqt = request.data
        document = {
            'Nazwa':        rqt['title'],
            'Data_dodania': date.today(),
            'Author':       rqt['author']
        }
        serializer = DocumentSerializer(data=document)
        serializer.is_valid(raise_exception=True)
        saved_document = serializer.save()
        saved_document.Nazwa = "DOC/" + str(saved_document.Author) + "/" + str(saved_document.id) + "/" + saved_document.Nazwa
        saved_document.save()
        for product in rqt['list']:
            list_of_products = {
                'Document': saved_document.id,
                'Product':  0,
                'Quantity': product['quantity']
            }
            selected_product = self.getProductFromEnova(product['Kod'])
            list_of_products['Product'] = selected_product['id']
            serializer = ListOfProductsSerializer(data=list_of_products)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response(saved_document.id, content_type="application/json")

    def put(self, request, pk, type):
        rqt = request.data
        product = {
            "id":       rqt["id"],
            "quantity": rqt["quantity"],
            "document": pk
        }
        self.product_exists_in_doc(product)
        if product['quantity'] == 0:
            with connections['default'].cursor() as cursor:
                cursor.execute('DELETE FROM supermagazynier_listofproducts WHERE Product = %s AND Document_id = %s', [str(product['id']), str(product['document'])])
        else:
            with connections['default'].cursor() as cursor:
                cursor.execute('REPLACE INTO supermagazynier_listofproducts(Product, Quantity, Document_id) VALUES(%s, %s, %s)', [str(product['id']), str(product['quantity']), str(product['document'])])
        return Response(rqt)
    
    def product_exists_in_doc(self, product):
        print("=========DEBUG-FN: product_exists_in_doc===========")
        

    def delete(self, request, pk, type, format=None):
        document = self.get_object(pk)
        document.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def exportToCSV(self, document):
        csvStr = "Towar.Kod;Towar:Kod;Ilosc;\n"
        list_of_products = self.getListOfProductsFromDocument(document.id)
        for product in list_of_products:
            quantity = str(product['Quantity']).replace(".", ",")
            csvStr += product['Product']['Kod']+";"+product['Product']['Kod']+";"+quantity+"\n"

        return csvStr
    
    def getProductFromEnova(self, kod_kreskowy):
        kod_kreskowy = kod_kreskowy.replace(" ", "%")
        kod_kreskowy = kod_kreskowy.replace("'", "'+nchar(39)+'")
        with connections['METALZBYT_KOLEKTOR'].cursor() as cursor: # CAST (T0.Opis AS NVARCHAR(MAX)) as Opis
            sql = f'''select DISTINCT  1,
            1 as 'maincategory',
            T10.Data as 'producent', 
            T3.Data as active,T0.ID, 
            T0.Guid,T0.EAN, T0.NumerKatalogowy,
            T2.Kod as jm, T0.Kod, T0.Nazwa,1 as Opis,  
            (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  
            WHERE T1.Magazyn != 8 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as 'quantity', 
            (SELECT MAX(T8.PartiaWartosc/T8.IloscValue) FROM Zasoby T8  
            WHERE T0.id = T8.Towar AND T8.PartiaPierwotnaTyp = 1 GROUP BY T8.Towar) as 'cenazakupu', 
            T5.NettoValue as 'Cena hurtowa', T6.NettoValue as 'Cena detaliczna', 
            T7.NettoValue as 'Cena sklep internetowy', 
            (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 9 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m2,
            (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 5 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m1,
            (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 1 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m6
            FROM Towary T0  
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
            WHERE T0.Kod LIKE '{kod_kreskowy}' OR T0.EAN LIKE '{kod_kreskowy}' OR T11.Kod LIKE '{kod_kreskowy}'  ORDER BY quantity DESC'''
            cursor.execute(sql)
            many_rows = cursor.fetchall()
            print(len(many_rows))
            if len(many_rows) == 1:
                row = many_rows[0]
                jsonRow = {
                    'lp':                   row[0],
                    'Kategoria':            row[1],
                    'Producent':            row[2],
                    'cos':                  row[3],
                    'id':                   row[4],
                    'Guid':                 row[5],
                    'EAN':                  row[6],
                    'NumerKatalogowy':      row[7],
                    'jm':                   row[8],
                    'Kod':                  row[9],
                    'Nazwa':                row[10],
                    'Opis':                 row[11],
                    'Ilosc':                row[12],
                    'CenaZakupu':           row[13],
                    'CenaDetaliczna':       row[14],
                    'CenaSklepInternetowy': row[15],
                    'cos2':                 row[16],
                    'm2':                   row[17],
                    'm1':                   row[18],
                    'm6':                   row[19]
                }
                print("PIERWSZA OPCJA")
                print(jsonRow)
                return jsonRow
            else:
                rows_tab = []
                for row in many_rows:
                    jsonRow = {
                        'lp':                   row[0],
                        'Kategoria':            row[1],
                        'Producent':            row[2],
                        'cos':                  row[3],
                        'id':                   row[4],
                        'Guid':                 row[5],
                        'EAN':                  row[6],
                        'NumerKatalogowy':      row[7],
                        'jm':                   row[8],
                        'Kod':                  row[9],
                        'Nazwa':                row[10],
                        'Opis':                 row[11],
                        'Ilosc':                row[12],
                        'CenaZakupu':           row[13],
                        'CenaDetaliczna':       row[14],
                        'CenaSklepInternetowy': row[15],
                        'cos2':                 row[16],
                        'm2':                   row[17],
                        'm1':                   row[18],
                        'm6':                   row[19]
                    }
                    rows_tab.append(jsonRow)
                print("DRUGA OPCJA")
                print(rows_tab[0])
                print("\n")
                print(rows_tab[1])
                return rows_tab
            
    def getListOfProductsFromDocument(self, pk):
        list_of_products = ListOfProductsObject.objects.filter(Document_id=pk)
        lop = []
        for p in list_of_products:
            with connections['METALZBYT_KOLEKTOR'].cursor() as cursor:
                sql = f'''with tabela as  
                        (select  ROW_NUMBER() over(order by T0.kod asc) as RowNumber,
                        T9.Data as 'maincategory',T10.Data as 'producent', 
                        T3.Data as active,T0.ID, T0.Guid,T0.EAN, T0.NumerKatalogowy,T2.Kod as jm, T0.Kod, T0.Nazwa,T0.Opis,  
                        (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  
                        WHERE T1.Magazyn != 8 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as 'quantity', 
                        (SELECT MAX(T8.PartiaWartosc/T8.IloscValue) FROM Zasoby T8  
                        WHERE T0.id = T8.Towar AND T8.PartiaPierwotnaTyp = 1 GROUP BY T8.Towar) as 'cenazakupu', 
                        T5.NettoValue as 'Cena hurtowa', T6.NettoValue as 'Cena detaliczna', 
                        T7.NettoValue as 'Cena sklep internetowy', (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 9 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m2,(SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 5 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m1,(SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 1 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m6
                        FROM Towary T0  
                        LEFT JOIN Jednostki T2 ON T2.ID = T0.Jednostka  
                        LEFT JOIN Features T3 ON (T3.ParentType LIKE 'Towary' 
                        AND T3.[Name] LIKE 'Sklep internetowy' 
                        AND T3.Parent=T0.ID) 
                        LEFT JOIN Features T10 ON (T10.Parent=T0.ID AND T10.ParentType LIKE 'Towary' AND T10.[Name] LIKE 'Producent') 
                        LEFT JOIN  Features T9 ON (T9.Parent=T0.ID AND T9.ParentType LIKE 'Towary' AND T9.[Name] LIKE 'Asortyment')  
                        LEFT JOIN  Ceny T5 ON (T5.Towar = T0.ID AND T5.Definicja = 2 AND T5.NettoSymbol='PLN')  
                        LEFT JOIN  Ceny T6 ON (T6.Towar = T0.ID AND T6.Definicja = 3 AND T6.NettoSymbol='PLN')  
                        LEFT JOIN  Ceny T7 ON (T7.Towar = T0.ID AND T7.Definicja = 9 AND T7.NettoSymbol='PLN') 
                        WHERE T0.id LIKE '{p.Product}') 
                        select * from tabela where RowNumber  BETWEEN 0 AND 10000000'''
                cursor.execute(sql)
                row = cursor.fetchone()
                jsonRow = {
                    'lp':                   row[0],
                    'Kategoria':            row[1],
                    'Producent':            row[2],
                    'cos':                  row[3],
                    'id':                   row[4],
                    'Guid':                 row[5],
                    'EAN':                  row[6],
                    'NumerKatalogowy':      row[7],
                    'jm':                   row[8],
                    'Kod':                  row[9],
                    'Nazwa':                row[10],
                    'Opis':                 row[11],
                    'Ilosc':                row[12],
                    'CenaZakupu':           row[13],
                    'CenaDetaliczna':       row[14],
                    'CenaSklepInternetowy': row[15],
                    'cos2':                 row[16],
                    'm2':                   row[17],
                    'm1':                   row[18],
                    'm6':                   row[19]
                }
                obj = {
                    'Document': p.Document_id,
                    'Product': jsonRow,
                    'Quantity': p.Quantity
                }
                lop.append(obj)

        # print(lop)
        return lop