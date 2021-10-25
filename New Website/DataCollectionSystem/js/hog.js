/*var processing = require("./processing"),
    norms = require("./norms");

module.exports = {
  extractHOG: extractHOG,
  extractHistograms: extractHistograms,
  extractHOGFromHistograms: extractHOGFromHistograms
}

// also export all the functions from processing.js
for (var func in processing) {
  module.exports[func] = processing[func];
}
*/


var epsilon = 0.00001;

var norms = {
  L1: function(vector) {
    var norm = 0;
    for (var i = 0; i < vector.length; i++) {
      norm += Math.abs(vector[i]);
    }
    var denom = norm + epsilon;

    for (var i = 0; i < vector.length; i++) {
      vector[i] /= denom;
    }
  },

 'L1-sqrt': function(vector) {
    var norm = 0;
    for (var i = 0; i < vector.length; i++) {
      norm += Math.abs(vector[i]);
    }
    var denom = norm + epsilon;

    for (var i = 0; i < vector.length; i++) {
      vector[i] = Math.sqrt(vector[i] / denom);
    }
  },

  L2: function(vector) {
    var sum = 0;
    for (var i = 0; i < vector.length; i++) {
      sum += Math.pow(vector[i], 2);
    }
    var denom = Math.sqrt(sum + epsilon);
    for (var i = 0; i < vector.length; i++) {
      vector[i] /= denom;
    }
  }
}




