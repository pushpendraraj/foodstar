var express = require('express');
var router = express.Router();
var Customer = require('../models/Customer');
var transporter = require('../mailer');
var passwordHash = require('password-hash');
var session = require('express-session');
var multer = require('multer');
var UPLOAD_PATH = 'public/images/';
let imageFilter = function (req, file, cb) {    
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
}

let storage = multer.diskStorage({
    destination: UPLOAD_PATH,
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now()+'.'+extension)
    }
})

var upload = multer({
    fileFilter: imageFilter,
    storage: storage
}); // multer configuration

router.get('/list-customers',function(req, res, next){
    sess = req.session;
    if(sess.isLoggedIn){
        Customer.getCustomerDetails('1','*',function(err, result){
            if(err) return next(err)
            res.render('customer/index.ejs',{'data':result})
        })
    }else{
        res.redirect('/');
    }
})

router.all('/add-customer', function(req, res, next){
        let userData = {
            'customer_name':'',
            'email':'',
            'contact_no':'',
            'gender':'',
            'password':'',
            'contact_address':'',
            'dob':'',
            'customer_status':''
        };

        if(req.method=='GET'){
            res.render('customer/addCustomer.ejs',userData);
        }else{
            let userData = {
                'customer_role_id':3,
                'customer_name':req.body.customer_name,
                'email':req.body.email,
                'contact_no':req.body.contact_no,
                'gender':req.body.gender,
                'password':(req.body.password =='')?'':passwordHash.generate(req.body.password),
                'contact_address':req.body.contact_address,
                'dob':req.body.dob,
                'customer_status':req.body.customer_status,
                'is_contact_verified':0,
                'customer_added_date':new Date(),
                'customer_modified_date':new Date(),
            };

            req.assert("email", "Enter a valid email.").isEmail();
            req.assert("customer_name", "Enter a valid name.").notEmpty();
            req.assert("password", "Enter a valid password.").notEmpty();
            req.assert("contact_no", "Enter a valid mobile.").isNumeric();
            var errors = req.validationErrors();
            if (errors) {
                errors.forEach(function(error) {
                    req.flash(error.param, error.msg)
                })
                res.render('customer/addCustomer.ejs', req.body);
            } else {
                Customer.addCustomer(userData, function(err, result){
                    if(err) return next(err)
                    res.redirect('/customer/list-customers');
                })
            }
    }
})

router.all('/login', function(req, res, next){
    if(req.method =='POST'){
        let userData = {
            'email':req.body.email,
            'password':passwordHash.generate(req.body.password)
        }

        req.assert('email','please enter a valid email.').isEmail();
        req.assert('password','password is required.').notEmpty();
        var errors = req.validationErrors();

        if(errors){
            errors.forEach(function(error){
                req.flash(error.param, error.msg)
            });
            res.render('home/index.ejs', req.body);
        }else{
            Customer.getCustomerDetails('*', 'email= "'+req.body.email+'" AND customer_status = 1', function(err, result){
                if(err) return next(err)
                if(result.length > 0 && passwordHash.verify(req.body.password, result[0].password)){   
                    sess=req.session;
                    sess.isLoggedIn = true;
                    sess.userSession = result[0];
                    res.redirect('/dashboard/');
                }else{
                    req.flash('email', 'Invalid username or password.');
                    res.render('home/index.ejs', req.body);
                }
            })
        }
    }else{
        res.redirect('/');
    }
})

router.get('/logout',function(req, res, next){
    req.session.destroy(function(err) {
        if(err) {
            return next(err)
        } else {
            res.redirect('/');
        }
    })
})

router.all('/profile', upload.single('profile_pic'), function(req, res, next){
    if(req.method=="POST"){
        let sass = req.session;
        let custId = sass.userSession.customer_id;
        Customer.updateCustomer({'profile_pic':req.file.filename},{'customer_id':custId}, function(err, result){
            if(err) return next(err)
            req.flash('success', 'image updated successfully!');
            res.render('customer/profile');
        })
    }else{
        res.render('customer/profile');
    }
})

module.exports = router;