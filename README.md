# Squealer

## Autenticazione

### Logica
L'autenticazione avviene tramite Bearer Token. Al momento della registrazione/login,
viene creato un token che permette di accedere alle risorse dell'utente.
L'utente puó avere un massimo di 5 token attivi, al momento della creazione del sesto token, 
il primo token creato viene invalidato. Le password sono salvate e validate tramite hash bcrypt.

### Interfaccia
Esiste un'unica pagina utilizzata per il login, raggungibile a /static/auth.
Una volta effettuato il login con successo, in base al tipo di account, l'utente viene reindirizzato
alla pagina corrispondente (utente, smm, admin).

## Routing
Le route vengono definite lato server da express. In particolare, le librerie utilizzate
dai progetti singoli (axios...), sono servite tramite endpoint condivisi.

## Query
Le query vengono gestite tramite **mongoose** e vengono eseguite lato server. I risultati
vengono interrogati e processati tramite la libreria **axios**.
Per migliorare le performance, le relazioni non sono gestite tramite semplici liste nei modelli,
ma sono memorizzate in tabelle pivot apposite per l'incrocio dei dati.
Un esempio puó essere la tabella che lega gli squeal ai canali, per poter avere una lista di squeal
appartenenti ad un canale. In questo modo evitiamo di scorrere le liste di categorie per 
ogni squeal ma ci limitiamo a prendere dalla tabella pivot solo i risultati che ci interessano.

## Seeder
Per aiutare lo sviluppo, é stato creato un seeder che permette di popolare il database con dati 
fittizi. Quando il server viene avviato, viene controllato se il database é vuoto, in caso affermativo
viene popolato con i dati del seeder.

## Gestione degli errori
La gestione degli errori nell'API é stata centralizzata in un unico middleware. In questo modo,
evitiamo di dover gestire gli errori in ogni singola route. In caso di errore, viene restituito
un oggetto JSON con i dettagli dell'errore (che andrebbe rimosso in un ipotetco scenario di produzione).

## Squeal

### Popolari, impopolari e controversi
Ogni qual che viene aggiunta/rimossa una reazione ad uno squeal, oppure se aumenta il numero di impression,
viene effettuata l'azione "updateSquealTrend" (vedi il file helpers/squealTrendHelper.js). Questa azione si occupa di aggiornare lo stato di popolaritá
dello squeal. In particolare, se lo squeal diventa popolare, l'utente potrebbe ricevere un bonus di caratteri,
al contrario, se lo squeal diventa impopolare, l'utente potrebbe perdere dei caratteri.
Nel caso in cui lo squeal diventi controverso, verrá aggiunto al canale "controversial".


#### Reazioni
Le possibili reazioni ad uno squeal sono variabili e possono essere modificate in qualsiasi momento 
in quanto salvate in una tabella a parte sul db.
Ogni squeal include un array di reazioni, che contiene l'id della reazione e un array di utenti che hanno reagito con quella reazione.
Per evitare di inviare per ogni squeal la lista di utenti che hanno reagito, quando viene creato il feed viene ritorna solo il numero di reazioni per ogni tipo
e un booleano per informare il client se l'utente loggato ha reagito o meno allo squeal e con quale reazione.

#### Creazione

