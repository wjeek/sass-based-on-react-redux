/**
 * Created by jove_jin on 2016/9/26.
 */
var numberReg=/^((\+?86)|(\(\+86\)))?\d{3,4}-\d{7,8}(-\d{3,4})?$|^((\+?86)|(\(\+86\)))?1\d{10}$/;
var codeReg=/^\d{6}$/;
var passReg=/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/;
var user_id = $.getUrlParam('user_id');
var tenant_id = $.getUrlParam('tenant_id');
var sign = $.getUrlParam('sign');

function showErrors(text){
    $('.tipsContent').html(text);
    $('.errorTips').show().delay(3000).hide(300);
}
$('.getcode').on('click',function(){
    var phoneText=$('.registerNumber').val();
    if(phoneText==""||phoneText==null){
        showErrors("手机号不能为空");
    }else if(!numberReg.test(phoneText)){
        showErrors("手机号格式不正确");
    }else{
        $.m_ajax( {
            header:{
                code: 'SAUSER001' ,
                version: '1.0'
            },
            body : {
                usersParameter : {
                    account : phoneText
                }
            }
        } ).success( function( data){
            console.log(data);
            if ( data.body.registered == '0' ){
                $.m_ajax({
                        header:{
                            code: 'SAUSER022' ,
                            version: '1.0'
                        },
                        body : {
                            phone : phoneText
                        }
                    }
                ).success(function (result) {
                    console.log(result);
                    var countdown = 60 ;
                    function settime() {
                        if (countdown == 0) {
                            $('.getcode').attr("disabled", false);
                            $('.getcode').css("background-color","#2fcaff");
                            $('.getcode').text("获取验证码");
                            countdown = 60;
                            return;
                        } else {
                            $('.getcode').attr("disabled", true);
                            $('.getcode').css("background-color","#d9d9d9");
                            $('.getcode').text("重新发送(" + countdown + ")");
                            countdown--;
                        }
                        setTimeout(function() {
                                settime() }
                            ,1000)
                    }
                    settime();
                }).error(function (result) {
                        console.log(result);
                    }
                )

            } else {
                showErrors("该手机号已经注册");

            }
        }).error( function( data){
            console.log(data);
        }) ;
    }
})
$('.btn_submit').on('click',function(){
    var phoneText=$('.registerNumber').val();
    var code=$('.registerCode').val();
    var password=$('.registerPassword.text').val().replace(/\s+/g,"");
    var pLength=password.length;
    console.log(password);
    if(phoneText==""||phoneText==null){
        showErrors("手机号不能为空");
    }else if(!numberReg.test(phoneText)){
        showErrors("手机号格式不正确");
    }else if(code==""||code==null){
        showErrors("验证码不能为空");
    }else if(!codeReg.test(code)){
        showErrors("验证码格式不正确");
    }else if(password==""||password==null){
        showErrors("密码不能为空");
    }else if(!passReg.test(password)||pLength<6){
        showErrors("密码格式不正确");
    }else{
        $.m_ajax({
            header:{
                code: 'SAUSER024' ,
                version: '1.0'
            },
            body : {
                phone : phoneText ,
                code : code
            }
        }).success(function (result) {
            console.log(result);
            if(result.body.result == '0'){
                $.m_ajax({
                    header:{
                        code: 'SAUSER011' ,
                        version: '1.0'
                    },
                    body : {
                        usersParameter : {
                            account : phoneText ,
                            code : code,
                            password : password
                        }
                    }
                }).success(function (result) {
                    console.log(result);
                    if(result.body.user_id){
                        var userId = result.body.user_id;
                        $.m_ajax({
                            header : {
                                code : 'SAUSER003' ,
                                version : '1.0' ,
                            },
                            body : {
                                usersParameter : {
                                    tenantId : tenant_id ,
                                    id : userId ,
                                    invitation : sign
                                }
                            }
                        }).success(function (result) {
                            console.log(result);
                            window.location.href='/m_passport/m_position?userId=' + userId + '&tenantId='+ tenant_id + '&user_id='+ user_id;
                            
                        }).error(function (result) {
                            console.log(result);
                        });
                       /* _utils.cookie.config( USER_NAME , message.data.user.id ,{
                            'path': '/' ,
                            'expires' : 100 ,
                            // domain : ''
                        } ) ;
                        _utils.cookie.config( TOKEN_NAME , message.data.user.token ,{
                            'path': '/' ,
                            'expires' : 100 ,
                            // domain : ''
                        } ) ;*/
                    }
                    else{
                        showErrors("注册失败");
                    }
                }).error(function (result) {
                    console.log(result);
                })

            }
            else {
                showErrors("验证码不正确");
            }
        }).error(function (result) {
            console.log(result);
        });
    }
})