import React from 'react' ;
import {
    connect
} from 'react-redux' ;
import {
    nextTab
} from '../actions' ;
import * as dao from '../../register/service/dao'
import cx from 'classnames'

import {
    Button , Pagination , Select , Input , DatePicker , Table , Form , Modal ,
    Upload ,
    Row , Col ,
    Icon
} from 'antd/dist/antd.js'

class Contents extends React.Component{
    constructor(props){
        super(props) ;
        this.state = {
            tips:{
                phone : 0,
                code : 0,
                password : 0,
                noSend : '发送验证码'
            },

            valid:{
                phone: false,
                code: false,
                password: false,
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
        globalEvent.findpwd.calculateSecond = new signals.Signal() ;
        globalEvent.findpwd.calculateSecond.add(this.state.calculateSecond) ;
    }
    
    postCode(){
        let phone=this.refs.phone.refs.input.value;
        let pLength=phone.replace(/\s+/g,"").length;
        let phoneReg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;

        if(pLength==0){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips ,
                    phone : 0
                }
            });
        }else if(!phoneReg.test(phone)){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips ,
                    phone : 2
                }
            });
        }else{
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips ,
                    phone : 0
                }
            });
            var  that = this;
            dao.isPhoneRegister({
                account : phone
            },(message)=>{
                console.log(message);
                if(message.mark == "000000000" && message.data.registered != '0'){
                    dao.verifyPhoneCode({
                        phone : phone
                    },(message)=>{
                        console.log(message);
                        globalEvent.findpwd.calculateSecond.dispatch({
                            data : 120
                        }) ;
                    });
                }

                else{
                    this.setState({
                        ...this.state,
                        tips:{
                            ...this.state.tips,
                            phone: 1
                        }
                    });
                }
            });
        }
    }

    isCodeValid(event){
        let code=event.target.value.replace(/\s+/g,"");
        if(code && code.length < 7  && /^\d{6}$/.test(code)){
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
                    code: 2,
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
                    phone: 0
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
                    phone: 2
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
                    phone: 0
                },
                valid:{
                    ...this.state.valid,
                    phone: true,
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

    check_success() {
        let phone=this.refs.phone.refs.input.value.replace(/\s+/g,"");
        let code=this.refs.code.refs.input.value.replace(/\s+/g,"");
        let newPassword=this.refs.password.refs.input.value.replace(/\s+/g,"");
        let phoneReg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
        let codeReg=/^\d{6}$/;
        let nReg=/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/;
        let params = {
            account : phone ,
            code : code,
            newPassword : newPassword
        };
        if(phone.length==0){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    phone : 1 ,
                    code : 0 ,
                    password : 0,
                }
            });
        }else if(!phoneReg.test(phone)){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips ,
                    phone : 2 ,
                    code : 0 ,
                    password : 0,
                }
            });
        }else if(code.length==0){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips ,
                    code : 1 ,
                    phone : 0 ,
                    password : 0 ,
                }
            });
        }else if(!codeReg.test(code)){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips ,
                    code : 2 ,
                    phone : 0 ,
                    password : 0 ,
                }
            });
        }else if(newPassword.length==0){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips ,
                    password : 1 ,
                    phone : 0 ,
                    code : 0 ,
                }
            });
        }else if(!nReg.test(newPassword)){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips ,
                    password : 2 ,
                    phone : 0 ,
                    code : 0 ,
                }
            });
        }else {
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    password: 0 ,
                    code: 0 ,
                    phone: 0
                }
            });
            dao.testPhoneCode(params , ( message ) => {
                console.log(message);
                if(message.data.result=="0"){
                    /*dao.searchIdByPhone(params , ( message ) => {
                        console.log(message);
                        if( message.mark == '000000000' ) {
                            let returnId = message.data.users[0].id;
                            console.log(returnId);
                            dao.resetPassword( {
                                id: returnId,
                                password: params.newPassword
                            } , ( message ) => {
                                console.log(message);
                                if( message.mark == '000000000' ) {
                                    Modal.success({
                                        title: <div>
                                            <span> 恭喜您，登录密码修改成功！</span><br/>
                                            <span>请牢记您的密码。</span>
                                        </div>,
                                        content: '',
                                        onOk(){
                                            window.location.href = "/passport/login";
                                        }
                                    });
                                }
                            }) ;
                        }else{}
                    })*/

                    dao.changePasswordByPhone( {
                        phone: params.account,
                        password: params.newPassword,
                        code : params.code
                    } , ( message ) => {
                        console.log(message);
                        if( message.mark == '000000000' ) {
                            Modal.success({
                                title: <div>
                                    <span> 恭喜您，登录密码修改成功！</span><br/>
                                    <span>请牢记您的密码。</span>
                                </div>,
                                content: '',
                                onOk(){
                                    window.location.href = "/passport/login";
                                }
                            });
                        }
                    }) ;


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
            /*dao.resetPassword( {
                account : phone ,
                code : code,
                newPassword : newPassword
            } , ( message ) => {
                console.log(message);
                if( message.mark == '000000000' ) {
                    Modal.success({
                        title: <div>
                            <span> 恭喜您，登录密码修改成功！</span><br/>
                            <span>请牢记您的密码。</span>
                        </div>,
                        content: '',
                        onOk(){
                            window.location.href = "/passport/login";
                        }
                    });
                }
            }) ;*/
        }
}

    render (){
        return (
            <div className="body-content-wrap">
                <div className="Contents findPwd">
                    <div className="example phone">
                        <span>
                            <Input size="large" placeholder="手机号码" className="number" ref="phone" onChange={this.isPhoneValid.bind(this)}/>
                            <i className="sprite-ico_phone_s"></i>
                            {this.state.tips.phone==1?<span className="mobileMsg">手机号未注册</span>:''}
                            {this.state.tips.phone==2?<span className="mobileMsg">手机号格式错误</span>:''}
                        </span>
                    </div>
                    <div className="example verification">
                        <span >
                            <Input size="large" placeholder="验证码" onChange={this.isCodeValid.bind(this)} className="code" ref="code"/>
                                <i className="sprite-ico_captcha_s"></i>
                            {this.state.valid.phone==false?<Button type="primary" size="large" className="getcode" disabled>{this.state.tips.noSend}</Button>:<Button type="primary" size="large" className="getcode" onClick={this.postCode.bind(this)}>发送验证码</Button>}
                        </span>
                        {this.state.tips.code==1?<span className="mobileMsg">验证码不能为空</span>:''}
                        {this.state.tips.code==2?<span className="mobileMsg">验证码格式错误</span>:''}
                        {this.state.tips.code==3?<span className="mobileMsg">验证码错误</span>:''}
                    </div>
                    <div className="example phone">
                        <span>
                            <Input size="large" placeholder="新密码" onChange={this.isPassValid.bind(this)} type="password" className="number" ref="password"/>
                            <i className="sprite-ico_pwd_s"></i>
                        </span>
                        {this.state.tips.password==1?<span className="mobileMsg">新密码不能为空</span>:''}
                        {this.state.tips.password==2?<span className="mobileMsg">密码由6-20位两种以上大小写字母、数字以及标点符号构成</span>:''}
                    </div>

                    <div className="example submit-2">
                        {this.state.valid.code&&this.state.valid.password? <Button type="primary" size="large" className="btn_submit" onClick={this.check_success.bind(this)}>提交</Button>:<Button type="primary" size="large" className="btn_submit" disabled>提交</Button>}
                    </div>
                    <div>
                        <span className="viplogin">
                            <i className="sprite-ico_login_m"></i>
                            <a className="info" href="/passport/register">新会员注册</a>
                        </span>
                    </div>
                </div>
            </div>
               )
    }
}

export default connect( (store)=>{
    return {
        currentIndex : store.default.currentIndex
    }
} , {
    nextTab
})( Contents )