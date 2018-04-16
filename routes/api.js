var express = require('express');
var router = express.Router();
var Restaurant = require('../models/Restaurant');
var EmailTemplate = require('../models/EmailTemplate');
var Blog = require('../models/Blog');
var Cuisine = require('../models/Cuisine');

router.get('/otp', function(req, res, next){
    let result = '8130606975';
    // if(err) return next(err);
    return res.send(result);
})

router.get('/list-restaurants', function(req, res, next){
    Restaurant.getResturants('status = 1 AND is_delete = 0', '*', function(err, result){
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

router.get('/list-blogs', function(req, res, next){
    Blog.getBlogs("status = 'Published'", function(err, result){
        if(err) return next(err)
        return res.send(result);
    })
})

router.get('/list-cuisines', function(req, res, next){
    Cuisine.getCuisines("1","*", function(err, result){
        if(err) return next(err)
        return res.send(result);
    })
})

router.get('/get-cuisines-by-id/:ids', function(req, res, next){
    let CuisIds = req.params.ids;
    Cuisine.geCuisinesByIds(CuisIds, '*', function(err, result){
        if(err) return next(err)
        return res.send(result);
    })
})

module.exports = router;