var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');

/* GET home page. */
router.get('/', function(req, res) {
  Post.get(null, function(err, posts){
    if(err){
      posts = [];
    }
    res.render('index', {
      title: '首页',
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/u/:user', function(req, res){
  User.get(req.params.user, function(err, user){
    if(!user){
      req.flash('error', '用户不存在');
      console.error('错误: 用户不存在');
      return res.redirect('/');
    }
    Post.get(user.username, function(err, posts){
      if(err){
        req.flash('error', err);
        console.error('错误: ' + err);
        return res.redirect('/');
      }
      res.render('user',{
        title: user.username,
        posts: posts
      });
    });
  });
});

router.get('/reg', function(req, res){
  res.render('reg', {
    title: '用户注册'
  });
});

router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res){
  if(req.body['password-repeat'] != req.body['password']) {
    req.flash('error', '两次输入的口令不一致');
    console.error('错误: 两次输入的口令不一致');
    return res.redirect('/reg');
  }
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  var newUser = new User({
    username: req.body.username,
    password: password
  });

  User.get(newUser.username, function(err, user){
    if(user)
      err = '用户名已存在';
    if(err){
      req.flash('error', err);
      console.error('错误: ' + err);
      return res.redirect('/reg');
    }
    newUser.save(function(err){
      if(err){
        req.flash('error', err.message);
        console.error('错误: ' + err.message);
        return res.redirect('/reg');
      }
      req.session.user = newUser;
      req.flash('success', '注册成功');
      console.error('错误: 注册成功');
      res.redirect('/');
    });
  });
});

router.get('/login', function(req, res){
  res.render('login', {
    title: '用户登陆'
  });
});

router.post('/login', checkNotLogin);
router.post('/login', function(req, res){
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  User.get(req.body.username, function(err, user){
    if(!user){
      req.flash('error', '用户不存在');
      console.error('错误: 用户不存在');
      return res.redirect('/login');
    }
    if(user.password != password) {
      req.flash('error', '用户口令错误');
      console.error('错误: 用户口令错误');
      return res.redirect('/login');
    }
    req.session.user = user;
    req.flash('success', '登入成功');
    console.log('成功: ' + user.username + ' 登入成功');
    res.redirect('/');
  })
});

router.get('/logout', checkLogin);
router.get('/logout', function(req, res){
  req.session.user = null;
  req.flash('success', '登出成功');
  console.log('登出成功');
  res.redirect('/');
});

router.post('/post', checkLogin);
router.post('/post', function(req, res){
  var currentUser = req.session.user;
  var post = new Post(currentUser.username, req.body.post);
  post.save(function(err){
    if(err){
      req.flash('error', err);
      console.error('错误: ' + err.message);
      return res.redirect('/');
    }
    req.flash('success', '发表成功');
    console.log('成功: 发表成功');
    res.redirect('/u/' + currentUser.username);
  })
});

router.get('/u/:user', function(req, res){
  User.get(req.param.user.username, function(err, user){
    if(!user){
      req.flash('error', '用户不存在');
      console.error('错误: 用户不存在');
      return req.redirect('/');
    }
    Post.get(user.username, function(err, posts){
      if(err){
        req.flash('error', err);
        console.error('错误: ' + err);
        return req.redirect('/');
      }
      res.render('user', {
        title: user.username,
        posts: posts
      });
    });
  });
});

router.get('/user', function(req, res){
  res.render('user',{
    title: '用户页面'
  });
});

function checkNotLogin(req, res, next) {
  if(req.session.user){
    req.flash('error', '用户已登陆');
    console.error('错误: 用户已登陆');
  }
  next();
}

function checkLogin(req, res, next){
  if(!req.session.user){
    req.flash('error','用户尚未登陆');
    console.error('错误: 用户尚未登陆');
    return res.redirect('/login');
  }
  next();
}

module.exports = router;
