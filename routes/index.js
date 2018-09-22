var express = require('express');
var router = express.Router();

const fs = require('fs');
const path = require('path');
const util = require('util');

const ID_PARAM = "id";
const VISITED_KEY = "visited";
const STATUS_KEY = "status";

// how to include these in multiple files easily?
const EVENT_NEW_USER = "new-user";
const EVENT_NEW_VISIT = "new-visit";

/* GET home page. */
router.get('/', function(req, res, next) {

  let idCookie = req.cookies[ID_PARAM]
  let userId = idCookie || Date.now();

  req.app.usersdb.findOne( { [ID_PARAM] : userId }, function(err, result) {
    if (err) {
      return res.status(500).send(err);
    }

    if (!idCookie) {
      // first time we've seen this device
      if (result) {
        // name collision (really, will this ever happen?)
        console.log("user already exists somehow");
        userId += Math.floor(Math.random() * 1000);
      }
    }

    if (!result) {
      // Whether or not the user is actually new, they're missing from the DB.
      console.log("Adding new user " + userId);
      req.app.usersdb.insertOne( { [ID_PARAM] : userId, [VISITED_KEY] : [] });
      fireEvent(req.app.io, EVENT_NEW_USER, userId);
    }
    else {
      // We already know this device. Nothing to do here right now.
    }

    // send the user to their page
    res.redirect('/u/' + userId);
  });
});

router.get('/g/', function(req, res, next) {
  return res.send("This is where my graph would go... IF I HAD ONE!!");
});

// Get info for all users.
router.get('/u/', function (req, res, next) {
  req.app.usersdb.find({}).toArray(function(err, result) {
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
  req.app.usersdb.findOne({ [ID_PARAM] : userId }, function(err, result) {
    if (err) {
      return res.status(500).send(err);
    }
    else if (!result) {
      return res.status(400).send("No user with ID " + userId);
    }

    return res.render('user', { title: userId, user: userId, visited: util.inspect(result.visited), data: util.inspect(result) })
  });
});

router.get('/v/*', function(req, res, next) {
  return res.status(405).send("Can only POST to /visited/*");
});

const OTHER_ID_PARAM = 'otherUserId';

// Record that a user has visited another user. No duplicates (or counts) for now -
// ie subsequent visits from one user to the same user have no effect.
router.post('/v/:' + OTHER_ID_PARAM, function(req, res, next) {
  const userId = req.cookies[ID_PARAM];
  if (!userId) {
    return res.status(400).send("No UserID cookie specified!");
  }
  const otherId = req.params[OTHER_ID_PARAM];

  // check if the user already visited other user
  req.app.usersdb.findOne({ [ID_PARAM] : userId, [VISITED_KEY] : {$elemMatch : { $eq : otherId }} }, function(err, result) {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    if (result) {
      return res.send({ [STATUS_KEY] : "OK", result });
    }
    else {
      // record new visit
      // How to do this with just one find() ?
      req.app.usersdb.findOneAndUpdate(
        { [ID_PARAM] : userId },        // find parameter
        { $addToSet : { [VISITED_KEY] : otherId } },   // update operation
        { upsert : true, returnOriginal: false  },     // mongo options
        function (err, result) {
          if (err) {
            console.error(err);
            return res.status(500).send(err);
          }

          const user = result.value;
          fireEvent(req.app.io, EVENT_NEW_VISIT, user);
          return res.status(201).send({ [STATUS_KEY] : "OK", user });
      });
    }
  });
});

function fireEvent(io, type, payload) {
  io.emit(type, payload);

  const str = type + " " + util.inspect(payload) + "\n\n";
  console.log("logging " + str);
  fs.appendFile(path.join(__dirname, "../event.log"), str, function(err) {
    if (err) {
      console.error("FileSystem error");
      console.error(err);
    }
  });
}


module.exports = router;
