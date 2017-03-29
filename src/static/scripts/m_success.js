var type = $.getUrlParam('type');
$(function () {
    var type = $.getUrlParam('type');
    var userId = $.getUrlParam('userId');
    
    if(type == '1'){
        $('.p1').html( '登录成功');
    }

    $.m_ajax({
        header : {
            code : 'SAUSER007' ,
            version : '1.0' ,
        },
        body : {
            id : userId
        }

    }).success(function (result) {
            console.log(result);
            $('.p2').html('欢迎加入\”' +result.body.user.tenantName + '\”团队');
        }
    ).error(function () {
        console.log(result);
    })

    $('#join-team').click(
        function () {
            window.location.href='/m_passport/m_login?user_id='+ user_id + '&tenant_id='+ tenant_id + '&sign=' + sign;
        }
    )
});