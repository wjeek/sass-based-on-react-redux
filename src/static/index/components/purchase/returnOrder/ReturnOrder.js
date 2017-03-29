import React from 'react'
import { connect } from 'react-redux'

class ReturnOrder extends React.Component {

    render(){

        return (
            <div>
                <div className="center-east-north">
                    <a className="active">采购退货单</a>
                </div>
                <div className="center-east-center">
                    采购退货单
                </div>
            </div>

        )

    }

}

export default connect(
    state => ({}),
    { }
)(ReturnOrder)
