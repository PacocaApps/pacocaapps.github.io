const config = {
    binaryThresh: 0.5, // ¯\_(ツ)_/¯
    hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid' // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh']
  };
  function start(){
  }
  var net;
function train(){
  // create a simple feed forward neural network with backpropagation

   net = new brain.NeuralNetwork(config);

  net.train([{
      input: [0, 0],
      output: [0]
    },
    {
      input: [0, 1],
      output: [1]
    },
    {
      input: [1, 0],
      output: [1]
    },
    {
      input: [1, 1],
      output: [0]
    }
  ]);
}
var textt;
function blaccked(){

    var elemento = document.getElementById('data');
var elemento2 = document.getElementById('data2');
textt = document.getElementById("text")
runetwork(elemento.value,elemento2.value);

}


  function runetwork(x,y){
  var output = net.run([x, y]); // [0.987]
  console.log(output)
  textt.innerHTML = "Result: "+output
  }