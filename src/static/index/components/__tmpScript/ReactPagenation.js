import React from 'react'
import {
    ReactSelect ,
    ReactInput
} from '../index.js'
import className from 'classnames'

var props = {
    ref : 'selectRef' ,
    val : 10　,
    options : [{
        name : '10' ,
        value : 10
    },{
        name : '20' ,
        value : 20
    },{
        name : '30' ,
        value : 30
    }]
} ;


class ReactPagenation extends React.Component{
    constructor(props = props) {
        super(props) ;
    }
    __renderPages (props){
        let __truePages = (props)=>{
            let index = props.current ;
            let total = props.total ;
            let arr = [] ;
            if ( index <= 5 ){
                for ( let i = 1 ; i < index ; i++){
                    arr.push({
                        name : i + '' ,
                        value : i
                    }) ;
                }
            } else if ( index > 5 ){
                arr.push({
                    name : '1' ,
                    value : 1
                },{
                    name : '...'
                }) ;
                for ( let i= index-3 ; i < index ; i++ ){
                    arr.push({
                        name : i + '' ,
                        value : i
                    })
                }
            }
            arr.push({
                name : index + '' ,
                value : index
            })
            if ( index >= total - 4 ){
                for ( let i = total - 3 ; i <= total ; i++){
                    arr.push({
                        name : i + '' ,
                        value : i
                    }) ;
                }
            } else if ( index < total - 4 ){
                for ( let i= index + 1 ; i < index + 4 ; i++ ){
                    arr.push({
                        name : i + '' ,
                        value : i
                    })
                }
                arr.push({
                    name : '...'
                },{
                    name : total + '' ,
                    value : total
                }) ;
            }
            var a = arr.map((v,i)=>{
                let cx = className({
                    midPage : true ,
                    'r-page' : true ,
                    current : ( v.value === props.current )
                }) ;
                return (
                    <a ref={v.value} key={i} className={cx} value={v.value}
                        onClick={this._handleClick.bind(this)}
                    >{v.name}</a>
                ) ;
            }) ;
            let prCx = className({
                prevPage : true ,
                'r-page' : true ,
                'disable' : ( props.current === 1 )
            }) ;
            let nxCx = className({
                nextPage : true ,
                'r-page' : true ,
                'disable' : ( props.current === props.total )
            }) ;
            return [
                <a className={prCx} key="prevPage"
                    value={props.current !== 1?(props.current-1):undefined}
                    onClick={this._handleClick.bind(this)}
                >&lt;</a> ,
                ...a ,
                <a className={nxCx} key="nextPage"
                    value={props.current !== props.total?(props.current+1):undefined}
                    onClick={this._handleClick.bind(this)}
                >&gt;</a>
            ] ;

        }
        return (
            <span>
                { __truePages(props) }
            </span>
        )
    }
    _handleClick(event){
        if ( event.target.attributes.value && event.target.attributes.value.value ){
            alert(event.target.attributes.value.value) ;
        }
    }
    _pageSubmit(event){
        var val = $( 'input' , $(this.refs._input) ).val() ;
        if ( !!val ){
            alert(val) ;
        }
    }
    render(){
        return (

            <div className="react-component-pagenation">
                {/*<span>
                    <span>每页</span>
                    <span>
                        <ReactSelect initProps={this.props}></ReactSelect>
                    </span>
                    <span>条</span>
                </span>*/}

                <span className="right-page">
                    
                    <span className="pages">
                        {
                            this.__renderPages(this.props)
                        }
                    </span>

                    <span className="pages-total">
                        共<span>{this.props.total}</span>页
                    </span>

                    <span className="pages-go" ref="_input">
                        到第
                        <ReactInput initProps={{
                            addClass : 'pageSubmit',
                            label : '' ,
                            type : 'input' ,
                            ref : 'inputRef'　,
                            val : (this.props.current)
                        }}></ReactInput>
                        页
                        <a className="confirm" onClick={this._pageSubmit.bind(this)}>确定</a>
                    </span>
                    
                </span>
            </div>

        )
    }

}

ReactPagenation.defaultProps = {
    total : 90 ,
    current : 6
} ;

export default ReactPagenation ;