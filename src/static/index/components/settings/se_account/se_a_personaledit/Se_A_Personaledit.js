import React from 'react'
import { connect , dispatch } from 'react-redux'
import {push} from 'react-router-redux'
import moment from 'moment'
import className from 'classnames'
import {
    Layer
} from '../../../index'
import {
    Button , Pagination , Select , Input , DatePicker , Table , Form , Modal , Radio , Checkbox ,
    Upload ,
    Row , Col ,
    Icon
} from 'antd/dist/antd.js'
const Option = Select.Option;
const FormItem = Form.Item ;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

import * as service from '../../../../service'
import {

} from '../../../../actions/settings.js'
import {
    initAuthMessage
} from '../../../../actions/userstore.js'
import {
    POST_TYPE
} from '../../../../constants/index.js'
let POST_TYPE_MAP_ARREY = POST_TYPE.map((v)=>{
    return {
        label : v.name ,
        value : v.value
    }
}) ;

class Se_A_Personaledit extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            details : this.props.settings.personal.details.data ,
            validation : {
                name_status : '' ,
                name_help : '' ,
                staticPhone_status : '' ,
                staticPhone_help : '' ,
                mobile_status : '',
                mobile_help : '',
                email_status : '' ,
                email_help :  '' ,
                qq_status : '',
                qq_help : '',
                wx_status : '',
                wx_help : '',
                cz_status : '',
                cz_help : ''
            } ,
        }
    }
    componentDidMount(){
        $( '.show-pure.personal-link' ).addClass( 'active' ) ;
        $( '.show-pure.company-link').removeClass( 'active' ) ;
    }
    _ev_editPersonal_save(){
        if ( service.validation.settings.form_personal.name(this.state.details.memberName).validateStatus == 'error' ||
            service.validation.settings.form_personal.staticPhone(this.state.details.telephone).validateStatus == 'error'
        ){
            globalFunction.alert.warning( '请正确填写您的表单信息' , '表单验证' ) ;
            return ;
        }
        service.settings.editPersonal({
            "usersParameter" : {
                id : this.state.details.id ,
                //
                memberName : this.state.details.memberName ,
                gender : this.state.details.gender ,
                roleIds : this.state.details.roleIds ,
                telephone : this.state.details.telephone ,
                qq : this.state.details.qq ,
                wechat : this.state.details.wechat ,
                fax : this.state.details.fax,
                mailAddress : this.state.details.mailAddress
            }
        },(result)=>{
            if (result.mark == '000000000' ){
                service.userstore.fetchUserInfo({
                    id : this.state.details.id ,
                },(result)=> {
                    if ( result.mark == '000000000' ){
                        this.props.initAuthMessage( result.data.user ) ;
                        globalFunction.alert.info( '更新用户数据成功'　,　'提示'　) ;
                        globalStore.dispatch(push('/settings/se_account/se_a_personal')) ;
                        // window.location.href = '/settings/se_account/se_a_company' ;
                    } else {
                        globalFunction.alert.warning( result.messages　,　'提示'　) ;
                    }
                }) ;
            } else {
                globalFunction.alert.warning( result.messages　,　'提示'　) ;
            }
        }) ;
    }
    render(){
        const formItemLayout = {
            labelCol : {span:5} ,
            wrapperCol : {span:15}
        }
        const formItemLayout_editBtn = {
            wrapperCol : {span:15,offset:5}
        }
        if ( !this.state.details.id ){
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
                        <Input
                            value={this.state.details.id}
                            disabled={true}
                            onChange={(event)=>{
                                this.setState({
                                    details : {
                                        ...this.state.details ,
                                        id : event.target.value
                                    }
                                })
                            }}
                        />
                    </span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="姓名"
                        validateStatus={this.state.validation.name_status}
                        help={this.state.validation.name_help}
                    >
                    <span>
                        <Input
                            value={this.state.details.memberName}
                            onChange={(event)=>{
                                var name_validation = service.validation.settings.form_personal.name(event.target.value) ;
                                this.setState({
                                    details : {
                                        ...this.state.details ,
                                        memberName : event.target.value
                                    },
                                    validation : {
                                        ...this.state.validation ,
                                        name_status : name_validation.validateStatus ,
                                        name_help : name_validation.help ,
                                    }
                                })
                            }}
                        />
                    </span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="性别"
                    >
                    <span>
                        <RadioGroup onChange={(event)=>{
                            this.setState({
                                details : {
                                    ...this.state.details ,
                                    gender : event.target.value ,
                                }
                            })
                        }} value={this.state.details.gender == null ? '1' : this.state.details.gender}>
                            <RadioButton value="1">男</RadioButton>
                            <RadioButton value="0">女</RadioButton>
                        </RadioGroup>
                    </span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="职务"
                    >
                    <span>
                        <RadioGroup onChange={(event)=>{
                        var tarID = event.target.value;
                        if(window.globalStore.getState().userstore.user.isAdmin == '0' || window.globalStore.getState().userstore.user.tenantId == null || window.globalStore.getState().userstore.user.tenantId == ''){
                            this.setState({
                                details : {
                                    ...this.state.details ,
                                    roleIds : typeof tarID === 'undefined' ? [] : [ tarID-0 ] ,
                                }
                            })
                        }

                        }} value={this.state.details.roleIds[0]}>
                            {
                                POST_TYPE_MAP_ARREY.map((v,i)=> {
                                    return <RadioButton value={v.value} key={i}>{v.label}</RadioButton>
                                })
                            }
                        </RadioGroup>
                        {/*<CheckboxGroup
                            options={POST_TYPE_MAP_ARREY}
                            value={
                                this.state.details.roleIds.map((v)=>{
                                    return v - 0 ;
                                })
                            }
                            onChange={(checkedValues)=>{
                                var tarID = checkedValues.pop() ;
                                this.setState({
                                    details : {
                                        ...this.state.details ,
                                        roleIds : typeof tarID === 'undefined' ? [] : [ tarID - 0 ]
                                    }
                                });
                            }}
                        />*/}
                    </span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="手机号码"
                        validateStatus={this.state.validation.mobile_status}
                        help={this.state.validation.mobile_help}
                    >
                    <span>
                        <Input 
                            value={this.state.details.account} 
                            disabled={true}
                            onChange={(event)=>{
                                var mobile_validation = service.validation.settings.form_personal.mobile(event.target.value) ;
                                this.setState({
                                    details : {
                                        ...this.state.details ,
                                        account : event.target.value
                                    },
                                    validation : {
                                        ...this.state.validation ,
                                        mobile_status : mobile_validation.validateStatus ,
                                        mobile_help : mobile_validation.help ,
                                    }
                                })
                            }}
                        />
                    </span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="固定号码"
                        validateStatus={this.state.validation.staticPhone_status}
                        help={this.state.validation.staticPhone_help}
                    >
                    <span>
                        <span className="b-span1 b-span">
                            <Input placeholder="区号" value={this.state.details.telephone == null ? '' : this.state.details.telephone.split('-')[0]}
                                   onChange={(event)=>{
                                    var staticPhone = service.utils.string.staticPhoneChange({
                                        staticPhone : this.state.details.telephone ,
                                        curStr : event.target.value ,
                                        index : 1
                                    }) ;
                                    var validation = service.validation.settings.form_personal.staticPhone(staticPhone) ;
                                    this.setState({
                                        details : {
                                            ...this.state.details ,
                                            telephone : staticPhone
                                        },
                                        validation : {
                                            ...this.state.validation ,
                                            staticPhone_status : validation.validateStatus ,
                                            staticPhone_help : validation.help ,
                                        }
                                    })

                                }}
                            />
                        </span>
                        <span className="b-span2 b-span">-</span>
                        <span className="b-span3 b-span">
                            <Input placeholder="座机号" value={this.state.details.telephone == null ? '' : this.state.details.telephone.split('-')[1]}
                                   onChange={(event)=>{
                                    var staticPhone = service.utils.string.staticPhoneChange({
                                        staticPhone : this.state.details.telephone ,
                                        curStr : event.target.value ,
                                        index : 2
                                    }) ;
                                    var validation = service.validation.settings.form_personal.staticPhone(staticPhone) ;
                                     
                                    this.setState({
                                        details : {
                                            ...this.state.details ,
                                            telephone : staticPhone
                                        },
                                        validation : {
                                            ...this.state.validation ,
                                            staticPhone_status : validation.validateStatus ,
                                            staticPhone_help : validation.help ,
                                        }
                                    })

                                }}
                            />
                        </span>
                        <span className="b-span4 b-span">-</span>
                        <span className="b-span5 b-span">
                            <Input placeholder="分机号" value={this.state.details.telephone == null ? '' : this.state.details.telephone.split('-')[2]}
                                   onChange={(event)=>{ 
                                    var staticPhone = service.utils.string.staticPhoneChange({
                                        staticPhone : this.state.details.telephone ,
                                        curStr : event.target.value ,
                                        index : 3
                                   }) ;
                                   var validation = service.validation.settings.form_personal.staticPhone(staticPhone) ;
                                    this.setState({
                                        details : {
                                            ...this.state.details ,
                                            telephone : staticPhone
                                        } ,
                                        validation : {
                                            ...this.state.validation ,
                                            staticPhone_status : validation.validateStatus ,
                                            staticPhone_help : validation.help ,
                                        }
                                    })
                                }}
                            />
                        </span>
                    </span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="电子邮箱"
                        validateStatus={this.state.validation.email_status}
                        help={this.state.validation.email_help}
                    >
                    <span>
                        <Input 
                            value={this.state.details.mailAddress}
                            onChange={(event)=>{
                                var email_validation = service.validation.settings.form_personal.email(event.target.value) ;
                                this.setState({
                                    details : {
                                        ...this.state.details ,
                                        mailAddress : event.target.value
                                    } ,
                                    validation : {
                                    ...this.state.validation ,
                                    email_status : email_validation.validateStatus ,
                                    email_help : email_validation.help ,
                                }
                                })
                            }}
                        />
                    </span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="QQ"
                        validateStatus={this.state.validation.qq_status}
                        help={this.state.validation.qq_help}
                    >
                    <span>
                        <Input value={this.state.details.qq} onChange={(event)=>{
                            var qq_validation = service.validation.settings.form_personal.qq(event.target.value) ;
                            this.setState({
                                details : {
                                    ...this.state.details ,
                                    qq : event.target.value
                                },
                                validation : {
                                    ...this.state.validation ,
                                    qq_status : qq_validation.validateStatus ,
                                    qq_help : qq_validation.help ,
                                }
                            })
                        }}/>
                    </span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="微信号"
                        validateStatus={this.state.validation.wx_status}
                        help={this.state.validation.wx_help}
                    >
                    <span>
                        <Input value={this.state.details.wechat} onChange={(event)=>{
                            var wx_validation = service.validation.settings.form_personal.wx(event.target.value) ;
                            this.setState({
                                details : {
                                    ...this.state.details ,
                                    wechat: event.target.value
                                },
                                validation : {
                                    ...this.state.validation ,
                                    wx_status : wx_validation.validateStatus ,
                                    wx_help : wx_validation.help ,
                                }
                            })
                        }}/>
                    </span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="传真"
                        validateStatus={this.state.validation.cz_status}
                        help={this.state.validation.cz_help}
                    >
                    <span>
                        <Input value={this.state.details.fax} onChange={(event)=>{
                            var cz_validation = service.validation.settings.form_personal.wx(event.target.value);
                            this.setState({
                                details : {
                                    ...this.state.details ,
                                    fax : event.target.value
                                },
                                validation : {
                                    ...this.state.validation ,
                                    cz_status : cz_validation.validateStatus ,
                                    cz_help : cz_validation.help ,
                                }
                            })
                        }}/>
                    </span>
                    </FormItem>
                    <FormItem
                        className="formitem-submit-btn"
                        {...formItemLayout_editBtn}
                    >
                    <span>
                        <Button
                            className="submit-btn-left"
                            type="primary"
                            onClick={this._ev_editPersonal_save.bind(this)}>保存</Button>
                        <Button className="submit-btn-right" type="ghost" onClick={()=>{
                            globalStore.dispatch(push('/settings/se_account/se_a_personal')) ; //route change
                        }}>取消</Button>
                    </span>
                    </FormItem>
                </Form>
            </div>
        )

    }

}

export default connect(
    (state) => {
        var settings = state.settings ;
        return {
            settings
        }
    },
    {
        initAuthMessage
    }
)(Se_A_Personaledit)
