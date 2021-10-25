/*
	
	This worked needs to be fed an array of 7 values, representing 7 ratios of a human face. The order can be found in the facets list mentioned below.
	
*/


importScripts('js/tensorflowjs.js');                 /* imports just "foo.js" */

let model;
const facets = ['cjwr', 'whr', 'par', 'es', 'lfh', 'fwh', 'meh'];

// These constants are hardcoded for the current bmi prediction model
const min_max = {
  "cjwr": [
    1.1668635588181115,
    1.4312148765065904
  ],
  "whr": [
    1.081304761956934,
    2.5299240810454937
  ],
  "par": [
    0.0021801419001935434,
    0.00397285938970961
  ],
  "es": [
    60.347967331863515,
    144.31116876525167
  ],
  "lfh": [
    0,
    0.9156875346553504
  ],
  "fwh": [
    0.974840449509464,
    1.6828843745317048
  ],
  "meh": [
    648.5544095768378,
    1160.9340538753534
  ],
  "bmi": [
    14.196863169280693,
    41.78668505821737
  ]
}


async function init_tf() {
    
    console.log("LOADING BMI TENSORFLOW MODEL");
    const LOCAL_MODEL_PATH = './models/bmi.json';





    const DYNAMIC_MODEL_PATH = "https://pacocaapps.github.io/models/bmi.json"
	const dmencia = '{"modelTopology":{"class_name":"Sequential","config":[{"class_name":"Dense","config":{"units":343,"activation":"linear","use_bias":true,"kernel_initializer":{"class_name":"VarianceScaling","config":{"scale":1,"mode":"fan_avg","distribution":"normal","seed":null}},"bias_initializer":{"class_name":"Zeros","config":{}},"kernel_regularizer":null,"bias_regularizer":null,"activity_regularizer":null,"kernel_constraint":null,"bias_constraint":null,"name":"dense_Dense1","trainable":true,"batch_input_shape":[null,7],"dtype":"float32"}},{"class_name":"Dense","config":{"units":343,"activation":"relu","use_bias":true,"kernel_initializer":{"class_name":"VarianceScaling","config":{"scale":1,"mode":"fan_avg","distribution":"normal","seed":null}},"bias_initializer":{"class_name":"Zeros","config":{}},"kernel_regularizer":null,"bias_regularizer":null,"activity_regularizer":null,"kernel_constraint":null,"bias_constraint":null,"name":"dense_Dense2","trainable":true}},{"class_name":"Dense","config":{"units":343,"activation":"relu","use_bias":true,"kernel_initializer":{"class_name":"VarianceScaling","config":{"scale":1,"mode":"fan_avg","distribution":"normal","seed":null}},"bias_initializer":{"class_name":"Zeros","config":{}},"kernel_regularizer":null,"bias_regularizer":null,"activity_regularizer":null,"kernel_constraint":null,"bias_constraint":null,"name":"dense_Dense3","trainable":true}},{"class_name":"Dense","config":{"units":35,"activation":"relu","use_bias":true,"kernel_initializer":{"class_name":"VarianceScaling","config":{"scale":1,"mode":"fan_avg","distribution":"normal","seed":null}},"bias_initializer":{"class_name":"Zeros","config":{}},"kernel_regularizer":null,"bias_regularizer":null,"activity_regularizer":null,"kernel_constraint":null,"bias_constraint":null,"name":"dense_Dense4","trainable":true}},{"class_name":"Dense","config":{"units":1,"activation":"linear","use_bias":true,"kernel_initializer":{"class_name":"VarianceScaling","config":{"scale":1,"mode":"fan_avg","distribution":"normal","seed":null}},"bias_initializer":{"class_name":"Zeros","config":{}},"kernel_regularizer":null,"bias_regularizer":null,"activity_regularizer":null,"kernel_constraint":null,"bias_constraint":null,"name":"dense_Dense5","trainable":true}}],"keras_version":"tfjs-layers 1.0.0","backend":"tensor_flow.js"},"format":"layers-model","generatedBy":"TensorFlow.js tfjs-layers v1.0.0","convertedBy":null,"weightsManifest":[{"paths":["./bmi.bin"],"weights":[{"name":"dense_Dense1/kernel","shape":[7,343],"dtype":"float32"},{"name":"dense_Dense1/bias","shape":[343],"dtype":"float32"},{"name":"dense_Dense2/kernel","shape":[343,343],"dtype":"float32"},{"name":"dense_Dense2/bias","shape":[343],"dtype":"float32"},{"name":"dense_Dense3/kernel","shape":[343,343],"dtype":"float32"},{"name":"dense_Dense3/bias","shape":[343],"dtype":"float32"},{"name":"dense_Dense4/kernel","shape":[343,35],"dtype":"float32"},{"name":"dense_Dense4/bias","shape":[35],"dtype":"float32"},{"name":"dense_Dense5/kernel","shape":[35,1],"dtype":"float32"},{"name":"dense_Dense5/bias","shape":[1],"dtype":"float32"}]}]}'
    try {
        model = await tf.loadLayersModel(dmencia);
		postMessage({'loaded':'bmi'});
    } catch (err) {
        console.log("failed to load bmi prediction model");
    }

}


