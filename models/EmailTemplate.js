var db = require('../db');
var tableName = 'fb_email_templates';

var emailTemplate = {
    getTemplate:function(conditions, fields, callback){
        return db.query('select '+fields+' from '+tableName+' where ?', conditions, callback)
    }
}

module.exports = emailTemplate;