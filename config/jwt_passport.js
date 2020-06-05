const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

require('dotenv').config();

module.exports = function(passport){
    let opts = {};

    // Options to extract jwt from the header
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKet = process.env.TOKEN_SECRET;

    // jwt_payload contains the users information
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

        

    }));
}