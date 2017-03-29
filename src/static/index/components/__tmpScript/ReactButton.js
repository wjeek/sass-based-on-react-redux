import React from 'react'

class ReactButton extends React.Component {
    constructor(prop){
        super(prop) ;
    }
    render (){
        let cx = 'react-component-button' + ( this.props.initProps.addClass ? ( ' ' + this.props.initProps.addClass ) : '' ) ;
        return (
            <span className={cx} onClick={ this.props.initProps.onClick.bind( this ) }>
                <i className={ this.props.initProps.icon }></i>
                <span> {this.props.initProps.text } </span>
            </span>
        )
    }
}

ReactButton.defaultProps = {
    initProps : {

    }
}

export default ReactButton ;