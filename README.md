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

## Routing
Le route vengono definite lato server da express. In particolare, le librerie utilizzate
dai progetti singoli (axios...), sono servite tramite endpoint condivisi.

## Cose


E guarda come porcodio si fanno gli utenti su MongoDB

- [ ] mongosh "mongodb://root:example_password@localhost:27017/admin"
- [ ] use squealer
- [ ] db.createUser({
  user: 'admin',
pwd: 'password',
roles: [{ role: 'readWrite', db: 'squealer' }]
 })
