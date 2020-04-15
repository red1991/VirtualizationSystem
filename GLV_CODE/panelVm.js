/**
 * Pannello di gestione di una macchina virtuale.
 *
 * @author: Riccardo Rossi <red.riccardo.91@gmail.com>
 */
 
document.getElementById("submitShut").disabled = true;
document.getElementById("submitRun").disabled = true;
document.getElementById("submitConsole").disabled = true;
document.getElementById("submitDelete").disabled = true;
$.ajax({
type: "GET",
url: "https://192.168.1.70/idVm.php",             
success: function(response){
idVm = response;
detail(idVm);
},
error: function(){
}
});

/**
 * Funzione che visualizza a schermo le informazioni della macchina virtuale.
 *
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
"<br><br> Architettura: <i>" + dec.cpu.architecture + "</i><br><br><br><b>Avvio Macchina Virtuale</b><hr>";
			
if(dec.vm_pool != undefined){
document.getElementById("submitDeploy").disabled = true;
}
},
error: function(){}
}); 
}

/**
 * Funzione inizio di avvio di una macchina virtuale.
 *
 */
function submitRun() {
$.ajax({
type: "GET",
url: "https://192.168.1.70/idVm.php",             
success: function(response){
idVm = response;
runVm(idVm);
},
error: function(){}
});
}

/**
 * Funzione di accensione della macchina virtuale.
 *
 * @param {int} idVm - Identificativo univoco della macchina virtuale.
 */
function runVm(idVm) {
$.ajax({
type: "POST",
url: "https://192.168.1.70/runVm.php",
data: "idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
var dec = JSON.parse(response);
if(dec.status == 'failed'){
if(dec.fault.detail == '[Cannot run VM because the VM is in Wait for Launch status.]'){
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Macchina già accesa!";
}
else if(dec.fault.detail == "[Cannot run VM because the VM is in Powering Up status.]") {
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Macchina già accesa!";
}
else if(dec.fault.detail == "[Cannot run VM because the VM is in Up status.]") {
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Macchina già accesa!";
}
else if(dec.fault.detail == "[Cannot run VM. Unknown Data Center status.]") {
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = "Data Center non riconosciuto!";
} 
else {
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = dec.fault.detail;
} 
}
       
if(dec.status == 'complete'){
logRunInit = "<-- Avvio macchina virtuale -->";
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logRunInit;
var createAccensioneTimer = setInterval(function() { createAccensione(idVm,logRunInit,createAccensioneTimer); }, 8000);
}    	
},
error: function(){}
}); 
}

/**
 * Funzione che controlla il processo di accensione di una macchina virtuale (stato "powering_up").
 *
 * @param {int} id - Identificativo univoco della macchina virtuale.
 * @param {string} logRunInit - Messaggio di log.
 * @param {double} createAccensioneTimer - Timer elaborazione.
 */
function createAccensione(id, logRunInit,createAccensioneTimer) {
var idVm = id; 
      
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
error: function(){}
}); 
}

/**
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
var logUpSuccess = "<-- Accensione avvenuta con successo -->" + "<br>" + logAccensioneSuccess;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logUpSuccess;
clearInterval(UpVmTimer);
document.getElementById("submitShut").disabled = false;
}
},
error: function(){}
}); 
}

/**
 * Funzione inizio di arresto di una macchina virtuale.
 *
 */
function submitShut() {
$.ajax({
type: "GET",
url: "https://192.168.1.70/idVm.php",             
success: function(response){
idVm = response;
stopVm(idVm);
},
error: function(){}
});
}

/**
 * Funzione di spegnimento della macchina virtuale.
 *
 * @param {int} idVm - Identificativo univoco della macchina virtuale.
 */
function stopVm(idVm) {
$.ajax({
type: "POST",
url: "https://192.168.1.70/stopVm.php",
data: "idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
var dec = JSON.parse(response);
if(dec.status == 'failed'){
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = dec.fault.detail;
}    
if(dec.status == 'complete'){
logStopInit = "<-- Inizio spegnimento -->";
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logStopInit;
var createStopTimer = setInterval(function() { waitStop(idVm,logStopInit,createStopTimer); }, 8000);
} 
},
error: function(){}
}); 
}

/**
 * Funzione che controlla se la macchina virtuale è spenta (stato "down").
 *
 * @param {int} idVm - Identificativo univoco della macchina virtuale.
 * @param {string} logStopInit - Messaggio di log.
 * @param {double} createStopTimer - Timer elaborazione.
 */
