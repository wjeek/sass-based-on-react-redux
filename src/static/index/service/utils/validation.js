const reg = {
    common : {
        staticPhone1 : /^(0)[0-9]{2,4}$/ , //区号第一位
        staticPhone2 : /^[0-9]{7,8}$/ , //区号第二位
        telephone : /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/ ,
    } ,

    base : {
        fax : /^[1-9]\d{0,20}$/ , //传真 极限字符长度20；仅支持数字符号
        mailBox : /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/ , //邮箱

        product : {
            name : /^.{1,30}$/ ,  //极限字符长度60；支持中文、英文大小写字母，不支持特殊字符
            cost : /^.{1,6}$/ ,  //库存成本 
            type : /^.{1,10}$/ , //类型     //不在Form里不通过service校验
            brand : /^.{1,10}$/,  //品牌    //不在Form里不通过service校验
            spec : /^.{1,50}$/, //型号
            amount : /^[0-9]+(.[0-9]{1,2})?$/ , //现有数量
            unit : /^.{1,10}$/  , //单位    //不在Form里不通过此校验
            sort : /^[0-9]*$/ ,  //排序
            remarks : /^.{1,30}$/,  //备注 字符型
        } ,
        supplier : {
            name : /^.{1,60}$/ , //极限字符长度60；支持中文、英文大小写字母，不支持特殊字符
            earlyDebt : /^[0-9]+(.[0-9]{1,2})?$/ , //仅支持数值，默认为零；格式9/2，###,####,##.00；
            contact : /^.{1,60}$/,  //极限字符长度60；支持中文、英文大小写字母，不支持特殊字符
            detailAddress : /^.{1,80}$/ , //详细地址 字符型
            sort : /^[0-9]*$/ ,  //排序
            remarks : /^.{1,30}$/,  //备注 字符型
        } ,
        customer : {
            name : /^.{1,20}$/ , //极限字符长度20；支持中文、英文大小写字母，不支持特殊字符 必填
            earlyDebt : /^[0-9]+(.[0-9]{1,2})?$/ ,//仅支持数值，默认为零；格式9/2，###,####,##.00； 必填
            contact : /^.{1,20}$/,  //极限字符长度60；支持中文、英文大小写字母，不支持特殊字符
            detailAddress : /^.{1,40}$/ , //详细地址 字符型
            sort : /^[0-9]*$/ ,  //排序
            remarks : /^.{1,30}$/,  //备注 字符型
        },

        team : {
            name : /^.([\u4e00-\u9fa5]?|[a-zA-Z0-9]?){1,10}$/ , //极限字符长度10；支持中文、英文大小写字母，不支持特殊字符 必填
            password : /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/,
        }
    }
} ;

