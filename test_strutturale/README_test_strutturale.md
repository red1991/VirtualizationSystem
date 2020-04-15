# Test strutturale GLV

## Introduzione

Il test strutturale, detto anche ***white box***, è un particolare tipo di test che viene utilizzato per rilevare errori in uno o più componenti (poichè in tale tipo di test si ha a disposizione il codice sorgente del programma) di un sistema software.  
Il suo funzionamento si basa sul trovare dati di test che consentano di percorrere tutto il programma.  
Per testare una parte di programma si introduce il concetto di cammino, ovvero una sequenza di istruzioni attraversata durante un esecuzione.  
Poichè non esiste un criterio in grado di testare ogni singolo cammino dato l'elevato numero di questi ultimi (soprattutto in presenza di cicli) è possibile tuttavia trovare un numero finito di cammini indipendenti che combinati tra loro forniscano tutti (o per lo meno la maggior parte) i cammini restanti.  
La differenza sostanziale con il test funzionale (metodo ***black box***) è prorpio l'analisi del codice che permette di identificare i cammini da percorrere anche manualmente con l'uso di diagrammmi di flusso che mostrano i diversi percorsi del programma.

## GLV - Test Strutturale

L'obiettivo è ottenere una **Branch Coverage del 100%**.  

Analizzando attentamente il codice di GLV (e anche osservando il diagramma delle classi presente nel DRS) è possibile notare come il "cuore" del software siano i due file Javascript ***elaborazioneMV.js*** ed ***elaborazionePool.js*** nella quale è presente l'algoritmo di elaborazione per eseguire le due operazioni principali di GLV, ovvero la creazione di una nuova macchina virtuale personalizzata e la creazione di un pool a partire da una macchina già esistente.  
Entrambi i file contengono la maggior parte dei Branch del programma ed è possibile notare che essi dipendono unicamente da:  

* INPUT: Tali file eseguono molti controlli sui dati inseriti in input poichè i processi gestiti "in sottofondo" da oVirt sono molto complessi e dati non corretti potrebbero portare a gravi errori durante l'elaborazione.   
* STATO DEL NODO E DELL'ENGINE: Il software prima di eseguire qualsiasi tipo di elaborazione deve assicurarsi che sia il nodo che l'engine siano disponibili e che il Data-Center sia stato attivato correttamente.  
* STATO DI ELABORAZIONE: Entrambe le elaborazioni sono costituite da una serie di "sotto-elaborazioni" che insieme portano al compimento dell'azione desiderata: quindi i file devono controllare periodicamente il compimento di una fase di elaborazione così da passare alla successiva in modo sequenziale fino al completamento dell'operazione scelta dall'utente.  

Da questa premessa è possibile osservare il grafo di flusso di controllo (CFG) nelle figure ***CFG_MV.png*** e ***CFG_POOL.png*** allegate che mostrano tutti i Branch per le due elaborazioni descritte in precedenza.  

**Grafo di flusso di controllo per elaborazioneMV.js (CFG_MV.png):**  

