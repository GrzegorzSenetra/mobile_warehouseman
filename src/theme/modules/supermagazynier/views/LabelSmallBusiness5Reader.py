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


# NAME "Metalzbyt - 60x40 - kasiuniuna"
# SIZE 60,40

# FONT "Arial", 4, NORMAL, 100%
# CMTEXT 45, 34, 0, 59, 1, "/ para"
# FONT 3.5
# CMTEXT 28, 7, 0, 45, 4, "%OPIS_TOWARU%"
# FONT 3
# LTTEXT 5, 36, 0, 59, 1, " %NAZWA%"
# FONT "Arial Narrow", 15, BOLD
# RBTEXT 50, 35, 0, 50, 1, " %CENA1B% zł"


from theme.modules.supermagazynier.views.Label import Label
import re

class LabelSmallBusiness5Reader():
    label_text: str
    label_path: str
    label: Label
    label_lines: list
    
    def __init__(self, label_path: str) -> None:
        self.label_path = label_path
        self.readFile(label_path)
        self.splitLabel()

    def readFile(self, label_path: str):
        with open(label_path, 'r') as file:
            self.label_text = file.read()
    
    def getLabel(self):
        return self.label
    
    def splitLabel(self):
        self.label_lines = self.label_text.split('\n')
    
    def get_label_params(self):
        label_params = {
            'name':         self.parseName(),
            'size':         self.parseSize(),
            'opis_towaru':  self.parseOpisTowaru(),
            'barcode':      self.parseBarcode(),
            'index':        self.parseIndex(),
            'jm':           self.parseJednostka(),
            'indexBarcode': self.parseIndexCode(),
            'cena':         self.parseCena()
        }
        return label_params
    
    def parse(self):
        label_name          = self.parseName()
        label_size          = self.parseSize()
        label_opis_towaru   = self.parseOpisTowaru()
        label_barcode       = self.parseBarcode()
        label_index         = self.parseIndex()
        label_jednostka     = self.parseJednostka()
        label_index_code    = self.parseIndexCode()
        label_cena          = self.parseCena()
        label = Label({
            'label': {
                'title':    label_name,
                'width':    label_size[0],
                'height':   label_size[1]
            },
            'product_name': label_opis_towaru,
            'barcode':      label_barcode,
            'index':        label_index,
            'jm':           label_jednostka,
            'indexBarcode': label_index_code,
            'price':        label_cena
        })
        self.label = label

    def parseName(self):
        name = self.label_text.split('NAME')[1].split('"')[1]
        return name
    
    def parseSize(self):
        size = self.label_text.split('SIZE')[1].split(',')
        x = float(size[0])
        y = float(re.sub(r'\D', '', size[1]))
        return [x, y]
    
    def getFontSize(self, line):
        if line.find('FONT') != -1:
            print(line.split(' '))
            for a in line.split(' '):
                try:
                    aFloat = float(a.replace(',',''))
                except:
                    aFloat = 0
                if aFloat > 0:
                    return aFloat
    
    def parseOpisTowaru(self):
        opis_towaru: dict = {
            'x': 0,
            'y': 0,
            'size': 0,
        }
        for line in self.label_lines:
            if self.getFontSize(line):
                opis_towaru['size'] = self.getFontSize(line)
            if line.find('%OPIS_TOWARU%') != -1:
                opis_towaru['x'] = float(re.sub(r'\D\.', '',line.split('TEXT')[1].split(' ')[1][:-1]))
                opis_towaru['y'] = float(re.sub(r'\D\.', '',line.split('TEXT')[1].split(' ')[2][:-1]))
                break
        return opis_towaru
    
    def parseBarcode(self):
        barcode: dict = {
            'x': 0,
            'y': 0,
            'height': 0,
            'width': 0,
        }
        for id_line, line in enumerate(self.label_lines):
            if line.find('%KOD%') != -1 and line.find('BAR') != -1:
                barcode['x'] =      float(re.sub(r'\D\.', '',line.split('BAR')[1].split(' ')[1][:-1]))
                barcode['y'] =      float(re.sub(r'\D\.', '',line.split('BAR')[1].split(' ')[2][:-1]))
                barcode['width'] =  float(re.sub(r'\D\.', '',line.split('BAR')[1].split(' ')[3][:-1]))
                barcode['height'] = float(re.sub(r'\D\.', '',line.split('BAR')[1].split(' ')[4][:-1]))
        return barcode
    
    def parseIndex(self):
        index: dict = {
            'x': 0,
            'y': 0,
            'size': 0,
        }
        
        for line in self.label_lines:
            if self.getFontSize(line):
                index['size'] = self.getFontSize(line)
                print('Index font size: ', index['size'])
            if line.find('%NAZWA%') != -1:
                index['x'] = float(re.sub(r'\D\.', '',line.split('TEXT')[1].split(' ')[1][:-1]))
                index['y'] = float(re.sub(r'\D\.', '',line.split('TEXT')[1].split(' ')[2][:-1]))
                break
        return index
    
    def parseJednostka(self):
        jednostka: dict = {
            'x': 0,
            'y': 0,
            'size': 0,
        }
        for line in self.label_lines:
            if self.getFontSize(line):
                jednostka['size'] = self.getFontSize(line)
            if line.find('%JEDN%') != -1:
                jednostka['x'] = float(re.sub(r'\D\.', '',line.split('TEXT')[1].split(' ')[1][:-1]))
                jednostka['y'] = float(re.sub(r'\D\.', '',line.split('TEXT')[1].split(' ')[2][:-1]))
                break
        return jednostka
    
    def parseIndexCode(self):
        index_code: dict = {
            'x': 0,
            'y': 0,
            'height': 0,
            'width': 0,
        }
        for line in self.label_lines:
            if line.find('%KODINDEX%') != -1 and line.find('BAR') != -1:
                index_code['x'] =       float(re.sub(r'\D\.', '',line.split('BAR')[1].split(' ')[1][:-1]))
                index_code['y'] =       float(re.sub(r'\D\.', '',line.split('BAR')[1].split(' ')[2][:-1]))
                index_code['width'] =   float(re.sub(r'\D\.', '',line.split('BAR')[1].split(' ')[3][:-1]))
                index_code['height'] =  float(re.sub(r'\D\.', '',line.split('BAR')[1].split(' ')[4][:-1]))
        return index_code
    
    def parseCena(self):
        cena: dict = {
            'x': 0,
            'y': 0,
            'size': 0,
        }
        for line in self.label_lines:
            if self.getFontSize(line):
                cena['size'] = self.getFontSize(line)
            if line.find('%CENA1B%') != -1:
                cena['x'] = float(re.sub(r'\D\.', '',line.split('TEXT')[1].split(' ')[1][:-1]))
                cena['y'] = float(re.sub(r'\D\.', '',line.split('TEXT')[1].split(' ')[2][:-1]))
                break
        return cena