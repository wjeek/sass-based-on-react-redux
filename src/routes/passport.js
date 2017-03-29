var express = require('express') ;
var router = express.Router() ;

router.get('/login', function (req,res,next) {
    res.render('passport/login',{
        title : '用户登录' ,
        meta : {
            keywords : '用户登录' ,
            description : '用户登录'
        }
    })
}) ;

router.get('/register', function (req,res,next) {
    res.render('passport/register',{
        title : '用户注册' ,
        meta : {
            keywords : '用户注册' ,
            description : '用户注册'
        }
    })
}) ;

router.get('/findpwd', function (req,res,next) {
    res.render('passport/findpwd',{
        title : '找回密码' ,
        meta : {
            keywords : '找回密码' ,
            description : '找回密码'
        }
    })
}) ;

module.exports = router;