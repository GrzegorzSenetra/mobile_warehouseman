import os
from PIL import Image
import zpl
from zpl import label
import io
try:
    from urllib.request import urlopen
except ImportError:
    from urllib2 import urlopen

class Zpl2Generator():
    def __init__(self, product):
        self.product = product
        self.zpl_list = []
        self.size = []
        self.font = {
            'style': '0',
            'size': 2
        }
        self.cursor = [0,0]
    
    def read_file(self, filename):
        """ Czyta plik wygenerowany przez program smallbusiness 5.1.
        Zwraca kod zpl wygenerowany na podstawie pliku i grafikę metki

        Args:
            filename (str): nazwa pliku

        Returns:
            [str, Image]: kod zpl wygenerowany na podstawie pliku i grafika
        """
        size = self.get_label_size(filename)
        print("####################### GENERATOR SIZE ##########################")
        print(size)
        l = zpl.Label(size[1],size[0],8)
        l.code += "^CI28"
        self.replace_content_with_values(filename)
        with open(__file__[:-22]+'etykiety/generator_file.zpl') as file_in: 
            i = 0
            for line in file_in:
                if i > 7:
                    self.zpl_element_checker(line, l)
                i+=1
        self.delete_file(__file__[:-22]+'etykiety/generator_file.zpl')
        image = self.preview_image(l)
        return [l.dumpZPL(), image]
    
    def preview_image(self, label, index=0):
        '''
        Opens rendered preview using Labelary API.
        Not all commands are supported, see http://labelary.com for more information.
        '''
        try:
            url = 'http://api.labelary.com/v1/printers/%idpmm/labels/%fx%f/%i/' % (
                label.dpmm, label.width/25.4, label.height/25.4, index)
            res = urlopen(url, label.dumpZPL().encode()).read()
            return Image.open(io.BytesIO(res))
        except IOError:
            raise Exception("Invalid preview received, mostlikely bad ZPL2 code uploaded.")
    
    def replace_content_with_values(self, filename):
        with open(__file__[:-22]+f'etykiety/{filename}') as file_in:
            file_content = file_in.read()
            file_content = file_content.replace("%OPIS_TOWARU%", self.product['name'])
            file_content = file_content.replace("%NAZWA%", self.product['code'])
            file_content = file_content.replace("%nazwa%", self.product['code'])
            file_content = file_content.replace("%KOD%", "")
            file_content = file_content.replace("%kod%", "")
            file_content = file_content.replace("%KODINDEX%", self.product['code'])
            file_content = file_content.replace("%CENA1B%", self.product['price'].replace(".", ","))
            file_content = file_content.replace("%JEDN%", self.product['jm'])
            file_content = file_content.replace("%CENABARB%", self.product['price'][:-1])
            if self.product['EAN']:
                file_content = file_content.replace("%PLU%", self.create_plu_from_ean(self.product['EAN'])) # 99999000 8924 0
            print(file_content)
            self.create_file4generator(file_content)
            
    def create_plu_from_ean(self, ean):
        for i, number in enumerate(ean):
            if number != '9' and number != '0':
                plu_index = i
                break
        return ean[plu_index:len(ean)-1]
    
    def get_label_size(self, filename):
        xy = []
        with open(__file__[:-22]+f'etykiety/{filename}') as file_in:
            i = 0
            for line in file_in:
                if i == 7:
                    elements = line[:].split(' ')
                    xy = [int(i) for i in elements[1][:-1].split(',')]
                    self.size = xy
                i += 1
        return xy
    
    def create_file4generator(self, content):
        """ Tworzy tymczasowy plik dla generatora. """
        cmd = 'touch '+__file__[:-22]+'etykiety/generator_file.zpl'
        os.system(cmd)
        f = open(__file__[:-22]+'etykiety/generator_file.zpl', "w")
        f.write(content)
        f.close
    
    def delete_file(self, path):
        cmd = f'rm {path}'
        os.system(cmd)
        
    def px2mm(self, px):
        return px * 0.125123
    
    def place_element(self, x, y, width, height, position):
        if position[0] == 'R':
            self.cursor[0] = x
        elif position[0] == 'C':
            self.cursor[0] = x - (width/2)
        elif position[0] == 'L':
            self.cursor[0] = x - width
        if position[1] == 'T':
            self.cursor[1] = y
        elif position[1] == 'B':
            self.cursor[1] = y + height
        elif position[1] == 'M':
            self.cursor[1] = y - (height/2)
    
    def isfloat(self, value):
        try:
            float(value)
            return True
        except ValueError:
            return False
    
    def zpl_element_checker(self, line, l):
        """ Sprawdza i zamienia na kod ZPL właściwości elementów linia 
            po lini z pliku txt/txo programu SmallBusiness.

        Args:
            line (str): pojedynczy wiersz pliku
            l (zpl.label): obiekt metki biblioteki zpl
        """
        elements = line[:].split(' ')
        el = elements[0]
        if el == 'FONT':
            properties = line[5:].split(", ")
            for property in properties:
                if '"' in property:
                    self.font['style'] = property
                elif self.isfloat(property):
                    self.font['size'] = float(property)
            l.set_default_font(self.font['size'], self.font['size'], font='0') # JAK SIE FON ZAŁADUJE TO TU ZMIENIĆ NA 1 I ZOBACZYĆ DRUK
        elif len(elements) > 2 and el != "//":
            EL_X = 0
            if '"' in elements[1][:-1]:
                EL_X = float(elements[2][:-1])
            else:
                EL_X = float(elements[1][:-1])
            EL_Y = float(elements[2][:-1])
            EL_WIDTH = float(elements[4][:-1])
            if EL_WIDTH > self.size[0]:
                EL_WIDTH = self.size[0]
            EL_HEIGHT = self.font['size']
            EL_POSITION = el[:2]
            EL_TYPE = el[2:]
            if EL_TYPE == 'TEXT':
                self.place_element(EL_X, EL_Y, EL_WIDTH, EL_HEIGHT, EL_POSITION)
                l.origin(self.cursor[0], self.cursor[1])
                name = ''
                for e in elements[6:]:
                    name += " "+e
                name = name.replace('"', "")
                l.write_text(name, 
                             char_height=self.font['size'], 
                             char_width=self.font['size'], 
                             line_width=float(elements[4][:-1]), 
                             max_line=int(elements[5][:-1]), 
                             justification=EL_POSITION[0])
            elif EL_TYPE == 'BAR':
                BAR_HEIGHT = float(elements[3][:-1]) + 5
                self.place_element(EL_X, EL_Y, EL_WIDTH, BAR_HEIGHT, EL_POSITION)
                print(self.cursor)
                TYPE = 'E'
                CODE = self.product['EAN']  
                if not self.product['EAN']:
                    TYPE = 'C'
                    CODE = self.product['code']
                x = 0
                if TYPE == 'A':
                    x = float(elements[1][:-1]) - float(self.size[0]/3) - len(str(CODE)) + 4
                elif TYPE in 'UE':
                    x = float(elements[1][:-1]) - float(self.size[0]/4)
                elif TYPE == 'C':
                    x = float(elements[1][:-1]) - float(self.size[0]/4) - len(str(CODE)) + 5
                l.origin(x, self.cursor[1])
                l.write_barcode(height=BAR_HEIGHT*5, barcode_type=TYPE, check_digit='Y', mode='A')
                l.write_text(CODE)
                print(l.code)
            elif EL_TYPE == 'BARINDEX':
                BAR_HEIGHT = float(elements[3][:-1]) + 5
                self.place_element(EL_X, EL_Y, EL_WIDTH, BAR_HEIGHT, EL_POSITION)
                print(self.cursor)
                TYPE = 'C'
                CODE = self.product['code']
                if not self.product['code']:
                    TYPE = 'E'
                    CODE = self.product['EAN']
                x = 0
                if TYPE == 'A':
                    x = float(elements[1][:-1]) - float(self.size[0]/3) - len(str(CODE)) + 4
                elif TYPE in 'UE':
                    x = float(elements[1][:-1]) - float(self.size[0]/4)
                elif TYPE == 'C':
                    x = float(elements[1][:-1]) - float(self.size[0]/4) - len(str(CODE)) + 5
                l.origin(x, self.cursor[1])
                l.write_barcode(height=BAR_HEIGHT*5, barcode_type=TYPE, check_digit='Y', mode='A')
                l.write_text(CODE)
                print(l.code)
            elif EL_TYPE == 'BITMAP':
                IMAGE_WIDTH = float(elements[4][:-1])
                EL_HEIGHT = float(elements[7]) * float(elements[5][:-1])
                IMAGE_NAME = elements[1][:-1].replace('"',"")
                IMAGE_PATH = __file__[:-22]+f'assets/{IMAGE_NAME}'
                l.origin((EL_X-IMAGE_WIDTH)/2, EL_HEIGHT)
                IMAGE_HEIGHT = l.write_graphic(
                    Image.open(os.path.join(os.path.dirname(zpl.__file__), IMAGE_PATH)),
                    IMAGE_WIDTH)
                l.endorigin()
            l.endorigin()
