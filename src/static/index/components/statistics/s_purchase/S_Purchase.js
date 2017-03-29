import React from 'react'
import {
    Link
} from 'react-router'
import {
    connect
} from 'react-redux'

class S_Purchase extends React.Component {
    render(){

        return (

            <div>
                <div className="center-east-north">
                    <Link to="/statistics/s_purchase/s_b_product" activeClassName="active">按货品</Link>
                    <Link to="/statistics/s_purchase/s_b_supplier" activeClassName="active">按供应商</Link>
                    <Link to="/statistics/s_purchase/s_b_purchase" activeClassName="active">按采购员</Link>
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
)( S_Purchase )