function waitStop(idVm,logStopInit,createStopTimer) {
$.ajax({
type: "POST",
url: "https://192.168.1.70/getVmApi.php",
data: "idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
var dec = JSON.parse(response);  	   
if(dec.status == "down" || dec.status == "powering_down"){
var logStopSuccess = "Spegnimento in corso..." + "<br>" + logStopInit;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logStopSuccess;
clearInterval(createStopTimer);
setTimeout(function(){ completeStop(dec,logStopSuccess); }, 2000);
}
},
error: function(){}
}); 
}

/**
 * Funzione di spegnimento macchina virtuale eseguito con successo.
 *
 * @param {Json} dec - Json contenente la risposta di oVirt.
 * @param {string} logStopSuccess - Messaggio di log.
 */
function completeStop(dec,logStopSuccess) {
var logCompleteSuccess = "<-- Macchina spenta -->" + "<br>" + logStopSuccess;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logCompleteSuccess;
document.getElementById("submitRun").disabled = false;
setTimeout(function(){ red(dec,logStopSuccess); }, 5000);
}

/**
 * Funzione di redirect al pannello di una macchina virtuale.
 *
 * @param {Json} dec - Json contenente la risposta di oVirt.
 * @param {string} logStopSuccess - Messaggio di log.
 */
function red(dec,logStopSuccess) {
window.location.href = 'https://192.168.1.70/panelVm.html';	
}

/**
 * Funzione di inizio controllo stato macchina virtuale.
 *
 */
function check() {
$.ajax({
type: "GET",
url: "https://192.168.1.70/idVm.php",             
success: function(response){
idVm = response;
checkStato(idVm);
},
error: function(){}
});
}

/**
 * Funzione di controllo stato macchina virtuale.
 *
 * @param {int} idVm - Identificativo univoco della macchina virtuale.
 */
function checkStato(idVm) {
$.ajax({
type: "POST",
url: "https://192.168.1.70/getVmApi.php",
data: "idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
var dec = JSON.parse(response);  	   
if(dec.status == "wait_for_launch" || dec.status == "powering_up"){
document.getElementById("submitRun").disabled = true;
document.getElementById("submitShut").disabled = true;
document.getElementById("submitConsole").disabled = true;
document.getElementById("submitDelete").disabled = true;
document.getElementById("submitDeploy").disabled = true;
}
if(dec.status == "up"){
document.getElementById("submitConsole").disabled = false;
document.getElementById("submitShut").disabled = false;
document.getElementById("submitDelete").disabled = true;
document.getElementById("submitRun").disabled = true;
document.getElementById("submitDeploy").disabled = true;
}
else if(dec.status == "down") {
document.getElementById("submitShut").disabled = true;
document.getElementById("submitRun").disabled = false;
document.getElementById("submitConsole").disabled = true;
document.getElementById("submitDelete").disabled = false;
}
else if(dec.status == "powering_down") {
document.getElementById("submitRun").disabled = true;
document.getElementById("submitShut").disabled = false;
document.getElementById("submitConsole").disabled = true;
document.getElementById("submitDelete").disabled = true;
document.getElementById("submitDeploy").disabled = true;
}
else if(dec.status == "image_locked") {
document.getElementById("submitRun").disabled = true;
document.getElementById("submitShut").disabled = true;
document.getElementById("submitConsole").disabled = true;
document.getElementById("submitDelete").disabled = true;
document.getElementById("submitDeploy").disabled = true;
}
},
error: function(){}
}); 	
}

/**
 * Funzione per entrare nel pannello di deploy di una macchina virtuale.
 *
 */
function submitDeploy() {
window.location.href = 'https://192.168.1.70/deployVm.html';	
}

/**
 * Funzione per avviare il processo di visualizzazione console.
 *
 */
function submitConsole() {
$.ajax({
type: "GET",
url: "https://192.168.1.70/idVm.php",             
success: function(response){
idVm = response;
getIdConsole(idVm);
},
error: function(){}
});
}

/**
 * Funzione per ottenere l'identificativo univoco della console.
 *
 * @param {int} idVm - Identificativo univoco della macchina virtuale.
 */
function getIdConsole(idVm) {
$.ajax({
type: "POST",
url: "https://192.168.1.70/getVmIdConsole.php",
data: "idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
var dec = JSON.parse(response);
var idConsole = dec.graphics_console[0].id; 
getVvFile(idVm, idConsole);
},
error: function(){}
}); 	
}

