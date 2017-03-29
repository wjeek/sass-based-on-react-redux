/**
 * Created by jove_jin on 2016/9/26.
 */
function showErrors(text){
    $('.tipsContent').html(text);
    $('.errorTips').show().delay(3000).hide(300);
}


$(function () {
    var userId = $.getUrlParam('userId');
    var tenantId = $.getUrlParam('tenantId');
    var user_id = $.getUrlParam('user_id');
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
            $('.company').val(result.body.user.tenantName);
        }
    ).error(function () {
        console.log(result);
    });

    $('.btn_submit').on('click',function(){
        var nameText=$('.name').val().replace(/\s+/g,"");
        var position=$('input[name="position"]:checked').val();
        var pLength=nameText.length;
        var nameReg=/^[^`~!@#$%^&*()+=|\\\][\]\{\}:;'\,.<>/?]{1}[^`~!@$%^&()+=|\\\][\]\{\}:;'\,.<>?]{0,19}$/;
        if(nameText==""||nameText==null){
            showErrors("姓名不能为空");
        }else if(!nameReg.test(nameText)||pLength>20){
            showErrors("姓名格式不正确");
        }else{
            $.m_ajax({
                header : {
                    code : 'SAUSER006' ,
                    version : '1.0' ,
                },
                body : {
                    usersParameter : {
                        id : userId,
                        memberName : nameText,
                        roleIds : [ position]

                    }
                }
            }).success(function (result) {
                console.log(result);
                window.location.href='/m_passport/m_success?type=2&user_id='+user_id + '&userId=' + userId;
            }).error(function (result) {
                console.log(result);
            })

        }
    });
});