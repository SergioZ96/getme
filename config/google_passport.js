const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

require('dotenv').config();

module.exports = function(passport){

    passport.use(new GoogleStrategy({

            clientID:           process.env.GOOGLE_CLIENT_ID,
            clientSecret:       process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:        "http://localhost:3000/auth/google/callback",
            passReqToCallback   : true
      },

      function(req, accessToken, refreshToken, profile, cb) {
        User.findOne({ 'google.id': profile.id }, function (err, user) {

            // check for error
            if (err) { return cb(err); }

            

            // if the user exists
            if (user){
                return cb(null, user);
            }
            else{ // Create our new user with user info sent from Google
                /* 
                Verify Callback
                Passport strategies require a verify callback, which is generally a (err, user, options?) object. 
                options.message can be used to give a flash message. user should be false if the user does not authenticate. 
                err is meant to indicate a server error, like when your DB is unavailable; you shouldn't set err if a user fails to authenticate. 
                */

                User.findOne({'facebook.email':profile.emails[0].value}, function(err, fb_user) {
                    if (fb_user){
                        //console.log('You already have a GetMe account w/ a different social login');
                        //continue;
                        //return cb(new Error('You already have a GetMe account with Facebook! '));
                        return cb(null, false);
                    }
                    else{

                        var newUser = new User();

                        // set user Google credentials in our user model
                        newUser.google.id = profile.id;
                        newUser.google.token = accessToken;
                        newUser.google.email = profile.emails[0].value;
                        newUser.google.name = `${profile.name.givenName} ${profile.name.familyName}`;

                        // saving our user to the database
                        newUser.save( (err) => {
                            if (err) { throw err; }

                            return cb(null, newUser);
                        });

                    }
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