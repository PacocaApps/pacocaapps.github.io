
var life = []
var initialcellcount = 6;

function setup(){
createCanvas(windowWidth,windowHeight)


for(let i = 0;i < initialcellcount;i++){
life.push(new Cell())

}

}

function draw(){
    background(0)

for(var i =0;i < life.length;i++){
    life[i].calculate();
    life[i].display();

if(life[i].x>width){
    life[i].x = 2
}
if(life[i].x<1){
    life[i].x = width-1
}if(life[i].y>height){
    life[i].y = 2
}
if(life[i].y<1){
    life[i].y = height-1
}
   if(life[i].energy < 0){
       
       life.splice(i,1)
       
     
   }

}

}