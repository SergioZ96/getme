/*
 * LOOK AT FACEBOOK GRAPH API FOR ANY QUESTIONS ABOUT USERS
 */

const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

require('dotenv').config();



module.exports = function(passport) {

    let id, secret, callback;
    if(process.env.NODE_ENV === "production"){
        id = process.env.FACEBOOK_APP_ID;
        secret = process.env.FACEBOOK_APP_SECRET;
        callback = "https://getmeweb.app/api/auth/facebook/callback";
    }
    else{
        id = process.env.FACEBOOK_TEST_ID;
        secret = process.env.FACEBOOK_TEST_SECRET;
        callback = "http://localhost:4200/api/auth/facebook/callback";
    }

    passport.use(new FacebookStrategy({

        clientID:           id,
        clientSecret:       secret,
        callbackURL:        callback,
        profileFields:      ['id', 'name', 'emails']            // Fields we need from the User
        //passReqToCallback:  true
      },
      
      // Verify Callback
      // Facebook will send back the token and profile
        async function( accessToken, refreshToken, profile, done) {
            await User.findOne({ 'account_info.social_id': profile.id }, function (err, user) {

                // check for error
                if (err) { return done(err); }

                // if the user exists
                if (user) {
                    
                    return done(null, user);
                }
                else{ // Create our new user with user info sent from FB 

                    // If user is found through email...
                    User.findOne({'email':profile.emails[0].value}, function(err, user) {
                        if (user){
                            
                            return done(null, false, {msg: "You already have an account!"});
                        }
                        else{ // else create new user and save to database

                            var newUser = new User();
                    

                            // set user FB credentials in our user model
                            newUser.firstname = profile.name.givenName;
                            newUser.lastname = profile.name.familyName;
                            newUser.email = profile.emails[0].value; // first of possible multiple emails
                            newUser.bio = "";
                            newUser.link = "";
                            newUser.account_info.social_id = profile.id;
                            newUser.account_info.social = "facebook";


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