/**
 * Funzione per ottenere il file .vv per visualizzare la console.
 *
 * @param {int} idVm - Identificativo univoco della macchina virtuale.
 * @param {int} idConsole - Identificativo univoco della console.
 */
function getVvFile(idVm, idConsole) {
$.ajax({
type: "POST",
url: "https://192.168.1.70/getConsole.php",
data: "idVm=" + idVm + "&idConsole=" + idConsole,
dataType: "html",
      
success: function(response)
{
download(idVm);
},
error: function(){}
}); 
}

/**
 * Funzione di download del file .vv sul client.
 *
 * @param {int} idVm - Identificativo univoco della macchina virtuale.
 */
function download(idVm) {
window.location.href = 'https://192.168.1.70/' + idVm + '.vv';
}

/**
 * Funzione di inizio del processo di eliminazione.
 *
 */
function submitDelete() {
$.ajax({
type: "GET",
url: "https://192.168.1.70/idVm.php",             
success: function(response){
idVm = response;
delVmPools(idVm);
},
error: function(){}
});
}

/**
 * Funzione di avvio del processo di eliminazione di una macchina virtuale e di un pool.
 *
 * @param {int} idVm - Identificativo univoco della macchina virtuale.
 */
function delVmPools(idVm) {
$.ajax({
type: "POST",
url: "https://192.168.1.70/getVmApi.php",
data: "idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
var dec = JSON.parse(response); 
if(dec.vm_pool == undefined){
deleteVm(idVm);
}
else {
getIdPools(idVm);
} 	
},
error: function(){}
}); 
}

/**
 * Funzione di controllo eliminazione macchina virtuale (stato "complete").
 *
 * @param {int} idVm - Identificativo univoco della macchina virtuale.
 */
function deleteVm(idVm) {
$.ajax({
type: "POST",
url: "https://192.168.1.70/deleteVm.php",
data: "idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
var dec = JSON.parse(response);
if(dec.status == "complete"){
logDeleteVm = "<-- Eliminazione Macchina Virtuale -->";
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logDeleteVm;
setTimeout(function(){ successDeleteVm(logDeleteVm); }, 5000);
}
else {
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = dec.detail;
}
},
error: function(){}
}); 
}

/**
 * Funzione avvenuta eliminazione macchina virtuale.
 *
 * @param {string} logDeleteVm - Messaggio di log.
 */
function successDeleteVm(logDeleteVm) {
logSuccessDeleteVm = "Macchina eliminata con successo" + "<br>" + logDeleteVm;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logSuccessDeleteVm;
setTimeout(function(){ redirectDelete(); }, 2000);
}

/**
 * Funzione di acquisizione dell'id del pool.
 *
 * @param {int} idVm - Identificativo univoco della macchina virtuale.
 */
function getIdPools(idVm) {
$.ajax({
type: "POST",
url: "https://192.168.1.70/getVmApi.php",
data: "idVm=" + idVm,
dataType: "html",
      
success: function(response)
{
var dec = JSON.parse(response);
var idPools = dec.vm_pool.id;
deletePools(idPools)
},
error: function(){}
});
}

/**
 * Funzione di controllo eliminazione pool (stato "complete").
 *
 * @param {int} idPools - Identificativo univoco del pool.
 */
function deletePools(idPools) {
$.ajax({
type: "POST",
url: "https://192.168.1.70/deletePools.php",
data: "idPools=" + idPools,
dataType: "html",
      
success: function(response)
{
var dec = JSON.parse(response);
if(dec.status == "complete"){
logDeletePools = "<-- Eliminazione Pools -->";
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logDeletePools;
setTimeout(function(){ successDeletePools(logDeletePools); }, 5000);
}
else {
document.getElementById("textLog").style.cssText = "color:red;"
document.getElementById("textLog").innerHTML = dec.detail;
} 	   
},
error: function(){}
}); 
}

/**
 * Funzione avvenuta eliminazione pool.
 *
 * @param {string} logDeletePools - Messaggio di log.
 */
function successDeletePools(logDeletePools) {
logSuccessDeleteVm = "Pools eliminato con successo" + "<br>" + logDeletePools;
document.getElementById("textLog").style.cssText = "color:black;"
document.getElementById("textLog").innerHTML = logSuccessDeleteVm;
setTimeout(function(){ redirectDelete(); }, 2000);
}

/**
 * Funzione di redirect alla home.
 *
 */
function redirectDelete() {
window.location.href = 'https://192.168.1.70/interface.html';
}