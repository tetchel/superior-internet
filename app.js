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

const dbUrl = 'mongodb://localhost:27017/';
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
    return;
  }

  console.log("Connected successfully to DB");
 
  app.db = client.db(dbName).collection(usersCollection);
 
  // client.close();
});

const http = require('http').Server(app);
const io = require('socket.io')(http);
app.io = io;

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



module.exports = app;
