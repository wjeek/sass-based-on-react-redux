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
import * as localstore from '../../../../service/utils/localstore'
import {
    TOKEN_NAME,
    TENANT_ID
} from '../../../../constants' ;
import utils from '../../../../service/utils/index'
const Option = Select.Option;
const FormItem = Form.Item ;
import * as service from '../../../../service'
import {
    initSettingsCompany,
    initSettingsPersonal
} from '../../../../actions/settings.js'


class Se_A_Company extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tenantAddress : '',

            convertCity : ()=>{
                return this.props.settings.company.details.data.tenantAddressId;
            }
        }
    }
    componentDidMount(){
        var tenantAddress = this.state.convertCity();


        $( '.show-pure.personal-link' ).removeClass( 'active' ) ;

        service.settings.initSettingsPersonal({

        },(error,data)=>{
            this.props.initSettingsPersonal(data) ;
        }) ;
        
        service.settings.initSettingsCompany({

        },(error,data)=>{
            this.props.initSettingsCompany(data) ;
            tenantAddress = this.state.convertCity();
            localstore.takeoutCity((cityData)=>{
                console.log(cityData);
                tenantAddress = localstore.convertCityNameById( tenantAddress , cityData );
                this.setState({
                    tenantAddress : tenantAddress
                })
            })
        }) ;
    }
    render(){
        console.log(this.props.settings) ;
        var details = this.props.settings.company.details.data ;
        const formItemLayout = {
            labelCol : {span:5} ,
            wrapperCol : {span:19}
        }
        const formItemLayout_editBtn = {
            wrapperCol : {span:8,offset:5}
        }
        return (
            <div className="company-wrap">
                <Form horizontal className="form-static">
                    <FormItem
                        {...formItemLayout}
                        label="公司名称"
                    >
                        <span>{details.tenantName}</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="公司地址"
                    >
                        {
                            /*this.props.settings.company.city.data ?  <Cascader
                                options={this.props.settings.company.city.data}
                                //value={this.props.settings.company.details.data.addressId ? this.props.settings.company.details.data.addressId.split(' ') : '' }
                                value={this.props.settings.company.details.data.addressId ? this.props.settings.company.details.data.addressId.split(' ') : '' }
                                disabled={true}
                            /> : <span>未选择地区</span>*/
                            <span>{this.state.tenantAddress}</span>
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="详细地址"
                    >
                        <span>{details.tenantAddress}</span>
                    </FormItem>
                    <FormItem 
                        className="formitem-submit-btn"
                        {...formItemLayout_editBtn}
                    >
                        <Button className="submit-btn" type="primary" onClick={(ev)=>{
                            globalStore.dispatch(push('/settings/se_account/se_a_companyedit')) ; //route change
                        }}>编辑</Button>
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
        initSettingsCompany,
        initSettingsPersonal
    }
)(Se_A_Company)
