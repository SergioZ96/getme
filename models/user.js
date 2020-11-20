const mongoose = require('../config/database');


const UserSchema = mongoose.Schema({

    firstname: String,
    lastname: String,
    email: String,
    bio: String,
    link: String,
    prof_photo_ids: [{
        image_id: String,
        current: Boolean
    }],
    getme_views: [{
        topic: String,
        issue: String,
        view: String
    }],
    account_info: {
        social_id: String,
        social: String,
        date_created: Date
    }
});


const User = module.exports = mongoose.model('User', UserSchema);
