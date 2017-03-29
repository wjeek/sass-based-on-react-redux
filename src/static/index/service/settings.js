import * as mock from './mock'
import * as async from 'async'
import * as fetch from './utils/fetch'
import * as localstore from './utils/localstore'


// settings
function initSettingsPersonal(params,callback) {
    async.parallel([
        function(cal){
            fetchSettingsPersonal(params,cal)
        },
        function (cal) {
            fetchCity(params,cal) ;
        }
    ],function (error,results) {
        callback && callback(false,{
            personal : results[0] , //{data:{}}
            city : results[1] ,
        }) ;
    })
}

function fetchSettingsPersonal(params={},callback) {
    var ret = window.globalStore.getState().userstore.user ;
    callback && callback(false, {
        data : ret ,
    }) ;
    // setTimeout(function () {
    //     callback && callback(false,{
    //         data: {
    //             // account : "18110908730" ,
    //             // address : null ,
    //             // addressId: null ,
    //             // createTime : "2016-10-09" ,
    //             // delFlag : "0" ,
    //             // fax : null ,
    //             // gender : null ,
    //             // id : "1471318825280" ,
    //             // invitation : null ,
    //             // isAdmin : "1" ,
    //             // jobNumber : null ,
    //             // mailAddress : null ,
    //             // memberName : null ,
    //             // password : "-1ef523c6b645a65441a91fa80df077c2" ,
    //             // portrait : null ,
    //             // position : null ,
    //             // qq : null ,
    //             // telephone : null ,
    //             // tenantId : null ,
    //             // tenantName : null ,
    //             // updateTime : "2016-10-09" ,
    //             // wechat : null ,
    //             //
    //             // id : '4399' ,
    //             // name : '阿卡狸' ,
    //             // sex : 'male'　,
    //             // post : 'purchase' , //boss , purchase销售 , markedt采购 , finance财务
    //             // phone : '98131311' ,
    //             // staticPhone : '0553-2812131-31' ,
    //             // email : 'gq2121@qq.com' ,
    //             // qq : '821312131' ,
    //             // wechat : 'iflay12121' ,
    //             // fax : '21服务单位11'
    //         }
    //     }) ;
    // },200)
}

//
function initSettingsCompany(params,callback) {
    async.parallel([
        function(cal){
            fetchSettingsCompany(params,cal)
        },
        function (cal) {
            fetchCity(params,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            company : results[0] , //{data:{}}
            city : results[1] ,
        }) ;
    })
}

function fetchSettingsCompany(params={},callback) {
    var ret = window.globalStore.getState().userstore.user ;
    callback && callback(false, {
        data : ret ,
    }) ;
    // setTimeout(function () {
    //     callback && callback(false,{
    //         data: {
    //             company : '西域机电股份有限什么什么公司' ,
    //             dist : '浦东 龙阳县 花木屯' ,
    //             area : '呵呵哒小村落' ,
    //
    //             id : '4399' ,
    //         }
    //     }) ;
    // },200)
}

function fetchCity(params={},callback){
    localstore.takeoutCity(function (result) {
        callback && callback(false,{
            data : result.data.cityAntd
        }) ;
    }) ;
}

function editPersonal(params={},callback){
    fetch.post({
        header : {
            code : 'SAUSER006' ,
            version : '1.0' ,
        },
        body : params
    }).success( function (result) {
        if(result.mark =='000000000'){
            callback && callback(result) ;
        }
        else{
            globalFunction.alert.warning(result.message);
        }
    }).error(function (data) {
        globalFunction && globalFunction.alert.warning( '更新用户数据失败'　,　'网络异常'　)
    })　;
}

function editCompany(params={},callback){
    fetch.post({
        header : {
            code : 'SATENT002' ,
            version : '1.0' ,
        },
        body : params
    }).success( function (result) {
        callback && callback(result) ;
    }).error(function (data) {
        globalFunction.alert.warning( '更新用户数据失败'　,　'网络异常'　)
    })　;
}

