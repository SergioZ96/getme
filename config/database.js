const mongoose = require('mongoose');


require('dotenv').config();

options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};

if (process.env.NODE_ENV === "production"){
    mongoose.connect(`mongodb+srv://SergioZ96:${process.env.DB_ATLAS_PASSWORD}@cluster0.mu7ft.mongodb.net/${process.env.DB_ATLAS_NAME}?retryWrites=true&w=majority`, options)
    .then(() => console.log('MongoDb Connected...'))
    .catch(err => console.log(err));

}
else{
    mongoose.connect(`${process.env.DB_NAME}`, options)
    .then(() => console.log('MongoDB Dev Connected...'))
    .catch(err => console.log(err));
   
}

module.exports = mongoose;