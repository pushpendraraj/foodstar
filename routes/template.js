var express = require('express');
var router = express.Router();
var EmailTemplate = require('../models/EmailTemplate');

router.all('/list-templates', function(req, res, next){
    EmailTemplate.getTemplate({template_status : 'Active'}, '*', function(err, templates){
        if(err) return next(err)
        res.render('template/index.ejs',{templates:templates});
    })   
})

module.exports = router;