import {

} from '../constants'


export function baseProductInit(state) {
    return {
        type : 'BASE_PRODUCT_INIT' ,
        data : state
    }
}
export function baseProductTable(state) {
    return {
        type : 'BASE_PRODUCT_TABLE' ,
        data : state
    }
}
export function baseProductCategoryFilter(data) {
    return {
        type : 'BASE_PRODUCT_CATEGORY_FILTER' ,
        data : data
    }
}
export function baseProductBrandFilter(data) {
    return {
        type : 'BASE_PRODUCT_BRAND_FILTER' ,
        data : data
    }
}
export function baseProductUnitFilter(data) {
    return {
        type : 'BASE_PRODUCT_UNIT_FILTER' ,
        data : data
    }
}
export function modalShow1(data){
    return {
        type : 'MODAL_SHOW_1_PRODUCT' ,
        // state : !!state ? true : false ,
        // data : data ,
        data : data ,
    }
}
export function modalShow3_product(state){
    return {
        type : 'MODAL_SHOW_3_PRODUCT' ,
        state : !!state ? true : false ,
    }
}
export function cancelImport_product(){
    return {
        type : 'CANCEL_IMPORT_PRODUCT'
    }
}
export function startImport_product(){
    return {
        type : 'START_IMPORT_PRODUCT'
    }
}


export function modalShow3_customer(state){
    return {
        type : 'MODAL_SHOW_3_CUSTOMER' ,
        state : !!state ? true : false ,
    }
}
export function cancelImport_customer(){
    return {
        type : 'CANCEL_IMPORT_CUSTOMER'
    }
}
export function startImport_customer(){
    return {
        type : 'START_IMPORT_CUSTOMER'
    }
}


export function modalShow3_supplier(state){
    return {
        type : 'MODAL_SHOW_3_SUPPLIER' ,
        state : !!state ? true : false ,
    }
}
export function cancelImport_supplier(){
    return {
        type : 'CANCEL_IMPORT_SUPPLIER'
    }
}
export function startImport_supplier(){
    return {
        type : 'START_IMPORT_SUPPLIER'
    }
}


// export function layerShow1(state,data){
export function layerShow1(state){
    return {
        type : 'LAYER_SHOW_1_PRODUCT' ,
        // state : !!state?true:false ,
        // showId : data.id,
        data : state ,
    }
}

//
export function baseCustomerInit(state){
    return {
        type : 'BASE_CUSTOMER_INIT' ,
        data : state
    }
}
export function baseCustomerTable(state) {
    return {
        type : 'BASE_CUSTOMER_TABLE' ,
        data : state
    }
}
export function modalShow1_customer(state){
    return {
        type : 'MODAL_SHOW_1_CUSTOMER' ,
        data : state
    }
}
export function layerShow1_customer(data){
    return {
        type : 'LAYER_SHOW_1_CUSTOMER' ,
        data : data ,
    }
}
//
export function baseSupplierInit(state){
    return {
        type : 'BASE_SUPPLIER_INIT' ,
        data : state
    }
}
export function baseSupplierTable(state) {
    return {
        type : 'BASE_SUPPLIER_TABLE' ,
        data : state
    }
}
export function modalShow1_supplier(state){
    return {
        type : 'MODAL_SHOW_1_SUPPLIER' ,
        data : state
    }
}
export function layerShow1_supplier(state){
    return {
        type : 'LAYER_SHOW_1_SUPPLIER' ,
        data : state
    }
}