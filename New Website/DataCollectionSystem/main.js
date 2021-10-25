//report(faceapi.nets)
//console.log(faceapi);

/*

Hey, cool that you're having a look! Welcome, and please don't mind the mess ;-)

*/





var supports_offscreen_canvas = false;
if (typeof OffscreenCanvas !== 'undefined') {
	console.log("supports offscreen_canvas");
 	supports_offscreen_canvas = true;
	//report(faceapi.nets);
  	//hoff = 0;
}
else{
	report(faceapi.nets);
}


var supportsWebGL = ( function () {
    try {
        return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' );
    } catch( e ) {
        return false;
    }
} )();

if(supportsWebGL){
    console.log("supports WebGL");
}else{
    console.log("no support for WebGL");
	supports_offscreen_canvas = false;
}


//supports_offscreen_canvas = false;


// ELEMENTS

const two_vids = document.getElementById("two-vids");
const main_video = document.getElementById("main-video");
const main_video_mp4 = document.getElementById("main-video-mp4");
const main_video_webm = document.getElementById("main-video-webm");
const webcam_video = document.getElementById("webcam-video");
const main_overlay_canvas = document.getElementById("main-overlay-canvas");
const heatmap = document.getElementById('heatmap');
const hey_kom_terug = document.getElementById('hey-kom-terug');

const main_overlay_context = main_overlay_canvas.getContext('2d');

const videoSelect = document.querySelector('select#videoSource');

//audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

var canvy = document.createElement('canvas');
canvy.style.width = 640;
canvy.style.height = 480;
canvy.width = 640;
canvy.height = 480;
var canvy_context = canvy.getContext('2d');

const yes = 'Yes';
const no = 'No';

// VARIABLES

const section_names = ['terms','start','beauty','age','gender','bmi','life','closer','expression','mouse','end','bye']
const uses_two_workers = ['beauty','ethnicity','bmi']

const options = {
    'clicker' : ['Judeska','Lubach'],
    'terms': [no,yes],
    'gender': ['Man','Woman'], // The algorithm doesn't support more options really...
    'age_shared':[no,yes],
    'lied':[no,yes],
    'aagje': [no,yes],
    'closer': [no,yes],
    'expression': ['Sad','Happy'],
    'end': [no,yes],
    'bye': [no,yes]
}


//const section_names = ['terms','start','beauty','bmi','age','gender','closer','expression','mouse','end','bye']
const detection_type = {
	'start': 'expression',
	'beauty':'recognition',
    'gender': 'age_and_gender',
    'age':'age_and_gender',
    'closer': 'recognition',
    'expression': 'expression',
    'bmi':'landmarks'
}



var loading_sentence_counter = 0;
const loading_sentences = [
    'Loading face detection algorithms...',
    'Trying to make AI actually intelligent...',
    'Loading face recognition for attractive people like you.',
    'Loading face recognition for ugly people (not really necessary in your case).',
    'Please make sure the camera can see your face',
    'Loading face detection for people who like board games...',
    'Loading face detection for people that hate boardgames...',
    'Please make sure the camera can see your face',
    'Loading special face detection for Donald Trump...',
    'Loading face detection for people that like to eat cake...',
    'Please make sure the camera can see your face',
    'Turns out face detection for people that like cake was not necessary, unloading...',
    'Loading face detection for people from Brighton...',
    'Please make sure the camera can see your face',
    'Re-loading face detection for people that like to eat cake, because Janine wants to have a go.',
    'Loading face detection for Hide The Pain Harold',
    'Please make sure the camera can see your face',
    'Loading face detection for your mom...',
    'Lovely weather eh?',
    'Ok, something is clearly wrong. Please make sure your face is visible, or try to refresh the page.',
];
    

const normal_percentage_titles = [
    'The briliant exception to the rule',
    'Algorithms? They bounce of me.',
    'Pretty strange, in a sexy way.',
    'Averagely normal',
    'Violently average',
    'The most average person in the world'
];





// INCOMING AVERAGES
try{
    report(averages);
    report("Averages were supplied by the server");
} catch (e) {
    report("error getting averages: " + e);
    const averages = {
        "terms":0,
        "start":1,
        "beauty":60,
        "age":30,
        "age_shared":1,
        "lied":0,
        "gender":1,
        "closer":0,
        "clicker":1,
        "clicker2":1,
        "mouse":3000,
		"touch":30,
		"life":30,
        "aagje":0,
        "expression":1,
        "end":1,
		"ip":"77.172"
    };
    window.averages = averages;
}
report("averages: " + JSON.stringify(averages,null,2));


var user_ip = '77.172';
try{
	user_ip = averages['ip'];
	report("Got partial IP from averages data");
}
catch(e){
	report("Could not get ip from averages data");
}

var debug = false;
report("location.search = " + location.search);
if( location.search == '?debug'){
    console.log("Found ?debug in location URL");
    debug = true;
}

var is_mobile = false;
if( window.innerWidth < 641){
    is_mobile = true;
}
//is_mobile = true;

if (/Mobi|Android/i.test(navigator.userAgent)) {
    is_mobile = true;
}

var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
//var isSafari = window.safari !== undefined;
const is_iphone = /iPhone|iPad/i.test(navigator.userAgent);

var face_api_loaded = false;
var current_section_id = 0;
var current_section_name = "start";
var clicked_terms = 0;

var age_and_gender_loading = false;
var age_and_gender_loaded = false;

var show_bounding_box = false;
var show_landmarks = false;
var show_expressions = false;

var show_age = false;
var show_gender = false;
var run_face_api_once = false;
var beauty_detector_loading = false;
var show_additional_mouse_movement = false;

var bla = false;
var video_permission = false;
var run_face_api = true; // Whether we're doing face-api inference.
var skipping_camera_video = false;
var pug_shown = false;

var total_score = 100;
var beauty_score = null;
var bmi_score = null;
var gender_score = 0;
var aagje_score = 0;
var os_score = 0;
var initial_reaction = null;
var page_hidden_counter = 0;
var clicker = 0; // button
var interpolatedAge = 0;
var face_print = null;
var selected_age = null;
var ready_to_show_if_lied_about_age = false;
var shifting = false; // If we're shifting to a new section, this is used to ignore the worker result
var previous_frame_time = 0;
var closer_start_width = 0;
var bmi_worker_loaded = null;
var bmi_scores = []; // rolling array to calculate average BMI
var bmi_percentage = 20;
var bmi_country_average = 24;
var life_source_data; // This will hold an array of data to calculate life expectancy
var years_left = 50;
var user_country = 'US';
var facing_direction = "environment";
var tiny_face_detector_options;
var show_hog = false;
var show_eyebrows = false;

var expressions = {
    "neutral": 0,
    "happy": 0,
    "sad": 0,
    "angry": 0,
    "fearful": 0,
    "disgusted": 0,
    "surprised": 0
}

const expression_translations = {
    "neutral": "neutral",
    "happy": "happy",
    "sad": "sad",
    "angry": "angry",
    "fearful": "afraid",
    "disgusted": "disgusted",
    "surprised": "surprised"
}


// Mouse distance moved
var mouse_distance = 0;
var final_mouse_distance = 0;
var last_mouse_position = {x: null, y: null};


var participant_name = "";


var scores = {}
var no_scores = {} // This dictionary is sent if the user does not want to send anonymous data. It only contains one thing: that someone didn't want to share data.
for(var q = 0; q < section_names.length; q++){
    var section_name = section_names[q];
    scores[section_name] = null;
    no_scores[section_name] = null;
}
no_scores['end'] = 0; // Set 0 if the participant doesn't want to send data.
scores['terms'] = 0;
scores['aagje'] = 0;
scores['closer'] = 0;
scores['age_shared'] = 0;
scores['bye'] = 0;
report("scores = " + JSON.stringify(scores,null,2));


let forwardTimes = [];
let predictedAges = [];
let withBoxes = true;

//var inputSize = 244;
//let selectedFaceDetector = 'ssd_mobilenetv1';
let inputSize = 512;
let scoreThreshold = 0.5;
const minConfidence = 0.05; // expression
        
var started = false;
var face_print_revealed = false;

var seconds_counter = 0;
var page_is_visible = true;
var page_is_visible_counter = 0;

var beauty = 0;
var age_score = 200;

const bmi_face_canvas_size = 200; // Maximum height of the canvas that shows the face lines. 200 creates a 240x200 canvas.


const spice_girls = [
  50,
  54,
  69,
  65,
  73
]





//
//   WEB WORKERS
//




