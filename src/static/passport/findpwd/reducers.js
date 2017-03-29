
const initStore = {
    currentIndex : 1
} ;


export default function next(store = initStore , action ) {
    if ( action.type === 'NEXTTYPE' ){
        return {
            ...store ,
            currentIndex : store.currentIndex + 1
        }
    }
    return {
        ...store
    }
}