
var express = require('express');
var session = require('express-session');
var cookieSession = require('cookie-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sql = require('mssql');
var cors = require('cors');
var fs = require('fs');

var fjapan = require('./fjapan');
const passport = require('passport');
var jwt = require('jsonwebtoken');

var config = require('./db_config');
var mediaPath = __dirname+'/';


// var http = require('http').Server(express);
// var io = require('socket.io')(http);




// Get our API routes
// const api = require('./routes/api');
const login = require('./routes/app_api_login');
const member = require('./routes/app_api_member');
const product = require('./routes/app_api_product');
const product_image = require('./routes/app_api_product_image');
const category = require('./routes/app_api_category');
const shipping = require('./routes/app_api_shipping');
const questionnaire = require('./routes/app_api_questionnaire');
const order = require('./routes/app_api_order');
const order_detail = require('./routes/app_api_order_detail');
const contact = require('./routes/app_api_contact');
const subscribe = require('./routes/app_api_subscribe');
//const contact_send_mail = require('./routes/app_api_contact_send_mail');

var app = express();

app.use(cors());
app.use(logger('dev'));
// Parsers for POST data
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(cookieParser());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./passport.js')(passport);

// Point static path to dist
app.use('/', express.static(__dirname + '/../dist'));
// app.use(express.static(path.join(__dirname, '../dist')));
app.use('/images_member', express.static(__dirname + '/routes/member_image'));
app.use('/images_product', express.static(__dirname + '/routes/product_image'));
app.use('/images_category', express.static(__dirname + '/routes/category_image'));


// // Session setup
// app.use( session({
//   secret: 'kibitoweb',
//   resave: true,
//   saveUninitialized: true,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24,
//     secure: false,
//   },
//   //store: new mongostore({ url: mongoDbUrl })
// }));


// app.use(cookieSession({
//   name: 'session',
//   keys: ['kibitoweb'],
//
//   // Cookie Options
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }))

// Set our api routes
// app.use('/api', api);
app.use('/', login);
app.use('/', member);
app.use('/', product);
app.use('/', product_image);
app.use('/', category);
app.use('/', shipping);
app.use('/', questionnaire);
app.use('/', order);
app.use('/', order_detail);
app.use('/', contact);
app.use('/', subscribe);
//app.use('/', contact_send_mail);


app.get('/', function(req, res){
    res.send('hello ROOT world');
    console.log('root');
});

// /* test session */
// app.get('/test', function(req, res){
//     console.log(req.session.useranme);
//     if(req.session.username) {
//       res.send('admin ROOT');
//       console.log('root');
//       console.log(req.cookies);
//       console.log(req.session);
//       req.session.test = 'test';
//       console.log('session test = ',req.session.test);
//     }
//     else{
//       res.send('cannot access');
//     }
// });
//
// app.get('/test2', function(req, res){
//   req.session.username = 'test';
//   res.send('login ROOT');
//
// });
//
// app.get('/test3', function(req, res){
//   req.session.destroy();
//   res.send('logout ROOT');
//
// });
// /* test session */




// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


app.get('/member_image', function(req, res){
  res.sendFile(__dirname + '/member_image');
});


//check database connect
var conn = new sql.Connection(config);
conn.connect(function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log('connect mssql success');
    }
});

// sql.connect(config).then(function() {
//     console.log('connected !! mssql')
// }).catch(function(err) {
//     // ... error checks
//     console.log(err)
// });

// Catch all other routes and return the index file
// all other routes are handled by Angular
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname,'/../dist/index.html'));
});

// // serve angular front end files from root path
// router.use('/', express.static('app', { redirect: false }));
//
// // rewrite virtual urls to angular app to enable refreshing of internal pages
// router.get('*', function (req, res, next) {
//     res.sendFile(path.resolve('app/index.html'));
// });
// http://jasonwatmore.com/post/2017/02/24/angular-2-refresh-without-404-in-node-iis

// Set NODE_ENV = "production"
// console.log(process.env.NODE_ENV);

app.set('port', (process.env.PORT || 3002));

app.listen(app.get('port'), function() {
  console.log('Angular 2 Full Stack listening on port '+app.get('port'));
});

module.exports = app;
