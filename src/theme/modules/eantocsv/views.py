from django.db import connections
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser
import xlrd
# Create your views here.

class KonwerterExcel(APIView):
    parser_classes = [FileUploadParser]
    def post(_self, request, filename):
        excelFile = request.FILES['file']
        wb = xlrd.open_workbook(file_contents = excelFile.read())
        sheet = wb.sheet_by_index(0)
        kody_kreskowe_str = _self.readBarcodes(sheet)
        duplicates_dict = _self.checkDuplicatesAndMissingItems(kody_kreskowe_str)
        dict_with_quantities = _self.addQuantityToDict(duplicates_dict, sheet)
        return Response(dict_with_quantities)

    def addQuantityToDict(_self, dict, sheet):
        for key in dict:
            i = 1
            while i < sheet.nrows:
                if str(int(sheet.cell_value(i, 8))) == str(key):
                    dict[key]['quantity'] = sheet.cell_value(i, 7)
                i += 1
        return dict

    def readBarcodes(_self, sheet):
        kody_kreskowe = f"("
        i = 1
        while i < sheet.nrows:
            if i+1 == sheet.nrows:
                kody_kreskowe += "'"+str(int(sheet.cell_value(i,8)))+"'"+")"
            else:
                kody_kreskowe += "'"+str(int(sheet.cell_value(i,8)))+"'"+", "
            i += 1
        return kody_kreskowe

    def checkDuplicatesAndMissingItems(_self, barcodes):
        barcodes_tab = barcodes[2:-2].split("', '")
        products = _self.getProductsFromEnovaViaBarcodesSQL(barcodes)
        duplicates_dict={}
        for barcode in barcodes_tab:
            duplicates_dict[barcode]={}
            for product in products:
                if str(barcode) == str(product[6]) or str(barcode) == str(product[7]):
                    duplicates_dict[barcode][product[10]] = product        
        return duplicates_dict

    def getProductsFromEnovaViaBarcodesSQL(_self, barcodes):
        with connections['METALZBYT_KOLEKTOR'].cursor() as cursor:
            sql = f'''select DISTINCT  1,
            1 as 'maincategory',
            1 as 'producent', 
            1 as active,T0.ID, 
            T0.Guid,T0.EAN, T11.Kod, T0.NumerKatalogowy,
            T2.Kod as jm, T0.Kod, T0.Nazwa,CAST (T0.Opis AS NVARCHAR(MAX)) as Opis,  
            (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  
            WHERE T1.Magazyn != 8 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as 'quantity', 
            (SELECT MAX(T8.PartiaWartosc/T8.IloscValue) FROM Zasoby T8  
            WHERE T0.id = T8.Towar AND T8.PartiaPierwotnaTyp = 1 GROUP BY T8.Towar) as 'cenazakupu', 
            1 as 'Cena hurtowa', 1 as 'Cena detaliczna', 
            1 as 'Cena sklep internetowy', 
            (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 9 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m2,
            (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 5 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m1,
            (SELECT sum(T1.[IloscValue]) FROM Zasoby T1  WHERE T1.Magazyn = 1 AND T0.id = T1.Towar AND T1.PartiaPierwotnaTyp = 1  GROUP BY T1.Towar) as m6
            FROM Towary T0  
            LEFT JOIN Jednostki T2 ON T2.ID = T0.Jednostka  
            LEFT JOIN  KodyKreskowe T11 ON T11.Zapis = T0.ID 
            WHERE T0.EAN IN {barcodes} OR T11.Kod IN {barcodes} ORDER BY quantity DESC'''
            cursor.execute(sql)
            products = cursor.fetchall()
            return products


class KonwerterCSV(APIView):
    def post(_self, request):
        checked = request.data["checked"]
        all = request.data["all"]
        csv = _self.convertToCSV(checked)
        differencesDict = _self.getDifferencesBetweenDicts(checked, all)
        return Response([csv, differencesDict])

    def convertToCSV(_self, checked):
        csvStr = "Towar.Kod;Towar:Kod;Ilosc;\n"
        for product in checked:
            quantity = str(product['quantity']).replace(".", ",")
            csvStr += product['id']+";"+product['id']+";"+quantity+"\n"
        return csvStr

    def getDifferencesBetweenDicts(_self, dict1, dict2):
        differencesDict = dict2
        for jtem in list(dict2):
            for xtem in dict2[jtem]:
                if xtem != "quantity":
                    for item in dict1:
                        if item["id"] == xtem:
                            differencesDict.pop(jtem)
                            break
        return differencesDict
