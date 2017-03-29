import moment from 'moment' ;
import utils from './index'
import {
    USER_NAME,
    TOKEN_NAME
} from '../../constants' ;

//gw的最主要的调用方式
const defaultParams = {
    type : 'POST' ,
    url : '/gw/api-gateway/api' ,
    contentType : 'application/json' ,
    async : true ,
}

function post(params=defaultParams) {
    var _config = {
        type : params.type || defaultParams.type ,
        url : params.url || defaultParams.url ,
        contentType : params.contentType || defaultParams.contentType ,
        async : typeof params.async !== 'undefined' ? params.async : defaultParams.async ,
        success : ((data,textStatus,jqXHR)=>{

            window.globalFunction && window.globalFunction.alert.hide_loading() ;

            _promise.triggerSuccess({
                mark : data.header.responseCode ,
                message : data.header.responseDesc ,
                data : data.body,
                file : data.file
            }) ;
            // if ( data && data.header && data.header.responseCode == '000000000' ){
            //     if ( params.success ){
            //         params.success( data.body ) ;
            //         return ;
            //     }
            //     _promise.triggerSuccess( data.body ) ;
            // } else {
            //     if ( params.error ){
            //         params.error( arguments )
            //         return ;
            //     } else {
            //         console.warn( 'unexcept message from gateway. please check your request params.' )
            //     }
            //     _promise.triggerError( data , textStatus , jqXHR ) ;
            // }
        }) ,
        error : ((httpRequest,textStatus,errorThrown)=>{

            window.globalFunction && window.globalFunction.alert.hide_loading() ;

            if ( params.error　){
                params.error.apply(　null　,　arguments　)　;
                return ;
            }
            _promise.triggerError(　httpRequest　,　textStatus　,　errorThrown　)　;
            // console.warn( 'responseError:' + textStatus + '. This request options is:' + this ) ;
            console.warn( httpRequest ) ;
        }) ,
    } ;
    var _data = {
        header : {
            requestTime : moment().format('YYYYMMDDHHmmssSSS') ,
        },
        common : {
            appID : "SAAS",
            nonceStr : "12345643",
            // sign : "0xafewefa" ,
            sign : (utils.cookie.config( TOKEN_NAME ) == null ||  utils.cookie.config( TOKEN_NAME ) == '')? '666666' : utils.cookie.config( TOKEN_NAME ),
            source : 0 , //标志来自于pc web端
            userId : (utils.cookie.config( USER_NAME ) == null ||  utils.cookie.config( USER_NAME ) == '')? '1473452516221': utils.cookie.config( USER_NAME )
        },
        body : {

        }
    } ;
    _data.header = Object.assign( _data.header , params.header || {} ) ;
    _data.body = Object.assign( _data.body , params.body || {} ) ;
    _data.common = Object.assign( _data.common , params.common || {} ) ;
    try{
        _config.data = JSON.stringify( _data ) ;
    } catch(e){
        console.warn( 'fetch params parse error.' ) ;
    }

    window.globalFunction && window.globalFunction.alert.show_loading() ;
    var _self = $.ajax(_config) ;

    var _promise = new PromiseFetch( _self ) ;

    return _promise ;

}

//将前端的数据模型 适配 成 服务端的数据
function adapterRequest(me,map){
    var _ret = {} ;
    for ( var _o in map ){
        if ( typeof me[ map[ _o ] ] !== 'undefined' ){
            _ret[ _o ] = me[ map[ _o ] ] ;
        }
    }
    return _ret ;
}

//将服务端的数据模型 适配 成 前端的数据
function adapterResponse(other,map){
    var _ret = {} ;
    for ( var _o in map ){
        _ret[ _o ] = typeof other[ map[ _o ] ] === 'undefined' ? '' : other[ map[ _o ] ] ;
    }
    return _ret ;
}


//Promise
function PromiseFetch(fetch,success,error){
    this.fetch = fetch ;
    this.successCallback = success ;
    this.errorCallback = error ;
}
PromiseFetch.prototype.success = function (callback) {
    this.successCallback = callback ;
    return this ;
}
PromiseFetch.prototype.error = function (callback) {
    this.errorCallback = callback ;
    return this ;
}
PromiseFetch.prototype.triggerSuccess = function(databody) {
    this.successCallback.call(this,databody) ;
}
PromiseFetch.prototype.triggerError = function (...args) {
    this.errorCallback.apply(this,...args)
}



export {
    post ,
    adapterResponse ,
    adapterRequest ,
}
