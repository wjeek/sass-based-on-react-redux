import {
    HOME_INITDATA ,
    HOME_SETTARGET ,
    INITIALSTATE ,
} from '../constants'


const initState = {
    market_modal_show : false , 
    alertText : {
        salesReceivableAmount : '' ,
        soOverRecAmount : '' ,
        poNextPayableAmount : '',
        growth : '' ,
    } ,
} ;

//reducer

// 根据 action , 返回一个全新的 store

export default function(state = initState , action) {
    if ( action.type === HOME_INITDATA ) {
        return {
            data : action.data
        }
    } else if ( action.type === HOME_SETTARGET ) {
        return {
            data : {

            }
        }
    } else if( action.type === 'HOME_MARKET_SHOWMODAL' ){
        return {
            ...state ,
            market_modal_show : action.data.isShow ,
        }
    }else if ( action.type === 'HOME_INIT_ALERT' ) {
        return {
            ...state ,
            alertText : {
                ...state.alertText ,
                salesReceivableAmount : action.data.alertText1.data.dashBoardDto.salesReceivableAmount ,
                soOverRecAmount : action.data.alertText1.data.dashBoardDto.soOverRecAmount ,
                poNextPayableAmount : action.data.alertText2.data.dashBoardDto.poNextPayableAmount,
                growth : action.data.alertText2.data.dashBoardDto.growth ,
            }
        }
    }
    return state
}
