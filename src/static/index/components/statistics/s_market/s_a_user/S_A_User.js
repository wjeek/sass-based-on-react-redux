import React from 'react'
import { connect , dispatch } from 'react-redux'
import moment from 'moment'
import QueueAnim from 'rc-queue-anim'
//component
import {
    Button , Pagination , Select , Input , DatePicker , Table , Form , Modal , Radio , Checkbox ,
    Upload ,
    Row , Col ,
    Icon
} from 'antd/dist/antd.js'
const Option = Select.Option ;
const FormItem = Form.Item ;
const confirm = Modal.confirm ;
const RadioButton = Radio.Button ;
const RadioGroup = Radio.Group ;
//logic
import {
    initMarketUser ,
    tableMarketUser
} from '../../../../actions/statistics'
import * as service from '../../../../service'

import utils from '../../../../service/utils/index'
import {
    TOKEN_NAME,
    TENANT_ID
} from '../../../../constants' ;

//const
const COLUMNS = [
    {
        title : '商品名称' ,
        dataIndex : 'product'　,
        key　:　'product'
    },{
        title　:　'品牌'　,
        dataIndex : 'brand' ,
        key : 'brand'
    },{
        title : '规格型号' ,
        dataIndex : 'specifications' ,
        key : 'specifications'
    },{
        title : '单位' ,
        dataIndex : 'unit' ,
        key : 'unit'
    },{
        title : '销售单数' ,
        dataIndex 　:　'saleList'　,
        key　:　'saleList' ,
        sorter: (a, b) => a.saleList - b.saleList ,
    },{
        title　:　'销售数量'　,
        dataIndex　:　'saleCount'　,
        key　:　'saleCount' ,
        sorter: (a, b) => a.saleCount - b.saleCount ,
    },{
        title　:　'销售金额'　,
        dataIndex　:　'saleMoney'　,
        key　:　'saleMoney',
        sorter: (a, b) => a.saleMoney - b.saleMoney ,
    }
] ;

