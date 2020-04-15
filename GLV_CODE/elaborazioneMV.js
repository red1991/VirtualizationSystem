/**
 * Processo di elaborazione relativo alla creazione di una nuova macchina virtuale.
 *
 * @author: Riccardo Rossi <red.riccardo.91@gmail.com>
 */
 
/**
 * Funzione che consente di scegliere il programma da installare sulla macchina virtuale.
 *
 */
function selectProgrammi(){
var templateSelezionato = document.formAddVm.selectTemplate.selectedIndex;
var campo = document.formAddVm.selectTemplate.options;
var template = campo[templateSelezionato].text;
if(template == "CentOS-7-x86_64-DVD-1804"){
document.getElementById("checkCB").checked = false;
document.getElementById("checkLO").checked = false;
document.getElementById("checkCB").disabled = false;
document.getElementById("checkLO").disabled = false;
document.getElementById("textNomeHost").disabled = false;
}
else if (template == "Ubuntu-16.04.4-desktop-amd64") {
document.getElementById("checkCB").disabled = true;
document.getElementById("checkLO").disabled = true;
document.getElementById("checkCB").disabled = true;
document.getElementById("checkLO").disabled = true;
document.getElementById("textNomeHost").disabled = true;
}
}

$.ajax({
type: "GET",
url: "https://192.168.1.70/getTemplatesApi.php",             
success: function(response){
var dec = JSON.parse(response); 			
var key, count = 0;
for(key in dec.template) {
if(dec.template.hasOwnProperty(key)) {
count++;
}
}
for(var i = 0; i < count; i++){
var selectTemplate = document.formAddVm.selectTemplate;
if (dec.template[i].name == "CentOS-7-x86_64-DVD-1804" || dec.template[i].name == "Ubuntu-16.04.4-desktop-amd64") {
var option = document.createElement("option");
option.text = dec.template[i].name;
option.value = i;
selectTemplate.add(option);
}				
}
},
error: function(){
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
});

$("#submitCreate").click(function(){	
var templateSelezionato = document.formAddVm.selectTemplate.selectedIndex;
var campo = document.formAddVm.selectTemplate.options;
var template = campo[templateSelezionato].text;
var nome = $("#textNome").val();
var descrizione = $("#textDescrizione").val();
var dimensioneRam = $("#textDimensioneRam").val();
var nomeHost = $("#textNomeHost").val();
var checkedCB = document.getElementById("checkCB").checked;
var checkedLO = document.getElementById("checkLO").checked; 

/**
 * Crea un oggetto MV dai parametri passati.
 *
 * @param {string} nome - Nome della macchina virtuale.
 * @param {string} descrizione - Descrizione della macchina virtuale.
 * @param {int} dimensioneRam - Dimensione della memoria RAM.
 * @param {string} nomeHost - Hostname della macchina virtuale.
 * @param {boolean} checkedCB - Checkbox CodeBlocks.
 * @param {boolean} checkedLO - Checkbox LibreOffice.
 */
var mv = new MV(nome, descrizione, dimensioneRam, nomeHost, checkedCB, checkedLO);

/**
 * Crea un oggetto Template a partire dai parametri passati.
 *
 * @param {string} template - Nome del template.
 */
var tmp = new Template(template);

var errore = "";
var send = true;

if(mv.nome == "" || mv.descrizione == "" || mv.dimensioneRam == ""){
document.getElementById("textLog").style.cssText = "color:red;"
errore = errore + " Ci sono campi vuoti!<br>";
send = false;
}

if(!(mv.dimensioneRam >= 2 && mv.dimensioneRam <= 4)){
document.getElementById("textLog").style.cssText = "color:red;"
errore = errore + " Dimensione ram tra 2 e 4 GB!<br>";
send = false;
}

if(isNaN(mv.dimensioneRam)){
document.getElementById("textLog").style.cssText = "color:red;"
errore = errore + " Dimensione ram non numerica!<br>";
send = false;
}

document.getElementById("textLog").innerHTML = errore;

if(send){
$.ajax({
type: "POST",
url: "https://192.168.1.70/addVm.php",
data: "nome=" + mv.nome + "&descrizione=" + mv.descrizione + "&dimensioneRam=" + mv.dimensioneRam + "&template=" + tmp.template,
dataType: "html",  
success: function(response)
{
var log = "";
var dec = JSON.parse(response);
var stato = dec.detail;
if(stato == "[Cannot add VM. The VM name is already in use, please choose a unique name and try again.]"){
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Nome già in uso!";
}
else if(stato == "[Cannot add VM. Unknown Data Center status.]") {
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Data Center non riconosciuto!";
}
else if(stato == "[Can not add VM. The given name contains special characters. Only lower-case and upper-case letters, numbers, '_', '-', '.' are allowed., Attribute: vmStatic.name]") {
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Caratteri non consentiti! ";
}
else if(stato == "For correct usage, see: https://192.168.1.70/ovirt-engine/apidoc#services/vms/methods/add") {
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Si è verificato un errore. Riprovare!";
}
else if(stato == undefined) {
document.getElementById("submitCreate").disabled = true;
logInit = "<-- Inizializzazione -->";
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logInit; 
var createVmTimer = setInterval(function() { createVm(dec,logInit, createVmTimer); }, 3000); 		
}
else {
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = stato;
}    	   	
},
error: function()
{
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
});   
}

/*
 * Funzione che controlla il processo di creazione di una nuova macchina virtuale.
 *
 * @param {Json} dec - Json contenente la risposta di oVirt.
 * @param {string} logInit - Messaggio di log.
 * @param {double} createVmTimer - Timer elaborazione.
 */
function createVm(dec,logInit, createVmTimer){
var logCreate = "Creazione macchina virtuale in corso..." + "<br>" + logInit;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logCreate;                
var idVm = dec.id;  
     
$.ajax({
type: "POST",
url: "https://192.168.1.70/getVmApi.php",
data: "idVm=" + idVm,
dataType: "html",
success: function(response)
{
var dec = JSON.parse(response);	   
if(dec.status == "down"){
var logCreateSuccess = "Macchina creata con successo." + "<br>" + logCreate;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logCreateSuccess;
clearInterval(createVmTimer);
if (template == "Ubuntu-16.04.4-desktop-amd64"){
setTimeout(function(){ completeCreateVm(dec,logCreateSuccess); }, 10000); 
}
else {
setTimeout(function(){ runInit(dec,logCreateSuccess); }, 10000); 
} 
}
},
error: function()
{
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
}); 
}

/*
 * Funzione che controlla il processo di lancio di una macchina virtuale.
 *
 * @param {Json} dec - Json contenente la risposta di oVirt.
 * @param {string} logCreateSuccess - Messaggio di log.
 */
function runInit(dec,logCreateSuccess) {
var logRunInit = "<-- Macchina in attesa di lancio..." + "<br>" + logCreateSuccess;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logRunInit;
var idVm = dec.id; 
      
$.ajax({
type: "POST",
url: "https://192.168.1.70/runVmFirstTime.php",
data: "idVm=" + idVm + "&nomeHost=" + nomeHost + "&checkedCB=" + checkedCB + "&checkedLO=" + checkedLO + "&template=" + template,
dataType: "html",    
success: function(response)
{
var createAccensioneTimer = setInterval(function() { createAccensione(dec,logRunInit,createAccensioneTimer); }, 8000);
},
error: function()
{
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
});      	 
}

/*
 * Funzione che controlla il processo di accensione di una nuova macchina virtuale (stato "powering_up").
 *
 * @param {Json} dec - Json contenente la risposta di oVirt.
 * @param {string} logRunInit - Messaggio di log.
 * @param {double} createAccensioneTimer - Timer elaborazione.
 */
function createAccensione(dec,logRunInit,createAccensioneTimer) {
var idVm = dec.id;     
$.ajax({
type: "POST",
url: "https://192.168.1.70/getVmApi.php",
data: "idVm=" + idVm,
dataType: "html",   
success: function(response)
{
var dec = JSON.parse(response);  	   
if(dec.status == "powering_up"){
var logAccensioneSuccess = "Macchina in accensione..." + "<br>" + logRunInit;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logAccensioneSuccess;
clearInterval(createAccensioneTimer);
var UpVmTimer = setInterval(function() { UpVm(dec,logAccensioneSuccess, UpVmTimer); }, 7000); 
}
},
error: function()
{
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
}); 
}

/*
 * Funzione che controlla se la macchina virtuale è accesa (stato "up").
 *
 * @param {Json} dec - Json contenente la risposta di oVirt.
 * @param {string} logAccensioneSuccess - Messaggio di log.
 * @param {double} UpVmTimer - Timer elaborazione.
 */
function UpVm(dec,logAccensioneSuccess, UpVmTimer) {
var idVm = dec.id; 
      
$.ajax({
type: "POST",
url: "https://192.168.1.70/getVmApi.php",
data: "idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
var dec = JSON.parse(response);  	   
if(dec.status == "up"){
var logUpSuccess = "Accensione avvenuta con successo." + "<br>" + logAccensioneSuccess;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logUpSuccess;
clearInterval(UpVmTimer);
setTimeout(function(){ pesonalizzazione(dec,logUpSuccess); }, 10000);
}
},
error: function()
{
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
}); 
}

/*
 * Funzione di personalizzazione della macchina virtuale.
 *
 * @param {Json} dec - Json contenente la risposta di oVirt.
 * @param {string} logUpSuccess - Messaggio di log.
 */
function pesonalizzazione(dec,logUpSuccess) {
var logCustomWait = "<-- Operazioni di personalizzazione in corso..." + "<br>" + logUpSuccess;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logCustomWait;
setTimeout(function(){ waitCustom(dec,logCustomWait); }, 600000);
}

/*
 * Funzione di personalizzazione avvenuta.
 *
 * @param {Json} dec - Json contenente la risposta di oVirt.
 * @param {string} logCustomWait - Messaggio di log.
 */
function waitCustom(dec,logCustomWait) {
var logSuccessCustom = "Personalizzazione completata." + "<br>" + logCustomWait;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logSuccessCustom;
setTimeout(function(){ stopVm(dec,logSuccessCustom); }, 10000);
}

/*
 * Funzione che controlla il processo di arresto di una macchina virtuale.
 *
 * @param {Json} dec - Json contenente la risposta di oVirt.
 * @param {string} logSuccessCustom - Messaggio di log.
 */   	
function stopVm(dec,logSuccessCustom) {
var logArresto = "<-- Arresto macchina virtuale..." + "<br>" + logSuccessCustom;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logArresto;    	
var idVm = dec.id;   
$.ajax({
type: "POST",
url: "https://192.168.1.70/stopVm.php",
data: "idVm=" + idVm,
dataType: "html",
success: function(response)
{
var stopTimer = setInterval(function() { waitStop(dec,logArresto,stopTimer); }, 5000);
},
error: function()
{
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
}); 
}

/*
 * Funzione che controlla se la macchina virtuale è stata arrestata (stato "down")
 *
 * @param {Json} dec - Json contenente la risposta di oVirt.
 * @param {string} logArresto - Messaggio di log.
 * @param {double} stopTimer - Timer elaborazione.
 */
function waitStop(dec,logArresto,stopTimer) {
var idVm = dec.id; 
      
$.ajax({
type: "POST",
url: "https://192.168.1.70/getVmApi.php",
data: "idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
var dec = JSON.parse(response);  	   
if(dec.status == "down" || dec.status == "powering_down"){
var logStopSuccess = "Macchina arrestata con successo." + "<br>" + logArresto;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logStopSuccess;
clearInterval(stopTimer);
setTimeout(function(){ completeCreateVm(dec,logStopSuccess); }, 10000);
}
},
error: function()
{
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
}); 
}

/*
 * Funzione con redirect alla home (operazione completata)
 *
 * @param {Json} dec - Json contenente la risposta di oVirt.
 * @param {string} logStopSuccess - Messaggio di log.
 */
function completeCreateVm(dec,logStopSuccess) {
var logCompleteSuccess = "<-- Operazione completata con successo -->" + "<br>" + logStopSuccess;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logCompleteSuccess;
setTimeout(function(){ window.location.href = 'https://192.168.1.70/interface.html'; }, 5000);
}
});
