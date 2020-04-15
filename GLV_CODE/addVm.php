<?php
$nome = $_POST["nome"];
$descrizione = $_POST["descrizione"];
$dimensioneRam = $_POST["dimensioneRam"];
$dimensioneRam = $dimensioneRam . "000000000";
$template = $_POST["template"];

$xml = "<vm>
<name>".$nome."</name>
<description>".$descrizione."</description>
<memory>".$dimensioneRam."</memory>
<cluster>
<name>testcluster</name>
</cluster>
<template>
<name>".$template."</name>
</template>
<os>
<boot>
<devices>
<device>hd</device>
</devices>
</boot>
</os>
</vm>";

$headers = array(
'Accept: application/json',
'Content-Type: application/xml'
);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://192.168.1.70/ovirt-engine/api/vms');
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
