import * as mock from './mock'
import * as async from 'async'
import * as fetch from './utils/fetch'
import * as localstore from './utils/localstore'
import {
    PAY_TYPE ,
    PRODUCT_TYPE ,
    RECODE_TYPE ,
} from '../constants/index.js'

function initPurchaseOrder(params,callback) {
    async.parallel([
        function(cal){
            fetchPurchaseOrder(params.init,cal)
        },
        function(cal){
            fetchSupplier(params.fetchSupplier,cal)
        },
        function(cal){
            fetchPaytype(params.init,cal)
        },
        function(cal){
            fetchProducttype(params.init,cal)
        },
        function(cal){
            fetchRecodetype(params.init,cal)
        },
        function(cal){
            fetchPurchase(params.fetchPurchase,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            data : results[0] ,
            supplier : results[1] ,
            payType : results[2] ,
            productType : results[3] , //到货状态
            recodeType : results[4] ,
            purchaser : results[5] ,
        }) ;
    })
}


function fetchPurchaseOrder(params={},callback) {
    var map = {
        date : 'businessTime' , //日期
        supplier : 'supplierId' , //采购 //need forShow
        id : 'id' , //采购单id //need forShow
        productNum : 'quantity' , //货品数量
        purchaseCount :　'amount' , //销售金额
        payType : 'settlementWay' , //结算方式 //need for show
        truePrice : 'paid' , //实付款
        shouldPrice : 'payable' , //应付款
        operator : 'userName'　, //操作人

        endDate : 'deadLine' , //尾款到期日
        // sendState: 'imgUrl' ,
        operation　:　'sort' ,
        tips : 'comment' ,
        img : 'imgUrl' ,
    } ;
    fetch.post({
        header : {
            code : 'SAPORE001' ,
            version : '1.0' ,
        },
        body : {
            purchaseOrderParameter : params
        } ,
        async : true ,
    }).success( function (result) {
        console.log(result);
        if ( result.mark == '000000000' ){

            var _arr = result.data.purchaseOrderDtos.map((v)=>{
                var supplierName_forShow = v.supplierName ;
                var id_forShow = v.purchaseOrderNoName ;
                var id_forShow_noPrefix = v.purchaseOrderNo ;
                var payType_forShow = '' ;
                var pageTotal = v.pageTotal ;
                var delFlag = v.delFlag ; //用于判别是否可撤销

                PAY_TYPE.forEach((_v,i)=>{
                    if( v.settlementWay !== null && ( _v.value - 0 == v.settlementWay - 0 ) ){
                        payType_forShow = _v.name ;
                    }
                }) ;

                var v_obj = fetch.adapterResponse(v,map) ;
                v_obj.totalCount = pageTotal ;
                v_obj.supplierName_forShow = supplierName_forShow ;
                v_obj.id_forShow = id_forShow ;
                v_obj.id_forShow_noPrefix = id_forShow_noPrefix ;
                v_obj.payType_forShow = payType_forShow ;

                v_obj.delFlag = delFlag ;

                return v_obj ;
            }) ;
            callback && callback(false,{
                data : _arr
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '采购单信息获取失败'　,　'网络异常'　) ;
    })　;
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
}
function fetchPaytype(params={},callback){
    callback && callback(false, {
        data: PAY_TYPE,
    })
}
function fetchProducttype(params={},callback){
    callback && callback(false,{
        data : PRODUCT_TYPE ,
    }) ;
}
function fetchRecodetype(params={},callback){
    callback && callback(false,{
        data : RECODE_TYPE ,
    })
}
function fetchPurchase(params={},callback){
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
}
//查找所有货品放到穿梭框左侧
function fetchPurchaseProduct(params={},callback) {
    fetch.post({
        header : {
            code : 'SAITEM003' ,
            version : '1.0' ,
        },
        body : {
            itemParameter : params ,
        }
    }).success( function (result) {
        callback && callback(result) ;
    }).error(function (data) {
        globalFunction.alert.warning( '查询产品信息失败' , '网络异常' ) ;
    })　;
}
//查询采购记录详情
function fetchPurchaseDeatil(params,callback) {
    var map = {
        date : 'businessTime' , //日期
        supplier : 'supplierId' , //采购商 //need forShow
        id : 'id' , //采购单id //need forShow
        productNum : 'quantity' , //货品数量
        purchaseCount :　'amount' , //销售金额
        payType : 'settlementWay' , //结算方式 //need for show
        truePrice : 'paid' , //实付款
        shouldPrice : 'payable' , //应付款
        operator : 'userName'　, //操作人

        endDate : 'deadLine' , //尾款到期日
        //
        // sendState: 'imgUrl' ,
        operation　:　'sort' ,
        tips : 'comment' ,
        img : 'imgUrl' ,

        product : 'purchaseOrderDetailDtos' , //该采购单内含的货品详情
        accountDetails : 'continualTallyDtos' ,
    } ;
    fetch.post({
        header : {
            code : 'SAPORE002' ,
            version : '1.0'
        },
        body : params
    }).success(function(result){
        console.log(result);
        var ret = result.data.purchaseOrderDto ;
        var supplierName_forShow = ret.supplierName ;
        var id_forShow = ret.purchaseOrderNoName ;
        var id_forShow_noPrefix = ret.purchaseOrderNo ;
        var payType_forShow = '' ;
        var delFlag = ret.delFlag ; //用于判别是否可撤销

        PAY_TYPE.forEach((_v,i)=>{
            if( ret.settlementWay !== null && ( _v.value - 0 == ret.settlementWay - 0 ) ){
                payType_forShow = _v.name ;
            }
        }) ;
        ret.purchaseOrderDetailDtos&& ret.purchaseOrderDetailDtos.forEach((v,i) => {
            PRODUCT_TYPE.forEach((_v,i)=>{
                if( v.arrivalState !== null && ( _v.value - 0 == v.arrivalState - 0 ) ){
                    v.arrivalState = _v.name ;
                }
            }) ;
        });
        ret.continualTallyDtos&& ret.continualTallyDtos.forEach((v,i) => {
            PAY_TYPE.forEach((_v,i)=>{
                if( v.settlementWay !== null && ( _v.value - 0 == v.settlementWay - 0 ) ){
                    v.settlementWay = _v.name ;
                }
            }) ;
        });

        var v_obj = fetch.adapterResponse(ret,map) ;

        v_obj.supplierName_forShow = supplierName_forShow ;
        v_obj.id_forShow = id_forShow ;
        v_obj.id_forShow_noPrefix = id_forShow_noPrefix ;
        v_obj.payType_forShow = payType_forShow ;
        v_obj.delFlag = delFlag ;

        result.data.purchaseOrderDto = v_obj ;

        callback && callback(result) ;
    }).error(function(result){
        globalFunction.alert.warning( '查询采购单详情失败' , '网络异常' )
    })　;
}
//撤销指定采购记录 
function deletePurchaseList(params={},callback){
    fetch.post({
        header : {
            code : 'SAPORE007' ,
            version : '1.0'
        },
        body : {
            purchaseOrderParameter : params
        }
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function () {
        globalFunction.alert.warning( '删除采购记录失败'　,　'网络异常'　)
    }) ;
}
//新增采购单
function addPurchase(params={},callback){
    fetch.post({
        header : {
            code : 'SAPORE004' ,
            version : '1.0' ,
        },
        body : {
            purchaseOrderParameter : params ,
        }
    }).success(function(result){
        callback && callback(result) ;
    }).error(function(data){
        globalFunction.alert.warning( '新增采购单失败' , '网络异常' ) ;
    })
}





export default {
    initPurchaseOrder,

    fetchPurchaseOrder ,
    fetchPurchaseDeatil ,
    fetchPurchaseProduct ,
    deletePurchaseList ,
    addPurchase ,
}
