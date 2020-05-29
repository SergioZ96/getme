/*
 * LOOK AT FACEBOOK GRAPH API FOR ANY QUESTIONS ABOUT USERS
 */

const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
require('dotenv').config();
module.exports = function(passport) {

    passport.use(new FacebookStrategy({

        clientID:           process.env.FACEBOOK_APP_ID,
        clientSecret:       process.env.FACEBOOK_APP_SECRET,
        callbackURL:        "http://localhost:3000/auth/facebook/callback"
      },
      
      // Verify Callback
      // Facebook will send back the token and profile
        function(accessToken, refreshToken, profile, cb) {
            User.findOne({ 'facebook.id': profile.id }, function (err, user) {

                // check for error
                if (err) { return cb(err); }

                // if the user exists
                if (user) {
                    return cb(null, user);
                }
                else{ // Create our new user with user info sent from FB 
                    var newUser = new User();
                    

                    // set user FB credentials in our user model
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = accessToken;
                    newUser.facebook.email = profile.emails; // first of possible multiple emails
                    newUser.facebook.name = profile.displayName;

                    // saving our user to the database
                    newUser.save( (err) => {
                        if (err) { throw err; }
                        
                        return cb(null, newUser);
                    });
                }
                
            });
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err,user);
        });
    });
}