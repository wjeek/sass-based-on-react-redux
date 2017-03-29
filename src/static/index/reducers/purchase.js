import {

} from '../constants'
import moment from 'moment'

//store init //采购
const initialState = {
    order : {
        totalCount : 0 ,
        dataSource : {
            data : []
        } ,
        supplier : {
            data : []
        } ,
        payType : {
            data : []
        } ,
        productType : {
            data : []
        } ,
        recodeType : {
            data : []
        } ,
        purchaser : {
            data : []
        } ,

        newMarket : {

        } ,
        detail : {

        } , //要展示的详情
        productDataSource : []
    },
    orderState : {
        layerShow1 : false , //新建销售记录layer
        layerShow2 : false , //选择货品的layer
        modalShow1 : false , //确认取消销售记录modal
        layerShow3 : false , //查看销售记录layer
        showId : '' , //要展示的记录的ID
        modalShow2 : false , //结款modal
        // modal1Id : '' ,

        layer2_input_show : false , //layer2里面的产品输入框
    },
    returnOrder : {

    },
    returnOrderState : {

    }

}

//reducer
export default function(state = initialState, action) {
    switch ( action.type ){
        case 'LAYER_SHOW_1_PURCHASE' :
            return {
                ...state ,
                order : {
                    ...state.order ,
                    newMarket : {
                        date : moment().format('YYYY-MM-DD')

                    }
                } ,
                orderState : {
                    ...state.orderState ,
                    layerShow1 : action.data.isShow
                }
            }
            break ;
        case 'LAYER_SHOW_2_PURCHASE' :
            return {
                ...state ,
                orderState : {
                    ...state.orderState ,
                    layerShow2 : action.data.isShow ,
                    layer2_input_show : false
                }
            }
            break ;
        case 'MODAL_SHOW_1_PURCHASE' :
            return {
                ...state ,
                orderState : {
                    ...state.orderState ,
                    modalShow1 : action.state
                }
            }
            break ;
        case 'LAYER_SHOW_3_PURCHASE' :
            return {
                ...state ,
                order : {
                    ...state.order ,
                    detail : action.data.detail ,
                },
                orderState : {
                    ...state.orderState ,
                    layerShow3 : action.data.isShow ,
                    // showId : action.data.id
                }
            }
            break ;
        case 'MODAL_SHOW_2_PURCHASE' :
            return {
                ...state ,
                orderState : {
                    ...state.orderState ,
                    modalShow2 : action.state
                }
            }
            break ;
        case 'LAYER_2_INPUT_PURCHASE' :
            return {
                ...state ,
                orderState : {
                    ...state.orderState ,
                    layer2_input_show : action.state
                }
            }
        case 'PURCHASE_ORDER_INIT' :
            //初始化market
            //filter重置 , order初始化 ,
            console.log(action);
            return {
                ...state ,
                order : {
                    ...state.order ,
                    totalCount : ( action.data.data.data[0] && action.data.data.data[0].totalCount - 0 ) || 0 ,
                    dataSource : action.data.data ,
                    supplier : action.data.supplier ,
                    payType : action.data.payType ,
                    productType : action.data.productType ,
                    recodeType : action.data.recodeType ,
                    purchaser : action.data.purchaser ,
                    // productDataSource : []
                },
                orderState : {
                    ...state.orderState ,
                    layerShow1 : false , //新建销售记录layer
                    layerShow2 : false , //选择货品的layer
                    modalShow1 : false , //确认取消销售记录modal
                    layerShow3 : false , //查看销售记录layer
                    modalShow2 : false , //结款modal

                    layer2_input_show : false , //layer2里面的产品输入框
                },
            }
        case 'PURCHASE_ORDER_TABLE' :
            //table
            return {
                ...state ,
                order : {
                    ...state.order ,
                    totalCount : ( action.data.data[0] && action.data.data[0].totalCount - 0) || 0 ,
                    dataSource : action.data
                }
            }
    }
    return state
}
