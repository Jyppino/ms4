import os
import sys
# This allows importing of other modules for the CI pipeline
sys.path.append(os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir))

import unittest
from googlevisionocr import GoogleVisionOCR
from GetBooksFromImage import BookFinder
import environ
import io
import google
from google.cloud import vision


class TestOCRMethods(unittest.TestCase):

    def setUp(self):
        self.ocr = GoogleVisionOCR()
        environ.setPathToDefault()

    # This test provides a book which is readable by the OCR
    # And asserts the result is the actual text on the book
    def test_ocr_results(self):
        with io.open('./book_readable.jpeg', 'rb') as book:
            self.ocr.books = [book.read()]
        self.ocr.find_book_text()
        results = self.ocr.get_results()
        answer = ["Alice LaPlante Hersenspinsels"]
        self.assertEqual(results, answer)

    # This test provides a book img which is not readable by the OCR
    # Therefore the result will be the default result when no text can be found
    def test_fail_find_texts_on_books(self):
        with io.open('./book_not_readable.jpeg', 'rb') as book:
            self.ocr.books = [book.read()]
        self.ocr.find_book_text()
        self.assertEqual(self.ocr.get_results(), ["WARNING: NO RESULT"])

    # Changing the JSON key file to something
    # that does not give authorization to use Google Vision should result in an Error
    def test_fail_no_json_key_found(self):
        with self.assertRaises(google.auth.exceptions.DefaultCredentialsError):
            environ.setEnvironmentVariable(os.path.realpath(__file__))
            self.ocr.client = vision.ImageAnnotatorClient()


if __name__ == "__main__":
    unittest.main()