// If the browser supports web workers...
if (typeof(Worker) !== "undefined") {
    
    // create a webworker that can deduce a beauty score. Feed it a 128 int array face fingerprint. It returns a score between 0 and 5.
    window.bmi_worker = new Worker('bmi-worker.js');
    window.bmi_worker.onmessage = function(incoming) { // if the webworker sends a message back
        
		if(shifting){
			shifting = false;
			grabFrame();
			return;
		}
		
        if( 'data' in incoming ){
            
            if(incoming.data === undefined){
                report("yikes, BMI incoming.data was undefined?");
				grabFrame();
            }
            else if('loaded' in incoming.data ){
                report("incoming message that bmi model was loaded");
                bmi_worker_loaded = true;
            }
            else if(bmi_worker_loaded){
                if(incoming.data != null){
                    
                    //const new_bmi_score = incoming.data['score']; // the webworker returns a beauty score between 0 and 5.
                    //console.log('new_bmi_score:');
					//console.log(new_bmi_score);
                    if( 'score' in incoming.data ){
						if( bmi_scores.length > 10 ){
							bmi_scores.shift(); // Remove th first element from the array
						}
						if( incoming.data['score'] > 14 && incoming.data['score'] < 45 ){
							bmi_scores.push(incoming.data['score']);
						}
						
						var total = 0;
						for(var i = 0; i < bmi_scores.length; i++) {
						    total += bmi_scores[i];
						}
						bmi_score = r(total / bmi_scores.length);
					
					
						//bmi_score = Math.round(incoming.data['score']); // A score between 0-5 becomes 0-3
	                    report('rounded bmi score: ' + bmi_score ); 
                    
					
					
					
						scores['bmi'] = Math.round(bmi_score);
					
						$('.bmi-score').text(bmi_score);
	                    $( "#skip-video-button" ).show();
					
						/*
	                    for(var t = 14; t < 45; t++){
							const bmi_percentagee = (t - 14.196863169280693) * 3.6245250297;
							console.log(t + " -> " + bmi_percentagee);
	                    }
						*/
						bmi_percentage = (bmi_score - 14.196863169280693) * 3.6245250297;
					
						report("bmi as percentage: " + bmi_percentage);
						$('#bmi-scale').html('<div id="bmi-scale-pointer" style="width:' + bmi_percentage + '%"></div>');
					
                    }

					
					grabFrame();
                }
                else{
					report("bmi: incoming data was null");
					grabFrame();
                }
            }
            else{
                console.log("bmi:incoming:ehh?");
				grabFrame();
            }
        
        report('Message received from bmi worker: ' + JSON.stringify(incoming.data));
        }
    }
	
	
    // create a webworker that can deduce a beauty score. Feed it a 128 int array face fingerprint. It returns a score between 0 and 5.
    window.beauty_worker = new Worker('beauty-worker.js');
    window.beauty_worker.onmessage = function(incoming) { // if the webworker sends a message back
        
		if(shifting){
			shifting = false;
			grabFrame();
			return;
		}
		
        if( 'data' in incoming ){
            //report("received message from beauty worker");
            if( incoming.data === undefined || incoming.data == null ){
                console.log("yikes, beauty incoming.data was undefined?");
				grabFrame();
            }
            else if( 'loaded' in incoming.data ){
                report("incoming message that beauty model was loaded");
                beauty_worker_loaded = true;
            }
            else if(beauty_worker_loaded){
                try{
                    
                    var new_beauty_score = incoming.data; // the webworker returns a beauty score between 0 and 5.
                    //report('incoming new_beauty_score'); //' = ' + new_beauty_score);
                    const rounded = Math.round(new_beauty_score * .6); // A score between 0-5 becomes 0-3
                    //console.log('rounded: ' + rounded );

	                if(new_beauty_score > beauty){
	                    beauty = new_beauty_score; //  maximum of 5
	                    var nice_score = Math.round( new_beauty_score * 20 );
	                    $(".beauty-score").text(nice_score / 10);
	                    scores['beauty'] = nice_score;
	                    $( "#skip-video-button" ).show();
                
	                    var spice_girls_beat = 0;
	                    for(var t = 0; t < spice_girls.length; t++){
	                        if(nice_score > spice_girls[t]){
	                            spice_girls_beat++;
	                        }
	                    }
	                    var spice_girls_percentage = spice_girls_beat * 20;//Math.round((spice_girls_beat / spice_girls.length) * 100);
	                    report("spice_girls beat: " + spice_girls_beat);
	                    $('#beauty-relative-percentage').text(spice_girls_percentage);
                
	                }
					grabFrame();

                }
				catch(e){
					report("error handling incoming beauty result: " + e);
					grabFrame();
				}
				
            }
            else{
                report("beautyworker message handler: ehh?");
				grabFrame();
            }
        
        	//console.log('Message received from beauty worker: ' + JSON.stringify(incoming.data));
        }
		else{
            report("beautyworker did not send data");
			grabFrame();
		}

    }
    
    // Create a webworker to guess ethnicity. Input is a 200x200 pixel image. It returns a number between 0 and 5, where each number stands for an ethnicity.
    /*
	window.ethnicity_worker = new Worker('ethnicity-worker.js');
    window.ethnicity_worker.onmessage = function(incoming) {
		
		if(shifting){
			shifting = false;
			grabFrame();
			return;
		}
		
        console.log('Message received from ethnicity worker: ' + JSON.stringify(incoming.data));

        if( incoming.data.loaded !== undefined ){ // When the webworker is ready, it sends a "loaded" message.
            ethnicity_worker_loaded = true;
        }
        else if(ethnicity_worker_loaded){
            if(incoming.data != null){
                console.log("received ethnicity result = " + incoming.data)
				grabFrame();
                //algo_says_they_are.set('ethnicity',supported_ethnicities[incoming.data]);

            }
            else{
				grabFrame();
				// Ethnicity judgement failed. Go another round? Or just set the ethnicity score to what the user selected?
            }
        }
    }
	*/
    
    // The main FacApiJS webworker. It does the hard work of finding faces, and judges age and gender. It also returns face features and a face fingerprint. This fingerprint is needed for the beauty score.
	if(supports_offscreen_canvas){
		window.faceapi_worker = new Worker('faceapi-worker.js');
		window.faceapi_worker.onmessage = function(incoming) {
		    face_api_loaded = true;
			//console.log('Message received from faceapi worker .data');
		    //console.log('Message received from faceapi worker .data: ' + JSON.stringify(incoming.data,null,2));
			
			if(shifting){
				shifting = false;
				grabFrame();
				return;
			}
	

		    if( 'data' in incoming ){
        
		        if(incoming.data === undefined || incoming.data == null){
		            console.log("FaceApi incoming.data was undefined - probably no face found");
					grabFrame();
			
		        }
		        else if('loaded' in incoming.data ){
					if(incoming.data.loaded != 'error'){
						report("incoming message that ML was loaded");
						face_api_loaded = true;
					}
					else{
						console.log("ERROR LOADING BASE FACE DETECTION MODEL");
					}
		        }
		        else if('detection' in incoming.data ){
					//console.log("detection in incoming face api message.");
		            onPlay(incoming.data);
					updateOverlay( incoming.data );
					if( uses_two_workers.indexOf(current_section_name) == -1 ){
						// does not use a second worker, so grab the next frame.
						grabFrame();
					}
		        }
		        else{
		            console.log("No detection data in incoming data.. grabbing another frame.");
		            //webcam_video.play();
		            //webcam_video.show();
		            //grabFrame();
					//setTimeout(() => analyse(),1000);
					if(!show_hog){
						main_overlay_context.clearRect(0, 0, main_overlay_canvas.width, main_overlay_canvas.height);
					}
					console.log(incoming.data);
					//updateOverlay(incoming.data);

					grabFrame();

		        }
        
		    }
		    else{
		        console.log("Yikes, undefined result from worker.");
				//grabFrame();
		        //webcam_video.play();
		        //setTimeout(() => analyse(),1000);

				grabFrame();

		    }
    
		}
		window.faceapi_worker.postMessage({'net':'mobilenet','load':['landmarks','expression','age_and_gender','recognition'],'use':['all']});
		//window.faceapi_worker.postMessage({'net':'mobilenet','load':['landmarks','expression','age_and_gender','recognition'],'use':['face']});
		//window.faceapi_worker.postMessage({'net':'tiny','load':['expression'],'use':['expression']});
		//window.faceapi_worker.postMessage({'net':'mobilenet','load':[],'use':['face']});
	}
	else{
		// no support for offscreen_canvas
	}
	
	
	/*
	const videoConstraints = {
		facingMode: 'user',
	};

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: videoConstraints,
        })
        .then(stream => {
          window.stream = stream;
          webcam_video.srcObject = stream;
          //webcam_video.play();
          
          return new Promise(resolve => {
            webcam_video.onloadedmetadata = () => {
				console.log("webcam metadata has loaded (resolve)");
				grabFrame();
              resolve();
            };
          });
        })
        
        .then(async () => {
          report("thennn (webcam loaded)");
          //getBeauty()
          //window.beauty_worker.postMessage();
          
          return true;
        })
        
        .catch(e => {
          console.error(e);
        });
    } else {
        report("no cam");
      //setHasWebcam(false);
    }
	*/
}



function report(message){
    if( debug ){
        console.log(message);
    	
        if( typeof message == 'object' ){
			if(is_mobile){
				return;
			}
			message = JSON.stringify(message,null,2);   
             
        }
		//else{
       	$( "#debug" ).append('<p>' + message + '</p>'); 
		//} 
		
    }
}


function setMaxWidth() {
    if(window.innerWidth > 1000 ){
        
        var optimal_webcam_container_width = webcam_video.videoWidth;
        
        if( webcam_video.videoHeight > (window.innerHeight / 2) ){
            const height_ratio = webcam_video.videoHeight / (window.innerHeight / 2);
            optimal_webcam_container_width = Math.floor(webcam_video.videoWidth / height_ratio);
        }
        
		if(optimal_webcam_container_width * 2 > window.innerWidth ){
			document.getElementById('two-vids').setAttribute("style","width:" + optimal_webcam_container_width + "px");
		}
		else{
			document.getElementById('two-vids').setAttribute("style","width:" + optimal_webcam_container_width + "px;max-width:" + optimal_webcam_container_width + "px");
		}
        
    }
    else{
        document.getElementById('two-vids').setAttribute("style","width:100%");
    }
}






function getDevices() {
  // AFAICT in Safari this only gets default devices until gUM is called :/
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  window.deviceInfos = deviceInfos; // make available to console
  report('Available input and output devices:', deviceInfos);
  
  report("deviceInfos.length = " + deviceInfos.length);
  
  var video_sources_count = 0;
  for (const deviceInfo of deviceInfos) {
  	if (deviceInfo.kind === 'videoinput') {
  		video_sources_count++;
  	}
  }
  report("video_sources_count = " + video_sources_count);
  
  if( $("#videoSource option").length == 0 && video_sources_count > 1){
	  $( "#switch-camera").show();
	  report("populating select dropdown");
	  for (const deviceInfo of deviceInfos) {
	    const option = document.createElement('option');
	    option.value = deviceInfo.deviceId;
		if (deviceInfo.kind === 'videoinput') {
	      option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
	      videoSelect.appendChild(option);
	    }
	  }
  }
  

}

function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  //const audioSource = audioSelect.value;
  const videoSource = videoSelect.value;
  const constraints = {
    //audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
	audio: false,
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  return navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);
}

