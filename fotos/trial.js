
var correct = 0;

function un(){
correct= 1;
}

function inf(){
if(correct === 1){
alert("Welcome")
var password = prompt("Password")

var pass = httpGet('https://mainserver69.herokuapp.com')


if(password === pass){
window.open("https://pacocaapps.github.io/Control69/control.html")
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

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

