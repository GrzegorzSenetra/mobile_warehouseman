import base64
from rest_framework.views import APIView
from rest_framework.response import Response
import os
from PIL import Image
import zpl
import re
from theme.modules.supermagazynier.views.Zpl2Generator import Zpl2Generator
from theme.modules.supermagazynier.views.Settings import Settings

class PrintTag(APIView):
    def post(self, request, filename, user_id):
        product = request.data
        quantity = request.data["quantity"]
        Generator = Zpl2Generator(product)
        readed_file = Generator.read_file(filename)
        zpl2_code = readed_file[0]
        image = readed_file[1]
        label_size = Generator.size
        image_label_zpl2 = self.generate_label_with_image(image, label_size)
        code = re.sub(r'[^a-zA-Z0-9]', '', product['code'])
        self.create_file_with_zpl2_code(image_label_zpl2, code) # zpl2_code
        for i in range(0,quantity):
            printerExecName = Settings.getPrinterExecName(user_id)
            self.print_label(code, printerExecName)
        self.delete_file(code)
        return Response(image_label_zpl2, content_type="application/json")
    
    def generate_label_with_image(self, image, size):
        """Returns zpl2 code with image created from zpl2 code generator.
        Its important becouse zebra printer cant print polish characters from raw
        zpl2 code.

        Args:
            image (PIL.Image): An image from witch it will create zpl2 code. It must be image converted to PIL format.
            size (List<number>): Size of a label. It contains [height, width]

        Returns:
            [string]: zpl2 code with only image in it
        """
        l = zpl.Label(size[1],size[0], 8)
        print("&&&&&&&&&&&&&&&&&&&&&&")
        print(size)
        IMAGE_WIDTH = size[0]
        IMAGE_PATH = f'/home/grzegorz/metalzbyt_panel/src/theme/modules/supermagazynier/assets/preview.jpg'
        l.origin(0, 0)
        l.write_graphic(
            image,
            IMAGE_WIDTH, size[1])
        l.endorigin()
        return l.dumpZPL()

    def convert_image2base64(self, image):
        """Converts PIL image to base64 code

        Args:
            image (PIL.Image): Image to be converted

        Returns:
            [string]: base64 image
        """
        image_path = "/home/grzegorz/metalzbyt_panel/src/theme/modules/supermagazynier/assets/preview.png"
        image.save(image_path,"png")
        encoded_string = ''
        with open(image_path, 'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read())
        width, height = image.size
        return encoded_string

    def delete_file(self, product_code):
        cmd = 'rm file' + product_code + '.zpl'
        os.system(cmd)
    
    def print_label(self, product_code, printer):
        # cmd = 'lp -d zebra-raw6 file' + product_code + '.zpl'
        cmd = 'lp -d ' + printer + ' file' + product_code + '.zpl'
        os.system(cmd)
    
    def create_file_with_zpl2_code(self, code, product_code):
        cmd = 'touch file' + product_code + '.zpl'
        os.system(cmd)
        f = open("file" + product_code + ".zpl", "w")
        f.write(code)
        f.close
