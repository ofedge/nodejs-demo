/**
 * Created by silcata on 2015/1/8.
 */
var connection = require('./db');

function User(user) {
    this.username = user.username;
    this.password = user.password;
};
module.exports = User;

User.prototype.save = function save(callback) {
    var user = {
        username: this.username,
        password: this.password
    };

    connection.query('INSERT INTO T_USER SET ? ',user , function(err, results){
        if (err) {
            console.error('错误: ' + err.message);
            return callback(err);
        }
    });
    callback(null);
};

User.get = function get(username, callback){
    connection.query('SELECT * FROM T_USER T WHERE T.USERNAME = ?', [username], function(err, results){
        if(err){
            console.error('错误: ' + err.message);
            return callback(err);
        }else if(results.length != 0){
            var user = new User(results[0]);
            callback(err, user);
        }else{
            callback(err, null);
        }
    });
}
