var express = require('express');
var router = express.Router();
var Customer = require('../models/Customer');

router.get('/list-customers',function(req, res, next){
    Customer.getCustomers(function(err, result){
        if(err) return next(err)
        res.render('customer/index.ejs',{'data':result})
    })
})

router.all('/add-customer', function(req, res, next){
    if(req.method=='GET'){
        res.render('customer/addCustomer.ejs');
    }else{
        let values = '"'+req.body.customer_name+'", "'+req.body.email+'", "'+req.body.contact_no+'", "'+req.body.gender+'"';
        Customer.addCustomer(values, function(err, result){
            if(err) return next(err)
            res.json(result);
        })
        res.redirect('/customer/list-customers');
    }
})

module.exports = router;