![img](https://github.com/mnarizzano/se-project-31/blob/master/test_strutturale/CFG_MV.png)  

**Grafo di flusso di controllo per elaborazionePool.js (CFG_POOL.png):** 

![img](https://github.com/mnarizzano/se-project-31/blob/master/test_strutturale/CFG_POOL.png)   

### JSCoverage per la copertuara del codice

Per supportare l'analisi del comportamento di GLV è stato utilizzato un software per misurare la copertura del codice per programmi Javascript.  
Tale programma mostra per ogni file Javscript il numero totale di statements, quelli effettivamente eseguiti, quelli mancati e la percentuale di copertura ottenuta.

#### Installazione JSCoverage su Linux

##### Compilare JSCoverage

Scaricare il software al seguente indirizzo:  
http://siliconforks.com/jscoverage/download.html  

Estarre e compilare il codice (E' necessario avere installato sul proprio sistema GCC):  

```
tar jxvf jscoverage-0.5.1.tar.bz2
cd jscoverage-0.5.1/
./configure
make
```

Installare l'eseguibile in /usr/local/:  

```
make install
```

##### Utilizzare il programma

Specificare la cartella dove è presente il codice che si vuole testare e la cartella di destinazione dove saranno generati i file da utilizzare per il testing:  

```
jscoverage SOURCE-DIRECTORY DESTINATION-DIRECTORY
```
Per eseguire il codice da testare all'interno del browser sarà necessario connettersi al proprio web server e aprire il file ***jscoverage.html*** generato all'interno della cartella di destinazione.

#### JSCoverage su GLV

Utilizzando JSCoverage è stato eseguito direttamente il software (simulando l'utente) seguendo i Branch mostrati nei CFG delle elaborazioni ottenendo il risultato mostrato nella figura ***COVERAGE.png*** allegata.  

**Copertura ottenuta mediante JSCoverage (COVERAGE.png):**  

![img](https://github.com/mnarizzano/se-project-31/blob/master/test_strutturale/COVERAGE.png)  

### Risultati

Come si può notare dalla figura per tutti i file Javascript (rispettivamente 7 escludendo la libreria jQuery utilizzata) si è ottenuta una copertura del 100% fatta eccezione di:  

* elaborazioneMV.js: 98% - Statements mancati: 108, 109
* panelVm.js: 96% - Statements mancati: 72, 73, 76, 77, 171, 172

Il motivo per cui per questi due file non è stato possibile ottenere il 100% di copertura è dovuto al fatto che in entrambi sono stati aggiunti degli ulteriori controlli di sicurezza per potere gestire ogni possibile errore:  

* Per quanto rigurda ***elaborazioneMV.js*** osservando il codice si può notare che al momento della validazione degli input il programma esegue tre controlli (oltre a quelli relativi ai campi lasciati vuoti e ad un corretto inserimento del valore della memoria RAM), rispettivamente nome macchina già esistente, Data-Center non riconosciuto ed utilizzo di caratteri speciali: nel caso in cui tutti i controlli andassero a buon fine si passa alla fase di creazione della macchina virtuale (vedi anche CFG_MV.png), nel caso invece venisse riscontrato un errore non gestito diverso da quelli elencati precedentemente viene catturato lo stato di tale errore e la fase di creazione non viene avviata. Testando il software durante il test strutturale utilizzando JSCoverage non è stato possibile entrare in tale casistica poichè i controlli precedenti sembrano sufficienti a gestire gli errori che si possono riscontrare. Tuttavia poichè la piattaforma utilizzata da GLV (oVirt) è molto complessa e in futuro potrebbero sorgere problemi non osservati durante il test si è deciso di non eliminare dal codice tale controllo. 

* Per quanto riguarda ***panelVm.js*** vale quanto detto per elaborazioneMV.js, tuttavia tali controlli questa volta sono relativi all'eliminazione di una macchina virtuale e di un Pool di macchine.

Da notare che all'interno della cartella GLV_CODE oltre ai file .html statici utilizzati esclusivamente (insieme al file .css) per la parte grafica delle interfaccie di GLV sono presenti dei file .php alla quale non è stata calcolata la copertura per due motivi:  

* Analizzando attentamente il codice è possibile notare che tali file vengono richiamati all'interno dei file .js mediante chiamate AJAX quando necessari e poichè gli statements relativi a tali chiamate in fase di test utilizzando JSCoverage sono sempre coperti segue che tali file vengono sempre richiamati e poichè

* i file .php si limitano ad eseguire richieste alle librerie di oVirt e non contengono alcun tipo di Branch ne consegue che una volta chiamati vengono sempre interamente eseguiti e sarà poi compito dei file .js in base alla risposta fornita seguire i vari cammini (che come si può vedere dalla figura sopra sono sempre coperti al 100% salvo le eccezzioni sopra descritte).


## Autore

***Riccardo Rossi***<br />
***Corso di Software Engineering***<br />
***Corso di Laurea Magistrale in Ingegneria Informatica - DIBRIS***<br />
***Università degli Studi di Genova***<br />

red.riccardo.91@gmail.com
