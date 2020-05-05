
var y;
var y2;
var y3;

var x1;
var x2;
var x3;

function setup(){
createCanvas(windowWidth,windowHeight)
}




function draw(){
stroke(0)
background(255)
for(var i = 0;i < 100;i++){
line(0,i*height/40,width,i*height/40)
line(i*height/40,0,i*height/40,height)
}

noStroke();




for(var step = -1000;step < 1000;step++)
{

     x1 = step/100


    var n = x1
    
    var z1 = 5 + Math.sqrt(5)
    var z2 = 5 - Math.sqrt(5)
    var w1 = z1/10
    var w2 = z2/10
    var term11 = 1 +  Math.sqrt(5)
    var two = 2
    var term1 = Math.pow(term11/two,n);
    var xterm = w1*term1
    
    var term22 = 1 - Math.sqrt(5)
    var term2 = Math.pow(term22/two,n)
    var yterm = w2*term2
    
    var sol = xterm + yterm
    
    


y1 = Math.pow(x1,x1);


   
 fill(255,0,0)

 var sx = x1 + 95;
 var sy = y1 + 40
    ellipse(sx*10,height-sy*10,10)
}

for(var step = -1000;step < 1000;step++)
{
     x2 = step/10
   y2 = 0
 fill(0,0,255)

 var sx = x2 + 95;
 var sy = y2 + 40
 ellipse(sx*10,height-sy*10,5)
}

for(var step = -1000;step < 1000;step++)
{
   x3 = step/10
   y3 = -sin(x3)*13
 fill(0,255,0)

 var sx = x3 + 95;
 var sy = y3 + 40
  //  ellipse(sx*10,height-sy*10,5)
}

}


function define(fn){
//y = fn;

}