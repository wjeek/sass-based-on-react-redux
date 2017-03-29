


function staticPhoneChange(params) {
    var staticPhone = params.staticPhone ; //存储上一次state的电话号状态
    var curStr = params.curStr ;
    var index = params.index ;
    if( staticPhone === null || staticPhone === '' ){  //当从后台传过来null或者手动修改后变为空字符时新建数组对象
        var arr =new Array(3) ;
        for(let i = 0 ; i < 3 ; i++){
            if(i == index-1){
                arr[index-1] = curStr ;
            }else{
                arr[i] = '' ;
            }
        }
    }else{
        var arr = staticPhone.split('-') ;
        if(arr.length == 2){
            if(index == 3){
                arr.push(curStr) ;
                if(arr[0] == '' && arr[1] == '' && arr[2] == ''){  //此时为改变之后的数组，数组每一项都变为空字符时把state值置为空值，不带有‘-’字符
                    return '' ;
                }
            }else{
                arr[ (index<1&&index>3)?0:(index-1) ] = curStr ;
                if( arr[0] == '' && arr[1] == '' ){  //此时为改变之后的数组，数组每一项都变为空字符时把state值置为空值，不带有‘-’字符
                    return '' ;
                }
            }
        }else{
            arr[ (index<1&&index>3)?0:(index-1) ] = curStr ;
            if(arr[0] == '' && arr[1] == '' && arr[2] == ''){  //此时为改变之后的数组，数组每一项都变为空字符时把state值置为空值，不带有‘-’字符
                return '' ;
            }
        }
    }
    return arr.join('-') ;
}

function authCheck(authId){
    var authList = globalStore.getState() ;
    authList = [{
        id : 1,
        name : ''
    },{
        id :　2,
        name : ''
    }] ;
    var checkFlag = false ;
    authList.forEach(function (v,i) {
        if ( (v.id-0) === (authId-0) ){
            checkFlag = true ;
        }
    }) ;
    return checkFlag ;
}

export default {
    staticPhoneChange ,
    authCheck ,
}
