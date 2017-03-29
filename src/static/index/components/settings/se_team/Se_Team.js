//lib
import React from 'react'
import utils from '../../../service/utils/index'
import { connect , dispatch } from 'react-redux'
import className from 'classnames'
import ZeroClipboard from 'zeroclipboard'
import QueueAnim from 'rc-queue-anim'
import {
    USER_NAME,
    TENANT_ID
} from '../../../constants' ;

//utils and service
import * as service from '../../../service'
//component
import {
    Button , Pagination , Select , Input , DatePicker , Table , Form , Modal , Radio , Checkbox ,
    Upload ,
    Row , Col ,
    Icon ,
} from 'antd/dist/antd.js'
const  Option = Select.Option ;
const FormItem = Form.Item ;
const RadioGroup = Radio.Group ;
const RadioButton = Radio.Button ;
import {
    Layer , Auth ,
} from '../../index'
import {
    Detail
} from '../../index'
//action
import {
    settingsTeamInit ,
    settingsTeamInitInvite,
    settingsTeamTable ,
    settingsTeamSearchPhone ,
    settingsTeamInviteTable ,
    settingsTeamAdminTable ,
    modal1Show ,
    modal2Show ,
    modal2TabChange,
    layer1Show ,
    layer1PageChange ,
    layer2Show ,
    layer2Mode
} from '../../../actions/settings'

const COLUMNS = [
    {
        title : '姓名' ,
        dataIndex : 'name' ,
        key : 'name' ,
        render : (text,value) => {
            if(value.isAdmin == 0){
                return (
                    <span>
                    <a className="cell-link cell-operation" value={value.id}
                       onClick={(event)=>{
                       if(globalStore.getState().userstore.user.account == value.phone || globalStore.getState().userstore.user.isAdmin == '0'){
                            globalStore.dispatch(layer2Show({
                                isShow : true ,
                                mode : value.isAdmin == 0 ? 'admin' : 'member'
                            }))　;
                            globalEvent.settings.editTeam.dispatch({
                                data : value
                            }) ;
                            globalEvent.settings.chooseOldManager.dispatch({
                                data : value.userId
                            }) ;
                       }

                   }}
                    >{text}</a>
                    <span>【管理员】</span>
                </span>
                )
            }

            else{
                return (
                    <span>
                    <a className="cell-link cell-operation" value={value.id}
                       onClick={(event)=>{
                       if(globalStore.getState().userstore.user.account == value.phone || globalStore.getState().userstore.user.isAdmin == '0'){
                            globalStore.dispatch(layer2Show({
                                isShow : true ,
                                mode : 'member'
                            }))　;
                            globalEvent.settings.editTeam.dispatch({
                                data : value
                            }) ;
                        }
                   }}
                    >{text}</a>
                </span>
                )
            }

        }
    },{
        title : '角色' ,
        dataIndex : 'post_forShow' ,
        key : 'post'
    },{
        title : '工号' ,
        dataIndex : 'jobNumber' ,
        key : 'jobNumber'
    },{
        title : '手机号码' ,
        dataIndex : 'phone' ,
        key : 'phone'
    },{
        title : '电子邮箱' ,
        dataIndex : 'email' ,
        key : 'email'
    },{
        title : '分机号' ,
        dataIndex : 'extension' ,
        key : 'extension'
    },{
        title : '操作' ,
        dataIndex : 'operation' ,
        key : 'operation' ,
        render : (text,value) => {
            var that = this;
            {
                return (
                    (globalStore.getState().userstore.user.account == value.phone || globalStore.getState().userstore.user.isAdmin == '0')&&(<span>
                    <i title="编辑" className="sprite-edit dib-table-icon" value={value.id}
                       onClick={(event)=>{
                            globalStore.dispatch(layer2Show({
                                isShow : true ,
                                mode : value.isAdmin == 0 ? 'admin' : 'member'
                            }))　;
                            globalEvent.settings.editTeam.dispatch({
                                data : value
                            }) ;
                            if(value.isAdmin == 0){
                                 globalEvent.settings.chooseOldManager.dispatch({
                                     data : value.userId
                            }) ;
                            }
                   }}
                    ></i>
                </span>)

                )
            }

        }
    }
] ;


class Se_Team extends React.Component {

