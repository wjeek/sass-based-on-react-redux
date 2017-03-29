import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Link } from 'react-router'
import {
    Crumbs , Auth ,
} from '../index'

class Base extends React.Component {
    render(){
        return (
            <div className="body-content">

                <Crumbs></Crumbs>

                <div className="center">

                    <div className="center-west">

                        <QueueAnim
                            type="bottom"
                        >

                        {/*<Auth
                            authIndex="33"
                        >*/}
                            <Link key="anime-1" to="/base/b_product" activeClassName="active">库存管理</Link>
                        {/*</Auth>*/}

                        <Auth
                            authIndex="39"
                        >
                            <Link key="anime-2" to="/base/b_customer" activeClassName="active">客户管理</Link>
                        </Auth>

                        <Auth
                            authIndex="45"
                        >
                            <Link key="anime-3" to="/base/b_supplier" activeClassName="active">供应商管理</Link>
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
    ( state ) => {
        return {

        }
    },
    { }
)(Base)
