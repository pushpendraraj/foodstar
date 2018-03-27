var db = require('../db');
var tableName = 'fb_blogs';

var Blogs = {
    getBlogs:function(conditions, callback){
        return db.query('select * from '+tableName+' where '+conditions, callback);
    }
}

module.exports = Blogs;