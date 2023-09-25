const { Strategy: BearerStrategy } = require('passport-http-bearer');
const AccessToken = require('../models/accessTokenModel');
const User = require('../models/userModel');
function setUpPassport(passport){

    //Passport setup
    passport.use(new BearerStrategy(
        (token, done) => {

            //Find the requested token
            AccessToken.findOne({token: token}).then((accessToken) => {

                //If the token doesn't exist
                if (!accessToken) {
                    return done(null, false);
                }

                //Find the user associated with the token
                User.findById(accessToken.userId).then((user) => {

                    //If the user doesn't exist
                    if (!user) {
                        return done(null, false);
                    }

                    //If the user exists
                    return done(null, user, { scope: 'all' });
                });


            }).catch((error) => {
                return done(error);
            });
        }
    ));

// Serialize and deserialize user (optional, but required for session support)
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        const user = users.find((u) => u.id === id);
        if (!user) {
            return done(new Error('User not found'));
        }
        done(null, user);
    });
}

module.exports = {setUpPassport};