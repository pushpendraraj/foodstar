
var mysql = require('mysql');

var connection = mysql.createPool({
    database:'cakelatest',
    host:'localhost',
    user:'root',
    password:''
});

module.exports = connection;