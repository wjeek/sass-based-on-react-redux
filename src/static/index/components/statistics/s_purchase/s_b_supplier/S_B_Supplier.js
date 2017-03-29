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
    initPurchaseSupplier ,
    tablePurchaseSupplier
} from '../../../../actions/statistics'
import * as service from '../../../../service'

import utils from '../../../../service/utils/index'
import {
    TOKEN_NAME,
    TENANT_ID,
    USER_NAME
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
        dataIndex 　:　'pecifications'　,
        key　:　'pecifications'
    },{
        title　:　'单位'　,
        dataIndex　:　'unit'　,
        key　:　'unit'
    },{
        title　:　'采购单数'　,
        dataIndex　:　'ordercount'　,
        key　:　'ordercount' ,
        sorter: (a, b) => a.ordercount - b.ordercount ,
    },{
        title　:　'采购数量'　,
        dataIndex　:　'purchasecount'　,
        key　:　'purchasecount' ,
        sorter: (a, b) => a.purchasecount- b.purchasecount ,
    },{
        title　:　'采购金额'　,
        dataIndex　:　'purchasemoney'　,
        key　:　'c' ,
        sorter: (a, b) => a.purchasemoney- b.purchasemoney ,
    },{
        title　:　'平均采购单价'　,
        dataIndex　:　'averagesp'　,
        key　:　'averagesp' ,
        sorter: (a, b) => a.averagesp- b.averagesp ,
    }
] ;


class S_B_Supplier extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            pageSize : 10 ,
            currentPage : 1 ,
            filter : {
                supplier : 'default-all' ,
                supplierInTab : '全部' ,
                startDate : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDate : moment().format('YYYY-MM-DD') ,
                startDateForShow : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDateForShow : moment().format('YYYY-MM-DD') ,
                supplierInTabForShow : '全部' ,
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
            fetchSupplier : {
                pageSize :9999,
                pageNum : 1,
            }
        }
        //let token =  utils.cookie.config( TOKEN_NAME ) ;
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.init.tenantId = params.fetchSupplier.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.init.userId = params.fetchSupplier.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.statistics.initPurchaseSupplier(params,(error,data) => {
            this.props.initPurchaseSupplier(data) ;
        }) ;
    }
    _evClick_filterSearch(){
        let params = {
            init : {
                pageSize :10,
                pageNum : 1,
                supplierId : this.state.filter.supplier === 'default-all' ? '' : this.state.filter.supplier ,
                startDate : this.state.filter.startDate ,
                endDate : this.state.filter.endDate ,
            } ,
            fetchSupplier : {
                pageSize :9999,
                pageNum : 1,
            }
        }
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.init.tenantId = params.fetchSupplier.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.init.userId = params.fetchSupplier.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.statistics.initPurchaseSupplier(params,(error,data)=>{
            this.props.initPurchaseSupplier(data) ;
            this.setState({
                currentPage : 1 ,
                filter : {
                    ...this.state.filter ,
                    supplierInTabForShow : this.state.filter.supplierInTab ,
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
                            <span className="filter-label">供应商名称</span>
                            <span className="filter-component">
                                <Select
                                    labelInValue
                                    showSearch
                                    style={{width:150}}
                                    placeholder="选择客户"
                                    notFoundContent=""
                                    optionFilterProp="children"
                                    value={{key : this.state.filter.supplier+''}}
                                    onChange={
                                        (values)=>{
                                            this.setState({
                                                filter : {
                                                    ...this.state.filter ,
                                                    supplier : values.key ,
                                                    supplierInTab : values.label
                                                }
                                            })
                                        }
                                    }
                                >
                                    <Option value="default-all" title="全部">全部</Option>
                                    {
                                        this.props.statistics.purchase.supplier.supplier.data.map((v,i)=>{
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
                        <span className="lab">供应商名称: </span>
                        <span>{this.state.filter.supplierInTabForShow}</span>
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
                            dataSource={this.props.statistics.purchase.supplier.dataSource.data}
                            columns={this.props.COLUMNS}
                            pagination={{
                            showSizeChanger : true ,

                            total : this.props.statistics.purchase.supplier.totalCount ,

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
                                            supplierId : this.state.filter.supplier === 'default-all' ? '' : this.state.filter.supplier ,
                                            startDate : this.state.filter.startDate ,
                                            endDate : this.state.filter.endDate ,
                                        } ,
                                        fetchSupplier : {
                                            pageSize :9999,
                                            pageNum : 1,
                                        }
                                    }
                                    if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                                        params.init.tenantId = params.fetchSupplier.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                    } else {
                                        params.init.userId = params.fetchSupplier.userId = window.globalStore.getState().userstore.user.id ;
                                    }
                                    service.statistics.initPurchaseSupplier(params,(error,data)=>{
                                        self.props.initPurchaseSupplier(data) ;
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
                                        supplierId : this.state.filter.supplier === 'default-all' ? '' : this.state.filter.supplier ,
                                        startDate : this.state.filter.startDate ,
                                        endDate : this.state.filter.endDate ,
                                    } ,
                                    fetchSupplier : {
                                        pageSize :9999,
                                        pageNum : 1,
                                    }
                                }
                                if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                                    params.init.tenantId = params.fetchSupplier.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                } else {
                                    params.init.userId = params.fetchSupplier.userId = window.globalStore.getState().userstore.user.id ;
                                }
                                service.statistics.initPurchaseSupplier(params,(error,data)=>{
                                    self.props.initPurchaseSupplier(data) ;
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
S_B_Supplier.defaultProps = {
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
        initPurchaseSupplier ,
        tablePurchaseSupplier
    }
)(S_B_Supplier)