init_tf();


onmessage = async function(incoming) {
 		//console.log('Message received from main script');
  
  	var return_message = null;
  
	if (!model) {
		//console.log("* no model loaded")
		return null;
	}else{
		//console.log("onmessage in bmi worker. Model was loaded. incoming data:");
		//console.log(incoming.data);
		
		var face_ratios_array = []
		
		// If the worker receives 68 face parts, turn them into the 7 ratios first.
		if( incoming.data.length == 68){
			//console.log("bmi worker received array of length 68. Will convert landmarks to ratios first.");
			face_ratios_array = landmarks_to_facets(incoming.data);
			//console.log("BMI webworker: calculated face_ratios_array = " + face_ratios_array);
		}
		
		// If the worker receives 7 ratios, use those.
		else if( incoming.data.length == 7){
			//console.log("bmi worker received array of length 7. Will assume these are face ratios.");
			face_ratios_array = incoming.data;
		}
		else{
			//console.log("BMI webworker received unusable data. Should be array of length 7 (ratios) or 68 (landmarks).");
			postMessage("bmi prediction error");
			return null;
		}
		
		try {
			// Normalize face ratios to values between 0 and 1
			var normalized = [];
			for (var j = 0; j < facets.length; j++) { // loop over all facet types
				var facet = facets[j]; // string name of current facet
				normalized.push(normalize(face_ratios_array[j], min_max[facet][0], min_max[facet][1]));
			}
			//console.log("normalized bmi input = " + normalized);
			
			// Run the normalized array through the model to get a prediction
		    let result = tf.tidy( () => {
				//console.log("predingting BMI now..");
		        return model.predict( tf.stack( [ tf.tensor1d( normalized ) ] ) );
		    });
	        //let prediction = await result.data();
			//console.log("result.data() = " + result.data());
			let prediction = await result.data();
			result.dispose();
			
			// The prediction is also normalized between 0 and 1. We now 'inflate' this back to an actual BMI score.
			const predicted_bmi = (prediction[ 0 ] * (min_max['bmi'][1] - min_max['bmi'][0])) + min_max['bmi'][0];
			
			return_message = {'score':predicted_bmi}
			
	    } catch (err) {
	        console.log("failed to predict bmi: " + err);
			return null;
	    }
	}
	
		//var workerResult = 'Result: ' + (incoming.data[0] * incoming.data[1]);
		//console.log('Posting bmi score back to main script: ' + return_message);
	postMessage(return_message);
}


function normalize(value, min_value, max_value) {
	const part1 = value - min_value;
	const part2 = max_value - min_value;
	return part1 / part2;
}




