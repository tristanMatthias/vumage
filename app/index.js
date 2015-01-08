GLOBAL.__DB_CONNECTION__ = "mongodb://localhost/vimage"


var express      = require('express');
var async        = require('async');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var flash        = require('connect-flash');
var passport     = require('passport');


var app         = express();
var db          = require('./db');
var _passport   = require('./passport');
var controllers = require('./controllers/_controllers');
var views       = require('./controllers/_views');
var errors      = require('./controllers/_errors');




require('./lib/debugLog');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("keyboard cat"));
app.use(session({secret : 'keyboard cat'}));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/components', express.static(path.join(__dirname, '../bower_components')));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


module.exports = function(cb) {
    async.series([
        function(done) { db(done); },
        function(done) { _passport(done); },
        function(done) { controllers(app, done); },
        function(done) { views(app,  done); },
        function(done) { errors(app, done); },
        function()     { cb(app); }
    ]);
};