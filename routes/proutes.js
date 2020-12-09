const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('../config/database');
const mon = require('mongoose');
const mongodb = require('mongodb');                       /* necessary to use ObjectId() to turn string into mongodb object id */
const multer = require('multer');                         /* middleware which adds a body and file(s) object to the request object for handling multipart/form-data */
const GridFSStorage = require('multer-gridfs-storage');   /* GridFS storage engine for Multer to store uploaded files directly to MongoDb */
const Grid = require('gridfs-stream');                    /* allows us to easily stream files to and from MongoDB GridFS */
const User = require('../models/user');
const { response } = require('express');
const generateAccessToken = require('../token').generateAccessToken;
//const flash = require('connect-flash');
const path = require('path');

router.use(require('cookie-parser')());


// mainly used for testing the handling of form data, works so far
//const upload = multer({ dest: 'routes/uploads/'});
const conn = mongoose.connection;
let image_ids;


let gfs;
conn.once('open', () => {
  /* Initialize stream with our db and mongoose, as well as specify the collection we are working with */
  gfs = Grid(conn.db, mon.mongo);
  gfs.collection('prof_photos');
}); 



/* Create our storage object with a specified configuration 
    - db:   database connection
    - file: a function to control the file storage in the database 
*/
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

/* Set multer storage engine to our newly created storage objectf */
const upload  = multer({ storage });


/* FACEBOOK ROUTER */
/**
 *    - Uses Facebook Strategy which can disable sessions and uses OAuth2
 */
router.get('/api/auth/facebook', passport.authenticate('facebook', { session: false, scope : ['email'] })); // need additional permissions from the user, the permissions can be requested via the scope option to passport.authenticate().

// handle the callback after facebook has authenticated the user
router.get('/api/auth/facebook/callback', (req, res, next) => {

  passport.authenticate('facebook', { session: false, failureRedirect: "https://www.getmeweb.app/"}, (err, user, info) => {
    if (err) return next(err);
    
    var token = generateAccessToken(user);
    res.cookie('jwt_user', JSON.stringify({ jwt: token, user: user }));
    //console.log(__dirname);
    //res.sendFile(path.join('/app', 'public/index.html'));
    res.redirect('/login');

  })(req, res, next); 

}); 
  

/* GOOGLE ROUTER */
/**
 *    - Uses Google Strategy which can disable sessions and uses OAuth2
 */
router.get('/api/auth/google',
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));

router.get('/api/auth/google/callback', (req, res, next) => {

  passport.authenticate('google', { session: false, failureRedirect: 'https://www.getmeweb.app/'}, (err,user,info) => {
    
    var token = generateAccessToken(user);
    res.cookie('jwt_user', JSON.stringify({jwt: token, user: user}));
    res.redirect('/login');

  })(req, res, next);

});


/* TWITTER ROUTER */
/**
 *    - Uses Twitter Strategy which uses sessions to work as it is built on OAuth1
 */
router.get('/api/auth/twitter', passport.authenticate('twitter', { scope: ['email']}));

router.get('/api/auth/twitter/callback', (req, res, next) => {

  passport.authenticate('twitter', { failureRedirect: 'https://www.getmeweb.app/' }, (err, user, info) => {

    var token = generateAccessToken(user);
    res.cookie('jwt_user', JSON.stringify({jwt: token, user: user }));
    res.redirect('/login');

  })(req, res, next);

});


// Needs to be a protected route
router.get('/api/profile_test', passport.authenticate('jwt', {session: false }), (req,res) => {
  res.json({ success: true, msg: "hello there !"});
});

