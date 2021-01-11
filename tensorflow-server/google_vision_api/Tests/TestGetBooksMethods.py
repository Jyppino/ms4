import os
import sys
# This allows importing of other modules for the CI pipeline
sys.path.append(os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir))

import unittest
from formatexception import FormatException
from GetBooksFromImage import BookFinder
from PIL import Image
import json
import io


class TestGetBooksMethods(unittest.TestCase):

    def setUp(self):
        self.default_image = Image.open("./default_img.jpeg")
        with open("./default_img_json_data.json", 'r') as jsd:
            json_data = jsd.read()
        self.default_json = json.dumps(json.loads(json_data))
        self.bf = BookFinder(image=self.default_image, jsonarray=self.default_json)

    # This test checks if an image is succesfully converted to a byte array
    # If not, an exception should be raised.
    def test_convert_img_to_bytes(self):
        answer = type(io.BytesIO().getvalue())
        result = type(self.bf.convert_image_to_bytes(image=self.default_image))
        self.assertEqual(answer, result)

    def test_fails_convert_img_to_bytes_with_None(self):
        with self.assertRaises(FormatException):
            self.bf.convert_image_to_bytes(image=None)

    def test_fails_convert_img_to_bytes_with_wrong_file(self):
        with self.assertRaises(FormatException):
            self.bf.convert_image_to_bytes(image=__file__)

    def test_cut_out_books(self):
        self.bf.cut_out_books()

        answer = 18
        num_books_found = self.bf.jsonarray[0]['numObjects']
        self.assertEqual(answer, num_books_found)


if __name__ == "__main__":
    unittest.main()
