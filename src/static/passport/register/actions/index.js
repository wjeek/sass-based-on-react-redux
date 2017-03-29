import { NEXTTAB } from '../constants'

//action导致tab切换

export function nextTab(data, prevState) {
    return {
        type: NEXTTAB ,
        data : data ,
        prevState : prevState ,
    }
}
