var express = require('express');
var router = express.Router();
var Restaurant = require('../models/Restaurant');
var EmailTemplate = require('../models/EmailTemplate');
var Blog = require('../models/Blog');
var Cuisine = require('../models/Cuisine');
var Customer = require('../models/Customer');
var passwordHash = require('password-hash');
var transporter = require('../mailer');
var generator = require('generate-password');
var smsGateway = require('sms-gateway-nodejs')('rajput.pushpendra62@gmail.com', '123456');

router.get('/otp', function(req, res, next){
    let newOtp = Math.floor((Math.random() * 1000000) + 1);
    smsGateway.message.sendMessageToNumber(configuration.smsDeviceId, '+918130606975', 'Hello User Your new otp is '+newOtp)
    .then((response) => {
        return res.send({data:newOtp, response:response});
    })
    .catch((error) => {
        return res.send(error);
    });
});

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

router.post('/register-user', function(req, res, next){
    if(req.body){
        req.assert('email', configuration.notificationMessages.invalidEmail).isEmail();
        req.assert('contactNo', configuration.notificationMessages.invalidMobile).isNumeric();
        req.assert('fullName', configuration.notificationMessages.requiredFullname).notEmpty();
        req.assert('password', configuration.notificationMessages.requiredPassword).notEmpty();
        let errors = req.validationErrors();
        if(errors){
            res.send({register:false,message:configuration.notificationMessages.invalidFieldValues});
        }else{
            Customer.isCustomerExist('email= "'+req.body.email+'" AND customer_status = 1', function(err, result){
                if(err) return res.send({register:false, message:configuration.notificationMessages.serverError});

                if(result[0].count >0 ){
                    res.send({register:false,message:configuration.notificationMessages.emailExist});
                }else{
                    let userData = {
                        'customer_role_id':3,
                        'customer_name':req.body.fullName,
                        'email':req.body.email,
                        'contact_no':req.body.contactNo,
                        'gender':null,
                        'password':(req.body.password =='')?'':passwordHash.generate(req.body.password),
                        'contact_address':'',
                        'dob':'',
                        'customer_status':1,
                        'is_contact_verified':0,
                        'customer_added_date':new Date(),
                        'customer_modified_date':new Date(),
                    };
            
                    Customer.addCustomer(userData, function(err, result){
                        if(err) return res.send({register:false, message:configuration.notificationMessages.serverError});
                        
                        let promise1 = new Promise((resolve, reject)=>{
                            EmailTemplate.getTemplate({template_key:'customer_register'}, '*', function(err, result){
                                if(err) return res.send({register:false, message:configuration.notificationMessages.serverError});
                                
                                let tplData = result[0];            
                                //setup email data with unicode symbols
                                let emailBody = tplData.email_body;
                                let customerName = userData.customer_name;
                                let tomail = userData.email;
                                // emailBody = emailBody.replace('{email}', userData.email);
                                // emailBody = emailBody.replace('{customer_name}', customerName);
                                // emailBody = emailBody.replace('{password}', req.body.password);
                                let from_email = tplData.from_email;
                                let from_name = tplData.from_name;
                                let email_subject = tplData.email_subject;
                            
                                let mailOptions = {
                                    from: `${from_name} < ${from_email} >`, // sender address
                                    to: `${tomail}`, // list of receivers
                                    subject: `${email_subject} : ${configuration.projectName}`, // Subject line
                                    html: emailBody, // html body
                                };
                
                                // send mail with defined transport object
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if(error) return res.send({register:false, message:configuration.notificationMessages.serverError});

                                    resolve('Email send successfully.');
                                });
                            });    
                        });
            
                        let promise2 = new Promise((resolve, reject)=>{
                            if(configuration.notificationMessages.enableMessage){
                                resolve('Message send successfully');
                            }else{
                                resolve('Message api is disable');
                            }  
                        });
                        
                        Promise.all([promise1, promise2])
                        .then((values)=>{
                            let message = configuration.notificationMessages.userResiterSuccessNotify;
                            return res.send({register:true, result:result, userData:userData, message:message});
                        })
                        .catch(() => { 
                            let message = configuration.notificationMessages.userResiterSuccess;
                            return res.send({register:true, result:result, userData:userData, message:message});
                        });
                    })
                }
            });
        }
    }
})

router.post('/login-user', function(req, res, next){
    let userData = {
        'email':req.body.email,
        'password':req.body.password
    };
    req.assert('email', 'Invalid email address.').isEmail();
    req.assert('password', 'password is required.').notEmpty();
    let errors = req.validationErrors();
    if(errors){
        res.send({login:false, message:configuration.notificationMessages.invalidLogin});
    } else {
        // smsGateway.message.sendMessageToNumber('87419', '+918130606975', 'Hello world :)')
        // .then((response) => {
        //     console.log(response)
        //     // do something with response
        // })
        // .catch((error) => {
        //     // handle error
        //     console.log(error)
        // });

        Customer.getCustomerDetails('*', 'email= "'+userData.email+'" AND customer_status = 1', function(err, result){
            if(err) return res.send({login:false, message:configuration.notificationMessages.serverError});

            if(passwordHash.verify(userData.password, result[0].password)){   
                res.send({login:true, result:result[0], message:configuration.notificationMessages.loginSuccess})
            }else{
                res.send({login:false, message:configuration.notificationMessages.invalidLogin})
            }
        });
    }
})

router.post('/forgot-password', function(req, res, next){
    req.assert('email', 'input a valid email address.').isEmail();
    let errors = req.validationErrors();
    if(errors){
        res.send({isSuccess:false, msg:errors[0].msg});
    }else{
        Customer.isCustomerExist('email= "'+req.body.email+'" AND customer_status = 1', function(err, result){
            if(err) return res.send({isSuccess:false, msg:configuration.notificationMessages.serverError});

            if(result[0].count > 0){
                EmailTemplate.getTemplate({template_key:'forgot_password'},'*',function(err, result){
                    if(err) return res.send({isSuccess:false, msg:configuration.notificationMessages.serverError});

                    let newPass = generator.generate({
                        length: 6,
                        numbers: false
                    });
                    let encodePass = passwordHash.generate(newPass);
                    let emailBody = result[0].email_body;

                    Customer.updateCustomer({'password':encodePass},{'email':req.body.email}, function(err, result){
                        if(err) return res.send({isSuccess:false, msg:configuration.notificationMessages.serverError});

                        Customer.getCustomerDetails('customer_name','email="'+req.body.email+'"', function(err, result){
                            if(err) return res.send({isSuccess:false, msg:configuration.notificationMessages.serverError});

                            let customerName = result[0].customer_name;
                            //setup email data with unicode symbols
                            emailBody = emailBody.replace('{email}', req.body.email);
                            emailBody = emailBody.replace('{customer_name}', customerName);
                            emailBody = emailBody.replace('{password}', newPass);

                            let mailOptions = {
                                from: `${configuration.from_name} < ${configuration.from_email} >`, // sender address
                                to: `${req.body.email}`, // list of receivers
                                subject: `Forgot Password : ${configuration.projectName}`, // Subject line
                                html: emailBody, // html body
                            };
            
                            // send mail with defined transport object
                            transporter.sendMail(mailOptions, (error, info) => {
                                if(error) return res.send({isSuccess:false, msg:configuration.notificationMessages.serverError});
                                
                                res.send({isSuccess:true, msg:'Password reset successfully, a new password has been send to your register email.'});
                            });
                       });
                    });
                });
            }
        });
    }
});

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