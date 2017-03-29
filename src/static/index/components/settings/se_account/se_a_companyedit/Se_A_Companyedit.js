import React from 'react'
import { connect , dispatch } from 'react-redux'
import { push } from 'react-router-redux'
import moment from 'moment'
import className from 'classnames'
import {
    Layer
} from '../../../index'
import {
    Button , Pagination , Select , Input , DatePicker , Table , Form , Modal , Cascader ,
    Upload ,
    Row , Col ,
    Icon
} from 'antd/dist/antd.js'
import {
    TOKEN_NAME,
    TENANT_ID
} from '../../../../constants' ;
import utils from '../../../../service/utils/index'
const Option = Select.Option;
const FormItem = Form.Item ;
import * as service from '../../../../service'
import {

} from '../../../../actions/settings.js'
import {
    initAuthMessage
} from '../../../../actions/userstore.js'
class Se_A_Companyedit extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            details : this.props.settings.company.details.data ,
        }
    }
    componentDidMount(){
        $( '.show-pure.personal-link' ).removeClass( 'active' ) ;
        $( '.show-pure.company-link').addClass( 'active' ) ;
    }
    _ev_editCompany_save(){
        console.log(this.state) ;
        service.settings.editCompany({
            tenantParameter : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                //
                tenantName : this.state.details.tenantName ,
                addressId : this.state.details.tenantAddressId ,
                address : this.state.details.tenantAddress ,
            }
        },(result)=>{
            if (result.mark == '000000000' ){
                console.log( result ) ;
                service.userstore.fetchUserInfo({
                    id : this.state.details.id ,
                },(result)=> {
                    if ( result.mark == '000000000' ){
                        this.props.initAuthMessage( result.data.user ) ;
                        globalFunction.alert.info( '更新用户数据成功'　,　'提示'　) ;
                        globalStore.dispatch(push('/settings/se_account/se_a_company')) ;
                        //globalStore.dispatch(push('/settings/se_account/se_a_personal')) ;
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
        return (
            <div className="personal-wrap">
                <Form horizontal className="form-static">
                    <FormItem
                        {...formItemLayout}
                        label="公司全称"
                    >
                        <span>
                            <Input value={this.state.details.tenantName} onChange={(event)=>{
                            if(window.globalStore.getState().userstore.user.isAdmin == '0' || window.globalStore.getState().userstore.user.tenantId == null || window.globalStore.getState().userstore.user.tenantId == ''){
                                this.setState({
                                    details : {
                                        ...this.state.details ,
                                        // company : event.target.value
                                        tenantName : event.target.value ,
                                    }
                                })
                            }

                            }} />
                        </span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="公司所在地"
                    >
                        {
                            this.props.settings.company.city.data &&
                            <Cascader
                                options={this.props.settings.company.city.data}
                                value={(this.state.details.tenantAddressId && this.state.details.tenantAddressId.split(' ')) || ''}
                                allowClear = {false}
                                onChange={(value)=>{
                                    this.setState({
                                        details : {
                                            ...this.state.details ,
                                            tenantAddressId : value.join(' ')
                                        }
                                    })
                                }}
                                placeholder="请选择地区"
                            />
                        }

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="详细地址"
                    >
                        <span>
                            <Input value={this.state.details.tenantAddress} onChange={(event)=>{
                                this.setState({
                                    details : {
                                        ...this.state.details ,
                                        tenantAddress : event.target.value
                                    }
                                })
                            }} />
                        </span>
                    </FormItem>
                    <FormItem
                        className="formitem-submit-btn"
                        {...formItemLayout_editBtn}
                    >
                        <span>
                            <Button className="submit-btn-left" type="primary" onClick={this._ev_editCompany_save.bind(this)}>保存</Button>
                            <Button className="submit-btn-right" type="ghost" onClick={()=>{
                                globalStore.dispatch(push('/settings/se_account/se_a_company')) ; //route change
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
)(Se_A_Companyedit)
