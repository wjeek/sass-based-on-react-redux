import * as mock from './mock'
import * as async from 'async'
import * as fetch from './utils/fetch'

import {
    PAY_TYPE ,
    ACCOUNT_TYPE,
    PRODUCT_TYPE ,
    RECODE_TYPE ,
} from '../constants/index.js'

function initCharge(params,callback) {
    async.parallel([
        function(cal){
            fetchChargeTable(params,cal)
        },
        function(cal){
            fetchCustomer(params,cal)
        },
        function(cal){
            fetchPaytype(params,cal)
        },
        function(cal){
            fetchAccountType(params,cal)
        },
        function (cal) {
            fetchIncomeType(params,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
            customer : results[1] ,
            payType : results[2] ,
            accountType : results[3] ,
            incomeType : results[4] ,
        }) ;
    })
}


function fetchChargeTable(params={},callback) {
    var map = {
        date: 'businessTime',
        id: 'tallyNo',
        orderID: 'id',
        payType : 'settlementWay' ,
        settlementType : 'settlementType',
        accountType : 'tallyType' ,
        sumPoMoney : 'sumPoMoney',
        sumSoMoney : 'sumSoMoney',
        customer: 'oppositeName',
        tips : 'comment' ,
        operator : 'userName' ,
        operation : '查看 编辑 删除' ,

        incomeType : '应付款' ,

        contacter : 'Ahkari' ,
        phone : '12121212' ,
        remainPrice : '12121.00' ,

        shouldPrice : '555555' ,
        sellCount: '1212121'
    } ;
    fetch.post({
        header : {
            code : 'SATALY001' ,
            version : '1.0' ,
        },
        body : {
            continualTallyDto : params ,
        }
    }).success( function (result) {
        console.log(result);
        if ( result.mark == '000000000' ){
            /*result.data.continualTallyDtos = result.data.continualTallyDtos.map(function (v,i) {
                return fetch.adapterResponse(v,map) ;
            }) ;
            callback && callback(false,{
                data : result.data.continualTallyDtos ,
            }) ;*/
            var _arr = result.data.continualTallyDtos.map((v)=>{
                var payType_forShow = '' ;
                var accountType_forShow = '';
                var delFlag = v.delFlag ; //用于判别是否可撤销
                var pageTotal = v.pageTotal ;
                var income = '';
                var payment = '';
                PAY_TYPE.forEach((_v,i)=>{
                    if( v.settlementWay !== null && ( _v.value - 0 == v.settlementWay - 0 ) ){
                        payType_forShow = _v.name ;
                    }
                }) ;

                ACCOUNT_TYPE.forEach((_v,i)=>{
                    if( v.settlementType !== null && ( _v.value - 0 == v.settlementType - 0 ) ){
                        accountType_forShow = _v.name ;
                    }
                }) ;

                if(v.tallyType == '2'){
                    income = v.money;
                }

                if(v.tallyType == '3'){
                    payment = v.money;
                }

                var v_obj = fetch.adapterResponse(v,map) ;
                v_obj.totalCount = pageTotal ;
                v_obj.payType_forShow = payType_forShow ;
                v_obj.accountType_forShow = accountType_forShow ;
                v_obj.income = income ;
                v_obj.payment = payment ;

                v_obj.delFlag = delFlag ;
                return v_obj ;
            }) ;
            console.log(_arr);
            callback && callback(false,{
                data : _arr
            }) ;
        }
    }).error(function (data) {
        console.log(arguments) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                date: '016-08-20 09:32:45',
                id: 'XSD2016082015151',
                payType : '1' ,
                accountType : '2' ,
                customer: '上海西域机电系统有限公司',
                income : '100000' ,
                payment : '200000' ,
                tips : '这是个备注' ,
                operator : '我!' ,
                operation : '查看 编辑 删除' ,

                incomeType : '应付款' ,

                contacter : 'Ahkari' ,
                phone : '12121212' ,
                remainPrice : '12121.00' ,

                shouldPrice : '555555' ,
                sellCount: '1212121' ,
            },{
                date: '016-08-16 09:32:45',
                id: 'SKD2016082015151',
                payType : '2' ,
                accountType : '1' ,
                customer: '蕾姆蕾姆蕾姆!!!!!!',
                income : '200000' ,
                payment : '100000' ,
                tips : '这是个备注2222' ,
                operator : '你!' ,
                operation : '查看 编辑 删除' ,

                incomeType : '应收款' ,

                contacter : 'lilt' ,
                phone : '0000000' ,
                remainPrice : '21213313131313.00' ,

                shouldPrice : '8888888' ,
                sellCount: '9999999' ,
            }], 10) ,
            totalIncome: '￥10101010' ,
            totalExpenses: '￥212121' ,
        }) ;
    },200)*/
}
function fetchCustomer(params={},callback){
    setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : 'xiyu' ,
                value : 1
            },{
                name : 'ahkari' ,
                value : 2
            },{
                name : 'lily' ,
                value : 3
            }]
        }) ;
    },50) ;
}
function fetchPaytype(params={},callback){
    setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '现金' ,
                value : 1
            },{
                name : 'POS机刷卡' ,
                value : 2
            },{
                name : '支付宝' ,
                value : 3
            },{
                name : '微信' ,
                value : 4
            },{
                name : '银行转账' ,
                value : 5
            },{
                name : '网银转账' ,
                value : 6
            }]
        }) ;
    },50) ;
}
function fetchAccountType(params,callback) {
    callback && callback(false , {
        data : ACCOUNT_TYPE
    });
}
function fetchIncomeType(params,callback) {
    setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '其他收入' ,
                value : 1
            },{
                name : '应收款' ,
                value : 2
            },{
                name : '应付款' ,
                value : 3
            }]
        }) ;
    })
}

