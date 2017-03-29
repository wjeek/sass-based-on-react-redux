import React from 'react'
import {
    Link
} from 'react-router'
import {
    connect
} from 'react-redux'

class S_Account extends React.Component {
    render(){

        return (

            <div>
                <div className="center-east-north">
                    <Link to="/statistics/s_account/s_c_account" activeClassName="active">账款统计</Link>
                    <Link to="/statistics/s_account/s_c_pay" activeClassName="active">应收应付</Link>
                </div>
                <div className="center-east-center">
                    {this.props.children}
                </div>
            </div>

        )
    }
}


export default connect(
    ( state ) => {
        return {

        }
    } ,
    {}
)( S_Account )