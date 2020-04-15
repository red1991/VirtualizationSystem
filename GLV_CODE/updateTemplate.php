<?php
$idT = $_POST["idT"];
$textUser = $_POST["textUser"];
$textPassword = $_POST["textPassword"];

$xml = "
<template>
<initialization>
<authorized_ssh_keys/>
<custom_script/>
<nic_configurations/>
<regenerate_ssh_keys>true</regenerate_ssh_keys>
<root_password>".$textPassword."</root_password>
<user_name>".$textUser."</user_name>
</initialization>
</template>
";

$headers = array(
'Accept: application/xml',
'Content-Type: application/xml'
);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://192.168.1.70/ovirt-engine/api/templates/'.$idT.'');
curl_setopt($curl, CURLOPT_USERPWD, "admin@internal:aezakmi");
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($curl, CURLOPT_POSTFIELDS, $xml);
$response = curl_exec($curl);
echo $response;
curl_close($curl);
?>
