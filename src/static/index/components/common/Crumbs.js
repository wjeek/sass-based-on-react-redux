import React from 'react' ;
import {
    connect
} from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import {
    ROUTE_NAME_MAP
} from '../../constants'
import {
    Icon ,
} from 'antd/dist/antd.js'

class Crumbs extends React.Component {
    render(){
        let routerNameMap = Object.assign({},ROUTE_NAME_MAP) ;
        let crumbArr = this.props.crumbArr.concat([]) ;
        if ( crumbArr.length === 0 ){
            crumbArr.push( 'home' ) ;
        }
        let length = crumbArr.length ;
        var arr = [] ;

        crumbArr.map((v,i) => {
            if ( routerNameMap[v] ){
                arr.push(
                    <span
                        className={i===0?"crumbs-d cru-span":"crumbs-l cru-span"}
                        key={i}
                    >
                        {routerNameMap[v].name}
                    </span>
                ) ;
                routerNameMap = routerNameMap[v].child ;
                if ( i !== length - 1 ){
                    arr.push(
                        <span key={i + '_' + i} className="cru-span cru-gt">
                            <Icon type="right" />
                        </span>
                    )
                }
                //<span key={i + '_' + i} className="cru-span cru-gt">&gt;</span>
            }
        }) ;

        return (
            <span className="crumbs">

                <QueueAnim
                    type={['right','left']}
                    leaveReverse={true}
                >

                {
                    arr
                }

                </QueueAnim>

            </span>
        )
    }
    
}

export default connect(
    (state)=>{
        var crumb = state.routing.locationBeforeTransitions.pathname ;
        var crumbArr = crumb.split('/').filter((v)=>{
            return ( v !== '' ) ;
        }) ;
        return {
            crumbArr : crumbArr
        }
    }
)(Crumbs) ;