class S_A_User extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            pageSize : 10 ,
            currentPage : 1 ,
            filter : {
                customer : 'default-all' ,
                customerInTab : '全部' ,
                //contacter : 'all' ,
                startDate : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDate : moment().format('YYYY-MM-DD') ,
                startDateForShow : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDateForShow : moment().format('YYYY-MM-DD') ,
                customerInTabForShow : '全部' ,
            }
        }
    }
    componentDidMount(){
        let params = {
            init : {
                pageSize :10,
                pageNum : 1,
                startDate : this.state.filter.startDate ,
                endDate : this.state.filter.endDate ,
            } ,
            fetchCustomer : {
                pageSize :9999,
                pageNum : 1,
            }
        }
        //let token =  utils.cookie.config( TOKEN_NAME ) ;
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.init.tenantId = params.fetchCustomer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.init.userId = params.fetchCustomer.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.statistics.initMarketUser(params,(error,data) => {
            this.props.initMarketUser(data) ;
        }) ;
    }
    _evClick_filterSearch(){
        let params = {
            init : {
                pageSize :10,
                pageNum : 1,
                customerId : this.state.filter.customer === 'default-all' ? '' : this.state.filter.customer,
                startDate : this.state.filter.startDate ,
                endDate : this.state.filter.endDate ,
            } ,
            fetchCustomer : {
                pageSize :9999,
                pageNum : 1,
            }
        }
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.init.tenantId = params.fetchCustomer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.init.userId = params.fetchCustomer.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.statistics.initMarketUser(params,(error,data)=>{
            this.props.initMarketUser(data) ;
            this.setState({
                currentPage : 1 ,
                filter : {
                    ...this.state.filter ,
                    customerInTabForShow : this.state.filter.customerInTab ,
                    startDateForShow : this.state.filter.startDate ,
                    endDateForShow : this.state.filter.endDate
                }
            });
        }) ;
    }
    render(){
        return (
            <div>
                <QueueAnim>
                    <div className="filter-wrap" key="anime-1">
                        <span className="filter">
                            <span className="filter-label">客户名称</span>
                            <span className="filter-component">
                                <Select
                                    labelInValue
                                    showSearch
                                    style={{width:150}}
                                    placeholder="选择客户"
                                    notFoundContent=""
                                    optionFilterProp="children"
                                    value={{key : this.state.filter.customer+''}}
                                    onChange={
                                        (values)=>{
                                            this.setState({
                                                filter : {
                                                    ...this.state.filter ,
                                                    customer : values.key+'' ,
                                                    customerInTab : values.label+''
                                                }
                                            })
                                        }
                                    }
                                >
                                    <Option value="default-all" title="全部">全部</Option>
                                    {
                                        this.props.statistics.market.user.customer.data.map((v,i)=>{
                                            return <Option title={v.name} value={v.value} key={v.value}>{v.name}</Option>
                                        })
                                    }
                                </Select>
                            </span>
                        </span>
                        <span className="filter">
                            <span className="filter-label">业务日期</span>
                            <span className="filter-component">
                                <DatePicker
                                    size="large"
                                    key="for"
                                    value={this.state.filter.startDate}
                                    format="yyyy-MM-dd"
                                    onChange={(v,dataString)=>{
                                            var endDate = this. state.filter.endDate ;
                                            if(endDate == ''){
                                                this.setState({
                                                    filter : {
                                                        ...this.state.filter ,
                                                        startDate : dataString
                                                    }
                                                })
                                            }else if(dataString > endDate){
                                                globalFunction.alert.warning('开始日期不能大于结束日期' , '提示');
                                            }else{
                                                this.setState({
                                                    filter : {
                                                        ...this.state.filter ,
                                                        startDate : dataString
                                                    }
                                                })
                                            }
                                        }}
                                >
                                </DatePicker>
                            </span>
                            <span className="filter-label">至</span>
                            <span className="filter-component">
                                <DatePicker
                                    size="large"
                                    key="for"
                                    value={this.state.filter.endDate}
                                    format="yyyy-MM-dd"
                                    onChange={(v,dataString)=>{
                                            var startDate = this. state.filter.startDate ;
                                            if(dataString == ''){
                                                this.setState({
                                                    filter : {
                                                        ...this.state.filter ,
                                                        endDate : dataString
                                                    }
                                                })
                                            }else if(dataString < startDate){
                                                globalFunction.alert.warning('结束日期不能小于开始日期' , '提示');
                                            }else{
                                                this.setState({
                                                    filter : {
                                                        ...this.state.filter ,
                                                        endDate : dataString
                                                    }
                                                })
                                            }
                                        }}
                                >
                                </DatePicker>
                            </span>
                        </span>
                        <div className="search-wrap base-product">
                            <span className="searc-btn">
                                <Button type="default" icon="search" onClick={this._evClick_filterSearch.bind(this)}>查询</Button>
                            </span>
                        </div>
                    </div>
                    {/*<div className="search-wrap" key="anime-2">
                        <span className="searc-btn">
                            <Button type="default" icon="search" onClick={this._evClick_filterSearch.bind(this)}>查询</Button>
                        </span>
                    </div>*/}
                    <div className="search-important" key="anime-3">
                    <span className="search-importantwrap">
                        <span className="lab">客户名称: </span>
                        <span>{this.state.filter.customerInTabForShow}</span>
                    </span>
                    <span className="search-importantwrap">
                        <span className="lab">日期: </span>
                        <span>{this.state.filter.startDateForShow}</span>
                        <span>至</span>
                        <span>{this.state.filter.endDateForShow}</span>
                    </span>
                    </div>
                    <div className="tabel-wrap" key="anime-4">
                        <Table
                            dataSource={this.props.statistics.market.user.dataSource.data}
                            columns={this.props.COLUMNS}
                            pagination={{
                            showSizeChanger : true ,

                            total : this.props.statistics.market.user.totalCount ,

                            pageSize : this.state.pageSize ,

                            current :　this.state.currentPage ,
                            onShowSizeChange : (current , pageSize)=>{
                                var self = this;

                                self.setState({
                                    currentPage : 1 ,
                                    pageSize : pageSize
                                },()=> {
                                    let params = {
                                        init : {
                                            pageSize :self.state.pageSize,
                                            pageNum : 1,
                                            customerId : this.state.filter.customer === 'default-all' ? '' : this.state.filter.customer,
                                            startDate : this.state.filter.startDate ,
                                            endDate : this.state.filter.endDate ,
                                        } ,
                                        fetchCustomer : {
                                            pageSize :9999,
                                            pageNum : 1,
                                        }
                                    }
                                    if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                                        params.init.tenantId = params.fetchCustomer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                    } else {
                                        params.init.userId = params.fetchCustomer.userId = window.globalStore.getState().userstore.user.id ;
                                    }
                                    service.statistics.initMarketUser(params,(error,data)=>{
                                        self.props.initMarketUser(data) ;
                                    });
                                });
                            },
                            onChange : (value)=>{
                                var self = this;
                                self.setState({
                                        currentPage : value
                                    });
                                let params = {
                                    init : {
                                        pageSize :self.state.pageSize,
                                        pageNum : value,
                                        customerId : this.state.filter.customer === 'default-all' ? '' : this.state.filter.customer,
                                        startDate : this.state.filter.startDate ,
                                        endDate : this.state.filter.endDate ,
                                    } ,
                                    fetchCustomer : {
                                        pageSize :9999,
                                        pageNum : 1,
                                    }
                                }
                                if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                                    params.init.tenantId = params.fetchCustomer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                } else {
                                    params.init.userId = params.fetchCustomer.userId = window.globalStore.getState().userstore.user.id ;
                                }
                                service.statistics.initMarketUser(params,(error,data)=>{
                                    self.props.initMarketUser(data) ;
                                });
                            }
                        }}
                        ></Table>
                    </div>
                </QueueAnim>
            </div>
        )
    }
}

S_A_User.defaultProps = {
    COLUMNS : COLUMNS ,
}

export default connect(
    (state)=>{
        var statistics = state.statistics ;
        var userstore = state.userstore ;
        return {
            statistics : statistics ,
            userstore
        }
    }  ,
    {
        initMarketUser ,
        tableMarketUser
    }
)(S_A_User)