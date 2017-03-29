import {

} from '../constants'
import moment from 'moment'

//store init //销售
const initialState = {
    b_product : {
        totalCount : 0 ,
        dataSource : {
            data : [] ,
        } ,
        product : {
            data : []
        } ,
        category : {
            data : []
        } ,
        brandId : {
            data : []
        } ,
        specification : {
            data : []
        } ,
        unit : {
            data : []
        } ,

        showModel : {

        },

        //展示货品数据用的details
        details : {

        }

    },
    b_productState : {
        modalShow1 : false , //新建商品窗口的弹窗
        modalType1 : 'new' , //商品弹窗的type
        layerShow1 : false , //查看货品详情的layer
        modalShow3 : false ,
        onImportShow : false,
        currentStep : 0,
        showId : '' , //查看商品的id
    },
    b_customer : {
        totalCount : 0 ,
        dataSource : {
            data : [] ,
        },
        detail : {
            data : {}
        },
        city : {
            data : []
        }
    },
    b_customerState : {
        modalShow1 : false , //新建客户的弹窗
        modalType1 : 'new' , //标记状态是新建还是编辑type
        layerShow1 : false , //查看用户的layer ,
        modalShow3 : false ,
        onImportShow : false,
        currentStep : 0,
        showId : '' , //查看用户的id
    },
    b_supplier : {
        totalCount : 0 ,
        dataSource : {
            data : [] ,
        },
        detail : {
            data : {}
        },
        city : {
            data : {}
        }
    },
    b_supplierState : {
        modalShow1 : false , //新建客户的弹窗
        modalType1 : 'new' , //标记状态是新建还是编辑type
        layerShow1 : false , //查看用户的layer ,
        modalShow3 : false ,
        onImportShow : false,
        currentStep : 0,
        showId : '' , //查看用户的id
    }

}

