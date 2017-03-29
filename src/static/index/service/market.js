import * as mock from './mock'
import * as async from 'async'
import * as fetch from './utils/fetch'
import * as localstore from './utils/localstore'
import {
    PAY_TYPE ,
    PRODUCT_TYPE ,
    RECODE_TYPE ,
} from '../constants/index.js'


function initMarketList(params,callback) {
    async.parallel([
        function(cal){
            fetchMarketList(params.init,cal)
            // fetchCustomer(params,cal)
        },
        function(cal){
            fetchCustomer(params.fetchCustomer,cal)
        },
        function(cal){
            fetchPaytype(params.init,cal)
        },
        function(cal){
            fetchProducttype(params.init,cal)
        },
        function(cal){
            fetchRecodetype(params.init,cal)
        } ,
        function(cal){
            fetchMarket(params.fetchMarketer,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            data : results[0] ,
            customer : results[1] ,
            payType : results[2] ,
            productType : results[3] ,
            recodeType : results[4] ,
            salesMan : results[5] ,
        }) ;
    })
}

//查询列表 OK
function fetchMarketList(params={},callback) {
    var map = {
        date : 'businessTime' , //日期
        customer : 'customerId' , //客户 //need forShow
        id : 'id' , //销售单id //need forShow
        productNum : 'quantity' , //货品数量
        sellCount :　'amount' , //销售金额
        // endType : 'settlementWay' , //结算方式 //need for show
        payType : 'settlementWay' , //结算方式 //need for show
        truePrice : 'received' , //实收款
        shouldPrice : 'receivable' , //应收款
        operator : 'userName'　, //操作人

        endDate : 'deadLine' , //尾款到期日
        //
        // sendState: 'imgUrl' ,

        operation　:　'sort' ,
        tips : 'comment' ,
        img : 'imgUrl' ,
        // contacter : '' ,
        // phone : '' ,
        // remainPrice : '' ,
    } ;
    fetch.post({
        header : {
            code : 'SASORE001' ,
            version : '1.0' ,
        },
        body : {
            salesOrderParameter : params
        } ,
        async : true ,
    }).success( function (result) {
        console.log(result);
        if ( result.mark == '000000000' ){

            var _arr = result.data.salesOrderDtos.map((v)=>{
                var customerName_forShow = v.customerName ;
                var id_forShow = v.salesOrderNoName ;
                var id_forShow_noPrefix = v.salesOrderNo ;
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
                v_obj.customerName_forShow = customerName_forShow ;
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
        globalFunction.alert.warning( '销售单信息获取失败'　,　'网络异常'　) ;
    })　;
}
//查询该用户下的 客户 OK
function fetchCustomer(params={},callback){
    fetch.post({
        header : {
            code : 'SACSTM001' ,
            version : '1.0' ,
        },
        body : {
            customerParameter : params ,
        }
    }).success( function (result) {
        // var arr = [] ;
        var arr = result.data.customerDtos.map((v,i)=>{
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

//OK 支付方式!!!  1-默认结算方式 2-现金 3-POS机 4-支付宝 5-微信 6-银行转账 7-网银转账
function fetchPaytype(params={},callback) {
    callback && callback(false, {
        data: PAY_TYPE,
    })
}
//获取产品发货状态 OK
function fetchProducttype(params={},callback){
    callback && callback(false,{
        data : PRODUCT_TYPE ,
    }) ;
}
//获取记录状态 OK
function fetchRecodetype(params={},callback){
    callback && callback(false,{
        data : RECODE_TYPE ,
    })
}
//获取操作人（销售员）
function fetchMarket(params={},callback){
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
        globalFunction.alert.warning( '获取销售员列表失败'　,　'网络异常'　)
    }) ;
}
//查询销售记录详情 OK
function fetchMarketDeatil(params={},callback) {
    var map = {
        date : 'businessTime' , //日期
        customer : 'customerId' , //客户 //need forShow
        id : 'id' , //销售单id //need forShow
        productNum : 'quantity' , //货品数量
        sellCount :　'amount' , //销售金额
        // endType : 'settlementWay' , //结算方式 //need for show
        payType : 'settlementWay' , //结算方式 //need for show
        truePrice : 'received' , //实收款
        shouldPrice : 'receivable' , //应收款
        operator : 'userName'　, //操作人

        endDate : 'deadLine' , //尾款到期日
        //
        // sendState: 'imgUrl' ,

        operation　:　'sort' ,
        tips : 'comment' ,
        img : 'imgUrl' ,
        // contacter : '' ,
        // phone : '' ,
        // remainPrice : '' ,

        product : 'salesOrderDetailDtos' , //该销售单内含的货品详情
        accountDetails : 'continualTallyDtos' ,
    } ;
    fetch.post({
        header : {
            code : 'SASORE002' ,
            version : '1.0'
        },
         body : params
    }).success(function(result){
        var ret = result.data.salesOrderDto ;

        var customerName_forShow = ret.customerName ;
        var id_forShow = ret.salesOrderNoName ;
        var id_forShow_noPrefix = ret.salesOrderNo ;
        var payType_forShow = '' ;

        var delFlag = ret.delFlag ; //用于判别是否可撤销

        PAY_TYPE.forEach((_v,i)=>{
            if( ret.settlementWay !== null && ( _v.value - 0 == ret.settlementWay - 0 ) ){
                payType_forShow = _v.name ;
            }
        }) ;
        ret.continualTallyDtos&& ret.continualTallyDtos.forEach((v,i) => {
            PAY_TYPE.forEach((_v,i)=>{
                if( v.settlementWay !== null && ( _v.value - 0 == v.settlementWay - 0 ) ){
                    v.settlementWay = _v.name ;
                }
            }) ;
        });

        var v_obj = fetch.adapterResponse(ret,map) ;

        v_obj.customerName_forShow = customerName_forShow ;
        v_obj.id_forShow = id_forShow ;
        v_obj.id_forShow_noPrefix = id_forShow_noPrefix ;
        v_obj.payType_forShow = payType_forShow ;

        v_obj.delFlag = delFlag ;

        result.data.salesOrderDto = v_obj ;

        callback && callback(result) ;
    }).error(function(result){
        globalFunction.alert.warning( '查询销售单详情失败' , '网络异常' )
    })　;

}

//撤销指定销售记录 OK
function deleteMarketList(params={},callback){
    fetch.post({
        header : {
            code : 'SASORE008' ,
            version : '1.0'
        },
        body : {
            salesOrderParameter : params
        }
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function () {
        globalFunction.alert.warning( '删除销售记录失败'　,　'网络异常'　)
    }) ;
}

//获取当前全部的货品  OK
function fetchMarketProduct(params={},callback) {
    var map = {
        id : 'itemId' , //
        product : 'itemName' , //
        category : 'categoryId' , //
        brand : 'brandId' , //
        specification :　'specification' , //
        unit : 'unitId' , //
        number : 'existingQuantity' , //
        inventoryCost : 'stockCost' , //
        operation : 'operation' ,

        img : 'imgUrl' , //
        tips : 'comment'　, //
        sort　:　'sort' ,
        operator : 'operator'
    } ;
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
        // if ( result.mark == '000000000' ){
        //     result.data.items = result.data.items.map((v)=>{
        //         var categoryName_forShow = v.categoryName ;
        //         var brandName_forShow = v.brandName ;
        //         var v_obj = fetch.adapterResponse(v,map) ;
        //         v_obj.categoryName_forShow = categoryName_forShow ;
        //         v_obj.brandName_forShow = brandName_forShow ;
        //         return v_obj ;
        //     }) ;
        //     result.data.items.category_forShow =
        //         callback && callback(false,{
        //             data : result.data.items
        //         }) ;
        // } else {
        //     globalFunction.alert.warning( result.message , '提示' ) ;
        // }
    }).error(function (data) {
        globalFunction.alert.warning( '查询产品信息失败' , '网络异常' ) ;
    })　;
}

//新增销售单
function addMarket(params={},callback){
    fetch.post({
        header : {
            code : 'SASORE004' ,
            version : '1.0' ,
        },
        body : {
            salesOrderParameter : params ,
        }
    }).success(function(result){
        callback && callback(result) ;
    }).error(function(data){
        globalFunction.alert.warning( '新增销售单失败' , '网络异常' ) ;
    })
}



export default {
    initMarketList,

    fetchMarketList ,
    fetchMarketDeatil ,

    deleteMarketList ,
    
    fetchMarketProduct ,

    addMarket ,

}
