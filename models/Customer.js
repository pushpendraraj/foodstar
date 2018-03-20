var db = require('../db');
var tableName = 'fb_customers';

var Customer = {
    isCustomerExist:function(data, callback){
        return db.query('select count(customer_id) from '+tableName+' where ?', data, callback)
    },
    getCustomerDetails:function(conditions, fields, callback){
        return db.query('select '+fields+' from '+tableName+' where ?', conditions, callback)
    },
    addCustomer:function(data, callback){
        return db.query('insert into '+tableName+' SET ?', data, callback)
    },
    loginCustomer:function(data, callback){
        return db.query('select * from '+tableName+' where ?', data, callback)
    }
}

module.exports = Customer;