import React from 'react'
import { Link, browserHistory } from 'react-router'
import { push } from 'react-router-redux'
import {
    connect
} from 'react-redux'
import * as service from '../service'
//
import {
    Alert ,
    Spin , Icon ,
} from 'antd/dist/antd.js'
import {
    initAuthMessage
} from '../actions/userstore'
import {
    initSettingsPersonal
} from '../actions/settings'
import utils from '../service/utils/index'
import {
    Auth ,
} from './index'
import {
    USER_NAME,
    TOKEN_NAME
} from '../constants' ;

class App extends React.Component {

    constructor(props){
        super(props) ;
        this.state = {
            userInit : false ,
        } ;
    }
    componentWillMount(){
        //app init
        var token =  utils.cookie.config( USER_NAME ) ;
        var token2 =  utils.cookie.config( TOKEN_NAME ) ;


        if ( !token2  ){
            window.location.href = '/passport/login' ;
            return ;
        }
        // this.props.initAuthMessage(result) ;
        service.userstore.fetchUserInfo_sync({
            id : token ,
        },(result)=>{
            if ( result.mark == '000000000' ){
                if ( result.data.user && result.data.user.permissionIds === null ){
                    result.data.user.permissionIds = [] ;
                }
                if ( result.data.user && ( typeof result.data.user.roleIds === 'string' ) ){
                    try{
                        result.data.user.roleIds = JSON.parse( result.data.user.roleIds ) ;
                    } catch(e) {
                        result.data.user.roleIds = [] ;
                    }
                }
                this.props.initAuthMessage( result.data.user ) ;
                this.setState({
                    userInit : true ,
                }) ;
            } else {
                globalFunction.alert.warning( '用户信息获取失败' , '操作提示' ) ;
                utils.cookie.removeCookie( USER_NAME ,{
                    path : '/'
                } ) ;
                utils.cookie.removeCookie( TOKEN_NAME ,{
                    path : '/'
                } ) ;
                window.location.href = '/passport/login' ;
                return ;
            }
        }) ;
        
        //异步加载所需资源
        
        

    }
    componentDidMount(){

    }
    componentWillUnmount(){

    }
    render(){
        return (
            <div className={"root-content" + ( (this.props.cssNameSpace)? (' ' + this.props.cssNameSpace) : '' )} >
                <header className="header">
                    <i className="sprite-logo_white logo" />
                    <div className="header-content">

                        <Link className="navigation r-home" to="/" activeClassName="active">
                            <i className="sprite-首页white"></i>首页
                        </Link>

                        <Auth authIndex="1">
                            <Link className="navigation" to="/market" activeClassName="active">
                                <i className="sprite-销售white"></i>销售
                            </Link>
                        </Auth>

                        <Auth authIndex="10">
                            <Link className="navigation" to="/purchase" activeClassName="active">
                                <i className="sprite-采购white"></i>采购
                            </Link>
                        </Auth>

                        <Auth
                            authIndex="19 26 31"
                        >
                            <Link className="navigation" to="/account" activeClassName="active">
                                <i className="sprite-账款white"></i>账款
                            </Link>
                        </Auth>


                        {/*<Link className="navigation" to="/statistics" activeClassName="active">
                            <i className="sprite-nav_统计"></i>统计
                        </Link>*/}
                        <a
                            className="navigation r-statistics"
                            onClick={(event)=>{
                                $( 'a.navigation' ).removeClass( 'active' ) ;
                                $( event.target ).addClass( 'active' ) ;
                                if ( globalFunction.authCheck.hasAuth( '51 52 53 54' ) ){
                                    globalStore.dispatch(push('/statistics/s_market/s_a_product')) ;
                                } else if ( globalFunction.authCheck.hasAuth( '55 56 57' ) ){
                                    globalStore.dispatch(push('/statistics/s_purchase/s_b_product'))
                                } else if ( globalFunction.authCheck.hasAuth( '55 56 57' ) ){
                                    globalStore.dispatch(push('/statistics/s_account/s_c_account'))
                                } else if ( globalFunction.authCheck.hasAuth( '58 59' ) ){
                                    globalStore.dispatch(push('/statistics/s_purchase/s_b_product'))
                                } else if ( globalFunction.authCheck.hasAuth( '60' ) ){
                                    globalStore.dispatch(push('/statistics/s_invoicing/s_d_invoicing'))
                                }
                            }}
                        >
                            <i className="sprite-统计white"></i>统计
                        </a>


                        <Link className="navigation" to="/base" activeClassName="active">
                            <i className="sprite-基础white"></i>基础
                        </Link>


                        <Link className="navigation" to="/settings" activeClassName="active">
                            <i className="sprite-设置white"></i>设置
                        </Link>

                    <span className="user">
                        <a className="novice">新手入门</a>
                        {
                            this.state.userInit ? (
                                    <Link className="userwrap" to="/settings/se_account/se_a_personal">
                                        <i className="sprite-个人中心"></i>
                                        {/*<Icon type="user" />*/}
                                        <span className="user-name">{this.props.userstore.user?this.props.userstore.user.account : <a href="/passport/login">登录</a> }</span>

                                        <div className="user-downlist">
                                            <div
                                                className="user-list"
                                                onClick={(event)=>{
                                                    //event.stopPropagation() ;
                                                    event.preventDefault() ;
                                                    utils.cookie.removeCookie( USER_NAME ,{
                                                        path : '/'
                                                    } ) ;
                                                    utils.cookie.removeCookie( TOKEN_NAME ,{
                                                        path : '/'
                                                    } ) ;

                                                    window.location.href = '/passport/login' ;
                                                }}
                                            >
                                                退出
                                            </div>
                                        </div>

                                    </Link>
                            ) : (
                                <a href="/passport/login" className="userwrap">登录</a>
                            )
                        }
                        {
                            this.state.userInit && (
                                <a style={{display:'none'}} className="login-out" onClick={()=>{
                                    //utils.removeCookie( USER_NAME ) ;
                                    var date = new Date();
				                    date.setTime(date.getTime() - 10000);
				                    document.cookie = "s_token=b; expires=" + date.toUTCString()+"; path=/";
				                    //document.cookie = "s_token=a" ;
				                    console.log(document.cookie);
				                    window.location.href = '/passport/login' ;
                                }}>
                                    退出
                                </a>
                            )
                        }

                    </span>

                    </div>

                </header>

                <div className="body">

                    {this.props.children}

                </div>

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

                {/*loading*/}
                <div className="global-element-loading">
                    <Spin size="large" tip="玩命加载中 >_<" />
                </div>

            </div>
        )
    }

}


export default connect((state)=>{
    console.log( state ) ;
    var Arr = state.routing.locationBeforeTransitions.pathname.split('/').filter((v)=>{
        return ( v !== '' ) ;
    }) ;
    // console.log( Arr ) ;
    //增加样式命名空间,防止全局污染
    if ( Arr.length === 0 ){
        $( 'a.navigation' ).removeClass( 'active' ) ;
        $( '.navigation.r-home' ).addClass( 'active' ) ;
    } else {
        $( '.navigation.r-home' ).removeClass( 'active' ) ;
    }
    if ( Arr[0] !== 'statistics' ){
        $( '.navigation.r-statistics' ).removeClass( 'active' ) ;
    }

    return {
        cssNameSpace : Arr[0] ? Arr.shift() + '-namespace' : 'home'  + '-namespace' ,
        userstore : state.userstore ,
        settings : state.settings ,
    }
},{
    initAuthMessage ,
    initSettingsPersonal ,
})(App) ;