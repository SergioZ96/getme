const conn = require('../config/database');
const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});


const User = module.exports = conn.model('User', UserSchema);