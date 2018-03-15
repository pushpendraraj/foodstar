var db = require('../db');
var User = {
    loginUser:function(data,callback){
      return db.query("Select * from users where email =? AND password =?", [data.email, data.password],callback);
    },
    getUsers:function(callback){
        return db.query("select * from fb_users", callback);
    }
};
  
module.exports = User;