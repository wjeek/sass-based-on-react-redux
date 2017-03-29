import React from 'react' ;


class ReactText extends React.Component {
    render (){
        var value = this.props.initProps ;
        return (
            <span key="for" className="react-component-text">
               <span title={ value.val } > { value.val } </span>
            </span>
        )
    }
}

ReactText.defaultProps = {
    initProps : {

    }
}

export default ReactText ;