function gotStream(stream) {
  	window.stream = stream;
	
	videoSelect.selectedIndex = [...videoSelect.options].
    	findIndex(option => option.text === stream.getVideoTracks()[0].label);
  	webcam_video.srcObject = stream;
  	webcam_video.play();
  
  	video_permission = true;
  	//setMaxWidth();
	positionOverlay(); // Don't think this is used anymore
	//grabFrame();
  
}

function handleError(error) {
  console.error('Error: ', error);
}




function showLoadingSentence() {
    setTimeout(function () {
        loading_sentence_counter ++;
        $('#loading-sentence').text(loading_sentences[loading_sentence_counter]);
        if(loading_sentence_counter < loading_sentences.length){
            showLoadingSentence();
        }
    }, 3000);
}


function addPercentage(target_name){ 
    
    var list_normal_percentage = Math.round(averages[target_name] * 100);
    if(list_normal_percentage < 50){
        list_normal_percentage = 100 - list_normal_percentage;
    }
    return ' <span class="list-normal-percentage">(' + list_normal_percentage + '%)</span>';
}


function decide(target_name){
    try{
		report("DECIDING IF NORMAL FOR: " + target_name + ". Average is: " + averages[target_name] + " , Score is: " + scores[target_name]);
	    
		if(target_name == 'start'){return;}
		
		var value = scores[target_name];

	    $('#score-table .' + target_name).removeClass('hidden');
    
	    var normal = false;
    
	    if(target_name == 'beauty'){
	        if( Math.abs( (averages[target_name] * 10) - value) < 10 ){normal = true;}
	    }
	    if(target_name == 'bmi'){
	        if( Math.abs( (averages[target_name]) - value) < 3 ){normal = true;}
	    }
	    else if(target_name == 'age'){
	        if( Math.abs(averages[target_name] - value) < 10 ){normal = true;}
	    }
	    else if(target_name == 'mouse'){
			if( Math.abs(averages[target_name] - value) < 1500 ){normal = true;}	
		}
	    else if(target_name == 'touch'){
			if( Math.abs(averages[target_name] - value) < 50 ){normal = true;}	
		}
	    else if(target_name == 'life'){
			if( Math.abs(averages[target_name] - value) < 5 ){normal = true;}	
		}
	    else if( Math.round(averages[target_name]) == value ){
	        normal = true;
	    }
	
	
		var normal_value = Number(averages[target_name]);
	    report("normal_value = " + normal_value);


    
	    if(target_name == 'end'){
	        var normallly = options[target_name][ Math.round(normal_value) ] + addPercentage('end');
	        $('#score-table .sent .normal-value').html( normallly );
	        $('#score-table .sent').removeClass('hidden').slideDown();
	        if( scores[target_name] == Math.round(averages[target_name]) ){
	            $('#score-table .sent').addClass('normal-result');
	        }
	        else{
	            $('#score-table .sent').addClass('not-normal-result');
	        }
	    }
    
	    if( target_name == 'start'){
        
	    }
	    //else if( target_name == 'os'){
	    //    if(is_mobile){normal_value = "Android";}else{normal_value = "Windows";}
	    //}
	    else if( target_name == 'beauty'){normal_value = r(normal_value + -1) + "-" + r(normal_value + 1);}
		else if( target_name == 'bmi'){normal_value = r(normal_value + -3) + "-" + r(normal_value + 3);}
	    else if( target_name == 'age'){
	        normal_value = Math.round(normal_value + -10) + "-" + Math.round(normal_value + 10);
        
	        if(selected_age != null){
	            if( Math.abs(selected_age - scores['age']) > 5 ){
	                scores['lied'] = 1;
	                $('.lied-score').text("Yes");
	            }else{
	                scores['lied'] = 0;
	                $('.lied-score').text("No");
	            }
            
	            const normally = Math.round(averages['lied']);
	            var normally_string = '' + options['lied'][ normally ] + addPercentage('lied');
	            //console.log("normally_string = " + normally_string);
            
	            $('.lied-line .normal-value').html( normally_string );
	            if( scores['lied'] == normally ){
	                $('#score-table .lied-line').addClass('normal-result');
	            }
	            else{
	                $('#score-table .lied-line').addClass('not-normal-result');
	            }
	            $('.lied-line').removeClass('hidden');
	        }
	        else{
	            report("No age provided");
	        }
	    }
		else if( target_name == 'life'){normal_value = r(normal_value + -5) + "-" + r(normal_value + 5);}
	    else if( target_name == 'mouse'){
			normal_value = Math.abs(Math.floor(normal_value) - 1500) + "-" + Math.floor(normal_value + 1500);
	        show_additional_mouse_movement = false;
	        $('#mouse-score-additional').slideUp();
		}
	    else if( target_name == 'touch'){
			normal_value = Math.abs(Math.floor(normal_value) - 50) + "-" + Math.floor(normal_value + 50);
	        show_additional_mouse_movement = false;
	        $('#mouse-score-additional').slideUp();
		}
	    else{
	        normal_value = Math.round(normal_value);
	        normal_value = options[target_name][normal_value] + addPercentage(target_name);
		
	    }
	    try{
			report("normal value is now: " + normal_value);
		    $('#score-table .' + target_name + ' .normal-value').html(normal_value).removeClass('hidden');

		    if( normal ){
		        //$('#score-table .' + target_name + ' .normal-value').text(normal).removeClass('hidden');
		        $('#score-table .' + target_name).addClass('normal-result');
		    }
		    else{
		        $('#score-table .' + target_name).addClass('not-normal-result');
		        //$('#score-table .' + target_name).show();
		    }
		    $('#score-table .' + target_name).slideDown();


		    $('#score-table .' + current_section_name).removeClass('hidden');
		    //$('body').removeClass('full');
		}
		catch(e){
			console.log("error in updating table from decide: " + e);
		}
    }
	catch(e){
		console.log("error in decide: " + e);
	}
    
}





// PAGE VISIBLE

document.addEventListener( 'visibilitychange' , function() {
    if (document.hidden) {
        report('user moved to other tab/app');
        page_is_visible = false;

        page_hidden_counter++;
        
        if(started){
            main_video.pause();
            //hey_kom_terug.play();
        }

    } else {
        report('user returned to tab');
        page_is_visible = true;
        page_is_visible_counter++;
        $('#page-is-visible-counter').text(page_is_visible_counter);
        if(page_is_visible_counter > 0){ $('#page-is-visible-judgement').show(); }
        
        if(started){
            //hey_kom_terug.pause();
            //hey_kom_terug.currentTime = 0;
            //main_video.currentTime = 0;
            main_video.play();
        }
    }
}, false ); 


main_video.addEventListener('playing',videoPlaying,false); // If the video is starting to play. This might be clocked by autoplay protection.
main_video.addEventListener('ended',atEndOfVideo,false); // Video has finished playing. Which one is next?


function videoPlaying(e) {
    $('#next-video-button').hide();
}

function atEndOfVideo(e) {
    //report("at end of video. Video permission = " + video_permission);
    var current_video_name = main_video_mp4.src;
	report("current_video_name = " + current_video_name);
	
    if(!video_permission){
		report("end of video: no video permission");
		//$('#webcam-problem').show(); 
        setTimeout(atEndOfVideo, 100);
    }
    else if( current_video_name.endsWith('start-begin.mp4') ){
        //console.log("was at start-begin");
        playVideo('end'); // ?? vestigial?
		report("at end of video. Starting to play new video 'end'");
    }
    else if( initial_reaction == null ){
		report("initial reaction is still Null");
        setTimeout(atEndOfVideo, 500);
    }
    else if( current_section_name == 'end' ){
        report('end of end-begin video'); // sheesh I've created a monster
        $('#two-vids').addClass('hidden');
        started = false;
    }
    else{ 
		
		if(is_mobile && current_section_name == 'mouse'){
			report("switching mouse section to touch section");
			current_section_name = 'touch';
		}
		
        if( scores[current_section_name] == null && shifting == false ){ // && current_section_name != 'bye'
            report("No score for current section yet. Section is: " + current_section_name);
			setTimeout(atEndOfVideo, 100);
        }
        else{
            decide(current_section_name);
            //get_score_video_id();
			generate_funny_name();
            //playVideo( get_score_video_id() );
            $('#participant-name').text(participant_name);

            report("");
            current_section_id++;
            report("new current_section_id = " + current_section_id);
            current_section_name = section_names[current_section_id];
            report("new current_section_name = " + current_section_name);
            
            if( current_section_name == 'bye' ){
                report("ALL PASSENGERS GET OFF, THIS IS THE FINAL STATION");
                $('#two-vids').addClass('vids-goodbye');
                started = false;
            }
            else{
                //if(skipping_camera_video == false){
                

                playVideo('begin');
                
                setMaxWidth();
                show_section(current_section_name);
				
				//if(current_section_name == 'mouse' && is_mobile){
				//	current_section_name = 'touch';
				//}
				
            }
        }
    }
}


