from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import connections
from theme.modules.supermagazynier.models import ListOfProducts as ListOfProductsObject

class ListOfProducts(APIView):
    def get(self, request, pk, type):
        #if request.session['user'] != None:
            list_of_products = self.getListOfProductsFromDocument(pk)
            if type == "inventarisation_file":
                list_with_colors = self.checkExistingProductsInInventarisations(list_of_products)
                return Response(list_with_colors, content_type='application/json')
            else:
                return Response(list_of_products, content_type='application/json')

    def post(self, request, type):
        rqt = request.data
        list_of_products = self.getListOfProductsFromDocument(rqt[0]['Document'])
        if type == 'EXPORT_ALL':
            products_set = set(self.freeze(list_of_products.copy()))
            CSV = self.exportDictToCSV(map(dict,products_set))
            # CSV = self.exportToCSV(list_of_products)
            return Response(CSV)
        elif type == 'EXPORT_BRAK':
            list_with_only_braks = self.getOnlyProductsThatAreBrak(list_of_products)
            CSV = self.exportDictToCSV(map(dict,list_with_only_braks))
            return Response(CSV)
        else:
            res_text = type.split('_')
            #author = res_text[1]
            #author_products = self.getAuthorProducts(author, list_of_products)
            #CSV = self.exportToCSV(author_products)
            inwentarisation = res_text[1]
            inwentarisation_products = self.getInwProducts(inwentarisation, list_of_products)
            print(inwentarisation_products)
            inv_set = set(self.freeze(inwentarisation_products.copy()))
            # CSV = self.exportToCSV(inwentarisation_products)
            CSV = self.exportDictToCSV(map(dict,inv_set))
            return Response(CSV)
        return Response('NOT WORKING HEHE')

    def getInwProducts(self, inwentarisation, list):
        list = self.checkExistingProductsInInventarisations(list)
        inwentarisation_list = []
        for product in list:
            try:
                product_inwentarisation = product['Inwentaryzacja'].replace("/","-")
                print(product_inwentarisation)
                print(inwentarisation)
                if product_inwentarisation == inwentarisation:
                    inwentarisation_list.append(product)
            except:
                print("brak")
        # inv_set = set(inwentarisation_list)
        return inwentarisation_list

    def exportToCSV(self, list):
        csvStr = "Towar.Kod;Towar:Kod;Ilosc;\n"
        for product in list:
            quantity = str(product['Quantity']).replace(".", ",")
            csvStr += product['Product']['Kod']+";"+product['Product']['Kod']+";"+quantity+"\n"
        return csvStr

    def exportDictToCSV(self, l):
        csvStr = "Towar.Kod;Towar:Kod;Ilosc;\n"
        for product in l:
            quantity = str(product['Quantity']).replace(".", ",")
            pObj = {}
            for p in product['Product']:
                pObj[p[0]] = p[1]
            csvStr += pObj['Kod']+";"+pObj['Kod']+";"+quantity+"\n"
        return csvStr

    def getOnlyProductsThatAreBrak(self, list_of_products):
        flash_memory = list_of_products
        products_ids = ''
        for product in list_of_products:
            products_ids += str(product['Product']['id']) + ', '
        products_ids = products_ids[:-2]
        with connections['METALZBYT_KOLEKTOR'].cursor() as cursor:
            sql = f'''SELECT TOP (1000) T2.ID, T0.NumerPelny,T0.Magazyn,T2.Kod, T0.Pracownik,T3.Imie,T3.Nazwisko
                              FROM [DokHandlowe] T0
                              JOIN [PozycjeDokHan] T1 ON T0.ID = T1.Dokument
                              JOIN [Towary] T2 ON T1.Towar = T2.ID
                              LEFT JOIN [Pracownicy] T3 ON T0.Pracownik=T3.ID
                              WHERE NumerSymbol LIKE '%INW%' AND Stan=0 AND T2.ID IN ({products_ids});'''

            cursor.execute(sql)
            row = cursor.fetchall()
        red_product_ids = tuple()
        for index, item in enumerate(row):
            red_product_ids += (item[0],)

        red_products = []
        for i, element in enumerate(list_of_products):
            for j, red_product in enumerate(red_product_ids):
                if element["Product"]["id"] == red_product:
                    red_products.append(element)

        zbior0 = set(self.freeze(list_of_products))
        zbior1 = set(self.freeze(red_products))
        zbior2 = zbior0.difference(zbior1)
        return zbior2

    def checkExistingProductsInInventarisations(self, list_of_products):
        products_ids = ''
        for product in list_of_products:
            products_ids += str(product['Product']['id'])+', '
        products_ids = products_ids[:-2]
        with connections['METALZBYT_KOLEKTOR'].cursor() as cursor:
            sql = f'''SELECT TOP (1000) T2.ID, T0.NumerPelny,T0.Magazyn,T2.Kod, T0.Pracownik,T3.Imie,T3.Nazwisko
                              FROM [DokHandlowe] T0
                              JOIN [PozycjeDokHan] T1 ON T0.ID = T1.Dokument
                              JOIN [Towary] T2 ON T1.Towar = T2.ID
                              LEFT JOIN [Pracownicy] T3 ON T0.Pracownik=T3.ID
                              WHERE NumerSymbol LIKE '%INW%' AND Stan=0 AND T2.ID IN ({products_ids});'''

            cursor.execute(sql)
            row = cursor.fetchall()
        red_product_ids = tuple()
        for index, item in enumerate(row):
            red_product_ids += (item[0],)
        for i, element in enumerate(list_of_products):
            for j, red_product in enumerate(red_product_ids):
                if element["Product"]["id"] == red_product:
                    element["Author"] = {
                        "Name":row[j][5],
                        "Surname":row[j][6]
                    }
                    element["Inwentaryzacja"] = row[j][1]
                    print(element["Inwentaryzacja"][4])
                    try:
                        element["Product"]["color"] = '#'+str(ord(row[j][5][0]))[:1]+str(element["Inwentaryzacja"][4])+str(element["Inwentaryzacja"][4])+str(ord(row[j][6][0]))[:1]+str(ord(row[j][5][1]))[:2]
                    except:
                        element["Product"]["color"] = '#ff0000'

        return list_of_products
    
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
                    'lp': row[0],
                    'Kategoria': row[1],
                    'Producent': row[2],
                    'cos': row[3],
                    'id': row[4],
                    'Guid': row[5],
                    'EAN': row[6],
                    'NumerKatalogowy': row[7],
                    'jm': row[8],
                    'Kod': row[9],
                    'Nazwa': row[10],
                    'Opis': row[11],
                    'Ilosc': row[12],
                    'CenaZakupu': row[13],
                    'CenaDetaliczna': row[14],
                    'CenaSklepInternetowy': row[15],
                    'cos2': row[16],
                    'm2': row[17],
                    'm1': row[18],
                    'm6': row[19]
                }
                obj = {
                    'Document': p.Document_id,
                    'Product': jsonRow,
                    'Quantity': p.Quantity
                }
                lop.append(obj)
        return lop
    
    def freeze(self, d):
        if isinstance(d, dict):
            return frozenset((key, self.freeze(value)) for key, value in d.items())
        elif isinstance(d, list):
            return tuple(self.freeze(value) for value in d)
        return d