// getme add route which receives topic, issue, view and returns the new getme _id to push the getme_list on front end
router.post('/api/addgetme', passport.authenticate('jwt', {session: false}), (req,res) => {
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
router.put('/api/editgetme/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
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
router.delete('/api/deletegetme/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
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


router.get('/api/loadgetme', passport.authenticate('jwt', {session: false}), async(req,res) =>{
  // Here we have to pass the user's getme's from the db to the client
  const result = await User.findById(req.user._id, 'getme_views').exec();
  if(result === null){
    res.json({success: false, views: "none"});
  }
  else{
    res.json({success: true, getme_views: result});
  }
});

// needs to add the image file to the prof_photos collection
router.post('/api/upload_profile_pic', upload.single('profile_photo'), passport.authenticate('jwt', {session: false}), (req,res) => {
  console.log(req.file);
  User.updateOne({'_id': req.user._id, 'prof_photo_ids.current': true}, {$set: {'prof_photo_ids.$.current': false}},
    (err, result) => {
      if(err){
        res.send(err);
      }
      else{
        User.updateOne({_id: req.user._id}, { $push: { prof_photo_ids : [{ image_id: req.file.id.toString(), current: true}]}},
          (err, result) => {
            if(err) {
              res.send(err);
            }
            else{
            
              res.json({success: true});
            }
          }
        );
      }
  });
  //res.json({success: true});
});

// get profile of user along with profile photos
router.get('/api/profile', passport.authenticate('jwt', {session: false}), async (req,res) => {
  
  // First we need to get the user profile fields (all fields besides the getmes)
  const profile = await User.findById(req.user._id, 'firstname lastname email bio prof_photo_ids').exec();
  //console.log(profile);
  image_ids = profile.prof_photo_ids;
  
  //req.profile = profile;
  
  res.json({success: true, profile: profile});
  
});

router.get('/api/profile_images/:id', /* passport.authenticate('jwt', {session: false}), */ (req, res) => {
  if(image_ids === undefined || image_ids.length == 0){
    return;
  }
  else{
    //gfs.files.findOne({ _id: mongodb.ObjectId(image_ids[0].image_id)}, (err, file) => {
    gfs.files.findOne({ _id: mongodb.ObjectId(req.params.id)}, (err, file) => {
      const readstream = gfs.createReadStream(file.filename);
      //res.json({success: true, image: file});
      //res.set('Content-Type', file.contentType);
      //res.set('Content-Type','image/jpeg');
      return readstream.pipe(res);
    });
  }
  
});

router.put('/api/update_current/:photoID', passport.authenticate('jwt', {session: false}), (req,res) => {
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

router.delete('/api/delete_photo/:photoId', passport.authenticate('jwt', {session: false}), (req,res) => {
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

router.post('/api/bio', passport.authenticate('jwt', {session: false}), (req,res) => {
  User.updateOne({_id: req.user._id}, { $set: {bio: req.body.bio}},
    (err,result) => {
      if(err){
        res.send(err);
      }
      else{
        res.json({success: true});
      }
    }
  );
});

router.put('/api/update_bio/:bio', passport.authenticate('jwt', {session: false}), (req,res) => {
  console.log(req.params.bio);
  User.updateOne({_id: req.user._id}, { $set: {bio: req.params.bio}},
    (err,result) => {
      if(err){
        res.send(err);
      }
      else{
        res.json({success: true});
      }
    }
  );
});

router.get('/api/get_link', passport.authenticate('jwt', {session: false}), async (req,res) => {
  const link = (await User.findById(req.user._id, 'link').exec()).link;
  res.json({success: true, link: link});
});

router.put('/api/update_link/:link', passport.authenticate('jwt', {session: false}), (req,res) => {
  //console.log(req.params.link);
  User.updateOne({_id: req.user._id}, { $set : {link: req.params.link}},
    (err,result) => {
      if(err){
        res.send(err);
      }
      else{
        res.json({success: true});
      }
    }
  );
});

router.get('/api/profile_link/:link', async (req,res) => {
  // First we need to get the user profile fields (all fields besides the getmes)
  
  const profile = await User.findOne({link: req.params.link}).exec();
  //const profile = await User.findById(req.params.link, 'firstname lastname email bio prof_photo_ids getme_views').exec();
  
  res.json({success: true, profile: profile});
});
/* 
router.get('/:link', (req,res) => {
  
}); */

module.exports = router;