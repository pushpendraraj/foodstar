var db = require('../db');
var tableName = 'fb_restaurants';
var Restaurant = {
    getResturants:function(conditions, fields, callback){
      return db.query('select '+fields+' from '+tableName+' where '+conditions, callback);
    }
};
  
module.exports = Restaurant;