import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {
    Crumbs
} from '../index'

class Account extends React.Component {
    render(){
        return (
            <div className="body-content">

                <Crumbs></Crumbs>

                <div className="center">

                    <div className="center-west">

                        <QueueAnim
                            type="bottom"
                        >

                        <Link key="anime-1" to="/account/chargeAccount" activeClassName="active">流水账</Link>

                        <Link key="anime-2" to="/account/checkAccount" activeClassName="active">收付款</Link>

                        </QueueAnim>

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
    ( state ) => {
        return {
            number: state.count.number
        }
    },
    { }
)(Account)
