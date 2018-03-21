var express = require('express');
var router = express.Router();
var Restaurant = require('../models/Restaurant');

router.get('/list-restaurants', function(req, res, next){
    Restaurant.getResturants(function(err, result){
        if(err) return next(err);
        sess = req.session;
        var totalStudents = 80,
		pageSize = 8,
		pageCount = 80/8,
        currentPage = 1,
        studentsArrays = [], 
		studentsList = [];
		
		//split list into groups
	while (result.length > 0) {
	    studentsArrays.push(result.splice(0, pageSize));
	}

	//set current page if specifed as get variable (eg: /?page=2)
	if (typeof req.query.page !== 'undefined') {
		currentPage = +req.query.page;
	}

	//show list of students from group
	studentsList = studentsArrays[+currentPage - 1];
        
        if(sess.isLoggedIn){
            res.render('restaurant/index',  {
                data: studentsList,
                pageSize: pageSize,
                totalStudents: totalStudents,
                pageCount: pageCount,
                currentPage: currentPage
            });
        }else{
            res.redirect('/');
        }
    })
});

module.exports = router;