function show_section(section_name){
    report("showing section " + section_name);

    shifting = true; // used to ignore  any incoming worker results and start fresh.

    $('#heatmap').fadeOut();
    $('#questions > div').addClass('hidden');
    $( "#skip-video-button" ).hide();
    
    if(section_name == "beauty"){
        $('#cv-container').removeClass('hidden'); 
        //$( window ).bind( "resize", setMaxWidth );

        //$('#age-buttons-container').removeClass('hidden').show();
    }
    
    $('#questions > div').addClass('hidden');
    if(section_name != 'mouse'){
        $('#' + section_name + '-focus').removeClass('hidden');
    }
    
    //run_face_api = false;
    
    if( section_name == "landing" || section_name == "start" || section_name == "quality" ){
        $('#webslides > section').hide();
        $('#' + section_name + '-container').show();
        $('.' + section_name).show();
        $('#cv-container').addClass('hidden'); 
    }
    else{
        $('#cv-container').show();
        $('#cv-container').removeClass('hidden'); 
    }
    
    if( section_name == "start" ){
        run_face_api = true;
        show_bounding_box = true;
        show_landmarks = false;
        $('body').addClass('full');
    }
    else if( section_name == 'beauty' ){
        run_face_api = true;
        show_bounding_box = true;
        show_landmarks = true;
        $('body').addClass('full');
        $('#loaded').hide();
        //$('#age-buttons-container').show();
        setTimeout(function(){ // trying to time it to coincide more with the moment in the video.
            //report("Showing beauty tip");
            $('#beauty-scale').hide();
            $('#beauty-tip').show();
        }, 10000);
        setTimeout(function(){
            $('#beauty-tip').hide();
            $('#beauty-relative').show();
        }, 16000);
        
    }
    else if( section_name == 'gender' ){
        run_face_api = true;
        show_bounding_box = false;
        show_landmarks = true;
		$('body').addClass('full');
        
        setTimeout(function(){
            $('#gender-extra').fadeIn();
        }, 8000);
        
    }
    else if( section_name == "age" ){
        $('#nocam').slideUp(); // If people end up here, the 'camera doesn't work' warning must have been faulty. If it's there, it should be removed.
        
        $('#age-buttons-container').addClass('hidden');
        decide('age_shared');
        run_face_api = true;
        show_bounding_box = true;
        show_landmarks = false;
        $('body').addClass('full');
        
        setTimeout(function(){ // trying to time it to coincide more with the moment in the video.
            report("ready_to_show_if_lied_about_age is now true");
            ready_to_show_if_lied_about_age = true;
        }, 12000);
    }
	else if( section_name == 'bmi' ){
		report("Showing section BMI");
        run_face_api = true;
		show_hog = false;
        show_bounding_box = false;
        show_landmarks = false;
		show_eyebrows = true;
		
		$('.country').text(user_country);
		$('.bmi-country-average').text(r(bmi_country_average));
		
        setTimeout(function(){ // trying to time it to coincide more with the moment in the video.
			$('#bmi-extra').fadeIn();
			
        }, 10000);
	}	
    else if( section_name == "life" ){
        calculate_life_expectancy();
		$( "#skip-video-button" ).show();
        run_face_api = true;
		show_eyebrows = false;
		main_overlay_context.clearRect(0, 0, main_overlay_canvas.width, main_overlay_canvas.height);
        show_bounding_box = false;
        show_landmarks = false;
        $('body').removeClass('full'); // TODO: Not sure if full class still does anything now that video width is set through javascript?
		
        setTimeout(function(){ // trying to time it to coincide more with the moment in the video.
            //report("Deciding life expectancy");
            //decide('life');
			$('#life-extra').fadeIn();
			
		}, 10000);
		

    }
    else if( section_name == 'closer' ){
        run_face_api = true;
        show_bounding_box = true;
        show_landmarks = false;
		if(!is_mobile){
			show_hog = true;
		}
		
        $('body').addClass('full');
        
        setTimeout(function(){ // User has 12 seconds to get closer. As soon as the face print is revealed, the window is closed.
            if( current_section_name == 'closer'){
                $("#closer-reveal").removeClass('hidden');
                const target_position3 = $('#main-content').prop('scrollHeight');
                $("#main-content").scrollTop(target_position3);
                face_print_revealed = true;
            }
        }, 6000);
        
        setTimeout(function(){ // User has 12 seconds to get closer. As soon as the face print is revealed, the window is closed.
            if( current_section_name == 'closer'){
                decide('closer');
            }
        }, 12000);
    }
    else if( section_name == 'expression' ){
        run_face_api = true;
        show_bounding_box = false;
        show_landmarks = true;
		show_hog = false;
        //$('#heatmap').fadeOut();
        scores[current_section_name] = initial_reaction;
        $( "#skip-video-button" ).show();
        
        if( scores['expression'] == 1){
            $('.expression-score').text('Happy');
        }
        else{
            $('.expression-score').text('Sad');
        }
        
        /*
        setTimeout(function(){ // User has 10 seconds to get closer. As soon as the face print is revealed, the window is closed.
            decide('expression');
        }, 10000);
        */
    }
    else if( section_name == 'mouse' ){
		/*
        if(mouse_distance < 2000 || mouse_distance > 40000){
            mouse_score = -5;
        }
        if(mouse_distance < 5000 || mouse_distance > 20000){
            mouse_score = -3;
        }
        else{
            mouse_score = 5;
        }*/
		main_overlay_context.clearRect(0, 0, main_overlay_canvas.width, main_overlay_canvas.height);
        
        setTimeout(function(){
            report("showing interaction heatmap");
            show_additional_mouse_movement = true;
            final_mouse_distance = Math.floor(mouse_distance);
			
			
			
			if( is_mobile ){
				report("final touch distance = " + final_mouse_distance);
				scores['touch'] = final_mouse_distance;
			}else{
				report("final mouse distance = " + final_mouse_distance);
				scores[current_section_name] = final_mouse_distance;
			}
            
            
			$('.mouse-score').text(final_mouse_distance);
            $('#mouse-focus').removeClass('hidden');
            
            const target_position2 = $('#main-content').prop('scrollHeight');
            $("#main-content").scrollTop(target_position2);
            
            $('#heatmap').fadeIn();
            $( "#skip-video-button" ).show();
        }, 4000);
        
        if( !is_mobile ){
            report("starting mouse recording");
            //Recorder.printTable();
            //console.log("table should be empty?");
            Recorder.start(); // mouse recording
	        setTimeout(function(){ // If we're not on a mobile device, remove the heatmap and switch to showing how the mouse movements have been recorded.
                $('#heatmap').fadeOut();
                //Recorder.stop();
                //Recorder.printTable();
                Recorder.play();
                //console.log("Should be playing mouse movements now.")
                $('#purple-mouse-explanation').slideDown();  
                $( "body > img" ).click(function() {
                    $(this).fadeOut();
                });
	        }, 15000);
        }

    }
    
    else if( section_name == 'os' ){
        //
        var os_name = $.ua.os.name;
        os_name = os_name.toLowerCase();
        
        if( os_name == "android" || os_name == "windows" ){
            os_score = 0;   
        }
        else{
            os_score = 5;
        }
        scores[current_section_name] = os_name;
        $( "#skip-video-button" ).show();
    }
    

    else if( section_name == 'end' ){
		main_overlay_context.clearRect(0, 0, main_overlay_canvas.width, main_overlay_canvas.height);
        //$('#send-container').slideDown();
    }
    else if( section_name == 'bye' ){
        report("Showing section end");
        const normal_count = $('.normal-result').length;
        const not_normal_count = $('.not-normal-result').length;
        const total_normal_count = normal_count + not_normal_count;
        
        var normal_percentage = 0;
        //const normal_percentage = 
        report(" normals: " + normal_count + ", of " + total_normal_count);
        if( normal_count == total_normal_count ){
            normal_percentage = 100;
        }
        else if( normal_count == 0){
            normal_percentage = 0;
        }
        else{
            report('getting percentage');
            normal_percentage = Math.round( (100 / total_normal_count) * normal_count );
        }
        report(normal_percentage + "% normal");
        
        $('#normal-percentage').text(normal_percentage + '% Normal');
        
        // normal-percentage-title
        const normal_title_index = Math.round( normal_percentage / 20 );
        report("normal_title_index = " + normal_title_index);
        $('#normal-percentage-title').text( '"' + normal_percentage_titles[ normal_title_index ] + '"');
        
        
        // Add href to "social" sharing buttons
        
        const twitter_href = 'https://twitter.com/intent/tweet?text=I%20am%20' + normal_percentage + '%25%20normal.%20Test%20yourself%20at%20https%3A%2F%2Fwww.hownormalami.eu%20%23HowNormalAmI';
        $('#twitter-button').attr("href", twitter_href);
        
        const email_href = 'mailto:name@hownormalami.eu?subject=You%20might%20enjoy%3A%20how%20normal%20am%20I&amp;body=I%20am%20' + normal_percentage + '%25%20normal.%20Test%20yourself%20at%20https%3A%2F%2Fwww.hownormalami.eu%20%23hownormalami';
        $('#email-button').attr("href", email_href);
        
        //$('#two-vids').addClass('hidden');
        setTimeout(function(){
            report("showing bye colofon");
            $( "#bye-colofon" ).removeClass('hidden').hide().slideDown();
        }, 3000);
        
    }
    
    
    
    //$("#main-content").animate({scrollTop:$("#main-content")[0].scrollHeight}, 1000);
    const target_position = $('#main-content').prop('scrollHeight');
    $("#main-content").scrollTop(target_position);
    
    
    if(run_face_api){
        $('#main-overlay-canvas').show();
    }else{
        $('#main-overlay-canvas').hide();
    }
    
}



// Various small things that happen when a video is done playing. Called by EndOfVideo. TODO: lots of cruft left over, since its return values are never used.
//function get_score_video_id(){
function generate_funny_name(){
    
    if( current_section_name == 'beauty' ){
        var beauty_video_id = Math.round(scores['beauty'] / 25);
        
        if(beauty_video_id == 0){
            participant_name = "VeryNicePersonality";   
        }
        if(beauty_video_id == 1){
            participant_name = "NicePersonality";   
        }
        else if(beauty_video_id == 2){
            participant_name = "MomsPrecious";   
        }
        else if(beauty_video_id == 3){
            participant_name = "Sexypants";   
        } 
        else if(beauty_video_id == 4){
            participant_name = "InstaModelll";
        }
    }
	/*
    if( current_section_name == 'bmi' ){
        return scores[current_section_name];
    }
    if( current_section_name == 'closer' ){
        if(scores[current_section_name] == 0){
            $('.closer-score').text('No');
        }
        return scores[current_section_name];
    }
	*/
    else if( current_section_name == 'age' ){
        var birth_year = (2020 - age_score) - 1900;
        report("birth year: " + birth_year)
        if( birth_year > 100 ){birth_year = birth_year - 100;}
        report("birth year again: " + birth_year)
        participant_name = participant_name + birth_year;
        //return Math.floor(age_score / 20) + 1; 
    }
    else if( current_section_name == 'gender' ){
        //report("gender score in score: " + scores[current_section_name]);
        if( scores[current_section_name] == 0 ){
            participant_name = "Mr." + participant_name;
        }else{
            participant_name = "Madam" + participant_name;
        }
        //return scores[current_section_name];
    }
}


