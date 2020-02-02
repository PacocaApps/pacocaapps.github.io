

// TEXT PROCESSING
function dam(content){
  

   
  
    
 

 
var r = content.toLowerCase() 
console.log(r)
var date = new Date();

var minute = Math.floor(date.getUTCMinutes()/10)*10
var minute2;
var hour = date.getUTCHours();
var hour2;

if(Math.floor(date.getUTCMinutes()/10)*10<30){
minute2 = minute + 30
hour2 = hour - 1
console.log(minute2+""+hour2)
}else{
    minute2 = minute - 30
    hour2 = hour
    console.log(minute2+""+hour2)
}

var utcdate = date.getFullYear()+""+date.getMonth()+1+""+date.getDate()+""+hour2+""+minute2+""+19
if(r.includes("alfa")){
     voice.speak("Acessando Rede Satcom")

  
 
   if(r.includes("goes-16")){
 
 
    if(r.includes("rgb")){

    window.open("https://rammb-slider.cira.colostate.edu/?sat=goes-16&z=1&im=12&ts=1&st=0&et=0&speed=130&motion=loop&map=0&lat=0&opacity%5B0%5D=1&hidden%5B0%5D=0&pause="+utcdate+"&slider=-1&hide_controls=0&mouse_draw=0&follow_feature=0&follow_hide=0&s=rammb-slider&sec=full_disk&p%5B0%5D=geocolor&x=12600&y=13680")
    output.textContent = "Getting Sat Imagery GOES-16 FULL COLOR R G B NIR CHANNELS INTEGRATED Current time st:"+date.getUTCHours()+""+Math.floor(date.getUTCMinutes()/10)*10-30
}else if(r.includes("umidade")){
    window.open("https://rammb-slider.cira.colostate.edu/?sat=goes-16&z=1&im=12&ts=1&st=0&et=0&speed=130&motion=loop&map=1&lat=0&opacity%5B0%5D=1&hidden%5B0%5D=0&pause="+utcdate+"&slider=-1&hide_controls=0&mouse_draw=0&follow_feature=0&follow_hide=0&s=rammb-slider&sec=full_disk&p%5B0%5D=band_08&x=12600&y=13680")
}
    console.log(utcdate)






}else if(r.includes("goes-17")){

}















}else if(r.includes("bravo")){

   if(r.includes("orion")){
       window.open("https://drive.google.com/file/d/1NCOFdJNDl3_RpP9qTpztuE8xpy7_ZfmN/view")
   }else{
alert("WRONG PASSWORD")
window.close();

   }

}
else if(r.includes("buscar") || r.includes("busca") || r.includes("procurar") || r.includes("pesquisar")  ){
    var n;
    var b;
    if(r.includes("por")){ n = r.indexOf("por"); b = 3;}else{
     n = r.indexOf("buscar"); b = 6;}
   
     var str = r.slice(n+b)
    voice.speak("Executando busca por "+str)
   window.open("https://www.google.com/search?q="+str+"&oq="+str+"&aqs=chrome..69i57j0l7.2094j0j9&sourceid=chrome&ie=UTF-8")
    

}
else if(r.includes("ômega") || r.includes("omega")){
var n = r.indexOf("omega");
var str = r.slice(n+5);
voice.speak("Entrando nos servidores W.A por "+str)

window.open("https://www.wolframalpha.com/input/?i="+str)

}
else if(r.includes("mapa estelar")){
    voice.speak("Pronto")
   window.open("https://www.visualcapitalist.com/wp-content/uploads/2019/07/star-map-full-res.html")

}
else if(r.includes("coronavírus")){
    voice.speak("Pronto")
   window.open("https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6")

}
else if(r.includes("corona")){
    voice.speak("Pronto")

    window.open("https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6")

}
else if(r.includes("")){

   

}
else if(r ==="order theta"){




}else if(r === "shutdown"){
console.log("System Shutting Down")
  

}else{
// console.log("srr didint understand")
dam()
start();
}






   

}






















    