//
function initUser(params,callback){
    async.parallel([
        function(cal){
            fetchUserTable(params.init,cal)
        },
        function(cal){
            fetchUser(params.fetchCustomer,cal)
        },
        function(cal){
            fetchPaytype(params.init,cal)
        },
        function(cal){
            fetchMarketer(params.fetchMarketer,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
            user : results[1] ,
            payType : results[2] ,
            marketer : results[3] ,
        }) ;
    })
}

function fetchUserTable(params={},callback) {
    var map = {
        user: 'customerName',
        userID: 'customerId',
        date: 'businessTime',
        id: 'salesOrderNo',
        orderID: 'id',
        shouldPrice : 'receivable',
        endDate : 'deadLine' ,
        tips : 'comment' ,
        marketer : 'userName' ,
        marketerId: 'userId',

        incomeCount : '收款' ,
        operation : '查看 催款' ,

        remainPrice : 'arrearage' ,
        truePrice : '80000' ,
        //payType : 'settlementWay',
    } ;
    fetch.post({
        header : {
            code : 'SASORE001' ,
            version : '1.0' ,
        },
        body : {
            salesOrderParameter : params ,
        }
    }).success( function (result) {
        console.log(result);
        // result.data.salesOrderDtos = result.data.salesOrderDtos.map(function (v,i) {
        //     return fetch.adapterResponse(v,map) ;
        // }) ;
        // callback && callback(false,{
        //     data : result.data.salesOrderDtos ,
        // }) ;
        var _o =  result.data.salesOrderDtos.map(function (v,i) {
            var pageTotal = v.pageTotal ;
            var v_obj = fetch.adapterResponse(v,map) ;
            v_obj.totalCount = pageTotal ;
            return v_obj;
        }).concat([]) ;
        console.log(_o) ;
        callback && callback(false,{
            data : _o ,
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                date: '016-08-20 09:32:45',
                id: 'XSD2016082015151',
                user: '上海西域机电系统有限公司',
                shouldPrice : '555555' ,
                endDate : '2016-09-02' ,
                tips : '这是个备注' ,
                marketer : '销售员一' ,

                incomeCount : '收款' ,
                operation : '查看 催款' ,

                remainPrice : '10000' ,
                truePrice : '80000' ,
                accountType : '应收款' ,
                payType : '现金' ,


            },{
                date: '016-08-20 09:32:45',
                id: 'XSD2016082015151',
                user: '上海西域机电系统有限公司',
                shouldPrice : '55552255' ,
                endDate : '2013-09-02' ,
                tips : '这是个备注' ,
                marketer : '销售员一' ,

                incomeCount : '收款' ,
                operation : '查看 催款' ,

                remainPrice : '10000' ,
                truePrice : '80000' ,
                accountType : '应收款' ,
                payType : '现金' ,
            }], 20) ,
        }) ;
    },200)*/
}
function fetchUser(params={},callback){
    fetch.post({
        header : {
            code : 'SACSTM001' ,
            version : '1.0'
        },
        body : {
            customerParameter : params
        }
    }).success(function (result) {
        var arr = result.data.customerDtos.map((v,i)=>{
            return {
                name : v.name ,
                value : v.id ,
            }
        }) ;
        callback && callback( false , {
            data : arr
        }) ;
    }).error(function () {
        globalFunction.alert.warning( '获取客户列表失败'　,　'网络异常'　)
    }) ;
    /*setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '客户一' ,
                value : 1
            },{
                name : '客户二' ,
                value : 2
            },{
                name : '客户三' ,
                value : 3
            }]
        }) ;
    },50) ;*/
}
function fetchMarketer(params={},callback){
    fetch.post({
        header : {
            code : 'SAUSER009' ,
            version : '1.0' ,
        },
        body : {
            usersParameter : params ,
        }
    }).success(function (result) {
        var arr = result.data.users.map((v,i)=>{
            return {
                name : v.memberName ,
                value : v.id ,
            }
        }) ;
        callback && callback( false , {
            data : arr
        }) ;
    }).error(function () {
        globalFunction.alert.warning( '获取销售列表失败'　,　'网络异常'　)
    }) ;
    /*setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '销售员一' ,
                value : 1
            },{
                name : '销售员二' ,
                value : 2
            },{
                name : '销售员三' ,
                value : 3
            }]
        }) ;
    })*/
}

