import React from 'react'
import { connect , dispatch } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { browserHistory } from 'react-router'
import moment from 'moment'
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
    initMarketMarket ,
    tableMarketMarket
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
        title　:　'销售员'　,
        dataIndex : 'saleMan' , 
        key : 'saleMan'
    },{
        title : '总客户数量' ,
        dataIndex 　:　'customerCount'　,
        key　:　'customerCount' ,
        sorter: (a, b) => a.customerCount - b.customerCount ,
    },{
        title　:　'成交客户数量'　,
        dataIndex　:　'madeCount'　,
        key　:　'madeCount' ,
        sorter: (a, b) => a.madeCount - b.madeCount ,
    },{
        title　:　'销售单数'　,
        dataIndex　:　'saleCount'　,
        key　:　'saleCount' ,
        sorter: (a, b) => a.saleCount - b.saleCount ,
    },{
        title　:　'货品数量'　,
        dataIndex　:　'productCount'　,
        key　:　'productCount' ,
        sorter: (a, b) => a.productCount - b.productCount ,
    },{
        title　:　'销售金额'　,
        dataIndex　:　'saleMoney'　,
        key　:　'saleMoney' ,
        sorter: (a, b) => a.saleMoney - b.saleMoney ,
    },{
        title　:　'应收款'　,
        dataIndex　:　'shouldCheques'　,
        key　:　'shouldCheques' ,
        sorter: (a, b) => a.shouldCheques - b.shouldCheques ,
    },{
        title　:　'操作'　,
        dataIndex　:　'operation'　,
        key　:　'operation' ,
        render: (text,value) => {
            return (
                <span>
                <i title="查看明细" className="sprite-view dib-table-icon" value={value.id}
                   onClick={(event)=>{
                        browserHistory.push('/market/list');
                   }}
                ></i>
            </span>
            )
        }
    }
] ;

class S_A_Purchase extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            pageSize : 10 ,
            currentPage : 1 ,
            filter : {
                userId : 'default-all' ,
                userIdInTab : '全部' ,
                startDate : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDate : moment().format('YYYY-MM-DD') ,
                startDateForShow : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDateForShow : moment().format('YYYY-MM-DD') ,
                userIdInTabForShow : '全部' ,
            }
        }
    }
    componentDidMount(){
        //let token =  utils.cookie.config( TOKEN_NAME ) ;
        let params = {
            init : {
                pageSize :10,
                pageNum : 1,
                startDate : this.state.filter.startDate ,
                endDate : this.state.filter.endDate ,
            } ,
            fetchMarket : {
                pageSize :9999,
                pageNum : 1,
                //roleIds : [1,3]
            }
        }
        //let token =  utils.cookie.config( TOKEN_NAME ) ;
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.init.tenantId = params.fetchMarket.tenantId = window.globalStore.getState().userstore.user.tenantId ;
            params.fetchMarket.roleIds = [1,3] ;
        } else {
            params.init.id = params.fetchMarket.id = window.globalStore.getState().userstore.user.id ;
            params.fetchMarket.roleIds = [3] ;
        }
        service.statistics.initMarketMarket(params,(error,data) => {
            this.props.initMarketMarket(data) ;
        }) ;
    }
    _evClick_filterSearch(){
        let params = {
            init : {
                pageSize :10,
                pageNum : 1,
                userId : this.state.filter.userId === 'default-all' ? '' : this.state.filter.userId ,
                startDate : this.state.filter.startDate ,
                endDate : this.state.filter.endDate ,
            } ,
            fetchMarket : {
                pageSize :9999,
                pageNum : 1,
                //roleIds : [1,3]
            }
        }
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.fetchMarket.roleIds = [1,3] ;
            params.init.tenantId = params.fetchMarket.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.fetchMarket.roleIds = [3] ;
            params.init.id = params.fetchMarket.id = window.globalStore.getState().userstore.user.id ;
        }
        service.statistics.initMarketMarket(params,(error,data)=>{
            this.props.initMarketMarket(data) ;
            this.setState({
                currentPage : 1 ,
                filter : {
                    ...this.state.filter ,
                    userIdInTabForShow : this.state.filter.userIdInTab ,
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
                            <span className="filter-label">销售员</span>
                            <span className="filter-component">
                                <Select
                                    labelInValue
                                    style={{width:150}}
                                    value={{key : this.state.filter.userId}}
                                    onChange={
                                        (values)=>{
                                            this.setState({
                                                filter : {
                                                    ...this.state.filter ,
                                                    userId : values.key ,
                                                    userIdInTab : values.label ,
                                                }
                                            })
                                        }
                                    }
                                >
                                    <Option value="default-all" title="全部">全部</Option>
                                    {
                                        this.props.statistics.market.market.market.data.map((v,i)=>{
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
                        <span className="lab">销售员: </span>
                        <span>{this.state.filter.userIdInTabForShow}</span>
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
                            dataSource={this.props.statistics.market.market.dataSource.data}
                            columns={this.props.COLUMNS}
                            pagination={{
                            showSizeChanger : true ,

                            total : this.props.statistics.market.market.totalCount ,

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
                                            userId : this.state.filter.userId ,
                                            startDate : this.state.filter.startDate ,
                                            endDate : this.state.filter.endDate ,
                                        } ,
                                        fetchMarket : {
                                            pageSize :9999,
                                            pageNum : 1,
                                            //roleIds : [3]
                                        }
                                    }
                                    if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                                        params.fetchMarket.roleIds = [1,3] ;
                                        params.init.tenantId = params.fetchMarket.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                    } else {
                                        params.fetchMarket.roleIds = [3] ;
                                        params.init.id = params.fetchMarket.id = window.globalStore.getState().userstore.user.id ;
                                    }
                                    service.statistics.initMarketMarket(params,(error,data)=>{
                                        self.props.initMarketMarket(data) ;
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
                                        userId : this.state.filter.userId ,
                                        startDate : this.state.filter.startDate ,
                                        endDate : this.state.filter.endDate ,
                                    } ,
                                    fetchMarket : {
                                        pageSize :9999,
                                        pageNum : 1,
                                        //roleIds : [3]
                                    }
                                }
                                if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                                    params.fetchMarket.roleIds = [1,3] ;
                                    params.init.tenantId = params.fetchMarket.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                } else {
                                    params.fetchMarket.roleIds = [3] ;
                                    params.init.id = params.fetchMarket.id = window.globalStore.getState().userstore.user.id ;
                                }
                                service.statistics.initMarketMarket(params,(error,data)=>{
                                    self.props.initMarketMarket(data) ;
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
S_A_Purchase.defaultProps = {
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
        initMarketMarket ,
        tableMarketMarket
    }
)(S_A_Purchase)
