import React from 'react'
import {
    Link
} from 'react-router'
import {
    connect
} from 'react-redux'

class S_Invoicing extends React.Component {
    render(){

        return (

            <div>
                <div className="center-east-north">
                    <Link to="/statistics/s_invoicing/s_d_invoicing" activeClassName="active">进销对比</Link>
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
)( S_Invoicing )