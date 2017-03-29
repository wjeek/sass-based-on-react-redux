
const initState = {
    //同步获取到的数据
    //当前用户基本信息
    user : {
        isEmpty : true , //标记该用户尚未初始化
    },
    //
} ;

//reducer

// 根据 action , 返回一个全新的 store

export default function(state = initState , action) {
    if ( action.type === 'INIT_AUTH_MESSAGE' ) {
        return {
            ...state ,
            user : action.data ,
        } ;
    } else if ( action.type === '' ) {
        return {
            data : {
                auth : []
            }
        }
    }
    return state
}
