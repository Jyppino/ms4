import sys
import os
import traceback
import json
sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import object_detection_api
from PIL import Image
from flask import Flask, request, Response
from google_vision_api.GetBooksFromImage import BookFinder

app = Flask(__name__)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST')
    return response

@app.route('/image', methods=['POST']) # route to receive image on
def image():
    try:
        image_file = request.files['image']
        threshold = request.form.get('threshold')
        if threshold is None:
            threshold = 0.7
        else:
            threshold = float(threshold)

        image_object = Image.open(image_file)
        objects = object_detection_api.get_objects(image_object, threshold)

        bf = BookFinder(image_object, objects)
        bf.cut_out_books()
        objects = json.dumps(bf.jsonarray)

        return objects

    except Exception as e:
        traceback.print_exc()
        return e

if __name__ == '__main__':
    app.run(debug=True)
