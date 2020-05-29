const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/login', (req,res) => {
    const login = `<a href="/auth/facebook">Login with Facebook</a>`;
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



module.exports = router;