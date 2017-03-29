import {

} from '../constants'

export function layerShow1(state){
    return {
        type : 'LAYER_SHOW_1_MARKET' ,
        // state : !!state ? true : false 
        data : state ,
    }
}
export function layerShow2(data){
    return {
        type : 'LAYER_SHOW_2_MARKET' ,
        data : data
    }
}
export function modalShow1(state,data){
    return {
        type : 'MODAL_SHOW_1_MARKET' ,
        state : !!state ? true : false ,
        data : data
    }
}
export function layerShow3(data){
    return {
        type : 'LAYER_SHOW_3_MARKET' ,
        data : data
        // state : !!state ? true : false ,
        // data : data
    }
}
export function modalShow2(state){
    return {
        type : 'MODAL_SHOW_2_MARKET' ,
        state : !!state ? true : false
    } 
}
export function layer2_input_show(state){
    return {
        type : 'LAYER_2_INPUT_MARKET' ,
        state : !!state ? true : false
    }
}



export function marketListInit(data) {
    return {
        type : 'MARKET_LIST_INIT' ,
        data : data
    }
}
export function marketListTable(data) {
    return {
        type : 'MARKET_LIST_TABLE' ,
        data : data
    }
}


