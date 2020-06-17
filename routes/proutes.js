const express = require('express');
const router = express.Router();
const passport = require('passport');
const flash = require('connect-flash');
const User = require('../models/user');
const generateAccessToken = require('../token').generateAccessToken;



router.get('/login', (req,res) => {
    
    //console.log(req.flash('error'));   
    //console.log(req.flash().error);             
});



/* FACEBOOK ROUTER */
router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] })); // need additional permissions from the user, the permissions can be requested via the scope option to passport.authenticate().

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    //successRedirect: "/auth",
    failureRedirect: "http://localhost:4200"
  }), 
  (req, res) => {
    res.redirect('/auth');
  }
);  

/* GOOGLE ROUTER */
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', 
  { 
    //session: false,
    //successRedirect: 'http://localhost:3000/profile', 
    failureRedirect: 'http://localhost:4200'
  }),
  (req, res) => {
    // Generate JWT Token using User
    res.redirect('/auth');
  }

);


/* TWITTER ROUTER */
router.get('/auth/twitter', passport.authenticate('twitter', { scope: ['email']}));

router.get('/auth/twitter/callback', passport.authenticate('twitter', 
  {
    //session: false,
    failureRedirect: 'http://localhost:4200'
  }),
  (req, res) => {
    
    res.redirect('/auth');
  });



router.use(require('cookie-parser')());

router.route('/auth')
.get((req, res, next) => {

  var token = generateAccessToken(req.user);
  res.cookie('jwt_user', JSON.stringify({ jwt: token, user: req.user }));
  res.redirect("http://localhost:4200/login");
  next();
});
/* .post((req, res, next) => {
  console.log(JSON.stringify(req.cookies));
  var token = generateAccessToken(req.cookies);
  res.json({jwt: token, user: req.cookies });
  next();
}); */


// Needs to be a protected route
router.get('/profile', passport.authenticate('jwt', {session: false }), (req,res) => {
  res.json({ user: req.session.user });
});


module.exports = router;