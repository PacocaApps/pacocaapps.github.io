//TOTALLY NOT GAY STOP GIT
var scolor = "green"
var stpoints = [];
var slider;
var velocity = 1;
function setup(){
    createCanvas(windowWidth, windowHeight);
    slider = createSlider(0, 3000000000, 1500000000);
    slider.position(10, 200);
    slider.style('width', '500px');
}
function draw() {
	var deg = 270;
	var rad = radians(deg);

	background(240);
 translate(windowWidth/2,windowHeight)
	// the red rectangle is drawn before the rotation so
	// it will stay in place


	fill(0, 0, 0);
	textSize(32);
text("Observer 'Aceleration': "+velocity+"%", -500, -800);
	
	// rotation is done here. all subsequent drawing
	// is done post-rotation
	rotate(rad);
	
	// draw the grid
	drawGrid();
	fill(255,0,0)
  
	stroke(0,0,0)
    line(0,0,height,0)
	stroke(255,100,100)
	line(0,0,height+10,width/2)
	line(0,0,height+30,-width/2)
velocity = map(slider.value(),0,3000000000,-300000000,300000000);
console.log(velocity)
    for(var i = 0;i < stpoints.length;i++){

		stpoints[i].display();
		stpoints[i].calculate();
    }
}
function mousePressed(){

    stpoints.push(new point(-mouseY + 933,map(mouseX,0,windowWidth,-width/2,width/2),scolor));
console.log(mouseY)
}

function drawGrid() {
	stroke(200);
    fill(120);
   textSize(14)
    
	for (var x=-2*width; x < 2*width; x+=40) {
		line(x, -2*height, x, 2*height);
        text(x+"s", x+1, 12);
       

    
	}
	for (var y=-2*height; y < 2*height; y+=40) {
		line(-2*width, y, 2*width, y);
		
	}
	for (var x=-2*width; x < 2*width; x+=40) {

		var trueValue = x*3
 
			text(trueValue+"x10^9m", 1, x+12);
		

    
	}

    
}






class point {
constructor(timePos,spacePos,color){
this.timePos = timePos;
this.spacePos = spacePos;
this.powednigga = Math.pow(10,9);
this.spaceValue = 3*this.spacePos*this.powednigga

this.lightspeed = 3*this.powednigga;
this.color = color;
}


display(){


if(this.color === "green"){
fill(0,255,0)
}else if(this.color === "blue"){
fill(0,0,255)
}
else if(this.color === "red"){
fill(255,0,0);
}
    ellipse(this.timePos,this.spacePos,10,10)
    this.spacePos = this.spaceValue/this.lightspeed


}


calculate(){
this.velocity = velocity;

//GAMMA LORENTZ INDEX
this.gammadivison = Math.pow(velocity,2)/Math.pow(this.lightspeed,2)
this.gammasub = 1 - this.gammadivison
this.gammasqrt = Math.sqrt(this.gammasub)
this.gamma = Math.pow(this.gammasqrt,-1)
// GAMMA CALCULUS FINISHED


//GAMMA AS LORENTZ FACTOR

//FINISEHD

//UPDATE TIME POS

this.updt1 = this.velocity*this.spaceValue
this.updt2 = this.updt1/Math.pow(this.lightspeed,2)
this.updt3 = this.timePos - this.updt2;

this.timePos = this.gamma*this.updt3
//TIME POS FINISHED

//SPACE POS 
this.upds1 = this.velocity*this.timePos
this.upds2 = this.spaceValue - this.upds1;
this.spaceValue = this.gamma*this.upds2;


}

}





function setRed(){
scolor = "red"
}
function setGreen(){
scolor="green"
}
function setBlue(){
scolor="blue"

}