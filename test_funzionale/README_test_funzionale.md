# Test Funzionale GLV

## Introduzione

Il test funzionale, detto anche ***black box***, è un tipo di test nella quale il tester si immedesima nell'utente che utilizzerà il software al fine di identificare eventuali errori non previsti durante la scrittura del codice.  
Poichè tale test, a differenza di quello strutturale, o white box, non prevede la conoscenza del codice, il tester sarà a conoscenza esclusivamente delle funzionalità del tool contenute nei documenti di progettazione, quali URD  e DRS.  

## GLV - Test Funzionale

Per questo tipo di test, come detto in precedenza, il tester si limiterà a "provare" GLV basandosi esclusivamente sulle azione permesse all'utente.  
Poichè non si conosce il codice ci si limiterà ad identificare una serie di casistiche (derivate principalmente dalla tabella dei requisiti e dal diagramma degli use cases presenti nei documenti di progettazione) provando una serie di combinazione di input (poichè rappresentano l'unico mezzo che il tester ha a disposizione per interagire con il software) ed esaminando gli output confrontando il risultato atteso con quello effettivamente restituito dal programma al fine di identificare evetuali errori o anomalie nel software.  

### Testing

Di seguito sono riportate le tabelle ottenute in fase di test funzionale che mostrano gli input forniti al software con i relativi risultati restituiti dal programma.

***Creazione nuova macchina virtuale***  

| id | scenario | risultato atteso | risultato ottenuto |
|----|----------|------------------|--------------------|
| 1 | Nessun input inserito | Nessuna creazione MV | Corretto. Output ricevuto "Ci sono campi vuoti!" |
| 2 | RAM molto grande | Nessuna creazione MV | Corretto. Output ricevuto "Dimensione ram tra 2 e 4 GB!" Per valori troppo piccoli quindi stesso risultato. |
| 3 | Campo RAM non numerico | Nessuna creazione MV | Corretto. Output ricevuto "Dimensione ram non numerica!" |
| 4 | Nome MV contenente caratteri speciali (come @)  | Creazione MV | Errore. Output ricevuto "Caratteri non consentiti!" GLV non consente di utilizzare caratteri speciali per il nome di una MV. |
| 5 | Caratteri speciali in descrizione MV | Creazione MV | Corretto. L'elaborazione viene avviata. La descrizione di una MV può contenere caratteri speciali. |
| 6 | Input validi | Creazione MV | Corretto. L'elaborazione viene eseguita. |
| 7 | Creazione nuova macchina durante elaborazione già avviata | Impossibile creare nuova MV | Corretto. Il pulsante di creazione viene disabilitato a elaborazione avviata e sarà nuovamente attivo a fine creazione con reindirizzamento alla home. |
| 8 | Creazione nuova macchina durante elaborazione già avviata aprendo nuova scheda del browser | Creazione MV | Corretto. Aprendo una nuova scheda è possibile avviare la creazione di una nuova MV in parallelo a quella già in elaborazione. |
| 9 | Avvio elaborazione MV con input validi ma Data-Center disattivato | Impossibile creare nuova MV | Corretto. Output ricevuto "Data Center non riconosciuto!" |

***Creazione pool di macchina virtuale***  

| id | scenario | risultato atteso | risultato ottenuto |
|----|----------|------------------|--------------------|
| 1 | Nessun input inserito | Nessuna creazione pool | Corretto. Output ricevuto "Ci sono campi vuoti!" |
| 2 | Nome Pool contenente caratteri speciali (come @)  | Creazione pool | Errore. Output ricevuto "Caratteri non consentiti!" GLV non consente di utilizzare caratteri speciali per il nome di un pool di MV. |
| 3 | Descrizione pool contenente caratteri speciali (come @)  | Creazione pool | Corretto. L'elaborazione viene avviata. La descrizione di un pool può contenere caratteri speciali. |
| 4 | Numero di MV nullo | Nessuna creazione pool | Corretto. Output ricevuto "Numero macchine tra 2 e 5!". GLV non consente di creare meno di 2 e più di 5 MV per pool. |
| 5 | Campo numero di MV non numerico | Nessuna creazione pool | Corretto. Output ricevuto " Campo non numerico!" |
| 6 | Input validi | Creazione pool | Corretto. Elaborazione avviata. |
| 7 | Creazione nuovo pool durante elaborazione già avviata | Impossibile creare nuovo pool | Corretto. Il pulsante di creazione viene disabilitato a elaborazione avviata e sarà nuovamente attivo a fine creazione con reindirizzamento alla home. |
| 8 | Creazione nuovo pool durante elaborazione già avviata aprendo nuova scheda del browser | Creazione pool | Corretto. Aprendo una nuova scheda è possibile avviare la creazione di un nuovo pool in parallelo a quello già in elaborazione. |
| 9 | Creazione pool aprendo nuova scheda nel browser della stessa MV per la quale è in corso una elaborazione  | Errore | Corretto. Il pulsante di creazione del pool è disabilitato per quella MV. |
| 10 | Avvio elaborazione pool con input validi ma Data-Center disattivato | Impossibile creare nuovo pool | Corretto. Output ricevuto "Data Center non riconosciuto!" |

Confrontando i risulatati ottenuti nelle tabelle sopra si nota come entrambe le elaborazioni forniscano gli stessi risultati mostrando un comportamento analogo per quanto riguarda la gestione degli input inseriti dall'utente. Si osserva che in generale non sono stati riscontrati gravi errori e GLV gestisce in modo corretto gli input consentendo l'avvio di una elaborazione solamente dopo essersi assicurato di avere ricevuto tutti gli input validi per eseguire l'operazione così da evitare problemi durante l'esecuzione della stessa.  

***Operazioni di gestione sulle macchine virtuali***  

| id | scenario | risultato atteso | risultato ottenuto |
|----|----------|------------------|--------------------|
| 1 | Avviare MV | Avvio MV | Corretto. La MV viene avviata. |
| 2 | Avviare MV già accesa o in accensione | Errore | Corretto. Una volta avviata l'accensione di una MV il pulsante di avvio viene disabilitato finchè la MV non viene spenta. |
| 3 | Arrestare MV | Arresto MV | Corretto. La MV viene arrestata. |
| 4 | Arrestare MV già spenta o in arresto | Errore | Corretto. Il pulsante di arresto è abilitato solo se la MV e accesa. |
| 5 | Avviare MV da console | Avvio console | Corretto. GLV fa scaricare sul client un file .vv dalla durata di due minuti apribile con Virt-Manager. Tuttavia è necessario associare l'apertura di tale file con il programma nel browser utilizzato per visualizzare la console. |
| 6 | Aprire console di una MV spenta o in accensione | Errore | Corretto. il pulsante per avviare la console è attivo solamente quando la macchina è accesa. |
| 7 | Aprire la console della stessa MV su client diversi | Avvio console sul client richiedente | Corretto. La console viene aperta nel client che ha fatto la richiesta per ultimo e spenta nell'altro. |
| 8 | Eliminazione MV | Avvio eliminazione MV | Corretto. La MV viene eliminata con successivo reindirizzamento alla home. |

Come si può notare anche in questo caso non sono stati riscontrati errori che possono portare a pensare ad un cattivo funzionamento di GLV durante la gestione delle macchine virtuali se non alcuni ritardi (seppure molto brevi) nell' abilitazione/disabilitazione dei pulsanti rispetto allo stato effettivo delle macchine virtuali. Tuttavia tali ritardi non hanno influenzato il corretto funzionamento del software.


## Autore

***Riccardo Rossi***<br />
***Corso di Software Engineering***<br />
***Corso di Laurea Magistrale in Ingegneria Informatica - DIBRIS***<br />
***Università degli Studi di Genova***<br />

red.riccardo.91@gmail.com
