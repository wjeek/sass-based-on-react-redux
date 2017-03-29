$(".registerNumber,.registerCode,.registerPassword,.name,.loginNumber,.loginPassword").on('input',function(event){
    var length=$(this).val().length;
    if(length==0) {
        $(this).parent().children('.sprite-h5_delete').hide();
    }else{
        $(this).parent().children('.sprite-h5_delete').show();
    }
});$('.sprite-h5_delete').on('click',function(event){
    $(event.target).parent().find("input").val('').focus();
    $(event.target).parent().children('.sprite-h5_delete').hide();
})


$.extend({
//获取url中参数
//使用方法
// var xx = $.getUrlParam('user_id');
    getUrlParam : function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },

    

    m_ajax : function (params)
    {
        var defaultParams = {
            type : 'POST' ,
            url : '/gw/api-gateway/api' ,
            contentType : 'application/json' ,
            async : true ,
        };
        var _config = {
            type : params.type || defaultParams.type ,
            url : params.url || defaultParams.url ,
            contentType : params.contentType || defaultParams.contentType ,
            async : typeof params.async !== 'undefined' ? params.async : defaultParams.async ,
            success : function(data,textStatus,jqXHR){
                window.globalFunction && window.globalFunction.alert.hide_loading() ;
            } ,
            error : function(httpRequest,textStatus,errorThrown){

                window.globalFunction && window.globalFunction.alert.hide_loading() ;

                if ( params.error　){
                    params.error.apply(　null　,　arguments　)　;
                    return ;
                }
                console.warn( httpRequest ) ;
            } ,
        } ;
        var user_id = '123456';
        if( $.getUrlParam('user_id')){
            user_id = $.getUrlParam('user_id')
        }
        var _data = {
            header : {
                //requestTime : moment().format('YYYYMMDDHHmmssSSS') ,
            },
            common : {
                appID : "SAAS",
                nonceStr : "12345643",
                // sign : "0xafewefa" ,
                sign : '666666' ,
                source : 0 , //标志来自于pc web端
                userId : user_id
            },
            body : {

            }
        } ;
        _data.header = $.extend( _data.header , params.header || {} ) ;
        _data.body = $.extend( _data.body , params.body || {} ) ;
        _data.common = $.extend( _data.common , params.common || {} ) ;
        try{
            _config.data = JSON.stringify( _data ) ;
        } catch(e){
            console.warn( 'fetch params parse error.' ) ;
        }

        window.globalFunction && window.globalFunction.alert.show_loading() ;
        var _self = $.ajax(_config) ;
        return _self;
    }

});


// $.m_ajax = function (params={
//     type : 'POST' ,
//     url : '/gw/api-gateway/api' ,
//     contentType : 'application/json' ,
//     async : true ,
// }) {
//     alert('aaa');
// }
