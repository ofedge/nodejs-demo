/**
 * Created by silcata on 2015/1/8.
 */
var setting = require('../settings');
var mysql = require('mysql');
var connection = mysql.createConnection(setting);
connection.connect(function(err){
    if(err){
        console.error('错误: ' + err.stack);
    }
    console.log('连接数据库成功!');
})
module.exports = connection;

