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
    initInvoicingInvoicing ,
    tableInvoicingInvoicing
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
        title　:　'货品名称'　,
        dataIndex : 'productName' ,
        key : 'productName'
    },{
        title : '品牌' ,
        dataIndex 　:　'brand'　,
        key　:　'brand'
    },{
        title　:　'规格型号'　,
        dataIndex　:　'specifications'　,
        key　:　'specifications'
    },{
        title　:　'采购量'　,
        dataIndex　:　'purchase'　,
        key　:　'purchase',
        sorter: (a, b) => a.purchase - b.purchase ,
    },{
        title　:　'销售量'　,
        dataIndex　:　'salecount'　,
        key　:　'salecount',
        sorter: (a, b) => a.salecount - b.salecount ,
    },{
        title　:　'采购金额'　,
        dataIndex　:　'purchaseMoney'　,
        key　:　'purchaseMoney',
        sorter: (a, b) => a.purchaseMoney - b.purchaseMoney ,
    }, {
        title: '销售金额',
        dataIndex: 'saleMoney',
        key: 'saleMoney',
        sorter: (a, b) => a.saleMoney - b.saleMoney ,
    }, {
        title: '销售毛利',
        dataIndex: 'profit',
        key: 'profit',
        sorter: (a, b) => a.profit - b.profit ,
    }, {
        title: '销售毛利率',
        dataIndex: 'profitRate',
        key: 'profitRate',
        sorter: (a, b) => a.profitRate - b.profitRate ,
    }
] ;

class S_D_Invoicing extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            pageSize : 10 ,
            currentPage : 1 ,
            filter : {
                product : '' ,
                brand : 'all' ,
                specifications : 'all' ,
                startDate : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDate : moment().format('YYYY-MM-DD') ,
            }
        }
    }
    componentDidMount(){
        let token =  utils.cookie.config( TOKEN_NAME ) ;
        service.statistics.initInvoicingInvoicing({
            pageSize :10,
            pageNum : 1,
            tenantId : window.globalStore.getState().userstore.user.tenantId ,
            startDate : this.state.filter.startDate ,
            endDate : this.state.filter.endDate ,
        },(error,data) => {
            this.props.initInvoicingInvoicing(data) ;
        }) ;
    }
    _evClick_filterSearch(){
        var startDate = this.state.filter.startDate;
        var endDate = this.state.filter.endDate;
        service.statistics.initInvoicingInvoicing({
            pageSize :10,
            pageNum : 1,
            tenantId : window.globalStore.getState().userstore.user.tenantId,
            startDate: startDate,
            endDate: endDate,
            itemName : this.state.filter.product
        },(error,data)=>{
            this.props.initInvoicingInvoicing(data) ;
            this.setState({
                currentPage : 1
            });
        }) ;
    }
    render(){

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
                    <div className="tabel-wrap" key="anime-3">
                        <Table
                            dataSource={this.props.statistics.invoicing.invoicing.dataSource.data}
                            columns={this.props.COLUMNS}
                            pagination={{
                            showSizeChanger : true ,

                            total : this.props.statistics.invoicing.invoicing.totalCount ,

                            pageSize : this.state.pageSize ,

                            current :　this.state.currentPage ,
                            onShowSizeChange : (current , pageSize)=>{
                                var self = this;

                                self.setState({
                                    currentPage : 1 ,
                                    pageSize : pageSize
                                },()=> {
                                    service.statistics.initInvoicingInvoicing({
                                        tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                        pageSize :self.state.pageSize,
                                        pageNum : 1,
                                        startDate: this.state.filter.startDate,
                                        endDate: this.state.filter.endDate,
                                        itemId : this.state.filter.product
                                    },(error,data)=>{
                                        self.props.initInvoicingInvoicing(data) ;
                                    });
                                });
                            },
                            onChange : (value)=>{
                                var self = this;
                                self.setState({
                                        currentPage : value
                                    });
                                service.statistics.initInvoicingInvoicing({
                                    tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                    pageSize :self.state.pageSize,
                                    pageNum : value,
                                    startDate: this.state.filter.startDate,
                                    endDate: this.state.filter.endDate,
                                    itemId : this.state.filter.product
                                },(error,data)=>{
                                    self.props.initInvoicingInvoicing(data) ;
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
S_D_Invoicing.defaultProps = {
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
        initInvoicingInvoicing ,
        tableInvoicingInvoicing
    }
)( S_D_Invoicing )