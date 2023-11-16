from django.db import connections
from rest_framework.views import APIView
import urllib.parse
from rest_framework.response import Response

class Product(APIView):
    def get(self, request, type, value):
        if(type == 'from_scan'):
            value = urllib.parse.unquote(value)
            jsonRow = self.getProductFromEnova(value)
            description = ''
            imagePath = ''
            if isinstance(jsonRow, list):
                for row in jsonRow:
                    description = self.getProductDescriptionFromPrestashop(row['id'])
                    imagePath = self.getProductImageFromPrestashop(row['id'])
                    row['ImagePath'] = imagePath
                    row['Opis'] = description
            elif isinstance(jsonRow, dict):
                description = self.getProductDescriptionFromPrestashop(jsonRow['id'])
                imagePath = self.getProductImageFromPrestashop(jsonRow['id'])
                jsonRow['ImagePath'] = imagePath
                jsonRow['Opis'] = description
            return Response(jsonRow)
        elif(type == 'from_searchbar'):
            if(len(value) >= 3):
                jsonRow = self.getByEverything(value)
                return Response(jsonRow)
            else:
                return Response("Search length should be 5 chars or more")
            
    def getProductImageFromPrestashop(self, productId):
        with connections['METALZBYT_PRESTA'].cursor() as cursor:
            sql = f'''
            SELECT 
            pi.`id_image`,
            pl.`link_rewrite`
            FROM `ps_product` as p 
            JOIN `ps_image` as pi ON pi.`id_product` = p.`id_product`
            JOIN `ps_product_lang` as pl ON p.`id_product` = pl.`id_product`
            WHERE p.`id_enova` = '{productId}'
            ORDER BY pi.`cover` DESC LIMIT 1;
            '''
            cursor.execute(sql)
            row = cursor.fetchall()
        if row:
            imagePath = self.imagePathCreator(row[0])
        else:
            imagePath = 'https://sklep.metalzbyt.com.pl/img/p/pl-default-home_default.jpg'
        return imagePath
    
    def imagePathCreator(self, sqlrow):
        imagePath = 'https://sklep.metalzbyt.com.pl/' + str(sqlrow[0]) + '-home_default/' + sqlrow[1] + '.jpg'
        return imagePath

    def getProductDescriptionFromPrestashop(self, productId):
        with connections['METALZBYT_PRESTA'].cursor() as cursor:
            sql = f'''
            SELECT pl.`description`
            FROM `ps_product` as p 
            JOIN `ps_product_lang` as pl ON p.`id_product` = pl.`id_product`
            WHERE p.`id_enova` = '{productId}';
            '''
            cursor.execute(sql)
            row = cursor.fetchall()
        if row:
            return row[0][0]
        else:
            return ''

    def getByEverything(self, value):
        with connections['METALZBYT_KOLEKTOR'].cursor() as cursor:
            value = urllib.parse.unquote(value)
            value = value.replace(" ", "%")
            value = value.replace("'", "'+nchar(39)+'")
            sql = f'''with tabela as  
            (select  ROW_NUMBER() over(order by T0.kod asc) as RowNumber,
            '1' as 'maincategory','b' as 'producent', 
            '0' as active,T0.ID, T0.Guid,T0.EAN, T0.NumerKatalogowy,T2.Kod as jm, T0.Kod, T0.Nazwa,T0.Opis,  
            (SELECT sum(T1.[IloscValue]) FROM Zasoby T1
            WHERE T1.Magazyn != 8 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as 'quantity', 
            (SELECT MAX(T8.PartiaWartosc/T8.IloscValue) FROM Zasoby T8  
            WHERE T0.id = T8.Towar AND T8.PartiaPierwotnaTyp = 1 GROUP BY T8.Towar) as 'cenazakupu', 
            '0' as 'Cena hurtowa', T6.NettoValue as 'Cena detaliczna', 
            '0' as 'Cena sklep internetowy', 
            (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 9 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m2,
            (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 5 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m1,
            (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 1 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m6,
			(SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 8 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m8,
			(SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 6 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m9,
			(SELECT T12.[Kod] FROM DefStawekVat T12  WHERE T12.ID = T0.DefinicjaStawki) as vat
            FROM Towary T0  
            LEFT JOIN Jednostki T2 ON T2.ID = T0.Jednostka               
            LEFT JOIN  Ceny T6 ON (T6.Towar = T0.ID AND T6.Definicja = 3 AND T6.NettoSymbol='PLN')  
			LEFT JOIN  DefStawekVat T12 ON T12.ID = T0.DefinicjaStawki     
            WHERE (T0.EAN like '%{value}%' AND T0.EAN like '999%') or T0.Kod LIKE '{value}%' OR T0.EAN LIKE '{value}%' OR T0.Nazwa LIKE '%{value}%' OR T0.NumerKatalogowy LIKE '%{value}%' ) 
            SELECT * FROM tabela WHERE RowNumber BETWEEN 0 AND 20 ORDER BY tabela.quantity DESC'''
            cursor.execute(sql)
            row = cursor.fetchall()
        return row

    def getProductFromEnova(self, kod_kreskowy):
        kod_kreskowy = kod_kreskowy.replace(" ", "%")
        kod_kreskowy = kod_kreskowy.replace("'", "'+nchar(39)+'")
        with connections['METALZBYT_KOLEKTOR'].cursor() as cursor:
            sql = f'''select DISTINCT  1,
            1 as 'maincategory',
    T10.Data as 'producent', 
            T3.Data as active,T0.ID, 
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
    (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 1 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m6,
	(SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 8 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m8,
	(SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 6 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m9,
	(SELECT T12.[Kod] FROM DefStawekVat T12  WHERE T12.ID = T0.DefinicjaStawki) as vat
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
			LEFT JOIN  DefStawekVat T12 ON T12.ID = T0.DefinicjaStawki 
            WHERE T0.Kod LIKE '{kod_kreskowy}' OR T0.EAN LIKE '{kod_kreskowy}' OR T11.Kod LIKE '{kod_kreskowy}'  ORDER BY quantity DESC'''
            cursor.execute(sql)
            many_rows = cursor.fetchall()
            print(len(many_rows))
            if len(many_rows) == 1:
                row = many_rows[0]
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
                    'm6': row[19],
                    'm8': row[20],
                    'm9': row[21],
                    'vat': row[22]
                }
                print("PIERWSZA OPCJA")
                print(jsonRow)
                return jsonRow
            else:
                rows_tab = []
                for row in many_rows:
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
                        'm6': row[19],
                        'm8': row[20],
                        'm9': row[21],
                        'vat': row[22]
                    }
                    rows_tab.append(jsonRow)
                print("DRUGA OPCJA")
                print(rows_tab[0])
                print("\n")
                print(rows_tab[1])
                return rows_tab