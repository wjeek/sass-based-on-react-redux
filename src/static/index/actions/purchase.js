import {

} from '../constants'

export function layerShow1(state){
    return {
        type : 'LAYER_SHOW_1_PURCHASE' ,
        data : state ,
    }
}
export function layerShow2(data){
    return {
        type : 'LAYER_SHOW_2_PURCHASE' ,
        data : data
    }
}
export function modalShow1(state,data){
    return {
        type : 'MODAL_SHOW_1_PURCHASE' ,
        state : !!state ? true : false ,
        data : data
    }
}
export function layerShow3(data){
    return {
        type : 'LAYER_SHOW_3_PURCHASE' ,
        // state : !!state ? true : false ,
        data : data
    }
}
export function modalShow2(state){
    return {
        type : 'MODAL_SHOW_2_PURCHASE' ,
        state : !!state ? true : false
    }
}
export function layer2_input_show(state){
    return {
        type : 'LAYER_2_INPUT_PURCHASE' ,
        state : !!state ? true : false
    }
}



export function purchaseOrderInit(state) {
    return {
        type : 'PURCHASE_ORDER_INIT' ,
        data : state
    }
}
export function purchaseOrderTable(state) {
    return {
        type : 'PURCHASE_ORDER_TABLE' ,
        data : state
    }
}


