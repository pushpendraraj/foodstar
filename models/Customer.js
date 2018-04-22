var db = require('../db');
var tableName = 'fb_customers';

var Customer = {
    isCustomerExist:function(conditions, callback){
        return db.query('select count(customer_id) as count from '+tableName+' where '+conditions, callback)
    },
    getCustomerDetails:function(fields, conditions, callback){
        return db.query('select '+fields+' from '+tableName+' where '+conditions, callback)
    },
    addCustomer:function(fields, callback){
        return db.query('insert into '+tableName+' SET ?', fields, callback)
    },
    updateCustomer:function(fields, conditions, callback){
        return db.query('update '+tableName+' SET ? WHERE ?', [fields,conditions], callback);
    }
}

module.exports = Customer;