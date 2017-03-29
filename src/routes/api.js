var express = require('express');
var formidable = require('formidable') ;
var fs = require('fs') ;
var path = require('path');
var router = express.Router() ;
var request = require('request') ;
var moment = require('moment') ;
var TOKEN_NAME = require('../configs/config.json')[ 'token-name' ] ;
var USER_NAME = require('../configs/config.json')[ 'user-name' ] ;
var store = require('../services/store') ;

router.post('/upload-file-:code', function (req,res,next) {

    var userName = req.cookies[ USER_NAME ] ;
    var tokenName = req.cookies[ TOKEN_NAME ] ;

    if ( !userName || !tokenName ){
        res.json({
            mark : '4' ,
            message : '您尚未登录, 无法上传文件' ,
            data : null ,
        }) ;
        return ;
    }

    var gateWayCode = req.params.code ;
    var form = new formidable.IncomingForm() ;
    form.uploadDir = path.join( __dirname ,  "../upload/image" ) ;
    form.encoding = 'utf-8';
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小2M
    form.parse(req,function( err , fields , files ){
        if (!err){
            var beforePath = files.file.path ;
            var beforeName = beforePath.split('/').pop() ;
            var tmpName = renameFile( beforePath ) ;
            fs.rename( beforePath , tmpName , function(err){
                if (!err){
                    fs.readFile( tmpName  , 'base64' ,function (err,bease64data) {
                        if (!err){
                            //将base64拿去请求gateway, 再将结果返回给 web前端
                            gateWayFileService({
                                code : gateWayCode ,
                                userId : userName ,
                                tokenId : tokenName ,
                                fileName : beforeName ,
                                content : bease64data
                            },function (err,data) {
                                if ( !err ){
                                    if ( data.header ){
                                        res.json({
                                            mark : data.header.responseCode ,
                                            message : data.header.responseDesc ,
                                            data : data.body
                                        }) ;
                                    } else {
                                        res.json({
                                            mark : '5' ,
                                            message : data ,
                                            data : data
                                        }) ;
                                    }
                                } else {
                                    res.json({
                                        mark : '6' ,
                                        message : '文件传输失败' ,
                                        data : null
                                    }) ;
                                }
                            }) ;
                        } else {
                            res.json({
                                mark : '1' ,
                                message : 'node server : 文件解析失败' ,
                                data : null ,
                            })
                        }
                    }) ;
                } else {
                    res.json( {
                        mark : '3' ,
                        message : 'node server : 文件重命名失败' ,
                        data : null ,
                    } ) ;
                }
            }) ;
        } else {
            res.json({
                mark : '2' ,
                message : 'node server : 上传的文件解析失败, 请检查大小与格式' ,
                data : null ,
            }) ;
        }
    }) ;

}) ;

function renameFile(path){
    var arr = path.split( '/' ) ;
    var fileName = arr.pop() ;
    var suffix = fileName.split( '.' ).pop() ;
    arr.push( 'tmp.' + suffix ) ;
    return arr.join( '/' ) ;
} ;

function gateWayFileService(params,callback) {
    var buffArr = new Buffer(params.content) ;
    buffArr = Array.prototype.slice.call(buffArr, 0) ;
    var reqParams = {
        body : {

        },
        common : {
            appID : 'SAAS' ,
            nonceStr : '12345643' ,
            sign : params.tokenId ,
            source : 0 ,
            userId : params.userId
        },
        file : {
            name : params.fileName ,
            content : buffArr ,
        },
        header : {
            // code : 'SAITEM007' ,
            code : params.code ,
            version : '1.0',
            requestTime : moment().format('YYYYMMDDHHmmssSSS') ,
        }
    } ;
    store.fileUpload({
        url: '/gw/api-gateway/api',
        method: 'POST',
        json : true ,
        body: reqParams ,
    },function (err, body) {
        callback( err , body ) ;
    }) ;
} ;


module.exports = router;