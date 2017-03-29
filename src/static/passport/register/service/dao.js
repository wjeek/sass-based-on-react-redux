import * as async from 'async'
import * as fetch from '../../../index/service/utils/fetch'

// export default dao ;

//查询手机是否已注册
export function isPhoneRegister(params = {},callback){
    fetch.post({
        header:{
            code: 'SAUSER001' ,
            version: '1.0'
        },
        body : {
            usersParameter : params
        }
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function (result) {
        console.log(result) ;
    }) ;
} ;

//发送手机验证码
export function verifyPhoneCode(params = {},callback){
    fetch.post({
        header:{
            code: 'SAUSER022' ,
            version: '1.0'
        },
        body : {
            phone : params.phone
        }
    }).success(function (result) {
        console.log(result);
        callback && callback(result) ;
    }).error(function (result) {
        console.log(result) ;
    }) ;
} ;
//验证验证码
export function testPhoneCode(params = {},callback){
    fetch.post({
        header:{
            code: 'SAUSER024' ,
            version: '1.0'
        },
        body : {
            phone : params.account ,
            code : params.code ,
        }
    }).success(function (result) {
        console.log(result);
        callback && callback(result) ;
    }).error(function (result) {
        console.log(result) ;
    }) ;
};

//通过手机号查找id
export function searchIdByPhone(params = {},callback){
    fetch.post({
        header: {
            code: 'SAUSER009',
            version: '1.0'
        },
        body: {
            usersParameter: params
        }
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function (result) {
        console.log(result) ;
    }) ;
}

//根据手机号与验证码修改密码
export function changePasswordByPhone(params = {},callback){
    fetch.post({
        header: {
            code: 'SAUSER030',
            version: '1.0'
        },
        body: params
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function (result) {
        console.log(result) ;
    }) ;
}

//完善注册信息并注册
export function completeInfoAndRegister(params = {},callback){
    fetch.post({
        header:{
            code: 'SAUSER011' ,
            version: '1.0'
        },
        body : {
            usersParameter : params
        }
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function (result) {
        console.log(result) ;
    }) ;
} ;

//登录
export function login(params = {},callback){
    fetch.post({
        header:{
            code: 'SAUSER004' ,
            version: '1.0'
        },
        body : {
            usersParameter : params
        }
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function (result) {
        console.log(result) ;
    }) ;

} ;
//更改角色
export function changeRole(params={},callback){
    fetch.post({
        header : {
            code : 'SAUSER006' ,
            version : '1.0' ,
        },
        body : params
    }).success( function (result) {
        if(result.mark == '000000000')     {
            callback && callback(result) ;
        }
        else {
            globalFunction.alert.warning(result.message)
        }
    }).error(function (data) {
        globalFunction.alert.warning( '更新用户数据失败'　,　'网络异常'　)
    })　;
}

//找回密码
export function resetPassword(params = {} , callback) {
    fetch.post({
        header: {
            code: 'SAUSER006',
            version: '1.0'
        },
        common : {
            appID : "SAAS",
            nonceStr : "12345643",
            // sign : "0xafewefa" ,
            sign : '666666' ,
            source : 0 , //标志来自于pc web端
            userId : params.id
        },
        body: {
            usersParameter: params
        }
    }).success(function (result) {
        callback && callback(result);
    }).error(function (result) {
        console.log(result);
    });
} ;

//加入或者创建团队
export function bindTeam(params = {} , callback) {
    fetch.post({
        header:{
            code: 'SAUSER003' ,
            version: '1.0'
        },
        body : {
            usersParameter : params
        }
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function (result) {
        console.log(result) ;
    }) ;
} ;
