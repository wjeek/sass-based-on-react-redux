import { HOME_INITDATA, HOME_SETTARGET } from '../constants'

//不同的action函数 根据 不同的参数 , 生成一个 供 reducer 修改 store 的数据对象

export function home_initdata(data) {
    return {
        type: HOME_INITDATA ,
        data : data
    }
}

export function home_settarget(n) {
    return {
        type: HOME_SETTARGET,
        amount : n
    }
}

export function home_init_alert(data){
    return {
        type : 'HOME_INIT_ALERT' ,
        data : data 
    }
}

export function home_market_showModal(data){
    return {
        type : 'HOME_MARKET_SHOWMODAL' ,
        data : data
    }
}