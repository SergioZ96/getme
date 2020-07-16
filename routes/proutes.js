const express = require('express');
const router = express.Router();
const passport = require('passport');
const flash = require('connect-flash');
const User = require('../models/user');
const { response } = require('express');
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


// Needs to be a protected route
router.get('/profile', passport.authenticate('jwt', {session: false }), (req,res) => {
  res.json({ success: true, msg: "hello there !"});
});


router.post('/addgetme', passport.authenticate('jwt', {session: false}), (req,res) => {
  const getme = {
    topic: req.body.topic,
    issue: req.body.issue,
    view: req.body.view
  }

  // updating the users getme_views by pushing the getme to the array in mongodb
  User.updateOne({_id: req.user._id}, { $push: { getme_views : [getme]}},
    (err, result) => {
      if(err) {
        res.send(err);
      }
      else{
        res.json({success: true});
      }
    }
  );

});

router.get('/loadgetme', passport.authenticate('jwt', {session: false}), async function(req,res){
  // Here we have to pass the user's getme's from the db to the client
  const result = await User.findById(req.user._id, 'getme_views').exec();
  if(result === null){
    res.json({success: false, views: "none"});
  }
  else{
    res.json({success: true, getme_views: result});
  }
}); 

module.exports = router;