// Position should be an array of 68 coordinate pairs. Each pair is a coordinate dictionary. 
// Example: [{_x:185,_y:623},{_x:136,_y:922}, etc ]. 
// E.g. with faceApiJS get it via: var positions = face.landmarks._positions;
function landmarks_to_facets(positions){

	//var positions = face.landmarks._positions;
  //console.log("face positions: ");
  //console.log(positions);
	var arr = [];
	// Find lowest values of X and Y, to subtract later.
	var lowest_x = positions[0]._x;
	var lowest_y = positions[0]._y;
	var highest_x = positions[13]._x;
	var highest_y = positions[13]._y;
	positions.forEach(function(arrayItem) {
		if (arrayItem._x < lowest_x) {
			lowest_x = arrayItem._x;
			//console.log("lowest_X lowered to " + lowest_x);
		}
		if (arrayItem._y < lowest_y) {
			lowest_y = arrayItem._y;
			//console.log("lowest_Y lowered to " + lowest_y);
		}
		if (arrayItem._x > highest_x) {
			highest_x = arrayItem._x;
			//console.log("highest_X raised to " + highest_x);
		}
		if (arrayItem._y > highest_y) {
			highest_y = arrayItem._y;
			//console.log("highest_Y raised to " + highest_y);
		}
	});
	const standard_height = highest_y - lowest_y;
	const standard_width = highest_x - lowest_x;
	//console.log("height of face in pixels = " + standard_height);
	//console.log("width  of face in pixels = " + standard_width);
	const offset_ratio = 1000 / standard_height;
	//console.log("offset_ratio = " + offset_ratio);
	// Create a canvas that extends the entire screen
	// and it will draw right over the other html elements, like buttons, etc
	
	var coordinate_number = 0;
	//positions.forEach(function (arrayItem) {
	//ctx.fillText(coordinate_number, arrayItem._x, arrayItem._y);
	//coordinate_number++;
	//});
	//coordinate_number = 0;
	positions.forEach(function(arrayItem) {
		//var x = arrayItem._x - lowest_x;
		//console.log(x);
		var new_x = parseInt((arrayItem._x - lowest_x) * offset_ratio);
		var new_y = parseInt((arrayItem._y - lowest_y) * offset_ratio);
		var pair = [new_x, new_y];
		coordinate_number++;
		//console.log(pair);
		arr.push(pair);
	});

	//
	//  CJWR
	const cheekbone_width = dist(arr[0], arr[16]);
	const cjwr = cheekbone_width / dist(arr[4], arr[12]);

	//
	//  WHR  (creating N1)
	// whr preparation. Creating a new midpoint called N1, between the eyes.
	//console.log("arr[43]._x = " + arr[43][0]);
	const n1_x = (arr[43][0] + arr[38][0]) / 2;
	const n1_y = (arr[43][1] + arr[38][1]) / 2;
	var n1 = [n1_x, n1_y];
	//console.log("n1 = " + n1);
	const whr = dist(arr[4], arr[12]) / dist(arr[66], n1); // middle of lip to point between the top of the eyes
	//console.log("whr = " + whr);
	//
	//  PAR
	// Jaw line length
	var total_jaw_outline = 0;
	var total_jaw_surface = 0;
	for (var i = 0; i < 16; i++) {
		//console.log(i);
		total_jaw_outline += dist(arr[i], arr[i + 1]);
		//console.log("total jaw outline = " + total_jaw_outline);
		var addX = arr[i][0];
		var addY = arr[i == 16 ? 0 : i + 1][1];
		var subX = arr[i == 16 ? 0 : i + 1][0];
		var subY = arr[i][1];
		total_jaw_surface += (addX * addY * 0.5);
		total_jaw_surface -= (subX * subY * 0.5);
		//console.log("total jaw surface = " + total_jaw_surface);
	}
	total_jaw_surface = Math.abs(total_jaw_surface);
	//console.log("final total jaw surface = " + total_jaw_surface);
	// Jaw surface
	const par = total_jaw_outline / total_jaw_surface;
	/*
	            for (var i = 0, l = 16; i < l; i++) {
	              var addX = vertices[i].x;
	              var addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
	              var subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
	              var subY = vertices[i].y;

	              total += (addX * addY * 0.5);
	              total -= (subX * subY * 0.5);
	            }

	            total_jaw_surface = Math.abs(total);
	*/
	//
	//  ES
	const es = (dist(arr[38], arr[45]) - dist(arr[39], arr[42])) / 2;
	//console.log("es = " + es);
	
    //
	// LF/FH
	// First, calculate the approximate bottom face height, taking into account a tilted face.
	//const lower_face_height = Math.abs( (arr[8][1] - arr[0][1]) - (arr[8][1] - arr[16][1]) ) / 2;
	const lower_face_height = dist(n1, arr[8]);
	//console.log("bottom half of face height = " + lower_face_height);
	// approximate distances between outside of eye and middle of face (if face is level);
	const left_eye_distance = n1_x - arr[36][0];
	const right_eye_distance = arr[45][0] - n1_x;
	const left_eye_x_delta = Math.abs(arr[19][0] - arr[36][0]);
	const left_eye_y_delta = Math.abs(arr[19][1] - arr[36][1]);
	const right_eye_x_delta = Math.abs(arr[45][0] - arr[24][0]);
	const right_eye_y_delta = Math.abs(arr[45][1] - arr[24][1]);
	const left_n2_y = n1_y - ((left_eye_distance / left_eye_x_delta) * left_eye_y_delta);
	const right_n2_y = n1_y - ((right_eye_distance / right_eye_x_delta) * right_eye_y_delta);
	const n2_y = (left_n2_y + right_n2_y) / 2; // average N2_Y
	//console.log("n2_y average = " + n2_y);
	const n2 = [n1_x, n2_y];
	full_face_height = dist(arr[8], n2);
	//console.log("Full face height = " + full_face_height);
	const lfh = lower_face_height / full_face_height;
	
    //
	//  FW/LFH
	const fwh = cheekbone_width / lower_face_height;
	//console.log("fwh = " + fwh);
	
    //
	//  MEH
	const left_eye_top = [(arr[37][0] + arr[38][0]) / 2, (arr[37][1] + arr[38][1]) / 2];
	const right_eye_top = [(arr[43][0] + arr[44][0]) / 2, (arr[43][1] + arr[44][1]) / 2];
	const meh = dist(arr[17], arr[36]) + dist(arr[21], arr[39]) + dist(arr[22], arr[42]) + dist(arr[26], arr[45]) + dist(arr[19], left_eye_top) + dist(arr[24], right_eye_top);
	//console.log("meh = " + meh);
	
	
	return [cjwr, whr, par, es, lfh, fwh, meh];
}

function dist(x, y) {
	var length = Math.sqrt(Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2));
	return length;
}

function polygonArea(X, Y, numPoints) {
	area = 0; // Accumulates area in the loop   
	j = numPoints - 1; // The last vertex is the 'previous' one to the first
	for (i = 0; i < numPoints; i++) {
		area = area + (X[j] + X[i]) * (Y[j] - Y[i]);
		j = i; //j is previous vertex to i
	}
	return area / 2;
}





