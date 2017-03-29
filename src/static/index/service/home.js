import * as fetch from './utils/fetch'
import * as async from 'async'

//OK
function initHomeDashBoard(params,callback) {
    async.parallel([
        function(cal){
            fetchHomeAlertText1(params.homeAlertText1,cal)
        },
        function(cal){
            fetchHomeAlertText2(params.homeAlertText2,cal)
        },
        function(cal){
            abnormal_market(params.chartMarket,cal)
        },
        function(cal){
            abnormal_warning(params.chartWarning,cal)
        },
        function(cal){
            abnormal_top_users(params.chartUser,cal)
        },
        function(cal){
            fetch_pruchase_store_boss(params.bossPurchaseStore,cal)
        },
        function(cal){
            fetch_pruchase_boss(params.bossPurchase,cal)
        },
        function(cal){
            fetch_usernew_boss(params.bossNewUser,cal)
        },
        function(cal){
            fetch_top_market(params.bossTopMarket,cal)
        },
        function(cal){
            fetch_top_product(params.bossTopProduct,cal)
        },
        function(cal){
            fetchPurchaseYearGoals(params.bossPurchaseGoles,cal)
        },
        function(cal){
            abnormal_capital(params.bossCapital,cal)
        },
        function(cal){
            abnormal_market_profit(params.bossMarketProfit,cal)
        },
        function(cal){
            fetch_profits_right_tab(params.bossMarketProfit,cal)
        },
        function(cal){
            fetchHomeAlertText3(params.homeAlertText1,cal)
        },
        function(cal){
            fetchHomeAlertText4(params.homeAlertText2,cal)
        },
    ],function (error,results) {
        console.log( results ) ;
        callback && callback(false,{
            alertText1 : results[0] ,
            alertText2 : results[1] ,
            market_chart : results[2] ,
            warn_chart : results[3] ,
            top_users_chart : results[4] ,
            purchaseStore : results[5] ,
            purchase : results[6] ,
            newUser : results[7] ,
            topMarket : results[8] ,
            topProduct : results[9] ,
            purchaseGoles : results[10] ,
            capital_chart : results[11] ,
            market_profit_chart : results[12] ,
            market_profit_right_tab : results[13] ,
            alertText3 : results[14] ,
            alertText4 : results[15] ,
        }) ;
    })
}
//预警-应收金额 OK
function fetchHomeAlertText1(params={},callback) {
    fetch.post({
        header : {
            code : 'SADSBD001' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params ,
        }
    }).success( function (result) {
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '加载应收总额预警失败' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    })　;
}
//预警-下周应付金额 OK
function fetchHomeAlertText2(params={},callback) {
    fetch.post({
        header : {
            code : 'SADSBD002' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params ,
        }
    }).success( function (result) {
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '加载下周应付预警失败' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    })　;
}
//预警-销售毛利
function fetchHomeAlertText3(params={},callback) {
    fetch.post({
        header : {
            code : 'SADSBD003' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params ,
        }
    }).success( function (result) {
        console.log(result);
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '加载下周应付预警失败' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    })　;
}
//预警-库存成本
function fetchHomeAlertText4(params={},callback) {
    fetch.post({
        header : {
            code : 'SADSBD004' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params ,
        }
    }).success( function (result) {
        console.log(result);
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '加载下周应付预警失败' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    })　;
}
//图表 销售情况 OK
function abnormal_market(params={},callback) {
    fetch.post({
        header : {
            code : 'SADSBD005' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params ,
        }
    }).success( function (result) {
        // console.log(result);
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '加载销售图表' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    })　;
}
//图表 异常预警 OK
function abnormal_warning(params={},callback) {
    fetch.post({
        header : {
            code : 'SADSBD012' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params ,
        }
    }).success( function (result) {
        // console.log(result);
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '加载预警图表' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    })　;
}
//客户前十 OK
function abnormal_top_users(params={},callback) {
    fetch.post({
        header : {
            code : 'SADSBD014' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params ,
        }
    }).success( function (result) {
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '加载预警图表' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    })　;
}
//下周应付
function abnormal_payNext(params={},callback){
    fetch.post({
        header : {
            code : 'SADSBD015' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params ,
        }
    }).success( function (result) {
        console.log(result);
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '加载下周应付图表' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    })　;
}
//资金情况、现金流走势
function abnormal_capital(params={},callback){
    fetch.post({
        header : {
            code : 'SADSBD007' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params ,
        }
    }).success( function (result) {
        console.log(result);
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '加载资金图表' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    })　;
}

