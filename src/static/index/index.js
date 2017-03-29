//base system

//dev tools
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'
//react
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers , applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router'
import { syncHistoryWithStore, routerReducer , routerMiddleware } from 'react-router-redux'
//project
import * as reducers from './reducers'
import {
    App ,
    NotFound ,
    Home , //首页
    Purchase , //采购
    Order ,
    ReturnOrder ,
    Market, //销售
    List ,
    ReturnList ,
    Account , //账款
    ChargeAccount ,
    CheckAccount ,
    Supplier ,
    User ,
    Base , //基础
    B_Product ,
    B_Customer ,
    B_Supplier ,
    Statistics , //统计

    S_Market ,
    S_A_Product ,
    S_A_User ,
    S_A_Market ,
    S_A_Sale ,

    S_Purchase ,
    S_B_Product ,
    S_B_Supplier ,
    S_B_Purchase ,

    S_Account ,
    S_C_Account ,
    S_C_Pay ,
    S_Invoicing ,
    S_D_Invoicing ,
    Settings , //设置
    Se_Account ,
    Se_A_Personal ,
    Se_A_Company ,
    Se_A_Personaledit ,
    Se_A_Companyedit ,
    Se_Team ,
    Se_Log ,
    Se_Feedback ,
    /*COMMON COMPONENTS*/
    Layer ,
    Auth ,
} from './components'
import {
    Modal
} from 'antd/dist/antd.js'

//antd style
import 'antd/dist/antd.css';


//获取货品类别 SACTGY001
//删除货品类别 SACTGY003
//增加货品类别 SACTGY002
//查询货品品牌 SABRND001
//增加..品牌         002
//删除..品牌         003


//dev tools
const DevTools = createDevTools(
    <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
        <LogMonitor theme="tomorrow" preserveScrollTop={false} />
    </DockMonitor>
)
// combine Reducers with RouterReducer
const reducer = combineReducers({
    ...reducers ,
    routing: routerReducer
})
//createStore
const rouMiddleware = routerMiddleware(browserHistory) ; //router action and reducer
const store = createStore(
    reducer,
    applyMiddleware(rouMiddleware) ,
    // DevTools.instrument()
)

window.globalStore = store ;
window.globalEvent = {
    home : {},
    market : {} ,
    purchase : {} ,
    account : {} ,
    statistics : {} ,
    base : {} ,
    settings : {}
}
//global libs
window.version.saasApp =  '1110_0.1.0' ;
window.globalFunction = {
    authCheck : {
        hasAuth : function (authData) {
            var flag = false ;
            if ( globalStore.getState().userstore.user ){
                var authArr = [] ;
                if ( typeof authData === 'string' ){
                    authArr = authData.split(' ') ;
                } else {
                    authArr = authData ;
                }
                var userAuthList =  globalStore.getState().userstore.user.permissionIds.map((v)=>{
                        return v + '' ;
                    }) || [] ;
                authArr.forEach((v)=>{
                    if ( userAuthList.indexOf( v + '' ) > -1 ){
                        flag = true ;
                    }
                }) ;
            }
            return flag ;
        } ,
    } ,
    alert : {
        _getHeight : function($el){
            return $el.clientHeight ;
        },
        _getWidth : function ($el) {
            return $el.clientWidth ;
        },
        _show : function( $el ){
            $el.css({
                display : 'inline-block' ,
                position : 'fixed' ,
                top : (this._getHeight( document.body ) )/2 - 150 ,
                left : (this._getWidth( document.body ) - $el.width() )/2
            }) ;
            setTimeout(function(){
                $el.css({
                    display : 'none'
                }) ;
            },3000) ;
        },
        success : function (message,title) {
            var $el = $( '.ant-alert-success.ant-alert-with-description' ) ;
            if ( typeof title !== 'undefined' ){
                $( '.ant-alert-message' , $el ).text( title ) ;
            }
            if ( typeof message !== 'undefined' ){
                $( '.ant-alert-description' , $el ).text( message ) ;
            }
            this._show( $el ) ;
        },
        info : function (message,title) {
            var $el = $( '.ant-alert-info.ant-alert-with-description' ) ;
            if ( typeof title !== 'undefined' ){
                $( '.ant-alert-message' , $el ).text( title ) ;
            }
            if ( typeof message !== 'undefined' ){
                $( '.ant-alert-description' , $el ).text( message ) ;
            }
            this._show( $el ) ;
        },
        warning : function (message,title) {
            var $el = $( '.ant-alert-warning.ant-alert-with-description' ) ;
            if ( typeof title !== 'undefined' ){
                $( '.ant-alert-message' , $el ).text( title ) ;
            }
            if ( typeof message !== 'undefined' ){
                $( '.ant-alert-description' , $el ).text( message ) ;
            }
            this._show( $el ) ;
        },
        error : function (message,title) {
            var $el = $( '.ant-alert-error.ant-alert-with-description' ) ;
            if ( typeof title !== 'undefined' ){
                $( '.ant-alert-message' , $el ).text( title ) ;
            }
            if ( typeof message !== 'undefined' ){
                $( '.ant-alert-description' , $el ).text( message ) ;
            }
            this._show( $el ) ;
        },
        //loading
        show_loading : function () {
            var $el = $('.global-element-loading') ;
            if ( $el.css( 'display' ) === 'none'  ){
                $el.css({
                    display : 'block'
                }) ;
                $el.find( '.ant-spin' ).css({
                    top : ( this._getHeight( document.body )/2 - 100 ) ,
                    left : ( this._getWidth( document.body ) - 32 )/2
                }) ;
            }
        },
        hide_loading : function () {
            var $el = $('.global-element-loading') ;
            $el.hide() ;
        },
    }
}

