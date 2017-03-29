//react
import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css';
import {
    Button , Pagination , Select , Input , DatePicker , Table , Form , Modal ,Switch,Alert,
    Upload ,Radio,
    Row , Col ,
    Icon
} from 'antd/dist/antd.js'

import {
    Header
} from '../register/components'
import cx from 'classnames' ;
import * as dao from '../register/service/dao'

import {
    TOKEN_NAME ,
    USER_NAME,
    TENANT_ID,
    POST_TYPE
} from '../../index/constants'
import utils from '../../index/service/utils/index.js'
let POST_TYPE_MAP_ARREY = POST_TYPE.map((v)=>{
    return {
        label : v.name ,
        value : v.value
    }
}) ;

// console.log( utils ) ;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class Login extends React.Component{
    constructor(props){
        super(props) ;
        this.state = {
            visible: false,
            errorCount: 0,
            valid:{
                phone: false,
                code: true,
                password: false,
            },
            tips:{
                canPass: 0,
                code: 0,
                loginPhone : ''
            },
            roleModal:{
                role : [1],
                roleUser : '' ,
            }
        }
    }

    componentDidMount(){
        $('body').attr('onkeydown', 'if (event.keyCode==13) { document.getElementsByClassName("btn_submit")[0].click();event.returnValue = false;}')
    }

    verifyPhoneCode(){
        let phone=this.refs.phone.refs.input.value.replace(/\s+/g,"");
        dao.verifyPhoneCode({
            phone : phone
        },(message)=>{
            console.log(message);
        });
    }
    checkLogin(){
        var _utils = utils ;
        let phone=this.refs.phone;
        let code=this.refs.code||'';
        let password=this.refs.password;
        dao.login({
            account : phone.refs.input.value ,
            password : password.refs.input.value ,
        },(message)=>{
            console.log(message);
            if( message.mark == '000000000' ){
                _utils.cookie.config( USER_NAME , message.data.user.id ,{
                    'path': '/' ,
                    'expires' : 100 ,
                    // domain : ''
                } ) ;
                _utils.cookie.config( TOKEN_NAME , message.data.user.token ,{
                    'path': '/' ,
                    'expires' : 100 ,
                    // domain : ''
                } ) ;
                // if (message.data.user.tenantId){
                //     _utils.cookie.config( TENANT_ID , message.data.user.tenantId ,{
                //         'path': '/' ,
                //         'expires' : 100 ,
                //         // domain : ''
                //     } ) ;
                // }
                // else {
                //     _utils.cookie.config( TENANT_ID , '252' ,{
                //         'path': '/' ,
                //         'expires' : 100 ,
                //         // domain : ''
                //     } ) ;
                // }
                if ( message.data.user.roleIds.length === 0 || !message.data.user.tenantId ){
                    this.setState({
                        roleModal:{
                            ...this.state.roleModal ,
                            roleUser : message.data.user.id ,
                        }
                    }) ;
                    // this.showModal() ;
                    window.location.href = '/passport/register?tabcount=2' ; //注册页index 2
                } else {
                    window.location.href = "/" ;
                }
            } else if ( message == 2 ){

                this.initLoginModal(message);
                this.showModal();

            }else{

                this.setState({
                    ...this.state,
                    errorCount:this.state.errorCount+1,
                    tips:{
                        ...this.state.tips,
                        loginPhone: 2
                    }
                });
                console.log(this.state.errorCount);
                if(this.state.errorCount>=3){
                    this.setState({
                        ...this.state,
                        errorCount:this.state.errorCount+1,
                        valid:{
                            ...this.state.valid,
                            code: false
                        }
                    });
                }
            }
        });
    }

    //体验登陆
    testLogin(value){
        var _utils = utils ;
        var account = '';
        if(value == 1){
            account = '18512345670';
        }
        else if(value == 2){
            account = '18512345671';
        }
        else if(value == 3){
            account = '18512345672';
        }
        else if(value == 4){
            account = '18512345673';
        }
        else{
            return;
        }
        dao.login({
            account : account ,
            password : '123456' ,
        },(message)=>{
            console.log(message);
            if( message.mark == '000000000' ){
                _utils.cookie.config( USER_NAME , message.data.user.id ,{
                    'path': '/' ,
                    'expires' : 100 ,
                    // domain : ''
                } ) ;
                _utils.cookie.config( TOKEN_NAME , message.data.user.token ,{
                    'path': '/' ,
                    'expires' : 100 ,
                    // domain : ''
                } ) ;
                if (message.data.user.tenantId){
                    _utils.cookie.config( TENANT_ID , message.data.user.tenantId ,{
                        'path': '/' ,
                        'expires' : 100 ,
                        // domain : ''
                    } ) ;
                }
                else {
                    _utils.cookie.config( TENANT_ID , '252' ,{
                        'path': '/' ,
                        'expires' : 100 ,
                        // domain : ''
                    } ) ;
                }
                window.location.href = "/" ;


            } else if ( message == 2 ){

                this.initLoginModal(message);
                this.showModal();

            }else{

                this.setState({
                    ...this.state,
                    errorCount:this.state.errorCount+1,
                    tips:{
                        ...this.state.tips,
                        loginPhone: 2
                    }
                });
                console.log(this.state.errorCount);
                if(this.state.errorCount>=3){
                    this.setState({
                        ...this.state,
                        errorCount:this.state.errorCount+1,
                        valid:{
                            ...this.state.valid,
                            code: false
                        }
                    });
                }
            }


        });
    }

    showModal() {
        this.setState({
            visible: true,
        });
    }
    handleOk() {
        dao.changeRole({
            "usersParameter" : {
                id : this.state.roleModal.roleUser ,
                roleIds : this.state.roleModal.role ,
            }
        },(result)=>{
            // this.setState({
            //     ...this.state,
            //     visible: false,
            // });
            if ( result.mark === '000000000' ){
                window.location.href = "/" ;
            } else {
                alert( '更改用户角色失败, 请检查网络连接' ) ;
            }
        });

    }
    handleCancel() {
        this.setState({
            visible: false
        });
    }

    validPhone(event){
        let phone=event.target.value.replace(/\s+/g,"");
        let length=phone.length;
        let myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if(length>0&&(myreg.test(phone))){
            this.setState({
                ...this.state,
                valid:{
                    ...this.state.valid,
                    phone: true,
                }
            });
        }else{
            this.setState({
                ...this.state,
                valid:{
                    ...this.state.valid,
                    phone: false,
                }
            });
        }
    }
    validPassword(event){
        let password=event.target.value.replace(/\s+/g,"");
        let length=password.length;
        if(length>5&&length<19){
            this.setState({
                ...this.state,
                valid:{
                    ...this.state.valid,
                    password: true,
                }
            });
        }else{
            this.setState({
                ...this.state,
                valid:{
                    ...this.state.valid,
                    password: false,
                }
            });
        }
    }
    validCode(event){
        let code=event.target.value.replace(/\s+/g,"");
        let length=code.length;
        if(length>0){
            this.setState({
                ...this.state,
                valid:{
                    ...this.state.valid,
                    code: true,
                }
            });
        }else{
            this.setState({
                ...this.state,
                valid:{
                    ...this.state.valid,
                    code: false,
                }
            });
        }
    }
    render(){
        var classes = cx({
            'example' : true ,
            'verification' : true ,
            'showCode' : ( this.state.errorCount　>=　3? true : false )
        }) ;
        return (
            <div className="login">
                <div className="login-title">用户登录</div>
                <div className="example phone">
                <span>
                    <Input size="large" ref="phone" placeholder="手机号码" className="number phoneText" onChange={this.validPhone.bind(this)}/>
                    <i className="sprite-user"></i>
                    {this.state.tips.loginPhone==1?<span className="mobileMsg">手机号不存在</span>:''}
                </span>
                </div>
                <div className="example pwd">
                <span>
                    <Input size="large" ref="password" type="password" placeholder="密码" className="number" onChange={this.validPassword.bind(this)}/>
                    <i className="sprite-password"></i>
                    {this.state.tips.loginPhone==2?<span className="mobileMsg">账户或密码不正确</span>:''}
                </span>
                </div>
                <div className={classes}>
                <span >
                    <Input size="large" ref="code" placeholder="验证码" className="code" onChange={this.validCode.bind(this)}/>
                    <Button onClick={this.verifyPhoneCode.bind(this)} type="primary" size="large" className="getcode">发送验证码</Button>
                </span>
                </div>
                <div className="example agree">
                    <label htmlFor="rememberMe" className="remember">
                        <input className="sprite-ico_check" id = "rememberMe" ref="confirm" type="checkbox"/>
                        <span className="rem">记住我
                            <div className="point">
                            <i></i>
                            <span>为了您的信息安全，请不要在网吧或公共电脑上使用此功能！</span>
                            </div>
                        </span>
                    </label>
                </div>
                <div className="example submit">
                    {this.state.valid.phone&&this.state.valid.code&&this.state.valid.password?<Button type="primary" size="large" className="btn_submit" onKeyUp={(e)=>{console.log(1)}} onClick={this.checkLogin.bind(this)}>登录</Button>:<Button type="primary" size="large" className="btn_submit" disabled>登录</Button>}
                    <Modal ref="modal"
                           visible={this.state.visible}
                           title="提示"
                           onOk={this.handleOk.bind(this)}
                           onCancel={this.handleCancel.bind(this)}
                           footer={[
                               <Button key="back" type="ghost" size="large" onClick={this.handleCancel.bind(this)}>返 回</Button>,
                               <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk.bind(this)}>
                                   确 定
                               </Button>,
                           ]}
                    >
                        <Alert message="您尚未设定自己的角色, 请选择一个角色。" type="warning" className="alter"/>
                        <span className="join"><strong>选择角色</strong></span>
                        <div className="horizontal"></div>
                        <div className="character">
                            <RadioGroup
                                onChange={(event)=>{
                                    var tarID = event.target.value;
                                    console.log(this.state);
                                    this.setState({
                                        roleModal : {
                                            ...this.state.roleModal ,
                                            role : typeof tarID === 'undefined' ? [] : [ tarID-0 ] ,
                                        }
                                    })
                                }}
                                value={this.state.roleModal.role[0]}>
                                {
                                    POST_TYPE_MAP_ARREY.map((v,i)=> {
                                        return <RadioButton value={v.value} key={i}>{v.label}</RadioButton>
                                    })
                                }
                            </RadioGroup>
                        </div>
                    </Modal>
                </div>

                <div className="example agree">
                    <a className="info-forget" href="/passport/findpwd">忘记密码?</a>
                    <a className="info-register" href="/passport/register">注册</a>
                </div>
                {
                    /*<div>
                    <span className="viplogin" style={{float:'left'}}>
                        <i className="sprite-ico_login_m"></i>
                        &nbsp;
                        <span>体验：</span>
                        <a className="info" style={{display:'inline-block'}} onClick={()=>{
                            this.testLogin(1)
                        }}>老板 </a>&nbsp;
                        <a className="info" style={{display:'inline-block'}} onClick={()=>{
                            this.testLogin(2)
                        }}>财务 </a>&nbsp;
                        <a className="info" style={{display:'inline-block'}} onClick={()=>{
                            this.testLogin(3)
                        }}>销售 </a>&nbsp;
                        <a className="info" style={{display:'inline-block'}} onClick={()=>{
                            this.testLogin(4)
                        }}>采购 </a>&nbsp;
                    </span>
                    <span className="viplogin">
                        <i className="sprite-ico_login_m"></i>
                        <a className="info" href="/passport/register">会员注册 </a>
                    </span>
                    </div>*/
                }

            </div>

        )
    }
}

ReactDOM.render(

    <div className="main">

        <Header></Header>

        <div className="body">

            <div className="body-content">

                {/*<img src="" alt="西狮进销存" className="login-img"/>*/}

                <Login></Login>

            </div>

        </div>

    </div>

    ,

    document.getElementById( 'login-entry' )

) ;
