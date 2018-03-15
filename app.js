var express = require('express');
// var layout = require('express-layout');
var path = require('path');
var dp = require('./db');
var user = require('./routes/user');
var routes = require('./routes/index');
var restaurant = require('./routes/restaurant');

var app = express();
app.locals.projectName = 'Foodstar';

// app.set('views', path.resolve(__dirname, 'layouts/admin'));
// console.log(__dirname);
// console.log(path);
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs'); // Load view engine
app.set('layout', 'layout');

/******** #Start routing *********/
app.use('/', routes);
app.use('/user',user);
app.use('/restaurant', restaurant);
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
