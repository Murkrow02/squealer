# Squealer

3 progetti
 - [ ] User app: react + mui con Joy UI
 - [ ] SMM app: alpine.js + pine
 - [ ] JS



E guarda come porcodio si fanno gli utenti su MongoDB

mongosh "mongodb://root:example_password@localhost:27017/admin"
use squealer
admin> db.createUser({
...   user: 'admin',
...   pwd: 'password',
...   roles: [{ role: 'readWrite', db: 'squealer' }]
... })