#### Ricerca
È possibile ricercare (o meglio filtrare) gli squeal tramite l'id di un canale (che include anche menzioni private).
Nel caso di menzioni private, per tutelare la privacy, verranno mostrati solo gli squeal che contengono menzioni nel corpo del testo.
Per quanto riguarda invece tutti gli altri canali, vengono mostrati sia gli squeal che contengono menzioni nel corpo del testo,
sia gli squeal che sono stati pubblicati nel canale (a meno che l'utente non decida di andare a cercare unicamente nel testo o nelle menzioni).
Per migliorare le performance (e non visitare tutti gli squeal per cercare le menzioni o i canali dove é stato pubblicato),
é stata creata una tabella a parte per salvare i canali e le menzioni di ogni singolo squeal. In questo modo, é possibile
filtrare gli squeal in base ai canali e alle menzioni senza dover scorrere tutti gli squeal.

## Utenti

### Utenti standard
Gli utenti possono registrarsi tramite email e password. Una volta registrati, possono accedere
ed effettuare azioni come creare uno squeal, reagire ad uno squeal, commentare uno squeal, ecc.

### Utenti guest
Vengono creati nel database come utenti standard. Differsicono dagli utenti standard in quanto
possono effettuare azioni limitate, non possono mantenere la sessione e non possono effettuare il login
in un secondo momento. 


## Canali
Canali pubblici, privati (menzioni) e keyword vengono trattati tutti allo stesso modo e salvati nella stessa tabella.
In questo modo é sempre possibile in maniera veloce e semplice, trovare tutti i post di un canale (o keyword).
Nel caso in cui una keyword appaia per la prima volta, viene creata una nuova entry nella tabella canali.
Essendo che anche i canali privati (usati per inviare privatamente utente-utente) sono classificati come normali canali,
al momento della registrazione di un utente, viene creato un canale privato, salvato nel suo profilo e nella tabella canali.
Ovviamente il nuovo utente é automaticamente iscritto al suo canale privato.

### Cose

- [ ] Quando si ricevono gli squeal, se esiste una categoria privata nei canali postati
  allora vuol dire che era mandato privatamente per lui


E guarda come porcodio si fanno gli utenti su MongoDB

- [ ] mongosh "mongodb://root:example_password@localhost:27017/admin"
- [ ] use squealer
- [ ] db.createUser({
  user: 'admin',
pwd: 'password',
roles: [{ role: 'readWrite', db: 'squealer' }]
 })


### TODO
- [ ] Quando viene postato uno squeal fai parsing dei canali (menzioni hashtag) che sono stati menzionati per fare ricerche dopo
- [ ] Chiamata per aumentare di un delta la quota 
- [ ] Canali editoriali da mettere (controversial, altri > 3 nostri)
- [ ] Messaggi generati automaticamente
  - TIPI
    - [ ] Meteo: ti manda coordinate come se fosse la mappa e chiama api METEO da quelle coordinate
    - [ ] Immagine: immagine a caso da lorem picsum
- [ ] RESET PASSWORD POI VEDI
- [ ] Un utente puo gestire canale pubblico
- [ ] Quando ti viene postato un canale con hashtag, crea un nuovo canale nel caso in cui non esista

## FRONT

- [x] Componente destinatari squeal
- [x] Controlla se mostra errore quando superata quota
- [ ] Quando uno squeal viene visualizzato (a meno che non privato) manda impression
- [ ] Scarica lista emoji
- [ ] monta reazioni con chiamata
- [x] Monta caso video squeal
- [ ] Manda codifica per messaggio temporizzato testuale
- [ ] Quando manda messaggio mappa puo decidere di farlo temporizzato con previsioni meteo
- [ ] Quando parte messaggio temporizzato di "Manda posizione live": mostra banner sopra che puo interrompere e 
- [ ] Monta ricerca utenti e scelta/rimozione SMM
- [ ] Schermata profilo quando non é loggato
- [ ] Monta iscrizione/disiscrizione a canale
- [ ] Link immagine da internet
- [ ] Monta creazione e gestione canali privati
- [ ] Scheduling dei messaggi temporizzati 
- [ ] Se mi mandi "mediaUrl" nello squeal puoi allegare link a video o immagine
- [ ] Se noti che il campo "mediaUrl" non inizia con http* allora é un link sullo stesso sito e devi solo mettere il dominio prima dell'url
- [ ] Se uno squeal ha il campo replyTo, allora é una risposta ad un altro squeal e andrebbe mostrato come tale (ti mando tutto lo squeal a cui risponde)
- [ ] Per rispondere ad uno squeal, basta che tu mandi un campo replyTo con l'id dello squeal a cui vuoi rispondere, copia i canali identici non farli selezionare
- [ ] Nel profilo vengono ritornati anche i canali creati
- [ ] Quando entra come guest, chiama la createGuestUser per loggarti come guest
  - Disabilita le funzioni che non puo fare quando é guest
- [ ] Se un utente ha reagito ad uno squeal, nelle reazioni ti ritorno "userReacted":true, altrimenti nulla. Mostra reazioni in base a questo
- Metti che puoi bannare un utente quando sei admin di un canale
``` javascript


// Eseguita dopo successo primo post di posizione live e chiamata ricorsivamente
// sendAfterMs: intervallo di tempo ogni quanto mandare
// sendForMs:   manda per tot ms
function sendLiveLocation(sendAfterMs, sendForMs, lastSentSqueal, squealSentCount) 
{
    // Se il tempo é scaduto, allora smetti di mandare
    if (sendForMs <= 0) return;
    
    // Prendi posizione squeal precedente
    let position = lastSentSqueal.position;
    
    // Crea array punti posizione
    let points = position ? position : [];
    
    // Aggiungi nuovo punto posizione
    points.push({lat: 0, lng: 0});
    
    // Posta nuovo squeal
    let postedSqueal = postSqueal(parametri)

    // Dopo il successo di post di uno squeal di aggiornamento posizione,
    prendilo e rimandalo dopo tot con la nuova posizione
    setTimeout(() => {
        sendLiveLocation(sendAfterMs, sendForMs - sendAfterMs,postedSqueal, squealSentCount + 1);
    }, sendAfterMs);
}

        
```

## Moderator dashboard
- [ ] Moderator dashboard
  - [ ] Elencare utenti e filtrarli per nome, tipo (utente, smm, admin) e popolarita (?)
    - [ ] Puo bannare, riabilitare e aumentare i caratteri residui
  - [ ] Elencare squeal e filtrarli per utente, data e destinatari
    - [ ] Ne puo cambiare i destinatari
    - [ ] OPZIONALE, cambiare numero reazioni
  - [ ] Elencare canali ufficiali squealer, aggiungerli, toglierli e modificarli  