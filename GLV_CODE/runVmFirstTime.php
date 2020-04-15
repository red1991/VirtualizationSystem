<?php
$idVm = $_POST["idVm"];
$template = $_POST["template"];
$nomeHost = $_POST["nomeHost"];
$checkedCB = $_POST["checkedCB"];
$checkedLO = $_POST["checkedLO"];

$custom_string = "";
if($template == "CentOS-7-x86_64-DVD-1804") {	
if($checkedCB == "true" && $checkedLO == "false") {
$custom_string = "
<custom_script>
#cloud-config
runcmd:
- 'yum install -y /var/programmi/codeblocks-13.12-24.el7.x86_64.rpm'
- 'yum -y remove cloud-init.x86_64'
</custom_script>";
}
else if($checkedCB == "false" && $checkedLO == "true") {
$custom_string = "
<custom_script>
#cloud-config 
runcmd: 
- 'cd /var/programmi/LibreOffice_6.1.2.1_Linux_x86-64_rpm' 
- 'yum localinstall -y RPMS/*.rpm'
- 'cd ..'
- 'cd ..'
- 'cd ..'
- 'yum -y remove cloud-init.x86_64'
</custom_script>";
}
else if($checkedCB == "true" && $checkedLO == "true") {
$custom_string = "
<custom_script>
#cloud-config 
runcmd: 
- 'yum install -y /var/programmi/codeblocks-13.12-24.el7.x86_64.rpm'
- 'cd /var/programmi/LibreOffice_6.1.2.1_Linux_x86-64_rpm' 
- 'yum localinstall -y RPMS/*.rpm' 
- 'cd ..'
- 'cd ..'
- 'cd ..'
- 'yum -y remove cloud-init.x86_64'
</custom_script>";
}
else{
$custom_string = "
<custom_script>
#cloud-config 
runcmd: 
- 'yum -y remove cloud-init.x86_64'
</custom_script>";
}	
}
else if($template == "Ubuntu-16.04.4-desktop-amd64") {	
if($checkedCB == "true") {
$custom_string = "
<custom_script>
#cloud-config 
runcmd: 
- 'dpkg -i /var/programmi/codeblocks_13.12+dfsg-4_amd64.deb'
- 'apt-get remove -y cloud-init'
</custom_script>";
}
else if($checkedCB == "false") {
$custom_string = "
<custom_script>
#cloud-config 
runcmd: 
- 'apt-get remove -y cloud-init'
</custom_script>";
}	
}

$xml = "<action>
<vm>
<initialization>
<authorized_ssh_keys/>
<host_name>'.$nomeHost.'</host_name>
'.$custom_string.'
<nic_configurations/><regenerate_ssh_keys>false</regenerate_ssh_keys>
<user_name/>
</initialization>
</vm>
<use_cloud_init>true</use_cloud_init>
</action>";

$headers = array(
'Accept: application/xml',
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

