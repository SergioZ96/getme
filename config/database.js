const mongoose = require('mongoose');
//const { options } = require('../routes/proutes');

require('dotenv').config();

options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};

mongoose.connect(`mongodb+srv://SergioZ96:${process.env.DB_ATLAS_PASSWORD}@cluster0.mu7ft.mongodb.net/${process.env.DB_ATLAS_NAME}?retryWrites=true&w=majority`, options)
    .then(() => console.log('MongoDb Connected...'))
    .catch(err => console.log(err));
//const connection = mongoose.createConnection(process.env.DB_NAME, options);
//const connection = mongoose.connection;
/* 
connection.on('connected', () => {
    console.log('MongoDB connected...');
});

connection.on('error',(err) => {
    console.log(`Database connection error: ${err}`);
}); */

module.exports = mongoose;