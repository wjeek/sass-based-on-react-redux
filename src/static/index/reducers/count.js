import { INCREASE, DECREASE , INITIALSTATE } from '../constants'

//reducer
const initState = INITIALSTATE.count ;

// 根据 action , 返回一个全新的 store

export default function(state = initState , action) {
    if(action.type === INCREASE) {
        return { number: state.number + action.amount }
    }
    else if(action.type === DECREASE) {
        return { number: state.number - action.amount }
    }
    return state
}
