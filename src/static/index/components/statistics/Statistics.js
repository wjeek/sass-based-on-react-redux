import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import QueueAnim from 'rc-queue-anim'
import {
    Crumbs , Auth ,
} from '../index'

class Statistics extends React.Component {
    render(){
        return (
            <div className="body-content">

                <Crumbs></Crumbs>

                <div className="center">

                    <div className="center-west">

                        <QueueAnim
                            type="bottom"
                        >

                        <Auth
                            authIndex="51 52 53 54"
                        >
                            <Link to="/statistics/s_market" activeClassName="active" key="anime-1">销售统计</Link>
                        </Auth>

                        <Auth
                            authIndex="55 56 57"
                        >
                            <Link to="/statistics/s_purchase" activeClassName="active" key="anime-2">采购统计</Link>
                        </Auth>

                        <Auth
                            authIndex="58 59"
                        >
                            <Link to="/statistics/s_account" activeClassName="active" key="anime-3">账款统计</Link>
                        </Auth>

                        <Auth
                            authIndex="60"
                        >
                            <Link to="/statistics/s_invoicing" activeClassName="active" key="anime-4">进销对比</Link>
                        </Auth>

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
    state => {
        return {
            number: state.count.number
        }
    } ,
    { }
)(Statistics)
