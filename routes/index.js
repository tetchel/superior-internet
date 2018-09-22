var express = require('express');
var router = express.Router();

const ID_PARAM = "id";

/* GET home page. */
router.get('/', function(req, res, next) {
  const userid = Date.now();
  res.cookie(ID_PARAM, userid);

  // see if this seed is taken already
  req.app.db.find( { [userid] : {} }).toArray(function(err, result) {
    if (err) {
      console.log(err);
    }

    const existing = typeof(result) !== 'undefined' && result.length > 0;
    if (existing) {
      console.log("user already exists somehow");
      userid += Math.floor(Math.random() * 1000);
    }

    console.log("Adding new user " + userid);
    req.app.db.insertOne( { [userid] : {} })
  });

  res.render('index', { title: 'Express' });
  
});

router.get('/u/:' + ID_PARAM, function(req, res, next) {
  res.send("you're " + req.params[ID_PARAM]);
});

/*
router.post('/u/:' + ID_PARAM, function(req, res, next) {
  console.log(req.params);
  res.send("added " + req.params[ID_PARAM]);
});
*/

module.exports = router;
