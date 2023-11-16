from django.db import connections
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser, MultiPartParser
import xlrd
from datetime import datetime
import re

# Create your views here.

class AllegroFVFinder(APIView):
    # parser_classes = [FileUploadParser]
    parser_classes = (MultiPartParser,)
    def post(self, request, filename):
        excelFile = request.FILES['file']
        wb = xlrd.open_workbook(file_contents = excelFile.read())
        sheet = wb.sheet_by_index(0)
        prices_from_allegro = self.get_prices_from_allegro_orders(sheet)
        customers = self.sql_get_id_customer(prices_from_allegro)
        orders_ids = self.slice_orders_ids(customers)
        fvs = self.sql_fv_enova(request.data['date_start'], request.data['date_stop'], orders_ids)
        connected_list = self.connect_all_lists(prices_from_allegro, customers, fvs)
        formatted_connecter_list = self.format_data(connected_list)
        colored_indexes = self.check_prices_compatibility(formatted_connecter_list)
        return Response([prices_from_allegro, customers, orders_ids, fvs, formatted_connecter_list, colored_indexes], content_type='application/json')
    
    def format_data(self, cl):
        tu = list()
        cl = list(cl)
        for c in cl:
            t = c[2]
            formatted_date = f"{t.year}-{self.format_to_date_str(t.month)}-{str(t.day)}"
            tu.append([c[0], c[1], formatted_date, c[3], c[4], c[5]])
        tu.sort(key=lambda date: datetime.strptime(date[2], "%Y-%m-%d"))
        tu = self.numerate_list(tu)
        return tuple(tu)
    
    def check_prices_compatibility(self, li):
        colored_li = list()
        for l in li:
            if l[4] != l[5] or l[4] != l[6] or l[5] != l[6]:
                colored_li.append(l[0])
        return colored_li
    
    def format_to_date_str(self, s):
        if len(str(s)) == 1:
            return '0'+str(s)
    
    def numerate_list(self, li):
        l = list()
        for i, element in enumerate(li):
            l.append([i+1, element[0], element[1], element[2], element[3], element[4], element[5]])
        return l
    
    def takeSecond(self, elem):
        return self.to_integer(elem[2])
    
    def to_integer(self, dt_time):
        dt_time.split('-')
        return 10000*int(dt_time[0]) + 100*int(dt_time[1]) + int(dt_time[2])
    
    def connect_all_lists(self, allegro, presta, enova):
        connected_list = set()
        for a in allegro[1:]:
            for p in presta:
                if a[0] in p[2]:
                    for e in enova:
                        if str(p[0]) in e[1]:
                            connected_list.add(e + (a[1], p[3]))
        return connected_list

    def slice_orders_ids(self, table):
        orders_set = set()
        for item in table:
            orders_set.add(item[0])
        return orders_set
    
    def get_prices_from_allegro_orders(self, sheet):
        ALLEGRO_CUSTOMER_COL = 2
        PRICE_COL = 4
        client_and_prices_tab = []
        for i in range(sheet.nrows):
            print(i)
            price = self.slice_price(sheet.cell_value(i,PRICE_COL))
            if price < 0:
                continue
            client_and_prices_tab.append([sheet.cell_value(i,ALLEGRO_CUSTOMER_COL), self.slice_price(sheet.cell_value(i,PRICE_COL))])
        return client_and_prices_tab
    
    def slice_price(self, price_str):
        arr = re.findall(r"-?\b\d+(?:[,\.]\d*)?\b",str(price_str))
        print(arr)
        if arr:
            print(float(arr[0].replace(',','.')))
            return float(arr[0].replace(',','.'))
        else:
            return 0
        # price_str = str(price_str)
        # price_str.replace('.', ',')
        # for i, s in enumerate(price_str):
        #     if s == 'z':
        #         return float(price_str[0:i-1].replace(',','.'))
    
    def join_id_customers_with_allegro_orders(self, customers, orders):
        orders_with_customers = set()
        for order in orders:
            for customer in customers:
                if order[0] in customer[2]:
                    orders_with_customers.add((customer[3],order[0],order[1]))
        return orders_with_customers
    
    def sql_get_id_customer(self, allegro_orders):
        customers = self.only_customers(allegro_orders)
        customers_str = self.refactor2sql_IN_string(customers, 'ps_address.alias')
        with connections['METALZBYT_PRESTA'].cursor() as cursor:
            sql = f'''SELECT ps_orders.id_order, ps_orders.id_customer, ps_address.alias, ps_orders.total_paid, ps_orders.invoice_date  
                      FROM ps_orders 
                      INNER JOIN ps_address ON ps_orders.id_customer = ps_address.id_customer 
                      WHERE {customers_str} ORDER BY id_address DESC'''
            cursor.execute(sql)
            return cursor.fetchall()
    
    def refactor2sql_IN_string(self, table, sql_table_name):
        s = ""
        for i, item in enumerate(table):
            if i == (len(table)-1):
                s += f" {sql_table_name} LIKE '%{item}%'"
                break
            s += f" {sql_table_name} LIKE '%{item}%' OR "
        return s
    
    def only_customers(self, orders):
        customers = []
        for order in orders:
            customers.append(order[0])
        return customers[1:]

    def slice_customers_ids(self, table):
        ids_set = set()
        for item in table:
            ids_set.add(item[0])
        return ids_set
    
    def sql_fv_enova(self, date_start, date_stop, ids_table):
        with connections['METALZBYT_KOLEKTOR'].cursor() as cursor:
            sql = f'''SELECT TOP 1000 dk.NumerPelny, dk.Opis, dk.Data, dk.SumaBrutto
                      FROM DokHandlowe dk WHERE dk.data BETWEEN '{date_start}' 
                      AND '{date_stop}' 
                      AND ({self.refactor2sql_IN_string(ids_table, 'dk.Opis')}) 
                      AND (dk.NumerPelny LIKE 'FA%' OR dk.NumerPelny LIKE 'PAR%') 
                      ORDER BY dk.ID DESC'''
            cursor.execute(sql)
            return cursor.fetchall()
        