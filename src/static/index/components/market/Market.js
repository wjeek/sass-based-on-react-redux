import React from 'react'
import QueneAnim from 'rc-queue-anim'
import { connect } from 'react-redux'

import { Link } from 'react-router'

import {
    Crumbs
} from '../index'

class Market extends React.Component {
    
    render(){
        return (
            <div className="body-content">
                <Crumbs></Crumbs>
                
                <div className="center"> 
                    
                    <div className="center-west">

                        <QueneAnim
                            type="bottom"
                        >

                        <Link key="anime-1" to="/market/list" activeClassName="active">销售记录</Link>

                        </QueneAnim>

                        {/*<Link to="/market/returnList" activeClassName="active">销售退货记录</Link>*/}
                        
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
        return {
            number: state.count.number
        }
    },
    {  }
)(Market)
