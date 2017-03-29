import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import QueueAnim from 'rc-queue-anim'
import {
    Crumbs
} from '../index'

class Settings extends React.Component {
    render(){
        return (
            <div className="body-content">

                <Crumbs></Crumbs>

                <div className="center">

                    <div className="center-west">

                        <QueueAnim
                            type="bottom"
                        >

                        <Link key="anime-1" to="/settings/se_account" activeClassName="active">账户信息</Link>

                        <Link key="anime-2" to="/settings/se_team" activeClassName="active">我的团队</Link>

                        {/*<Link key="anime-3" to="/settings/se_log" activeClassName="active">操作日志</Link>*/}

                        <Link key="anime-4" to="/settings/se_feedback" activeClassName="active">意见反馈</Link>

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
    (state) => {
        var settings = state.settings ;
        return {
            settings
        }
    },
    { }
)(Settings)
