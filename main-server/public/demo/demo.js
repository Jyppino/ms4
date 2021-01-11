/*jshint esversion: 6 */
// DEMO FOR TESTING/DEMONSTRATION PURPOSES ONLY 
window.onload = function() {
  let scoreThreshold = 0.7;
  let apiServer = window.location.origin + '/api/image';
  let imageInput = document.getElementById('imglocation');
  let canvasHolder = document.getElementById('canvasholder');
  let loader = document.getElementById('loader');

  loader.style.visibility = 'hidden';

  // create a canvas for image
  let imageCanvas = document.createElement('canvas');
  imageCanvas.style = "position:absolute;";
  canvasHolder.appendChild(imageCanvas);
  let imageCtx = imageCanvas.getContext("2d");

  // create a canvas for drawing object boundaries
  let drawCanvas = document.createElement('canvas');
  drawCanvas.style = "position:absolute;";
  canvasHolder.appendChild(drawCanvas);
  let drawCtx = drawCanvas.getContext("2d");

  let img = new Image();
  img.onload = function() {
    drawImage(this);
  };
  img.src = '/demo/demo.jpg';

  document.getElementById('btn').onclick = function() {
    this.disabled = true;
    loader.style.visibility = 'visible';
    document.getElementById('resultsholder').innerHTML = "";
    imageCanvas.toBlob(postFile, 'image/jpeg');
  };

  imageInput.addEventListener('change', function(event) {
    if (imageInput.files && imageInput.files[0]) {
      let img = new Image();
      img.onload = function() {
        drawImage(this);
      };
      img.src = URL.createObjectURL(event.target.files[0]);
    }
  });

  // FUNCTION DEFINITIONS
  function drawImage(image) {
    var maxWidth = 1200;
    var maxHeight = 1200;
    var ratio = 0;
    var width = image.width;
    var height = image.height;

    // Check if the current width is larger than the max
    if (width > maxWidth) {
      ratio = maxWidth / width;
      image.style.width = maxWidth;
      image.style.height = height * ratio;
      height = height * ratio;
      width = width * ratio;
    }

    // Check if current height is larger than max
    if (height > maxHeight) {
      ratio = maxHeight / height;
      image.style.height = maxHeight;
      image.style.width = width * ratio;
      width = width * ratio;
      height = height * ratio;
    }

    //Set canvas sizes based on input image
    drawCanvas.width = width;
    drawCanvas.height = height;
    imageCanvas.width = width;
    imageCanvas.height = height;

    //Some styles for the drawcanvas
    drawCtx.lineWidth = 4;
    drawCtx.strokeStyle = "cyan";
    drawCtx.font = "20px Verdana";
    drawCtx.fillStyle = "cyan";

    imageCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
  }


  function drawBoxes(objects) {
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    objects.filter(object => object.title).forEach(object => {
      let x = object.x * drawCanvas.width;
      let y = object.y * drawCanvas.height;
      let width = (object.width * drawCanvas.width) - x;
      let height = (object.height * drawCanvas.height) - y;

      let col = getRandomColor();
      drawCtx.strokeStyle = col;

      //drawCtx.fillText(object.class_name + " - " + Math.round(object.score * 100) + "%", x + 5, y + 20);
      drawCtx.strokeRect(x, y, width, height);

      let id = object.id;
      let title = object.title;
      let author = object.authors[0].name;

      let li = document.createElement("li");
      li.style = 'color: ' + col + ';';
      li.innerHTML = id + " - " + title + " by " + author;

      document.getElementById('resultsholder').appendChild(li);
    });
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function postFile(file) {
    let formdata = new FormData();
    formdata.append("image", file);
    formdata.append("threshold", scoreThreshold);

    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', apiServer, true);
    xhr.onload = function() {
      console.log(this.response);
      if (this.status === 200) {
        let objects = JSON.parse(this.response);
        drawBoxes(objects);
        document.getElementById('btn').disabled = false;
        loader.style.visibility = 'hidden';
      } else {
        console.error(xhr);
      }
    };
    xhr.send(formdata);
  }
};
