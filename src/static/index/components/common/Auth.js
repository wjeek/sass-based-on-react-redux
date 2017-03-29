import React from 'react'
import { connect } from 'react-redux'

class Auth extends React.Component{
    constructor(props){
        super(props) ;
        this.state = {
            // auth : this.props.auth ? this.props.auth.split('|').map(function (v) {
            //     return v.replace(/(^\s*)|(\s*$)/g,'');
            // }) : [] , //   1 | 9 | 11
            authIndex : this.props.authIndex ? this.props.authIndex : '' ,
        }
    }
    __findCurrentAuth(){
        if ( this.props.userstore.user && this.props.userstore.user.permissionIds ){
            return this.props.userstore.user.permissionIds ;
        } else {
            return [] ;
        }
        // return this.props.userstore.user || {
        //     auth : []
        // };
    }
    __canOperation(){
        var authArr = this.state.authIndex.split(' ')  ; //本控件auth值
        var authList = (this.__findCurrentAuth() ? this.__findCurrentAuth() :[] ).map(function (v) {
            return v + '' ;
        }) ; //本用户具有的权限列表
        var flag = false ;
        authArr.forEach((v)=>{
            if ( authList.indexOf( v + '' ) > -1 ){
                flag = true ;
            }
        }) ;
        return flag ;
    } 
    render(){

        return (
            this.__canOperation() ?　(

            this.props.children

            )　:　(
                <span style={{display:"none"}}>permission forbidden</span>
            )
        )
    }
}

Auth.defaultProps = {
    
}

export default connect(
    ( state ) => {
        var userstore = state.userstore ;
        return {
            userstore
        }
    },
    {
        
    }
)(Auth)