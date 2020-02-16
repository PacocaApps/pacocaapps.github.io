
var particles = [];
var n = -1;


// COSNERVATION OF MOMENTUM
function setup(){
createCanvas(windowWidth,windowHeight)




}

function mouseClicked() { 
console.log("click")
n = n +1 ;
particles.push(new Particle(mouseX,mouseY,random(10000000,4*10000000),n))

} 
function draw(){
background(0)
for(let i = 0; i < particles.length;i++){
    particles[i].display();
}

}

// PARTICLE

class Particle{
constructor(x,y,mass,n){
    this.index = n;
this.x = x;
this.y = y;
this.mass = mass;
this.forcemodule = 0;
this.vi = 10;
this.px = this.mass;
this.py = this.mass;
this.oldvx = 1;
this.oldvy = 1;
}
display(){
fill(255,0,0)
 ellipse(this.x,this.y,this.mass/500000)
var d;
var G = 6.67408*Math.pow(10,-11);
// PHYSICS 
for(let i = 0; i < particles.length;i++)
{
    if(this.index === i){

    }else{
var dx = this.x - particles[i].x;
var dy = this.y - particles[i].y;
var dx2 = Math.pow(dx,2);
var dy2 = Math.pow(dy,2);
var sub = dx2 + dy2;
d = Math.sqrt(sub);
this.forcemodule = G*this.mass*particles[i].mass/Math.pow(d,2)



let x1 = +10000000
let y1 = this.y*100;

let x2 = particles[i].x*100;
let y2 = particles[i].y*100;

//Get Angle 

let m1 = x1*x2;
let m2 = y1*y2;

let sqr1 = Math.sqrt(Math.pow(x1,2)+Math.pow(y1,2));
let sqr2 = Math.sqrt(Math.pow(x2,2)+Math.pow(y2,2));

let div = sqr1*sqr2;
let add = m1 + m2;
let cost = add/div
let angle = Math.acos(cost)



//Amount of Movement
let ddx = 1;
let ddy = 1;
if(this.x > particles[i].x){
  ddx = -1;
    
console.log(this.velocityx)
}else{
ddx = 1;
}

if(this.y > particles[i].y){
    ddy = -1;
}else{
   ddy = 1;
}


let test = 1;
let sf = Math.sin(angle);
let cf = Math.cos(angle);

let fy = sf*this.forcemodule*ddy;
let fx = cf*this.forcemodule*ddx;

// this.velocityx = fx/this.mass*10000000 + 10//+ this.vi
// this.velocityy = fy/this.mass*10000000  + 10//+ this.vi



this.velocityx =  fx/this.mass*10000000 //+ this.vi
this.velocityy =  fy/this.mass*10000000 //+ this.vi

this.vx = this.oldvx + this.velocityx;
this.vy = this.oldvy + this.velocityy;

this.oldvx = this.vx;
this.oldvy = this.vy;

this.x = this.x + this.vx;
this.y = this.y + this.vy;













    }


}








}
 

}