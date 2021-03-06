var express = require('express');
var router = express.Router();
var EmailTemplate = require('../models/EmailTemplate');

router.get('/list-templates', function(req, res, next){
    EmailTemplate.getTemplate({template_status : 'Active'}, '*', function(err, templates){
        if(err) return next(err)
        res.render('template/index.ejs',{templates:templates});
    })   
})

router.get('/view-template/:templateId', function(req, res, next){
    let templateId = req.params.templateId;
    EmailTemplate.getTemplate({template_id : templateId}, '*', function(err, result){
        if(err) return next(err)
        res.render('template/view.ejs',{template:result});
    }) 
})

module.exports = router;