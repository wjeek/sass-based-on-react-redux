import { NEXTTAB } from '../constants'

//store init
const initialState = {
    title : '用户注册' ,
    currentIndex : 1 ,
    user_id : '' ,
    prevState : '' ,
}

//reducer

export default function update(state = initialState, action) {
    if(action.type === NEXTTAB ) {
        // 接受INCREASE步骤就 +1
        // console.log(action);
        return {
            ...state ,
            currentIndex : state.currentIndex + 1 ,
            user_id : action.data ,
            prevState : action.prevState || ''  ,
        }
    }
    return state
}
