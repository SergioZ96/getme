const mongoose = require('mongoose');
//const { options } = require('../routes/proutes');

require('dotenv').config();

options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(`mongodb+srv://SergioZ96:${process.env.DB_ATLAS_PASSWORD}@cluster0.mu7ft.mongodb.net/${process.env.DB_ATLAS_NAME}?retryWrites=true&w=majority`, options);
//const connection = mongoose.createConnection(process.env.DB_NAME, options);


module.exports = mongoose;