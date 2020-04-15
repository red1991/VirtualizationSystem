<?php
$nomeVm = $_POST["nomeVm"];
$idTemplate = $_POST["idTemplate"];
$numeroPools = $_POST["numeroPools"];
$textDescrizione = $_POST["textDescrizione"];

$xml = "
<vm_pool>
<name>".$nomeVm."</name>
<description>".$textDescrizione."</description>
<cluster id='e131c2b7-57dc-4e2c-8d36-1254cc3e30d7'/>
<template id='".$idTemplate."'/>
<size>".$numeroPools."</size>
</vm_pool>
";

$headers = array(
'Accept: application/json',
'Content-Type: application/xml'
);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://192.168.1.70/ovirt-engine/api/vmpools');
curl_setopt($curl, CURLOPT_USERPWD, "admin@internal:aezakmi");
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $xml);
$response = curl_exec($curl);
echo $response;
curl_close($curl);
?>
