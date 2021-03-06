var express      = require( 'express' );
var async        = require( 'async' );
var path         = require( 'path' );
var favicon      = require( 'serve-favicon' );
var logger       = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser   = require( 'body-parser' );
var session      = require( 'express-session' );
var flash        = require( 'connect-flash' );
var passport     = require( 'passport' );
var multer       = require( 'multer' );
var app          = express();

require( './lib/debugLog' );


// Globals
global.__APPROOT__          = path.resolve( __dirname, "../");
global.__DB_CONNECTION__    = ( app.get("env") === "development") ? "mongodb://localhost/vumage" : "mongodb://admin:vumage2015@ds031581.mongolab.com:31581/heroku_app33182959";
global.__UPLOAD__           = multer( { dest: "./uploads"} );
global.__WINSTON__          = require("winston");
global.__ADMIN_PERMISSION__ = 10;


// Logging
__WINSTON__.add( __WINSTON__.transports.File, { filename: 'log.log' } );
__WINSTON__.remove( __WINSTON__.transports.Console );
__WINSTON__.level = "info";


// Local requires
var db          = require( './db' );
var _passport   = require( './passport' );
var email       = require( './lib/email' );
var controllers = require( './controllers/_controllers' );
var views       = require( './controllers/_views' );
var errors      = require( './controllers/_errors' );



// View engine setup
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'jade' );


// uncomment after placing your favicon in /public
//app.use( favicon( __dirname + '/public/favicon.ico' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser("keyboard cat") );
app.use( session( {
    secret : '1h23j1288f',
    resave: false,
    saveUninitialized: true
} ) );
app.use( express.static( path.join( __dirname, '../public' ) ) );
app.use( '/components', express.static( path.join( __dirname, '../bower_components' ) ) );
app.use( '/uploads', express.static( path.join( __dirname, '../uploads' ) ) );
app.use( flash() );
app.use( passport.initialize() );
app.use( passport.session() );


module.exports = function( cb ) {
    async.series([
        function( done ) { db( done );               },
        function( done ) { _passport( done );        },
        function( done ) { controllers( app, done ); },
        function( done ) { views( app,  done );      },
        function( done ) { errors( app, done );      },
        function()       { cb( app );                }
    ]);
};