function isFaceDetectionModelLoaded() {
    //report("is face detection loaded? " + JSON.stringify(faceapi.nets.tinyFaceDetector.params));
    //return faceapi.nets.ssdMobilenetv1.params;
    report(faceapi.nets.FaceExpressionNet);
    return faceapi.nets.FaceExpressionNet.params;
    //return faceapi.nets.tinyFaceDetector.params;
}


// This function can also be used to override the normal progression by passing the section name.
function playVideo(video_name, section_name){
    var mobile_path = 'mobile-'; // for now, always play the low resolution video?
    if(is_mobile){
        mobile_path = 'mobile-';
    }
    
    if(section_name !== undefined){
        report("A section was passed: " + section_name);
        report("index: " + section_names.indexOf(String(section_name)));
        
        if( section_names.indexOf(String(section_name)) != -1){
            report("section name found in array of names");
            current_section_id = section_names.indexOf(String(section_name));
            report("current_section_id is now " + current_section_id);
            current_section_name = section_names[current_section_id];
            report("current_section_name is now " + current_section_name);
        }
    }
    
    if( video_name == 'stall' ){
        main_video_mp4.setAttribute('src', 'videos/' + video_name + '.mp4');
		main_video_webm.setAttribute('src', 'videos/' + video_name + '.webm');
    }
    else{
        report("PLAYING video " + mobile_path + video_name + " from section " + current_section_name);
        //main_video.setAttribute('src', 'videos/' + mobile_path + current_section_name + '-' + video_name + '.mp4'); 
		main_video_mp4.setAttribute('src', 'videos/' + mobile_path + current_section_name + '.mp4'); 
		main_video_webm.setAttribute('src', 'videos/' + mobile_path + current_section_name + '.webm');
    }
    
    main_video.load();
    try{
        main_video.play();
    }
    catch(e){
        report("Immediately caught a play() error: " + e);
        $( "#next-video-button" ).slideDown();
    }
    
    setTimeout(function(){ 
        //report("if necessary, showing next button");
        if(main_video.paused){
            $( "#next-video-button" ).slideDown();
        }
    }, 2000);
}








// FACIAL DETECTION

async function grabFrame(){
	
	//console.log("in grabframe");
	if( current_section_name == 'end' ){
		return; // When we reach the end, stop trying to analyse frames from the webcam.
	}
	
    var currentTime = +new Date();
	var time_delta = Math.abs(currentTime - previous_frame_time);
	if(time_delta < 1000){
		//console.log("grabframe: waiting...");
		setTimeout(grabFrame, 100);
		return;
	}
	previous_frame_time = currentTime;
	
    if(!face_api_loaded){
		report("faceapi not fully loaded yet");
        setTimeout(grabFrame, 100);
		// Show loading spin wheel
		return;
    }
	if(run_face_api_once && !pug_shown){
		pug_shown = true;
		$('#emotion-test').show();
		// Show doggy, then give the user a while to look at it. Then grab a frame and analyse the reaction.
		
        setTimeout(function(){ // trying to time it to coincide more with the moment in the video.
	        scores['start'] = 1;
	        started = true;
	        show_bounding_box = true;

	        $('#waiting').addClass('hidden');
	        $('#age-buttons-container').slideDown();
	        $('#cv-container').removeClass('hidden');
	        $('#video-container').removeClass('waiting-for-coach');
	        $('#coach-name').addClass('found');
	        $( "#skip-video-button" ).show();
			grabFrame();
        }, 4000);
		
		//setTimeout(grabFrame, 4000);
		
		report("showing doggy");
		return;
	}
	
	

	if(supports_offscreen_canvas){
		
	    canvy_context.drawImage(webcam_video,0,0,640,480);
    
	    var imgData2 = canvy_context.getImageData(0, 0, 640, 480);
    
	    //const imgData = faceCaptureCtx.getImageData(0, 0, 640, 480);
    
	    //console.log(imgData2);

		var current_face_api_use = 'face';
		try{
			current_face_api_use = detection_type[current_section_name];
		}
		catch(e){
			console.log("Error getting desired face api detection_type");
		}
	
	
		if(current_face_api_use === undefined){
			//report("current_face_api_use was undefined");
	        setTimeout(grabFrame, 100);
			return;
		}
		else{
			//report("grabframe:current_face_api_use = " + current_face_api_use);
		}

	    const { height, width, data } = imgData2;
	    //console.log("height:" + height);
	    // Transfer the buffer via a transferlist. Thanks to:
	    // https://stackoverflow.com/questions/41497124/allowable-format-for-webworker-data-transfer
		
		
		
	    window.faceapi_worker.postMessage({
	        type: "frame",
			use: current_face_api_use,
	        height,
	        width,
	        data,
	    }, [ data.buffer ]);
	}
	else{
        try{
			if(page_is_visible){
				//console.log("getting face the old fashioned way. Current section: " + current_section_name);
				
				//console.log(faceapi.nets);
				//console.log(faceapi);
				//console.log(webcam_video);
				//console.log(tiny_face_detector_options);
				
				var result;
				if(current_section_name == "start"){
					result = await faceapi.detectSingleFace(webcam_video, tiny_face_detector_options).withFaceExpressions();
					//result = await faceapi.detectSingleFace(webcam_video, options).withFaceExpressions();
				}
				else if(current_section_name == "age" || current_section_name == "gender"){
					result = await faceapi.detectSingleFace(webcam_video, tiny_face_detector_options).withAgeAndGender();
				}
				else if(current_section_name == "bmi"){
					result = await faceapi.detectSingleFace(webcam_video, tiny_face_detector_options).withFaceLandmarks(true);
				}
				else if(current_section_name == "closer" || current_section_name == "beauty"){
					result = await faceapi.detectSingleFace(webcam_video, tiny_face_detector_options).withFaceLandmarks(true).withFaceDescriptor();
				}
				
				
				//console.log(result);
				
		        if (result) {
					//console.log("Result!:");
					//console.log(result);
					onPlay(result);
					updateOverlay(result);
					setTimeout(grabFrame, 200);
				}
				else{
					//console.log("no result, clearing overlay");
					if(!show_hog){
						main_overlay_context.clearRect(0, 0, main_overlay_canvas.width, main_overlay_canvas.height);
					}
					setTimeout(grabFrame, 100);
				}
			}
			else{
				setTimeout(grabFrame, 1000);
			}
		}
		catch(e){console.log("Error: grabframe: " + e);}
	}
	
}


async function updateOverlay(result){

    try{
        const dims = await faceapi.matchDimensions(main_overlay_canvas, webcam_video, true);
		//console.log("updateOverlay: dims: ");
		report("dims.width: " + dims.width);
	
		if(show_hog){
			//const image = document.getElementById('color');
			//var canvas = document.createElement('canvas');
			report("main_overlay_canvas.width = " + main_overlay_canvas.width);
		
			main_overlay_context.drawImage(webcam_video,0,0,640,480);
			processing.drawMagnitude(main_overlay_canvas);
		}
		
		if(is_mobile){
			show_bounding_box = true;
		}
		
		
        if (show_bounding_box) {
            
			if( result != null){
				if( "detection" in result ){
					if( '_box' in result.detection ){
						const b = result.detection._box;
						//console.log("_box spotted");
						//console.log(result.detection._box);
						const box_points =[
							{'_x':b._x, '_y': b._y},
							{'_x':b._x + b._width, '_y': b._y},
							{'_x':b._x + b._width, '_y': b._y + b._height},
							{'_x':b._x, '_y': b._y + b._height},
						] 
						/*
						const new_box = {
							'x':result.detection._box._x, 
							'y':result.detection._box._y,
							'width':result.detection._box._width, 
							'height':result.detection._box._height
						}
						*/
						drawPart(box_points,true);
						//faceapi.draw.drawDetections(main_overlay_canvas, new_box);
					}
				}
			}
        }
		
		show_landmarks = false;
		
        if (show_landmarks) {
			//console.log(result.landmarks);
			//const resizedResult = await faceapi.resizeResults(result.landmarks, dims);
			//console.log("resized landmarks");
			//console.log(resizedResult);
			
			try{
				//console.log(faceapi.draw.drawContour);
				//console.log( result.landmarks.getYeswOutline() );
			
			
				if( 'faceparts' in result){
					//console.log("faceparts spotted");
					//console.log(result.faceparts);
	
	
					for (var part in result.faceparts) {
					    if (result.faceparts.hasOwnProperty(part)) {
							var close_drawing = true;
							
							if (part == 'jawOutline'){
								close_drawing = false;
							}
							drawPart(result.faceparts[part],close_drawing);
					    }
					}
				}
				
			}
			catch(e){
				console.log("Error showing landmarks: " + e);
			}
			
            //faceapi.draw.drawFaceLandmarks(main_overlay_canvas, resizedResult); // landmarks
			
        }
		
        if (show_eyebrows) {
			if( 'faceparts' in result){
				drawPart([result.faceparts.leftEye[0],result.faceparts.leftEyeBrow[0]],false);
				drawPart([result.faceparts.leftEye[1],result.faceparts.leftEyeBrow[2]],false);
				drawPart([result.faceparts.leftEye[2],result.faceparts.leftEyeBrow[4]],false);
				
				drawPart([result.faceparts.rightEye[1],result.faceparts.rightEyeBrow[0]],false);
				drawPart([result.faceparts.rightEye[2],result.faceparts.rightEyeBrow[2]],false);
				drawPart([result.faceparts.rightEye[3],result.faceparts.rightEyeBrow[4]],false);
			}
		}
		
        


	}
    catch(e){report("overlay error: " + e);}

	const minimum_two_vids_height = $("#main-video-wrapper").height();
	$("#main .two-vids").css("min-height",minimum_two_vids_height);

}


