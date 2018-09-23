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

router.get('/socket.io', function(req, res, next) {
  // Do nothing
});

/* GET home page. */
router.get('/', function(req, res, next) {

  // req.cookies[ID_PARAM] = undefined;
  let idCookie = req.cookies[ID_PARAM]
  let userId = idCookie || Date.now();
  userId = userId.toString();

  req.app.usersdb.findOne( { [ID_PARAM] : userId }, function(err, result) {
    if (err) {
      return res.status(500).send(err);
    }

    if (!idCookie) {
      // first time we've seen this device
      console.log("Cookieless request");
      if (result) {
        // name collision (really, will this ever happen?)
        console.log("user already exists somehow");
        userId += Math.floor(Math.random() * 1000);
      }
    }

    if (!result) {
      // Whether or not the user is actually new, they're missing from the DB.
      console.log("Adding new user " + userId);
      req.app.usersdb.insertOne( { [ID_PARAM] : userId, [VISITED_KEY] : [] }, function(err, result) {
        if (err) {
          return res.status(500).send(err);
        }

        console.log("REdirecting new user");
        // send the user to their new page
        return res.redirect('/u/' + userId);
      });
      fireEvent(req.app.io, EVENT_NEW_USER, userId);
    }
    else {
      // Existing user, send them to their page
      return res.redirect('/u/' + userId);
    }
  });
});

router.post('/', function(req, res, next) {
  return res.status(405).send("Can't POST /");
});

var graphNeedsUpdate = true;
var oldGraph = undefined;

// Get graph data for all users
router.get('/g/', function (req, res, next) {

  if (oldGraph && !graphNeedsUpdate) {
    return res.render('graph', { title: "Graph!!!", graphData: oldGraph, /* remove the str later */ 'graphDataStr' : JSON.stringify(oldGraph, null, 2) }); 
  }

  req.app.usersdb.find({}).toArray(function(err, result) {
    if (err) {
      return res.status(500).send(err);
    }
    graphNeedsUpdate = false;

    console.log("RESULTT");
    console.log(result);
    let graphdata = { 'nodes' : [], 'edges' : [] };
    var count = 0;
    var edgecount = 0;
    for (user of result) {
      let visited = user[VISITED_KEY];

      let node = {};
      node['id'] = user[ID_PARAM];
      node['label'] = count++;
      node['x'] = rand(0, result.length);
      node['y'] = rand(0, result.length);
      node['size'] = visited.length + 1;
      graphdata.nodes.push(node);

      for (visit of visited) {
        let edge = {};
        edge['id'] = edgecount++;
        edge['source'] = node['id'];
        edge['target'] = visit;
        graphdata.edges.push(edge);
      }
    }
    console.log("GraphData: " + util.inspect(graphdata));

    return res.render('graph', { title: "Graph!!!", graphData: graphdata, /* remove the str later */ 'graphDataStr' : JSON.stringify(graphdata, null, 2) });
  });
});

function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Get info for a specific user.
router.get('/u/:' + ID_PARAM, function(req, res, next) {

  const userId = req.params.id;
  console.log("GET User ID: " + userId);
  req.app.usersdb.find({}).toArray(function(err, result) {
    if (err) {
      return res.status(500).send(err);
    }
    console.log("FIND:");
    console.log(result);
  });
  req.app.usersdb.findOne({ [ID_PARAM] : userId }, function(err, result) {
    if (err) {
      return res.status(500).send(err);
    }
    else if (!result) {
      console.log(result);
      return res.status(404).send("No user with ID " + userId);
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
          // userId visited otherId - emit that event
          // could also emit the whole user object
          fireEvent(req.app.io, EVENT_NEW_VISIT, { [userId] : otherId });
          return res.status(201).send({ [STATUS_KEY] : "OK", user });
      });
    }
  });
});

function fireEvent(io, type, payload) {
  io.emit(type, payload);
  graphNeedsUpdate = true;

  const str = Date.now() + " " + type + " " + util.inspect(payload) + "\n\n";
  console.log("logging " + str);
  // TODO time
  fs.appendFile(path.join(__dirname, "../event.log"), str, function(err) {
    if (err) {
      console.error("FileSystem error");
      console.error(err);
    }
  });
}


module.exports = router;
