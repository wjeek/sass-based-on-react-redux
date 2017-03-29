import React from 'react' ;
import className from 'classnames' ;

class ReactSelect extends React.Component {
    constructor(props) {
        super(props);
        let nam = props.initProps.val ;
        props.initProps.options.forEach((v)=>{
            if ( v.value === nam ){
                nam = v.name ;
            }
        }) ;
        this.state = {
            isShow : false ,
            val : props.initProps.val ,
            nam : nam
        } ;
    }
    handleSelectClick (){
        let isShow = this.state.isShow ;
        this.setState({
            isShow : !isShow
        }) ;
    }
    handleOptionsClick (event){
        let value = event.target.attributes.value.value ;
        let nam = value ;
        this.props.initProps.options.forEach((v)=>{
            if ( v.value === nam ){
                nam = v.name ;
            }
        }) ;
        this.setState({
            isShow : false ,
            val : value ,
            nam : nam
        }) ;
    }
    render(){
        let value = this.props.initProps ;
        let selectVal = this.state.val ;
        let isShow = this.state.isShow ;
        let optioner = value.options.map((v,i)=>{
            let cx = className({
                option : true ,
                selected : ( v.value === selectVal )
            }) ;
            return (
                <li className={ cx } value= { v.value } key= { i } onClick={ this.handleOptionsClick.bind(this) } > { v.name } </li>
            ) ;
        }) ;
        let optionsWrapCx = className({
            'option-wrap' : true ,
            'show' : isShow
        }) ;
        let componentSpan = className({
            'select-wrap' : true ,
            'show' : isShow
        })
        return (
            <span key="for" className="react-component-select">
                <span className={componentSpan} onClick={ this.handleSelectClick.bind(this) }>
                    <span className="select"> { this.state.nam } </span>
                    <i className="select-state"></i>
                </span>
                <ul className={optionsWrapCx}>
                    {
                        optioner
                    }
                </ul>
            </span>
        )
    }
}

ReactSelect.defaultProps = {
    initProps : {

    }
}

export default ReactSelect ;