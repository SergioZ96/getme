const express = require('express');
const router = express.Router();
const passport = require('passport');
const conn = require('../config/database');
const mongoose = require('mongoose');
const mongodb = require('mongodb'); // necessary to use ObjectId() to turn string into mongodb object id
//const flash = require('connect-flash');
const multer = require('multer');
// GridFS storage engine for Multer to store uploaded files directly to MongoDb
const GridFSStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
//const gfs = Grid(conn.db);
const User = require('../models/user');
const { response } = require('express');
const generateAccessToken = require('../token').generateAccessToken;

router.use(require('cookie-parser')());
 /* 
const storage = new GridFSStorage({ 
  db: conn,
  file: (req, file) => {
    // instead of an object a string is returned
    return 'file_' + Date.now()
  }
}); */


// mainly used for testing the handling of form data, works so far
//const upload = multer({ dest: 'routes/uploads/'});

let image_ids;


let gfs;
conn.once('open', () => {
  // Initialize stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('prof_photos');
}); 

// Create storage engine
const storage = new GridFSStorage({ 
  db: conn,
  file: (req, file) => {
    if(file.fieldname === 'profile_photo'){
      return {
        bucketName: 'prof_photos'
      };
    }
  } 
});

const upload  = multer({ storage });


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
router.get('/profile_test', passport.authenticate('jwt', {session: false }), (req,res) => {
  res.json({ success: true, msg: "hello there !"});
});

// getme add route which receives topic, issue, view and returns the new getme _id to push the getme_list on front end
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
        // aggregate pipeline to retrieve size of getme array to retrieve last element's (newly added getme) _id
        const array_size = User.aggregate()
                            .match({_id: req.user._id})
                            .project({
                              getme_views: {$size:"$getme_views"}
                            })
                            .exec((err, getme_views) => {
                              const array_size = getme_views.length;
                              const newgetme_id = getme_views[array_size - 1]._id;
                              res.json({success: true, new_id: newgetme_id}); // sending the new _id to front end
                            }); 
         
        
      }
    }
  );

});

// getme edit route which updates a getme 
router.put('/editgetme/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  User.updateOne({'_id': req.user._id, 'getme_views._id': req.params.id}, {$set: {'getme_views.$.topic': req.body.topic, 'getme_views.$.issue': req.body.issue, 'getme_views.$.view': req.body.view}}, 
    (err, result) => {
      if(err){
        res.send(err);
      }
      else{
        console.log(result);
        res.json({success: true});
      }
    }
  );
});

// getme delete route which deletes on the basis of getme _id
router.delete('/deletegetme/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  console.log(req.params.id);
  User.updateOne({_id: req.user._id}, { $pull: { getme_views: {_id: req.params.id}}},
    (err, result) => {
      if(err){
        res.send(err);
      }
      else {
        res.json({success: true, _id: req.params.id});
      }
    }
  );
});


router.get('/loadgetme', passport.authenticate('jwt', {session: false}), async(req,res) =>{
  // Here we have to pass the user's getme's from the db to the client
  const result = await User.findById(req.user._id, 'getme_views').exec();
  if(result === null){
    res.json({success: false, views: "none"});
  }
  else{
    console.log(result);
    res.json({success: true, getme_views: result});
  }
});

// needs to add the image file to the prof_photos collection
router.post('/upload_profile_pic', upload.single('profile_photo'), passport.authenticate('jwt', {session: false}), (req,res) => {
  console.log(req.file);
  User.updateOne({_id: req.user._id}, { $push: { prof_photo_ids : [{ image_id: req.file.id.toString(), current: true}]}},
    (err, result) => {
      if(err) {
        res.send(err);
      }
      else{
        // aggregate pipeline to retrieve size of getme array to retrieve last element's (newly added getme) _id
        /* const array_size = User.aggregate()
                            .match({_id: req.user._id})
                            .project({
                              getme_views: {$size:"$getme_views"}
                            })
                            .exec((err, getme_views) => {
                              const array_size = getme_views.length;
                              const newgetme_id = getme_views[array_size - 1]._id;
                              res.json({success: true, new_id: newgetme_id}); // sending the new _id to front end
                            }); 
          */
        res.json({success: true});
      }
    }
  );
  //res.json({success: true});
});

// get profile of user along with profile photos
router.get('/profile', passport.authenticate('jwt', {session: false}), async (req,res) => {
  
  // First we need to get the user profile fields (all fields besides the getmes)
  const profile = await User.findById(req.user._id, 'firstname lastname email bio prof_photo_ids').exec();
  //console.log(profile);
  image_ids = profile.prof_photo_ids;
  
  //req.profile = profile;
  
  res.json({success: true, profile: profile});
  
});

router.get('/profile_images/:id', /* passport.authenticate('jwt', {session: false}), */ (req, res) => {
  if(image_ids === undefined || image_ids.length == 0){
    return;
  }
  else{
    //gfs.files.findOne({ _id: mongodb.ObjectId(image_ids[0].image_id)}, (err, file) => {
    gfs.files.findOne({ _id: mongodb.ObjectId(req.params.id)}, (err, file) => {
      console.log(file);
      const readstream = gfs.createReadStream(file.filename);
      //res.json({success: true, image: file});
      //res.set('Content-Type', file.contentType);
      return readstream.pipe(res);
    });
  }
  
});

router.put('/update_current/:photoID', passport.authenticate('jwt', {session: false}), (req,res) => {
  // Look through the profile photo id array to see which object has field current : true, and we change it to false
  User.updateOne({'_id': req.user._id, 'prof_photo_ids.current': true}, {$set: {'prof_photo_ids.$.current': false}},
    (err, result) => {
      if(err){
        res.send(err);
      }
      else{
        // then we update the photo id object that was passed throught the request and turn its current: true to indicate it is the current profile photo
        User.updateOne({'_id': req.user._id, 'prof_photo_ids.image_id': req.params.photoID}, { $set: {'prof_photo_ids.$.current': true}},
          (err,result) => {
            if(err){
              res.send(err);
            }
            else{
              res.json({success: true});
            }
          }
        );
      }
    }
  );
});

router.delete('/delete_photo/:photoId', passport.authenticate('jwt', {session: false}), (req,res) => {
  gfs.remove({ _id: mongodb.ObjectId(req.params.id), root: 'prof_photos'}, (err, gridStore) => {
    if(err){
      return res.status(404).json({ err: err});
    }
    User.updateOne({_id: req.user._id}, { $pull: { prof_photo_ids: {image_id: req.params.photoId }}},
      (err, result) => {
        if(err){
          res.send(err);
        }
        else{
          res.json({success: true});
        }
      }
    )
    //res.json({success: true});
  });
});

module.exports = router;