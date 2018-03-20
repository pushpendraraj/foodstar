var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  let userData = {
      email:req.body.email,
      password:''
  }
    res.render('home/index', userData);
});

router.get('/dashboard', function(req, res, next) {
  sess = req.session;
  if(sess.isLoggedIn){
    res.render('dashboard/index', { });
  }else{
    res.redirect('/');
  }
});

module.exports = router;