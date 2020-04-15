<?php
$idVm = $_POST["idVm"];

$xml = "<action/>";

$headers = array(
'Accept: application/json',
'Content-Type: application/xml'
);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://192.168.1.70/ovirt-engine/api/vms/'.$idVm.'/start');
curl_setopt($curl, CURLOPT_USERPWD, "admin@internal:aezakmi");
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $xml);

$jsonResponse = curl_exec($curl);
echo $jsonResponse;

curl_close($curl);
?>

