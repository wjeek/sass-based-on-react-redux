import React from 'react' ;
import { connect } from 'react-redux' ;
import cx from 'classnames' ;
import {
    nextTab
} from '../actions' ;
import * as dao from '../service/dao' ;
import {
    Button , Pagination , Select , Input , DatePicker , Table , Form , Modal ,
    Upload ,
    Row , Col ,
    Icon
} from 'antd/dist/antd.js'
import {
    TOKEN_NAME ,
    USER_NAME
} from '../../../index/constants'
import utils from '../../../index/service/utils/index'

class MobileContent extends React.Component{
    constructor(props){
        super(props) ;
        this.state = {
            visible1: false,
            valid:{
                phone: false,
                code: false,
                password: false,
                isAgree: false
            },
            tips:{
                mobile: 0,
                code: 0,
                password: 0,
                noSend : '发送验证码'
            },
            calculateSecond: (value)=>{
                var second = value.data || 120;
                var noSend;
                var that = this;
                var send = setInterval(function () {
                    if(second > 0){
                        second = second - 1 ;
                        noSend = '重新发送(' +  second + ')';
                        that.setState({
                            valid:{
                                ...that.state.valid,
                                phone : false
                            },
                            tips:{
                                ...that.state.tips ,
                                noSend : noSend
                            }
                        } )
                    }
                    else{
                        that.setState({
                            valid:{
                                ...that.state.valid,
                                phone : true
                            }
                        } );
                        clearInterval(send);
                    }
                }, 1000 )
            }
        }
    }

    componentDidMount(){
        globalEvent.register.calculateSecond = new signals.Signal() ;
        globalEvent.register.calculateSecond.add(this.state.calculateSecond) ;
    }
    
