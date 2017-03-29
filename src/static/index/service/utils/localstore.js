//说明 :
// takeoutCity : 获取城市配置

// convertCityNameById : 根据id获取城市name,需要takeoutCity的回调结果作为第二个参数


function takeoutCity(callback) {
    var catchData ,
        version ;
    localStorage && ( catchData = localStorage.getItem( 'cityconfig' ) ) ;
    if ( catchData ){
        try {
            catchData = JSON.parse( catchData ) ;
            version = catchData.data.cityJson ? catchData.data.cityJson.version : 0 ;
        } catch(e){
            version = 0 ;
        }
    } else {
        version = 0 ;
    }
    $.ajax({
        url : '/cf/config/opt/find/types' ,
        method : 'GET' ,
        data : 'typesString=[{"type":"cityJson","version":"' + version + '"}]' ,
        complete : function(data){
            var result = JSON.parse( data.responseText ) ;
            if ( result.mark == 0 ){
                if ( typeof localStorage !== 'undefined' ){
                    if ( result.data.cityJson !== undefined ){
                        result.data.cityAntd = areaConvert( result.data.cityJson.data ) ;
                        // console.log( result.data ) ;
                        localStorage.setItem( 'cityconfig' , JSON.stringify( result ) ) ;
                        callback && callback( result ) ;
                    } else {
                        callback && callback( catchData ) ;
                    }
                } else {
                    callback && callback( result ) ;
                }
            } else {
                layer.msg( '配置信息获取异常' ) ;
            }
        },
    }) ;

}

function areaConvert(areaValue) {
    var resultValue = [] ;
    for ( var _name in areaValue ){
        if ( typeof areaValue[ _name ] === 'string' ){
            resultValue.push({
                value : areaValue[ _name ] ,
                label : _name
            }) ;
        } else {
            var _id = Object.keys(  areaValue[ _name ] )[ 0 ] ;
            var _value = areaValue[ _name ][ _id ] ;
            resultValue.push({
                value : _id ,
                label : _name ,
                children : areaConvert( _value )
            })
        }
    }
    return resultValue ;
}

//接受一个 地址id 的数组 , 即使只有一个 地址id 也得是数组
function takeoutCityNameByIds(ids,callback){
    var retArr = [] ;
    takeoutCity(function (data) {
        ids.forEach((v,i)=>{
            var curIdArr = v.split(' ') ;
            var cityConvert = data.data.cityAntd ;
            cityConvert.forEach((prov,i)=>{
                if ( prov.value == curIdArr[0] ){
                    curIdArr[0] = prov.label ;
                    var cityConf = prov.children ;
                    cityConf && cityConf.forEach((city,i)=>{
                        if ( city.value == curIdArr[1] ){
                            curIdArr[1] = city.label ;
                            var distConf = city.children ;
                            distConf && distConf.forEach((dist,i)=>{
                                if ( dist.value == curIdArr[2] ){
                                    curIdArr[2] = dist.label ;
                                }
                            });
                        }
                    })
                }
            }) ;
            retArr.push( curIdArr.join(' ') ) ;
        }) ;
        callback && callback(retArr) ;
    }) ;
}
//简单的对于 id 转换为 name, 需要takeout的结果参数
function convertCityNameById(id,cityAllMessage){
    var curIdArr = id ? id.split(' ') : [] ;
    var cityConvert = cityAllMessage.data.cityAntd ;
    cityConvert.forEach((prov,i)=>{
        if ( prov.value == curIdArr[0] ){
            curIdArr[0] = prov.label ;
            var cityConf = prov.children ;
            cityConf && cityConf.forEach((city,i)=>{
                if ( city.value == curIdArr[1] ){
                    curIdArr[1] = city.label ;
                    var distConf = city.children ;
                    distConf && distConf.forEach((dist,i)=>{
                        if ( dist.value == curIdArr[2] ){
                            curIdArr[2] = dist.label ;
                        }
                    });
                }
            })
        }
    }) ;
    return curIdArr.join(' ') ;
}


export {
    takeoutCity ,
    takeoutCityNameByIds ,
    convertCityNameById ,
}