function editPassword(params={},callback){
    fetch.post({
        header : {
            code : 'SAUSER005' ,
            version : '1.0' ,
        },
        body: params
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function(data){
        globalFunction.alert.warning( '修改用户密码失败'　,　'网络异常'　)
    }) ;
}


//team

function initSettingsTeam(params,callback){
    async.parallel([
        function(call){
            fetchSettingsTeam(params,call)
        },
        function (call) {
            fetchInviteMessage(params,call)
        },
        function (call) {
            fetchSettingsTeam(params,call)
        }
    ],function(error,results){
        callback && callback(false,{
            team : results[0] , //{data:{}}
            inviteMessage : results[1] ,
            inviteSource : results[2] ,
        }) ;
    }) ;
}
function fetchSettingsTeam(params={},callback)  {
    var map = {
        name :　'memberName',
        phone : 'account',
        email : 'mailAddress',
        extension : 'telephone',
        post : 'post',
        post_forShow : 'post_forShow',
        operation : '',
        jobNumber : 'jobNumber',
        userId : 'id',
        isAdmin : 'isAdmin',
        company : 'tenantName',
    };
    fetch.post({
        header : {
            code : 'SAUSER009' ,
            version : '1.0' ,
        },
        body : {
            usersParameter : params ,
        }
    }).success( function (result) {
        console.log(result);
        var _o = result.data.users.map(function (v,i) {
            if(v.roleIds[0] == '1'){
                v.post = '1';
                v.post_forShow = '老板';
            }
            if(v.roleIds[0] == '2'){
                v.post = '2';
                v.post_forShow = '财务';
            }
            if(v.roleIds[0] == '3'){
                v.post = '3';
                v.post_forShow = '销售';
            }
            if(v.roleIds[0] == '4'){
                v.post = '4';
                v.post_forShow = '采购';
            }
            var pageTotal = v.pageTotal ;
            var v_obj = fetch.adapterResponse(v,map);
            v_obj.totalCount = pageTotal ;
            return v_obj;
        }) ;
        console.log(_o);
        callback && callback(false,{
            data : _o
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                id : '233' ,

                name : '赵璐璐' ,
                phone : '1211212121' ,
                password : '******' ,
                post : 'boss' ,
                jobNumber : 'lily211' ,
                email : 'gq212121@wqq.com' ,
                extension : '211-wwhsjw' ,

                company : '西域科技' ,
                
                isInvitation : false ,

                isAdmin : true ,

            },{
                id : '2121213232' ,

                name : 'ahkari' ,
                phone : '121211ddwdw12121' ,
                password : '******' ,
                post : 'market' ,
                jobNumber : '--lily211' ,
                email : '21@wqq.com' ,
                extension : '---' ,

                company : '西域科技' ,
                
                isInvitation : true ,

                isAdmin : false ,

            }], 10) ,
        })
    },50)*/
}

