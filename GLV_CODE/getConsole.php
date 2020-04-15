<?php
$idVm = $_POST["idVm"];
$idConsole = $_POST["idConsole"];

$xml = "
<action/>
";

$headers = array(
'Accept: application/json',
'Content-Type: application/xml'
);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://192.168.1.70/ovirt-engine/api/vms/'.$idVm.'/graphicsconsoles/'.$idConsole.'/remoteviewerconnectionfile');
curl_setopt($curl, CURLOPT_USERPWD, "admin@internal:aezakmi");
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $xml);

$jsonResponse = curl_exec($curl);
curl_close($curl);

$json = json_decode($jsonResponse, true);
$fileVV = $json['remote_viewer_connection_file'];

$fp = fopen($idVm.'.vv', "w");
if(!$fp) die ("Errore nella operaione con il file");
fwrite($fp, $fileVV);
?>

