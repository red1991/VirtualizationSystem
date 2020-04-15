<?php
$idVm = $_POST["idVm"];
session_start();
$_SESSION['idVm'] = $idVm; 
echo $_SESSION['idVm'];
?>
