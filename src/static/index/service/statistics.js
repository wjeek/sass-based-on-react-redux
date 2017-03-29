import * as mock from './mock'
import * as async from 'async'
import * as fetch from './utils/fetch'
import * as localstore from './utils/localstore'

import {
    PAY_TYPE ,
    ACCOUNT_TYPE,
    PRODUCT_TYPE ,
    RECODE_TYPE ,
} from '../constants/index.js'


// 1
function initMarketProduct(params,callback) {
    async.parallel([
        function(cal){
            fetchMarketProduct(params,cal)
        },
        function(cal){
            fetchProduct(params,cal)
        },
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
            product : results[1] ,
            brand : results[2] ,
            specifications : results[3]
        }) ;
    })
}
function fetchMarketProduct(params={},callback) {
    var map = {
        id : 'customerId' , //
        customer : 'customerName' , //
        contacter : 'contact' ,
        salelist : 'salesOrderCount' ,
        salecount : 'salesQuantity' ,
        salemoney : 'salesAmount' ,
        saleaverage : 'avgSalesUnitPrice' ,
    } ;
    fetch.post({
        header : {
            code : 'SASTAT001' ,
            version : '1.0' ,
        },
        body : {
            params : params ,
        }
    }).success( function (result) {
        //console.log(result);
        result.data && result.data.statisticsResults && (result.data.statisticsResults = result.data.statisticsResults.map(function (v,i) {
            var pageTotal = v.pageTotal ;
            var v_obj =  fetch.adapterResponse(v,map) ;
            v_obj.totalCount = pageTotal ;
            return v_obj;
        }));
        if( result.data === null ){
            callback && callback(false,{
                data : [] ,
            }) ;
        }else{
            callback && callback(false,{
                data : result.data.statisticsResults ,
            }) ;
        }
    }).error(function (result) {
        console.log(result) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                id : '233' ,
                customer : '上海西域机电' ,
                contacter : '张三 101121212' ,
                salelist : '100' ,
                salecount : '2999999' ,
                salemoney : '111 ,
                saleaverage : '231'

                // product : '飞利浦工具套装套' ,
                // category : 1 ,
                // brand : 2 ,
                // specification :　'TCH0816 XTLDU-82 /865双接线' ,
                // unit : 1 ,
                // number : '100' ,
                // inventoryCost : '2000.00' ,
                // operation : '查看 编辑 删除' ,
                //
                // img : 'http://www.baidu.com' ,
                // tips : '这是一个备注呢!'　,
                // sort　:　12 ,
                // operator : '我'
            },{
                id : '231313' ,
                customer : '蕾姆蕾姆蕾姆' ,
                contacter : '我我我我! 101121212' ,
                salelist : '10' ,
                saleall : '200000' ,
                salecount : '3199999' ,
                saleaverage : '23331' ,
                returnlist : '2012100' ,
                returnall : '203130000' ,
                returncount : '3100000' ,
                returnpercent : '0.4%' ,
            }], 10) ,
        }) ;
    },200)*/
}
function fetchProduct(params={},callback){
    setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '吹风机' ,
                value : 1
            },{
                name : 'MRO那啥玩意' ,
                value : 2
            }]
        }) ;
    },50) ;
}
// 2
function initMarketUser(params,callback) {
    async.parallel([
        function(cal){
            fetchMarketUser(params.init,cal)
        },
        function(cal){
            fetchCustomer(params.fetchCustomer,cal)
        },
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
            customer : results[1] ,
            contacter : results[2] ,
        }) ;
    })
}
function fetchMarketUser(params={},callback) {
    var map = {
        id : 'itemId' , //
        product : 'itemName' , //
        brand : 'brandId' ,
        specifications : 'salesOrderCount' ,
        unit : 'salesQuantity' ,
        saleList : 'salesOrderCount' ,
        saleCount : 'salesQuantity' ,
        saleMoney : 'salesAmount' ,
    } ;
    fetch.post({
        header : {
            code : 'SASTAT002' ,
            version : '1.0' ,
        },
        body : {
            params : params ,
        }
    }).success( function (result) {
        console.log(result);
        result.data && result.data.statisticsResults && (result.data.statisticsResults = result.data.statisticsResults.map(function (v,i) {
            var pageTotal = v.pageTotal ;
            var v_obj =  fetch.adapterResponse(v,map) ;
            v_obj.totalCount = pageTotal ;
            return v_obj;
        })) ;
        if( result.data === null ){
            callback && callback(false,{
                data : [] ,
            }) ;
        }else{
            callback && callback(false,{
                data : result.data.statisticsResults ,
            }) ;
        }
    }).error(function (result) {
        console.log(result) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                id : '233' ,
                product : '飞利浦支架什么的' ,
                brand : '飞利浦' ,
                specifications : 'TCH2121' ,
                unit : '只' ,
                salelist : '10' ,
                saleall : '200000' ,
                salecount : '3199999' ,
                returnlist : '2012100' ,
                returnall : '203130000' ,
                returncount : '3100000' ,
                returnpercent : '0.4%' ,
            },{
                id : '221213' ,
                product : '丢你蕾姆丢你拉姆' ,
                brand : '蕾姆' ,
                specifications : 'XXXX2121' ,
                unit : '个' ,
                salelist : '1' ,
                saleall : '20' ,
                salecount : '39' ,
                returnlist : '20' ,
                returnall : '20' ,
                returncount : '300' ,
                returnpercent : '0.8%' ,
            }], 10) ,
        }) ;
    },200)*/
}
function fetchCustomer(params={},callback){
    fetch.post({
        header : {
            code : 'SACSTM001' ,
            version : '1.0'
        },
        body : {
            customerParameter : params
        }
    }).success(function (result) {
        console.log(result);
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
                name : '客户三了啦' ,
                value : 3
            }]
        }) ;
    },50) ;*/
}
//3
function initMarketMarket(params,callback) {
    async.parallel([
        function(cal){
            fetchMarketMarket(params.init,cal)
        },
        function(cal){
            fetchMarket(params.fetchMarket,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
            market : results[1] ,
        }) ;
    })
}
function fetchMarketMarket(params={},callback) {
    var map = {
        id : 'userId' ,
        saleMan : 'userName' ,
        customerCount : 'totalCustomerCount' ,
        madeCount : 'tradedCustomerCount' ,
        saleCount : 'salesOrderCount' ,
        productCount : 'itemQuantity' ,
        saleMoney : 'salesAmount' ,
        shouldCheques : 'receivable' ,
    };
    fetch.post({
        header : {
            code : 'SASTAT003' ,
            version : '1.0' ,
        },
        body : {
            params : params ,
        }
    }).success( function (result) {
        console.log(result);
        result.data && result.data.statisticsResults && (result.data.statisticsResults = result.data.statisticsResults.map(function (v,i) {
            var pageTotal = v.pageTotal ;
            var v_obj =  fetch.adapterResponse(v,map) ;
            v_obj.totalCount = pageTotal ;
            return v_obj;
        })) ;
        if( result.data === null ){
            callback && callback(false,{
                data : [] ,
            }) ;
        }else{
            callback && callback(false,{
                data : result.data.statisticsResults ,
            }) ;
        }
    }).error(function (result) {
        console.log(result) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                id : '233' ,
                market : '销售员1' ,
                index : '1' ,
                saleman : '我是1' ,
                customercount : '500' ,
                madecount : '300' ,
                salecount : '200' ,
                productcount : '100' ,
                salemoney : '3100000' ,
                shouldcheques : '250000' ,
                operation: '查看明细',
            },{
                id : '3' ,
                market : '销售员2' ,
                index : '2' ,
                saleman : '我是2' ,
                customercount : '5000' ,
                madecount : '3000' ,
                salecount : '2000' ,
                productcount : '1000' ,
                salemoney : '3100000' ,
                shouldcheques : '2500000' ,
                operation: '查看明细',
            }], 10) ,
        }) ;
    },200)*/
}
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
        globalFunction.alert.warning( '获取销售列表失败'　,　'网络异常'　)
    }) ;
    /*setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '销售一' ,
                value : 1
            },{
                name : '销售二' ,
                value : 2
            },{
                name : '销售三了啦' ,
                value : 3
            }]
        }) ;
    },50) ;*/
}
//4
function initMarketSale(params,callback) {
    async.parallel([
        function(cal){
            fetchMarketSale(params,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
        }) ;
    })
}
function fetchMarketSale(params={},callback) {
    fetch.post({
        header : {
            code : 'SASTAT004' ,
            version : '1.0' ,
        },
        body : {
            params : params ,
        }
    }).success( function (result) {
        console.log(result);

        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        }else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (result) {
        globalFunction.alert.warning( '加载销售额图表' , '网络异常' ) ;
    })　;
}

