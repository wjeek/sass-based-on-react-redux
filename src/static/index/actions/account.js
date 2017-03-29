import {

} from '../constants'

export function chargeInit(data) {
    return {
        type: 'CHARGE_INIT' ,
        data : data
    }
}
export function chargeTable(data) {
    return {
        type: 'CHARGE_TABLE',
        data : data
    }
}
export function chargeLayer1Show(data) {
    return {
        type : 'CHARGE_LAYER1_SHOW' ,
        data : data
    }
}
export function chargeLayer2Show(data) {
    return {
        type : 'CHARGE_LAYER2_SHOW' ,
        data : data
    }
}
export function chargeModal1Show(data){
    return {
        type : 'CHARGE_MODAL1_SHOW' ,
        data : data
    }
}
export function chargeLayer1Hide(data){
    return {
        type : 'CHARGE_LAYER1_HIDE' ,
        data : data
    }
}
export function chargeModal2Show(data){
    return {
        type : 'CHARGE_MODAL2_SHOW' ,
        data : data
    }
}
//
export function userInit(data){
    return {
        type : 'USER_INIT' ,
        data : data ,
    }
}
export function userTable(data){
    return {
        type : 'USER_TABLE' ,
        data : data ,
    }
}
export function userLayer1Show(data) {
    return {
        type : 'USER_LAYER1_SHOW' ,
        data : data
    }
}
export function userModal1Show(data){
    return {
        type : 'USER_MODAL1_SHOW' ,
        data : data
    }
}
export function userModal2Show(data) {
    return {
        type : 'USER_MODAL2_SHOW' ,
        data : data
    }
}
// export function userModal3Show(data) {
//     return {
//         type : 'USER_MODAL3_SHOW' ,
//         data : data
//     }
// }
// export function userModal4Show(data){
//     return {
//         type : 'USER_MODAL4_SHOW' ,
//         data : data
//     }
// }
export function userModal5Show(data){
    return {
        type : 'USER_MODAL5_SHOW' ,
        data : data
    }
}
export function userModal6Show(data){
    return {
        type : 'USER_MODAL6_SHOW' ,
        data : data
    }
}

export function userModal6Show2(data){
    return {
        type : 'USER_MODAL6_SHOW_2' ,
        data : data
    }
}
//
export function supplierInit(data){
    return {
        type : 'SUPPLIER_INIT' ,
        data : data ,
    }
}
export function supplierTable(data){
    return {
        type : 'SUPPLIER_TABLE' ,
        data : data ,
    }
}
export function supplierLayer1Show(data) {
    return {
        type : 'SUPPLIER_LAYER1_SHOW' ,
        data : data
    }
}
export function supplierModal1Show(data){
    return {
        type : 'SUPPLIER_MODAL1_SHOW' ,
        data : data
    }
}
export function supplierModal2Show(data) {
    return {
        type : 'SUPPLIER_MODAL2_SHOW' ,
        data : data
    }
}
export function supplierModal5Show(data){
    return {
        type : 'SUPPLIER_MODAL5_SHOW' ,
        data : data
    }
}