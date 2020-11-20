const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

require('dotenv').config();



module.exports = function(passport){


    passport.use(new GoogleStrategy({

            clientID:           process.env.GOOGLE_CLIENT_ID,
            clientSecret:       process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:        "https://fierce-gorge-54255.herokuapp.com/auth/google/callback",
            passReqToCallback   : true
      },

      function(req, accessToken, refreshToken, profile, done) {
        User.findOne({ 'account_info.social_id': profile.id }, function (err, user) {

            // check for error
            if (err) { return done(err); }

            

            // if the user exists
            if (user){
                return done(null, user);
            }
            else{ // Create our new user with user info sent from Google
                /* 
                Verify Callback
                Passport strategies require a verify callback, which is generally a (err, user, options?) object. 
                options.message can be used to give a flash message. user should be false if the user does not authenticate. 
                err is meant to indicate a server error, like when your DB is unavailable; you shouldn't set err if a user fails to authenticate. 
                */

                User.findOne({'email':profile.emails[0].value}, function(err, user) {
                    if (user){
                        //console.log('You already have a GetMe account w/ a different social login');
                        //continue;
                        //return cb(new Error('You already have a GetMe account with Facebook! '));
                        return done(null, false, { msg: "You already have an account!"});
                    }
                    else{

                        var newUser = new User();

                        // set user Google credentials in our user model
                        newUser.firstname = profile.name.givenName;
                        newUser.lastname = profile.name.familyName;
                        newUser.email = profile.emails[0].value;
                        newUser.bio = "";
                        newUser.link = "";
                        newUser.account_info.social_id = profile.id;
                        newUser.account_info.social = "google";

                        // saving our user to the database
                        newUser.save( (err) => {
                            if (err) { throw err; }

                            return done(null, newUser);
                        });

                    }
                });

                
            }
            
        });
      }


    ));

    
}