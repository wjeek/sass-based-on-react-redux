/**
 * Created by jove_jin on 2016/9/26.
 */
var numberReg=/^((\+?86)|(\(\+86\)))?\d{3,4}-\d{7,8}(-\d{3,4})?$|^((\+?86)|(\(\+86\)))?1\d{10}$/;
var user_id = $.getUrlParam('user_id');
var tenant_id = $.getUrlParam('tenant_id');
var sign = $.getUrlParam('sign');

function showErrors(text){
    $('.tipsContent').html(text);
    $('.errorTips').show().delay(3000).hide(300);
}
$('.btn_submit').on('click',function(){
    var loginNumber=$('.loginNumber').val();
    var password=$('.loginPassword.text').val().replace(/\s+/g,"");
    var pLength=password.length;
    if(loginNumber==""||loginNumber==null){
        showErrors("手机号不能为空");
    }else if(!numberReg.test(loginNumber)){
        showErrors("手机号格式不正确");
    }else if(password==""||password==null){
        showErrors("密码不能为空");
    }else if(pLength<6){
        showErrors("密码不能少于六位");
    }else{
        $.m_ajax({
            header:{
                code: 'SAUSER004' ,
                version: '1.0'
            },
            body : {
                usersParameter : {
                    account : loginNumber ,
                    password : password ,
                }
            }
        }).success(function (result) {
            console.log(result);
            if(result.body){
                var userId = result.body.user.id;
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
                    if(result.body){
                        window.location.href='/m_passport/m_success?type=1&user_id='+user_id + '&userId=' + userId;
                    }
                    else{
                        showErrors("加入团队失败");
                    }
                }).error(function (result) {
                    console.log(result);
                    showErrors("加入团队失败");
                })
            }
            else {
                showErrors("密码不正确");
            }
        }).error(function (result) {
            console.log(result);
        });
    }
});

$('.jumpLogin').click(function () {
   window.location.href = '/m_passport/m_register?user_id=' + user_id + '&tenant_id='+ tenant_id + '&sign=' + sign;
});