//销售毛利
function abnormal_market_profit(params={},callback){
    fetch.post({
        header : {
            code : 'SADSBD008' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params ,
        }
    }).success( function (result) {
        console.log(result);
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '加载销售毛利图表' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    })　;
}
//设置公司目标 OK
function market_setting_goals(params={},callback) {
    fetch.post({
        header : {
            code : 'SADSBD018' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params ,
        }
    }).success( function (result) {
        // console.log(result);
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '设置公司目标失败' , '网络异常' ) ;
    })　;
}
//查询公司目标 OK
function fetchCompanyGoals(params={},callback){
    fetch.post({
        header : {
            code : 'SADSBD019' ,
            version : '1.0'
        },
        body : {
            dashBoardDto : params ,
        }
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function (result) {
        globalFunction.alert.warning( '查询公司目标失败' , '网络异常' ) ;
    }) ;
}
//boss页库存信息 OK
function fetch_pruchase_store_boss(params={},callback){
    fetch.post({
        header : {
            code : 'SADSBD006' ,
            version : '1.0'
        },
        body : {
            dashBoardDto : params ,
        }
    }).success(function (result) {
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (result) {
        globalFunction.alert.warning( '查询公司库存失败' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    }) ;
}
//boss页采购信息 OK
function fetch_pruchase_boss(params={},callback){
    fetch.post({
        header : {
            code : 'SADSBD010' ,
            version : '1.0'
        },
        body : {
            dashBoardDto : params ,
        }
    }).success(function (result) {
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (result) {
        globalFunction.alert.warning( '查询公司采购信息失败' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    }) ;
}
//设置年度采购数量 OK
function setPurchaseYearAmount(params={},callback) {
    fetch.post({
        header : {
            code : 'SADSBD030' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params ,
        }
    }).success( function (result) {
        callback && callback(result) ;
    }).error(function (data) {
        globalFunction.alert.warning( '设置公司采购目标失败' , '网络异常' ) ;
    })　;
}
//查询年度采购信息 OK
function fetchPurchaseYearGoals(params={},callback){
    fetch.post({
        header : {
            code : 'SADSBD031' ,
            version : '1.0'
        },
        body : {
            dashBoardDto : params ,
        }
    }).success(function (result) {
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (result) {
        globalFunction.alert.warning( '查询公司采购信息失败' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    }) ;
}
//boss页新增的客户信息 OK
function fetch_usernew_boss(params={},callback){
    fetch.post({
        header : {
            code : 'SADSBD009' ,
            version : '1.0'
        },
        body : {
            dashBoardDto : params ,
        }
    }).success(function (result) {
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (result) {
        globalFunction.alert.warning( '查询新增的用户信息失败' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    }) ;
}
//前列的销售 OK
function fetch_top_market(params={},callback){
    fetch.post({
        header : {
            code : 'SADSBD027' ,
            version : '1.0'
        },
        body : {
            dashBoardDto : params ,
        }
    }).success(function (result) {
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (result) {
        globalFunction.alert.warning( '查询销售排名失败' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    }) ;
}
//热销商品 OK
function fetch_top_product(params={},callback){
    fetch.post({
        header : {
            code : 'SADSBD028' ,
            version : '1.0'
        },
        body : {
            dashBoardDto : params ,
        }
    }).success(function (result) {
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (result) {
        globalFunction.alert.warning( '查询货品排名失败' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    }) ;
}


//
//销售看见的页面 OK
function initHomeDashBoardMarket(params={},callback) {
    async.parallel([
        function(cal){
            abnormal_market(params.marketParams,cal)
        },
        function(cal){
            abnormal_warning(params.warnParams,cal)
        },
        function(cal){
            abnormal_top_users(params.topUserParams,cal)
        },
        function(cal){
            fetchMarketStatistics(params.marketStatistics,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            market_chart : results[0] ,
            warn_chart : results[1] ,
            top_users_chart : results[2] ,
            marketStatistics　:　results[3]　,
        }) ;
    })
}
//设定采购页面  目标 OK
function editMarketOneTarget(params={},callback) {
    fetch.post({
        header : {
            code : 'SADSBD025' ,
            version : '1.0'　,
        },
        body : {
            dashBoardDto : params
        }
    }).success((result)=>{
        callback && callback(result) ;
    }).error(()=>{
        globalFunction.alert.warning( '设置销售目标失败' , '网络异常' ) ;
    }) ;
}

//获取采购员的目标 OK
function fetchMarketOneTarget(params={},callback){
    fetch.post({
        header : {
            code : 'SADSBD026' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params
        }
    }).success((result)=>{
        callback && callback(result) ;
    }).error(()=>{
        globalFunction.alert.warning( '获取销售目标失败' , '网络异常' ) ;
    }) ;
}
//获取统计数据 OK
function fetchMarketStatistics(params={},callback){
    fetch.post({
        header : {
            code : 'SADSBD013' ,
            version : '1.0'
        },
        body : {
            dashBoardDto : params
        }
    }).success((result)=>{
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error((result)=>{
        globalFunction.alert.warning( '获取销售统计数据失败' , '提示' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    })　;
}




//
//采购看见的页面
function initHomeDashBoardPurchase(paramsColloection,callback) {
    async.parallel([
        function(cal){
            fetchMarketStore(paramsColloection.purchaseStore,cal)
        },
        function(cal){
            fetchMarketStoreByType(paramsColloection.byType,cal)
        },
    ],function (error,results) {
        callback && callback(false,{
            purchaseStore : results[0] ,
            productByType : results[1] ,
        }) ;
    })
}
//获取每月库存
function fetchMarketStore(params,callback){
    fetch.post({
        header : {
            code : 'SADSBD011' ,
            version : '1.0'
        },
        body : {
            dashBoardDto : params
        }
    }).success((result)=>{
        // if ( result.mark == '000000000' ){
        //     callback && callback(false,{
        //         data : result.data
        //     }) ;
        // } else {
        //     globalFunction.alert.warning( result.message , '提示' ) ;
        // }
        callback && callback(false,{
            data : result.data
            // data : {
            //     "dashBoardDtos" :[
            //         [
            //             {
            //                 itemId : '' ,
            //                 categoryId : 12 ,
            //                 tenantId : 123 ,
            //                 itemName : '产品一' ,
            //                 categoryName : '' ,
            //                 stockCost : '100' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             },
            //             {
            //                 itemId : 132 ,
            //                 categoryId : '' ,
            //                 tenantId : '' ,
            //                 itemName : '产品二' ,
            //                 categoryName : '' ,
            //                 stockCost : '900' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             }
            //         ],
            //         [
            //             {
            //                 itemId : '' ,
            //                 categoryId : 12 ,
            //                 tenantId : 123 ,
            //                 itemName : '产品一' ,
            //                 categoryName : '' ,
            //                 stockCost : '500' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             },
            //             {
            //                 itemId : 132 ,
            //                 categoryId : '' ,
            //                 tenantId : '' ,
            //                 itemName : '产品二' ,
            //                 categoryName : '' ,
            //                 stockCost : '500' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             }
            //         ],
            //         [
            //             {
            //                 itemId : '' ,
            //                 categoryId : 12 ,
            //                 tenantId : 123 ,
            //                 itemName : '产品sa' ,
            //                 categoryName : '' ,
            //                 stockCost : '400' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             },
            //             {
            //                 itemId : 132 ,
            //                 categoryId : '' ,
            //                 tenantId : '' ,
            //                 itemName : '产品err' ,
            //                 categoryName : '' ,
            //                 stockCost : '800' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             }
            //         ],
            //         [
            //             {
            //                 itemId : '' ,
            //                 categoryId : 12 ,
            //                 tenantId : 123 ,
            //                 itemName : '产品一' ,
            //                 categoryName : '' ,
            //                 stockCost : '500' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             },
            //             {
            //                 itemId : 132 ,
            //                 categoryId : '' ,
            //                 tenantId : '' ,
            //                 itemName : '产品二' ,
            //                 categoryName : '' ,
            //                 stockCost : '500' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             }
            //         ],
            //         [
            //             {
            //                 itemId : '' ,
            //                 categoryId : 12 ,
            //                 tenantId : 123 ,
            //                 itemName : '产品一' ,
            //                 categoryName : '' ,
            //                 stockCost : '500' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             },
            //             {
            //                 itemId : 132 ,
            //                 categoryId : '' ,
            //                 tenantId : '' ,
            //                 itemName : '产品二' ,
            //                 categoryName : '' ,
            //                 stockCost : '500' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             }
            //         ],
            //         [
            //             {
            //                 itemId : '' ,
            //                 categoryId : 12 ,
            //                 tenantId : 123 ,
            //                 itemName : '产品sa' ,
            //                 categoryName : '' ,
            //                 stockCost : '400' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             },
            //             {
            //                 itemId : 1324 ,
            //                 categoryId : '' ,
            //                 tenantId : '' ,
            //                 itemName : '产品err' ,
            //                 categoryName : '' ,
            //                 stockCost : '800' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             }
            //         ],
            //         [
            //             {
            //                 itemId : '' ,
            //                 categoryId : 12 ,
            //                 tenantId : 123 ,
            //                 itemName : '产品一' ,
            //                 categoryName : '' ,
            //                 stockCost : '500' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             },
            //             {
            //                 itemId : 132 ,
            //                 categoryId : '' ,
            //                 tenantId : '' ,
            //                 itemName : '产品二' ,
            //                 categoryName : '' ,
            //                 stockCost : '500' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             }
            //         ],
            //         [
            //             {
            //                 itemId : '' ,
            //                 categoryId : 12 ,
            //                 tenantId : 123 ,
            //                 itemName : '产品一' ,
            //                 categoryName : '' ,
            //                 stockCost : '500' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             },
            //             {
            //                 itemId : 132 ,
            //                 categoryId : '' ,
            //                 tenantId : '' ,
            //                 itemName : '产品二' ,
            //                 categoryName : '' ,
            //                 stockCost : '500' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             }
            //         ],
            //         [
            //             {
            //                 itemId : '' ,
            //                 categoryId : 12 ,
            //                 tenantId : 123 ,
            //                 itemName : '产品sa' ,
            //                 categoryName : '' ,
            //                 stockCost : '400' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             },
            //             {
            //                 itemId : 132 ,
            //                 categoryId : '' ,
            //                 tenantId : '' ,
            //                 itemName : '产品err' ,
            //                 categoryName : '' ,
            //                 stockCost : '800' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             }
            //         ],
            //         [
            //             {
            //                 itemId : '' ,
            //                 categoryId : 12 ,
            //                 tenantId : 123 ,
            //                 itemName : '产品一' ,
            //                 categoryName : '' ,
            //                 stockCost : '500' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             },
            //             {
            //                 itemId : 132 ,
            //                 categoryId : '' ,
            //                 tenantId : '' ,
            //                 itemName : '产品二' ,
            //                 categoryName : '' ,
            //                 stockCost : '500' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             }
            //         ],
            //         [
            //             {
            //                 itemId : '' ,
            //                 categoryId : 12 ,
            //                 tenantId : 123 ,
            //                 itemName : '产品一' ,
            //                 categoryName : '' ,
            //                 stockCost : '500' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             },
            //             {
            //                 itemId : 132 ,
            //                 categoryId : '' ,
            //                 tenantId : '' ,
            //                 itemName : '产品二' ,
            //                 categoryName : '' ,
            //                 stockCost : '500' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             }
            //         ],
            //         [
            //             {
            //                 itemId : '' ,
            //                 categoryId : 12 ,
            //                 tenantId : 123 ,
            //                 itemName : '产品sa' ,
            //                 categoryName : '' ,
            //                 stockCost : '400' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             },
            //             {
            //                 itemId : 132 ,
            //                 categoryId : '' ,
            //                 tenantId : '' ,
            //                 itemName : '产品err' ,
            //                 categoryName : '' ,
            //                 stockCost : '800' ,
            //                 stockCostPCT : '' ,
            //                 startTime : '2016-09-31' ,
            //                 endTime : '' ,
            //             }
            //         ],
            //     ]
            // } ,
        }) ;
    }).error((result)=>{
        // if ( result.mark == '000000000' ){
        //     callback && callback(false,{
        //         data : result.data
        //     }) ;
        // } else {
        //     globalFunction.alert.warning( result.message , '提示' ) ;
        // }
        // callback && callback(false,{
        //     data : {
        //         "dashBoardDtos":[
        //             [
        //                 {
        //                     itemId : '' ,
        //                     categoryId : 12 ,
        //                     tenantId : 123 ,
        //                     itemName : '产品sa' ,
        //                     categoryName : '' ,
        //                     stockCost : '400' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 },
        //                 {
        //                     itemId : 132 ,
        //                     categoryId : '' ,
        //                     tenantId : '' ,
        //                     itemName : '产品err' ,
        //                     categoryName : '' ,
        //                     stockCost : '800' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 }
        //             ],
        //             [
        //                 {
        //                     itemId : '' ,
        //                     categoryId : 12 ,
        //                     tenantId : 123 ,
        //                     itemName : '产品一' ,
        //                     categoryName : '' ,
        //                     stockCost : '500' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 },
        //                 {
        //                     itemId : 132 ,
        //                     categoryId : '' ,
        //                     tenantId : '' ,
        //                     itemName : '产品二' ,
        //                     categoryName : '' ,
        //                     stockCost : '500' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 }
        //             ],
        //             [
        //                 {
        //                     itemId : '' ,
        //                     categoryId : 12 ,
        //                     tenantId : 123 ,
        //                     itemName : '产品一' ,
        //                     categoryName : '' ,
        //                     stockCost : '500' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 },
        //                 {
        //                     itemId : 132 ,
        //                     categoryId : '' ,
        //                     tenantId : '' ,
        //                     itemName : '产品二' ,
        //                     categoryName : '' ,
        //                     stockCost : '500' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 }
        //             ],
        //             [
        //                 {
        //                     categoryName : '类别一' ,
        //                     stockCost : '100' ,
        //                     stockCostPCT : '50%' ,
        //                 },
        //                 {
        //                     categoryName : '类别2' ,
        //                     stockCost : '100' ,
        //                     stockCostPCT : '50%' ,
        //                 }
        //             ],
        //             [
        //                 {
        //                     categoryName : '类别一' ,
        //                     stockCost : '100' ,
        //                     stockCostPCT : '50%' ,
        //                 },
        //                 {
        //                     categoryName : '类别2' ,
        //                     stockCost : '100' ,
        //                     stockCostPCT : '50%' ,
        //                 }
        //             ],
        //             [
        //                 {
        //                     itemId : '' ,
        //                     categoryId : 12 ,
        //                     tenantId : 123 ,
        //                     itemName : '产品sa' ,
        //                     categoryName : '' ,
        //                     stockCost : '400' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 },
        //                 {
        //                     itemId : 132 ,
        //                     categoryId : '' ,
        //                     tenantId : '' ,
        //                     itemName : '产品err' ,
        //                     categoryName : '' ,
        //                     stockCost : '800' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 }
        //             ],
        //             [
        //                 {
        //                     itemId : '' ,
        //                     categoryId : 12 ,
        //                     tenantId : 123 ,
        //                     itemName : '产品一' ,
        //                     categoryName : '' ,
        //                     stockCost : '500' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 },
        //                 {
        //                     itemId : 132 ,
        //                     categoryId : '' ,
        //                     tenantId : '' ,
        //                     itemName : '产品二' ,
        //                     categoryName : '' ,
        //                     stockCost : '500' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 }
        //             ],
        //             [
        //                 {
        //                     itemId : '' ,
        //                     categoryId : 12 ,
        //                     tenantId : 123 ,
        //                     itemName : '产品一' ,
        //                     categoryName : '' ,
        //                     stockCost : '500' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 },
        //                 {
        //                     itemId : 132 ,
        //                     categoryId : '' ,
        //                     tenantId : '' ,
        //                     itemName : '产品二' ,
        //                     categoryName : '' ,
        //                     stockCost : '500' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 }
        //             ],
        //             [
        //                 {
        //                     itemId : '' ,
        //                     categoryId : 12 ,
        //                     tenantId : 123 ,
        //                     itemName : '产品sa' ,
        //                     categoryName : '' ,
        //                     stockCost : '400' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 },
        //                 {
        //                     itemId : 132 ,
        //                     categoryId : '' ,
        //                     tenantId : '' ,
        //                     itemName : '产品err' ,
        //                     categoryName : '' ,
        //                     stockCost : '800' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 }
        //             ],
        //             [
        //                 {
        //                     itemId : '' ,
        //                     categoryId : 12 ,
        //                     tenantId : 123 ,
        //                     itemName : '产品一' ,
        //                     categoryName : '' ,
        //                     stockCost : '500' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 },
        //                 {
        //                     itemId : 132 ,
        //                     categoryId : '' ,
        //                     tenantId : '' ,
        //                     itemName : '产品二' ,
        //                     categoryName : '' ,
        //                     stockCost : '500' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 }
        //             ],
        //             [
        //                 {
        //                     itemId : '' ,
        //                     categoryId : 12 ,
        //                     tenantId : 123 ,
        //                     itemName : '产品一' ,
        //                     categoryName : '' ,
        //                     stockCost : '500' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 },
        //                 {
        //                     itemId : 132 ,
        //                     categoryId : '' ,
        //                     tenantId : '' ,
        //                     itemName : '产品二' ,
        //                     categoryName : '' ,
        //                     stockCost : '500' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 }
        //             ],
        //             [
        //                 {
        //                     itemId : '' ,
        //                     categoryId : 12 ,
        //                     tenantId : 123 ,
        //                     itemName : '产品sa' ,
        //                     categoryName : '' ,
        //                     stockCost : '400' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 },
        //                 {
        //                     itemId : 132 ,
        //                     categoryId : '' ,
        //                     tenantId : '' ,
        //                     itemName : '产品err' ,
        //                     categoryName : '' ,
        //                     stockCost : '800' ,
        //                     stockCostPCT : '' ,
        //                     startTime : '2016-09-31' ,
        //                     endTime : '' ,
        //                 }
        //             ],
        //         ]
        //     } ,
        // }) ;
        globalFunction.alert.warning( '获取库存数据失败' , '提示' ) ;
    })　;
}
//根据商品类别统计库存情况
function fetchMarketStoreByType(params,callback){
    fetch.post({
        header : {
            code : 'SADSBD029' ,
            version : '1.0' ,
        },
        body : {
            dashboardDto : params
        }
    }).success((result)=>{
        // if ( result.mark == '000000000' ){
        //     callback && callback(false,{
        //         data : result.data
        //     }) ;
        // } else {
        //     globalFunction.alert.warning( result.message , '提示' ) ;
        // }
        callback && callback(false,{
            data : {
                "dashBoardDtos":[
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '40' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '16' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '10' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                ]
            } ,
        }) ;
    }).error((result)=>{
        // if ( result.mark == '000000000' ){
        //     callback && callback(false,{
        //         data : result.data
        //     }) ;
        // } else {
        //     globalFunction.alert.warning( result.message , '提示' ) ;
        // }
        callback && callback(false,{
            data : {
                "dashBoardDtos":[
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '10' ,
                            stockCostPCT : '20%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '10' ,
                            stockCostPCT : '10%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                    [
                        {
                            categoryName : '类别一' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        },
                        {
                            categoryName : '类别2' ,
                            stockCost : '100' ,
                            stockCostPCT : '50%' ,
                        }
                    ],
                ]
            } ,
        }) ;
        globalFunction.alert.warning( '获取库存商品数据失败' , '提示' ) ;
    })　;
}



//
//财务看见的页面
function initHomeDashBoardFinance(params={},callback) {
    async.parallel([
        function(cal){
            abnormal_warning(params.warnParams,cal)
        },
        function(cal){
            abnormal_payNext(params.payNextParams,cal)
        },
        function(cal){
            abnormal_capital(params.capitalParams,cal)
        },
        function(cal){
            abnormal_market_profit(params.marketProfit,cal)
        },
        function(cal){
            fetch_profits_right_tab(params.marketProfit,cal)
        },
        function(cal){
            fetch_warn_right_table(params.payNextParams,cal)
        },
    ],function (error,results) {
        callback && callback(false,{
            warn_chart : results[0] ,
            payNext_chart : results[1] ,
            capital_chart : results[2] ,
            market_profit_chart : results[3] ,
            market_profit_right_tab : results[4] ,
            warn_payNext_right_table : results[5] ,
        }) ;
    })
}
//获取财务页面销售毛利右侧tab数据
function fetch_profits_right_tab(params={},callback){
    fetch.post({
        header : {
            code : 'SADSBD017' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params ,
        }
    }).success( function (result) {
        console.log(result);
        if ( result.mark == '000000000' ){
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '加载销售毛利右侧数据失败' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    })　;
}
//财务页面下周应付右侧table
function fetch_warn_right_table(params={},callback){
    fetch.post({
        header : {
            code : 'SADSBD016' ,
            version : '1.0' ,
        },
        body : {
            dashBoardDto : params ,
        }
    }).success( function (result) {
        console.log(result);
        if ( result.mark == '000000000' ){
            result.data.dashBoardDtos=result.data.dashBoardDtos.map((v,i) => {
                if(v.payableType == 1){
                    v.payableType = '采购';
                }
                return v;
            })
            callback && callback(false,{
                data : result.data
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
            callback && callback(false,{
                data : {}
            }) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '加载下周应付右侧table数据失败' , '网络异常' ) ;
        callback && callback(false,{
            data : {}
        }) ;
    })　;
}
export default{
    initHomeDashBoard ,
    abnormal_market ,

    market_setting_goals ,
    fetchCompanyGoals ,

    fetch_top_market ,
    fetch_top_product ,
    fetch_pruchase_store_boss ,
    fetch_usernew_boss ,
    fetch_pruchase_boss ,

    setPurchaseYearAmount ,
    fetchPurchaseYearGoals ,

    //

    initHomeDashBoardMarket ,

    editMarketOneTarget ,
    fetchMarketOneTarget ,

    abnormal_top_users ,
    abnormal_warning ,
    abnormal_capital ,

    abnormal_market_profit ,
    //

    initHomeDashBoardPurchase ,

    //

    initHomeDashBoardFinance ,
    fetch_profits_right_tab ,
    abnormal_payNext ,


}