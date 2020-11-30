const express = require('express');                     // web framework for node
const session = require('express-session');             // 
const passport = require('passport');
const mongoose = require('./config/database');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
//const generateAccessToken = require('./token').generateAccessToken;
require('dotenv').config();



const app = express();

const port = process.env.PORT || 3000;

app.use(cors());


// Bodyparser
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
// Session Middleware
//  -> handles all things for us, i.e., creating the session, setting the session cookie,
//      and creating the session object in req object. Whenever we make a request from the 
//      same client again, we will have their session information stored w/ us
//  -> all the requests to the app routes are now using sessions
 
app.use(session({
    secret: process.env.DB_ATLAS_PASSWORD,
    resave: true,
    saveUninitialized: true,
    proxy: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Equals 1 day
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    }
}));  


// Passport Middleware
app.use(passport.initialize()); // initializes passport/authentication module
app.use(passport.session()); // acts as a middleware to alter the req object and change the 'user' value that is currently the session id (from the client cookie) into the true deserialized user object.

app.enable("trust proxy");

// Connect flash for flash messages
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));



require('./config/fb_passport')(passport);
require('./config/google_passport')(passport);
require('./config/twitter_passport')(passport);
require('./config/jwt_passport')(passport);



// Routing Middleware
//app.use('/index', require('./routes/index'));
app.use('/', require('./routes/proutes'));

app.get('/',(req, res) => {
    res.send('Hello');
    // req.session
});


app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port,()=> {
    console.log(`Server started on port ${port}`);
});
