var express = require('express');
var router = express.Router();
var Restaurant = require('../models/Restaurant');
var EmailTemplate = require('../models/EmailTemplate');

router.get('/list-restaurants', function(req, res, next){
    Restaurant.getResturants(function(err, result){
        if(err) return next(err)
        return res.send(result);
    });
})
router.get('/list-templates', function(req, res, next){
    EmailTemplate.getTemplate({template_status : 'Active'}, '*', function(err, templates){
        if(err) return next(err)
        res.send({templates:templates,recordsTotal:6});
    })
})

module.exports = router;