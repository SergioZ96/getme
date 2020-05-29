const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/login', (req,res) => {
    const login = `<a href="/auth/facebook">Login with Facebook</a><br>
                    <a href="/auth/google">Login with Google</a`;
    res.send(login);
});

// Needs to be a protected route
router.get('/profile', (req,res) => {
    res.send('Welcome to your profile!');
});

// route for facebook authentication
router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] })); // need additional permissions from the user, the permissions can be requested via the scope option to passport.authenticate().

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect: '/profile',
                failureRedirect:'/login'
            }));

// Route for Google Authentication
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });



module.exports = router;