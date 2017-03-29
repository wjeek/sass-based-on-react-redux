$(function () {
    var user_id = $.getUrlParam('user_id');
    var tenant_id = $.getUrlParam('tenant_id');
    var sign = $.getUrlParam('sign');


    $.m_ajax({
        header : {
            code : 'SAUSER007' ,
            version : '1.0' ,
        },
        body : {
            id : user_id
        }

    }).success(function (result) {
        console.log(result);
        if(result.body){
            $('.joinText2').html(result.body.user.memberName + '邀请您加入');
            $('.joinText3').html(result.body.user.tenantName + '团队');
        }

    }
    ).error(function () {
        console.log(result);
    }) ;
    
    $('#join-team').on('click',function () {
        window.location.href='/m_passport/m_login?user_id='+ user_id + '&tenant_id='+ tenant_id + '&sign=' + sign;
    });
});