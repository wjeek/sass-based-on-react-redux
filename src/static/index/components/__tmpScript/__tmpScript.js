//8.14
//原定的React系列的组件的初始化参数
const filter = {
    children : Array.of({
            label : '客户' ,
            type : 'select' ,
            ref : 'selectRef' ,
            val : 'userAll'　,
            options : [{
                name : '全部客户' ,
                value : 'userAll'
            },{
                name : '客户一' ,
                value : 'user1'
            },{
                name : '客户二' ,
                value : 'user2'
            }]
        },{
            label : '编号' ,
            type : 'input' ,
            ref : 'inputRef'　,
            val : ''
        },{
            label : '结算方式' ,
            type : 'select' ,
            ref : 'selectRef2' ,
            val : 'typeAll'　,
            options : [{
                name : '全部结算方式' ,
                value : 'typeAll'
            },{
                name : '账款' ,
                value : 'type1'
            },{
                name : '分期' ,
                value : 'type2'
            }]
        },{
            label : '发货状态' ,
            type : 'select' ,
            ref : 'selectRef2' ,
            val : 'stateAll'　,
            options : [{
                name : '全部' ,
                value : 'stateAll'
            },{
                name : '未发货' ,
                value : 'state1'
            },{
                name : '已发货' ,
                value : 'state2'
            }]
        },{
            label : '记录状态' ,
            type : 'select' ,
            ref : 'selectRef2' ,
            val : 'markAll'　,
            options : [{
                name : '全部' ,
                value : 'markAll'
            },{
                name : '已记录' ,
                value : 'mark1'
            },{
                name : '未记录' ,
                value : 'mark2'
            }]
        },{
            label : '业务日期' ,
            type : 'datepicker' ,
            ref : 'dataRef' ,
            val : '2010-06-26'
        },{
            label : '至' ,
            type : 'datepicker' ,
            ref : 'dataRef' ,
            val : '2010-07-25'
        },{
            label : '' ,
            type : 'input' ,
            ref : 'inputRef'　,
            val : '应收款不为0'
        }
        // ,
        // {
        //     label : '展示' ,
        //     type : 'text' ,
        //     ref : 'textRef' ,
        //     val : 'test'
        // }
    )
} ; //Filter Component Init Data
