# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types

# set path to json credential file
import environ


class GoogleVisionOCR:

    def __init__(self):
        # Set path to Google Vision JSON credential file
        environ.setPathToDefault()

        # books is an array that contains images of single books
        self.books = []
        # results is an array that contains the string corresponding to the books in books
        self.results = []
        # labels will store the full result from Google Vision
        self.labels = None
        # Instantiates a client
        self.client = vision.ImageAnnotatorClient()

    def find_book_text(self):
        for i in range(len(self.books)):

            book = self.books[i]

            image = types.Image(content=book)
            # Performs label detection on the image file
            response = self.client.document_text_detection(image=image)
            labels = response.text_annotations

            if not labels:
                self.results.append("WARNING: NO RESULT")
                continue
            self.labels = labels

            # This takes the full result string, and parses it to something more readable for people
            self.results.append(labels[0].description.replace('\n', " ").strip())

    def get_results(self):
        return self.results
