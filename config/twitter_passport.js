const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');

require('dotenv').config();

module.exports = function(passport) {

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });

    passport.use(new TwitterStrategy({

        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://localhost:3000/auth/twitter/callback",
        includeEmail: true // necessary to retrieve email from user
                            // also necessary to enable email permissions for app in Twitter
    },
    
        function(token, tokenSecret, profile, done){
            User.findOne({'account_info.social_id':profile.id}, function(err,user) {

                if(err){
                    return done(err);
                }

                if(user){
                    return done(null, user);
                }

                else{

                    User.findOne({'email':profile.emails[0].value}, function(err, user) {
                        
                        if(user){
                            return done(null, false, {msg: "You already have an account!"});
                        }
                        else{

                            var newUser = User();

                            newUser.firstname = profile.username;
                            //newUser.lastname = profile.name.familyName;
                            newUser.email = profile.emails[0].value;
                            newUser.bio = "";
                            newUser.link = "";
                            newUser.account_info.social_id = profile.id;
                            newUser.account_info.social = "Twitter";

                            newUser.save((err) => {
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
