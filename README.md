# Guida per installare e utilizzare il gestore di macchine virtuali (GLV)

## Prerequisiti
Sono necessari due server (con IP statico assegnato):
- oVirt Engine (192.168.1.70) (Engine, dove risiede l'ambiente di virtualizzazione e GLV)
- oVirt Node (192.168.1.80) (Hyperisor, contiene le risorse che le macchine virtuali utilizzeranno)

oVirt Engine OS:
- Red Hat Enterprise Linux 7.6 o successiva
- CentOS Linux 7.6 o successiva
- Scientific Linux 7.6 o successiva

Browser Raccomandati:
- Mozilla Firefox
- Google Chrome
- Apple Safari
- Microsoft Internet Explorer 11
- Microsoft Edge

Requisiti Client:
- Virt-Manager (https://virt-manager.org)

Per maggiori informazioni e per conoscere i requisiti hardware visitare:  
https://www.ovirt.org/documentation/install-guide/chap-System_Requirements.html

## Installare oVirt Engine (192.168.1.70)
Aggiungere la repository ufficiale:
```
yum install http://resources.ovirt.org/pub/yum-repo/ovirt-release42.rpm
```

Assicurarsi che tutti i pacchetti siano aggiornati:
```
yum update
```
Installare ovirt-engine:
```
yum install ovirt-engine
```
### Configurare oVirt Engine
Eseguire il seguente comando:
```
engine-setup
```
Seguire le istruzioni di configurazione mostrate a schermo e connettersi al portale web all'indirizzo specificato in fase di configurazione:  
None utente: admin  
Password: mia_password (Modificare la password utilizzata in fase di configurazione all'interno dei file .php di GLV)

## Installare oVirt Node (192.168.1.80)
Scaricare la ISO desiderata all'indirizzo:  
https://www.ovirt.org/download/node.html

Montarla su un qualsiasi dispositivo (dvd o usb) e installare il sistema operativo.

## Aggiungere un Host ad oVirt Engine
Visitare il seguente indirizzo:  
https://www.ovirt.org/documentation/install-guide/chap-Adding_a_Host_to_the_oVirt_Engine.html

## Configurare lo Storage
Una volta aggiunto l'host è necessario passare alla configurazione dello storage, poichè un DataCenter non 
può essere inizializzato a meno che i domini di archiviazione non siano collegati ed attivi; infatti oVirt
utilizza un sistema centralizzato per dischi di immagini virtuali, file ISO e snapshot.  
Lo storage può essere implementato in diversi modi: GLV utilizza NFS (Network File System) per motivi descritti nel DRS.
Visitare il seguente indirizzo per maggiori informazioni e per la configurazione dello storage (sezione "Preparing and Adding NFS Storage
"):  
https://www.ovirt.org/documentation/admin-guide/chap-Storage.html


## Avviare GLV
Le operazioni che seguono andranno eseguite nel server in cui risiede l'oVirt Engine (192.168.1.70).

### Installare Apache 
Digitare il comando:
```
sudo yum -y install httpd
```
Aprire le porte HTTP e HTTPS:
```
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
```
Riavviare il firewall:
```
sudo firewall-cmd --reload
```
Avviare Apache:
```
sudo systemctl start httpd
```
### Installare PHP
Abilitare le repository:
```
sudo yum install epel-release yum-utils
sudo yum install http://rpms.remirepo.net/enterprise/remi-release-7.rpm
sudo yum-config-manager --enable remi-php73
```
Installare PHP:
```
sudo yum install php php-common php-opcache php-mcrypt php-cli php-gd php-curl php-mysqlnd
```
### Utilizzare GLV
Copiare il contenuto della cartella GLV_CODE all'interno della directory /var/www/html

Per utilizzare GLV recarsi all'indirizzo https://192.168.1.70/interface.html

## Autore

***Riccardo Rossi***<br />
***Corso di Software Engineering***<br />
***Corso di Laurea Magistrale in Ingegneria Informatica - DIBRIS***<br />
***Università degli Studi di Genova***<br />

red.riccardo.91@gmail.com
