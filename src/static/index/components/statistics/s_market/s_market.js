import React from 'react'
import {
    Link
} from 'react-router'
import {
    connect
} from 'react-redux'

class S_Market extends React.Component {
    render(){

        return (

            <div>
                <div className="center-east-north">
                    <Link to="/statistics/s_market/s_a_product" activeClassName="active">按货品</Link>
                    <Link to="/statistics/s_market/s_a_user" activeClassName="active">按客户</Link>
                    <Link to="/statistics/s_market/s_a_market" activeClassName="active">按销售员</Link>
                    <Link to="/statistics/s_market/s_a_sale" activeClassName="active">销售额</Link>
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
)( S_Market )