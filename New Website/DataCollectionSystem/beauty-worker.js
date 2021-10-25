// get-predictions.worker.js
// Import TF and Model
//import 'js/tensorflowjs.js';
importScripts('js/tensorflowjs.js');                 /* imports just "foo.js" */
//importScripts('foo.js', 'bar.js');       /* imports two scripts */
//import * as ssd from '@tensorflow-models/coco-ssd';
let model;


async function init_tf() {
    
    console.log("LOADING BEAUTY TENSORFLOW MODEL");
    const LOCAL_MODEL_PATH = './models/beauty.json';
    const DYNAMIOS = "https://pacocaapps.github.io/models/beauty.json"
    //const HOSTED_MODEL_PATH = './models/beauty.json';
    
    //let model;
    try {
        model = await tf.loadLayersModel(DYNAMIOS);
        //window.model.summary();
        //beauty_detector_ready = true;
		postMessage({'loaded':'beauty'});
        
        
    } catch (err) {
        report("failed to load beauty scoring model :"+err);
    }

}


init_tf();


onmessage = function(incoming) {
 	//console.log('Message received from main script');
  
  	var return_message = null;
  
	if (!model) {
		console.log("* no model loaded")
		return null;
	}
	else{
		//console.log("onmessage in beauty worker. Model was loaded. incoming data:");
		//console.log(incoming)
		
		/*
		result = incoming.data;
		console.log("incoming result object in web worker:");
		console.log(result);
		console.log(result.descriptor);
		*/
		if( 'data' in incoming ){
			//console.log("data in incoming beauty prediction");
			try{
				
				if( incoming.data.length == 128 ){
					//console.log("beauty worker: incoming data was 128 long");
					var vector_array = [];
			        for (var i = 0; i < incoming.data.length; i++) {
			            vector_array.push( incoming.data[i] );
			        }
					
					const shape = [1,128];

					// Run the normalized array through the model to get a prediction
				    let result = tf.tidy( () => {
						//console.log("predingting BMI now..");
				        //return model.predict( tf.stack( [ tf.tensor1d( normalized ) ] ) );
				        var a = tf.tensor(vector_array,shape,'float32');

				        const prediction = model.predict( a );
				        return_message = prediction.dataSync();
				    });
					
					//prediction.dispose();
			        //let prediction = await result.data();
					//console.log("result.data() = " + result.data());
					//let prediction = await result.data();
					//result.dispose();
			        
			        
					//console.log("beauty worker: prediction: " + return_message);
				}
				else{
					console.log("beauty worker: incoming data should be array of 128 floats (face fingerprint)");
				}
				
			}
			catch(e){
				console.log("error: beauty worker: " + e);
			}
		}		
		else{
			console.log("beauty worker: no data in incoming message");
		}
	}
	
	//var workerResult = 'Result: ' + (incoming.data[0] * incoming.data[1]);
	//console.log('Posting message back to main script');
	postMessage(return_message);
}



// Load our model from the web
/*
ssd
  .load({
    base: 'lite_mobilenet_v2',
  })
  .then(model => {
    net = model;
  });

*/

/*
// export function you want to call to get predictions
export async function getPrediction(image) {
	// check if model is loaded
	// sometime you might want to handle if function returns null
	if (!model) {
		console.log("* no model loaded")
		return null;
	}
	// run object detection
	const result = await net.detect(image);
	const boxes = result.map(boxInfo => [
	boxInfo.bbox[0],
	boxInfo.bbox[1],
	boxInfo.bbox[0] + boxInfo.bbox[2],
	boxInfo.bbox[1] + boxInfo.bbox[3],
	]);
	const scores = result.map(boxInfo => boxInfo.score);
	const classes = result.map(boxInfo => boxInfo.class);
	// return data we need to print our boxes
	return { result, boxes, classes, scores };
}
*/