    showModal1(){
        this.setState({
            ...this.state,
            visible1: true,
        });
    }
    handleOk1() {
        this.setState({
            ...this.state,
            visible1: false,
        });
    }
    isAgreed(event){
        let agreeVaule=event.target.checked;
        if(agreeVaule){
            this.setState({
                ...this.state,
                valid:{
                    ...this.state.valid,
                    isAgree: true,
                }
            });
        }else{
            this.setState({
                ...this.state,
                valid:{
                    ...this.state.valid,
                    isAgree: false,
                }
            });
        }
    }
    isPhoneValid(event){
        let phone=event.target.value.replace(/\s+/g,"");
        let phLength=phone.length;
        let myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if(phLength==0){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    mobile: 0
                },
                valid:{
                    ...this.state.valid,
                    phone: false,
                }
            });
        }else if(phLength>0&&(!myreg.test(phone))){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    mobile: 2
                },
                valid:{
                    ...this.state.valid,
                    phone: false,
                }
            });
        }else{
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    mobile: 0
                },
                valid:{
                    ...this.state.valid,
                    phone: true,
                }
            });
        }
    }
    isCodeValid(event){
        let code=event.target.value.replace(/\s+/g,"");
        if(code && code.length < 7 && /^\d{6}$/.test(code)){
            this.setState({ 
                ...this.state,
                valid:{
                    ...this.state.valid,
                    code: true,
                },
                tips:{
                    ...this.state.tips,
                    code: 0,
                }
            });
        }else{
            this.setState({
                ...this.state,
                valid:{
                    ...this.state.valid,
                    code: false,
                },
                tips:{
                    ...this.state.tips,
                    code: 3,
                }
            });
        }
    }
    isPassValid(event){
        let password=event.target.value.replace(/\s+/g,"");
        let pLength=password.length;
        let validPassword=(pLength>5&&pLength<19);
        let pReg=/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/;
        if(pLength==0){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    password: 0
                },
                valid:{
                    ...this.state.valid,
                    password: false,
                }
            });
        }else if((pLength>0&&(!pReg.test(password)))||(password&&(!validPassword))){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    password: 2
                },
                valid:{
                    ...this.state.valid,
                    password: false,
                }
            });
        }else{
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    password: 0
                },
                valid:{
                    ...this.state.valid,
                    password: true,
                }
            });
        }
    }
    verifyPhoneCode(){
        let phone=this.refs.phone.refs.input.value.replace(/\s+/g,"");
        console.log(phone);
        dao.isPhoneRegister({
            account : phone
        },(message)=>{
            console.log(message);
            if(message.mark == "000000000" && message.data.registered == '0'){
                dao.verifyPhoneCode({
                    phone : phone
                },(message)=>{
                    console.log(message);
                    globalEvent.register.calculateSecond.dispatch({
                        data : 120
                    }) ;
                });
            }

            else{
                this.setState({
                    ...this.state,
                    tips:{
                        ...this.state.tips,
                        mobile: 1
                    }
                });
            }
        });
    }
    clickHandle = (event) => {
        let phone = this.refs.phone.refs.input.value;
        let code = this.refs.code.refs.input.value;
        let password = this.refs.password.refs.input.value ;
        let params = {
            account : phone ,
            code : code,
            password : password
        };
        this.setState({
            ...this.state,
            tips:{
                mobile : 0 ,
                code : 0 ,
                password : 0
            },
        });
        dao.testPhoneCode(params , ( message ) => {
            console.log(message);
            if(message.data.result=="0"){
                dao.completeInfoAndRegister(params , ( message ) => {
                    console.log(message);
                    if( message.mark == '000000000' ) {
                        var _utils = utils ;
                        dao.login({
                            account : phone,
                            password : password,
                        },(message)=>{
                            console.log(message);
                            if( message.mark == '000000000' ){
                                let user_id=message.data.user.id;
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
                                //window.location.href = "/" ;
                                this.props.nextTab(user_id);

                            } else{

                            }
                        });

                        /*let user_id=message.data.user_id;
                        console.log(user_id);
                        utils.cookie.config( USER_NAME , message.data.user.id ,{
                            'path': '/' ,
                            'expires' : 100 ,
                            // domain : ''
                        } ) ;
                        utils.cookie.config( TOKEN_NAME , message.data.user.token ,{
                            'path': '/' ,
                            'expires' : 100 ,
                            // domain : ''
                        } ) ;
                        this.props.nextTab(user_id);*/
                    }else{
                        this.setState({
                            ...this.state,
                            tips:{
                                ...this.state.tips,
                                mobile: 1,
                            }
                        });
                    }
                })
            }else{
                this.setState({
                    ...this.state,
                    tips:{
                        ...this.state.tips,
                        code: 2,
                    }
                });
            }
        });
    }
    render(){
        var classes = cx({
            'Contents' : true ,
            'content-show' : ( this.props.currentIndex　===　1? true : false )
        }) ;
        return (

            <div className={classes}>
                <div className="example phone">
                    <icon type="search" />
                    <Input ref="phone" onChange={this.isPhoneValid.bind(this)} size="large" placeholder="手机号码" className="number phoneText" icon="search" />
                    <i className="sprite-ico_phone_s"></i>
                    {this.state.tips.mobile==1?<span className="mobileMsg">手机号已经被注册</span>:''}
                    {this.state.tips.mobile==2?<span className="mobileMsg">手机号格式错误</span>:''}
                </div>
                <div className="example verification">
                    <Input onChange={this.isCodeValid.bind(this)} ref="code" size="large" placeholder="验证码" className="code"/>
                    <i className="sprite-ico_captcha_s"></i>
                    {this.state.valid.phone==false?<Button type="primary" size="large" className="getcode" disabled>{this.state.tips.noSend}</Button>:<Button onClick={this.verifyPhoneCode.bind(this)} type="primary" size="large" className="getcode">发送验证码</Button>}
                    <a className="info code-info" onClick={this.showModal1.bind(this)}><span>没有收到验证码？</span></a>
                    {this.state.tips.code==1?<span className="mobileMsg1">验证码不能为空</span>:''}
                    {this.state.tips.code==2?<span className="mobileMsg1">验证码错误</span>:''}
                    {this.state.tips.code==3?<span className="mobileMsg1">验证码格式错误</span>:''}
                </div>
                <div className="example phone">
                    <Input onChange={this.isPassValid.bind(this)} ref="password" type="password" size="large" placeholder="密码" className="number password" />
                    <i className="sprite-ico_pwd_s"></i>
                    {this.state.tips.password==1?<span className="mobileMsg">密码错误</span>:''}
                    {this.state.tips.password==2?<span className="mobileMsg">密码由6-20位两种以上大小写字母、数字以及标点符号构成</span>:''}
                </div>
                <div className="example agree">
                    <input className="sprite-ico_check" ref="confirm" type="checkbox" onChange={this.isAgreed.bind(this)}></input>
                    <span className="read">我已阅读并同意了</span>
                    <a className="info">《点点账服务协议》</a>
                </div>
                <div className="example submit">
                    {this.state.valid.code&&this.state.valid.password&&this.state.valid.isAgree? <Button type="primary" size="large" className="btn_submit" onClick={this.clickHandle.bind(this)}>提交</Button> :<Button type="primary" size="large" className="btn_submit" disabled>提交</Button>}
                    <span className="viplogin">
                        <i className="sprite-ico_login_m"></i>
                        <a className="info" href="/passport/login">会员登录</a>
                    </span>
                </div>
                <Modal className="tips" title="帮助" visible={this.state.visible1}
                       onCancel={this.handleOk1.bind(this)}
                       footer={[
                            <Button className="tipbut" onClick={this.handleOk1.bind(this)}>我知道了</Button>,
                        ]}
                       width='690'>
                    <div className="reminder">
                        <span className="tipTitle">没有收到验证码怎么办</span>
                        <br/><br/><br/>
                        <span>亲爱的用户，验证码正常都会在数秒钟内发送，如果您未收到短信，请参照如下常见情况进行解决:</span><br/><br/><br/>
                        <span>1.由于您的手机设置了某些安全设置，验证码短信可能被拦截进了垃圾箱。请打开垃圾箱查看，并将点点帐号码添加为白名单。</span><br/><br/><br/>
                        <span>2.由于运营商通道故障造成了短信发送时间延迟，请耐心稍等片刻或点击重新获取验证码。</span><br/><br/><br/>
                        <span>3.关于手机号验证，目前支持移动、联通和电信的所有号码，暂不支持国际及港澳台地区号码。</span><br/><br/><br/>
                        <span> 如果您尝试了上述方式后均未解决，或存有其他疑问，请通过热线电话021-00000000获取客服协助。</span>
                    </div>
                </Modal>
            </div>


        )
    }
}

export default connect(
    ( state ) => {
        return {
            state : state ,
            currentIndex : state.default.currentIndex
        }
    },
    {
        nextTab
    }
)(MobileContent)