    constructor(props){
        super(props) ;
        this.state = {
            currentPage : 1 ,
            pageSize : 10 ,
            filter : {
                keyword : '' ,
                oldManagerId: '',
                newManagerId: ''
            } ,
            valid:{
                invite : true,
                isAdmin : '1',
                account: '',
                joinTeam : false
            },
            validation : {
                name_status : '' ,
                name_help : '' ,
                staticPhone_status : '' ,
                staticPhone_help : '' ,
                mobile_status : '' ,
                mobile_help : '' ,
                password_status : '' ,
                password_help : '' ,
                jobNumber_status : '' ,
                jobNumber_help : '' ,
                email_status : '' ,
                email_help : '' ,
                edit_name_status : '' ,
                edit_name_help : '' ,
                edit_staticPhone_status : '' ,
                edit_staticPhone_help : '' ,
                edit_mobile_status : '' ,
                edit_mobile_help : '' ,
                edit_password_status : '' ,
                edit_password_help : '' ,
                edit_jobNumber_status : '' ,
                edit_jobNumber_help : '' ,
                edit_email_status : '' ,
                edit_email_help : '' ,
            } ,
            settingsTeamInit : (value)　=>　{
                service.settings.initSettingsTeam({
                    tenantId : window.globalStore.getState().userstore.user.tenantId
                },(error,data)=>{
                    this.props.settingsTeamInit(data) ;
                });
            }　,
            editTeam : (value)　=>　{
                this.setState({
                    layerModel2　:　{
                        ...this.state.layerModel2 ,
                        modal : value.data ,
                    },
                })　;
            }　,

            changeInvite : (value)　=>　{
                this.props.modal2TabChange({index:0});
                this.setState({
                    valid : {
                        ...this.state.valid,
                        invite : value.data
                    }

                });
                var invitation = value.data ? '1' : '0';
                service.settings.changeInvite({
                    tenantId : window.globalStore.getState().userstore.user.tenantId,
                    invitation : invitation
                },(error,data)=>{
                    if(invitation == '1'){
                        service.settings.initSettingsTeam({
                            tenantId : window.globalStore.getState().userstore.user.tenantId
                        },(error,data)=>{
                            if(data.inviteMessage.data.inviteLink == '您未开启功能'){
                                this.setState({
                                    valid:{
                                        ...this.state.valid,
                                        invite : false
                                    }
                                });
                                globalFunction.alert.warning('您无法开启此功能','操作提示');
                            }
                            else{
                                this.props.settingsTeamInitInvite(data) ;
                                this._eventInit() ;
                            }

                        });
                    }
                });
            }　,

            chooseManager : (value)　=>　{

                this.setState({
                    filter　:　{
                        ...this.state.filter ,
                        newManagerId : value.data
                    },
                },()=>{
                    console.log(this.state);
                })　;

            }　,

            checkAdmin : (value)　=>　{
                var user = globalStore.getState().userstore;
                return (user.user.account == value.data.phone || user.user.isAdmin == '0')
            } ,

            chooseOldManager : (value)　=>　{
                this.setState({
                    filter　:　{
                        ...this.state.filter ,
                        oldManagerId : value.data
                    },
                })　;
            }　,

            saveSettingUser : (value)　=>　{
                if ( service.validation.settings.form_personal.name(value.data.name).validateStatus == 'error' ||
                    service.validation.settings.form_personal.mobile(value.data.phone).validateStatus == 'error'||
                    service.validation.settings.form_personal.jobNumber(value.data.jobNumber).validateStatus == 'error'||
                    service.validation.settings.form_personal.email(value.data.email).validateStatus == 'error'
                ){
                    globalFunction.alert.warning( '请正确填写您的表单信息' , '表单验证' ) ;
                    return ;
                }
                service.settings.saveSettingUser({
                    id : this.state.layerModel2.modal.userId,
                    memberName : this.state.layerModel2.modal.name,
                    account : this.state.layerModel2.modal.phone,
                    roleIds : [this.state.layerModel2.modal.post],
                    jobNumber : this.state.layerModel2.modal.jobNumber,
                    mailAddress : this.state.layerModel2.modal.email,
                    telephone : this.state.layerModel2.modal.extension
                },(error,data)=>{
                    if(!error){
                        globalEvent.settings.settingsTeamInit.dispatch({
                            data : data
                        }) ;
                        globalStore.dispatch(layer2Show({
                            isShow : false
                        }))　;
                    }

                });
            }　,

            createTeamUser : (value)　=>　{
                if ( service.validation.settings.form_personal.mobile(this.state.layerModel1.modal.phone).validateStatus == 'error'){
                    globalFunction.alert.warning( '请正确填写您的表单信息' , '表单验证' ) ;
                    return ;
                }
                service.settings.isRegister({
                    account : this.state.layerModel1.modal.phone,
                },(error,data)=>{
                    if(data.data == '0'){
                        if ( service.validation.settings.form_personal.mobile(this.state.layerModel1.modal.phone).validateStatus == 'error' ||
                            service.validation.settings.form_personal.password(this.state.layerModel1.modal.password).validateStatus == 'error'||
                            service.validation.settings.form_personal.name(this.state.layerModel1.modal.name).validateStatus == 'error'||
                            service.validation.settings.form_personal.email(this.state.layerModel1.modal.email).validateStatus == 'error'||
                            service.validation.settings.form_personal.jobNumber(this.state.layerModel1.modal.jobNumber).validateStatus == 'error'
                        ){
                            globalFunction.alert.warning( '请正确填写您的表单信息' , '表单验证' ) ;
                            return ;
                        }
                        service.settings.userRegister({
                            account : value.data.id,
                            password: value.data.password
                        },(error,data)=>{
                            if(!error){
                                this.props.layer1Show({
                                    isShow : false ,
                                }) ;
                                service.settings.joinSettingsTeam({
                                    id : data.data,
                                    tenantId :  window.globalStore.getState().userstore.user.tenantId
                                },(error,data2)=>{
                                    if(!error){
                                        service.settings.saveSettingUser({
                                            id : data.data,
                                            memberName : this.state.layerModel1.modal.name,
                                            account : this.state.layerModel1.modal.phone,
                                            roleIds : [this.state.layerModel1.modal.post],
                                            jobNumber : this.state.layerModel1.modal.jobNumber,
                                            mailAddress : this.state.layerModel1.modal.email,
                                            telephone : this.state.layerModel1.modal.extension
                                        },(error,data)=>{
                                            globalEvent.settings.settingsTeamInit.dispatch({
                                                data : data
                                            }) ;
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else{
                        service.settings.fetchSettingsTeam({
                            account : this.state.layerModel1.modal.phone
                        },(error,data)=>{
                            service.settings.joinSettingsTeam({
                                id : data.data[0].userId,
                                tenantId :  window.globalStore.getState().userstore.user.tenantId
                            },(error,data2)=>{
                                if(!error && data2.data.mark === '000000000'){
                                    globalEvent.settings.settingsTeamInit.dispatch({
                                        data : data2
                                    }) ;
                                }
                                else{
                                    globalFunction.alert.warning('您不具备添加此用户的权限或该用户已有团队','操作提示');
                                }
                            });
                        }) ;
                        
                    }
                });

            }　,


            modalModel1 : {
                invitationCode : '',
                post : '3'
            } ,
            layerModel1 : {
                modal : {
                    name : '' ,
                    phone : '' ,
                    password : '' ,
                    post : '3' ,
                    jobNumber : '' ,
                    email : '' ,
                    extension : '' ,
                },
                search : {
                    keyword : '' ,
                } , //搜索已有的用户
            } ,
            layerModel2 : {
                modal : {
                    name : '' ,
                    phone : '' ,
                    post : '3' ,
                    jobNumber : '' ,
                    email : '' ,
                    extension : '' ,
                },
            }

        }
    }

    componentDidMount(){
        var user = globalStore.getState().userstore;
        console.log(user);
        if(user.user.isAdmin == '0'){
            this.setState({
                valid: {
                    ...this.state.valid,
                    isAdmin : '0',
                }
            })
        }
        service.settings.initSettingsTeam({
            tenantId : window.globalStore.getState().userstore.user.tenantId
        },(error,data)=>{
            this.props.settingsTeamInit(data) ;
            var invite = true;
            var joinTeam = true;
            if(data.inviteMessage.data.inviteLink == '您未开启功能'){
                invite = false
            }
            if(data.team && data.team.data && data.team.data.length > 1){
                joinTeam = false
            }

            this.setState({
                valid:{
                    ...this.state.valid,
                    invite : invite,
                    joinTeam : joinTeam,
                }
            })

            /*setTimeout(()=>{
                this._eventInit() ;
            },3000) ;*/
        });

        globalEvent.settings.createTeamUser = new signals.Signal() ;
        globalEvent.settings.createTeamUser.add(this.state.createTeamUser) ;

        globalEvent.settings.chooseManager = new signals.Signal() ;
        globalEvent.settings.chooseManager.add(this.state.chooseManager) ;

        globalEvent.settings.chooseOldManager = new signals.Signal() ;
        globalEvent.settings.chooseOldManager.add(this.state.chooseOldManager) ;

        globalEvent.settings.settingsTeamInit = new signals.Signal() ;
        globalEvent.settings.settingsTeamInit.add(this.state.settingsTeamInit) ;

        globalEvent.settings.editTeam = new signals.Signal() ;
        globalEvent.settings.editTeam.add(this.state.editTeam) ;

        globalEvent.settings.saveSettingUser = new signals.Signal() ;
        globalEvent.settings.saveSettingUser.add(this.state.saveSettingUser) ;

        globalEvent.settings.changeInvite = new signals.Signal() ;
        globalEvent.settings.changeInvite.add(this.state.changeInvite) ;

        globalEvent.settings.checkAdmin = new signals.Signal() ;
        globalEvent.settings.checkAdmin.add(this.state.checkAdmin) ;


    }
    _eventInit(){
        setTimeout(function(){

            ZeroClipboard.config( { swfPath: window.static_url + "/resource/swf/ZeroClipboard.swf" } );
            var clip_inviteMessage = new ZeroClipboard(  document.getElementById('copy_button_invitemessage') ) ;
            clip_inviteMessage.on("ready", function() {
                console.info( '剪切板准备完毕。' ) ;
                this.on("aftercopy", function(event) {
                    console.info( '剪切内容:' + event.data["text/plain"] ) ;
                });
            });
            clip_inviteMessage.on("error", function(event) {
                console.warn('error[name="' + event.name + '"]: ' + event.message)
                ZeroClipboard.destroy();
            });
            ZeroClipboard.config( { swfPath: window.static_url + "/resource/swf/ZeroClipboard.swf" } );
            var clip_inviteMessage_2 = new ZeroClipboard(  document.getElementById('copy_button_invitemessage_2') ) ;
            clip_inviteMessage_2.on("ready", function() {
                console.info( '剪切板准备完毕。' ) ;
                this.on("aftercopy", function(event) {
                    console.info( '剪切内容:' + event.data["text/plain"] ) ;
                });
            });
            clip_inviteMessage_2.on("error", function(event) {
                console.warn('error[name="' + event.name + '"]: ' + event.message)
                ZeroClipboard.destroy();
            });

        },2000);
    }

    componentWillUnmount(){
        globalEvent.settings.editTeam.remove(this.state.editTeam) ;
    }
    //
    _ev_filterSearch(){
        var key = this.state.filter.keyword;
        if(key){
            service.settings.fetchSettingsTeam({
                memberName : key,
                tenantId : window.globalStore.getState().userstore.user.tenantId
            },(error,data)=>{
                this.props.settingsTeamTable(data) ;
                this.setState({
                   currentPage : 1
                });
            }) ;
        }

        else{
            service.settings.initSettingsTeam({
                tenantId : window.globalStore.getState().userstore.user.tenantId
            },(error,data)=>{
                this.props.settingsTeamInit(data) ;
                this.setState({
                    currentPage : 1
                });
                /*setTimeout(()=>{
                 this._eventInit() ;
                 },3000) ;*/
            });
        }
    }
    _ev_click_searchPhone(){
        var keyword = this.state.layerModel1.search.keyword;
        /*service.settings._ev_click_searchPhone({
            account : keyword
        },(error,data)=>{
            this.props.settingsTeamSearchPhone(data) ;
        }) ;*/
        /*service.settings._ev_click_searchId({
            id : keyword  //应该用电话的
        },(error,data)=>{
            this.props.settingsTeamSearchPhone(data) ;
        }) ;*/
        service.settings.fetchSettingsTeam({
            account : keyword
        },(error,data)=>{
            this.props.settingsTeamSearchPhone(data) ;
        }) ;
    }
    _evClick_joinTeam(){
        console.log( this.state.modalModel1.invitationCode ) ;
        var invitation = this.state.modalModel1.invitationCode;
        service.settings.joinSettingsTeam({
            invitation :  invitation ,
            id : utils.cookie.config( USER_NAME )
        },(error,data)=>{
            /*this.props.layer2Mode({
                mode : 'changeAdmin' ,
                admin : data.data
            })*/
            if( data.data.mark == '000000000'){
                service.settings.saveSettingUser({
                    id : utils.cookie.config( USER_NAME ),
                    roleIds : [this.state.modalModel1.post],
                },(error,data)=>{
                    if(!error){
                        this.props.modal1Show({isShow:false});
                        globalEvent.settings.settingsTeamInit.dispatch({
                            data : data
                        }) ;
                    }

                });
            }
            else{
                globalFunction.alert.warning('加入团队失败','操作提示');
            }

        }) ;
    }

    _evClick_adminChange(){
        service.settings.fetchSettingsTeam({
            tenantId: window.globalStore.getState().userstore.user.tenantId
        },(error,data)=>{
            this.props.layer2Mode({
                mode : 'changeAdmin' ,
                admin : data.data
            })
        }) ;
    }

    _evClick_adminChangeFinished(){
        if(this.state.filter.oldManagerId && this.state.filter.newManagerId){
            console.log(this.state.filter.newManagerId);
            service.settings.saveSettingUser({
                id : this.state.filter.oldManagerId,
                isAdmin : 1
            },(error,data)=>{
                globalEvent.settings.settingsTeamInit.dispatch({
                    data : data
                }) ;
            });
            service.settings.saveSettingUser({
                id : this.state.filter.newManagerId,
                isAdmin : 0
            },(error,data)=>{
                globalEvent.settings.settingsTeamInit.dispatch({
                    data : data
                }) ;
            });
            globalStore.dispatch(layer2Show({
                isShow : false
            }))　;
        }

    }
    //TODO


    //utils
    _class_tabShow(index){
        return className({
            'op-span1' : true ,
            'active' : ( this.props.settings.team.pageState.modal2Tab === index )?true:false ,
        }) ;
    }
    _class_contentShow(index){
        return className({
            'ope-other' : true ,
            'active' : ( this.props.settings.team.pageState.modal2Tab === index )?true:false ,
        }) ;
    }
    _class_layer1ContentShow(mode){
        return className({
            'content' : true ,
            isShow : this.props.settings.team.pageState.layer1Page === mode ? true : false
        })
    }
    _class_layer2HeaderShow(mode){
        return className({
            'header' : true ,
            isShow : this.props.settings.team.pageState.layer2Mode === mode ? true : false
        })
    }
    _class_layer2ContentShow(mode){
        return className({
            'content' : true ,
            isShow : ( this.props.settings.team.pageState.layer2Mode === mode ) ? true : false
        })
    }
    _class_layer2ContentShowEither(){
        var m = this.props.settings.team.pageState.layer2Mode ;
        return className({
            'content' : true ,
            isShow : ( m === 'admin' || m === 'member' ) ? true : false ,
        })
    }
    render(){
        var self = this ;
        const formItemLayout_layer1 = {
            labelCol : {span: 4} ,
            wrapperCol : {span: 14}
        } ;
        console.log(this.props.settings) ;
        return (
            <div>
                <div className="center-east-north">
                    <a className="active">我的团队</a>

                    <span className="operation">
                        {(this.state.valid.joinTeam)&&(
                            <Button
                                type="primary"
                                icon="heart-o"
                                onClick={(event)=>{
                                this.props.modal1Show({
                                    isShow : true ,
                                }) ;
                            }}
                            >加入团队</Button>
                        )
                        }

                        <Button
                            type="primary"
                            icon="notification"
                            onClick={(event)=>{
                                this.props.modal2Show({
                                    isShow : true ,
                                }) ;
                                this._eventInit() ;
                            }}
                        >邀请成员</Button>
                        {(this.state.valid.isAdmin == '0')&&(<Button
                            type="primary"
                            icon="plus-circle-o"
                            onClick={(event)=>{
                                this.props.layer1Show({
                                    isShow : true ,
                                }) ;
                            }}
                        >新增成员</Button>)}
                    </span>

                </div>
                <div className="center-east-center">

                    <QueueAnim>

                    <div className="search-wrap search-wrap-settings" key="anime-1">
                        <Input className="customer-input" onChange={(event)=>{
                            this.setState({
                                filter : {
                                    ...this.state.filter ,
                                    keyword : event.target.value ,
                                }
                            })
                        }} value={this.state.filter.keyword} placeholder="请输入成员姓名" />
                        <span className="searc-btn">
                            <Button
                                type="ghost"
                                icon="search"
                                onClick={this._ev_filterSearch.bind(this)}
                            >查询</Button>
                        </span>
                    </div>
                    <div className="tabel-wrap" key="anime-2">
                        <Table
                            dataSource={this.props.settings.team.dataSource.data}
                            columns={this.props.COLUMNS}
                            pagination={{
                            showSizeChanger : true ,

                            total : this.props.settings.team.totalCount ,

                            pageSize : this.state.pageSize ,

                            current :　this.state.currentPage ,

                            onShowSizeChange : (current , pageSize)=>{
                                var self = this;
                                self.setState({
                                    currentPage : 1 ,
                                    pageSize : pageSize
                                },()=> {
                                    var key = this.state.filter.keyword;
                                    if(key){
                                        service.settings.fetchSettingsTeam({
                                            memberName : key,
                                            tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                            pageSize :self.state.pageSize,
                                            pageNum : 1 ,
                                        },(error,data)=>{
                                            this.props.settingsTeamTable(data) ;
                                        }) ;
                                    }
                                    else{
                                        service.settings.initSettingsTeam({
                                            tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                            pageSize :self.state.pageSize,
                                            pageNum : 1 ,
                                        },(error,data)=>{
                                            this.props.settingsTeamInit(data) ;
                                        });
                                    }
                                });
                            },
                            onChange : (value)=>{
                                var self = this;
                                self.setState({
                                    currentPage : value
                                });
                                var key = this.state.filter.keyword;
                                if(key){
                                    service.settings.fetchSettingsTeam({
                                        memberName : key,
                                        tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                        pageSize :self.state.pageSize,
                                        pageNum : value ,
                                    },(error,data)=>{
                                        this.props.settingsTeamTable(data) ;
                                    }) ;
                                }
                                else{
                                    service.settings.initSettingsTeam({
                                        tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                        pageSize :self.state.pageSize,
                                        pageNum : value ,
                                    },(error,data)=>{
                                        this.props.settingsTeamInit(data) ;
                                    });
                                }
                            }
                        }}
                        >

                        </Table>
                    </div>

                    <Modal className="settingsteam-modal1" title="加入团队"
                            visible={this.props.settings.team.pageState.modal1Show}
                            onOk={()=>{this.props.modal1Show({isShow:false})}}
                            onCancel={()=>{this.props.modal1Show({isShow:false})}}
                            footer={
                                <div className="team-join">
                                    <Button type="primary" onClick={this._evClick_joinTeam.bind(this)}>加入团队</Button>
                                </div>
                            }
                    >
                        <div className="content">
                            <div className="co-title">输入邀请码加入团队</div>
                            <div className="co-input">
                                <Input value={this.state.modalModel1.invitationCode} onChange={(event)=>{
                                    this.setState({
                                        modalModel1 : {
                                            invitationCode : event.target.value
                                        }
                                    }) ;
                                }} />
                            </div>
                            <div className="line-table">
                                <FormItem
                                    label="角色"
                                >
                                    <span>
                                        <RadioGroup onChange={(event)=>{
                                        this.setState({
                                            ...this.state ,
                                            modalModel1 : {
                                                ...this.state.modalModel1 ,
                                                 post : event.target.value
                                            }
                                        })


                                        }} value={this.state.modalModel1.post} >
                                            <RadioButton value="1">老板</RadioButton>
                                            <RadioButton value="3">销售</RadioButton>
                                            <RadioButton value="4">采购</RadioButton>
                                            <RadioButton value="2">财务</RadioButton>
                                        </RadioGroup>
                                    </span>
                                </FormItem>
                            </div>
                        </div>
                    </Modal>

                    <Modal className="settingsteam-modal2" title="邀请成员"
                           visible={this.props.settings.team.pageState.modal2Show}
                           onOk={()=>{this.props.modal2Show({isShow:false})}}
                           onCancel={()=>{this.props.modal2Show({isShow:false})}}
                           footer={''}
                    >
                        {this.state.valid.invite==false?<div className="operation">
                            <span className={this._class_tabShow(1)} style={{border:'1px solid #ccc'}} >
                                <i></i>
                                <span>通过链接邀请</span>
                            </span>
                            <span className={this._class_tabShow(2)} style={{border:'1px solid #ccc'}} >
                                <i></i>
                                <span>邀请码</span>
                            </span>
                            <span className={this._class_tabShow(3)} style={{border:'1px solid #ccc'}} >
                                <i></i>
                                <span>二维码</span>
                            </span>
                            {(this.state.valid.isAdmin == '0')&&(<span className="op-span2"onClick={()=>{
                                globalEvent.settings.changeInvite.dispatch({
                                    data : true
                                })}}>
                                <i></i>
                                <span>开启此功能</span>
                            </span>)}
                        </div>
                            :
                        <div className="operation">
                                <span className={this._class_tabShow(1)} onClick={()=>{this.props.modal2TabChange({index:1})}}>
                                <i></i>
                                <span>通过链接邀请</span>
                                </span>
                                <span className={this._class_tabShow(2)} onClick={()=>{this.props.modal2TabChange({index:2})}}>
                                <i></i>
                                <span>邀请码</span>
                                </span>
                                <span className={this._class_tabShow(3)} onClick={()=>{this.props.modal2TabChange({index:3})}}>
                                <i></i>
                                <span>二维码</span>
                                </span>
                                {(this.state.valid.isAdmin == '0') && (<span className="op-span2" onClick={()=>{
                                globalEvent.settings.changeInvite.dispatch({
                                    data : false
                                })}}>
                                <i></i>
                                <span>关闭此功能</span>
                                </span>)}
                        </div>}
                        <div className="ope-content"  style={{overflow:'hidden'}}>
                            {
                                this.props.settings.team.inviteSource.data.map((value, index)=> {
                                    return (
                                        <div className="invite-lin" key={index}>
                                            <span className="invite-span1">{value.name}</span>
                                            <span className="invite-span2">{value.phone}</span>
                                                <span className="invite-span3">
                                                    <i></i>
                                                    <span>已加入</span>
                                                </span>
                                        </div>
                                    )
                                })
                            }
                            <div className={this._class_contentShow(1)}>
                                <Icon
                                    type="close-circle-o"
                                    onClick={()=>{this.props.modal2TabChange({index:0})}}
                                />

                                {/*<i onClick={()=>{this.props.modal2TabChange({index:0})}}></i>*/}
                                <span className="a-1">我们在使用西狮进销存, 进销记账非常方便</span>
                                <span className="a-2">好用又免费, 赶紧用起来。</span>
                                <textarea id="copy_text_invitemessage_2" value={this.props.settings.team.inviteMessage.inviteLink} />
                                <Button type="primary"
                                        className="a-3"
                                        data-clipboard-target="copy_text_invitemessage_2"
                                        data-clipboard-text="Default clipboard text from attribute"
                                        id="copy_button_invitemessage_2"
                                >复制</Button>
                            </div>
                            <div className={this._class_contentShow(2)}>
                                <Icon
                                    type="close-circle-o"
                                    onClick={()=>{this.props.modal2TabChange({index:0})}}
                                />
                                {/*<i onClick={()=>{this.props.modal2TabChange({index:0})}}></i>*/}
                                <span className="b-1">
                                    <span className="b-1-1">邀请码</span>
                                    <span className="b-1-2">{this.props.settings.team.inviteMessage.inviteCode}</span>
                                    <input id="copy_text_invitemessage" style={{display:'none'}} value={this.props.settings.team.inviteMessage.inviteCode} />
                                </span>
                                <span className="b-2">
                                    团队成员可凭邀请码加入团队。
                                </span>
                                <span className="b-3">
                                    为了保护您的数据不被泄露,请牢记邀请码,不可随意泄露。
                                </span>
                                <span className="b-4">
                                    我们在使用西狮进销存, 进销记账非常方便, 好用又免费, 赶紧用起来!
                                </span>
                                {/*<Button
                                    type="primary"
                                    className="b-5"
                                    target="copy_text_invitemessage"
                                    id="copy_button_invitemessage"
                                >复制</Button>*/}
                                <Button
                                    type="primary"
                                    className="b-5"
                                    data-clipboard-target="copy_text_invitemessage"
                                    data-clipboard-text="Default clipboard text from attribute"
                                    id="copy_button_invitemessage"
                                >复制</Button>
                            </div>
                            <div className={this._class_contentShow(3)}>
                                <Icon
                                    type="close-circle-o"
                                    onClick={()=>{this.props.modal2TabChange({index:0})}}
                                />
                                {/*<i onClick={()=>{this.props.modal2TabChange({index:0})}}></i>*/}
                                <span className="c-1">
                                    <img src={this.props.settings.team.inviteMessage.imgSrc} alt="西狮进销存"/>
                                </span>
                            </div>
                        </div>
                    </Modal>
                    
                    <Layer addClass="team-layer1" layerShow={this.props.settings.team.pageState.layer1Show} _handleLayerHide={()=>{this.props.layer1Show({isShow:false})}}>
                        <div className="header">
                            <span className="product-name">新增成员</span>
                            <div className="operation">
                                <a className="left-arrow"onClick={()=>{
                                        this.props.layer1Show({
                                            isShow : false ,
                                        }) ;
                                    }}>&lt;</a>
                                <a className="edit-arrow"onClick={()=>{
                                        globalEvent.settings.createTeamUser.dispatch({
                                            data : {
                                                id : this.state.layerModel1.modal.phone,
                                                password : this.state.layerModel1.modal.password
                                            }
                                        }) ;
                                    }}>
                                    <i></i>
                                    <span>保存</span>
                                </a>
                            </div>
                        </div>
                        <div className={this._class_layer1ContentShow('normal')}>
                            <Form horizontal className="form-static">
                                <FormItem
                                    {...{
                                        wrapperCol : {span: 14,offset:0}
                                    }}
                                    label=""
                                >
                                    <span className="ft-span">如该成员已注册点点账, 请<a onClick={()=>{this.props.layer1PageChange({page:'search'})}}>点击这里</a></span>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_layer1}
                                    label="姓名"
                                    validateStatus={this.state.validation.name_status}
                                    help={this.state.validation.name_help}
                                >
                                    <Input placeholder="" value={this.state.layerModel1.modal.name}
                                           onChange={(event)=>{
                                           var name_validation = service.validation.settings.form_personal.name(event.target.value) ;
                                            this.setState({
                                                layerModel1 : {
                                                    ...this.state.layerModel1 ,
                                                    modal : {
                                                        ...this.state.layerModel1.modal,
                                                        name : event.target.value
                                                    }
                                                },
                                                validation : {
                                                    ...this.state.validation ,
                                                    name_status : name_validation.validateStatus ,
                                                    name_help : name_validation.help ,
                                                }
                                            })
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_layer1}
                                    label="手机"
                                    validateStatus={this.state.validation.mobile_status}
                                    help={this.state.validation.mobile_help}
                                >
                                    <Input placeholder="" value={this.state.layerModel1.modal.phone}
                                           onChange={(event)=>{
                                           var mobile_validation = service.validation.settings.form_personal.mobile(event.target.value) ;
                                            this.setState({
                                                layerModel1 : {
                                                    ...this.state.layerModel1 ,
                                                    modal : {
                                                        ...this.state.layerModel1.modal,
                                                        phone : event.target.value
                                                    },
                                                    search : {
                                                        ...this.state.layerModel1.search,
                                                        keyword : event.target.value
                                                    }
                                                },
                                                validation : {
                                                    ...this.state.validation ,
                                                    mobile_status : mobile_validation.validateStatus ,
                                                    mobile_help : mobile_validation.help ,
                                                }
                                            })
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_layer1}
                                    label="密码"
                                    validateStatus={this.state.validation.password_status}
                                    help={this.state.validation.password_help}
                                >
                                    <Input placeholder="" value={this.state.layerModel1.modal.password}
                                           onChange={(event)=>{
                                           var password_validation = service.validation.settings.form_personal.password(event.target.value) ;
                                            this.setState({
                                                layerModel1 : {
                                                    ...this.state.layerModel1 ,
                                                    modal : {
                                                        ...this.state.layerModel1.modal,
                                                        password : event.target.value
                                                    }
                                                },
                                                validation : {
                                                    ...this.state.validation ,
                                                    password_status : password_validation.validateStatus ,
                                                    password_help : password_validation.help ,
                                                }
                                            })
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_layer1}
                                    label="角色"
                                >
                                    <span>
                                        <RadioGroup onChange={(event)=>{
                                            this.setState({
                                                layerModel1 : {
                                                    ...this.state.layerModel1 ,
                                                    modal : {
                                                        ...this.state.layerModel1.modal,
                                                        post : event.target.value
                                                    }
                                                }
                                            })
                                        }} value={self.state.layerModel1.modal.post} >
                                            <RadioButton value="1">老板</RadioButton>
                                            <RadioButton value="3">销售</RadioButton>
                                            <RadioButton value="4">采购</RadioButton>
                                            <RadioButton value="2">财务</RadioButton>
                                        </RadioGroup>
                                    </span>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_layer1}
                                    label="工号"
                                    validateStatus={this.state.validation.jobNumber_status}
                                    help={this.state.validation.jobNumber_help}
                                >
                                    <Input placeholder="" value={this.state.layerModel1.modal.jobNumber}
                                           onChange={(event)=>{
                                           var jobNumber_validation = service.validation.settings.form_personal.jobNumber(event.target.value) ;
                                            this.setState({
                                                layerModel1 : {
                                                    ...this.state.layerModel1 ,
                                                    modal : {
                                                        ...this.state.layerModel1.modal,
                                                        jobNumber : event.target.value
                                                    }
                                                },
                                                validation : {
                                                    ...this.state.validation ,
                                                    jobNumber_status : jobNumber_validation.validateStatus ,
                                                    jobNumber_help : jobNumber_validation.help ,
                                                }
                                            })
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_layer1}
                                    label="邮箱"
                                    validateStatus={this.state.validation.email_status}
                                    help={this.state.validation.email_help}
                                >
                                    <Input placeholder="" value={this.state.layerModel1.modal.email}
                                           onChange={(event)=>{
                                           var email_validation = service.validation.settings.form_personal.email(event.target.value) ;
                                            this.setState({
                                                layerModel1 : {
                                                    ...this.state.layerModel1 ,
                                                    modal : {
                                                        ...this.state.layerModel1.modal,
                                                        email : event.target.value
                                                    }
                                                },
                                                validation : {
                                                    ...this.state.validation ,
                                                    email_status : email_validation.validateStatus ,
                                                    email_help : email_validation.help ,
                                                }
                                            })
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_layer1}
                                    label="分机"
                                >
                                    <Input placeholder="" value={this.state.layerModel1.modal.extension}
                                           onChange={(event)=>{
                                           this.setState({
                                                layerModel1 : {
                                                    ...this.state.layerModel1 ,
                                                    modal : {
                                                        ...this.state.layerModel1.modal,
                                                        extension : event.target.value
                                                    }
                                                }
                                            })
                                        }}
                                    />
                                </FormItem>
                            </Form>
                        </div>
                        <div className={this._class_layer1ContentShow('search')}>
                            <div className="l1-title">请输入该成员注册点点账的手机号码。如没有注册, 请<a onClick={()=>{this.props.layer1PageChange({page:'normal'})}}>注册新用户</a></div>
                            <div className="l1-search">
                                <span>
                                    <Input value={this.state.layerModel1.search.keyword}
                                        onChange={(event)=>{
                                            this.setState({
                                                layerModel1 : {
                                                    ...this.state.layerModel1 ,
                                                    search : {
                                                        ...this.state.layerModel1.search,
                                                        keyword : event.target.value
                                                    },
                                                    modal : {
                                                        ...this.state.layerModel1.modal,
                                                        phone : event.target.value
                                                    }
                                                }
                                            })
                                        }}
                                    />
                                </span>
                                <span>
                                    <Button type="ghost" className="l1-btn" onClick={this._ev_click_searchPhone.bind(this)}>查询</Button>
                                </span>
                            </div>
                            <div className="l1-result">
                                {
                                    this.props.settings.team.searchPhone.data.map(function(value,index){
                                        return (
                                            <div className="each-result" key={index}>
                                                <div className="line-table">
                                                    <span className="attr">姓名</span>
                                                    <span className="value">{value.name}</span>
                                                </div>
                                                <div className="line-table">
                                                    <span className="attr">手机号码</span>
                                                    <span className="value">{value.phone}</span>
                                                </div>
                                                <div className="line-table">
                                                    <span className="attr">公司</span>
                                                    <span className="value">{value.company}</span>
                                                </div>
                                                <div className="line-table">
                                                    <span className="attr">角色</span>
                                                    <span className="value">
                                                        <RadioGroup onChange={(event)=>{
                                                                        /*
                                                                        this.setState({
                                                                            layerModel1 : {
                                                                                ...this.state.layerModel1 ,
                                                                                search : {
                                                                                    ...this.state.layerModel1.search ,
                                                                                    member : this.state.layerModel1.search.member.map(function(v,i) {
                                                                                        if ( i === index ){
                                                                                            return {
                                                                                                ...v ,
                                                                                                post : event.target.value ,
                                                                                            }
                                                                                        } else {
                                                                                            return v ;
                                                                                        }
                                                                                    }) ,
                                                                                }
                                                                            }
                                                                        })
                                                                        */
                                                                    }}
                                                                    /*value={self.state.layerModel1.search.member[index].post}*/
                                                                    value={value.post} >
                                                            <RadioButton value="1">老板</RadioButton>
                                                            <RadioButton value="3">销售</RadioButton>
                                                            <RadioButton value="4">采购</RadioButton>
                                                            <RadioButton value="2">财务</RadioButton>
                                                        </RadioGroup>
                                                    </span>
                                                </div>
                                                <div className="line-table">
                                                    <span className="attr">工号</span>
                                                    <span className="value">{value.jobNumber}</span>
                                                </div>
                                                <div className="line-table">
                                                    <span className="attr">电子邮箱</span>
                                                    <span className="value">{value.email}</span>
                                                </div>
                                                <div className="line-table">
                                                    <span className="attr">分机</span>
                                                    <span className="value">{value.extension}</span>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </Layer>

                    <Layer addClass="team-layer2" layerShow={this.props.settings.team.pageState.layer2Show} _handleLayerHide={()=>{this.props.layer2Show({isShow:false})}}>
                        <div className={this._class_layer2HeaderShow('admin')}>
                            {/*<span></span>*/}
                            <div className="operation">
                                <a className="left-arrow"
                                   onClick={(event)=>{
                                        globalStore.dispatch(layer2Show({
                                            isShow : false
                                        }))　;
                               }}>&lt;</a>
                                <a className="edit-arrow"onClick={()=>{
                                        globalEvent.settings.saveSettingUser.dispatch({
                                            data : this.state.layerModel2.modal
                                        }) ;
                                    }}>
                                    <i></i>
                                    <span>保存</span>
                                </a>
                                <a className="edit-arrow-2" onClick={this._evClick_adminChange.bind(this)}>
                                    <i></i>
                                    <span>转让管理员</span>
                                </a>
                            </div>
                        </div>
                        <div className={this._class_layer2HeaderShow('changeAdmin')}>
                            {/*<span></span>*/}
                            <div className="operation">
                                <a className="left-arrow"
                                   onClick={(event)=>{
                                        globalStore.dispatch(layer2Show({
                                            isShow : false
                                        }))　;
                                    }}
                                >&lt;</a>
                                <a className="edit-arrow-2"  onClick={this._evClick_adminChangeFinished.bind(this)}>
                                    <i></i>
                                    <span>转让管理员</span>
                                </a>
                            </div>
                        </div>
                        <div className={this._class_layer2HeaderShow('member')}>
                            {/*<span></span>*/}
                            <div className="operation">
                                <a className="left-arrow"
                                   onClick={()=>{
                                        this.props.layer2Show(false,{})
                                    }}>&lt;</a>
                                <a className="edit-arrow"
                                   onClick={()=>{
                                        globalEvent.settings.saveSettingUser.dispatch({
                                            data : this.state.layerModel2.modal
                                        }) ;
                                    }}>
                                    <i></i>
                                    <span>保存</span>
                                </a>
                                {(globalStore.getState().userstore.user.isAdmin == '0') && (
                                    <a className="edit-arrow-2"
                                       onClick={()=>{
                                        this.props.layer2Show(false,{});
                                        service.settings.deleteSettingUser({
                                             id : this.state.layerModel2.modal.userId
                                        },(error,data)=>{
                                            globalEvent.settings.settingsTeamInit.dispatch({
                                                data : data
                                            }) ;
                                        });
                                    }}>
                                        <i></i>
                                        <span>彻底删除</span>
                                    </a>
                                )}

                            </div>
                        </div>

                        <div className={this._class_layer2ContentShowEither()}>
                            <Form horizontal className="form-static">
                                <FormItem
                                    {...formItemLayout_layer1}
                                    label="姓名"
                                    validateStatus={this.state.validation.edit_name_status}
                                    help={this.state.validation.edit_name_help}
                                >
                                    <Input placeholder="" value={this.state.layerModel2.modal.name}
                                           onChange={(event)=>{
                                                var edit_name_validation = service.validation.settings.form_personal.name(event.target.value) ;
                                                this.setState({
                                                    ...this.state ,
                                                    layerModel2 : {
                                                        ...this.state.layerModel2 ,
                                                        modal : {
                                                            ...this.state.layerModel2.modal ,
                                                            name : event.target.value
                                                        }
                                                    },
                                                    validation : {
                                                        ...this.state.validation ,
                                                        edit_name_status : edit_name_validation.validateStatus ,
                                                        edit_name_help : edit_name_validation.help ,
                                                    }
                                                })
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_layer1}
                                    label="手机号码"
                                    validateStatus={this.state.validation.edit_mobile_status}
                                    help={this.state.validation.edit_mobile_help}
                                >
                                    <Input placeholder="" value={this.state.layerModel2.modal.phone}
                                           onChange={(event)=>{
                                           var edit_mobile_validation = service.validation.settings.form_personal.mobile(event.target.value) ;
                                            this.setState({
                                                ...this.state ,
                                                layerModel2 : {
                                                    ...this.state.layerModel2 ,
                                                    modal : {
                                                        ...this.state.layerModel2.modal ,
                                                        phone : event.target.value
                                                    }
                                                },
                                                validation : {
                                                    ...this.state.validation ,
                                                    edit_mobile_status : edit_mobile_validation.validateStatus ,
                                                    edit_mobile_help : edit_mobile_validation.help ,
                                                }
                                            })
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_layer1}
                                    label="角色"
                                >
                                    <span>
                                        <RadioGroup onChange={(event)=>{
                                        if(globalStore.getState().userstore.user.isAdmin == '0'){
                                            this.setState({
                                                ...this.state ,
                                                layerModel2 : {
                                                    ...this.state.layerModel2 ,
                                                    modal : {
                                                        ...this.state.layerModel2.modal ,
                                                        post : event.target.value
                                                    }
                                                }
                                            })
                                        }

                                        }} value={this.state.layerModel2.modal.post} >
                                            <RadioButton value="1">老板</RadioButton>
                                            <RadioButton value="3">销售</RadioButton>
                                            <RadioButton value="4">采购</RadioButton>
                                            <RadioButton value="2">财务</RadioButton>
                                        </RadioGroup>
                                    </span>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_layer1}
                                    label="工号"
                                    validateStatus={this.state.validation.edit_jobNumber_status}
                                    help={this.state.validation.edit_jobNumber_help}
                                >
                                    <Input placeholder="" value={this.state.layerModel2.modal.jobNumber}
                                           onChange={(event)=>{
                                           var edit_jobNumber_validation = service.validation.settings.form_personal.jobNumber(event.target.value) ;
                                            this.setState({
                                                ...this.state ,
                                                layerModel2 : {
                                                    ...this.state.layerModel2 ,
                                                    modal : {
                                                        ...this.state.layerModel2.modal ,
                                                        jobNumber : event.target.value
                                                    }
                                                },
                                                validation : {
                                                    ...this.state.validation ,
                                                    edit_jobNumber_status : edit_jobNumber_validation.validateStatus ,
                                                    edit_jobNumber_help : edit_jobNumber_validation.help ,
                                                }
                                            })
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_layer1}
                                    label="电子邮箱"
                                    validateStatus={this.state.validation.edit_email_status}
                                    help={this.state.validation.edit_email_help}
                                >
                                    <Input placeholder="" value={this.state.layerModel2.modal.email}
                                           onChange={(event)=>{
                                           var edit_email_validation = service.validation.settings.form_personal.email(event.target.value) ;
                                            this.setState({
                                                ...this.state ,
                                                layerModel2 : {
                                                    ...this.state.layerModel2 ,
                                                    modal : {
                                                        ...this.state.layerModel2.modal ,
                                                        email : event.target.value
                                                    }
                                                },
                                                validation : {
                                                    ...this.state.validation ,
                                                    edit_email_status : edit_email_validation.validateStatus ,
                                                    edit_email_help : edit_email_validation.help ,
                                                }
                                            })
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_layer1}
                                    label="分机"
                                >
                                    <Input placeholder="" value={this.state.layerModel2.modal.extension}
                                           onChange={(event)=>{
                                            this.setState({
                                                ...this.state ,
                                                layerModel2 : {
                                                    ...this.state.layerModel2 ,
                                                    modal : {
                                                        ...this.state.layerModel2.modal ,
                                                        extension : event.target.value
                                                    }
                                                }
                                            })
                                        }}
                                    />
                                </FormItem>
                            </Form>
                        </div>
                        <div className={this._class_layer2ContentShow('changeAdmin')}>
                            <RadioGroup value={this.state.filter.newManagerId} onChange={(event)=> {
                                console.log(event.target);
                                globalEvent.settings.chooseManager.dispatch({
                                        data : event.target.value,

                                }) ;

                            }}>
                                {
                                    this.props.settings.team.adminSource.data.map(function(value,index){
                                        return (
                                            <Radio
                                                className="admin-line"
                                                key={index}
                                                value={value.userId}
                                            >
                                                {value.name}
                                                <span className="phone">{value.phone}</span>
                                            </Radio>
                                        )
                                    })
                                }
                            </RadioGroup>
                            {/*{
                                this.props.settings.team.adminSource.data.map(function(value,index){
                                    return (
                                        <div className="admin-line" key={index} value={value.id}>
                                            <Checkbox
                                                onChange={
                                                (event)=>{
                                                    globalEvent.settings.chooseManager.dispatch({
                                                        data : value.userId,
                                                        index : index
                                                    }) ;
                                                }
                                            }
                                            >{value.name}</Checkbox>
                                            <span className="phone">{value.phone}</span>
                                        </div>
                                    )
                                })
                            }*/}

                        </div>
                    </Layer>
                    </QueueAnim>
                </div>
            </div>

        )

    }

}

Se_Team.defaultProps = {
    COLUMNS : COLUMNS ,
}

export default connect(
    (state) => {
        var settings = state.settings ;
        return {
            settings
        }
    },
    {
        settingsTeamInit ,
        settingsTeamInitInvite,
        settingsTeamTable ,
        settingsTeamSearchPhone ,
        settingsTeamInviteTable ,
        settingsTeamAdminTable ,
        modal1Show ,
        modal2Show ,
        modal2TabChange,
        layer1Show ,
        layer1PageChange ,
        layer2Show ,
        layer2Mode
    }
)(Se_Team)
