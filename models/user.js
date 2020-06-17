const conn = require('../config/database');
const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({

    firstname: String,
    lastname: String,
    email: String,
    getme_views: [],
    account_info: {
        social_id: String,
        social: String,
        date_created: Date
    }
});


const User = module.exports = conn.model('User', UserSchema);
