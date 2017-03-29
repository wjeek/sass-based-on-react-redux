import React from 'react'
import {
    MobileContent ,
    SuccessContent
} from './index.js' ;
import {
    Alert ,
    Spin , Icon ,
} from 'antd/dist/antd.js'
import { connect } from 'react-redux'
import {
    nextTab
} from '../actions' ;
import utils from '../../../index/service/utils/index'
import {
    USER_NAME ,
    TOKEN_NAME ,
} from '../../../index/constants/index.js'

class Contents extends React.Component {
    constructor( props ){
        super( props ) ;

    }
    componentWillMount(){
        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        } ;
        if ( getUrlParam( 'tabcount' ) == '2' ){
            console.log( utils.cookie.config( USER_NAME ) ) ;
        } else {
            console.log( USER_NAME ) ;
            console.log( TOKEN_NAME ) ;
            utils.cookie.removeCookie( USER_NAME ,{
                path : '/'
            } ) ;
            utils.cookie.removeCookie( TOKEN_NAME ,{
                path : '/'
            } ) ;
        }
    }
    componentDidMount(){
        this.queryParamsInit() ;
    }
    queryParamsInit(params){
        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        } ;
        if ( getUrlParam( 'tabcount' ) == '2' ){
            console.log( utils.cookie.config( USER_NAME ) ) ;
            this.props.nextTab( utils.cookie.config( USER_NAME ) , 'fromLogin' ) ;
        } else {
            console.log( USER_NAME ) ;
            console.log( TOKEN_NAME ) ;
            utils.cookie.removeCookie( USER_NAME ,{
                path : '/'
            } ) ;
            utils.cookie.removeCookie( TOKEN_NAME ,{
                path : '/'
            } ) ;
        }
    }
    render(){
        return (
            <div className="contents">

                <MobileContent></MobileContent>

                <SuccessContent></SuccessContent>

                {/*alert*/}
                <Alert
                    message="success tips"
                    description="Detailed description and advices about successful copywriting."
                    type="success"
                    showIcon
                />
                <Alert
                    message="Informational Notes"
                    description="Additional description and informations about copywriting."
                    type="info"
                    showIcon
                />
                <Alert
                    message="Warning"
                    description="This is a warning notice about copywriting."
                    type="warning"
                    showIcon
                />
                <Alert
                    message="Error"
                    description="This is an error message about copywriting."
                    type="error"
                    showIcon
                />

            </div>
        )
    }
}

export default connect(
    state => ({ currentIndex : state.currentIndex }),
    {
        nextTab
    }
)(Contents)