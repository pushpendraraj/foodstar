
var mysql = require('mysql');

var connection = mysql.createPool({
    database:'foodstar',
    host:'localhost',
    user:'root',
    password:''
});

module.exports = connection;