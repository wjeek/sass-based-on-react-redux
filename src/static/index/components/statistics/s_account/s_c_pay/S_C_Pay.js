import React from 'react'
import { connect , dispatch } from 'react-redux'
import moment from 'moment'
import QueueAnim from 'rc-queue-anim'
import { browserHistory } from 'react-router'
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
const CheckboxGroup = Checkbox.Group;
//logic
import {
    initAccountPay ,
    tableAccountPay
} from '../../../../actions/statistics'
import * as service from '../../../../service'

import utils from '../../../../service/utils/index'
import {
    TOKEN_NAME,
    TENANT_ID
} from '../../../../constants' ;

const COLUMNS = [
    {
        title　:　'对方'　,
        dataIndex : 'opposite' ,
        key : 'opposite'
    },{
        title : '联系人' ,
        dataIndex 　:　'contact'　,
        key　:　'contact'
    },{
        title　:　'应收款'　,
        dataIndex　:　'gathering'　,
        key　:　'gathering',
        sorter: (a, b) => a.gathering - b.gathering ,
    },{
        title　:　'应付款'　,
        dataIndex　:　'pay'　,
        key　:　'pay',
        sorter: (a, b) => a.pay - b.pay ,
    },{
        title　:　'负责人'　,
        dataIndex　:　'charge'　,
        key　:　'charge'
    },{
        title　:　'操作'　,
        dataIndex　:　'operation'　,
        key　:　'operation' ,
        render: (text,value) => {
            return (
                <span>
                <i title="查看明细" className="sprite-view dib-table-icon" value={value.id}
                   onClick={(event)=>{
                        browserHistory.push('/account/checkAccount/user');
                   }}
                ></i>
            </span>
            )
        }
    }
] ;
const options = [
    { label: '应收款   ', value: 'shouldPay' },
    { label: '逾期应收', value: 'afaterDate' },
    { label: '下周应付', value: 'nextWeek' },
];