function deleteChargeAccount(params={},callback){
    fetch.post({
        header : {
            code : 'SATALY006' ,
            version : '1.0'
        },
        body : params
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function () {
        globalFunction.alert.warning( '删除用户失败'　,　'网络异常'　)
    }) ;
}

function fetchChargeAccountDetail(params={},callback){
    /*var map = {
        customer: 'customerName',
        contacter: 'customerContact',
        phone: 'customerMobile',
        remainPrice: 'quantity',
        date: 'businessTime',
        id: 'salesOrderNoName',
        sellCount: '',
        payType: 'settlementWayName',
        truePrice: 'quantity',
        shouldPrice: '',
        img: 'imgUrl',
        tips: 'comment',
        operator: '',
    } ;*/
    fetch.post({
        header : {
            code : 'SATALY008' ,
            version : '1.0' ,
        },
        body : {
            continualTallyDto : params ,
        }
    }).success( function (result) {
        console.log(result);
       /* result.data.salesOrderDto = result.data.salesOrderDto.map(function (v,i) {
            return fetch.adapterResponse(v,map) ;
        }) ;*/
        if(result.data){
            var _arr = [result.data.salesOrderDto].map((v)=>{
                var payType_forShow = '' ;
                var accountType_forShow = '';
                var ret = v.continualTallyDtos ;
                PAY_TYPE.forEach((_v,i)=>{
                    if( v.settlementWay !== null && ( _v.value - 0 == v.settlementWay - 0 ) ){
                        payType_forShow = _v.name ;
                    }
                }) ;

                ACCOUNT_TYPE.forEach((_v,i)=>{
                    if( v.settlementType !== null && ( _v.value - 0 == v.settlementType - 0 ) ){
                        accountType_forShow = _v.name ;
                    }
                }) ;

                ret&& ret.forEach((a,i) => {
                    PAY_TYPE.forEach((_v,i)=>{
                        if( a.settlementWay !== null && ( _v.value - 0 == a.settlementWay - 0 ) ){
                            a.settlementWay = _v.name ;
                        }
                    }) ;
                });

                v.payType_forShow = payType_forShow ;
                v.accountType_forShow = accountType_forShow ;
                return v ;
            }) ;
            callback && callback(false,{
                data : _arr
            }) ;
        }
        else{
            globalFunction.alert.warning('获取不到详细信息','操作提示')
        }

    }).error(function (data) {
        console.log(arguments) ;
    })　;
}
//

function fetchChargeAccountDetail2(params={},callback){
    /*var map = {
     customer: 'customerName',
     contacter: 'customerContact',
     phone: 'customerMobile',
     remainPrice: 'quantity',
     date: 'businessTime',
     id: 'salesOrderNoName',
     sellCount: '',
     payType: 'settlementWayName',
     truePrice: 'quantity',
     shouldPrice: '',
     img: 'imgUrl',
     tips: 'comment',
     operator: '',
     } ;*/
    fetch.post({
        header : {
            code : 'SATALY009' ,
            version : '1.0' ,
        },
        body : {
            continualTallyDto : params ,
        }
    }).success( function (result) {
        console.log(result);
        /* result.data.salesOrderDto = result.data.salesOrderDto.map(function (v,i) {
         return fetch.adapterResponse(v,map) ;
         }) ;*/
        var _arr = [result.data.purchaseOrderDto].map((v)=>{
            var payType_forShow = '' ;
            var accountType_forShow = '';
            var ret = v.continualTallyDtos ;
            PAY_TYPE.forEach((_v,i)=>{
                if( v.settlementWay !== null && ( _v.value - 0 == v.settlementWay - 0 ) ){
                    payType_forShow = _v.name ;
                }
            }) ;

            ACCOUNT_TYPE.forEach((_v,i)=>{
                if( v.settlementType !== null && ( _v.value - 0 == v.settlementType - 0 ) ){
                    accountType_forShow = _v.name ;
                }
            }) ;

            ret&& ret.forEach((a,i) => {
                PAY_TYPE.forEach((_v,i)=>{
                    if( a.settlementWay !== null && ( _v.value - 0 == a.settlementWay - 0 ) ){
                        a.settlementWay = _v.name ;
                    }
                }) ;
            });

            v.payType_forShow = payType_forShow ;
            v.accountType_forShow = accountType_forShow ;
            return v ;
        }) ;
        callback && callback(false,{
            data : _arr
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}

function initSupplier(params,callback){
    async.parallel([
        function(cal){
            fetchSupplierTable(params.init,cal)
        },
        function(cal){
            fetchSupplier(params.fetchSupplier,cal)
        },
        function(cal){
            fetchPaytype(params.init,cal)
        },
        function(cal){
            fetchPurchaseer(params.fetchPurchase,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
            supplier : results[1] ,
            payType : results[2] ,
            purchaseer : results[3] ,
        }) ;
    })
}

function fetchSupplierTable(params={},callback) {
    var map = {
        orderID: 'id',
        date: 'businessTime',
        id: 'purchaseOrderNo',
        supplier: 'supplierName',
        userID: 'supplierId',
        shouldPrice : 'payable' ,
        endDate : 'deadLine' ,
        tips : 'comment' ,
        purchaseer : 'userName' ,

        incomeCount : '收款' ,
        operation : '查看 催款' ,

        remainPrice : 'arrearage' ,
        truePrice : '80000' ,
        accountType : '应收款' ,
        payType : '现金' ,
    } ;
    fetch.post({
        header : {
            code : 'SAPORE001' ,
            version : '1.0' ,
        },
        body : {
            purchaseOrderParameter : params ,
        }
    }).success( function (result) {
        console.log(result);
       /* result.data.purchaseOrderDtos = result.data.purchaseOrderDtos.map(function (v,i) {
            return fetch.adapterResponse(v,map) ;
        }) ;
        callback && callback(false,{
            data : result.data.purchaseOrderDtos ,
        }) ;*/
        var _o =  result.data.purchaseOrderDtos.map(function (v,i) {
            var pageTotal = v.pageTotal ;
            var v_obj =  fetch.adapterResponse(v,map) ;
            v_obj.totalCount = pageTotal ;
            return v_obj;
        }).concat([]) ;
        console.log(_o) ;
        callback && callback(false,{
            data : _o ,
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                date: '016-08-20 09:32:45',
                id: 'XSD2016082015151',
                supplier: '上海西域机电系统有限公司',
                shouldPrice : '555555' ,
                endDate : '2016-09-02' ,
                tips : '这是个备注' ,
                purchaseer : '采购员一' ,

                incomeCount : '收款' ,
                operation : '查看 催款' ,

                remainPrice : '10000' ,
                truePrice : '80000' ,
                accountType : '应收款' ,
                payType : '现金' ,


            },{
                date: '016-08-20 09:32:45',
                id: 'XSD2016082015151',
                supplier: '上海西域机电系统有限公司',
                shouldPrice : '5552555' ,
                endDate : '2011-09-02' ,
                tips : '这是个备注' ,
                purchaseer : '采购员一' ,

                incomeCount : '收款' ,
                operation : '查看 催款' ,

                remainPrice : '10000' ,
                truePrice : '80000' ,
                accountType : '应收款' ,
                payType : '现金' ,
            }], 10) ,
        }) ;
    },200)*/
}
function fetchSupplier(params={},callback){
    fetch.post({
        header : {
            code : 'SASPLR001' ,
            version : '1.0' ,
        },
        body : {
            supplierParameter : params ,
        }
    }).success( function (result) {
        // var arr = [] ;
        var arr = result.data.supplierDtos.map((v,i)=>{
            return {
                name : v.name ,
                value : v.id ,
            }
        }) ;
        callback && callback( false , {
            data : arr
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
    /*setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '供应商一' ,
                value : 1
            },{
                name : '供应商二' ,
                value : 2
            },{
                name : '供应商三' ,
                value : 3
            }]
        }) ;
    },50) ;*/
}
function fetchPurchaseer(params={},callback){
    fetch.post({
        header : {
            code : 'SAUSER009' ,
            version : '1.0' ,
        },
        body : {
            usersParameter : params ,
        }
    }).success(function (result) {
        var arr = result.data.users.map((v,i)=>{
            return {
                name : v.memberName ,
                value : v.id ,
            }
        }) ;
        callback && callback( false , {
            data : arr
        }) ;
    }).error(function () {
        globalFunction.alert.warning( '获取采购列表失败'　,　'网络异常'　)
    }) ;
    /*setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '采购员一' ,
                value : 1
            },{
                name : '采购员二' ,
                value : 2
            },{
                name : '采购员三' ,
                value : 3
            }]
        }) ;
    })*/
}

function earlyStageAdjustment(params={},callback) {
    fetch.post({
        header : {
            code : 'SATALY011' ,
            version : '1.0' ,
        },
        body : {
            customerDto : params ,
        }
    }).success( function (result) {
        console.log(result);
        callback && callback(false,{
            data : result ,
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}



function earlyStageAdjustment2(params={},callback) {
    fetch.post({
        header : {
            code : 'SATALY012' ,
            version : '1.0' ,
        },
        body : {
            supplierDto : params ,
        }
    }).success( function (result) {
        console.log(result);
        callback && callback(false,{
            data : result ,
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}

function receiveAccount1(params={},callback) {
    fetch.post({
        header : {
            code : 'SATALY005' ,
            version : '1.0' ,
        },
        body : {
            continualTallyFormDto : params ,
        }
    }).success( function (result) {
        console.log(result);
        callback && callback(false,{
            data : result ,
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}

function payAccount1(params={},callback) {
    fetch.post({
        header : {
            code : 'SATALY005' ,
            version : '1.0' ,
        },
        body : {
            continualTallyFormDto : params ,
        }
    }).success( function (result) {
        console.log(result);
        callback && callback(false,{
            data : result ,
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}

function alreadySend(params={},callback) {
    fetch.post({
        header : {
            code : 'SATALY013' ,
            version : '1.0' ,
        },
        body : {
            confirmRemindDtos : params ,
        }
    }).success( function (result) {
        console.log(result);
        callback && callback(false,{
            data : result.data.confirmRemindDtos ,
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}

function sendMessage(params={},callback) {
    fetch.post({
        header : {
            code : 'SATALY010' ,
            version : '1.0' ,
        },
        body : {
            confirmRemindDtos : params ,
        }
    }).success( function (result) {
        console.log(result);
        callback && callback(false,{
            data : result ,
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;
}



export default {
    initCharge,
    fetchChargeTable ,
    //
    initUser,
    fetchUserTable,
    //
    initSupplier,
    fetchSupplierTable,
    //
    deleteChargeAccount,
    fetchChargeAccountDetail,
    fetchChargeAccountDetail2,
    //  
    earlyStageAdjustment,
    earlyStageAdjustment2,
    //
    receiveAccount1,
    payAccount1,
    alreadySend,
    sendMessage

}
