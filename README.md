# Squealer

3 progetti
 - [ ] UserModel app: react + mui con Joy UI
 - [ ] SMM app: alpine.js + pine
 - [ ] JS

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

### Routing
Le route vengono definite lato server da express. In particolare, le librerie utilizzate
dai progetti singoli (axios...), sono servite tramite endpoint condivisi.

### Query
Le query vengono gestite tramite **mongoose** e vengono eseguite lato server. I risultati
vengono interrogati e processati tramite la libreria **axios**.
Per migliorare le performance, le relazioni non sono gestite tramite semplici liste nei modelli,
ma sono memorizzate in tabelle pivot apposite per l'incrocio dei dati.
Un esempio puó essere la tabella che lega gli squeal ai canali, per poter avere una lista di squeal
appartenenti ad un canale. In questo modo evitiamo di scorrere le liste di categorie per 
ogni squeal ma ci limitiamo a prendere dalla tabella pivot solo i risultati che ci interessano.

### Seeder
Per aiutare lo sviluppo, é stato creato un seeder che permette di popolare il database con dati 
fittizi. Quando il server viene avviato, viene controllato se il database é vuoto, in caso affermativo
viene popolato con i dati del seeder.

### Gestione degli errori
La gestione degli errori nell'API é stata centralizzata in un unico middleware. In questo modo,
evitiamo di dover gestire gli errori in ogni singola route. In caso di errore, viene restituito
un oggetto JSON con i dettagli dell'errore (che andrebbe rimosso in un ipotetco scenario di produzione).

### Squeal

#### Creazione

#### Ricerca
È possibile ricercare (o meglio filtrare) gli squeal tramite l'id di un canale (che include anche menzioni private).
Nel caso di menzioni private, per tutelare la privacy, verranno mostrati solo gli squeal che contengono menzioni nel corpo del testo.
Per quanto riguarda invece tutti gli altri canali, vengono mostrati sia gli squeal che contengono menzioni nel corpo del testo,
sia gli squeal che sono stati pubblicati nel canale (a meno che l'utente non decida di andare a cercare unicamente nel testo o nelle menzioni).
Per migliorare le performance (e non visitare tutti gli squeal per cercare le menzioni o i canali dove é stato pubblicato),
é stata creata una tabella a parte per salvare i canali e le menzioni di ogni singolo squeal. In questo modo, é possibile
filtrare gli squeal in base ai canali e alle menzioni senza dover scorrere tutti gli squeal.

### Canali
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
- [x] Iscrizione e rimozione da canali
- [x] Feed utente
  - Mescola squeal inviati personalmente e squeal a canali iscritto
  - Mostra i canali in cui gli squeal sono stati pubblicati ma NON mostrare utenti privati
- [x] Ricerca di squeal tramite canale§ OPPURE keyword# OPPURE menzione@ (nel corpo del testo) 
  - Usa questo sul client https://mui.com/material-ui/react-autocomplete/
  - Vedi freeform per esempio
- [ ] Reazioni agli squeal
- [ ] Creazione nuovo squeal
  - [ ] Upload immagine
  - [ ] Upload posizione
  - [ ] Risposta ad altro squeal con squeal (tipo retweet)
    - Si condividono tutti i canali non privati
- [ ] Chiamata per ritornare le quote rimanenti
- [ ] Ripetizione ogni tot secondi di uno squeal
- [ ] Chiamata per scegliere SMM
- [ ] Post da SMM per conto di un utente
- [ ] Chiamata per poter comprare quota in piu per un anno
- [ ] Quando viene postato uno squeal fai parsing dei canali (menzioni hashtag) che sono stati menzionati per fare ricerche dopo
- [x] Chiamata per aumentare le impression quando un post viene visto
- [ ] SECONDARIO: chiave app per autenticare il client