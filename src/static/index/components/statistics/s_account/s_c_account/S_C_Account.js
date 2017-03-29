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
//logic
import {
    initAccountAccount ,
    tableAccountAccount
} from '../../../../actions/statistics'
import * as service from '../../../../service'

import utils from '../../../../service/utils/index'
import {
    TOKEN_NAME,
    TENANT_ID
} from '../../../../constants' ;

const COLUMNS = [
    {
        title　:　'结算方式'　,
        dataIndex : 'settleType' ,
        key : 'settleType'
    },{
        title : '收入' ,
        dataIndex : 'income' ,
        key : 'income',
        sorter: (a, b) => a.income - b.income ,
    },{
        title : '支出' ,
        dataIndex : 'expense' ,
        key : 'expense',
        sorter: (a, b) => a.expense - b.expense ,
    },{
        title　:　'操作'　,
        dataIndex　:　'operation'　,
        key　:　'operation' ,
        render: (text,value) => {
            return (
                <span>
                <i title="查看明细" className="sprite-view dib-table-icon" value={value.id}
                   onClick={(event)=>{
                        browserHistory.push('/account/chargeAccount');
                   }}
                ></i>
            </span>
            )
        }
    }
] ;

class S_C_Account extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            filter : {
                startDate : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDate : moment().format('YYYY-MM-DD') ,
                startDateForShow : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDateForShow : moment().format('YYYY-MM-DD') ,
            }
        }
    }
    componentDidMount(){
        let token =  utils.cookie.config( TOKEN_NAME ) ;
        service.statistics.initAccountAccount({
            pageSize :10,
            pageNum : 1,
            tenantId : window.globalStore.getState().userstore.user.tenantId ,
            startDate : this.state.filter.startDate ,
            endDate : this.state.filter.endDate ,
        },(error,data) => {
            this.props.initAccountAccount(data) ;
        }) ;
    }
    _evClick_filterSearch(){
        var startDate = this.state.filter.startDate;
        var endDate = this.state.filter.endDate;
        service.statistics.initAccountAccount({
            pageSize :10,
            pageNum : 1,
            tenantId : window.globalStore.getState().userstore.user.tenantId,
            startDate: startDate,
            endDate: endDate
        },(error,data)=>{
            this.props.initAccountAccount(data) ;
            this.setState({
                filter : {
                    ...this.state.filter ,
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
                        <span className="lab">日期: </span>
                        <span>{this.state.filter.startDateForShow}</span>
                        <span>至</span>
                        <span>{this.state.filter.endDateForShow}</span>
                    </span>
                </div>
                <div className="tabel-wrap" key="anime-4">
                    <Table dataSource={this.props.statistics.account.account.dataSource.data} columns={this.props.COLUMNS} pagination={false}></Table>
                </div>
                </QueueAnim>
            </div>
        )
    }
}
S_C_Account.defaultProps = {
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
        initAccountAccount ,
        tableAccountAccount
    }
)(S_C_Account)
