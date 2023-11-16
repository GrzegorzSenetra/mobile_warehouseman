import pyodbc
driver = 'ODBC Driver 17 for SQL Server'
server = 'sql_srv'
database = 'mydb'
uid = 'myadmin'
pwd = 'mypass'
con_string = r'DRIVER={driver};SERVER={server};DATABASE={database};UID={uid};PWD={pwd}'
cnxn = pyodbc.connect(con_string)

cursor = cnxn.cursor()

print ('Using the following SQL Server version:')
tsql = "SELECT @@version;"
with cursor.execute(tsql):
    row = cursor.fetchone()
    print (str(row[0]))