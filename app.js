var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

const MongoClient = require('mongodb').MongoClient

const dbUrl = 'mongodb://altnet:topsecret@localhost:27017/dbb';
const dbName = 'dbb';
const usersCollection = 'users';

MongoClient.connect(dbUrl, {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  },
  function(err, client) {
    if (err) {
      console.log("DB INIT ERR");
      console.log(err);

      app.usersdb = {
        findOne: function(object, callback) {
          callback(undefined, "Dummy findOne result");
        },
        find: function(object, callback) {
          callback(undefined, "Dummy find result");
        },
        insert: function(object, callback) {
          callback(undefined, "Dummy insert result");
        }
      };
      console.log("using dummy db");
    }
    else {  
      console.log("Connected successfully to DB at " + dbUrl);

      app.usersdb = client.db(dbName).collection(usersCollection);
    }


    // client.close();
  });


app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// register socketio and listeners

const http = require('http').Server(app);
const io = require('socket.io')(http);
app.io = io;

module.exports = app;
