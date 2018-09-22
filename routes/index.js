var express = require('express');
var router = express.Router();

const ID_PARAM = "id";
const EVENT_NEW_USER = "new-user";

/* GET home page. */
router.get('/', function(req, res, next) {

  const isNewUser = !req.cookies[ID_PARAM]

  // const isNewUser = true;     // just for testing

  if (isNewUser) {
    const userId = Date.now();
    res.cookie(ID_PARAM, userId);
  
    // Create the new user into the users database
    req.app.db.find( { [userId] : {} }).toArray(function(err, result) {
      if (err) {
        console.log(err);
        return;
      }

      // see if this userid is taken already
      const existing = typeof(result) !== 'undefined' && result.length > 0;
      if (existing) {
        console.log("user already exists somehow");
        userId += Math.floor(Math.random() * 1000);
      }

      console.log("Adding new user " + userId);
      // TODO user data other than empty object
      req.app.db.insertOne( { [userId] : {} })
      req.app.io.emit(EVENT_NEW_USER, userId);

      return res.render('index', { title: 'Express',  id : userId, isNew : true });
    });
  }
  else {
    return res.render('index', { title: 'Express',  id : req.cookies[ID_PARAM], isNew : false });
  }

  
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