function extractExpressions(result){
	report("in extractExpressions with result: ", result);
    var highest_expression_score = 0;
    var dominant_expression = null;
    for (let key in result['expressions']){
        if(result['expressions'].hasOwnProperty(key)){
            //report(`${key} : ${result['expressions'][key]}`);
            expressions[key] = expressions[key] + result['expressions'][key];

            if( result['expressions'][key] > highest_expression_score ){
                highest_expression_score = result['expressions'][key];
                dominant_expression = key;
            }
        }
    }
    if(run_face_api_once == false){ // Remember the reaction to the animated gif
        if( result['expressions']['happy'] >= result['expressions']['sad'] ){
            initial_reaction = 1;
        }
        else{
            initial_reaction = 0;
        }
		// Now that the initial reaction has been recorded, hide the boggy
		$('#emotion-test').hide();
    }
    
    $('#dominant-expression').text(expression_translations[dominant_expression]);
    //return dominant_expression;
}

function onChangeHideBoundingBoxes(e) {
    withBoxes = !$(e.target).prop('checked')
}

function updateTimeStats(timeInMs) {
    forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30)
    const avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length
    $('#time').val(`${Math.round(avgTimeInMs)} ms`)
    $('#fps').val(`${faceapi.utils.round(1000 / avgTimeInMs)}`)
}

function interpolateAgePredictions(age) {
    predictedAges = [age].concat(predictedAges).slice(0, 30)
    const avgPredictedAge = predictedAges.reduce((total, a) => total + a) / predictedAges.length
    return avgPredictedAge
}



async function onPlay(result) {
	//report("in onPlay with current_section_name: " + current_section_name);
    if (webcam_video.paused || webcam_video.ended || !face_api_loaded || !run_face_api || !page_is_visible){
		report("cannot do onPLay :-(. face_api_loaded = " + face_api_loaded + ", run_face_api = " + run_face_api + ", page_is_visible = " + page_is_visible);
		return setTimeout(() => onPlay(result), 100);
    }
    
    if(current_section_name == "start" && !run_face_api_once){

        //const result = await faceapi.detectSingleFace(webcam_video, options).withFaceExpressions();
        report("Detected initial face. Show the doggy, and then let's get this party started!");
		report(JSON.stringify(result,null,2));
        try{
            extractExpressions(result);
            run_face_api_once = true;
        }catch(e){report("Error extracting initial expression: " + e);}


    }
        
    
	//
	//  EXPRESSION
    
    else if(current_section_name == "expression"){

        //const result = await faceapi.detectSingleFace(webcam_video, options).withFaceLandmarks().withFaceExpressions();

        extractExpressions(result);
        //report("result = " + JSON.stringify(result,null,2));
        $( "#skip-video-button" ).show();
        //updateOverlay(result);
    }
        
    
    
    

	//
	//  CLOSER
		
    else if(current_section_name == "closer"){
        //const result = await faceapi.detectSingleFace(webcam_video, options).withFaceLandmarks().withFaceDescriptor();
        //if (result) {
            
        try{
			if( '_box' in result['detection'] ){
	            const closer_current_width = result['detection']['_box']['_width'];


	            if(closer_start_width == 0){
	                report("START CLOSER WIDTH = " + closer_current_width);
	                closer_start_width = closer_current_width;
	                scores[current_section_name] = 0;
	                //report(result);
	                $( "#skip-video-button" ).show();
	            }
            
	            function clamp(point_value) {
	                return Math.max(0, Math.min(Math.abs(point_value), 127));
	            }

	            face_print = "";
	            for (var i = 0; i < result['descriptor'].length; i++) {
                
	                const face_point = Math.round(result['descriptor'][i] * 1000);
                
	                var color = clamp(face_point);
	                var extra_class = 'class="negative"';
	                if( face_point > 0 ){
	                    color += 127;
	                    extra_class = '';
	                }
	                else{
	                    color = 128 - color;
	                }
                
	                if( i % 8 == 0){
	                    face_print += '<br/>';
	                }
	                face_print += '<span ' + extra_class + ' style="background-color:rgb(' + color + ',' + color + ',' + color +')">' + face_point + '</span>';

	            }
	            $('#face-print').html(face_print);

	            if(closer_current_width > (closer_start_width * 1.2)){
	                report("closer_current_width = " + closer_current_width);
	                if(face_print_revealed == false){
	                    face_print_revealed = true;
	                    scores[current_section_name] = 1;
	                    decide('closer');
						if( scores['gender'] == 1){
							$(".closer-score").text("Good girl");
						}else{
							$(".closer-score").text("Good boy");
						}
	                    
	                    $("#closer-reveal").removeClass('hidden');
	                }
	            }
			}
			else{
				console.log("Closer: no 'box' property in detection: ");
				console.log(result['detection']);
			}
            
        }
        catch(e){report(e);}
        //updateOverlay(result);
		//}
    }


	//
	//  GENDER
	
    else if(current_section_name == "gender"){
        //const result = await faceapi.detectSingleFace(webcam_video, options).withFaceLandmarks().withAgeAndGender();
        //if (result) {
            
        const gender = result['gender'];
        const genderProbability = result['genderProbability'];
        
        if( gender == "male" ){
            scores[current_section_name] = 0;
            $(".gender-score").html('Man');
            $(".gender-opposite").text('Woman');
            gender_score = 5;
        }else{ 
            scores[current_section_name] = 1;
            $(".gender-score").text('Woman'); //faceapi.utils.round(
            $(".gender-opposite").text('Man');
            gender_score = -5; 
        }
        $(".gender-probability").text( Math.round(genderProbability * 100) );
        
        $( "#skip-video-button" ).show();
		//}
    }

	
	//
	//  AGE

    else if(current_section_name == "age"){
        //console.log("--AGE---");
		
        const age = result['age'];
        if( interpolatedAge == 0 ){
            interpolatedAge = age;
        }
        interpolatedAge = ((age + interpolatedAge) / 2);

        var int_age = Math.round(interpolatedAge);
		
		$(".current-age").text(int_age);
		
        if( int_age < age_score ){
            report("new age score = " + int_age);
            age_score = int_age;
            scores[current_section_name] = int_age;
            $(".age-score").text(int_age);
            // report("selected age: " + selected_age );
            if(selected_age != null){

                report("delta between ages = " + Math.abs(selected_age - int_age));
                if( Math.abs(selected_age - int_age) > 5 ){
                    $('#lied-toggle').hide();
                }else{
                    $('#lied-toggle').show();
                }
                if(ready_to_show_if_lied_about_age){
                    $("#current-age-display").hide();
					$('.lied-display').fadeIn();
					
                }
            }
            $( "#skip-video-button" ).show();
        }
    }


	//
	//  BEAUTY	
	
    else if( current_section_name == "beauty"){
        //report("onPlay: sending result to beauty worker.");
		if( result.hasOwnProperty('descriptor') ){
			//const result = await faceapi.detectSingleFace(webcam_video, options).withFaceLandmarks().withFaceDescriptor();
			window.beauty_worker.postMessage(result.descriptor); // send a 128 float face descriptor array
		}
		else{
			grabFrame();
		}

    }
    
	
	//
	//  BMI
	
    else if( current_section_name == "bmi"){
		//report("onPlay: sending result to BMI worker.");
		if( result.hasOwnProperty('landmarks') ){
        	//const result = await faceapi.detectSingleFace(webcam_video, options).withFaceLandmarks().withFaceDescriptor();
			window.bmi_worker.postMessage(result.landmarks._positions); // send array of 68 coordinates
		}
		else{
			grabFrame();
		}
    }
	
}


function positionOverlay() {
    //const optimal_overlay_width = webcam_video.videoWidth;
	//console.log(webcam_video);
	const optimal_overlay_width = webcam_video.offsetWidth;
	/*
	if(portrait){
		optimal_overlay_width = webcam_video.width;
	}
	else{
		optimal_overlay_width = webcam_video.videoWidth;
	}
	*/
	//console.log("optimal_overlay_width = " + optimal_overlay_width);
    var optimal_overlay_width_x_offset = Math.floor((window.innerWidth - optimal_overlay_width) / 2);
    if(optimal_overlay_width != 0){
		//console.log("-->");
		//console.log(main_overlay_canvas);
    	//main_overlay_canvas.setAttribute("style","width:" + optimal_overlay_width + "px;max-width:" + optimal_overlay_width + "px;"); //left:" + optimal_overlay_width_x_offset + "px");
    	//document.getElementById("webcam-video-wrapper").setAttribute("style","width:" + optimal_overlay_width + "px;max-width:" + optimal_overlay_width + "px");
		//document.getElementById("two-vids").setAttribute("style","height:" + (optimal_overlay_width * 0.75) + "px;max-height:" + (optimal_overlay_width * 0.75) + "px");
		//document.getElementById("webcam-video").setAttribute("style","height:" + (optimal_overlay_width * 0.75) + "px;max-height:100vh");
		
	}
    
}

async function webcamLoaded(element){
	console.log("webcam has loaded");
	setMaxWidth();
	element.play();
	grabFrame();
}


/*
async function getCameraDevices() {
	const devices = await navigator.mediaDevices.enumerateDevices();
	const video_devices = devices.filter(device => device.kind === 'videoinput');
	return video_devices;
	//report(options.join(''));
}
*/



