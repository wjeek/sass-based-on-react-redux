function createArr( item , repeat ){
    repeat = Math.floor( Math.random() * repeat ) ;
    var _tmp = [] ;
    for ( let i = 0 ; i < repeat ; i++ ){
        _tmp.push( item[ Math.floor( Math.random() *  item.length ) ] ) ;
    }
    return _tmp ;
}

export {
    createArr ,

}