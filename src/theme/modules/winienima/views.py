from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import FileUploadParser
import collections
from operator import itemgetter
import xlrd
# Create your views here.

class WinienimaComparer(APIView):
    parser_classes = [FileUploadParser,]
    def post(self, request, filename, format=None):
        excelFile = request.FILES["file"]
        sheet = self.read_excel_file(excelFile)
        winien_and_ma_dicts_arr = self.get_winien_and_ma_dicts(sheet)
        winien_and_ma_dicts_arr_clone = self.get_winien_and_ma_dicts(sheet)
        relic_dicts_arr = self.remove_docs_once_per_match(winien_and_ma_dicts_arr)
        all_matches_dicts_arr = self.get_all_matches_by_price(relic_dicts_arr, winien_and_ma_dicts_arr_clone)
        d0 = all_matches_dicts_arr[0]
        d1 = all_matches_dicts_arr[1]
        # d0 = collections.OrderedDict(sorted(self.change_key_for_price(d0).items())) 
        # d1 = collections.OrderedDict(sorted(self.change_key_for_price(d1).items()))
        return Response([d0,d1])
    
    def change_key_for_price(self, arr):
        for index in arr.copy():
            new_key = arr[index]['KWOTA']
            old_key = index
            arr[new_key] = arr.pop(old_key)
        return arr

    def read_excel_file(self, file):
        wb = xlrd.open_workbook(file_contents = file.read())
        sheet = wb.sheet_by_index(0)
        return sheet
    
    def get_all_matches_by_price(self, relic_dicts_arr, dicts_arr):
        winien_relic_dict = relic_dicts_arr[0]
        ma_relic_dict = relic_dicts_arr[1]
        winien_dict = dicts_arr[0]
        ma_dict = dicts_arr[1]
        
        for winien_relic_key in winien_relic_dict.copy():
            for winien_key in winien_dict.copy():
                if winien_dict[winien_key]['KWOTA'] == winien_relic_dict[winien_relic_key]['KWOTA']:
                    winien_relic_dict[winien_relic_key]['POWTORZENIA'].append({
                        winien_dict[winien_key]['KWOTA']:{
                            'DOKUMENT': winien_key,
                            'KWOTA': winien_dict[winien_key]['KWOTA'],
                            'DATA': winien_dict[winien_key]['DATA'],
                            'OPIS': str(winien_dict[winien_key]['OPIS'])
                            }
                        })
                    
        for ma_relic_key in ma_relic_dict.copy():
            for ma_key in ma_dict.copy():
                if ma_dict[ma_key]['KWOTA'] == ma_relic_dict[ma_relic_key]['KWOTA']:
                    ma_relic_dict[ma_relic_key]['POWTORZENIA'].append({
                        ma_dict[ma_key]['KWOTA']:{
                            'DOKUMENT': ma_key,
                            'KWOTA': ma_dict[ma_key]['KWOTA'],
                            'DATA': ma_dict[ma_key]['DATA'],
                            'OPIS': str(ma_dict[ma_key]['OPIS'])
                            }
                        })
        
        return [winien_relic_dict, ma_relic_dict]
    
    def remove_docs_once_per_match(self, dicts_arr):
        winien_dict = dicts_arr[0]
        ma_dict = dicts_arr[1]
        
        for ma_key in ma_dict.copy():
            if str(ma_dict[ma_key]['OPIS']).find('PAR') != -1 or str(ma_dict[ma_key]['OPIS']).find('Raport fiskalny') != -1:
                ma_dict.pop(ma_key)
                
        for winien_key in winien_dict.copy():
            if str(winien_dict[winien_key]['OPIS']).find('PAR') != -1 or str(winien_dict[winien_key]['OPIS']).find('Raport fiskalny') != -1:
                winien_dict.pop(winien_key)
        
        for winien_key in winien_dict.copy():
            for ma_key in ma_dict.copy():
                if round(float(winien_dict[winien_key]['KWOTA']), 1) == round(float(ma_dict[ma_key]['KWOTA']), 1):
                    winien_dict.pop(winien_key)
                    ma_dict.pop(ma_key)
                    break
        
        return [winien_dict, ma_dict]
    
    def get_winien_and_ma_dicts(self, sheet):
        """Zbiera dokumenty winien i ma z excela

        Args:
            sheet (sheet): arkusz excel

        Returns:
            list<dict>: Zwraca listę [winien_dict, ma_dict]
        """
        NUMBER_COL = 0
        WINIEN_COL = 3
        MA_COL = 4
        OPIS_COL = 2
        DATA_COL = 0
        winien_dict = dict()
        ma_dict = dict()
        i = 10
        while i < (sheet.nrows-22):
            xl_date = sheet.cell_value(i+1,DATA_COL)
            # datetime_date = xlrd.xldate_as_datetime(xl_date, 0)
            # date_object = datetime_date.date()
            # string_date = date_object.isoformat()
            string_date = '10'
            if sheet.cell_value(i,WINIEN_COL):
                winien_dict[sheet.cell_value(i,NUMBER_COL)] = {'KWOTA': sheet.cell_value(i,WINIEN_COL), 
                                                                'OPIS': sheet.cell_value(i+1,OPIS_COL),
                                                                'DATA': string_date,
                                                                'POWTORZENIA': []}
            else:
                ma_dict[sheet.cell_value(i,NUMBER_COL)] = {'KWOTA': sheet.cell_value(i,MA_COL), 
                                                            'OPIS': sheet.cell_value(i+1,OPIS_COL),
                                                            'DATA': string_date,
                                                            'POWTORZENIA': []}
            i += 2
        doc_dicts_arr = [winien_dict, ma_dict]
        return doc_dicts_arr