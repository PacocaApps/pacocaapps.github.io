// const config = {
//     binaryThresh: 0.5, 
//     hiddenLayers: [3], 
//     activation: 'relu' // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh']
//   };
//   function start(){
//   }
//   var net;


// function train(){
 
//    net = new brain.recurrent.LSTMTimeStep({
//     inputSize: 2,
//     hiddenLayers: [10],
//     outputSize: 2,
//   })
  
//   net.train([
//     [1, 3],
//     [2, 2],
//     [3, 1],
//   ])
  


// }
// var textt;
// function blaccked(){

//     var elemento = document.getElementById('data');
// var elemento2 = document.getElementById('data2');
// textt = document.getElementById("text")
// runetwork(elemento.value,elemento2.value);

// }


//   function runetwork(x,y){
//   var output = net.run([x, y]); // [0.987]
//   console.log(output)
//   textt.innerHTML = "Result: "+output
//   }

const trainingData = [
  'Jane saw Doug.',
  'Spot saw himself.',
  'Doug saw Jane.'
];

const lstm = new brain.recurrent.LSTM();
const result = lstm.train(trainingData, { iterations: 1000 });
const run1 = lstm.run('Jane');
const run2 = lstm.run('Spot');
const run3 = lstm.run('Doug');

console.log('run 1: Jane' + run1);
console.log('run 2: Spot' + run2);
console.log('run 3: Doug' + run3);