async function run(switching){	
	switching = switching || false;
	
	if(facing_direction == "environment"){
		facing_direction = "user";
	}
	else{
		facing_direction = "environment";
	}

	
    const constraints = {
          audio: false,
          video: {
			  width: { ideal: 640 },
			  height: { ideal: 480 } //,
            //facingMode: facing_direction
          }
    }
	

    report("starting getUserMedia");
	

	if(switching){
		report("Switching camera, so first stopping the old camera stream.");
	    /*
		let stream = null;
	
		stream = await navigator.mediaDevices.getUserMedia(constraints);
	
		// Stop the tracks
		const tracks = stream.getTracks();
		tracks.forEach(track => track.stop());
		*/
	}


	getStream().then(getDevices).then(gotDevices);



	/*
	if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
		console.log("ERROR no navigator.mediaDevices.getUserMedia");
	}else{
		console.log("--===---==--==-=-=-=- nav.media.getusermedia is not undefined");
	}
	*/
	//console.log("(((()))(())()()()))((()))()()");

/*
    try {
		//stream = await navigator.mediaDevices.getUserMedia(constraints);
		stream = await navigator.mediaDevices.getUserMedia(constraints);
		
		// Stop the tracks
		const tracks = stream.getTracks();
		tracks.forEach(track => track.stop());
	
	
		webcam_video.srcObject = null;
		webcam_video.srcObject = stream;
		
	    var playPromise = webcam_video.play();

	    if (playPromise !== undefined) {
	      playPromise.then(_ => {
			  report("playing camera stream started ok");
	        // Automatic playback started!
	        // Show playing UI.
	      })
	      .catch(error => {
			  report("webcam video stream couldn't be started ok");
	        // Auto-play was prevented
	        // Show paused UI.
			  
		      // Let's try again in two seconds.
		      setTimeout(function(){ 
		          webcam_video.play();
		      }, 2000);
			  
	      });
	    }
		
		
		video_permission = true;
		//setMaxWidth();
		positionOverlay();
		
    } catch(err) {
    	report("ERROR - couldn't get userMedia (camera): " + err);
    }
	
*/
	
	/*
	try{
		navigator.mediaDevices.getUserMedia(constraints)
		.then(function(stream) {
			
			//webcam_video.srcObject = null;
	        webcam_video.srcObject = stream;
	        webcam_video.play();
	        video_permission = true;
	        //setMaxWidth();
			positionOverlay();
			//grabFrame();
		})
		.catch(function(err) {
			 report("navigator.getUserMedia error: ");
			 report(err);
		});
	}
	catch(e){
		console.log(e);
		$('#webcam-problem').slideDown(); 
	}
	
	
	
	/*
    function successCallback(stream) {
        report("succesfully accessed camera");
        try{
            
            webcam_video.srcObject = stream;
            webcam_video.play();
            video_permission = true;
            //setMaxWidth();
			positionOverlay();
			//grabFrame();
            
        }
        catch(e){ report("Error using webcam stream"); }
    }

    function errorCallback(error) {
        report("navigator.getUserMedia error: ", error);
    }
	

	
	if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
		try{
			navigator.getUserMedia = ( navigator.getUserMedia ||
		                       navigator.webkitGetUserMedia ||
		                       navigator.mozGetUserMedia ||
		                       navigator.msGetUserMedia);
			navigator.getUserMedia(constraints, successCallback, errorCallback);
		}
		catch(e){ report("navigator.getUserMedia was too old to work"); }
		
	} else {
		navigator.mediaDevices.getUserMedia(constraints).then(successCallback).catch(errorCallback);
	}
	
	/**/
    
    // Fallback if nothing happens with the webcam
    setTimeout(function(){ 
        if(video_permission == false){  
            report("webcam seems to not have started?");
            $('#waiting').hide();
            //$('#webcam-problem').slideDown(); 
            $('#nocam').fadeIn();
        } 
    }, 20000);
    
}





async function load_face_api_nets() {
    
    try{
        //await faceapi.nets.ssdMobilenetv1.load('models/');
		await faceapi.nets.tinyFaceDetector.load('models/');
        report("loaded tiny face detection");
    }
    catch(e){console.log(e);}

	console.log("tiny face detection model loaded");
	
    try{
        await faceapi.nets.ageGenderNet.load('models/'); // gender
        report("loaded age and gender detection");
    }
    catch(e){console.log(e);}
	
    try{
        await faceapi.loadFaceLandmarkTinyModel('models/') // tiny landmarks
        report("loaded tiny landmarks model");
    }
    catch(e){console.log(e);}
	
    try{
		
		await faceapi.loadFaceRecognitionModel('models/') // face vectors
        //await faceapi.loadTinyFaceDetectorModel('models/') // face vectors
        report("loaded face recognition detection");
    }
    catch(e){console.log(e);}    
	

    //await faceapi.nets.ageGenderNet.load('models/');
    //report("loaded age and gender detection");
	tiny_face_detector_options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
	
	
    try{
        await faceapi.loadFaceExpressionModel('models/'); // expression
        report("loaded expression detection");
    }
    catch(e){console.log(e);}    
	
    age_and_gender_loaded = true;

    //await faceapi.nets.faceExpressionNet.load('/')
    //changeInputSize(224)
	


    face_api_loaded = true;
	console.log("non-worker face api should be loaded");
	//const dims = faceapi.matchDimensions(main_overlay_canvas, webcam_video, true);
}


/**/


/*


async function load_face_api_nets() {
    
    try{
        await faceapi.nets.ssdMobilenetv1.load('models/');
        report("loaded face detection");
    }
    catch(e){console.log(e);}
     
    try{
        await faceapi.loadFaceLandmarkModel('models/'); // landmarks
        report("loaded landmark detection");
    }
    catch(e){console.log(e);}

    try{
        await faceapi.loadFaceExpressionModel('models/'); // expression
        report("loaded expression detection");
    }
    catch(e){console.log(e);}    

    try{
        await faceapi.nets.ageGenderNet.load('models/'); // gender
        report("loaded age and gender detection");
    }
    catch(e){console.log(e);}
    
    $('#emotion-test').show();
    
    try{
        await faceapi.loadFaceRecognitionModel('models/') // face vectors
        report("loaded face recognition detection");
    }
    catch(e){console.log(e);}    

    //await faceapi.nets.faceExpressionNet.load('/')
    //changeInputSize(224)

	tiny_face_detector_options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
	
    face_api_loaded = true;
}

/**/




