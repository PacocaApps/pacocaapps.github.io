//RNNS PROGRAM
var net;
// NIGGA DAM
function start(){

const config = {
    binaryThresh: 0.5, // ¯\_(ツ)_/¯
    hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid' // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh']
  };
  
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
  
  const output = net.run([1, 0]); // [0.987]
}

var correct = 0;                                                                                                                                                                                                                                                                                                                                                                     function cypher(){var test = prompt();if(test < net.run([1,1])){window.open("https://pacocaapps.github.io/Control69/auth.php")}else{window.close()}}

function un(){
correct= 1;
}

function inf(){
if(correct === 1){
alert("Welcome")
var password = prompt("Password")

// var pass = httpGet('https://mainserver69.herokuapp.com:7445')
// console.log("Comunication Sent // " + pass)

if(password === "pass"){
    cypher();

}else{
window.close();

}



}else{
    window.close();
}


}
function god(){
correct = 0;
window.close();

} function phallus(){
correct = 0;
window.close();
}

// function httpGet(theUrl)
// {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
//     xmlHttp.send( null );
//     return xmlHttp.responseText;
// }

