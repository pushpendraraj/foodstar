var db = require('../db');
var tableName = 'fb_customers';

var Customer = {
    getCustomers:function(callback){
        return db.query('select * from '+tableName, callback)
    },
    addCustomer:function(data, callback){
        return db.query('insert into '+tableName+' (customer_name, email, contact_no, gender, password) values('+data+',"ddddddddddd")', callback)
    }
}

module.exports = Customer;