function _ev_click_searchPhone(params={},callback) {
    fetch.post({
        header : {
            code : 'SAUSER001' ,
            version : '1.0' ,
        },
        body : {
            usersParameter : params
        }

    }).success( function (result) {
        console.log(result);
        callback && callback(false,{
            data : result
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}

function _ev_click_searchId(params={},callback) {
    var map = {
        name :　'memberName',
        post : '',
        phone : 'account',
        email : 'mailAddress',
        extension : 'telephone',
        operation : '',
        jobNumber : 'jobNumber',
        userId : 'id'
    };
    fetch.post({
        header : {
            code : 'SAUSER007' ,
            version : '1.0' ,
        },
        body : params ,

    }).success( function (result) {
        console.log(result);
        var _o = [result.data.user].map(function (v,i) {
            return fetch.adapterResponse(v,map);
        }) ;
        console.log(_o);
        callback && callback(false,{
            data : _o
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}

function saveSettingUser(params={},callback) {
    fetch.post({
        header : {
            code : 'SAUSER006' ,
            version : '1.0' ,
        },
        body : {
            usersParameter : params
        }
    }).success( function (result) {
        console.log(result);
        if(result.mark =='000000000'){
            callback && callback(false,{
                data : result
            }) ;
        }
        else{
            globalFunction.alert.warning(result.message);
        }
        
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}

function joinSettingsTeam(params={},callback) {
    fetch.post({
        header : {
            code : 'SAUSER003' ,
            version : '1.0' ,
        },
        body : {
            usersParameter : params
        }
    }).success( function (result) {
        console.log(result);
        callback && callback(false,{
            data : result
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}

function deleteSettingUser(params={},callback) {
    fetch.post({
        header : {
            code : 'SAUSER008' ,
            version : '1.0' ,
        },
        body : params
        
    }).success( function (result) {
        console.log(result);
        callback && callback(false,{
            data : result
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}

function changeInvite(params={},callback) {
    fetch.post({
        header : {
            code : 'SATENT003' ,
            version : '1.0' 
        },
        body : {
            tenantParameter : params
        }

    }).success( function (result) {
        console.log(result);
        callback(result);
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}

function fetchInviteMessage(params={tenantId : "252"},callback){
    var url = '您未开启功能';
    fetch.post({
        header : {
            code : 'SAUSER028' ,
            version : '1.0'
        },
        body : {

        }

    }).success( function (result) {
        console.log(result);
        if(result.mark == '000000000'){
            url = result.data.url;
            fetch.post({
                header : {
                    code : 'SATENT001' ,
                    version : '1.0' ,
                },

                body : params

            }).success( function (result2) {
                console.log(result2);
                if(result2 && result2.data && result2.data.invitation && result2.mark == '000000000'){
                    callback && callback(false,{
                        data : {
                            imgSrc : 'data:image/png;base64,' + result.file.content,
                            inviteCode : result2.data.invitation || '您未开启功能',
                            inviteLink : url
                        }
                    }) ;
                }


            }).error(function (data) {
                console.log(arguments) ;
            })　;
        }

        else{
            callback && callback(false,{
                data : {
                    imgSrc : 'http://static-c.ehsy.com/www/images/public/code-app@2x.fc9b60ae.png',
                    inviteCode : '您未开启功能',
                    inviteLink : '您未开启功能' ,
                }
            }) ;
        }

    }).error(function (data) {
        console.log(arguments) ;
    })　;

    /*setTimeout(function () {
        callback && callback(false,{
            data :{
                imgSrc : 'http://static-c.ehsy.com/www/images/public/code-app@2x.fc9b60ae.png',
                inviteCode : 'service的邀请码!' ,
                inviteLink : 'http://saas-dev.ehsy.com' ,
            }
        })
    },20) ;*/
}

function userRegister(params={},callback) {
    fetch.post({
        header : {
            code : 'SAUSER011' ,
            version : '1.0' ,
        },
        body : {
            usersParameter : params
        }
    }).success( function (result) {
        console.log(result);
        callback && callback(false,{
            data : result.data.user_id
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}

function isRegister(params={},callback) {
    fetch.post({
        header : {
            code : 'SAUSER001' ,
            version : '1.0' ,
        },
        body : {
            usersParameter : params
        }
    }).success( function (result) {
        console.log(result);
        callback && callback(false,{
            data : result.data.registered
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}

//log
function initSettingsLog(params,callback) {
    async.parallel([
        function(cal){
            fetchSettingsLog(params,cal)
        },
        function(cal){
            fetchOperationType(params,cal)
        },
        function(cal){
            fetchContentType(params,cal)
        },
        function(cal){
            fetchOperson(params,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
            OperationType : results[1] ,
            ContentType : results[2] ,
            Operson : results[3]
        }) ;
    })
}
function fetchSettingsLog(params={},callback) {
    fetch.post({
        header : {
            code : 'SAUSER025' ,
            version : '1.0' ,
        },
        body : {
            feedbackParam : params ,
        }
    }).success( function (result) {
        console.log(result);
        callback && callback(false,{
            data : result
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                id : '233' ,
                index : '1',
                operationType : '读' ,
                operationTime : '2016年9月16日15时3分3秒' ,
                oPerson : 'me' ,
                ipAddress: '10.0.0.6' ,
                contentType : '2999999' ,
                details : '23144444' ,
            },{
                id : '233' ,
                index : '2',
                operationType : '写' ,
                operationTime : '2015年9月16日15时3分3秒' ,
                oPerson : 'you' ,
                ipAddress: '210.30.20.61' ,
                contentType : '322323' ,
                details : '2312112' ,
            }], 10) ,
        }) ;
    },200)*/
}
function fetchOperationType(params={},callback){
    setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '写' ,
                value : 1
            },{
                name : '读' ,
                value : 2
            }]
        }) ;
    },50) ;
}
function fetchContentType(params={},callback){
    setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '小说' ,
                value : 1
            },{
                name : '散文' ,
                value : 2
            }]
        }) ;
    },50) ;
}
function fetchOperson(params={},callback){
    setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '我是第一' ,
                value : 1
            },{
                name : '我是第二' ,
                value : 2
            }]
        }) ;
    },50) ;
}
//feedback
function initSettingsFeedback(params,callback) {
    async.parallel([
        function(cal){
            fetchSettingsFeedback(params,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
        }) ;
    })
}

function fetchSettingsFeedback(params={},callback) {
    fetch.post({
        header : {
            code : 'SAUSER026' ,
            version : '1.0' ,
        },
        body : {
            feedbackParameter : params ,
        }
    }).success( function (result) {
        console.log(result);
        var _arr = result.data.feedbackDtos.map((v)=>{
            if(v.state == 1){
                v.state_forShow = '未解决'
            }
            else if(v.state == 2){
                v.state_forShow = '已解决'
            }
            return v ;
        }) ;
        callback && callback(false,{
            data : _arr
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                id : '233' ,
                sugTime : '2016年9月16日15时3分3秒' ,
                qtype : '读' ,
                fbContents : 'me' ,
                qImgs: '10.0.0.6' ,
                contact : '23144444' ,
                states : '2999999' ,
                operation : '1',
            },{
                id : '236' ,
                sugTime : '2012年9月16日15时3分3秒' ,
                qtype : 'xxiixix' ,
                fbContents : 'mefdsf' ,
                qImgs: '10.0.0.6' ,
                contact : '2312224' ,
                states : '29942' ,
                operation : '2',
            }], 10) ,
        }) ;
    },200)*/
}


function feedbackSubmit(params,callback) {
    fetch.post({
        header : {
            code : 'SAUSER025' ,
            version : '1.0' ,
        },
        body : {
            feedbackParam : params ,
        }
    }).success( function (result) {
        console.log(result);
        /* result.data.salesOrderDto = result.data.salesOrderDto.map(function (v,i) {
         return fetch.adapterResponse(v,map) ;
         }) ;*/
        callback && callback(false,{
            data : result 
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}

function deleteFeedback(params,callback) {
    fetch.post({
        header : {
            code : 'SAUSER026' ,
            version : '1.0' ,
        },
        body : {

        }
    }).success( function (result) {
        console.log(result);
        callback && callback(false,{
            data : result
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}


export default {
    //
    initSettingsPersonal ,

    initSettingsCompany ,

    editPersonal,//编辑 用户的其他信息
    editCompany , //编辑 用户的公司
    editPassword , //编辑 密码
    //
    initSettingsTeam ,
    fetchSettingsTeam ,
    _ev_click_searchPhone,
    _ev_click_searchId,
    joinSettingsTeam ,
    saveSettingUser,
    changeInvite,
    deleteSettingUser,
    fetchInviteMessage ,
    userRegister ,
    isRegister,
    //
    initSettingsLog,
    fetchSettingsLog,
    //
    initSettingsFeedback,
    feedbackSubmit,
    deleteFeedback
    
}

