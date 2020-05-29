const express = require('express'); 
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

require('dotenv').config();
require('./config/fb_passport')(passport);
require('./config/google_passport')(passport);


const app = express();

const port = 3000;

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Session Middleware
//  -> handles all things for us, i.e., creating the session, setting the session cookie,
//      and creating the session object in req object. Whenever we make a request from the 
//      same client again, we will have their session information stored w/ us
//  -> all the requests to the app routes are now using sessions
app.use(session({
    secret: process.env.DB_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day
    }
}));


// Passport Middleware
app.use(passport.initialize()); // initializes passport/authentication module
app.use(passport.session()); // acts as a middleware to alter the req object and change the 'user' value that is currently the session id (from the client cookie) into the true deserialized user object.

// Routing Middleware
//app.use('/index', require('./routes/index'));
app.use('/', require('./routes/proutes'));

app.get('/',(req, res) => {
    res.send('Hello');
    // req.session
});

app.listen(port,()=> {
    console.log(`Server started on port ${port}`);
});
