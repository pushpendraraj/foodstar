var express = require('express');
var router = express.Router();
var Restaurant = require('../models/Restaurant');

router.get('/list-restaurants', function(req, res, next){
    Restaurant.getResturants(function(err, result){
        if(err) return next(err);
        sess = req.session;
        var totalRestaurants = result.length,
		pageSize = 5,
		pageCount = result.length/pageSize,
        currentPage = 1,
        restaurantArrays = [], 
		restaurantList = [];
		
		//split list into groups
        while (result.length > 0) {
            restaurantArrays.push(result.splice(0, pageSize));
        }

        //set current page if specifed as get variable (eg: /?page=2)
        if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }

        //show list of restaurant from group
        restaurantList = restaurantArrays[+currentPage - 1];
        
        if(sess.isLoggedIn){
            res.render('restaurant/index',  {
                data: restaurantList,
                pageSize: pageSize,
                totalStudents: totalRestaurants,
                pageCount: pageCount,
                currentPage: currentPage
            });
        }else{
            res.redirect('/');
        }
    })
});

module.exports = router;