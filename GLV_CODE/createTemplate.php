<?php
$nomeVm = $_POST["nomeVm"];
$idVm = $_POST["idVm"];

$xml = "
<template>
<name>".$nomeVm."</name>
<vm id='".$idVm."'/>
</template>
";

$headers = array(
'Accept: application/json',
'Content-Type: application/xml'
);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://192.168.1.70/ovirt-engine/api/templates');
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
