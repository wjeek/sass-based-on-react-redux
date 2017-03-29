import * as mock from './mock'
import * as async from 'async'
import * as fetch from './utils/fetch'
import * as localstore from './utils/localstore'


// product
function initBaseProduct(params,callback) {
    async.parallel([
        function(cal){
            fetchBaseProduct(params,cal)
        },
        function(cal){
            fetchProduct(params,cal)
        },
        function(cal){
            fetchCategory(params,cal)
        },
        function(cal){
            fetchBrandId(params,cal)
        },
        function(cal){
            fetchSpecifications(params,cal)
        },
        function(cal){
            fetchUnit(params,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            data : results[0] ,
            product : results[1] ,
            category : results[2] ,
            brandId : results[3] ,
            specification : results[4] ,

            unit : results[5]
        }) ;
    })
}
//查询商品 OK
function fetchBaseProduct(params={},callback) {
    var map = {
        id : 'sort' , //
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
        operator : 'operator',
        itemId : 'itemId' ,
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
        console.log(result);
        if ( result.mark == '000000000' ){
            result.data.items = result.data.items.map((v)=>{
                var categoryName_forShow = v.categoryName ;
                var brandName_forShow = v.brandName ;
                var unitName_forShow = v.unitName ;
                var pageTotal = v.pageTotal ;
                var pageNum = v.pageNum ;
                var v_obj = fetch.adapterResponse(v,map) ;
                v_obj.id == 99999 && (v_obj.id = '- -') ;
                v_obj.categoryName_forShow = categoryName_forShow ;
                v_obj.brandName_forShow = brandName_forShow ;
                v_obj.unitName_forShow = unitName_forShow ;
                v_obj.totalCount = pageTotal ;
                v_obj.currentPage = pageNum ;
                return v_obj ;
            }) ;
            // result.data.items.category_forShow = //????这是啥不知道啊,前面没写完的。。。。
            callback && callback(false,{
                data : result.data.items
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '查询产品信息失败' , '网络异常' ) ;
    })　;
}



//查询产品详情
function fetchBaseProductDetail(params,callback) {
    var map = {
        id : 'sort' , //
        product : 'itemName' , //
        category : 'categoryId' , //
        brand : 'brandId' , //
        specification :　'specification' , //
        unit : 'unitId' , //
        unitName : 'unitName' ,
        number : 'existingQuantity' , //
        inventoryCost : 'stockCost' , //
        operation : 'operation' ,

        img : 'imgUrl' , //
        tips : 'comment'　, //
        sort　:　'sort' ,
        operator : 'userName' ,
        // operator : 'operatorName' ,

        itemId : 'itemId'


    } ;
    fetch.post({
        header : {
            code : 'SAITEM002' ,
            version : '1.0' ,
        },
        body : {
            itemId : params.itemId ,
        },
    }).success( function (result) {
        console.log(result);
        //对单个进行搞事
        var categoryName_forShow = result.data.item.categoryName ;
        var brandName_forShow = result.data.item.brandName ;
        var operation_forShow = result.data.item.userName ;
        result.data.item = fetch.adapterResponse(result.data.item,map) ;
        result.data.item.categoryName_forShow = categoryName_forShow ;
        result.data.item.brandName_forShow = brandName_forShow ;
        result.data.item.operation_forShow = operation_forShow ;
        callback && callback(false,{
            data : result.data.item ,
        }) ;
    }).error(function (data) {
        globalFunction.alert.warning( '查询货品信息失败' , '网络异常' ) ;
    })　;

}
//查询product 因为筛选框改成input所以暂时用不上
function fetchProduct(params={},callback){
    setTimeout(function(){
        callback && callback(false,{
            data : [{
                name : '飞利浦货品' ,
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
//查询分类 OK
function fetchCategory(params={},callback){
    fetch.post({
        header : {
            code : 'SACTGY001' ,
            version : '1.0' ,
        },
        body : {
            categoryDtoParameter : {
                tenantId : params.tenantId ,
                // pageSize : '' ,
                // pageNum : '' ,
            } ,
        }
    }).success( function (result) {
        if ( result.mark == '000000000' ){
            callback && callback(false , {
                data : result.data.categoryDtos.map((v)=>{
                    return {
                        name : v.categoryName ,
                        value : v.categoryId ,
                        type : v.categoryType ,
                    }
                })
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '查询产品分类失败' , '网络异常' ) ;
    })　;
}
//查询品牌 OK
function fetchBrandId(params={},callback){
    fetch.post({
        header : {
            code : 'SABRND001' ,
            version : '1.0' ,
        },
        body : {
            brandDtoParameter : {
                tenantId : params.tenantId ,
            } ,
        }
    }).success( function (result) {
        if ( result.mark == '000000000' ){
            callback && callback(false ,{
                data : result.data.brandDtos.map((v)=>{
                    return {
                        name : v.brandName ,
                        value : v.brandId ,
                        type : v.brandType ,
                    }
                })
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '查询产品品牌失败' , '网络异常' ) ;
    })　;
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
//查询单位 OK
function fetchUnit(params={},callback){
    fetch.post({
        header : {
            code : 'SAUNIT005' ,
            version : '1.0' ,
        },
        body : {
            unitParam : {
                tenantId : params.tenantId ,
            } ,
        }
    }).success( function (result) {
        if ( result.mark == '000000000' ){
            callback && callback(false ,{
                data : result.data.UnitDtos.map((v)=>{
                    return {
                        name : v.name ,
                        value : v.id ,
                        type : v.unitType ,
                    }
                })
            }) ;
        } else {
            globalFunction.alert.warning( result.message , '提示' ) ;
        }
    }).error(function (data) {
        globalFunction.alert.warning( '查询产品单位失败' , '网络异常' ) ;
    })　;
}


//新增 产品类别  OK
function addProductCategory(params,callback){
    fetch.post({
        header : {
            code : 'SACTGY002' ,
            version : '1.0' ,
        },
        body : {
            categoryDtoParameter : params ,
        }
    }).success( function (result) {
        callback && callback(result) ;
    }).error(function (data) {
        globalFunction.alert.warning( '新增分类失败' , '网络异常' ) ;
    })　;
}
//删除 产品类别 OK
function deleteProductCategory(params,callback){
    fetch.post({
        header : {
            code : 'SACTGY003' ,
            version : '1.0' ,
        },
        body : params ,
    }).success( function (result) {
        callback && callback(result) ;
    }).error(function (data) {
        globalFunction.alert.warning( '删除分类失败' , '网络异常' ) ;
    })　;
}
//新增 产品品牌 OK
function addProductBrand(params,callback){
    fetch.post({
        header : {
            code : 'SABRND002' ,
            version : '1.0' ,
        },
        body : {
            brandDtoParameter : params ,
        }
    }).success( function (result) {
        callback && callback(result) ;
    }).error(function (data) {
        globalFunction.alert.warning( '新增品牌失败' , '网络异常' ) ;
    })　;
}
//删除 产品品牌 OK
function deleteProductBrand(params,callback){
    fetch.post({
        header : {
            code : 'SABRND003' ,
            version : '1.0' ,
        },
        body : params
    }).success( function (result) {
        callback && callback(result) ;
    }).error(function (data) {
        globalFunction.alert.warning( '删除品牌失败' , '网络异常' ) ;
    })　;
}
//新建 产品单位 OK
function addProductUnit(params,callback){
    fetch.post({
        header : {
            code : 'SAUNIT002' ,
            version : '1.0' ,
        },
        body : {
            unitParam : params ,
        }
    }).success( function (result) {
        callback && callback(result) ;
    }).error(function (data) {
        globalFunction.alert.warning( '新增单位失败' , '网络异常' ) ;
    })　;
}
//删除 产品单位 并不能正确删除,虽然请求成功了
function deleteProductUnit(params,callback){
    fetch.post({
        header : {
            code : 'SAUNIT004' ,
            version : '1.0' ,
        },
        body : params
    }).success( function (result) {
        callback && callback(result) ;
    }).error(function (data) {
        globalFunction.alert.warning( '删除品牌失败' , '网络异常' ) ;
    })　;
}

function addBaseProduct(params,callback){
    fetch.post({
        header : {
            code : 'SAITEM004' ,
            version : '1.0'
        },
        body : {
            itemParameter : params ,
        }
    }).success(function(result){
        callback && callback(result) ;
    }).error(function (data) {
        globalFunction.alert.warning( '新增货品失败' , '网络异常' ) ;
    }) ;
}
//编辑 商品 OK
function editBaseProduct(params,callback){
    fetch.post({
        header : {
            code : 'SAITEM005' ,
            version : '1.0'
        },
        body : params
    }).success(function(result){
        callback && callback(result) ;
    }).error(function (data) {
        globalFunction.alert.warning( '新增货品失败' , '网络异常' ) ;
    }) ;
} ;
//删除 商品 OK
function deleteBaseProduct(params={},callback){
    fetch.post({
        header : {
            code : 'SAITEM006' ,
            version : '1.0'
        },
        body : params
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function () {
        globalFunction.alert.warning( '删除商品失败'　,　'网络异常'　)
    }) ;
}

//customer
function initBaseCustomer(params,callback) {
    async.parallel([
        function(cal){
            fetchBaseCustomer(params,cal)
        },
        function(cal){
            fetchCity(params,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            data : results[0] ,
            city : results[1] ,
        }) ;
    })
}


function fetchBaseCustomer(params={},callback) {
    var map = {
        id : 'sort' , //
        customer : 'name' , //
        shouldPrice : 'receivable' , //
        firstPrice : 'earlyArrears' , //
        contacter : 'contact' , //
        phone : 'mobile' , //
        area : 'location' , //详细地址
        operation : 'operation' ,
        tips : 'tips'　,
        sort　:　'sort' , //
        email : 'email' ,
        staticPhone : 'staticPhone' ,
        fax : 'fax',
        dist : 'area',
        customerId : 'id'
    } ;
    fetch.post({
        header : {
            code : 'SACSTM001' ,
            version : '1.0' ,
        },
        body : {
            customerParameter : params ,
        }
    }).success( function (result) {
        console.log(result);
        localstore.takeoutCity((cityData)=>{
            result.data.customerDtos = result.data.customerDtos.map(function (v,i) {
                var curCityId = v.area ;
                var v_obj = fetch.adapterResponse(v,map) ;
                v_obj.id == 99999 && (v_obj.id = '- -') ;
                var pageTotal = v.pageTotal ;
                var pageNum = v.pageNum ;
                v_obj.dist_forShow = localstore.convertCityNameById( curCityId , cityData ) ;
                v_obj.totalCount = pageTotal ;
                v_obj.currentPage = pageNum ;
                return  v_obj ;
            }) ;
            callback && callback(false,{
                data : result.data.customerDtos ,
            }) ;
        }) ;
    }).error(function (data) {
        console.log(arguments) ;
    })　;

    /*
    setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                id : '233' ,
                customer : 'Lily了啦' ,
                shouldPrice : '$1000.00' ,
                firstPrice : '$200.00' ,
                contacter : 'Ahkari了啦' ,
                phone : '18110908730' ,
                area : '安徽合肥科大讯飞' ,
                operation : '查看 编辑 删除' ,

                tips : '这是一个备注呢!'　,
                sort　:　12 ,


                email : 'gqz825584053@sohu.com' ,
                staticPhone : '012-312131-21313' ,
                fax : 'hello这是啥',

                dist : '上海 浦东新区',

            },{
                id : '69' ,
                customer : 'Ahkari了啦' ,
                shouldPrice : '$9999000.00' ,
                firstPrice : '$121210.00' ,
                contacter : 'Lily了啦' ,
                phone : '110' ,
                area : '上海浦东抱枕了啦' ,
                operation : '查看 编辑 删除' ,

                tips : '这是一个备注呢!'　,
                sort　:　12 ,


                email : 'lily@ifyly.com' ,
                staticPhone : '520-11111' ,
                fax : 'dwdw——dwdw',

                dist : '安徽 合肥',
            }], 10) ,
        }) ;
    },200) */
}
//查询客户详情 OK
function fetchBaseCustomerDetail(params={},callback){
    var map = {
        id : 'sort' , //
        customer : 'name' , //
        shouldPrice : 'receivable' , //欠款
        firstPrice : 'earlyArrears' , //
        contacter : 'contact' , //
        phone : 'mobile' , //
        area : 'location' , //详细地址
        operation : 'operation' ,
        tips : 'comment'　, //
        sort　:　'sort' , //
        email : 'email' , //
        staticPhone : 'tel' , //
        fax : 'fax', //
        dist : 'area', //
        customerId : 'id' ,
    } ;
    fetch.post({
        header : {
            code : 'SACSTM002' ,
            version : '1.0' ,
        },
        body : {
            id : params.id ,
        },
    }).success( function (result) {
        //对单个进行搞事
        var id = result.data.customerDto.area ;
        var operation_forShow = result.data.customerDto.userName ;
        localstore.takeoutCity((cityDate)=>{
            result.data.customerDto = fetch.adapterResponse(result.data.customerDto,map) ;
            result.data.customerDto.dist_forShow = localstore.convertCityNameById( id , cityDate ) ;
            result.data.customerDto.operation_forShow = operation_forShow ;
            callback && callback(false,{
                data : result.data.customerDto ,
            }) ;
        }) ;
    }).error(function (data) {
        console.error(arguments) ;
    })　;
}

function fetchCity(params={},callback){
    localstore.takeoutCity(function (result) {
        callback && callback(false,{
            data : result.data.cityAntd
        }) ;
    }) ;
}

function addBaseCustomer(params={},callback){
    fetch.post({
        header : {
            code : 'SACSTM003' ,
            version : '1.0'
        },
        body: params
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function () {
        globalFunction.alert.warning( '新增用户失败'　,　'网络异常'　)
    }) ;
}
function deleteBaseCustomer(params={},callback){
    fetch.post({
        header : {
            code : 'SACSTM005' ,
            version : '1.0'
        },
        body : params
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function () {
        globalFunction.alert.warning( '删除用户失败'　,　'网络异常'　)
    }) ;
}
function editBaseCustomer(params={},callback){
    fetch.post({
        header : {
            code : 'SACSTM004' ,
            version : '1.0' ,
        },
        body : params
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function () {
        globalFunction.alert.warning( '更新客户数据失败' , '网络异常' ) ;
    }) ;
}

//supplier
function initBaseSupplier(params,callback) {
    async.parallel([
        function(cal){
            fetchBaseSupplier(params,cal)
        },
        function(cal){
            fetchCity(params,cal)
        }
    ],function (error,results) {
        callback && callback(false,{
            data : results[0] ,
            city : results[1] ,
        }) ;
    })
}


function fetchBaseSupplier(params={},callback) {
    var map = {
        id : 'sort' , //
        supplier : 'name' , //
        shouldPrice : 'payable' , //
        firstPrice : 'earlyArrears' , //
        contacter : 'contact' , //
        phone : 'mobile' , //
        area : 'location' , //详细地址
        operation : 'operation' ,
        tips : 'tips'　,
        sort　:　'sort' , //
        email : 'email' ,
        staticPhone : 'staticPhone' ,
        fax : 'fax',
        dist : 'area',
        supplierId : 'id'
    } ;
    fetch.post({
        header : {
            code : 'SASPLR001' ,
            version : '1.0' ,
        },
        body : {
            supplierParameter : params ,
        }
    }).success( function (result) {
        console.log(result);
        localstore.takeoutCity((cityData)=>{
            result.data.supplierDtos = result.data.supplierDtos.map(function (v,i) {
                var curCityId = v.area ;
                var v_obj = fetch.adapterResponse(v,map) ;
                v_obj.id == 99999 && (v_obj.id = '- -') ;
                var pageTotal = v.pageTotal ;
                var pageNum = v.pageNum ;
                v_obj.dist_forShow = localstore.convertCityNameById( curCityId , cityData ) ;
                v_obj.totalCount = pageTotal ;
                v_obj.currentPage = pageNum ;
                return  v_obj ;
            }) ;
            callback && callback(false,{
                data : result.data.supplierDtos ,
            }) ;
        }) ;
    }).error(function (data) {
        console.log(data) ;
    })　;
    /*setTimeout(function () {
        callback && callback(false,{
            data: mock.createArr([{
                id : '233' ,
                shouldPrice : '$1000.00' ,

                supplier : '上海腾讯'　,
                firstPrice : '$11.00' ,
                contacter : 'IU了啦' ,
                phone : '110' ,
                email : 'gqz999@qq.com' ,
                staticPhone : '021-05445-21' ,
                fax : '这是个传真' ,
                dist : '安徽 芜湖 龙阳县' ,
                area : '芜湖一中' ,
                sort : '这是个排序' ,
                tips : '备注' ,
                operation : '查看 编辑 删除' ,

            },{
                id : '00000' ,
                shouldPrice : '$00.00' ,

                supplier : '上海蚂蚁金服'　,
                firstPrice : '$0001.00' ,
                contacter : '芹菜了啦' ,
                phone : '110212212' ,
                email : '999lily@qq.com' ,
                staticPhone : '000-021215-21' ,
                fax : '这是个传真了啦' ,
                dist : '浦东机场 龙阳县 花木屯' ,
                area : '马鞍上二中' ,
                sort : '这是个西西' ,
                tips : '大美女' ,
                operation : '查看 编辑 删除' ,
            }], 10) ,
        }) ;
    },200)*/
}


function fetchBaseSupplierDetail(params={},callback){
    var map = {
        id : 'sort' , //
        supplier : 'name' , //
        shouldPrice : 'payable' , //
        firstPrice : 'earlyArrears' , //
        contacter : 'contact' , //
        phone : 'mobile' , //
        area : 'location' , //详细地址
        operation : 'operation' ,
        tips : 'comment'　, //
        sort　:　'sort' , //
        email : 'email' , //
        staticPhone : 'tel' , //
        fax : 'fax', //
        dist : 'area', //所在地区
        supplierId : 'id'
    } ;
    fetch.post({
        header : {
            code : 'SASPLR002' ,
            version : '1.0' ,
        },
        body : {
            id : params.id ,
        },
    }).success( function (result) {
        //对单个进行搞事
        var id = result.data.supplierDto.area ;
        var operation_forShow = result.data.supplierDto.userName ;
        localstore.takeoutCity((cityDate)=>{
            result.data.supplierDto = fetch.adapterResponse(result.data.supplierDto,map) ;
            result.data.supplierDto.dist_forShow = localstore.convertCityNameById( id , cityDate ) ;
            result.data.supplierDto.operation_forShow = operation_forShow ;
            callback && callback(false,{
                data : result.data.supplierDto ,
            }) ;
        }) ;
    }).error(function (data) {
        console.error(arguments) ;
    })　;
}


function addBaseSupplier(params={},callback){
    fetch.post({
        header : {
            code : 'SASPLR003' ,
            version : '1.0'
        },
        body: params
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function (result) {
        console.log(result);

    }) ;
}
function deleteBaseSupplier(params={},callback){
    fetch.post({
        header : {
            code : 'SASPLR005' ,
            version : '1.0'
        },
        body : params
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function () {
        globalFunction.alert.warning( '删除供应商失败'　,　'网络异常'　)
    }) ;
}
function editBaseSupplier(params={},callback){
    fetch.post({
        header : {
            code : 'SASPLR004' ,
            version : '1.0' ,
        },
        body : params
    }).success(function (result) {
        callback && callback(result) ;
    }).error(function () {
        globalFunction.alert.warning( '更新供应商数据失败' , '网络异常' ) ;
    }) ;
}

//excel文件导入
function importBaseProduct(params,callback){
    fetch.post({
        header : {
            code : 'SAITEM010' ,
            version : '1.0' ,
        },
        body : params ,
    }).success(function(result){
        callback && callback(result) ;
    }).error(function () {
        callback && callback({
            mark : 'fetch error' ,
            message : '货品数据导入失败, 请检查网络情况' ,
            data : null ,
        }) ;
    })
}
function importBaseCustomer(params,callback){
    fetch.post({
        header : {
            code : 'SACSTM009' ,
            version : '1.0' ,
        },
        body : params ,
    }).success(function(result){
        callback && callback(result) ;
    }).error(function () {
        callback && callback({
            mark : 'fetch error' ,
            message : '客户数据导入失败, 请检查网络情况' ,
            data : null ,
        }) ;
    })
}
function importBaseSupplier(params,callback){
    fetch.post({
        header : {
            code : 'SASPLR009' ,
            version : '1.0' ,
        },
        body : params ,
    }).success(function(result){
        callback && callback(result) ;
    }).error(function () {
        callback && callback({
            mark : 'fetch error' ,
            message : '供应商数据导入失败, 请检查网络情况' ,
            data : null ,
        }) ;
    })
}

export default {
    //
    initBaseProduct ,
    fetchBaseProduct ,

    fetchBaseProductDetail ,

    fetchCategory ,
    fetchBrandId ,
    fetchUnit ,

    addProductCategory ,
    deleteProductCategory ,
    addProductBrand ,
    deleteProductBrand ,
    addProductUnit ,
    deleteProductUnit ,

    addBaseProduct ,
    editBaseProduct ,
    deleteBaseProduct ,

    //
    initBaseCustomer,
    fetchBaseCustomer,
    fetchBaseCustomerDetail,

    addBaseCustomer ,
    deleteBaseCustomer ,
    editBaseCustomer ,

    //
    initBaseSupplier ,
    fetchBaseSupplier ,
    fetchBaseSupplierDetail,

    addBaseSupplier ,
    deleteBaseSupplier ,
    editBaseSupplier ,

    //
    importBaseProduct ,
    importBaseCustomer ,
    importBaseSupplier ,

}
