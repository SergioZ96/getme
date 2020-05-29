const express = require('express'); 
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

require('dotenv').config();
require('./config/fb_passport')(passport);


const app = express();

const port = 3000;

// Session Middleware
//  -> handles all things for us, i.e., creating the session, setting the session cookie,
//      and creating the session object in req object. Whenever we make a request from the 
//      same client again, we will have their session information stored w/ us
app.use(session({
    secret: process.env.DB_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day
    }
}));


// Bodyparser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(passport.initialize());
app.use(passport.session());

// Routing Middleware
//app.use('/index', require('./routes/index'));
app.use('/', require('./routes/proutes'));

app.get('/',(req, res) => {
    res.send('Hello');
});

app.listen(port,()=> {
    console.log(`Server started on port ${port}`);
});
