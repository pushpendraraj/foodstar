var express = require('express');
var router = express.Router();
var Customer = require('../models/Customer');
var transporter = require('../mailer');
var passwordHash = require('password-hash');

router.get('/list-customers',function(req, res, next){
    Customer.getCustomers(function(err, result){
        if(err) return next(err)

        // setup email data with unicode symbols
        // let mailOptions = {
        //     from: '"Fred Foo 👻" <rajput.pushpendra62@gmail.com>', // sender address
        //     to: 'rajput.pushpendra62@gmail.com, rajput.pushpendra61@gmail.com', // list of receivers
        //     subject: 'Hello ✔', // Subject line
        //     text: 'Hello world?', // plain text body
        //     html: '<b>Hello world?</b>', // html body
        //     attachments : [{filename:'text1.txt',content:'Hello World!'}]
        // };

        // // send mail with defined transport object
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         return console.log(error);
        //     }
        //     console.log('Message sent: %s', info.messageId);
        //     // Preview only available when sending through an Ethereal account
        //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        // });
        res.render('customer/index.ejs',{'data':result})
    })
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
            'customer_name':req.body.customer_name,
            'email':req.body.email,
            'contact_no':req.body.contact_no,
            'gender':req.body.gender,
            'password':'',
            'contact_address':req.body.contact_address,
            'dob':req.body.dob,
            'customer_status':req.body.customer_status
        };

        req.assert("email", "Enter a valid email.").isEmail();
        req.assert("customer_name", "Enter a valid name.").notEmpty();
        req.assert("password", "Enter a valid password.").notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            errors.forEach(function(error) {
                req.flash(error.param, error.msg)
            })
            res.render('customer/addCustomer.ejs', userData);
        } else {
            Customer.addCustomer(userData, function(err, result){
                if(err) return next(err)
                res.redirect('/customer/list-customers');
            })
        }
    }
})

module.exports = router;