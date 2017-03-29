import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'

class ReactDatepicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment()
        };
    }

    handleChange (date) {
        this.setState({
            startDate: date
        });
    }

    render(){
        return (
            <span key="for" className="react-component-datepicker">
                <DatePicker
                    selected={ this.state.startDate }
                    onChange={ this.handleChange.bind( this ) }
                    dateFormat="YYYY-MM-DD"
                />
                <i></i>
            </span>
        )

    }
}

ReactDatepicker.defaultProps = {
    initProps : {

    }
}

export default ReactDatepicker ;