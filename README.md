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

### Canali
Canali pubblici, privati e keyword vengono trattati tutti allo stesso modo e salvati nella stessa tabella.
In questo modo é sempre possibile in maniera veloce e semplice, trovare tutti i post di un canale (o keyword).
Nel caso in cui una keyword appaia per la prima volta, viene creata una nuova entry nella tabella canali.


### Cose


E guarda come porcodio si fanno gli utenti su MongoDB

- [ ] mongosh "mongodb://root:example_password@localhost:27017/admin"
- [ ] use squealer
- [ ] db.createUser({
  user: 'admin',
pwd: 'password',
roles: [{ role: 'readWrite', db: 'squealer' }]
 })
