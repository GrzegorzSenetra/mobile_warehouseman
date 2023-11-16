# NAME "testetstes"
# SIZE 50,40

# FONT "Arial", 2.8, NORMAL, 100%
# CMTEXT 25, 6, 0, 48, 4, "%OPIS_TOWARU%"
# CMBAR 24, 15.5, 5, 0.25, 0, "%KOD%"
# CMTEXT 24, 24, 0, 49, 1, "index: %NAZWA%"
# FONT 3.5
# CMTEXT 40, 37.5, 0, 49, 1, "/szt."
# FONT 3
# CTTEXT 24, 18, 0, 49, 1, "%KOD%"
# FONT 11, BOLD
# CMTEXT 25, 32, 0, 49, 1, "%CENA1B% zł"


class Label():
    name: str
    size: list
    opis_towaru: dict
    barcode: dict
    index: dict
    jednostka: dict
    index_code: dict
    cena: dict
    
    def __init__(self, data: dict):
        self.name = data['label']['title']
        self.size = [data['label']['width'], data['label']['height']]
        self.opis_towaru = data['product_name']
        self.barcode = data['barcode']
        self.index = data['index']
        self.jednostka = data['jm']
        self.index_code = data['indexBarcode']
        self.cena = data['price']
        
    
