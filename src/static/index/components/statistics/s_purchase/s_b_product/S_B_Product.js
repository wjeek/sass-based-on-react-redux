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
    initPurchaseProduct ,
    tablePurchaseProduct
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
        title : '供应商名称' ,
        dataIndex : 'supplier'　,
        key　:　'supplier'
    },{
        title　:　'联系人'　,
        dataIndex : 'contacter' ,
        key : 'contacter'
    },{
        title : '采购单数' ,
        dataIndex 　:　'salelist'　,
        key　:　'salelist' ,
        sorter: (a, b) => a.salelist - b.salelist ,
    },{
        title　:　'采购数量'　,
        dataIndex　:　'saleall'　,
        key　:　'saleall' ,
        sorter: (a, b) => a.saleall - b.saleall ,
    },{
        title　:　'采购金额'　,
        dataIndex　:　'salecount'　,
        key　:　'salecount' ,
        sorter: (a, b) => a.salecount - b.salecount ,
    },{
        title　:　'平均采购单价'　,
        dataIndex　:　'saleaverage'　,
        key　:　'saleaverage' ,
        sorter: (a, b) => a.saleaverage - b.saleaverage ,
    }
] ;

class S_B_Product extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            pageSize : 10 ,
            currentPage : 1 ,
            filter : {
                product : '' ,
                startDate : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDate : moment().format('YYYY-MM-DD') ,
                startDateForShow : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDateForShow : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                productForShow : '' ,
            }
        }
    }
    componentDidMount(){
        var params = {
            pageSize :10,
            pageNum : 1,
            startDate : this.state.filter.startDate ,
            endDate : this.state.filter.endDate ,
        };
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        //params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        service.statistics.initPurchaseProduct(params,(error,data) => {
            this.props.initPurchaseProduct(data) ;
        }) ;
    }
    _evClick_filterSearch(){
        let params ={
            itemName : this.state.filter.product,
            startDate : this.state.filter.startDate ,
            endDate : this.state.filter.endDate ,
        };
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        //params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        service.statistics.initPurchaseProduct(Object.assign({
            pageSize :10,
            pageNum : 1,
        },params),(error,data)=>{
            this.props.initPurchaseProduct(data) ;
            this.setState({
                currentPage : 1 ,
                filter : {
                    ...this.state.filter ,
                    productForShow : this.state.filter.product ,
                    startDateForShow : this.state.filter.startDate ,
                    endDateForShow : this.state.filter.endDate
                }
            });
        }) ;
    }
    render(){
        console.log(this.props.statistics) ;

        return (
            <div>
                <QueueAnim>
                    <div className="filter-wrap" key="anime-1">
                        <span className="filter">
                            <span className="filter-label">货品名称</span>
                            <span className="filter-component">
                                <Input
                                    placeholder='请输入货品名称'
                                    value={this.state.filter.product}
                                    onChange={(event)=>{
                                            this.setState({
                                                filter : {
                                                    ...this.state.filter ,
                                                    product : event.target.value ,
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
                        <span className="lab">货品名称: </span>
                        <span>{this.state.filter.productForShow}</span>
                    </span>
                    <span className="search-importantwrap">
                        <span className="lab">日期: </span>
                        <span>{this.state.filter.startDateForShow}</span>
                        <span>至</span>
                        <span>{this.state.filter.startDateForShow}</span>
                    </span>
                    </div>
                    <div className="tabel-wrap" key="anime-4">
                        <Table
                            dataSource={this.props.statistics.purchase.product.dataSource.data}
                            columns={this.props.COLUMNS}
                            pagination={{
                            showSizeChanger : true ,

                            total : this.props.statistics.purchase.product.totalCount ,

                            pageSize : this.state.pageSize ,

                            current :　this.state.currentPage ,
                            onShowSizeChange : (current , pageSize)=>{
                                var self = this;

                                self.setState({
                                    currentPage : 1 ,
                                    pageSize : pageSize
                                },()=> {
                                    var params = {
                                        pageSize :self.state.pageSize,
                                        pageNum : 1,
                                        itemId : this.state.filter.product,
                                        startDate : this.state.filter.startDate ,
                                        endDate : this.state.filter.endDate ,
                                    } ;
                                    if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                                        params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                    } else {
                                        params.userId = window.globalStore.getState().userstore.user.id ;
                                    }
                                    service.statistics.initPurchaseProduct(params,(error,data)=>{
                                        self.props.initPurchaseProduct(data) ;
                                    });
                                });
                            },
                            onChange : (value)=>{
                                var self = this;
                                self.setState({
                                        currentPage : value
                                    });
                                var params = {
                                    pageSize :self.state.pageSize,
                                    pageNum : value,
                                    itemId : this.state.filter.product,
                                    startDate : this.state.filter.startDate ,
                                    endDate : this.state.filter.endDate ,
                                } ;
                                if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                                    params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                } else {
                                    params.userId = window.globalStore.getState().userstore.user.id ;
                                }
                                service.statistics.initPurchaseProduct(params,(error,data)=>{
                                    self.props.initPurchaseProduct(data) ;
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

S_B_Product.defaultProps = {
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
        initPurchaseProduct ,
        tablePurchaseProduct
    }
)(S_B_Product)
