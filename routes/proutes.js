const express = require('express');
const router = express.Router();
const passport = require('passport');
const flash = require('connect-flash');


router.get('/login', (req,res) => {
    
    //console.log(req.flash('error'));   
    //console.log(req.flash().error);             
});

// Needs to be a protected route
router.get('/profile', (req,res) => {

});

// route for facebook authentication
router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] })); // need additional permissions from the user, the permissions can be requested via the scope option to passport.authenticate().

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect: 'http://localhost:4200/profile',
                failureRedirect:'http://localhost:4200/'
            }),
             (req, res) => {
              {
                res.send(req.user);
              }
            });

// Route for Google Authentication
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { successRedirect: 'http://localhost:4200/profile', failureRedirect: 'http://localhost:4200/'})
  
    // Successful authentication, redirect home.
    //res.redirect('/profile');
);


router.get('/auth/twitter', passport.authenticate('twitter', { scope: ['email']}));

router.get('/auth/twitter/callback', passport.authenticate('twitter', 
  {
    failureRedirect: 'http://localhost:4200/'
  }),
  (req, res) => {
    res.redirect('http://localhost:4200/profile');
  });


module.exports = router;