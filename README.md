# Squealer

3 progetti
 - [ ] UserModel app: react + mui con Joy UI
 - [ ] SMM app: alpine.js + pine
 - [ ] JS

## Autenticazione
L'autenticazione avviene tramite Bearer Token. Al momento della registrazione/login,
viene creato un token che permette di accedere alle risorse dell'utente.
L'utente puó avere un massimo di 5 token attivi, al momento della creazione del sesto token, 
il primo token creato viene invalidato.

Le password sono salvate e validate tramite hash bcrypt.


## Cose


E guarda come porcodio si fanno gli utenti su MongoDB

mongosh "mongodb://root:example_password@localhost:27017/admin"
use squealer
admin> db.createUser({
...   user: 'admin',
...   pwd: 'password',
...   roles: [{ role: 'readWrite', db: 'squealer' }]
... })
