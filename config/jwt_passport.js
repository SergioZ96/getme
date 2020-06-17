const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

require('dotenv').config();

module.exports = function(passport){

   

    let opts = {};

    // opts is an object literal containing options to control how the token is extracted from the request or verified

    // jwtFromRequest holds function that accepts a request as the only parameter and returns either the JWT as a string or null
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.TOKEN_SECRET;
    opts.jsonWebTokenOptions = {
        maxAge: '7d'
    };

     /* 
        new JwtStrategy(options, verify)

        verify is a function with the parameters verify(jwt_payload, done)
     */

    // jwt_payload is an object literal containing the decoded JWT payload
    // done is a passport error first callback accepting arguments done(error, user, info)
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

        User.findOne({ _id: jwt_payload.data._id}, (err, user) => {
            if(err){
                console.log(err);
                return done(err, false);
            }
            if(user){
                console.log(user);
                return done(null, user);
            }
            else{
                return done(null, false);
            }
        });

    }));
}