//
//
//1
function initPurchaseProduct(params,callback) {
    async.parallel([
        function(cal){
            fetchPurchaseProduct(params,cal)
        },
        function(cal){
            fetchProduct(params,cal)
        },
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
            product : results[1] ,
            brand : results[2] ,
            specifications : results[3]
        }) ;
    }) ;
}
function fetchPurchaseProduct(params={},callback) {
    var map = {
        id : 'supplierId' ,
        supplier : 'supplierName' ,
        contacter : 'contact' ,
        salelist : 'purchaseOrderCount' ,
        saleall : 'purchaseQuantity' ,
        salecount : 'purchaseAmount' ,
        saleaverage : 'avgPurchaseUnitPrice' ,
    };
    fetch.post({
        header : {
            code : 'SASTAT005' ,
            version : '1.0' ,
        },
        body : {
            params : params ,
        }
    }).success( function (result) {
        console.log(result);
        result.data && result.data.statisticsResults && (result.data.statisticsResults = result.data.statisticsResults.map(function (v,i) {
            var pageTotal = v.pageTotal ;
            var v_obj =  fetch.adapterResponse(v,map) ;
            v_obj.totalCount = pageTotal ;
            return v_obj;
        }) );
        if( result.data === null ){
            callback && callback(false,{
                data : [] ,
            }) ;
        }else{
            callback && callback(false,{
                data : result.data.statisticsResults ,
            }) ;
        }
    }).error(function (result) {
        console.log(result) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                id : '233' ,
                supplier : '上海西域机电' ,
                contacter : '张三 101121212' ,
                salelist : '100' ,
                saleall : '100000' ,
                salecount : '2999999' ,
                saleaverage : '231' ,
                returnlist : '2000' ,
                returnall : '200000' ,
                returncount : '100000' ,
                returnpercent : '0.2%' ,
            },{
                id : '0001233' ,
                supplier : '蕾姆蕾姆蕾姆!' ,
                contacter : '张三 101121212' ,
                salelist : '100' ,
                saleall : '100000' ,
                salecount : '2999999' ,
                saleaverage : '231' ,
                returnlist : '2000' ,
                returnall : '200000' ,
                returncount : '100000' ,
                returnpercent : '0.2%' ,
            }], 10) ,
        }) ;
    },200)*/
}
//2
function initPurchaseSupplier(params,callback) {
    async.parallel([
        function(cal){
            fetchPurchaseSupplier(params.init,cal)
        },
        function(cal){
            fetchSupplier(params.fetchSupplier,cal)
        },
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
            supplier : results[1] ,
            contacter : results[2] ,
        }) ;
    })
}
function fetchPurchaseSupplier(params={},callback) {
    var map = {
        id : 'itemId' ,
        product : 'itemName' ,
        brand : 'brandId' ,
        pecifications : 'specification' ,
        unit : 'unitId' ,
        ordercount : 'purchaseOrderCount' ,
        purchasecount : 'purchaseQuantity' ,
        purchasemoney : 'purchaseAmount' ,
        averagesp : 'avgPurchaseUnitPrice' ,
    };
    fetch.post({
        header : {
            code : 'SASTAT006' ,
            version : '1.0' ,
        },
        body : {
            params : params ,
        }
    }).success( function (result) {
        console.log(result);
        result.data && result.data.statisticsResults && (result.data.statisticsResults = result.data.statisticsResults.map(function (v,i) {
            var pageTotal = v.pageTotal ;
            var v_obj =  fetch.adapterResponse(v,map) ;
            v_obj.totalCount = pageTotal ;
            return v_obj;
        })) ;
        if( result.data === null ){
            callback && callback(false,{
                data : [] ,
            }) ;
        }else{
            callback && callback(false,{
                data : result.data.statisticsResults ,
            }) ;
        }
    }).error(function (result) {
        console.log(result) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                id : '233' ,
                product : '飞利浦支架什么的' ,
                brand : '飞利浦' ,
                pecifications : 'TCH2121' ,
                unit : '只' ,
                ordercount : '10' ,
                purchasecount : '20000' ,
                purchasemoney : '3199999' ,
                averagesp : '200' ,
            },{
                id : '234' ,
                product : '索尼支架什么的' ,
                brand : '索尼' ,
                pecifications : 'TCH2121' ,
                unit : '个' ,
                ordercount : '15' ,
                purchasecount : '200' ,
                purchasemoney : '3439999' ,
                averagesp : '22' ,
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
                name : '供应商三了啦' ,
                value : 3
            }]
        }) ;
    },50) ;*/
}
//3
function initPurchasePurchase(params,callback) {
    async.parallel([
        function(cal){
            fetchPurchasePurchase(params.init,cal)
        },
        function(cal){
            fetchPurchase(params.fetchPurchase,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
            purchase : results[1] ,
        }) ;
    })
}
function fetchPurchasePurchase(params={},callback) {
    var map = {
        id : 'userId' ,
        purchaser : 'userName' ,
        suppliertotal : 'totalSupplierCount' ,
        madesupplier : 'tradedSupplierCount' ,
        ordercount : 'purchaseOrderCount' ,
        productcount : 'itemQuantity' ,
        purchasemoney : 'purchaseAmount' ,
        shouldpay : 'payable' ,
    };
    fetch.post({
        header : {
            code : 'SASTAT013' ,
            version : '1.0' ,
        },
        body : {
            params : params ,
        }
    }).success( function (result) {
        console.log(result);
        result.data && result.data.statisticsResults && (result.data.statisticsResults = result.data.statisticsResults.map(function (v,i) {
            var pageTotal = v.pageTotal ;
            var v_obj =  fetch.adapterResponse(v,map) ;
            v_obj.totalCount = pageTotal ;
            return v_obj;
        }) );
        if( result.data === null ){
            callback && callback(false,{
                data : [] ,
            }) ;
        }else{
            callback && callback(false,{
                data : result.data.statisticsResults ,
            }) ;
        }
    }).error(function (result) {
        console.log(result) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                id : '233' ,
                index : '1',
                purchaser : '采购员1' ,
                suppliertotal : '21' ,
                madesupplier : '10' ,
                ordercount : '200000' ,
                productcount : '3199999' ,
                purchasemoney : '2012100' ,
                shouldpay : '203130000' ,
                operation : '查看明细'
            },{
                id : '233' ,
                index : '2',
                purchaser : '采购员2' ,
                suppliertotal : '211' ,
                madesupplier : '14' ,
                ordercount : '200410' ,
                productcount : '3199' ,
                purchasemoney : '201100' ,
                shouldpay : '22130000' ,
                operation : '查看明细'
            }], 10) ,
        }) ;
    },200)*/
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
    /*setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '采购员一' ,
                value : 1
            },{
                name : '采购员二' ,
                value : 2
            },{
                name : '采购员三了啦' ,
                value : 3
            }]
        }) ;
    },50) ;*/
}
//
//
//1
function initAccountAccount(params,callback) {
    async.parallel([
        function(cal){
            fetchAccountAccount(params,cal)
        },
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
        }) ;
    })
}
function fetchAccountAccount(params={},callback) {
    var map = {
        settleType : 'settlementWayName' ,
        income : 'income' ,
        expense : 'expenditure' ,
        operation : '查看明细' ,
    } ;
    fetch.post({
        header : {
            code : 'SASTAT008' ,
            version : '1.0' ,
        },
        body : {
            params : params ,
        }
    }).success( function (result) {
        console.log(result);
        var _o = result.data && result.data.statisticsResults && (result.data.statisticsResults.map(function (v,i) {
            var payType_forShow = '' ;
            PAY_TYPE.forEach((_v,i)=>{
                if( v !== null && v.settlementWay !== null && ( _v.value - 0 == v.settlementWay - 0 ) ){
                    payType_forShow = _v.name ;
                }
                else if(v == null){
                    v = {
                        settlementWay : '0',
                        income : '',
                        expenditure : ''
                    }
                }
            }) ;
            var v_obj = fetch.adapterResponse(v,map) ;
            v_obj.payType_forShow = payType_forShow ;
            return v_obj ;
        }) );
        if( result.data === null ){
            callback && callback(false,{
                data : [] ,
            }) ;
        }else{
            callback && callback(false,{
                data : _o ,
            }) ;
        }
    }).error(function (data) {
        console.log(arguments) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                id : '233' ,
                settleType : '现金' ,
                income : '6363636' ,
                expense : '23442' ,
                operation : '查看明细'
            },{
                id : '235' ,
                settleType : '支付宝' ,
                income : '1326' ,
                expense : '31231' ,
                operation : '查看明细'
            }], 10) ,
        }) ;
    },200)*/
}
//2
function initAccountPay(params,callback) {
    async.parallel([
        function(cal){
            fetchAccountPay(params,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
        }) ;
    })
}
function fetchAccountPay(params={},callback) {
    var map = {
        id : '233' ,
        opposite : 'opposite' ,
        contact : 'contact' ,
        gathering : 'receivable' ,
        pay : 'payable' ,
        charge : 'responsiblePerson' ,
        operation : '查看明细'
    } ;
    fetch.post({
        header : {
            code : 'SASTAT009' ,
            version : '1.0' ,
        },
        body : {
            params : params ,
        }
    }).success( function (result) {
        //console.log(result);
        result.data &&　result.data.statisticsResults && (result.data.statisticsResults = result.data.statisticsResults.map(function (v,i) {
            var pageTotal = v.pageTotal ;
            var v_obj =  fetch.adapterResponse(v,map) ;
            v_obj.totalCount = pageTotal ;
            return v_obj;
        }) );
        if( result.data === null ){
            callback && callback(false,{
                data : [] ,
            }) ;
        }else{
            callback && callback(false,{
                data : result.data.statisticsResults ,
            }) ;
        }
    }).error(function (data) {
        console.log(arguments) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                id : '233' ,
                opposite : '上海哈哈哈哈哈' ,
                contact : '张三15691818181' ,
                gathering : '21122' ,
                pay : '10010101' ,
                charge : '销售员1' ,
                operation : '查看明细'
            },{
                id : '235' ,
                opposite : '北京哈哈哈哈哈' ,
                contact : '李四15691818181' ,
                gathering : '1222' ,
                pay : '10010134' ,
                charge : '销售员2' ,
                operation : '查看明细'
            }], 10) ,
        }) ;
    },200)*/
}
//
//
//1
function initInvoicingInvoicing(params,callback) {
    async.parallel([
        function(cal){
            fetchInvoicingInvoicing(params,cal)
        },
        function(cal){
            fetchProduct(params,cal)
        },
        function(cal){
            fetchBrand(params,cal)
        },
        function(cal){
            fetchSpecifications(params,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            table : results[0] ,
            product : results[1] ,
            brand : results[2] ,
            specifications : results[3]
        }) ;
    })
}
function fetchInvoicingInvoicing(params={},callback) {
    var map = {
        id : '233' ,
        productName : 'itemName' ,
        brand : 'brandName' ,
        specifications : 'specification' ,
        purchase : 'purchaseQuantity' ,
        salecount : 'salesQuantity' ,
        purchaseMoney : 'purchaseAmount' ,
        saleMoney : 'salesAmount' ,
        profit : 'salesGrossProfit' ,
        profitRate : 'salesGrossProfitRate'
    } ;
    fetch.post({
        header : {
            code : 'SASTAT010' ,
            version : '1.0' ,
        },
        body : {
            params : params ,
        }
    }).success( function (result) {
        //console.log(result);
        result.data && result.data.statisticsResults && (result.data.statisticsResults = result.data.statisticsResults.map(function (v,i) {
            var pageTotal = v.pageTotal ;
            var v_obj =  fetch.adapterResponse(v,map) ;
            v_obj.totalCount = pageTotal ;
            return v_obj;
        })) ;
        if( result.data === null ){
            callback && callback(false,{
                data : [] ,
            }) ;
        }else{
            callback && callback(false,{
                data : result.data.statisticsResults ,
            }) ;
        }
    }).error(function (data) {
        console.log(arguments) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                id : '233' ,
                productName : '飞利浦一x32389' ,
                brand : '飞利浦' ,
                specifications : 'x32100' ,
                purchase : '100000' ,
                salecount : '2999999' ,
                purchaseMoney : '231' ,
                saleMoney : '2000' ,
                profit : '200000' ,
                profitRate : '0.2%' ,
            },{
                id : '235' ,
                productName : '索尼一x32389' ,
                brand : '索尼' ,
                specifications : 'y32100' ,
                purchase : '1000300' ,
                salecount : '4999999' ,
                purchaseMoney : '23331' ,
                saleMoney : '20300' ,
                profit : '50000' ,
                profitRate : '0.2%' ,
            }], 10) ,
        }) ;
    },200)*/
}
function fetchProduct(params={},callback){
    setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '吹风机' ,
                value : 1
            },{
                name : 'MRO那啥玩意' ,
                value : 2
            }]
        }) ;
    },50) ;
}
function fetchBrand(params={},callback){
    setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '3M' ,
                value : 1
            },{
                name : '中文3M' ,
                value : 2
            }]
        }) ;
    },50) ;
}
function fetchSpecifications(params={},callback){
    setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : 'DRE-232' ,
                value : 1
            },{
                name : 'MAD' ,
                value : 2
            }]
        }) ;
    },50) ;
}



export default {
    //
    initMarketProduct ,
    fetchMarketProduct ,
    //
    initMarketUser,
    fetchMarketUser,
    //
    initMarketMarket ,
    fetchMarketMarket ,
    //
    initMarketSale ,
    fetchMarketSale ,
    //
    //
    initPurchaseProduct ,
    fetchPurchaseProduct ,
    //
    initPurchaseSupplier ,
    fetchPurchaseSupplier ,
    //
    initPurchasePurchase ,
    fetchPurchasePurchase ,
    //
    //
    initAccountAccount ,
    fetchAccountAccount ,
    //
    initAccountPay ,
    fetchAccountPay ,
    //
    //
    initInvoicingInvoicing ,
    fetchInvoicingInvoicing ,
}