var validation = {
    home : {
        
    },
    market : {
        form_market : {
            purchasePrice : (value)=>{
                return {
                    validateStatus : undefined ,
                    help : '' ,
                }
            },
            truePrice : (value)=>{
                return {
                    validateStatus : undefined ,
                    help : '' ,
                }
            },
            tips : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length > 50 ){
                    return {
                        validateStatus : 'error' ,
                        help : '备注长度不能超过50个字符' ,
                    }
                } else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
            }
        }
    },
    purchase : {
        form_purchase : {
            purchasePrice : (value)=>{
                return {
                    validateStatus : undefined ,
                    help : '' ,
                }
            },
            truePrice : (value)=>{
                return {
                    validateStatus : undefined ,
                    help : '' ,
                }
            },
            tips : (value)=>{
                if ( value.length > 50 ){
                    return {
                        validateStatus : 'error' ,
                        help : '备注长度不能超过50个字符' ,
                    }
                } else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
            }
        }
    },
    account : {
        checkAccount : {
            money : (value)=>{
                if ( value.length == 0 ){
                    return {
                        validateStatus : 'error' ,
                        help : '金额不能为空' ,
                    }
                }else if ( !/^\d{1,20}$/.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '金额输入错误' ,
                    }
                }
                else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
            },
            payType : (value)=>{
                if ( value == '' ){
                    return {
                        validateStatus : 'error' ,
                        help : '结算方式不能为空' ,
                    }
                }
                else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
            },
            date : (value)=>{
                if ( value == '' ){
                    return {
                        validateStatus : 'error' ,
                        help : '日期不能为空' ,
                    }
                }
                else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
            }
        }
    },
    statistics : {
        
    },
    base : {
        form_product : {
            productName : (value)=>{
                if ( value.length == 0 ){
                    return {
                        validateStatus : 'error' ,
                        help : '货品名称不能为空' ,
                    }
                }else if ( !reg.base.product.name.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '货品名称长度不超过30字符' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            productSpec : (value)=>{
                if ( value.length == 0 ){
                    return {
                        validateStatus : 'error' ,
                        help : '货品型号不能为空' ,
                    }
                }else if ( !reg.base.product.spec.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '货品型号长度不超过50字符' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            productAmount : (value)=>{
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.product.amount.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '货品现有数量格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            productCost : (value)=>{
                if ( value == '' ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.product.cost.test(value) ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            productSort : (value)=>{
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.product.sort.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '排序格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            productRemarks : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.product.remarks.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '备注长度不超过30字符' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },

        } ,
        form_customer : {
            customerName : (value)=>{
                if ( value.length == 0 ){
                    return {
                        validateStatus : 'error' ,
                        help : '客户名称不能为空' ,
                    }
                }else if ( !reg.base.customer.name.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '客户名称长度不超过20字符' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            customerEarlyDebt : (value)=>{
                if ( value.length == 0 ){
                    return {
                        validateStatus : 'error' ,
                        help : '期初欠款不能为空' ,
                    }
                }else if ( !reg.base.customer.earlyDebt.test(value) ){
                    return {
                        //validateStatus : 'error' ,
                        //help : '期初欠款格式错误' ,
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            customerContact : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.customer.contact.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '联系人格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            customerTelphone : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.common.telephone.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '手机号码格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            customerMailBox : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.mailBox.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '电子邮箱格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            customerstaticPhone : (value)=>{
                if( value == '' || value == null){
                    return {
                        validateStatus : undefined ,
                        help : ''
                    }
                }else{
                    var arr = value.split('-') ;
                    if ( arr[0] == '' && arr[1] == '' && arr[2] == '' ){
                        return {
                            validateStatus : undefined ,
                            help : ''
                        }
                    } else if ( arr[0] == '' || arr[1] == '' ){
                        return {
                            validateStatus : 'error' ,
                            help : '固定电话区号和座机号不能为空'
                        }
                    } else if ( !reg.common.staticPhone1.test( arr[0] ) || !reg.common.staticPhone2.test( arr[1] ) ) {
                        return {
                            validateStatus : 'error' ,
                            help : '区号3-5位首位为0，座机号7-8位，分机号选填'
                        }
                    } else {
                        return {
                            validateStatus : undefined ,
                            help : ''
                        }
                    }
                }
            },
            customerFax : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.fax.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '传真格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            customerdetailAddress : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.customer.detailAddress.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '详细地址格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            customerSort : (value)=>{
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.customer.sort.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '排序格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            customerRemarks : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.customer.remarks.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '备注长度不超过30字符' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
        } ,
        form_supplier : {
            supplierName : (value)=>{
                if ( value.length == 0 ){
                    return {
                        validateStatus : 'error' ,
                        help : '供应商名称不能为空' ,
                    }
                }else if ( !reg.base.supplier.name.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '供应商名称长度不超过60字符' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            supplierEarlyDebt : (value)=>{
                if ( value.length == 0 ){
                    return {
                        validateStatus : 'error' ,
                        help : '期初欠款不能为空' ,
                    }
                }else if ( !reg.base.supplier.earlyDebt.test(value) ){
                    return {
                        //validateStatus : 'error' ,
                        //help : '期初欠款格式错误' ,
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            supplierContact : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.supplier.contact.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '联系人格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            supplierTelphone : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.common.telephone.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '手机号码格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            supplierMailBox : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.mailBox.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '电子邮箱格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            supplierstaticPhone : (value)=>{
                if( value == '' || value == null){
                    return {
                        validateStatus : undefined ,
                        help : ''
                    }
                }else{
                    var arr = value.split('-') ;
                    if ( arr[0] == '' && arr[1] == '' && arr[2] == '' ){
                        return {
                            validateStatus : undefined ,
                            help : ''
                        }
                    } else if ( arr[0] == '' || arr[1] == '' ){
                        return {
                            validateStatus : 'error' ,
                            help : '固定电话区号和座机号不能为空'
                        }
                    } else if ( !reg.common.staticPhone1.test( arr[0] ) || !reg.common.staticPhone2.test( arr[1] ) ) {
                        return {
                            validateStatus : 'error' ,
                            help : '区号3-5位首位为0，座机号7-8位，分机号选填'
                        }
                    } else {
                        return {
                            validateStatus : undefined ,
                            help : ''
                        }
                    }
                }
            },
            supplierFax : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.fax.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '传真格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            supplierdetailAddress : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.supplier.detailAddress.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '详细地址格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            supplierSort : (value)=>{
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.supplier.sort.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '排序格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            supplierRemarks : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else if ( !reg.base.supplier.remarks.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '备注长度不超过30字符' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
        } ,
    },
    settings : {
        form_personal : {
            name : (value)=>{
                if ( value.length == 0 ){
                    return {
                        validateStatus : 'error' ,
                        help : '姓名不能为空' ,
                    }
                }else if ( !reg.base.team.name.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '姓名格式不正确' ,
                    }
                } else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            mobile : (value)=>{
                if ( value.length == 0 ){
                    return {
                        validateStatus : 'error' ,
                        help : '手机号不能为空' ,
                    }
                } else if ( !reg.common.telephone.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '手机号码格式错误' ,
                    }
                } else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            password : (value)=>{
                if ( value.length < 6 ){
                    return {
                        validateStatus : 'error' ,
                        help : '密码过短' ,
                    }
                } else if ( value.length > 18 ){
                    return {
                        validateStatus : 'error' ,
                        help : '密码过长' ,
                    }
                }else if ( !reg.base.team.password.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '密码由6至20位两种以上字母、数字或标点符号构成' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            cz : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : 'error' ,
                        help : '传真不能为空' ,
                    }
                } else if ( !reg.base.fax.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '传真格式错误' ,
                    }
                } else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            email : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : 'error' ,
                        help : '邮箱不能为空' ,
                    }
                } else if ( !reg.base.mailBox.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '电子邮箱格式错误' ,
                    }
                } else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            qq : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : 'error' ,
                        help : 'QQ号不能为空' ,
                    }
                } else if ( !/^\d{6,10}$/.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : 'qq格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            jobNumber : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : 'error' ,
                        help : '工号不能为空' ,
                    }
                } else if ( !/^\d{1,20}$/.test(value) ){
                    return {
                        validateStatus : 'error' ,
                        help : '工号格式错误' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            wx : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }
                if ( value.length == 0 ){
                    return {
                        validateStatus : 'error' ,
                        help : '微信号不能为空' ,
                    }
                } else if ( value.length > 20 ){
                    return {
                        validateStatus : 'error' ,
                        help : '微信号过长' ,
                    }
                }else {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }

            },
            staticPhone : (value)=>{
                if ( value == null || value == '' ) {
                    return {
                        validateStatus : undefined ,
                        help : '' ,
                    }
                }else{
                    var arr = value.split('-') ;
                    if ( arr[0] == '' && arr[1] == '' && arr[2] == '' ){
                        return {
                            validateStatus : undefined ,
                            help : ''
                        }
                    } else if ( arr[0] == '' || arr[1] == '' ){
                        return {
                            validateStatus : 'error' ,
                            help : '固定电话区号和座机号不能为空'
                        }
                    } else if ( !reg.common.staticPhone1.test( arr[0] ) || !reg.common.staticPhone2.test( arr[1] ) ) {
                        return {
                            validateStatus : 'error' ,
                            help : '区号3-5位首位为0，座机号7-8位，分机号选填'
                        }
                    } else {
                        return {
                            validateStatus : undefined ,
                            help : ''
                        }
                    }
                }
            }
        },
    },
    reg : reg ,
} ;

export default validation ;

