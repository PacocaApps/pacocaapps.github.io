const startBtn = document.querySelector('#start');
const input = document.querySelector('#input');
var voice;
var rec;




function setup(){
noCanvas();
voice = new p5.Speech()
var continous = true;
var interim = true;
var onEnd = restart;

rec = new p5.SpeechRec("pt-BR",receiveText,onEnd);





}
function start(){
    rec.start(continous,interim,onEnd);



}
function receiveText(){


if(rec.resultString.includes("Norma")||rec.resultString.includes("norma"))
{

console.log(rec.resultString)
dam(rec.resultString)
}
}



function restart(){
console.log("rec ended")
var continous = true;
var interim = true;
var onEnd = restart;

rec.start(continous,interim,onEnd);
}