var processing = {
  intensities: function(imagedata) {
    if (!imagedata.data) {
      // it's a canvas, extract the imagedata
      var canvas = imagedata;
      var context = canvas.getContext("2d");
      imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
    }

    var lumas = new Array(imagedata.height);
    for (var y = 0; y < imagedata.height; y++) {
      lumas[y] = new Array(imagedata.width);

      for (var x = 0; x < imagedata.height; x++) {
        var i = x * 4 + y * 4 * imagedata.width;
        var r = imagedata.data[i],
            g = imagedata.data[i + 1],
            b = imagedata.data[i + 2],
            a = imagedata.data[i + 3];

        var luma = a == 0 ? 1 : (r * 299/1000 + g * 587/1000
          + b * 114/1000) / 255;

        lumas[y][x] = luma;
      }
    }
    return lumas;
  },

  gradients: function(canvas) {
    var intensities = this.intensities(canvas);
    return this._gradients(intensities);
  },

  _gradients: function(intensities) {
    var height = intensities.length;
    var width = intensities[0].length;

    var gradX = new Array(height);
    var gradY = new Array(height);

    for (var y = 0; y < height; y++) {
      gradX[y] = new Array(width);
      gradY[y] = new Array(width);

      var row = intensities[y];

      for (var x = 0; x < width; x++) {
        var prevX = x == 0 ? 0 : intensities[y][x - 1];
        var nextX = x == width - 1 ? 0 : intensities[y][x + 1];
        var prevY = y == 0 ? 0 : intensities[y - 1][x];
        var nextY = y == height - 1 ? 0 : intensities[y + 1][x];

        // kernel [-1, 0, 1]
        gradX[y][x] = -prevX + nextX;
        gradY[y][x] = -prevY + nextY;
      }
    }

    return {
      x: gradX,
      y: gradY
    };
  },

  gradientVectors: function(canvas) {
    var intensities = this.intensities(canvas);
    return this._gradientVectors(intensities);
  },

  _gradientVectors: function(intensities) {
	  //console.log("in  _gradientVectors");
    var height = intensities.length;
    var width = intensities[0].length;

    var vectors = new Array(height);

    for (var y = 0; y < height; y++) {
      vectors[y] = new Array(width);

      for (var x = 0; x < width; x++) {
        var prevX = x == 0 ? 0 : intensities[y][x - 1];
        var nextX = x == width - 1 ? 0 : intensities[y][x + 1];
        var prevY = y == 0 ? 0 : intensities[y - 1][x];
        var nextY = y == height - 1 ? 0 : intensities[y + 1][x];

        // kernel [-1, 0, 1]
        var gradX = -prevX + nextX;
        var gradY = -prevY + nextY;

        vectors[y][x] = {
          mag: Math.sqrt(Math.pow(gradX, 2) + Math.pow(gradY, 2)),
          orient: Math.atan2(gradY, gradX)
        }
      }
    }
	//console.log("vectors with magnitude in them:");
	//console.log(vectors);
    return vectors;
  },

  drawGreyscale: function(canvas) {
    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var intensities = this.intensities(canvas);

    for (var y = 0; y < imageData.height; y++) {
      for (var x = 0; x < imageData.width; x++) {
        var i = (y * 4) * imageData.width + x * 4;
        var luma = intensities[y][x] * 255;

        imageData.data[i] = luma;
        imageData.data[i + 1] = luma;
        imageData.data[i + 2] = luma;
        imageData.data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    return canvas;
  },

  drawGradient: function(canvas, dir) {
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var gradients = this.gradients(canvas);
    var grads = gradients[dir || "x"];

    for (var y = 0; y < imageData.height; y++) {
      for (var x = 0; x < imageData.width; x++) {
        var i = (y * 4) * imageData.width + x * 4;
        var grad = Math.abs(grads[y][x]) * 255;

        imageData.data[i] = grad;
        imageData.data[i + 1] = grad;
        imageData.data[i + 2] = grad;
        imageData.data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    return canvas;
  },

  drawMagnitude: function(canvas) {
	//console.log("in drawmagnitude");
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var vectors = processing.gradientVectors(canvas);
	//console.log("vectors of magnitude:");
	//console.log(vectors);

    for (var y = 0; y < imageData.height; y++) {
      for (var x = 0; x < imageData.width; x++) {
        var i = (y * 4) * imageData.width + x * 4;
        var mag = Math.abs(vectors[y][x].mag) * 255;

        imageData.data[i] = mag;
        imageData.data[i + 1] = mag;
        imageData.data[i + 2] = mag;
        imageData.data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    return canvas;
  },

  drawOrients: function(canvas) {
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var vectors = processing.gradientVectors(canvas);

    for (var y = 0; y < imageData.height; y++) {
      for (var x = 0; x < imageData.width; x++) {
        var i = (y * 4) * imageData.width + x * 4;
        var orient = Math.abs(vectors[y][x].orient);
        orient *= (180 / Math.PI);
        if (orient < 0) {
          orient += 180;
        }
        orient *= 255 / 180;

        imageData.data[i] = orient;
        imageData.data[i + 1] = orient;
        imageData.data[i + 2] = orient;
        imageData.data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    return canvas;
  }
}

//module.exports = processing;




//var hog = {

	function extractHOG(canvas, options) {
	  var histograms = extractHistograms(canvas, options);
	  return extractHOGFromHistograms(histograms, options);
	}


	function extractHistograms(canvas, options) {
	  var vectors = processing.gradientVectors(canvas);

	  var cellSize = options.cellSize || 4;
	  var bins = options.bins || 6;

	  var cellsWide = Math.floor(vectors[0].length / cellSize);
	  var cellsHigh = Math.floor(vectors.length / cellSize);

	  var histograms = new Array(cellsHigh);

	  for (var i = 0; i < cellsHigh; i++) {
	    histograms[i] = new Array(cellsWide);

	    for (var j = 0; j < cellsWide; j++) {
	      histograms[i][j] = getHistogram(vectors, j * cellSize, i * cellSize,
	                                      cellSize, bins);
	    }
	  }
	  return histograms;
	}


	/* This function is decoupled so you can extract histograms for an entire image
	 * to save recomputation, and use these to get HOGs from individual windows
	 */
	function extractHOGFromHistograms(histograms, options) {
	  var blockSize = options.blockSize || 2;
	  var blockStride = options.blockStride || (blockSize / 2);
	  var normalize = norms[options.norm || "L2"];

	  var blocks = [];
	  var blocksHigh = histograms.length - blockSize + 1;
	  var blocksWide = histograms[0].length - blockSize + 1;

	  for (var y = 0; y < blocksHigh; y += blockStride) {
	    for (var x = 0; x < blocksWide; x += blockStride) {
	      var block = getBlock(histograms, x, y, blockSize);
	      normalize(block);
	      blocks.push(block);
	    }
	  }
	  return Array.prototype.concat.apply([], blocks);
	}

	function getBlock(matrix, x, y, length) {
	  var square = [];
	  for (var i = y; i < y + length; i++) {
	    for (var j = x; j < x + length; j++) {
	      square.push(matrix[i][j]);
	    }
	  }
	  return Array.prototype.concat.apply([], square);
	}

	function getHistogram(elements, x, y, size, bins) {
	  var histogram = zeros(bins);

	  for (var i = 0; i < size; i++) {
	    for (var j = 0; j < size; j++) {
	      var vector = elements[y + i][x + j];
	      var bin = binFor(vector.orient, bins);
	      histogram[bin] += vector.mag;
	    }
	  }
	  return histogram;
	}

	function binFor(radians, bins) {
	  var angle = radians * (180 / Math.PI);
	  if (angle < 0) {
	    angle += 180;
	  }

	  // center the first bin around 0
	  angle += 90 / bins;
	  angle %= 180;

	  var bin = Math.floor(angle / 180 * bins);
	  return bin;
	}

	function zeros(size) {
	  var array = new Array(size);
	  for (var i = 0; i < size; i++) {
	    array[i] = 0;
	  }
	  return array;
	}
//}










/*

function drawThings(canvas) {
  var greyscale = cloneCanvas(canvas);
  hog.drawGreyscale(greyscale);

  writeCanvasToFile(greyscale, __dirname + "/greyscale.jpg", function() {
    //console.log("wrote greyscale");
  })

  var gradx = cloneCanvas(canvas);
  hog.drawGradient(gradx, 'x');

  writeCanvasToFile(gradx, __dirname + "/gradient-x.jpg", function() {
    //console.log("wrote gradient-x");
  })

  var grady = cloneCanvas(canvas);
  hog.drawGradient(grady, 'y');

  writeCanvasToFile(grady, __dirname + "/gradient-y.jpg", function() {
    //console.log("wrote gradient-y");
  })

  var mag = cloneCanvas(canvas);
  hog.drawMagnitude(mag);

  writeCanvasToFile(mag, __dirname + "/magnitude.jpg", function() {
    console.log("wrote magnitude");
  })
}
*/

function cloneCanvas(canvas) {
  var c2 = document.createElement('canvas'); //new Canvas(canvas.width, canvas.height);
  c2.width = canvas.width;
  c2.height = canvas.height;
  var imageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
  c2.getContext("2d").putImageData(imageData, 0, 0);
  console.log(c2);
  return c2;
}

/*
function drawImgToCanvas(file, callback) {
  fs.readFile(file, function(err, data) {
    if (err) throw err;

    var img = new Canvas.Image();
    img.src = new Buffer(data, 'binary');

    var canvas = new Canvas(img.width, img.height);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    callback(canvas);
  });
}

function writeCanvasToFile(canvas, file, callback) {
  var out = fs.createWriteStream(file)
  var stream = canvas.createJPEGStream();

  stream.on('data', function(chunk) {
    out.write(chunk);
  });

  stream.on('end', function() {
    callback();
  });
}
*/