
var y;
var y2;
var y3;

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
    var x = step/10
   y = Math.pow(x,3)/1000
 fill(255,0,0)

 var sx = x + 95;
 var sy = y + 40
    ellipse(sx*10,height-sy*10,5)
}

for(var step = -1000;step < 1000;step++)
{
    var x = step/10
   y2 = 3*x*x/1000
 fill(0,0,255)

 var sx = x + 95;
 var sy = y2 + 40
    ellipse(sx*10,height-sy*10,5)
}

for(var step = -1000;step < 1000;step++)
{
    var x = step/10
   y3 = 6*x/1000
 fill(0,255,0)

 var sx = x + 95;
 var sy = y3 + 40
    ellipse(sx*10,height-sy*10,5)
}

}

