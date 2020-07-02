// THIS IS A FIRST GENERATION 10BITS IFF PROCESSOR


var IFF = [["0000000001",512,"origin"],["1000000001",513,"Home"]]


function unicode(text){

    document.body.innerHTML = document.body.innerHTML+text

}

//DECIMAL IFF TEXT INTERPRETER AND PRINTER
function typed(dec){

    switch (dec) {
        case 512:
            var text = "    <svg preserveAspectRatio='none' height='50' width='350px' style='width: 50px;' viewBox='0 0 150 200'><line stroke-linecap='undefined' stroke-linejoin='undefined' id='svg_1' y2='66.257171' x2='31.000065' y1='6.257187' x1='30.857222' stroke-width='12' stroke='#000' fill='none'/><line stroke-linecap='undefined' stroke-linejoin='undefined' id='svg_2' y2='193.114278' x2='31.000065' y1='133.114294' x1='31.000065' stroke-width='12' stroke='#000' fill='none'/><ellipse ry='17.142851' rx='17.142851' id='svg_3' cy='99.285733' cx='31.857201' fill-opacity='null' stroke-opacity='null' stroke-width='12' stroke='#000' fill='none'/></svg>"

            document.body.innerHTML = document.body.innerHTML+text
            
          break;
        case 513:
            var text =  '<svg preserveAspectRatio="none" height="50" width="350px" style="width: 50px;" viewBox="0 0 150 200"> <line stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_3" y2="49.516056" x2="73.688684" y1="194.516056" x1="10.188684" stroke-width="6" stroke="#000" fill="none"/><line stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_5" y2="194.566044" x2="133.4445" y1="50.031177" x1="73.444494" stroke-width="10" stroke="#000" fill="none"/><ellipse ry="12.093024" rx="11.860466" id="svg_7" cy="23.984663" cx="74.607285" fill-opacity="null" stroke-opacity="null" stroke-width="10" stroke="#000" fill="none"/> <line stroke-linecap="null" stroke-linejoin="null" id="svg_8" y2="193.846866" x2="123.478951" y1="192.916633" x1="140.688255" fill-opacity="null" stroke-opacity="null" stroke-width="7" stroke="#000" fill="none"/> <line stroke-linecap="null" stroke-linejoin="null" id="svg_9" y2="194.768485" x2="17.863095" y1="194.768485" x1="2.583162" fill-opacity="null" stroke-opacity="null" stroke-width="5" stroke="#000" fill="none"/><path id="svg_10" d="m201.111038,156.888824" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="5" stroke="#000" fill="none"/><ellipse ry="3.666665" rx="2.222221" id="svg_11" cy="52.01042" cx="74.410826" fill-opacity="null" stroke-opacity="null" stroke-width="5" stroke="#000" fill="none"/></svg>'
            document.body.innerHTML = document.body.innerHTML+text
        
          break;
        case 514:
            var text = 'Abydos'
              document.body.innerHTML = document.body.innerHTML+text
        
            break;
        default:
       
    document.body.innerHTML = document.body.innerHTML+dec

      }
      

}