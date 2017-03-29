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
    initPurchasePurchase ,
    tablePurchasePurchase
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
        title　:　'采购员'　,
        dataIndex : 'purchaser' ,
        key : 'purchaser'
    },{
        title : '总供应商数量' ,
        dataIndex 　:　'suppliertotal'　,
        key　:　'suppliertotal',
        sorter: (a, b) => a.suppliertotal - b.suppliertotal ,
    },{
        title　:　'成交供应商数量'　,
        dataIndex　:　'madesupplier'　,
        key　:　'madesupplier' ,
        sorter: (a, b) => a.madesupplier - b.madesupplier ,
    },{
        title　:　'采购单数'　,
        dataIndex　:　'ordercount'　,
        key　:　'ordercount' ,
        sorter: (a, b) => a.ordercount - b.ordercount ,
    },{
        title　:　'货品数量'　,
        dataIndex　:　'productcount'　,
        key　:　'productcount' ,
        sorter: (a, b) => a.productcount - b.productcount ,
    },{
        title　:　'采购金额'　,
        dataIndex　:　'purchasemoney'　,
        key　:　'purchasemoney' ,
        sorter: (a, b) => a.purchasemoney - b.purchasemoney ,
    },{
        title　:　'应付款'　,
        dataIndex　:　'shouldpay'　,
        key　:　'shouldpay' ,
        sorter: (a, b) => a.shouldpay - b.shouldpay ,
    },{
        title　:　'操作'　,
        dataIndex　:　'operation'　,
        key　:　'operation' ,
        render: (text,value) => {
            return (
                <span>
                <i title="查看明细" className="sprite-view dib-table-icon" value={value.id}
                   onClick={(event)=>{
                        browserHistory.push('/purchase/order');
                   }}
                ></i>
            </span>
            )
        }
    }
] ;

class S_B_Purchase extends React.Component {
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
        let params = {
            init : {
                pageSize :10,
                pageNum : 1,
                startDate : this.state.filter.startDate ,
                endDate : this.state.filter.endDate ,
            } ,
            fetchPurchase : {
                pageSize :9999,
                pageNum : 1,
                //roleIds : [4],
            }
        }
        //let token =  utils.cookie.config( TOKEN_NAME ) ;
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.fetchPurchase.roleIds = [1,4] ;
            params.init.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.fetchPurchase.roleIds = [4] ;
            params.init.id = params.fetchPurchase.id = window.globalStore.getState().userstore.user.id ;
        }
        service.statistics.initPurchasePurchase(params,(error,data) => {
            this.props.initPurchasePurchase(data) ;
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
            fetchPurchase : {
                pageSize :9999,
                pageNum : 1,
                //roleIds : [4]
            }
        }
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.fetchPurchase.roleIds = [1,4] ;
            params.init.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.fetchPurchase.roleIds = [4] ;
            params.init.id = params.fetchPurchase.id = window.globalStore.getState().userstore.user.id ;
        }
        service.statistics.initPurchasePurchase(params,(error,data)=>{
            //this.props.tablePurchasePurchase(data) ;
            this.props.initPurchasePurchase(data) ;
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
                            <span className="filter-label">采购员</span>
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
                                                    userIdInTab : values.label
                                                }
                                            })
                                        }
                                    }
                                >
                                    <Option value="default-all" title="全部">全部</Option>
                                    {
                                        this.props.statistics.purchase.purchase.purchase.data.map((v,i)=>{
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
                        <span className="lab">采购员: </span>
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
                            dataSource={this.props.statistics.purchase.purchase.dataSource.data}
                            columns={this.props.COLUMNS}
                            pagination={{
                            showSizeChanger : true ,

                            total : this.props.statistics.purchase.purchase.totalCount ,

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
                                            userId : this.state.filter.userId === 'default-all' ? '' : this.state.filter.userId ,
                                            startDate : this.state.filter.startDate ,
                                            endDate : this.state.filter.endDate ,
                                        } ,
                                        fetchPurchase : {
                                            pageSize :9999,
                                            pageNum : 1,
                                            //roleIds : [4]
                                        }
                                    }
                                    if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                                        params.fetchPurchase.roleIds = [1,4] ;
                                        params.init.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                    } else {
                                        params.fetchPurchase.roleIds = [4] ;
                                        params.init.id = params.fetchPurchase.id = window.globalStore.getState().userstore.user.id ;
                                    }
                                    service.statistics.initPurchasePurchase(params,(error,data)=>{
                                        self.props.initPurchasePurchase(data) ;
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
                                        userId : this.state.filter.userId === 'default-all' ? '' : this.state.filter.userId ,
                                        startDate : this.state.filter.startDate ,
                                        endDate : this.state.filter.endDate ,
                                    } ,
                                    fetchPurchase : {
                                        pageSize :9999,
                                        pageNum : 1,
                                        //roleIds : [4]
                                    }
                                }
                                if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                                    params.fetchPurchase.roleIds = [1,4] ;
                                    params.init.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                } else {
                                    params.fetchPurchase.roleIds = [4] ;
                                    params.init.id = params.fetchPurchase.id = window.globalStore.getState().userstore.user.id ;
                                }
                                service.statistics.initPurchasePurchase(params,(error,data)=>{
                                    self.props.initPurchasePurchase(data) ;
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
S_B_Purchase.defaultProps = {
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
        initPurchasePurchase ,
        tablePurchasePurchase
    }
)(S_B_Purchase)
