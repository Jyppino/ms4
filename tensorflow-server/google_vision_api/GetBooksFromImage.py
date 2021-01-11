import io
import json

from googlevisionocr import GoogleVisionOCR
from formatexception import FormatException


class BookFinder:

    def __init__(self, image, jsonarray):
        self.width, self.height = image.size
        self.jsonarray = json.loads(jsonarray)
        self.img = image
        self.ocr = GoogleVisionOCR()

    # Take a PIL Image, and converts it into a byte stream for OCR
    def convert_image_to_bytes(self, image):
        try:
            imgarr = io.BytesIO()
            image.save(imgarr, format="JPEG")
            imgarr = imgarr.getvalue()
            return imgarr
        except:
            raise FormatException("Image file is of the wrong format")

    # Cuts out all books from tensorflow json data, and applies OCR on them
    def cut_out_books(self):
        # If jsonarray is empty, Tensorflow did not find any books in the image
        if len(self.jsonarray) > 0:
            temp = []
            for box in self.jsonarray:
                self.ocr.books = []
                self.ocr.results = []

                # Skip the first dict, it contains metadata over the rest
                if box.get('numObjects'):
                    temp.append(box)
                    continue
                y = box['y'] * float(self.height)
                x = box['x'] * float(self.width)
                height = box['height'] * float(self.height)
                width = box['width'] * float(self.width)
                book_crop = self.img.crop((x, y, width, height))
                book = self.convert_image_to_bytes(book_crop)
                self.ocr.books.append(book)
                self.ocr.find_book_text()
                
                self.process_single_word(box)

                ocr_result = self.ocr.get_results()[0]
                box['name'] = ocr_result
                if "WARNING: NO RESULT" in ocr_result:
                    continue
                temp.append(box)

            self.jsonarray = temp
            # Adjusting the amount of objects in the metadata to comply with the amount of books where OCR had a result

            self.jsonarray[0]['numObjects'] = len(temp) - 1

    # This method checks the location and height for each individual word found, and adds that data to the JSON object
    def process_single_word(self, box):
        word_data_array = []

        # If labels is empty, do nothing
        if self.ocr.labels is None:
            return

        # For each word found on a book, we save additional data such as the height of the word
        # The location of its centre, and the word itself
        for label in self.ocr.labels:
            word_data = {}
            word_data['word'] = label.description
            xs = []
            ys = []
            for vertice in label.bounding_poly.vertices:
                xs.append(vertice.x)
                ys.append(vertice.y)
            min_x = min(xs)
            max_x = max(xs)
            min_y = min(ys)
            max_y = max(ys)
            # A word is assumed to always be more wide than high
            # so we take the minimum of it's delta x and delta y as its height
            word_height = min((max_x - min_x), (max_y - min_y))
            centre_point_x = float(float(max_x) + float(min_x)) / 2.0
            centre_point_y = float(float(max_y) + float(min_y)) / 2.0

            word_data['height'] = word_height
            word_data['centre_x'] = centre_point_x
            word_data['centre_y'] = centre_point_y

            word_data_array.append(word_data)
        box['word_data_array'] = word_data_array
