from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import FileUploadParser, MultiPartParser
import xlrd

# Create your views here.

class VatComparer(APIView):
    parser_classes = (MultiPartParser,)
    def post(self, request, format=None):
        excelFiles = request.FILES.getlist('myFiles')
        first_file_indexes = self.read_excel_and_get_indexes(excelFiles[0])
        second_file_indexes = self.read_excel_and_get_indexes(excelFiles[1])
        union = first_file_indexes.union(second_file_indexes)
        only_a = union - second_file_indexes
        only_b = union - first_file_indexes
        outer_set = only_a.union(only_b)
        for index in outer_set:
            print(str(index))
        return Response(outer_set)
    
    def read_excel_and_get_indexes(self, file):
        wb = xlrd.open_workbook(file_contents = file.read())
        sheet = wb.sheet_by_index(0)
        filename = str(file.name).split(" ")[0]
        indexes = self.read_documents_indexes(sheet, filename)
        return indexes
    
    def read_documents_indexes(self, sheet, filename):
        documents_indexes = set()
        if filename == "rejestr":
            i = 10
            while i < (sheet.nrows - 23):
                documents_indexes.add(sheet.cell_value(i,1))
                i += 4
        else:
            i = 10
            while i < (sheet.nrows - 22):
                documents_indexes.add(sheet.cell_value(i,1))
                i += 2
        return documents_indexes
