var express = require('express');
var router = express.Router();
var Restaurant = require('../models/Restaurant');

router.get('/list-restaurants', function(req, res, next){
    Restaurant.getResturants(function(err, result){
        if(err) return next(err);
        sess = req.session;
        if(sess.isLoggedIn){
            res.render('restaurant/index', {'data':result});
        }else{
            res.redirect('/');
        }
    })
});

module.exports = router;