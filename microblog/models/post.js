/**
 * Created by silcata on 2015/1/8.
 */
var connection = require('./db');

function Post(username, post, time) {
    this.user = username;
    this.post = post;
    if (time) {
        this.time = time;
    } else {
        this.time = new Date();
    }
};

module.exports = Post;

Post.prototype.save = function save(callback) {
    var post = {
        user: this.user,
        post: this.post,
        time: this.time
    };
    connection.query('INSERT INTO T_POST SET ?', post, function(err, results){
        if (err) {
            console.error('错误: ' + err.message);
            callback(err);
        }
        callback(null);
    });
}

Post.get = function get(username, callback) {
    var sql = 'SELECT * FROM T_POST P';
    if (username != null){
        sql = sql + ' WHERE P.USER = ?';
    }
    connection.query(sql, [username], function(err, results){
         if(err){
             console.error('错误: ' + err);
             callback(err, null);
         }else{
             var posts = [];
             for(var i in results){
                 posts.push(results[i]);
             }
             callback(null, posts);
         }
    });
}