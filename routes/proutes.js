const express = require('express');
const router = express.Router();
const passport = require('passport');
const flash = require('connect-flash');
const User = require('../models/user');
const generateAccessToken = require('../token').generateAccessToken;

router.use(require('cookie-parser')());




router.get('/login', (req,res) => {
    
    //console.log(req.flash('error'));   
    //console.log(req.flash().error);             
});



/* FACEBOOK ROUTER */
router.get('/auth/facebook', passport.authenticate('facebook', { session: false, scope : ['email'] })); // need additional permissions from the user, the permissions can be requested via the scope option to passport.authenticate().

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback', (req, res, next) => {

  passport.authenticate('facebook', { session: false, failureRedirect: "http://localhost:4200"}, (err, user, info) => {
    if (err) return next(err);
    
    var token = generateAccessToken(user);
    res.cookie('jwt_user', JSON.stringify({ jwt: token, user: user }));
    res.redirect("http://localhost:4200/login");

  })(req, res, next); 

}); 
  

/* GOOGLE ROUTER */
router.get('/auth/google',
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));

router.get('/auth/google/callback', (req, res, next) => {

  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:4200'}, (err,user,info) => {
    
    var token = generateAccessToken(user);
    res.cookie('jwt_user', JSON.stringify({jwt: token, user: user}));
    res.redirect('http://localhost:4200/login');

  })(req, res, next);

});


/* TWITTER ROUTER */
router.get('/auth/twitter', passport.authenticate('twitter', { scope: ['email']}));

router.get('/auth/twitter/callback', (req, res, next) => {

  passport.authenticate('twitter', { failureRedirect: 'http://localhost:4200' }, (err, user, info) => {

    var token = generateAccessToken(user);
    res.cookie('jwt_user', JSON.stringify({jwt: token, user: user }));
    res.redirect('http://localhost:4200/login');

  })(req, res, next);

});




/* 
router.route('/auth')
.get((req, res, next) => {

  var token = generateAccessToken(req.user);
  res.cookie('jwt_user', JSON.stringify({ jwt: token, user: req.user }));
  res.redirect("http://localhost:4200/login");
  next();
}); */
/* .post((req, res, next) => {
  console.log(JSON.stringify(req.cookies));
  var token = generateAccessToken(req.cookies);
  res.json({jwt: token, user: req.cookies });
  next();
}); */


// Needs to be a protected route
router.get('/profile', passport.authenticate('jwt', {session: false }), (req,res) => {
  res.json({ success: true, msg: "hello there !"});
});


module.exports = router;