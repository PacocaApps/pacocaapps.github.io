var grid = [];
var xoff = 1;
var level;
function setup(){
createCanvas(windowWidth,windowHeight)
level = random(50,110)
makeGrid(100,15)
}
function draw(){
background(100)



for(var i = 0; i < grid.length;i++){
    for(var j = 0;j < grid[i].length;j++){
        grid[i][j].display();
             
   }
}

}
















// grid
class Cell{
  constructor(cx,cy,size){
  this.cx = cx;
  this.cy = cy;
  this.size = size;
  this.scope = 10;
  this.sscope = this.scope/2

  }
  display(){
noStroke()
    if (keyIsDown(DOWN_ARROW)) {
       this.scope = this.scope -1
      }
      if (keyIsDown(UP_ARROW)) {
        this.scope = this.scope +1
       }
       if (keyIsDown(RIGHT_ARROW)) {
        xoff = xoff + 0.0001
       }
       if (keyIsDown(LEFT_ARROW)) {
        xoff = xoff - 0.0001
       }
//this.sscope = this.scope/2
this.offsetx = this.cx + xoff



          var enoise = noise(this.offsetx/this.scope,this.cy/this.scope)
          var tnoise = noise(this.offsetx/this.sscope,this.cy/this.sscope)
          var rnoise = enoise + tnoise/10
if(rnoise*150 < level){
    fill(0,0,rnoise*500)
}else if(rnoise*150 > level && rnoise*150 < level + 5){
    fill(rnoise*500,rnoise*500,0)
}else{
      fill(0,rnoise*150,0)}
   rect(this.cx*this.size,this.cy*this.size,this.size,this.size)

  }


}

function makeGrid(size,cellsize){

for(var i = 0;i < size;i++){
    grid[i] = []
    for(var j = 0;j < size;j++){
         
         grid[i][j] = new Cell(i,j,cellsize)
              
    }
}

}