$(document).ready(function() {
    
    report("AVERAGES = " + JSON.stringify(averages,null,2));
	report("SCORES = " + JSON.stringify(scores,null,2));
    averages['beauty'] = averages['beauty'] / 10;

    
    if( averages['terms'] > .5 ){
         $('#read-terms .normal-value').html('Yes' + addPercentage('terms')); // I wonder if this will ever be called :-(
    }
    else{
        $('#read-terms .normal-value').html('No' + addPercentage('terms'));
    }
    
    if(is_mobile){
        report("IS_MOBILE");
        //$('body').addClass('is-mobile'); // forces the skip video button to always be visible.
    }else{
    	report("IS NOT MOBILE");
    }
	
    if(debug){    
        $('#debug-button').show();
    }
    
    
    if( is_iphone && !is_safari){
        //$('#landing-terms-container').hide();
        $('#use-safari').show();
		$('#landing-terms-container').hide();
    }
    
    
    $('#loading').hide();
    
    
    if(video_permission == true){
        $('#returned').fadeIn(500);
    }
    
    $( "#show-terms-button" ).click(function() {
        clicked_terms = 10;
        scores['terms'] = 1;
        $('#terms-container').removeClass('hidden');
        $('#read-terms .detected-value').text('Yes');
        
        report("terms! Nice!");
        $('#landing-container').addClass('hidden');
		
		/*
		var elmnt = document.getElementById("webslides");
		elmnt.scrollLeft = 0;
		elmnt.scrollTop = 0;
		document.getElementById("webslides").scrollTop = 0;
		document.getElementById("terms-container").scrollTop = 0;
		*/
		
		/*
		console.log("scrolling to top");
		$("body").scrollTop();
		$("#webslides").scrollTop();
		$("#terms-container").scrollTop();
		*/
		window.scrollTo(0, 0);
		
		
		setTimeout(function(){ 
			for (var i = 0; i < 50; i++) {
				console.log("confetti!");
				setTimeout(function(){ 
			  		create_confetti(i);
				}, i * 30);
			} 
		}, 200);
		setTimeout(function(){ 
			$('.confetti-wrapper').remove();
		}, 7000);
		
    });
    
   function starttheshow() {
        console.log("show")
        report("STARTING THE SHOW");
        current_section_id = 1;
		window.scrollTo(0, 0);
        run();
        try{
        	main_video.play();
        }
        catch(e){
            report(e);
            $('next-video-button').show();
        }
        webcam_video.play();
        $('#webslides').hide();
		$( "#bye-sources").addClass('hidden');
        $('#main').show();
        
        //report("terms viewed? " + scores['terms'] + " =?= terms average: " + Math.round(averages['terms']));
        if( scores['terms'] != Math.round(averages['terms']) ){
            report("Not normal terms choice");
            $('#read-terms').addClass('not-normal-result');   
        }else{
            report("Normal terms choice");
            $('#read-terms').addClass('normal-result');  
        }
        
        
        $('#landing-container').fadeOut();
        $('#terms-container').hide();
        showLoadingSentence();
    };
    



function crimes(){
    console.log("Commit")
}



    $('#age-buttons button').click(function(e) {
        report("Clicked on an age button: " + $(this).text());
        selected_age = $(this).text();
        scores['age_shared'] = 1;
        decide('age_shared');
        $('.age_shared .detected-value').text("Yes");
        //$('#age-buttons-container').addClass('hidden');
		$('#age-buttons-container').slideUp();
    });
    
    // Clicker
    $( "#mystery-button1" ).click(function() {
        $( "#clicker-focus" ).fadeOut();
        clicker = 1;
        $('.clicker-score').text( 'Lubach' );
        scores[current_section_name] = 1;
        $( "#skip-video-button" ).show();
    });
    $( "#mystery-button2" ).click(function() {
        $( "#clicker-focus" ).fadeOut();
        clicker = 0;
        scores[current_section_name] = 0;
        $('.clicker-score').text( 'Judeska' );
        $( "#skip-video-button" ).show();
    });
    $( "#mystery-button3" ).click(function() {
        $( "#clicker-extra" ).slideDown();
        $(this).hide();
    });
    
    $( "#next-video-button" ).click(function() {
        $(this).hide();
        main_video.play();
    });
    
    
    $( "#debug-button" ).click(function() {
        $('#debug').toggle('hidden');
    });
    
    
    $( "#skip-video-button" ).click(function() {
        atEndOfVideo();
    });
    
    
    $( "#send-button" ).click(function() {
        $( "#end-focus, #aagje-button" ).hide();
        $('.end-score').text("Yes");
        $('.sent').removeClass('hidden');
        scores[current_section_name] = 1;
        decide('end');
        show_section('bye');
        report("sending scores: " + JSON.stringify(scores));
        $.ajax({
            type: "POST",
            url: "ajax.php",
            data: scores,

            success: function(data)
            {
                report(data);
            }
        });
    });
    
    
    $( "#do-not-send-button" ).click(function() {
        
        $('.end-score').text("No");
        $( "#end-focus, #aagje-button" ).hide();
        $('.end-score').text("No");
        $('.sent').removeClass('hidden');
        scores[current_section_name] = 0;
        decide('end');
        show_section('bye');
        report("sending no_scores: " + JSON.stringify(no_scores)); // this variable only contains the fact that no scores were sent.
        
        $.ajax({
            type: "POST",
            url: "ajax.php",
            data: no_scores,

            success: function(data)
            {
                report(data);
            }
        });
    });

    
    // Aagje
    $( "#aagje-button" ).click(function() {
        aagje_score = 10;
        scores['aagje'] = 1;
        $( "#aagje-button" ).hide();
        report("Nieuwsgierig aagje!");
        
        decide('aagje');
        /*
        if( averages['aagje'] > .5 ){
            $('#aagje-display .normal-value').text('Yes');
            $('#aagje-display').addClass('normal-result');
        }
        else{
            $('#aagje-display').addClass('not-normal-result'); // :-(
        }*/
        
        $('#aagje-display').slideDown();
    });
    
    
    // Show sources
    $( "#show-sources" ).click(function() {
       $( "#bye-sources").removeClass('hidden');
	   $( "#main").addClass('hidden');
	   window.scrollTo(0, 0);
    });
	
    // Show sources, added an extra one in terms and conditions
    $( "#show-sources-extra" ).click(function() {
		$('#webslides').hide();
       $( "#bye-sources").removeClass('hidden');
    });
	
	
	//f(is_mobile){
		
		document.getElementById("switch-camera").addEventListener('click', event => {
		  report("switching camera button was pressed");	  
		  run(true);
	  	});
	//}
	
    
    
    $(document).mousemove(function(event) {
        
        if(last_mouse_position.x) {
            mouse_distance += Math.sqrt(Math.pow(last_mouse_position.y - event.clientY, 2) + Math.pow(last_mouse_position.x - event.clientX, 2));

            //$('#mouse-distance').val(Math.round(mouse_distance));
            if(show_additional_mouse_movement){
                $('#mouse-score-additional-value').text(Math.floor(mouse_distance - final_mouse_distance));
            }

        }
        //report(event.clientX);
        last_mouse_position.x = event.clientX;
        last_mouse_position.y = event.clientY;
        heat.add([event.clientX, event.clientY, 1]);
        frame = frame || window.requestAnimationFrame(draw);
    });
    
    
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                   window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    
    function draw() {
        //console.time('draw');
        heat.draw();
        //console.timeEnd('draw');
        frame = null;
    }
    
    heatmap.width = window.innerWidth;
    heatmap.height = window.innerHeight;
    
    var heat = simpleheat('heatmap'),frame;
    
    window.onresize = function(event) {
        heatmap.width = window.innerWidth;
        heatmap.height = window.innerHeight;
        heat.resize();
        if(started){
            setMaxWidth();   
        }
    };


	// Load GEO IP data
    $.ajax({
        type: "GET",
        url: "simple_geo.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });

	if(!supports_offscreen_canvas){
		load_face_api_nets();
	}
	
	setMaxWidth();
    
})





// parse CSV

function processData(allText) {
	report("loaded GEO IP CSV. Looking for IP: " + user_ip);
	report(typeof user_ip);
	report(user_ip.length);
    var allTextLines = allText.split(/\r\n|\n/);
    //var headers = allTextLines[0].split(',');
    //var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        const data = allTextLines[i].split(',');
		if( data[0] == user_ip ){
			user_country = data[1];
			report("IP BINGO: " + user_country);
			break;
		}
    }
	report("Country should be found now. Next: loading life expectancy data.");
	// Load life expectancy data
    $.ajax({
        type: "GET",
        url: "life.csv",
        dataType: "text",
        success: function(data) {processLife(data);}
     });
    // alert(lines);
}


// Handle BMI life expectancy data
function processLife(allText) {
	report("loaded CSV");
    var allTextLines = allText.split(/\r\n|\n/);
    //var headers = allTextLines[0].split(',');
    //var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        const data = allTextLines[i].split(',');
		if( data[0] == user_country ){
			report("LIFE DATA BINGO: " + user_country);
			life_source_data = data;
			report(life_source_data);
			bmi_country_average = parseFloat(life_source_data[7]);
			break;
		}
    }
    // alert(lines);
}



// CONFETTI


function create_confetti(i) {
  var width = Math.random() * 8 + 8;
  var height = width * 0.4;
  var colourIdx = Math.ceil(Math.random() * 3);
  var colour = "red";
  switch(colourIdx) {
    case 1:
      colour = "yellow";
      break;
    case 2:
      colour = "blue";
      break;
    default:
      colour = "red";
  }
  $('<div class="confetti-'+i+' '+colour+'"></div>').css({
    "width" : width+"px",
    "height" : height+"px",
    "top" : -Math.random()*20+"%",
    "left" : Math.random()*100+"%",
    "opacity" : Math.random()+0.5,
    "transform" : "rotate("+Math.random()*360+"deg)"
  }).appendTo('.confetti-wrapper');  
  
  drop(i);
}

function drop(x) {
  $('.confetti-'+x).animate({
    top: "100%",
    left: "+="+Math.random()*15+"%"
  }, Math.random()*3000 + 3000, function() {
    //reset(x);
  });
}
/*
function reset(x) {
  $('.confetti-'+x).animate({
    "top" : -Math.random()*20+"%",
    "left" : "-="+Math.random()*15+"%"
  }, 0, function() {
    drop(x);             
  });
}
*/


function calculate_life_expectancy(){
	report("calculating life expectancy");
	report("country = " + user_country);
	report(life_source_data);
	
	report("bmi = " + scores['bmi'])
	report("gender = " + scores['gender'])
	
	const bmi = scores['bmi'];
	
	var average_expectancy = 80;
	var low = 70;
	var high = 90;
	try{
		if(scores['gender'] == 0){
			report("gender was male");
			average_expectancy = parseFloat(life_source_data[1]);
			low = parseFloat(life_source_data[2]);
			high = parseFloat(life_source_data[3]);
		}
		else{
			report("gender was female");
			average_expectancy = parseFloat(life_source_data[4]);
			low = parseFloat(life_source_data[5]);
			high = parseFloat(life_source_data[6]);
		}


		// Creating an extremely arbitrairy life expectancy range
		const average_bmi = parseFloat(life_source_data[7]);	
		const low_factor = ((average_expectancy - low) / 10) + 1; // should range between approximately 1 and 3, with third world countries having higher numbers.
		const high_factor = ((high - average_expectancy) / 10) + 1;
	
		low = average_expectancy - (10 * low_factor);
		high = average_expectancy + (10 / high_factor); // If japan has a factor of 1.1, then their high possible age should become the average plus about 10. If worse countries, the high mark will be divided by a larger number. E.g. 10 / 3 = 3.3. So the highest possible age becomes the average + 3.3.
		report("ave = " + average_expectancy);
		report("low = " + low);
		report("high = " + high);
	
		// We need to create a way to set how unhealty a BMI is.
		//const offset_from_optimal_bmi = Math.abs(22 - bmi);
		//console.log("offset_from_optimal_bmi = " + offset_from_optimal_bmi);
	
		const optimal_bmi = (average_bmi + 22) / 2; // Assuming optimal BMI is 22. However, we shift that a bit depending on the average for the country. Even a relatively high average BMI can still lead to long life in countries with good health care.
	
		const offset_from_average_bmi = Math.abs(bmi - average_bmi); // 
		const offset_from_optimal_bmi = Math.abs(bmi - optimal_bmi); // 
		report("offset_from_average_bmi = " + offset_from_average_bmi);
		report("offset_from_optimal_bmi = " + offset_from_optimal_bmi);

	
		//The maximum possible BMI prediction is 44.
		const range = high - low;
		const bmi_offset_range = 44 - optimal_bmi;
		report("bmi_offset_range = " + bmi_offset_range);
	
		const life_loss_per_bmi_offset = bmi_offset_range / range;
	
		const life_loss = offset_from_average_bmi * life_loss_per_bmi_offset;
		life_expectancy = high - life_loss;

	}catch(e){
		console.log("was unable to calculate life expectancy due to missing data about your country. Setting it to 81..");
		life_expectancy = 81;
	}
	
	scores['life'] = Math.round(life_expectancy);
	$('.life-score').text(Math.round(life_expectancy));
	
	years_left = life_expectancy - scores['age'];
	if(years_left < 0){
		years_left = 0;
		report("DEATH IS IMMINENT");
	}
	
	
	$('.life-remaining').text(Math.round(years_left));

}




function drawPart(points,isClosed){
	//console.log("in drawpart");
	
	
    // Line color
	main_overlay_context.fillStyle = '0,0,0';

    // line width
    main_overlay_context.lineWidth = 2;
	main_overlay_context.strokeStyle = '#ee5635';
	
	main_overlay_context.beginPath();

	  points.slice(1).forEach(({ _x, _y }, prevIdx) => {
		  //console.log(prevIdx);
		  //console.log(points[prevIdx]);
		  const from = points[prevIdx];
		  //console.log(_x);
		  //console.log(from._x);
		  main_overlay_context.moveTo(from._x, from._y);
		  main_overlay_context.lineTo(_x, _y);
	  })

	  if (isClosed) {
		  const from = points[points.length - 1];
		  const to = points[0];
	    if (!from || !to) {
			return;
	    }

	    main_overlay_context.moveTo(from._x, from._y);
	    main_overlay_context.lineTo(to._x, to._y);
	  }

	  main_overlay_context.stroke();
	
}


// HELPERS


function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}


function r(value){ // rounds to one decimal
    return Math.round( value * 10 ) / 10;
}


