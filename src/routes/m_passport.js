var express = require('express') ;
var router = express.Router() ;
router.get('/m_joinTeam', function (req,res,next) {
    res.render('m_passport/m_joinTeam',{
        title : '西狮进销存' ,
        meta : {
            keywords : '邀请加入团队' ,
            description : '邀请加入团队'
        },
        layout : false
    })
}) ;

router.get('/m_login', function (req,res,next) {
    res.render('m_passport/m_login',{
        title : '邀请前登录' ,
        meta : {
            keywords : '邀请前登录' ,
            description : '邀请前登录'
        },
        layout : false
    })
}) ;

router.get('/m_register', function (req,res,next) {
    res.render('m_passport/m_register',{
        title : '注册' ,
        meta : {
            keywords : '邀请注册' ,
            description : '邀请注册'
        },
        layout : false
    })
}) ;

router.get('/m_position', function (req,res,next) {
    res.render('m_passport/m_position',{
        title : '补充信息' ,
        meta : {
            keywords : '选择职位' ,
            description : '选择职位'
        },
        layout : false
    })
}) ;

router.get('/m_success', function (req,res,next) {
    res.render('m_passport/m_success',{
        title : '西狮进销存' ,
        meta : {
            keywords : '加入团队成功' ,
            description : '加入团队成功'
        },
        layout : false
    })
}) ;

module.exports = router;