//hash history sync to store
const history = syncHistoryWithStore(browserHistory, store) ;

ReactDOM.render(

    
    <Provider store={store}>
        <div className="root-con">
            <Router history={history}>
                <Route path="/" component={App}>
                    <IndexRoute component={Home} />
                    <Redirect from="market" to="/market/list" />
                    <Redirect from="purchase" to="/purchase/order" />
                    <Redirect from="account" to="/account/chargeAccount" />
                    <Redirect from="base" to="/base/b_product" />
                    <Redirect from="statistics" to="/statistics/s_market/s_a_product" />
                    <Redirect from="settings" to="/settings/se_account/se_a_personal" />
                    <Route path="market" component={Market} >
                        <Route path="list" component={List} />
                        <Route path="returnList" component={ReturnList} />
                    </Route>
                    <Route path="purchase" component={Purchase} >
                        <Route path="order" component={Order} />
                        <Route path="returnOrder" component={ReturnOrder} />
                    </Route>
                    <Route path="account" component={Account} >
                        <Redirect from="/account/checkAccount" to="/account/checkAccount/user" />
                        <Route path="chargeAccount" component={ChargeAccount} />
                        <Route path="checkAccount" component={CheckAccount} >
                            <Route path="user" component={User} />
                            <Route path="supplier" component={Supplier} />
                        </Route>
                    </Route>
                    <Route path="statistics" component={Statistics} >
                        <Redirect from="/statistics/s_market" to="/statistics/s_market/s_a_product" />
                        <Redirect from="/statistics/s_purchase" to="/statistics/s_purchase/s_b_product" />
                        <Redirect from="/statistics/s_account" to="/statistics/s_account/s_c_account" />
                        <Redirect from="/statistics/s_invoicing" to="/statistics/s_invoicing/s_d_invoicing" />
                        <Route path="s_market" component={S_Market} >
                            <Route path="s_a_product" component={S_A_Product} />
                            <Route path="s_a_user" component={S_A_User} />
                            <Route path="s_a_market" component={S_A_Market} />
                            <Route path="s_a_sale" component={S_A_Sale} />
                        </Route>
                        <Route path="s_purchase" component={S_Purchase} >
                            <Route path="s_b_product" component={S_B_Product} />
                            <Route path="s_b_supplier" component={S_B_Supplier} />
                            <Route path="s_b_purchase" component={S_B_Purchase} />
                        </Route>
                        <Route path="s_account" component={S_Account} >
                            <Route path="s_c_account" component={S_C_Account} />
                            <Route path="s_c_pay" component={S_C_Pay} />
                        </Route>
                        <Route path="s_invoicing" component={S_Invoicing} >
                            <Route path="s_d_invoicing" component={S_D_Invoicing} />
                        </Route>
                    </Route>
                    <Route path="base" component={Base} >
                        <Route path="b_product" component={B_Product} />
                        <Route path="b_customer" component={B_Customer} />
                        <Route path="b_supplier" component={B_Supplier}></Route>
                    </Route>
                    <Route path="settings" component={Settings} >
                        <Redirect from="/settings/se_account" to="/settings/se_account/se_a_personal" />
                        <Route path="se_account" component={Se_Account} >
                            <Route path="se_a_personal" component={Se_A_Personal} />
                            <Route path="se_a_company" component={Se_A_Company} />
                            <Route path="se_a_personaledit" component={Se_A_Personaledit} />
                            <Route path="se_a_companyedit" component={Se_A_Companyedit} />
                        </Route>
                        <Route path="se_team" component={Se_Team} />
                        <Route path="se_log" component={Se_Log} />
                        <Route path="se_feedback" component={Se_Feedback} />
                    </Route>
                    <Route path="404" component={NotFound} />
                </Route>
            </Router>

            { /* <DevTools /> */ }

            {/*<Modal title="第一个 Modal" visible={false}
            >
                <p>对话框的内容</p>
                <p>对话框的内容</p>
                <p>对话框的内容</p>
            </Modal>*/}



        </div>

    </Provider>

    ,

    // $('#saas-entry')[0]
    document.getElementById( 'saas-entry' )

) ;
