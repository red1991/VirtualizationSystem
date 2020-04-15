/**
 * Processo di elaborazione relativo alla creazione di un pool di macchine virtuali.
 *
 * @author: Riccardo Rossi <red.riccardo.91@gmail.com>
 */
 
$.ajax({
type: "GET",
url: "https://192.168.1.70/idVm.php",             
success: function(response){
idVm = response;
detail(idVm);
},
error: function(){
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
});

/**
 * Funzione che visualizza a schermo le informazioni della macchina virtuale su cui eseguire il pool.
 *
 * @this {elaborazionePool}
 * @param {int} idVm - Identificativo univoco della macchina virtuale.
 */
function detail(idVm) {
$.ajax({
type: "POST",
url: "https://192.168.1.70/getVmApi.php",
data: "idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
var dec = JSON.parse(response);
document.getElementById("nameVm").innerHTML = "Macchina Virtuale: " + dec.name;
var campoVm = document.getElementById("campoVm");
campoVm.innerHTML = "<b>Informazioni</b><hr><br>Nome macchina: <i>" + dec.name + "</i>" + 
"<br><br> Descrizione macchina: <i>" + dec.description + "</i>" +
"<br><br> Identificativo macchina: <i>" + dec.id + "</i>" +
"<br><br><br><b>Caratteristiche</b><hr><br> Memoria: <i>" + dec.memory + " Bytes</i>" +
"<br><br><br><b>Sistema Operativo</b><hr><br> Sistema Operativo: <i>" + dec.os.type + "</i>" +
"<br><br> Tipo: <i>" + dec.type + "</i>" +
"<br><br> Architettura: <i>" + dec.cpu.architecture + "</i>" + 
"<br><br><br><b>Pools</b><hr><br>" +	
"<div class='row'><div class='col-25'><label>Nome</label></div><div class='col-25'><input id='textNome' type='text' placeholder='Nome Pools...'></div></div>"+		
"<div class='row'><div class='col-25'><label>Descrizione</label></div><div class='col-25'><input id='textDescrizione' type='text' placeholder='Descrizione Pools...'></div></div>"+						
"<div class='row'><div class='col-25'><label>Numero di Macchine Virtuali</label></div><div class='col-25'><input id='textNumero' type='text' placeholder='Numero Macchine Virtuali...'></div></div>"+		
"<br><br><b>Operazioni Disponibili</b><hr>";
},
error: function()
{
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
}); 
}

/**
 * Funzione che avvia il processo di deploy della macchina virtuale.
 *
 */
function submitDeploy() {
$.ajax({
type: "GET",
url: "https://192.168.1.70/idVm.php",             
success: function(response){
idVm = response;
deploy(idVm);
},
error: function(){
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
});
}

/**
 * Funzione che riceve i dati inseriti dall'utente contenenti le caratteristiche del pool da creare.
 *
 * @param {int} idVm - Identificativo univoco della macchina virtuale
 */
function deploy(idVm) {
var textNome = $("#textNome").val();
var textDescrizione = $("#textDescrizione").val();
var textNumero = $("#textNumero").val();

/**
 * Crea un oggetto Pool a partire dai parametri passati.
 *
 * @param {string} textNome - Nome del pool.
 * @param {string} textDescrizione - Descrizione del pool.
 * @param {int} textNumero - Numero di macchine virtuali del pool.
 */
var pool = new Pool(textNome, textDescrizione, textNumero);

var errore = "";
var send = true;

if(pool.textNome == "" || pool.textDescrizione == "" || pool.textNumero == ""){
document.getElementById("textLog").style.cssText = "color:red;"
errore = errore + " Ci sono campi vuoti!<br>";
send = false;
}

if(isNaN(pool.textNumero)){
document.getElementById("textLog").style.cssText = "color:red;"
errore = errore + " Campo non numerico!<br>";
send = false;
}

if(!(pool.textNumero >= 2 && pool.textNumero <= 5)){
document.getElementById("textLog").style.cssText = "color:red;"
errore = errore + " Numero macchine tra 2 e 5! <br>";
send = false;
}

document.getElementById("textLog").innerHTML = errore;
	
if(send){
$.ajax({
type: "POST",
url: "https://192.168.1.70/getVmApi.php",
data: "idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
var dec = JSON.parse(response);
var nomeVm = dec.name;
createTemplate(nomeVm, idVm, pool.textNumero, pool.textNome, pool.textDescrizione);
},
error: function()
{
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
}); 
}
}

/**
 * Funzione che avvia la creazione del template della macchina virtuale della quale si vuole eseguire il pool.
 *
 * @param {string} nomeVm - Nome della macchina virtuale.
 * @param {int} idVm - Identificativo univoco della macchina virtuale.
 * @param {int} textNumero - Numero di macchine virtuali del pool.
 * @param {string} textNome - Nome del pool.
 * @param {string} textDescrizione - Descrizione del pool.
 */
function createTemplate(nomeVm, idVm, textNumero, textNome, textDescrizione) {
$.ajax({
type: "POST",
url: "https://192.168.1.70/createTemplate.php",
data: "nomeVm=" + textNome + "&idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
var log = "";
var dec = JSON.parse(response);
var stato = dec.detail;
      	
if(stato == undefined) {
document.getElementById("submitDeploy").disabled = true;
logInit = "<-- Inizializzazione -->";
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logInit;
var createTemplateTimer = setInterval(function() { waitTemplate(idVm, dec,logInit,createTemplateTimer, textNumero, textNome, textDescrizione); }, 3000); 		
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

/**
 * Funzione che controlla se il template è stato creato (stato "down").
 *
 * @param {int} idVm - Identificativo univoco della macchina virtuale.
 * @param {Json} dec - Json contenente la risposta di oVirt.
 * @param {string} logInit - Messaggio di log.
 * @param {double} createTemplateTimer - Timer elaborazione.
 * @param {int} textNumero - Numero di macchine virtuali del pool.
 * @param {string} textNome - Nome del pool.
 * @param {string} textDescrizione - Descrizione del pool.
 */
function waitTemplate(idVm,dec,logInit,createTemplateTimer, textNumero, textNome, textDescrizione) {
var logCreate = "Creazione Template in corso..." + "<br>" + logInit;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logCreate;       
                  
$.ajax({
type: "POST",
url: "https://192.168.1.70/getVmApi.php",
data: "idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
var decVm = JSON.parse(response);
    	   
if(decVm.status == "down"){
var logCreateSuccess = "Template creato con successo." + "<br>" + logCreate;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logCreateSuccess;
clearInterval(createTemplateTimer); 
setTimeout(function(){ createPools(dec,logCreateSuccess, textNumero, textNome, textDescrizione); }, 10000);
}
},
error: function()
{
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
}); 
}

/**
 * Funzione che avvia la creazione del pool della macchina virtuale a partire dal template creato.
 *
 * @param {Json} dec - Json contenente la risposta di oVirt.
 * @param {string} logCreateSuccess - Messaggio di log.
 * @param {int} textNumero - Numero di macchine virtuali del pool.
 * @param {string} textNome - Nome del pool.
 * @param {string} textDescrizione - Descrizione del pool.
 */
function createPools(dec,logCreateSuccess, textNumero, textNome, textDescrizione) {
var idTemplate = dec.id;
var logCreatePools = "<-- Inizio creazione Pools..." + "<br>" + logCreateSuccess;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logCreatePools;       
                  
$.ajax({
type: "POST",
url: "https://192.168.1.70/createPools.php",
data: "idTemplate=" + idTemplate + "&nomeVm=" + textNome + "&numeroPools=" + textNumero + "&textDescrizione=" + textDescrizione,
dataType: "html",
      
success: function(response)
{
setTimeout(function(){ createSuccessPools(logCreatePools); }, 30000);
},
error: function()
{
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Chiamata Fallita! Riprovare!";
}
}); 
}

/**
 * Funzione di pool creato con successo.
 *
 * @param {string} logCreatePools - Messaggio di log.
 */
function createSuccessPools(logCreatePools) {
var logCreateSuccessPools = "Pools creato con successo" + "<br>" + logCreatePools;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logCreateSuccessPools; 
setTimeout(function(){ finish(logCreateSuccessPools); }, 30000);
}

/**
 * Funzione di operazione completata con successo .
 *
 * @param {string} logCreateSuccessPools - Messaggio di log.
 */
function finish(logCreateSuccessPools) {
var logFinish = "<-- Operazione completata con successo -->" + "<br>" + logCreateSuccessPools;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logFinish; 
setTimeout(function(){ completeCreateDeploy(); }, 2000);
}

/**
 * Funzione con redirect alla home a seguito di una operazione eseguita con successo.
 *
 */
function completeCreateDeploy() {
window.location.href = 'https://192.168.1.70/interface.html';
}
