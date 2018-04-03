var db = require('../db');
var tableName = 'fb_cuisines';
var Cuisines = {
    getCuisines:function(conditions, fields, callback){
        return db.query(`select ${fields} from ${tableName} where ${conditions}`, callback);
    },
    geCuisinesByIds:function(conditions, fields, callback){
        return db.query(`select ${fields} from ${tableName} where cuisine_id IN(${conditions})`, callback);
    }
}

module.exports = Cuisines;