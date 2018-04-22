var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var dp = require('./db');
var app = express();
var config = require('./config');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var validator = require('express-validator');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var xlsx = require('node-xlsx').default;
const workSheetsFromFile = xlsx.parse(`${__dirname}/book1.xlsx`);
// console.log(workSheetsFromFile[0].data);

passport.use(new FacebookStrategy({
    clientID: '231755977205378',
    clientSecret: 'aa6c0e4dd920fad129ae31317ad2a044',
    callbackURL: "http://localhost:8081/auth/facebook/callback",
    profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName', 'about', 'gender', 'profileUrl'], 
  },
  function(accessToken, refreshToken, profile, cb) {
      // console.log(profile);
      let userData = {
        'customer_role_id':3,
        'customer_name':profile.displayName,
        'email':profile.emails[0].value,
        'contact_no':8130606975,
        'gender':profile.gender,
        'password':'123456',
        'contact_address':'',
        'dob':'',
        'customer_status':1,
        'is_contact_verified':0,
        'customer_added_date':new Date(),
        'customer_modified_date':new Date(),
      }
      let Customer = require('./models/Customer');
      Customer.addCustomer(userData, function(err, result){
        if(err) return next(err)
        // res.redirect('/');
        // app.redirect
        // app.get('/')
    })
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      // return cb(err, user);
    // });
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook', { 
    failureRedirect: '/'
  })
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
      // console.log(res);
      console.log('done')
    // Successful authentication, redirect home. 
    res.redirect('/');
  });


app.locals.configuration = config;
var sess;
app.use(cookieParser('dsflsdfiou4357894'))
app.use(session({ 
    secret: 'dsflsdfiou4357894',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(flash())
app.use(validator());
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs'); // Load view engine
app.set('layouts', './layouts/layout');
app.set('layout', 'default');

app.use(function(req, res, next){
    app.locals.userSession = req.session.userSession;
    app.locals.isLoggedIn = req.session.isLoggedIn;
    app.locals.host = req.protocol + '://' +req.get('host');
    app.locals.userSession = {};
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    next()
})

/******** #Start routing *********/
var routes = require('./routes/index');
var user = require('./routes/user');
var restaurant = require('./routes/restaurant');
var customer = require('./routes/customer');
var template = require('./routes/template');
var api = require('./routes/api');

app.use('/', routes);
app.use('/user', user);
app.use('/restaurant', restaurant);
app.use('/customer', customer);
app.use('/template', template);
app.use('/api', api);
/******** #End Routing *********/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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

// create server 
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("listening at http://%s:%s", host, port)
});

module.exports = app;
