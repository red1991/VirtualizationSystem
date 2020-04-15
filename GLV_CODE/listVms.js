/**
 * Lista macchine virtuali presenti.
 *
 * @author: Riccardo Rossi <red.riccardo.91@gmail.com>
 */
 
$.ajax({
type: "GET",
url: "https://192.168.1.70/getVmsApi.php",             
success: function(response){
var dec = JSON.parse(response); 			
var key, count = 0;
for(key in dec.vm) {
if(dec.vm.hasOwnProperty(key)) {
count++;
}
}
for(var i = 0; i < count; i++){ 
var div = document.getElementById('campoVm');
var newBox = document.createElement("div");
newBox.setAttribute('id', i);
newBox.setAttribute('class', 'container');
div.appendChild(newBox);
					
var div1 = document.getElementById(i);
var newBox1 = document.createElement("div");
newBox1.setAttribute('id', i + "a");
newBox1.setAttribute('class', 'row');
div1.appendChild(newBox1);
					
var div2 = document.getElementById(i + "a");
var newBox2 = document.createElement("div");
newBox.setAttribute('id', i + "b");
newBox2.innerHTML = "<b>" + dec.vm[i].name + "</b><hr>" + 
"<br> Descrizione macchina: <i>" + dec.vm[i].description + "</i>" +
"<br><br> Sistema Operativo: <i>" + dec.vm[i].os.type + "</i><br><br><br><b>Operazioni Disponibili</b><hr><br>";
div2.appendChild(newBox2);	
					
var divB = document.getElementById(i + "b");
var newButton = document.createElement("BUTTON");
var text = document.createTextNode("Apri pannello Macchina Virtuale");
newButton.appendChild(text);
newButton.setAttribute('id', dec.vm[i].id);				
divB.appendChild(newButton);
					
var div3 = document.getElementById('campoVm');
var newBox3 = document.createElement("BR");
div3.appendChild(newBox3);
}
			      
for(var i = 0; i < count; i++){
var dec = JSON.parse(response);  
$('#'+dec.vm[i].id).click(function() {panelVM(this);});
}

/**
 * Funzione per visualizzare il pannello di gestione di una macchina virtuale
 *
 * @param {int} id - Identificativo univoco della macchina virtuale.
 */			
function panelVM(id) {	
var idVm = id.id;		
$.ajax({
type: "POST",
url: "https://192.168.1.70/sessionIdVm.php",
data: "idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
location.href="https://192.168.1.70/panelVm.html";
},
error: function()
{
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
});  
}
},
error: function(){
document.getElementById("textLog").style.cssText = "color:red;";
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
});
