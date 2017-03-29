import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'

import { Link } from 'react-router'

import {
    Crumbs
} from '../index'


class Purchase extends React.Component {
    render(){
        return (

            <div className="body-content">

                <Crumbs></Crumbs>

                <div className="center" >

                    <div className="center-west">

                        <QueueAnim
                            type="bottom"
                        >

                        <Link key="anime-1" to="/purchase/order" activeClassName="active">采购单</Link>

                        </QueueAnim>

                        {/*<Link to="/purchase/returnOrder" activeClassName="active">采购退货单</Link>*/}

                    </div>

                    <div className="center-east">

                        {this.props.children}

                    </div>

                </div>

            </div>

        )
    }
}

export default connect(
    () => {
        return {}
    },
    {  }
)(Purchase)
