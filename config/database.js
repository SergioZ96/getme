const mongoose = require('mongoose');

require('dotenv').config();

options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const connection = mongoose.createConnection(process.env.DB_NAME, options);

connection.on('connected', () => {
    console.log('MongoDB connected...');
});

connection.on('error',(err) => {
    console.log(`Database connection error: ${err}`);
});

module.exports = connection;