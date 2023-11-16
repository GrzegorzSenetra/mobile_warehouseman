from rest_framework.views import APIView
from rest_framework.response import Response
import os
import base64

from theme.modules.supermagazynier.views.Zpl2Generator import Zpl2Generator


class LabelCreator(APIView):
    """ 
    Creates label that is compatibile 
    with SmallBusiness 5 software and 
    ZPL II Printers language.
    """
    def __init__(self):
        label_name = 'default_name'
        label_width = 50
        label_height = 40
    
    def get(self, request, type, labelname):
        """ Handles GET requests.
        Returns all labels or label params.

        Args:
            type (str): 
            * get_all_labels - returns all labels
            * get_label_params - returns label params
            * get_label_params_web - returns label params for web
            
            labelname (str): label name of label params to return

        Returns:
            json: list of labels or label params
        """
        if type == "get_all_labels":
            return Response(self.getAllLabels(), content_type="application/json")
        elif type == "get_label_params":
            return Response(self.get_label_params(labelname), content_type="application/json")
        elif type == "get_label_params_web":
            return Response(self.get_label_params_web(labelname), content_type="application/json")
        return Response('test')
    
    def delete(self, request, type, labelname):
        res_status = 200
        res_msg = ""
        if type == "delete_label":
            res = self.delete_label(labelname)
            res_msg = res[0]
            res_status = res[1]
        return Response(res_msg, content_type="application/json", status = res_status)
    
    def post(self, request, type):
        """ Handles POST requests.
        Generate label preview, create or edit label.

        Args:
            type (str): 
            * preview - returns label preview
            * create - creates label
            * edit - edits label

        Returns:
            json: label preview or label data
        """
        if type == 'preview':
            label_preview = self.get_label_preview(None, request.data)
            return Response(label_preview, content_type='application/json')
        elif type == 'create':
            if self.check_label_exist(request.data['label']['title']+'.TXT'):
                return Response('Label already exist', content_type='application/json', status=400)
            else:
                smallbusiness_str = self.generate_smallbusiness_code(request.data)
                self.create_label(smallbusiness_str)
        elif type == 'edit':
            smallbusiness_str = self.generate_smallbusiness_code(request.data)
            self.edit_label(request.data['label']['title']+'.TXT', smallbusiness_str)
        return Response(request.data, content_type='application/json')
    
    def get_label_preview(self, labelname, labeldata):
        """ 
        Generates label and returns it as base64 
        string with image preview and width and height of label.

        Args:
            labelname (str): name of label to generate
            labeldata (json): label data to generate, if it exists returns existing label
            otherwise generates new label

        Returns:
            Dict: label preview as base64 string, width and height of label
        """
        if len(labeldata) > 0:
            smallbusiness_str = self.generate_smallbusiness_code(labeldata)
            self.create_tmp_file(smallbusiness_str)
            test_product = {
                'name': 'testowy produkt do metki',
                'EAN': '1234567891012',
                'code': '6969696969696',
                'price': '21.37',
                'jm': 'szt'
            }
            Generator = Zpl2Generator(test_product)
            readed_file = Generator.read_file('tmp_sb_file.TXT') # testetstes
            zpl2_code = readed_file[0]
            image = readed_file[1]
            image_path = __file__[:-21]+"assets/preview.png"
            image.save(image_path,"png")
            encoded_string = ''
            with open(image_path, 'rb') as image_file:
                encoded_string = base64.b64encode(image_file.read())
            width, height = image.size
            return {'image': encoded_string, 'size': [width, height]}
        else:
            test_product = {
                'name': 'testowy produkt do metki',
                'EAN': '1234567891012',
                'code': '6969696969696',
                'price': '21.37',
                'jm': 'szt'
            }
            Generator = Zpl2Generator(test_product)
            readed_file = Generator.read_file(labelname) # testetstes
            zpl2_code = readed_file[0]
            image = readed_file[1]
            image_path = __file__[:-21]+"assets/preview.png"
            image.save(image_path,"png")
            encoded_string = ''
            with open(image_path, 'rb') as image_file:
                encoded_string = base64.b64encode(image_file.read())
            width, height = image.size
            return {'image': encoded_string, 'size': [width, height]}
    
    def get_label_params(self, labelname):
        """ Gets label params from label file.

        Args:
            labelname (str): name of label to get params from

        Returns:
            List: [str, dict]: label preview as base64 string, label params 
        """
        from theme.modules.supermagazynier.views.LabelSmallBusiness5Reader import LabelSmallBusiness5Reader
        
        label_path: str = __file__[:-21]+"etykiety/"+labelname
        if os.path.exists(label_path):
            label_preview = self.get_label_preview(labelname, "")
            label_params = LabelSmallBusiness5Reader(label_path).get_label_params()
            return [label_preview, label_params]
        
    def setLabelParams(self, labelname, labeldata):
        """ Updates label params in label file. """
        label_path: str = __file__[:-21]+"etykiety/"+labelname
        if os.path.exists(label_path):
            with open(label_path, 'r') as file:
                data = file.read()
                data = self.process_smallbusiness_code(data) # ttututut
        return data
        
    def get_label_params_web(self, labelname):
        """ Gets label params from label file but its for web purpose. """
        label_path: str = __file__[:-21]+"etykiety/"+labelname
        if os.path.exists(label_path):
            label_preview = self.get_label_preview(labelname, "")
            label_smallbusiness_code = self.get_label_smallbusiness_code(labelname)
            return label_smallbusiness_code
        
    def get_label_smallbusiness_code(self, labelname):
        """ 
        Gets label smallbusiness code as list format from label file.

        Args:
            labelname (str): filename of label to get smallbusiness code from

        Returns:
            List: [str, dict]: string line of file, label params
        """
        label_path: str = __file__[:-21]+"etykiety/"+labelname
        if os.path.exists(label_path):
            with open(label_path, 'r') as file:
                data = file.read()
                props_sm_code = self.process_smallbusiness_code(data)
        return [data, props_sm_code]
    
    def process_smallbusiness_code(self, line) -> dict:
        """ Splits smallbusiness code into properties.

        Args:
            line (str): line of file

        Returns:
            dict: splitted properties
        """
        index_fun = 0
        index_prop = 0
        properties = dict()
        if line.find('FONT \"Arial\",'):
            fun = 'FONT \"Arial\",'
            index_fun = line.find('FONT \"Arial\",')
            index_prop += len(fun) + index_fun
            line_arr = line.split(',')
            properties['font_size'] = line_arr[0]
            properties['font_type'] = line_arr[1]
            properties['font_width'] = line_arr[2]
        return properties
    
    def delete_label(self, labelname):
        """Deletes label

        Args:
            labelname (str)

        Returns:
            [res_msg, res_status] (str, num)
        """
        res_msg = ""
        res_status = 200
        labels_path: str = __file__[:-21]+"etykiety/"
        if os.path.exists(labels_path + labelname):
            os.remove(labels_path + labelname)
            res_msg = "Removed file "+labelname
        else:
            res_status = 400
            res_msg = "The file does not exist"
        return [res_msg, res_status]
    
    def create_label(self, smallbusiness_str):
        path = __file__[:-21]+"etykiety/"
        cmd = f'touch {path}{self.label_name}.TXT'
        os.system(cmd)
        f = open(f"{path}{self.label_name}.TXT", "w")
        f.write(smallbusiness_str)
        f.close
        
    def check_label_exist(self, label_name):
        path = __file__[:-21]+"etykiety/"
        print(path + label_name)
        if os.path.exists(path + label_name):
            return True
        else:
            return False
    
    def create_tmp_file(self, smallbusiness_str):
        path = __file__[:-21]+"etykiety/"
        cmd = f'touch {path}tmp_sb_file.TXT'
        os.system(cmd)
        f = open(f"{path}tmp_sb_file.TXT", "w")
        f.write(smallbusiness_str)
        f.close
    
    def generate_smallbusiness_code(self, data):
        smallbusiness_str = """// Etykieta dla programu "SMALL BUSINESS 5.1" 
// 
// PROSZĘ NIE EDYTOWAĆ TEGO PLIKU SAMODZIELNIE, 
// GDYŻ MOŻNA GO USZKODZIĆ! 
// 
        """
        for category in data:
            for case in data[category]:
                smallbusiness_str += self.not_really_switch_case(data, category, case)
                
        return smallbusiness_str
                
    def not_really_switch_case(self, data, category, case):
        if category == 'label':
            if case == 'title':
                self.label_name = str(data[category][case])
                return f'\nNAME "{str(data[category][case])}"\n'
            elif case == 'width':
                self.width = data[category][case]
                return f'SIZE {str(data[category][case])},'
            elif case == 'height':
                self.height = data[category][case]
                return f'{str(data[category][case])}\n\n'
        elif category == 'product_name' and data['checkboxes'][0] == True:
            if case == 'font_size':
                return f'FONT "Arial", {str(data[category][case])}, NORMAL, 100%\n'
            elif case == 'X':
                return f'CMTEXT {str(data[category][case])},'
            elif case == 'Y':
                return f' {str(data[category][case])}, 0, {str(int(self.width) - 2)}, 6, "%OPIS_TOWARU%"\n'
        elif category == 'barcode' and data['checkboxes'][1] == True:
            if case == 'X':
                return f'CMBAR {str(data[category][case])},'
            elif case == 'Y':
                return f' {str(data[category][case])},'
            elif case == 'height':
                return f' {str(data[category][case])},'
            elif case == 'width':
                return f' {str(data[category][case])}, 0, "%KOD%"\n'
        elif category == 'indexBarcode' and data['checkboxes'][2] == True:
            if case == 'X':
                return f'CMBARINDEX {str(data[category][case])},'
            elif case == 'Y':
                return f' {str(data[category][case])},'
            elif case == 'height':
                return f' {str(data[category][case])},'
            elif case == 'width':
                return f' {str(data[category][case])}, 0, "%KODINDEX%"\n'
        elif category == 'index' and data['checkboxes'][3] == True:
            if case == 'font_size':
                return f'FONT {str(data[category][case])}\n'
            elif case == 'X':
                return f'CMTEXT {str(data[category][case])},'
            elif case == 'Y':
                return f' {str(data[category][case])}, 0, {str(int(self.width) - 2)}, 3, "%NAZWA%"\n'
        elif category == 'price' and data['checkboxes'][4] == True:
            if case == 'font_size':
                return f'FONT {str(data[category][case])}\n'
            elif case == 'X':
                return f'CMTEXT {str("{:.2f}".format(float(data[category][case])))},'
            elif case == 'Y':
                return f' {str(data[category][case])}, 0, {str(int(self.width) - 2)}, 1, "%CENA1B% zł"\n'
        elif category == 'jm' and data['checkboxes'][5] == True:
            if case == 'font_size':
                return f'FONT {str(data[category][case])}\n'
            elif case == 'X':
                return f'CMTEXT {str(data[category][case])},'
            elif case == 'Y':
                return f' {str(data[category][case])}, 0, {str(int(self.width) - 2)}, 1, "%JEDN%"\n'
        return ""
    
    def getAllLabels(self) -> list():
        labels_path: str = __file__[:-21]+"etykiety"
        onlyfiles: list() = [f for f in os.listdir(labels_path) if os.path.isfile(os.path.join(labels_path, f))]
        return onlyfiles
    
    def edit_label(self, label_name, smallbusiness_str):
        label_path = __file__[:-21]+"etykiety/"+label_name
        f = open(label_path, "w")
        f.write(smallbusiness_str)
        f.close()