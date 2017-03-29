import * as async from 'async'
import * as fetch from './utils/fetch' ;
import moment from 'moment' ;
import * as localstore from './utils/localstore'
import {
    USER_NAME ,
    TOKEN_NAME ,
} from '../constants' ;
import utils from './utils/index'

function fetchUserInfo_sync(params={},callback) {
    // fetch.post({
    //     header : {
    //         code : 'SAUSER007' ,
    //         version : '1.0' ,
    //     },
    //     body : params ,
    //     async : false ,
    // }).success( function (result) {
    //     callback && callback(result) ;
    // }).error(function (data) {
    //     console.log(arguments) ;
    // })　;
    $.ajax({
        type : 'POST' ,
        url : '/gw/api-gateway/api' ,
        contentType : 'application/json' ,
        async : false ,
        data : JSON.stringify({
            header : {
                code : 'SAUSER007' ,
                version : '1.0' ,
                requestTime : moment().format('YYYYMMDDHHmmssSSS') ,
            },
            common : {
                appID : "SAAS",
                nonceStr : "12345643",
                // sign : "0xafewefa" ,
                sign : '666666' ,
                source : 0 , //标志来自于pc web端
                userId : utils.cookie.config( USER_NAME )
            },
            body : params
        }),
        success : function (data) {
            callback && callback({
                mark : data.header.responseCode ,
                message : data.header.responseDesc ,
                data : data.body
            }) ;
        },
        error : function () {
            globalFunction.alert.warning( '用户信息获取失败' , '操作提示' ) ;
            utils.cookie.removeCookie( USER_NAME ,{
                path : '/'
            } ) ;
            utils.cookie.removeCookie( TOKEN_NAME ,{
                path : '/'
            } ) ;
            window.location.href = '/passport/login' ;
            return ;
        }
    }) ;
} ;

function fetchUserInfo(params={},callback) {
    fetch.post({
        header : {
            code : 'SAUSER007' ,
            version : '1.0' ,
        },
        body : params ,
        async : true ,
    }).success( function (result) {
        callback && callback(result) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;

}



function fetchAppCityStore(params={},callback){
    localstore.takeoutCity(function (result) {
        callback && callback(false,{
            data : result.data.cityAntd
        }) ;
    }) ;
}


export default {
    
    fetchUserInfo_sync ,
    fetchUserInfo ,

    fetchAppCityStore ,

}
