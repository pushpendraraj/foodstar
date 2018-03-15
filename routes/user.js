var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.post('/add-user',function(req, res, next){
    data = {
        email : req.body.email,
        password : req.body.password
    };
    User.loginUser(data,function(err, result){
        if (err) return next(err);
        res.json(result);
    })
});

router.get('/list-user',function(req, res, next){
    User.getUsers(function(err, result){
        if (err) return next(err);
        res.send(result);
    })
});

module.exports = router;
