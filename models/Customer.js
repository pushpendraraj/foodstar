var db = require('../db');
var tableName = 'fb_customers';

var Customer = {
    getCustomers:function(callback){
        return db.query('select * from '+tableName, callback)
    },
    addCustomer:function(data, callback){
        return db.query('insert into '+tableName+' SET ?', data, callback)
    }
}

module.exports = Customer;