import React from 'react' ;


class ReactInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue : this.props.initProps ? this.props.initProps.val : ''
        } ;
    }
    handleChange (event){
        this.setState({
            inputValue : event.target.value
        });
    }
    render (){
        var inputValue = this.state.inputValue ;
        return (
            <span key="for" className={"react-component-input" + (this.props.initProps.addClass? ( ' '+this.props.initProps.addClass  ) : '') }>
                <input type="text" ref={this.props.initProps.ref} onChange={ this.handleChange.bind(this) } value={ inputValue } className="input" />
            </span>
        )
    }
}

ReactInput.defaultProps = {
    initProps : {

    }
}

export default ReactInput ;