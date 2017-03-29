var express = require('express');
var router = express.Router();

router.get('/',function (req, res, next) {
    res.render('home', {
        title: '西狮进销存'
    });
});

[
    {
        path : '/purchase/*'
    },
    {
        path : '/market/*'
    } ,
    {
        path : '/account/*'
    } ,
    {
        path : '/statistics/*'
    } ,
    {
        path : '/base/*'
    } ,
    {
        path : '/settings/*'
    } ,
    {
        path : '/404/*'
    }
].forEach(function(v){
    router.get( v.path ,function (req,res) {
        res.render('home',{
            title: '西狮进销存'
        }) ;
    })
}) ;


router.get('/404', function (req, res, next) {
    res.render('home');
});


module.exports = router;