class S_C_Pay extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            pageSize : 10 ,
            currentPage : 1 ,
            filter : {
                opposite : '' ,
                startDate : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDate : moment().format('YYYY-MM-DD') ,
                startDateForShow : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDateForShow : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                oppositeForShow : '' ,
                nextPayableState : false ,  //下周应付
                receivableState : false ,   //应收款
                overDue : false ,  //逾期应收
            }
        }
    }
    componentDidMount(){
        //let token =  utils.cookie.config( TOKEN_NAME ) ;
        let startDate = this.state.filter.startDate;
        let endDate = this.state.filter.endDate;
        service.statistics.initAccountPay({
            pageSize :10,
            pageNum : 1,
            tenantId : window.globalStore.getState().userstore.user.tenantId ,
            startDate: startDate,
            endDate: endDate ,
        },(error,data) => {
            this.props.initAccountPay(data) ;
        }) ;
    }
    _evClick_filterSearch(){
        var startDate = this.state.filter.startDate;
        var endDate = this.state.filter.endDate;
        service.statistics.initAccountPay({
            pageSize :10,
            pageNum : 1,
            tenantId : window.globalStore.getState().userstore.user.tenantId,
            startDate: startDate,
            endDate: endDate ,
            opposite : this.state.filter.opposite ,
            overDue : this.state.filter.overDue === false ? '' : 1 ,
            nextPayableState : this.state.filter.nextPayableState === false ? '' : 1 ,
            receivableState :this.state.filter.receivableState === false ? '' : 1 ,
        },(error,data)=>{
            this.props.initAccountPay(data) ;
            this.setState({
                currentPage : 1 ,
                filter : {
                    ...this.state.filter ,
                    oppositeForShow : this.state.filter.opposite ,
                    startDateForShow : this.state.filter.startDate ,
                    endDateForShow : this.state.filter.endDate
                }
            });
        }) ;
    }
    _ev_receivableState_filterSearch(event){
        this.setState({
            filter : {
                ...this.state.filter ,
                receivableState : event.target.checked
            }
        } , ()=> {
            this._ev_filterSearch();
        });
    }
    _ev_overDue_filterSearch(event){
        this.setState({
            filter : {
                ...this.state.filter ,
                overDue : event.target.checked
            }
        } , ()=> {
            this._ev_filterSearch();
        });
    }
    _ev_nextPayableState_filterSearch(event){
        this.setState({
            filter : {
                ...this.state.filter ,
                nextPayableState : event.target.checked
            }
        } , ()=> {
            this._ev_filterSearch();
        });
    }
    render(){
        return (
            <div>
                <QueueAnim>
                    <div className="filter-wrap" key="anime-1">
                        <span className="filter">
                            <span className="filter-label">对方</span>
                            <span className="filter-component">
                                {/*<Select
                                    labelInValue
                                    value={{key : this.state.filter.payType}}
                                    onChange={
                                        (values)=>{
                                            this.setState({
                                                filter : {
                                                    ...this.state.filter ,
                                                    payType : values.key ,
                                                    payTypeInTab : values.label ,
                                                }
                                            })
                                        }
                                    }
                                >
                                    <Option value="default-all" title="全部">全部</Option>
                                    <Option value="default" title="全部">默认结算方式</Option>
                                    <Option value="cash" title="全部">现金</Option>
                                    <Option value="pos" title="全部">pos机刷卡</Option>
                                    <Option value="zhifubao" title="全部">支付宝</Option>
                                    <Option value="weixin" title="全部">微信</Option>
                                    <Option value="bank" title="全部">银行转账</Option>
                                    <Option value="elec-bank" title="全部">网银转账</Option>
                                    <Option value="shouldPay" title="全部">应收款</Option>
                                </Select>*/}
                                <Input
                                    placeholder='请输入供应商或客户名称'
                                    value={this.state.filter.opposite}
                                    onChange={(event)=>{
                                            this.setState({
                                                filter : {
                                                    ...this.state.filter ,
                                                    opposite : event.target.value ,
                                                }
                                            })
                                    }}
                                />
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
                        <span className="filter">
                            <span className="filter-component">
                                    <Checkbox
                                        checked={this.state.filter.receivableState}
                                        onChange={this._ev_receivableState_filterSearch.bind(this)}
                                    >
                                        应收款
                                    </Checkbox>
                                    <Checkbox
                                        checked={this.state.filter.overDue}
                                        onChange={this._ev_overDue_filterSearch.bind(this)}
                                    >
                                        逾期应收
                                    </Checkbox>
                                    <Checkbox
                                        checked={this.state.filter.nextPayableState}
                                        onChange={this._ev_nextPayableState_filterSearch.bind(this)}
                                    >
                                        下周应付
                                    </Checkbox>
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
                        <span className="lab">对方: </span>
                        <span>{this.state.filter.oppositeForShow}</span>
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
                            dataSource={this.props.statistics.account.pay.dataSource.data}
                            columns={this.props.COLUMNS}
                            pagination={{
                            showSizeChanger : true ,

                            total : this.props.statistics.account.pay.totalCount ,

                            pageSize : this.state.pageSize ,

                            current :　this.state.currentPage ,
                            onShowSizeChange : (current , pageSize)=>{
                                var self = this;

                                self.setState({
                                    currentPage : 1 ,
                                    pageSize : pageSize
                                },()=> {
                                    service.statistics.initAccountPay({
                                        tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                        pageSize :self.state.pageSize,
                                        pageNum : 1,
                                        startDate: this.state.filter.startDate,
                                        endDate: this.state.filter.endDate ,
                                        opposite : this.state.filter.opposite ,
                                        overDue : this.state.filter.overDue === false ? '' : 1 ,
                                        nextPayableState : this.state.filter.nextPayableState === false ? '' : 1 ,
                                        receivableState :this.state.filter.receivableState === false ? '' : 1 ,
                                    },(error,data)=>{
                                        self.props.initAccountPay(data) ;
                                    });
                                });
                            },
                            onChange : (value)=>{
                                var self = this;
                                self.setState({
                                        currentPage : value
                                    });
                                service.statistics.initAccountPay({
                                    tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                    pageSize :self.state.pageSize,
                                    pageNum : value,
                                    startDate: this.state.filter.startDate,
                                    endDate: this.state.filter.endDate ,
                                    opposite : this.state.filter.opposite ,
                                    overDue : this.state.filter.overDue === false ? '' : 1 ,
                                    nextPayableState : this.state.filter.nextPayableState === false ? '' : 1 ,
                                    receivableState :this.state.filter.receivableState === false ? '' : 1 ,
                                },(error,data)=>{
                                    self.props.initAccountPay(data) ;
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
S_C_Pay.defaultProps = {
    COLUMNS : COLUMNS ,
}
export default connect(
    (state)=>{
        var statistics = state.statistics ;
        return {
            statistics : statistics ,
        }
    }  ,
    {
        initAccountPay ,
        tableAccountPay
    }
)(S_C_Pay)
