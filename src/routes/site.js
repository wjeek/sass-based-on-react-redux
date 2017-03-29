var express = require('express') ;
var router = express.Router() ;

router.get('/', function (req,res,next) {
    res.render('site/index',{
        title : '西狮进销存' ,
        meta : {
            keywords : '西狮进销存' ,
            description : '西狮进销存'
        },
        layout : false
    })
}) ;

module.exports = router;