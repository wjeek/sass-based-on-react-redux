import React from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import {
    Button , Pagination , Select , Input , DatePicker , Table , Form , Modal ,Alert,Switch,
    Upload ,Radio,
    Row , Col ,
    Icon
} from 'antd/dist/antd.js'
import * as service from '../../../index/service'
import * as dao from '../service/dao' ;
import utils from '../../../index/service/utils/index'
import {
    POST_TYPE ,
    TOKEN_NAME ,
    USER_NAME,
} from '../../../index/constants/index.js'
let POST_TYPE_MAP_ARREY = POST_TYPE.map((v)=>{
    return {
        label : v.name ,
        value : v.value
    }
}) ;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class SuccessContent extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            valid:{
                joinName : false ,
                joinCode : false ,
                createName : false ,
                createCompany : false
            },
            tips:{
                joinName : 0 ,
                joinCode : 0 ,
                createName : 0 ,
                createCompany : 0
            },
            modal　:　{
                joinName　:　''　,
                joinCode　:　''　,
                createName :　''　,
                createCompany　:　''　,
            },
            role　:　[　1　]　,
            modalType : 'message' , //code message
            canEdit:{
                editRole : true , //缺role,可以编辑
                editTeam : true , //缺team,可以编辑
            }
        }
    }
    componentDidMount(){
        if ( !utils.cookie.config( USER_NAME ) ){
            return ;
        }
        service.userstore.fetchUserInfo_sync({
            id : utils.cookie.config( USER_NAME ) ,
        },(result)=>{
            if ( result.mark == '000000000' ){
                var userMessage = result.data.user ;
                //根据这个用户的信息进行基本信息补全的初始化
                var registerState = {
                    editRole : userMessage.roleIds.length == 0 ? true : false ,
                    editTeam : !userMessage.tenantId ? true : false ,
                    memberName : userMessage.memberName || '' ,
                    teamName : userMessage.tenantName || '' ,
                    roleId : userMessage.roleIds.length == 0 ? 1 : userMessage.roleIds[0]-0 ,
                }
                this.setState({
                    canEdit : {
                        editRole : registerState.editRole ,
                        editTeam : registerState.editTeam ,
                    } ,
                    role : [ registerState.roleId ] ,
                    modal : {
                        ...this.state.tips ,
                        joinName : registerState.memberName ,
                        createName : registerState.memberName ,
                        createCompany : registerState.teamName ,
                    }
                }) ;
            } else {
                console.warn( '用户信息获取失败' ) ;
            }
        }) ;
    }
    _showConfirm(){
        if ( this.state.modalType == 'message' ){
            this._showConfirm2() ;
        } else {
            this._showConfirm1() ;
        }
    }
    _showConfirm2() {
        let name=this.refs.createName.refs.input.value;
        let company=this.refs.createCompany.refs.input.value;
        let user_id=this.props.user_id;
        var self = this ;
        if(/^.([\u4e00-\u9fa5]?|[a-zA-Z0-9]?){1,10}$/.test(company)){
            Modal.confirm({
                // title: '确定创建团队？',
                title : '已确认所填信息?' ,
                onOk:()=> {
                    var count = 2 ;
                    if ( !self.state.canEdit.editTeam ){
                        count-- ;
                    } else {
                        dao.bindTeam({
                            id : user_id,
                            memberName : name ,
                            tenantName : company ,
                        },(message) => {
                            if(message.mark=='000000000'){
                                count-- ;
                                if ( count == 0 ){
                                    window.location.href="/";
                                }
                            }else{
                                alert('加入团队失败') ;
                            }
                        });
                    }
                    if ( !self.state.canEdit.editRole ){
                        count-- ;
                    } else {
                        dao.changeRole({
                            "usersParameter" : {
                                id : utils.cookie.config( USER_NAME ) ,
                                roleIds : this.state.role ,
                            }
                        },(result)=>{
                            if ( result.mark === '000000000' ){
                                count-- ;
                                if( count == 0 ){
                                    window.location.href = "/" ;
                                }

                            } else {
                                alert( '更改用户角色失败, 请检查网络连接' ) ;
                            }
                        });
                    }
                    if ( !self.state.canEdit.editRole && !self.state.canEdit.editTeam ){
                        window.location.href = "/" ;
                    }
                },
                onCancel() {},
            });
        }

        /*else if(! (/^.([\u4e00-\u9fa5]?|[a-zA-Z0-9]?){1,10}$/.test(name))){
            //alert('请输入正确的姓名');
            globalFunction.alert.warning('请输入正确的姓名','操作提示');
        }*/

        else{
            //alert('请输入正确的团队名');
            globalFunction.alert.warning('请输入正确的团队名','操作提示');
        }

    }
    _showConfirm1() {
        let name=this.refs.joinName.refs.input.value;
        let code=this.refs.joinCode.refs.input.value;
        let user_id=this.props.user_id;
        var self = this ;
        //if(/^.([\u4e00-\u9fa5]?|[a-zA-Z0-9]?){1,10}$/.test(name) && code.length == 4)
        if(code!= null && code.length == 4) {
            Modal.confirm({
                // title: '确定加入团队？',
                title : '已确认所填信息?' ,
                onOk() {
                    var count = 2 ;
                    if ( !self.state.canEdit.editTeam ){
                        count-- ;
                    } else {
                        dao.bindTeam({
                            id : user_id ,
                            memberName : name ,
                            invitation : code ,
                        },(message) => {
                            if(message.mark=='000000000'){
                                count-- ;
                                if ( count == 0 ){
                                    window.location.href="/";
                                }
                            }else{
                                //alert('加入团队失败') ;
                                globalFunction.alert.warning('加入团队失败','操作提示');
                            }
                        });
                    }
                    if ( !self.state.canEdit.editRole ){
                        count-- ;
                    } else {
                        dao.changeRole({
                            "usersParameter" : {
                                id : utils.cookie.config( USER_NAME ) ,
                                roleIds : self.state.role ,
                            }
                        },(result)=>{
                            if ( result.mark === '000000000' ){
                                count-- ;
                                if( count == 0 ){
                                    window.location.href = "/" ;
                                }

                            } else {
                                //alert( '更改用户角色失败, 请检查网络连接' ) ;
                                globalFunction.alert.warning('更改用户角色失败, 请检查网络连接','操作提示');
                            }
                        });
                    }
                    if ( !self.state.canEdit.editRole && !self.state.canEdit.editTeam ){
                        window.location.href = "/" ;
                    }
                },
                onCancel() {},
            });
        }

        else if(code.length != 4){
            //alert('请输入正确邀请码')
            globalFunction.alert.warning('请输入正确邀请码','操作提示');
        }

        else{
            alert('请输入正确姓名')
        }

    }
    changeToBuild(){
        // $('.joinTeam,.join-team').css('display','none');
        // $('.buildTeam,.create-team').css('display','block');
        this.setState({
            modalType : 'message' ,
        }) ;
    }
    changeToJoin(){
        // $('.buildTeam,.create-team').css('display','none');
        // $('.joinTeam,.join-team').css('display','block');
        this.setState({
            modalType : 'code' ,
        }) ;
    }
    validJoinName(event){
        let name=event.target.value.replace(/\s+/g,"");
        let length=name.length;
        let validLength=(length>0&&length<21);
        let reg=/^[^`~!@#$%^&*()+=|\\\][\]\{\}:;'\,.<>/?]{1}[^`~!@$%^&()+=|\\\][\]\{\}:;'\,.<>?]{0,19}$/;
        if(length==0){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    joinName: 0
                },
                modal:{
                    ...this.state.modal ,
                    joinName: name,
                },
                valid:{
                    ...this.state.valid,
                    joinName: false,
                }
            });
        }else if((name&&(!reg.test(name)))||(name&&(!validLength))){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    joinName: 1
                },
                modal:{
                    ...this.state.modal ,
                    joinName: name,
                },
                valid:{
                    ...this.state.valid,
                    joinName: false,
                }
            });
        }
        else{
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    joinName: 0
                },
                modal:{
                    ...this.state.modal　,
                    joinName: name,
                },
                valid:{
                    ...this.state.valid,
                    joinName: true,
                }
            });
        }
    }
    validInviteCode(event){
        let code=event.target.value.replace(/\s+/g,"");
        let length=code.length;
        if(length==0){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    joinCode: 0
                },
                modal:{
                    ...this.state.modal　,
                    joinCode: code,
                },
                valid:{
                    ...this.state.valid,
                    joinCode: false,
                }
            });
        }else{
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    joinCode: 0
                },
                modal:{
                    ...this.state.modal　,
                    joinCode: code,
                },
                valid:{
                    ...this.state.valid,
                    joinCode: true,
                }
            });
        }
    }
    validCreateName(event){
        let name=event.target.value.replace(/\s+/g,"");
        let length=name.length;
        let validLength=(length>0&&length<21);
        let reg=/^[^`~!@#$%^&*()+=|\\\][\]\{\}:;'\,.<>/?]{1}[^`~!@$%^&()+=|\\\][\]\{\}:;'\,.<>?]{0,19}$/;
        if(length==0){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    createName: 0
                },
                modal:{
                    ...this.state.modal　,
                    createName: name,
                },
                valid:{
                    ...this.state.valid,
                    createName: false,
                }
            });
        }else if((name&&(!reg.test(name)))||(name&&(!validLength))){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    createName: 1
                },
                modal:{
                    ...this.state.modal　,
                    createName: name,
                },
                valid:{
                    ...this.state.valid,
                    createName: false,
                }
            });
        }else{
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    createName: 0
                },
                modal:{
                    ...this.state.modal　,
                    createName: name,
                },
                valid:{
                    ...this.state.valid,
                    createName: true,
                }
            });
        }
    }
    validCompany(event){
        let company=event.target.value.replace(/\s+/g,"");
        let length=company.length;
        let validLength=(length>0&&length<61);
        let reg=/^[^`~!@#$%^&*()+=|\\\][\]\{\}:;'\,.<>/?]{1}[^`~!@$%^&()+=|\\\][\]\{\}:;'\,.<>?]{0,19}$/;
        if(length==0){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    createCompany: 0
                },
                modal:{
                    ...this.state.modal ,
                    createCompany: company,
                },
                valid:{
                    ...this.state.valid,
                    createCompany: false,
                }
            });
        }else if((company&&(!reg.test(company)))||(company&&(!validLength))){
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    createCompany: 1
                },
                modal:{
                    ...this.state.modal ,
                    createCompany: company,
                },
                valid:{
                    ...this.state.valid,
                    createCompany: false,
                }
            });
        }else{
            this.setState({
                ...this.state,
                tips:{
                    ...this.state.tips,
                    createCompany: 0
                },
                modal:{
                    ...this.state.modal ,
                    createCompany: company,
                },
                valid:{
                    ...this.state.valid,
                    createCompany: true,
                }
            });
        }
    }
    render(){
        var classes = cx({
            'content-step3' : true ,
            'content' : true ,
            'content-show' : ( this.props.currentIndex　===　2 ? true : false )
        }) ;
        console.log( this.state ) ;

        return (
        <div className="successContent">
            <div className={classes} >
                <div className="message-wrap" style={{height:170}}>
                    <span>
                        <i className="sprite-ico_right_b"></i>
                        <span className="success">提交成功! 请完善以下信息。</span>
                    </span>
                </div>
                <div style={{display:'none'}}>
                    <Alert message="为了更好地体验，请完善以下信息。" type="warning" className="alter"/>
                    <i className="sprite-ico_warn_s"></i>
                </div>
                <div className="centerPart">
                    <Row>
                        {
                            this.state.modalType === 'message' ?
                                (
                                    <div className="buildTeam" ref="buildTeam">
                                        <Col span={8} offset={4}>
                                            <span className="join"><strong>创建团队</strong></span>
                                            <Input
                                                size="large"
                                                ref="createName"
                                                placeholder="姓名"
                                                className="number"
                                                disabled={!this.state.canEdit.editTeam}
                                                value={this.state.modal.createName}
                                                onChange={this.validCreateName.bind(this)}
                                            />
                                            {/*this.state.tips.createName==1?<span className="mobileMsg">请输入正确姓名</span>:''*/}
                                            <Input
                                                size="large"
                                                ref="createCompany"
                                                placeholder="公司"
                                                className="number"
                                                disabled={!this.state.canEdit.editTeam}
                                                value={this.state.modal.createCompany}
                                                onChange={this.validCompany.bind(this)}
                                            />
                                            {/*this.state.tips.createCompany==1?<span className="mobileMsg1">请输入正确公司名称(不超过60字符)</span>:''*/}
                                            <span className="hasInfo" ref="build" onClick={this.changeToJoin.bind(this)}>有邀请码？</span>
                                        </Col>
                                    </div>
                                ) :
                                (
                                    <div className="joinTeam" ref="joinTeam">
                                        <Col span={8} offset={4}>
                                            <span className="join"><strong>加入团队</strong></span>
                                            <span >
                                                <Input
                                                    size="large"
                                                    ref="joinName"
                                                    placeholder="姓名"
                                                    className="number"
                                                    disabled={!this.state.canEdit.editTeam}
                                                    value={this.state.modal.joinName}
                                                    onChange={this.validJoinName.bind(this)}
                                                />
                                                {/*this.state.tips.joinName==1?<span className="mobileMsg">请输入正确姓名</span>:''*/}
                                                <Input
                                                    size="large"
                                                    ref="joinCode"
                                                    placeholder="输入邀请码即可加入团队"
                                                    className="number"
                                                    disabled={!this.state.canEdit.editTeam}
                                                    value={this.state.modal.joinCode}
                                                    onChange={this.validInviteCode.bind(this)}
                                                />
                                                {/*this.state.tips.joinCode==1?<span className="mobileMsg1">邀请码错误</span>:''*/}
                                                <span className="hasnotInfo" ref="join" onClick={this.changeToBuild.bind(this)}>无邀请码？</span>
                                            </span>
                                        </Col>
                                    </div>
                                )
                        }

                        <Col span={8} >
                            <span className="join"><strong>选择角色</strong></span>
                            <div className="horizontal"></div>
                            <div className="character">
                                <RadioGroup
                                    disabled={!this.state.canEdit.editRole}
                                    onChange={(event)=>{
                                        var tarID = event.target.value;

                                        this.setState({
                                            role : typeof tarID === 'undefined' ? [] : [ tarID-0 ] ,

                                        })
                                    }}
                                    value={this.state.role[0]}>
                                    {
                                        POST_TYPE_MAP_ARREY.map((v,i)=> {
                                            return <RadioButton value={v.value} key={i}>{v.label}</RadioButton>
                                        })
                                    }
                                </RadioGroup>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div>
                    {
                        this.state.modalType == 'message' ?
                            (this.state.canEdit.editTeam ? <Button
                                type="primary"
                                size="large"
                                className="btn_submit create-team"
                                onClick={this._showConfirm.bind(this)}
                            >创建团队</Button> :
                            <Button
                                type="primary"
                                size="large"
                                className="btn_submit create-team"
                                onClick={this._showConfirm.bind(this)}
                            >保存角色</Button>
                            ):
                            <Button
                                type="primary"
                                size="large"
                                className="btn_submit join-team"
                                onClick={this._showConfirm.bind(this)}
                            >加入团队</Button>

                    }
                    {/*this.state.valid.joinName&&this.state.valid.joinCode?
                        <Button
                            type="primary"
                            size="large"
                            className="btn_submit join-team"
                            onClick={this._showConfirm1.bind(this)}
                        >加入团队</Button>:
                        <Button
                            type="primary"
                            size="large"
                            className="btn_submit join-team"
                            disabled
                        >加入团队</Button>*/}
                    {/*this.state.valid.createName&&this.state.valid.createCompany?
                        <Button
                            type="primary"
                            size="large"
                            className="btn_submit create-team"
                            onClick={this._showConfirm2.bind(this)}
                        >创建团队</Button>:
                        <Button
                            type="primary"
                            size="large"
                            className="btn_submit create-team"
                            disabled
                        >创建团队</Button>*/}
                </div>
            </div>
        </div>
        )
    }
}

export default connect(
    (state) => {
        return {
            currentIndex : state.default.currentIndex ,
            user_id : state.default.user_id
        }
    },
    {}
)(SuccessContent)