//reducer
export default function(state = initialState, action) {
    switch ( action.type ){
        case 'BASE_PRODUCT_INIT' :
            //初始化market
            //filter重置 , list初始化 ,
            console.log( action ) ;
            return {
                ...state ,
                b_product : {
                    ...state.b_product ,
                    totalCount : ( action.data.data.data[0] && action.data.data.data[0].totalCount - 0) || 0 ,
                    dataSource : action.data.data ,
                    product : action.data.product ,
                    category : action.data.category ,
                    brandId : action.data.brandId ,
                    specification : action.data.specification ,
                    unit : action.data.unit
                    // productDataSource : []
                },
                b_productState : {
                    ...state.b_productState ,
                    modalShow1 : false , //新建客户的弹窗
                    modalType1 : 'new' , //标记状态是新建还是编辑type
                    layerShow1 : false , //查看用户的layer ,
                },
            }
        case 'BASE_PRODUCT_TABLE' :
            //table
            return {
                ...state ,
                b_product : {
                    ...state.b_product ,
                    totalCount : ( action.data.data[0] && action.data.data[0].totalCount - 0) || 0 ,
                    dataSource : action.data
                }
            }
        case 'BASE_PRODUCT_CATEGORY_FILTER' :
            console.log( action ) ;
            return {
                ...state ,
                b_product : {
                    ...state.b_product ,
                    category : {
                        data : action.data ,
                    } ,
                }
            }
        case 'BASE_PRODUCT_BRAND_FILTER' :
            return {
                ...state ,
                b_product : {
                    ...state.b_product ,
                    brandId : {
                        data : action.data ,
                    } ,
                }
            }
        case 'BASE_PRODUCT_UNIT_FILTER' :
            return {
                ...state ,
                b_product : {
                    ...state.b_product ,
                    unit : {
                        data : action.data ,
                    } ,
                }
            }

        case 'MODAL_SHOW_1_PRODUCT' :
            return {
                ...state ,
                b_product : {
                    ...state.b_product ,
                    // modalModel : action.data.data ,
                } ,
                b_productState : {
                    ...state.b_productState ,
                    // modalShow1 : action.state ,
                    modalShow1 : action.data.isShow ,
                    modalType1 : action.data.operation ,
                }
            }
        //product导入
        case 'MODAL_SHOW_3_PRODUCT' :
            return {
                ...state ,
                b_productState : {
                    ...state.b_productState ,
                    modalShow3 : action.state ,
                    onImportShow : false,
                    currentStep : 0,
                }
            }
        case 'CANCEL_IMPORT_PRODUCT' :
            return {
                ...state ,
                b_productState : {
                    ...state.b_productState ,
                    modalShow3 : false ,
                }
            }
        case 'START_IMPORT_PRODUCT' :
            return {
                ...state ,
                b_productState : {
                    ...state.b_productState ,
                    onImportShow : true ,
                    currentStep : state.b_productState.currentStep+1,
                }
            }
        //customer导入
        case 'MODAL_SHOW_3_CUSTOMER' :
            return {
                ...state ,
                b_customerState : {
                    ...state.b_customerState ,
                    modalShow3 : action.state ,
                    onImportShow : false,
                    currentStep : 0,
                }
            }
        case 'CANCEL_IMPORT_CUSTOMER' :
            return {
                ...state ,
                b_customerState : {
                    ...state.b_customerState ,
                    modalShow3 : false ,
                }
            }
        case 'START_IMPORT_CUSTOMER' :
            return {
                ...state ,
                b_customerState : {
                    ...state.b_customerState ,
                    onImportShow : true ,
                    currentStep : state.b_customerState.currentStep+1,
                }
            }
        //SUPPLIER导入
        case 'MODAL_SHOW_3_SUPPLIER' :
            return {
                ...state ,
                b_supplierState : {
                    ...state.b_supplierState ,
                    modalShow3 : action.state ,
                    onImportShow : false,
                    currentStep : 0,
                }
            }
        case 'CANCEL_IMPORT_SUPPLIER' :
            return {
                ...state ,
                b_supplierState : {
                    ...state.b_supplierState ,
                    modalShow3 : false ,
                }
            }
        case 'START_IMPORT_SUPPLIER' :
            return {
                ...state ,
                b_supplierState : {
                    ...state.b_supplierState ,
                    onImportShow : true ,
                    currentStep : state.b_supplierState.currentStep+1,
                }
            }
        case 'LAYER_SHOW_1_PRODUCT' :
            return {
                ...state ,
                b_product : {
                    ...state.b_product　,
                    details : action.data.value
                },
                b_productState : {
                    ...state.b_productState ,
                    layerShow1 : action.data.isShow ,
                    // showId : action.showId
                }
            }

        //
        case 'BASE_CUSTOMER_INIT' :
            //初始化market
            //filter重置 , list初始化 ,
            return {
                ...state ,
                b_customer : {
                    ...state.b_customer ,
                    totalCount : ( action.data.data.data[0] && action.data.data.data[0].totalCount - 0) || 0 ,
                    dataSource : action.data.data ,
                    city : action.data.city ,
                },
                b_customerState : {
                    ...state.b_customerState ,
                    modalShow1 : false , //新建客户的弹窗
                    modalType1 : 'new' , //标记状态是新建还是编辑type
                    layerShow1 : false , //查看客户的layer ,

                },
            }
        case 'BASE_CUSTOMER_TABLE' :
            //table
            return {
                ...state ,
                b_customer : {
                    ...state.b_customer ,
                    totalCount : ( action.data.data[0] && action.data.data[0].totalCount - 0) || 0 ,
                    dataSource : action.data
                }
            }
        case 'MODAL_SHOW_1_CUSTOMER' :
            return {
                ...state ,
                b_customer : {
                    ...state.b_customer ,
                    // modalModel : action.data.data ,
                } ,
                b_customerState : {
                    ...state.b_customerState ,
                    modalShow1 : action.data.isShow ,
                    modalType1 : action.data.operation ,
                }
            }
        case 'LAYER_SHOW_1_CUSTOMER' :
            return {
                ...state ,
                b_customer : {
                    ...state.b_customer　,
                    detail : action.data.value
                },
                b_customerState : {
                    ...state.b_customerState ,
                    layerShow1 : action.data.isShow ,
                    showId : action.data.showId ,
                }
            }
        //
        case 'BASE_SUPPLIER_INIT' :
            return {
                ...state ,
                b_supplier : {
                    ...state.b_supplier ,
                    totalCount : ( action.data.data.data[0] && action.data.data.data[0].totalCount - 0 ) || 0 ,
                    dataSource : action.data.data ,
                    city : action.data.city ,
                },
                b_supplierState : {
                    ...state.b_supplierState ,
                    modalShow1 : false , //新建客户的弹窗
                    modalType1 : 'new' , //标记状态是新建还是编辑type
                    layerShow1 : false , //查看客户的layer ,

                },
            }
        case 'BASE_SUPPLIER_TABLE' :
            //table
            return {
                ...state ,
                b_supplier : {
                    ...state.b_supplier ,
                    totalCount : ( action.data.data[0] && action.data.data[0].totalCount - 0 ) || 0 ,
                    dataSource : action.data
                }
            }
        case 'MODAL_SHOW_1_SUPPLIER' :
            return {
                ...state ,
                b_supplier : {
                    ...state.b_supplier ,
                } ,
                b_supplierState : {
                    ...state.b_supplierState ,
                    modalShow1 : action.data.isShow ,
                    modalType1 : action.data.operation ,
                }
            }
        case 'LAYER_SHOW_1_SUPPLIER' :
            return {
                ...state ,
                b_supplier : {
                    ...state.b_supplier　,
                    detail : action.data.value
                },
                b_supplierState : {
                    ...state.b_supplierState ,
                    layerShow1 : action.data.isShow ,
                    showId : action.data.showId ,
                }
            }
    }
    return state
}
