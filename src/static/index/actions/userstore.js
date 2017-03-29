
export function initAuthMessage(data) {
    return {
        type: 'INIT_AUTH_MESSAGE' ,
        data : data
    }
}

export function initAppCityStore(data){
    return {
        type : 'INIT_APP_CITY_STORE' ,
        data : data
    }
}