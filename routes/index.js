var express = require('express');
var router = express.Router();

const ID_PARAM = "id";
const EVENT_NEW_USER = "new-user";
const EVENT_NEW_VISIT = "new-visit";
const VISITED_KEY = "visited";

/* GET home page. */
router.get('/', function(req, res, next) {

  const idCookie = req.cookies[ID_PARAM]
  const userId = idCookie || Date.now();

  req.app.db.findOne( { [ID_PARAM] : userId }, function(err, result) {
    if (err) {
      return res.status(500).send(err);
    }

    if (!idCookie) {
      // first time we've seen this device
      const existing = typeof(result) !== 'undefined'; //&& result.length > 0;
      if (existing) {
        // name collision (really, will this ever happen?)
        console.log("user already exists somehow");
        userId += Math.floor(Math.random() * 1000);
      }
    }

    const isNew = !result;
    if (!result) {
      // Whether or not the user is actually new, they're missing from the DB.
      console.log("Adding new user " + userId);
      req.app.db.insertOne( { [ID_PARAM] : userId, [VISITED_KEY] : [] });
      req.app.io.emit(EVENT_NEW_USER, userId);
    }
    else {
      // We already know this device. Nothing to do here right now.
    }

    // Replace this with the homepage, or whatever.
    return res.render('index', { title: 'Express',  id : userId, isNew : isNew });
  });
});

// Get info for all users.
router.get('/u/', function (req, res, next) {
  req.app.db.find({}).toArray(function(err, result) {
    if (err) {
      return res.status(500).send(err);
    }
    
    return res.send(result);
  });
});

// Get info for a specific user.
router.get('/u/:' + ID_PARAM, function(req, res, next) {

  const userId = req.params.id;
  console.log("GET User ID: " + userId);
  req.app.db.findOne({ [userId] : {} }, function(err, result) {
    console.log("RESULT");
    console.log(result);
    if (err) {
      return res.status(500).send(err);
    }
    else if (!result) {
      console.log("UGH");
      return res.status(400).send("User not found " + userId);
    }

    return res.send(result.visited);
  });
});

const OTHER_ID_PARAM = 'otherUserId';

// Record that a user has visited another user. No duplicates (or counts) for now - 
// ie subsequent visits from one user to the same user have no effect.
router.post('/visited/:' + OTHER_ID_PARAM, function(req, res, next) {
  const userId = req.cookies[ID_PARAM];
  if (!userId) {
    return res.status(400).send("No UserID cookie specified!");
  }
  const otherId = req.params[OTHER_ID_PARAM];
  
  req.app.db.findOneAndUpdate( 
    { [ID_PARAM] : userId },        // find parameter
    { $addToSet : { [VISITED_KEY] : otherId } },  // update operation
    { upsert : true, returnOriginal: false },      // mongo options
    function (err, result) {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      console.log(result);

      const updatedUser = result.value;
      req.app.io.emit(EVENT_NEW_VISIT, updatedUser);
      return res.send({ "status": "OK", updatedUser });
  });
  
});


module.exports = router;
