import React from 'react'
import { connect , dispatch } from 'react-redux'
import { push } from 'react-router-redux'
import moment from 'moment'
import className from 'classnames'
import {
    Layer
} from '../../../index'
import {
    Button , Pagination , Select , Input , DatePicker , Table , Form , Modal ,
    Upload ,
    Row , Col ,
    Icon
} from 'antd/dist/antd.js'
const Option = Select.Option;
const FormItem = Form.Item ;
import * as service from '../../../../service'
import {
    initSettingsPersonal ,
    settingsPersonalModal1Show
} from '../../../../actions/settings.js'
import {
    SEX_TYPE_MAP ,
    POST_TYPE_MAP ,
} from '../../../../constants'

class Se_A_Personal extends React.Component {

    constructor(props){
        super(props) ;
        this.state = {
            modal_resetPassword : {
                oldPassword : '' ,
                newPassword : '' ,
            },
            validation : {
                oldPassword_status : '',
                oldPassword_help : '',
                newPassword_status : '',
                newPassword_help : ''
            }
        }
    }
    componentDidMount(){

        $( '.show-pure.company-link').removeClass( 'active' ) ;

        service.settings.initSettingsPersonal({

        },(error,data)=>{
            this.props.initSettingsPersonal(data) ;
        }) ;
    }

    _ev_click_editPassword(){
        console.log(this.state.modal_resetPassword) ;
        // 旧密码和新密码不能为空，用户名限制15位，密码限制24位
        var oldP = this.state.modal_resetPassword.oldPassword ;
        var newP = this.state.modal_resetPassword.newPassword ;
        if ( service.validation.settings.form_personal.password(oldP).validateStatus == 'error'||
            service.validation.settings.form_personal.password(newP).validateStatus == 'error'){
            globalFunction.alert.warning( '请正确填写您的表单信息' , '表单验证' ) ;
            return ;
        }

        service.settings.editPassword({
            "usersParameter": {
                // account : this.props.settings.personal.details.data.account ,
                id : this.props.settings.personal.details.data.id ,
                //
                password : oldP ,
                newPassword : newP ,
            }
        },(data)=>{
            if ( data.mark== '000000000' ){
                globalFunction.alert.info( '密码修改成功!' , '操作提示' ) ;
                this.props.settingsPersonalModal1Show(false) ;
            } else {
                globalFunction.alert.warning( '请输入正确密码' , '操作提示' ) ;
            }
        }) ;
    }

    render(){
        const details = this.props.settings.personal.details.data ;
        const formItemLayout = {
            labelCol : {span:5} ,
            wrapperCol : {span:19}
        }
        const formItemLayout_editBtn = {
            wrapperCol : {span:8,offset:5}
        }
        const formItemLayout_modal1 = {
            labelCol : {span:4} ,
            wrapperCol : {span:16,offset:1}
        }
        if ( !details.id ){
            return (
                <span></span>
            )
        }
        return (
            <div className="personal-wrap">
                <Form horizontal className="form-static">
                    <FormItem
                        {...formItemLayout}
                        label="账号ID"
                    >
                        <span>
                            <span>{details.id}</span>
                            <span className="modalopen-edit" onClick={()=>{
                                this.props.settingsPersonalModal1Show(true) ;
                                this.setState({
                                    modal_resetPassword : {
                                        newPassword : '' ,
                                        oldPassword : '' ,
                                    }
                                })
                            }}>
                                <i></i>
                                <a>修改密码</a>
                            </span>
                        </span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="姓名"
                    >
                        <span>{details.memberName}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="性别"
                    >
                        <span>{ SEX_TYPE_MAP[ details.gender ]}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="职务"
                    >
                        <span>
                            {
                                details.roleIds.map((v)=>{
                                    return POST_TYPE_MAP[ v+'' ]
                                }).join(' ') || '尚未选择职务'
                            }
                        </span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="手机号码"
                    >
                        <span>{details.account}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="固定号码"
                    >
                        <span>{details.telephone}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="电子邮箱"
                    >
                        <span>{details.mailAddress}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="QQ"
                    >
                        <span>{details.qq}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="微信号"
                    >
                        <span>{details.wechat}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="传真"
                    >
                        <span>{details.fax}</span>
                    </FormItem>
                    <FormItem
                        className="formitem-submit-btn"
                        {...formItemLayout_editBtn}
                    >
                        <Button className="submit-btn" type="primary" onClick={(ev)=>{
                            globalStore.dispatch(push('/settings/se_account/se_a_personaledit')) ; //route change
                        }}>编辑</Button>
                    </FormItem>
                </Form>

                <Modal className="settings-modal1" title={'修改密码'} visible={this.props.settings.personal.pageState.modalShow1}
                    onOk={this._ev_click_editPassword.bind(this)}
                    onCancel={()=>{
                        this.props.settingsPersonalModal1Show(false) ;
                    }}
                >
                    <Form horizontal className="form-static">
                        <FormItem
                            {...formItemLayout_modal1}
                            label="旧密码"
                            validateStatus={this.state.validation.oldPassword_status}
                            help={this.state.validation.oldPassword_help}
                        >
                            <span>
                                <Input type="password" value={this.state.modal_resetPassword.oldPassword} onChange={(event)=>{
                                    var oldPassword_validation = service.validation.settings.form_personal.password(event.target.value)
                                    this.setState({
                                        modal_resetPassword : {
                                            ...this.state.modal_resetPassword ,
                                            oldPassword : event.target.value
                                        },
                                        validation : {
                                            ...this.state.validation ,
                                            oldPassword_status : oldPassword_validation.validateStatus ,
                                            oldPassword_help : oldPassword_validation.help ,
                                        }
                                    })
                                }} />
                            </span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout_modal1}
                            label="新密码"
                            validateStatus={this.state.validation.newPassword_status}
                            help={this.state.validation.newPassword_help}
                        >
                            <span>
                                <Input type="password" value={this.state.modal_resetPassword.newPassword} onChange={(event)=>{
                                    var newPassword_validation = service.validation.settings.form_personal.password(event.target.value)
                                    this.setState({
                                        modal_resetPassword : {
                                            ...this.state.modal_resetPassword ,
                                            newPassword : event.target.value
                                        },
                                        validation : {
                                            ...this.state.validation ,
                                            newPassword_status : newPassword_validation.validateStatus ,
                                            newPassword_help : newPassword_validation.help ,
                                        }
                                    })
                                }} />
                            </span>
                        </FormItem>
                    </Form>
                </Modal>

            </div>

        )

    }


} ;

export default connect(
    (state) => {
        var settings = state.settings ;
        var userstore = state.userstore ;
        return {
            settings ,
            userstore ,
        }
    },
    {
        initSettingsPersonal ,
        settingsPersonalModal1Show ,
    }
)(Se_A_Personal)
