# MyShelf Tensorflow Branch
This folder contains the code and models for the MyShelf book detection functionality.
A demo of this functionality can be found at: http://167.99.208.70:5000/

Features of the Tenserflow Server:
- Detect books in an image
- Run OCR on every detected book

Dependencies:
- Pillow (>=1.0)
- Flask
- tensorflow (>=1.8)
- six
- matplotlib
- protobuf (>=3.0)

Install instructions:
- Run: python setup.py install
- If the above fails, install dependencies manually
- Run: python server.py
