var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('home/index', { });
});

router.get('/dashboard', function(req, res) {
  res.render('dashboard/index', { });
});

module.exports = router;