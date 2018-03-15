var db = require('../db');
var tableName = 'fb_restaurants';
var Restaurant = {
    getResturants:function(callback){
      return db.query("Select * from fb_restaurants" ,callback);
    }
};
  
module.exports = Restaurant;