//1 gatherer
//2 solar
//3 predator
//4 chem


class Cell{

    constructor(x,y,abtype,velocity,adhesion,strength){
        this.x = x;
        this.y = y
        this.velocity = velocity;
        this.strength = strength;
        this.abtype = abtype
        if(this.x === undefined){
            this.x = random(0,width-1)
        }if(this.y === undefined){
            this.y = random(0,height-1)
        }if(this.velocity === undefined){
            this.velocity = random(0,3)
        }if(this.strength === undefined){
            this.strength = random(0,5)
        }if(this.abtype === undefined){
            this.abtype = ceil(random(1,4))
        }




    
        this.adhesion = 10;
        


       this.energy = 40;


    }


  calculate(){
    this.energy = this.energy - 0.001*this.velocity*10



if(this.abtype ===  1){
    fill(140,170,50)

}if(this.abtype ===  2){
    fill(0,255,177)
this.energy = this.energy + this.x/6000
}

if(this.abtype ===  3){
    fill(200,30,70)
    this.strength = this.strength + 0.1
for(let i =0; i < life.length;i++){
var dx;
var dy;

if(this.x > life[i].x){
 dx = this.x - life[i].x
}else{
     dx = life[i].x - this.x 

}
if(this.y > life[i].y){
     dy = this.y - life[i].y
    }else{
         dy = life[i].y - this.y
    
    }
     var d = sqrt(Math.pow(dx,2)+Math.pow(dy,2))
   
if(d === 0){
   


}else if(d < 20){

    if(this.strength > life[i].strength){
        this.energy = this.energy + life[i].energy*2
        life[i].energy = -1;
    }else{
        if(life[i].abtype === 3){
        life[i].energy = life[i].energy + this.energy*2
        this.energy = -1
        }else{
            this.energy = -1
        }
    }

}


}

}
if(this.abtype ===  4){
    fill(0,255,177)

}



if(this.energy > 100){
    this.energy = 1;    
    life.push(new Cell(this.x,this.y,this.abtype,this.velocity+random(-2,2),this.adhesion))
}

this.x = this.x + this.velocity*random(-1,1)


this.y = this.y + this.velocity*random(-1,1)





  
  }
 display(){
     noStroke();
     
   ellipse(this.x,this.y,20)


 }

}