import os

path_to_json_file = "./Google_Vision_JSON/MS-4-9c1dae9490f7.json"


def setEnvironmentVariable(path):
    if os.path.isfile(path):
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = path
    else:
        print(path)
        raise FileNotFoundError("Can't locate Google Vision JSON file")


def setPathToDefault():
    setEnvironmentVariable(getAbsPathToDefaultFile())


def getAbsPathToDefaultFile():
    path = os.path.dirname(__file__) + "/Google_Vision_JSON/MS-4-9c1dae9490f7.json"
    return os.path.abspath(path)

def getPath():
    print(os.environ["GOOGLE_APPLICATION_CREDENTIALS"])