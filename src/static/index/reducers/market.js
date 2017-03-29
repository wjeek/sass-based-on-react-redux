import {

} from '../constants'
import moment from 'moment'

//store init //销售
const initialState = {
    list : {
        totalCount : 0 ,
        dataSource : {
            data : []
        } ,
        customer : {
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
        salesMan : {
            data : []
        } ,
        newMarket : {

        } ,

        detail : {

        } , //要展示的详情

        productDataSource : [
            // {
            //     id : 1 ,
            //     operation : '' ,
            //     product : '默认商品' ,
            //     unit : '1个' ,
            //     number : 0 ,
            //     one : '$10.00' ,
            //     count : '80' ,
            //     price : '$100' ,
            //     state : '已发货'
            // },
            // {
            //     id : 1 ,
            //     operation : '' ,
            //     product : '默认商品' ,
            //     unit : '1个' ,
            //     number : 0 ,
            //     one : '$10.00' ,
            //     count : '80' ,
            //     price : '$100' ,
            //     state : '已发货'
            // }
            
            // {
            //     itemId : '' ,
            //     unitId : '' ,
            //     quantity : '' ,
            //     unitPrice : '' ,
            //     discount : '' ,
            //     discountAmount : '' ,
            //     deliveryState : '' ,
            //
            //     itemName_forShow : '' ,
            // }
        ]
    },
    returnList : {

    },
    listState : {
        layerShow1 : false , //新建销售记录layer
        layerShow2 : false , //选择货品的layer
        modalShow1 : false , //确认取消销售记录modal
        layerShow3 : false , //查看销售记录layer
        showId : ''　,
        modalShow2 : false , //结款modal
        // modal1Id : '' ,
        
        layer2_input_show : false , //layer2里面的产品输入框
    },
    returnListSatet : {

    }

}

//reducer
export default function(state = initialState, action) {
    switch ( action.type ){
        case 'LAYER_SHOW_1_MARKET' :
            return {
                ...state ,
                list : {
                    ...state.list ,
                    newMarket : {
                        date : moment().format('YYYY-MM-DD') 

                    }
                } ,
                listState : {
                    ...state.listState ,
                    layerShow1 : action.data.isShow
                }
            }
            break ;
        case 'LAYER_SHOW_2_MARKET' :
            return {
                ...state ,
                listState : {
                    ...state.listState ,
                    layerShow2 : action.data.isShow ,
                    layer2_input_show : false
                }
            }
            break ;
        case 'MODAL_SHOW_1_MARKET' :
            return {
                ...state ,
                listState : {
                    ...state.listState ,
                    modalShow1 : action.state
                }
            }
            break ;
        case 'LAYER_SHOW_3_MARKET' :
            return {
                ...state ,
                list : {
                    ...state.list ,
                    detail : action.data.detail ,
                },
                listState : {
                    ...state.listState ,
                    layerShow3 : action.data.isShow ,
                    // showId : action.data.id
                }
            }
            break ;
        case 'MODAL_SHOW_2_MARKET' :
            return {
                ...state ,
                listState : {
                    ...state.listState ,
                    modalShow2 : action.state
                }
            }
            break ;
        case 'LAYER_2_INPUT_MARKET' :
            return {
                ...state ,
                listState : {
                    ...state.listState ,
                    layer2_input_show : action.state
                }
            }
        case 'MARKET_LIST_INIT' :
            //初始化market
            //filter重置 , list初始化 ,
            return {
                ...state ,
                list : {
                    ...state.list ,
                    totalCount : ( action.data.data.data[0] && action.data.data.data[0].totalCount - 0 ) || 0 ,
                    dataSource : action.data.data ,
                    // pageIndex : action.data.pageIndex ,
                    // pageStep : action.data.pageStep ,
                    // pageTotal : action.data.pageTotal ,

                    customer : action.data.customer ,
                    payType : action.data.payType ,
                    productType : action.data.productType ,
                    recodeType : action.data.recodeType ,
                    salesMan : action.data.salesMan ,
                    // productDataSource : []
                },
                listState : {
                    ...state.listState ,
                    layerShow1 : false , //新建销售记录layer
                    layerShow2 : false , //选择货品的layer
                    modalShow1 : false , //确认取消销售记录modal
                    layerShow3 : false , //查看销售记录layer
                    modalShow2 : false , //结款modal

                    layer2_input_show : false , //layer2里面的产品输入框
                },
            }
        case 'MARKET_LIST_TABLE' :
            //table
            return {
                ...state ,
                list : {
                    ...state.list ,
                    totalCount : ( action.data.data[0] && action.data.data[0].totalCount - 0 ) || 0 ,
                    dataSource : action.data
                }
            }
    }
    return state
}
