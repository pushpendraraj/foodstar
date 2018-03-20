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
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs'); // Load view engine
app.set('layouts', './layouts/layout');
app.set('layout', 'default');

app.use(function(req, res, next){
    // console.log(req.route.get);
    // console.log(req.originalUrl);
    app.locals.userSession = req.session.userSession;
    app.locals.isLoggedIn = req.session.isLoggedIn;
    app.locals.host = req.protocol + '://' +req.get('host');
    next()
})

/******** #Start routing *********/
var routes = require('./routes/index');
var user = require('./routes/user');
var restaurant = require('./routes/restaurant');
var customer = require('./routes/customer');

app.use('/', routes);
app.use('/user', user);
app.use('/restaurant', restaurant);
app.use('/customer', customer);
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
