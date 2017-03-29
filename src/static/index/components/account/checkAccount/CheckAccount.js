import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class CheckAccount extends React.Component {

    render(){

        return (

            <div>

                <div className="center-east-north">

                    <Link to="/account/checkAccount/user" activeClassName="active">收款</Link>

                    <Link to="/account/checkAccount/supplier" activeClassName="active">付款</Link>

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
        return{ }
    } ,
    { }
)(CheckAccount)
