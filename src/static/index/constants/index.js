//cookie name
export const TOKEN_NAME = 's_token' ;
export const USER_NAME = 's_user' ;
export const TENANT_ID = 's_tenant';

//store init
export const INITIALSTATE = {
    count : {
        number : 1 ,
    },
    home : {
        data : {

        }
    }
} ;


// export const INCREASE = 'INCREASE'
// export const DECREASE = 'DECREASE'


//PRO
//home
export const HOME_INITDATA = 'home_initdata' ;
export const HOME_SETTARGET = 'home_settarget' ;

//意见反馈切换
export const SHOW_FEEDBACK = 'SHOW_FEEDBACK';
export const TYPING_FEEDBACK = 'TYPING_FEEDBACK';

//purchase


//marker


//accout


//statistics


//settings

//图片上传后缀名
export const FILE_IMAGE_ACCEPT = [
    'jpg' ,
    'png' ,
    'jpeg' ,
] ;
//excel上传后缀名
export const FILE_EXCEL_ACCEPT = [
    'xls' ,
    'xlsx' ,
] ;


//图表数组
export const CHARTS_COLLECTION_BOSS = [
    {
        value : 'chartMarket' ,
        label : '销售情况'
    },
    {
        value : 'chartCapital' ,
        label : '资金情况'
    },
    {
        value : 'chartPurchaseStore' ,
        label : '库存情况'
    },
    {
        value : 'chartMarketProfit' ,
        label : '销售毛利'
    },
    {
        value : 'chartPurchase' ,
        label : '采购情况'
    },
    {
        value : 'chartCustomer' ,
        label : '客户管理'
    },
    {
        value : 'chartWarn' ,
        label : '异常预警'
    },
    {
        value : 'chartRecord' ,
        label : '龙虎榜'
    },
    {
        value : 'chartProduct' ,
        label : '热销商品' ,
    },
    {
        value : 'chartUser' ,
        label : '客户前十'
    }
] ;


//性别 映射
export const SEX_TYPE_MAP = ({
    // 'male' : '男' ,
    // 'female' : '女' ,
    '1' : '男' ,
    '0' : '女' ,
    '2' : '其他'
}) ;
export const SEX_TYPE = [{
    name : '男' ,
    value : 1
},{
    name : '女' ,
    value : 0
},{
    name : '其他' ,
    value : 2
}] ;
//职位/角色 映射
export const POST_TYPE_MAP = ({
    // 'boss' : '老板' ,
    // 'marker' : '销售' ,
    // 'purchase' : '采购' ,
    // 'finance' : '财务' ,
    '1' : '老板' ,
    '2' : '财务' ,
    '3' : '销售' ,
    '4' : '采购'
}) ;
export const POST_TYPE = [{
    name : '老板' ,
    value : 1
},{
    name : '财务' ,
    value : 2
},{
    name : '销售' ,
    value : 3
},{
    name : '采购' ,
    value : 4
}] ;
//结算方式 列表
export const PAY_TYPE = [
    /*{
    name : '默认结算方式' ,
    value : 1
},*/{
    name : '现金' ,
    value : 1
},{
    name : 'POS机' ,
    value : 2
},{
    name : '支付宝' ,
    value : 3
},{
    name : '微信' ,
    value : 4
},{
    name : '银行转账' ,
    value : 5
},{
    name : '网银转账' ,
    value : 6
}] ;
//账款类型列表
export const ACCOUNT_TYPE = [{
    name : '应收款' ,
    value : 1
},{
    name : '其他收入' ,
    value : 2
},{
    name : '预收款' ,
    value : 3
},{
    name : '销售退款' ,
    value : 4
},{
    name : '采购退款' ,
    value : 5
},{
    name : '应付款' ,
    value : 6
},{
    name : '期初调整' ,
    value : 7
},{
    name : '销售收入' ,
    value : 8
},{
    name : '采购支出' ,
        value : 9
}] ;
//销售记录 - 记录状态
export const RECODE_TYPE = [{
    name : '正常' ,
    value : '0' ,
},{
    name : '已撤销' ,
    value : '1' ,
}] ;
//销售记录 - 选择货品 - 发货状态
export const PRODUCT_TYPE = [{
    name : '未发货' ,
    value : '0' ,
},{
    name : '已发货' ,
    value : '1' ,
}] ;


//路由 和 中文 名的映射
export const ROUTE_NAME_MAP = ({
    'home' : {
        name : '首页'
    } ,
    'market' : {
        name : '销售' ,
        child : {
            'list' : {
                name : '销售记录' ,
            },
            // 'returnList' : {
            //     name : '销售退货记录'
            // }
        }
    } ,
    'purchase' : {
        name : '采购' ,
        child : {
            'order' : {
                name : '采购单'
            },
            // 'returnOrder' : {
            //     name : '采购退货单'
            // }
        }
    },
    'account' : {
        name : '账款' ,
        child : {
            'chargeAccount' : {
                name : '流水账'
            },
            'checkAccount' : {
                name : '收付款' ,
                child : {
                    'user' : {
                        name : '收款'
                    },
                    'supplier' : {
                        name : '付款'
                    }
                }
            }
        }
    },
    'statistics' : {
        name : '统计' ,
        child : {
            's_market' : {
                name : '销售统计' ,
                child : {
                    /*'s_a_purchase' : {
                        name : '销售明细'
                    },*/
                    's_a_product' : {
                        name : '按商品'
                    },
                    's_a_user' : {
                        name : '按客户'
                    },
                    's_a_list' : {
                        name : '按销售员'
                    },
                    's_a_sale' : {
                        name : '销售额'
                    }
                }
            },
            's_purchase' : {
                name : '采购统计' ,
                child : {
                    /*'s_b_market' : {
                        name : '采购明细'
                    },*/    
                    's_b_product' : {
                        name : '按商品'
                    },
                    's_b_supplier' : {
                        name : '按供应商'
                    },
                    's_b_list' : {
                        name : '按采购员'
                    }
                }
            },
            's_account' : {
                name : '账款统计' ,
                child : {
                    's_c_account' : {
                        name : '账款统计'
                    },
                    's_c_pay' : {
                        name : '应收应付'
                    }
                }
            },
            's_invoicing' : {
                name : '进销对比' ,
                child : {
                    's_d_invoicing' : {
                        name : '进销对比'
                    }
                }
            }
        }
    },
    'base' : {
        name : '基础' ,
        child : {
            'b_product' : {
                name : '库存管理'
            },
            'b_customer' : {
                name : '客户管理'
            },
            'b_supplier' : {
                name : '供应商管理'
            }
        }
    },
    'settings' : {
        name : '设置' ,
        child : {
            'se_account' : {
                name : '账户信息' ,
                child : {
                    'se_a_personal' : {
                        name :　'个人信息'
                    },
                    'se_a_company' : {
                        name : '公司信息'
                    },
                    'se_a_personaledit' : {
                        name : '个人信息(编辑)'
                    },
                    'se_a_companyedit' : {
                        name : '公司信息(编辑)'
                    }
                }
            },
            'se_team' : {
                name : '我的团队'
            },
            'se_log' : {
                name :　'操作日志'
            },
            'se_feedback' : {
                name : '意见反馈'
            }
        }
    }
}) ;

export const MONTH_CN = {
    January : '一月' ,
    February : '二月' ,
    March : '三月' ,
    April : '四月' ,
    May  : '五月' ,
    June : '六月' ,
    July : '七月' ,
    August : '八月' ,
    September : '九月' ,
    October : '十月' ,
    November : '十一月' ,
    December : '十二月' ,
} ;
