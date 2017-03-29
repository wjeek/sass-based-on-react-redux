//react
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
//project
import * as reducers from './reducers'
import {
    Header ,
    Tabs ,
    Contents
} from './components'
import 'antd/dist/antd.css';


//combine Reducers with RouterReducer
const reducer = combineReducers({
    ...reducers
})

//createStore
const store = createStore(
    reducer
)

window.globalEvent = {
    register : {}
}

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


ReactDOM.render(

    <Provider store={store} >

        <div className="main">

            <Header> </Header>

            <div className="body">
                
                <div className="body-content">
                    <div className="body-content-wrap" >

                        <Contents> </Contents>
                    </div>
                </div>

            </div>

        </div>

    </Provider>

    ,

    // $('#saas-entry')[0]
    document.getElementById( 'register-entry' )

) ;
