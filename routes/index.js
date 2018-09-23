var express = require('express');
var router = express.Router();

const fs = require('fs');
const path = require('path');
const util = require('util');
const namegen = require('gfycat-style-urls')

const ID_PARAM = "id";
const VISITED_KEY = "visited";
const STATUS_KEY = "status";
const STATUS_OK = "OK";

// how to include these in multiple files easily?
const EVENT_NEW_USER = "new-user";
const EVENT_NEW_VISIT = "new-visit";

router.get('/socket.io', function(req, res, next) {
  // Do nothing
});

router.get('/favicon.ico', function(req, res, next) {
  var img = fs.readFileSync('public/favicon.ico');
  res.writeHead(200, {'Content-Type': 'image/x-icon' });
  return res.end(img, 'binary');
});

/* GET home page. */
router.get('/', function(req, res, next) {

  // req.cookies[ID_PARAM] = undefined;
  let idCookie = req.cookies[ID_PARAM];
  let userId = idCookie || namegen.generateCombination(2, '', true);
  userId = userId.toString();

  req.app.usersdb.findOne( { [ID_PARAM] : userId }, function(err, result) {
    if (err) {
      return res.status(500).send(err);
    }

    if (!idCookie) {
      // first time we've seen this device
      console.log("Cookieless request");
      // Give them a cookie
      res.cookie(ID_PARAM, userId);
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

        fireEvent(req.app.io, EVENT_NEW_USER, userId);
        console.log("Redirecting new user");
        // send the user to their new page
        return res.redirect('/u/' + userId);
      });
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

  /*
  var contype = req.headers['content-type'];
  var returnJson = false;
  if (contype && contype.indexOf('application/json') >= 0) {
    returnJson = true;
  }*/

  if (oldGraph && !graphNeedsUpdate) {
      return res.json(oldGraph);
  }

  req.app.usersdb.find({}).toArray(function(err, result) {
    if (err) {
      return res.status(500).send(err);
    }
    graphNeedsUpdate = false;

    let graphdata = { 'nodes' : [ { id : 'root', label : 'alt.net', x : 0, y : 0, size : result.length } ], 'edges' : [] };
    // var count = 0;
    let cols = 5;
    var x = 0;
    var y = 0;
    var edgecount = 0;
    for (user of result) {
      let visited = user[VISITED_KEY];
      if (typeof(visited) === 'undefined') {
        visited = [];
      }

      let node = {};
      node['id'] = user[ID_PARAM];
      let shortname = user[ID_PARAM].replace(/[a-z]/g, '');   // the shortname is just the first letter of each world == the capital letters
      node['label'] = shortname;

      x++;
      if (x === cols) {
        x = 0;
        y++;
      }

      node['x'] = x;
      node['y'] = y;
      node['size'] = visited.length + 1;
      graphdata.nodes.push(node);
      graphdata.edges.push( { id: edgecount++, source: node['id'], target: 'root'} )

      for (visit of visited) {
        let edge = {};
        edge['id'] = edgecount++;
        edge['source'] = node['id'];
        edge['target'] = visit;
        graphdata.edges.push(edge);
      }
    }
    console.log("GraphData: " + util.inspect(graphdata));
    
    return res.json(graphdata);
  });
});

function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

router.get('/u/:' + ID_PARAM, function(req, res, next) {

  const userBeingVisited = req.params.id;
  const userVisiting = req.cookies[ID_PARAM];
  if (!userVisiting) {
    // you got to get a user id first
    return res.redirect('/');
  }
  
  if (userBeingVisited === 'root') {
    return res.redirect('/u/' + userVisiting);
  }

  console.log("GET User ID: " + userBeingVisited);

  req.app.usersdb.findOne({ [ID_PARAM] : userBeingVisited }, function(err, result) {
    if (err) {
      return res.status(500).send(err);
    }
    else if (!result) {
      console.log(result);
      return res.status(404).send("No user with ID " + userBeingVisited);
    }

    var title;
    console.log("UserBV " + userBeingVisited + " UserV " + userVisiting);
    if (userBeingVisited != userVisiting) {
      console.log(userVisiting + " is visiting " + userBeingVisited);
      title = userBeingVisited + "'s page";

      // check if the user already visited other user
      req.app.usersdb.findOne({ [ID_PARAM] : userVisiting, [VISITED_KEY] : {$elemMatch : { $eq : userBeingVisited }} }, function(err, result) {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }

        // Take no action, and return the old visited data, if this visit had no effect
        // because the visit already occurred
        if (!result) {
          // record new visit
          // How to do this with just one find() ?
          req.app.usersdb.findOneAndUpdate(
            { [ID_PARAM] : userVisiting },        // find parameter
            { $addToSet : { [VISITED_KEY] : userBeingVisited } },   // update operation
            { upsert : true, returnOriginal: false  },     // mongo options
            function (err, result) {
              if (err) {
                console.error(err);
                return res.status(500).send(err);
              }

              // userId visited otherId - emit that event
              // could also emit the whole user object
              fireEvent(req.app.io, EVENT_NEW_VISIT, { [userVisiting] : userBeingVisited });
              // return res.status(201).send({ [STATUS_KEY] : STATUS_OK, user });
          });
        }
      });
    }
    else {
      title = "Welcome to your page, " + userVisiting;
    }

    return res.render('user', { title: title, user: userBeingVisited, visited: util.inspect(result.visited), data: util.inspect(result) })
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
