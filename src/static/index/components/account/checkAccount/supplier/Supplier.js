import React from 'react'
import { connect , dispatch } from 'react-redux'
import { push } from 'react-router-redux'
import moment from 'moment'
import { Link, browserHistory } from 'react-router'
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
import {
    Layer , Auth ,
} from '../../../index'
//logic
import {
    supplierInit ,
    supplierTable ,
    supplierLayer1Show ,
    supplierModal1Show ,
    supplierModal2Show ,
    supplierModal5Show ,
} from '../../../../actions/account'
import * as service from '../../../../service'
import BigNumber from 'bignumber.js' ;

import utils from '../../../../service/utils/index'
import {
    TOKEN_NAME,
    TENANT_ID,
    USER_NAME
} from '../../../../constants' ;

//const
const COLUMNS = [
    {
        title : '编号' ,
        dataIndex : 'id'　,
        key　:　'id'
    },{
        title　:　'日期'　,
        dataIndex : 'date' ,
        key : 'date'
    },{
        title : '供应商名称' ,
        dataIndex 　:　'supplier'　,
        key　:　'supplier'
    },{
        title　:　'应付款'　,
        dataIndex　:　'shouldPrice'　,
        key　:　'shouldPrice' ,
        sorter: (a, b) => a.shouldPrice.toString() - b.shouldPrice.toString() ,
    },{
        title　:　'到期日'　,
        dataIndex　:　'endDate'　,
        key　:　'endDate' ,
        sorter: (a, b) => a.endDate.toString() - b.endDate.toString() ,
    },{
        title　:　'备注'　,
        dataIndex　:　'tips'　,
        key　:　'tips'
    },{
        title　:　'采购员'　,
        dataIndex　:　'purchaseer'　,
        key　:　'purchaseer'
    },{
        title　:　'付款'　,
        dataIndex　:　'incomeCount'　,
        key　:　'incomeCount' ,
        render : (text,value)=>{
            return (
                <span>
                    <a
                        className="blue"
                        value={value.id}
                        onClick={
                            (event)=>{
                                globalStore.dispatch(supplierModal1Show({
                                    isShow : true ,
                                })) ;
                                globalEvent.account.editSupplierPressMoney.dispatch({
                                    data : value
                                }) ;
                            }
                        }
                    >付款</a>
                </span>
            )
        } ,
    },{
        title : '操作' ,
        dataIndex : 'operation' ,
        key : 'operation' ,
        render : (text,value)=>{
            return (
                <span>
                    <Auth
                        authIndex="32"
                    >
                        <i title="查看" className="sprite-view dib-table-icon" value={value.id}
                           onClick={(event)=>{
                               service.purchase.fetchPurchaseDeatil({
                                id : value.orderID
                            },(result)=>{
                                if ( result.mark == '000000000' ){
                                    service.base.fetchBaseSupplierDetail({
                                        id : result.data.purchaseOrderDto.supplier ,
                                    },function(error,result2){
                                        globalStore.dispatch(supplierLayer1Show({
                                        isShow : true ,
                                        showId : value.id,
                                        value : result.data.purchaseOrderDto,
                                        data : result2.data
                                    }))
                                    }) ;

                                } else {
                                    globalFunction.alert.warning( result.messages , '操作提示' ) ;
                                }
                            })
                           }}
                        ></i>
                    </Auth>
                    {/*<a
                     className="cell-link cell-operation"
                     value={value.id}
                     onClick={
                     (value)=>{
                     globalEvent.account.sendMessage.dispatch({
                     data : value.userId
                     }) ;
                     }
                     }
                     >催款</a>*/}
                </span>
            )
        }
    }
] ;
const COLUMNS_PRODUCT_FORSHOW = [
    {
        title : '货品',
        dataIndex : 'itemName',
        key : 'itemName',
        render: (text,value) => {
            return  (
                <a
                    className="blue"
                    key={text}
                    onClick={
                        (event)=>{

                        }
                    }
                >{text}</a>
            )
        }
    },{
        title : '单位' ,
        dataIndex : 'unitName' ,
        key : 'unitName'
    },{
        title : '数量' ,
        dataIndex : 'quantity' ,
        key : 'quantity' ,
    },{
        title : '单价' ,
        dataIndex : 'unitPrice' ,
        key : 'unitPrice' ,
    },{
        title : '折扣(%)' ,
        dataIndex : 'discount' ,
        key : 'discount' ,
    },{
        title : '采购金额' ,
        dataIndex : 'discountAmount' ,
        key : 'discountAmount'　,
    }
    // ,{
    //     title : '状态' ,
    //     dataIndex : 'deliveryStateName' ,
    //     key : 'deliveryStateName' ,
    // }
] ;
const ROW_SELECTION = {
    onChange(selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        globalEvent.account.checkOrder2.dispatch({
            data : selectedRows
        }) ;
    },
    onSelect(record, selected, selectedRows) {
        console.log(record, selected, selectedRows);
    },
    onSelectAll(selected, selectedRows, changeRows) {
        console.log(selected, selectedRows, changeRows);
    },
} ;
const PRESS_PRICE_ID_COLUMNS = [
    {
        title : '序号' ,
        dataIndex : 'order'　,
        key　:　'order'
    },
    {
        title : '编号' ,
        dataIndex : 'id'　,
        key　:　'id'
    },
    {
        title : '欠款金额' ,
        dataIndex : 'shouldPrice'　,
        key　:　'shouldPrice'
    },
] ;

class Supplier extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            pageSize : 10 ,
            currentPage : 1 ,
            filter : {
                id : '' ,
                startDate : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDate : moment().format('YYYY-MM-DD') ,
                supplier : 'default-all' ,
                marketer : 'default-all' ,
                purchaserInTab : '全部' ,
                supplierIntab : '全部',
                payableState : false ,
                nextPayableState : false ,
            },
            editSupplierPressMoney : (value)=>{
                value.data.date = moment().format('YYYY-MM-DD') ;
                value.data.payType = 1;
                this.setState({
                    modal1 : {
                        ...this.state.modal1 ,
                        model : value.data
                    }
                })
            },
            checkOrder2 : (value)=>{
                var i = 0;
                var user = '';
                var purchaseOrderNos = [];
                value.data.forEach(function(ext){
                    ext.order = i + 1;
                    var id = ext.id;
                    purchaseOrderNos[i] = {purchaseOrderNo : id};
                    user = ext.supplier;
                    i = i + 1;
                });
                this.setState({
                    modal1 : {
                        ...this.state.modal1 ,
                        selectedRows : value.data ,
                        purchaseOrderNos : purchaseOrderNos,
                        model : {
                            ...this.state.modal1.model,
                            user : user
                        }
                    }
                })
            },

            sendMessage : (value)=>{
                service.account.sendMessage(
                    [{customerId: '1'}]
                    ,(error,data) => {
                        this.props.userInit(data) ;
                    }) ;
            },

            modal5 : {
                model : {
                    supplier : 'all' ,
                    firstCount : '' ,
                    date : moment().format('YYYY-MM-DD') ,
                    tips : ''
                }
            },
            modal1 : {
                selectedRows : [],
                purchaseOrderNos : [],
                model : {
                    company : '' ,
                    id : '' ,
                    remainPrice : '' ,
                    truePrice : '' ,
                    accountType : '应付款' ,
                    payType : 'all' ,
                    date : moment().format('YYYY-MM-DD') ,
                    tips : ''
                }
            },
            validation : {
                receive_money_status : '',
                receive_money_help : '',
                payType_status : '',
                payType_help : '',
                business_date_status : '',
                business_date_help : '',
                early_money_status : '',
                early_money_help : '',
            }
        } ;
    }
    componentDidMount(){
        let params = {
            init : {
                pageSize :10,
                pageNum : 1,
                startTime : this.state.filter.startDate ,
                endTime : this.state.filter.endDate ,
                delFlag: 0,
                payableState : 1 ,
            } ,
            fetchSupplier : {
                pageSize :9999,
                pageNum : 1,
            } ,
            fetchPurchase : {
                pageSize :9999,
                pageNum : 1,
                roleIds : [1,4]
            }
        }
        //let token =  utils.cookie.config( TOKEN_NAME )
        params.init.tenantId = params.fetchSupplier.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        service.account.initSupplier(params,(error,data) => {
            this.props.supplierInit(data) ;
        }) ;
        //
        globalEvent.account.editSupplierPressMoney = new signals.Signal() ;
        globalEvent.account.editSupplierPressMoney.add(this.state.editSupplierPressMoney) ;

        globalEvent.account.checkOrder2 = new signals.Signal() ;
        globalEvent.account.checkOrder2.add(this.state.checkOrder2) ;

        globalEvent.account.sendMessage = new signals.Signal() ;
        globalEvent.account.sendMessage.add(this.state.sendMessage) ;
    }
    componentWillUnmount(){
        globalEvent.account.editSupplierPressMoney.remove(this.state.editSupplierPressMoney) ;
    }
    //event
    _ev_filterSearch(){
        let userId =  utils.cookie.config( 's_user' ) ;
        var id = this.state.filter.id || '';
        var startDate = this.state.filter.startDate;
        var endDate = this.state.filter.endDate;
        var supplierName = this.state.filter.supplier === 'default-all' ? '' : this.state.filter.supplier ;
        var purchaser = this.state.filter.marketer === 'default-all' ? '' : this.state.filter.marketer;
        service.account.fetchSupplierTable({
            pageSize :10,
            pageNum : 1,
            tenantId : window.globalStore.getState().userstore.user.tenantId,
            delFlag: 0,
            startTime: startDate,
            endTime: endDate,
            purchaseOrderNoSelect: id,
            supplierId: supplierName || '',
            userId: purchaser || '' ,
            //payableState :this.state.filter.payableState === false ? '' : 1 ,
            payableState : 1 ,
            nextPayableState : this.state.filter.nextPayableState === false ? '' : 1 ,
        },(error,data)=>{
            this.props.supplierTable(data) ;
            this.setState({
                currentPage : 1
            });
        }) ;
    }

    earlyStageAdjustment2(){
        var firstCount = this.state.modal5.model.firstCount || '';
        var date = this.state.modal5.model.date;
        var tips = this.state.modal1.model.tips;
        service.account.earlyStageAdjustment2({
            earlyArrears: firstCount || '100',
            id : '1',     //客户id
            tenantId : window.globalStore.getState().userstore.user.tenantId,    //公司id
            userId : '1',    //操作人id
        },(error,data)=>{
            this.props.supplierTable(data) ;
        }) ;

    }

    payAccount1(){
        var money = this.state.modal1.model.truePrice;
        var settlementWay = this.state.modal1.model.payType || 1;
        var businessTime = this.state.modal1.model.date;
        var comment = this.state.modal1.model.tips;
        var opposite = this.state.modal1.model.user;
        var salesOrderNo = this.state.modal1.model.id;
        service.account.payAccount1({
            money : money || '0',
            settlementWay : settlementWay || '0',
            businessTime : businessTime,
            comment : comment || '',
            settlementType : 6,
            opposite : this.state.modal1.model.userID,
            //salesOrderNo : salesOrderNo,
            tenantId : window.globalStore.getState().userstore.user.tenantId,    //公司id
            userId : 1,    //操作人id

            purchaseOrderDtos :[
                {purchaseOrderNo :salesOrderNo}
            ],
            salesOrderDtos :[]

        },(error,data)=>{
            console.log(data);
            globalFunction.alert.success('付款成功','操作提示');
            let params = {
                init : {
                    pageSize :10,
                    pageNum : 1,
                    startTime : this.state.filter.startDate ,
                    endTime : this.state.filter.endDate ,
                    delFlag: 0,
                    payableState : 1 ,
                    supplierId: this.state.filter.supplier === 'default-all' ? '' : this.state.filter.supplier,
                    userId:  this.state.filter.marketer === 'default-all' ? '' : this.state.filter.marketer ,
                } ,
                fetchSupplier : {
                    pageSize :9999,
                    pageNum : 1,
                } ,
                fetchPurchase : {
                    pageSize :9999,
                    pageNum : 1,
                    roleIds : [1,4]
                }
            }
            //let token =  utils.cookie.config( TOKEN_NAME )
            params.init.tenantId = params.fetchSupplier.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
            service.account.initSupplier(params,(error,data) => {
                this.props.supplierInit(data) ;
            }) ;
        }) ;
    }

    _countForShow(attr){
        var ret = 0 ;
        var details = this.props.account.supplier.pageState || {} ;
        details.product && details.product.forEach((v)=>{
            var _ret = new BigNumber( ret );
            var amount = ( v[ attr ] && new BigNumber( v[ attr ] ) ) || 0 ;
            ret = _ret.plus( amount ) - 0 ;
        }) ;
        return isNaN( ret )?0:ret ;
    }

    payAccount2(){
        var money = this.state.modal1.model.truePrice;
        var settlementWay = this.state.modal1.model.payType || 1;
        var businessTime = this.state.modal1.model.date;
        var comment = this.state.modal1.model.tips;
        var opposite = this.state.modal1.model.user;
        var purchaseOrderNos = this.state.modal1.purchaseOrderNos;
        service.account.payAccount1({
            money : money || '0',
            settlementWay : settlementWay || '0',
            businessTime : businessTime,
            comment : comment || '',
            settlementType : 6,
            opposite : this.state.modal1.model.userID,
            //salesOrderNo : salesOrderNo,
            tenantId : window.globalStore.getState().userstore.user.tenantId,    //公司id
            userId : 1,    //操作人id

            purchaseOrderDtos : purchaseOrderNos,
            salesOrderDtos :[]

        },(error,data)=>{
            console(data);
            globalFunction.alert.success('付款成功','操作提示');
            let params = {
                init : {
                    pageSize :10,
                    pageNum : 1,
                    startTime : this.state.filter.startDate ,
                    endTime : this.state.filter.endDate ,
                    delFlag: 0,
                    payableState : 1 ,
                    supplierId: this.state.filter.supplier === 'default-all' ? '' : this.state.filter.supplier,
                    userId:  this.state.filter.marketer === 'default-all' ? '' : this.state.filter.marketer ,
                } ,
                fetchSupplier : {
                    pageSize :9999,
                    pageNum : 1,
                } ,
                fetchPurchase : {
                    pageSize :9999,
                    pageNum : 1,
                    roleIds : [1,4]
                }
            }
            //let token =  utils.cookie.config( TOKEN_NAME )
            params.init.tenantId = params.fetchSupplier.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
            service.account.initSupplier(params,(error,data) => {
                this.props.supplierInit(data) ;
            }) ;
        }) ;
    }

    _ev_payableState_filterSearch(event){
        this.setState({
            filter : {
                ...this.state.filter ,
                payableState : event.target.checked
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
        console.log(this.props.account.supplier) ;

        const formItemLayout_static = {
            labelCol : {span:4} ,
            wrapperCol : {span:10}
        }

        const modal5FormLayout = {
            labelCol : {span:5} ,
            wrapperCol : {span:14}
        }


        return (
            <div>
                <QueueAnim>

                    <div className="filter-wrap" key="anim-1">
                        {/*
                         <span className="absoulte-button">
                         <Button>期初调整</Button>
                         <Button>查看流水</Button>
                         </span>
                         */}
                    <span className="filter">
                        <span className="filter-label">编号</span>
                        <span className="filter-component">
                            <Input
                                onChange={(event)=>{
                                    this.state.filter.id = event.target.value ;
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
                        <span className="filter-label">供应商名称</span>
                        <span className="filter-component">
                            <Select
                                labelInValue
                                showSearch
                                style={{width:150}}
                                placeholder="选择供应商"
                                notFoundContent=""
                                optionFilterProp="children"
                                value={{key : this.state.filter.supplier+''}}
                                onChange={
                                    (values)=>{
                                        this.setState({
                                            filter : {
                                                ...this.state.filter ,
                                                supplier : values.key+'' ,
                                                supplierInTab : values.label+''
                                            }
                                        })
                                    }
                                }
                            >
                                <Option value="default-all" title="全部">全部</Option>
                                {
                                    this.props.account.supplier.supplier.data.map((v,i)=>{
                                        return <Option title={v.name} value={v.value} key={v.value}>{v.name}</Option>
                                    })
                                }
                            </Select>
                        </span>
                    </span>
                    <span className="filter">
                        <span className="filter-label">采购员</span>
                        <span className="filter-component">
                            <Select
                                labelInValue
                                showSearch
                                style={{width:150}}
                                placeholder="选择采购员"
                                notFoundContent=""
                                optionFilterProp="children"
                                value={{key : this.state.filter.marketer+''}}
                                onChange={
                                    (values)=>{
                                        this.setState({
                                            filter : {
                                                ...this.state.filter ,
                                                marketer : values.key+'' ,
                                                purchaserInTab : values.label+''
                                            }
                                        })
                                    }
                                }
                            >
                                <Option value="default-all" title="全部">全部</Option>
                                {
                                    this.props.account.supplier.purchaseer.data.map((v,i)=>{
                                        return <Option title={v.name} value={v.value} key={v.value}>{v.name}</Option>
                                    })
                                }
                            </Select>
                        </span>
                    </span>
                    <span className="filter">
                        <span className="filter-component">
                            {
                                /*<Checkbox
                                    checked={this.state.filter.payableState}
                                    onChange={this._ev_payableState_filterSearch.bind(this)}
                                >
                                    应付款不为0
                                </Checkbox>*/
                            }
                            <Checkbox
                                checked={this.state.filter.nextPayableState}
                                onChange={this._ev_nextPayableState_filterSearch.bind(this)}
                            >
                                下周应付
                            </Checkbox>
                        </span>
                    </span>
                    </div>
                    <div className="search-wrap" key="anime-2">
                    <span className="search-btn">
                        <Button type="default" icon="search" onClick={this._ev_filterSearch.bind(this)}>查询</Button>
                    </span>
                    </div>
                    <div className="search-important" key="anime-3">
                        <Auth
                            authIndex="29"
                        >
                        <span className="search-importantwrap">
                            <a
                                onClick={
                                    ()=>{
                                    if(this.state.modal1.selectedRows.length == 0){
                                        globalFunction.alert.warning('请勾选采购单','操作提示');
                                    }
                                    else{
                                        this.props.supplierModal1Show({
                                            isShow : true ,
                                        })
                                        this.setState({
                                            modal1 : {
                                                ...this.state.modal1 ,
                                                model : {
                                                    ...this.state.modal1.model ,
                                                    /*supplier : '上海采购mro公司' ,
                                                    id : [{
                                                        order : '1' ,
                                                        id : 'XSD103920121' ,
                                                        remianPrice : '21211'
                                                    },{
                                                        order : '2' ,
                                                        id : 'XSD103920121' ,
                                                        remianPrice : '56789'
                                                    },{
                                                        order : '3' ,
                                                        id : 'XTD103920121' ,
                                                        remianPrice : '999'
                                                    }],*/

                                                    id : this.state.modal1.selectedRows,

                                                    truePrice : '' ,
                                                    accountType : '应付款' ,
                                                    payType : '' ,
                                                    date : moment().format('YYYY-MM-DD') ,
                                                    tips : ''
                                                }
                                            }
                                        })
                                    }

                                    }
                                }
                            >一键付款</a>
                        </span>
                        </Auth>
                        
                    </div>
                    <div className="table-wrap" key="anime-4">
                        <Table
                            dataSource={this.props.account.supplier.dataSource.data}
                            columns={this.props.COLUMNS}
                            rowSelection={this.props.ROW_SELECTION}
                            pagination={{
                            showSizeChanger : true ,

                            total : this.props.account.supplier.totalCount ,

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

                                            delFlag: 0,

                                            startTime: this.state.filter.startDate,
                                            endTime: this.state.filter.endDate,
                                            purchaseOrderNoSelect: this.state.filter.id || '',
                                            supplierId: this.state.filter.supplier === 'default-all' ? '' : this.state.filter.supplier,
                                            userId:  this.state.filter.marketer === 'default-all' ? '' : this.state.filter.marketer ,
                                            //payableState :this.state.filter.payableState === false ? '' : 1 ,
                                            payableState : 1 ,
                                            nextPayableState : this.state.filter.nextPayableState === false ? '' : 1 ,
                                        } ,
                                        fetchSupplier : {
                                            pageSize :9999,
                                            pageNum : 1,
                                        } ,
                                        fetchPurchase : {
                                            pageSize :9999,
                                            pageNum : 1,
                                            roleIds : [1,4]
                                        }
                                    }
                                    //let token =  utils.cookie.config( TOKEN_NAME ) ;
                                    params.init.tenantId = params.fetchSupplier.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                    service.account.initSupplier(params,(error,data)=>{
                                        self.props.supplierInit(data) ;
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

                                        delFlag: 0,

                                        startTime: this.state.filter.startDate,
                                        endTime: this.state.filter.endDate,
                                        purchaseOrderNoSelect: this.state.filter.id || '',
                                        supplierId: this.state.filter.supplier === 'default-all' ? '' : this.state.filter.supplier,
                                        userId:  this.state.filter.marketer === 'default-all' ? '' : this.state.filter.marketer ,
                                        //payableState :this.state.filter.payableState === false ? '' : 1 ,
                                        payableState : 1 ,
                                        nextPayableState : this.state.filter.nextPayableState === false ? '' : 1 ,
                                    } ,
                                    fetchSupplier : {
                                        pageSize :9999,
                                        pageNum : 1,
                                    } ,
                                    fetchPurchase : {
                                        pageSize :9999,
                                        pageNum : 1,
                                        roleIds : [1,4]
                                    }
                                }
                                //let token =  utils.cookie.config( TOKEN_NAME ) ;
                                params.init.tenantId = params.fetchSupplier.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                service.account.initSupplier(params,(error,data)=>{
                                    self.props.supplierInit(data) ;
                                });
                            }
                        }}
                        >

                        </Table>
                    </div>

                    {/*modal 5*/}
                    <Modal
                        className="account-user-modal1"
                        title="期初调整"
                        visible={this.props.account.supplier.pageState.modal5Show}
                        onOk={()=>{this.props.supplierModal5Show({isShow:false});this.earlyStageAdjustment2();}}
                        onCancel={()=>{this.props.supplierModal5Show({isShow:false})}}
                    >
                        <Form horizontal className="form-static">
                            <FormItem
                                {...modal5FormLayout}
                                label="供应商名称"
                            >
                                <Select
                                    value={this.state.modal5.model.supplier}
                                    onChange={
                                    (value)=>{
                                        this.setState({
                                            modal5 : {
                                                ...this.state.modal5　,
                                                model　: {
                                                    ...this.state.modal5.model ,
                                                    supplier : value
                                                }
                                            }
                                        })
                                    }
                                }
                                >
                                    <Option value="all" title="全部">全部供应商</Option>
                                    {
                                        this.props.account.supplier.supplier.data.map((v,i)=>{
                                            return <Option title={v.name} value={v.value} key={v.value}>{v.name}</Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                            <FormItem
                                {...modal5FormLayout}
                                label="期初欠款"
                                validateStatus={this.state.validation.early_money_status}
                                help={this.state.validation.early_money_help}
                            >
                            <span>
                                <Input
                                    value={this.state.modal5.model.firstCount}
                                    onChange={(event)=>{
                                            var early_money_validation = service.validation.account.checkAccount.money(event.target.value) ;
                                            this.setState({
                                                modal5 : {
                                                    ...this.state.modal5 ,
                                                    model : {
                                                        ...this.state.modal5.model ,
                                                        firstCount : event.target.value
                                                    }
                                                },
                                                validation : {
                                                    ...this.state.validation ,
                                                    early_money_status : early_money_validation.validateStatus ,
                                                    early_money_help : early_money_validation.help ,
                                                }
                                            })
                                        }
                                    }
                                />
                            </span>
                            </FormItem>
                            <FormItem
                                {...modal5FormLayout}
                                label="业务日期"
                            >
                                <span>{this.state.modal5.model.date}</span>
                            </FormItem>
                            <FormItem
                                {...modal5FormLayout}
                                label="备注"
                            >
                            <span>
                                <Input
                                    value={this.state.modal5.model.tips}
                                    onChange={
                                        (event)=>{
                                            this.setState({
                                                modal5 : {
                                                    ...this.state.modal5 ,
                                                    model : {
                                                        ...this.state.modal5.model ,
                                                        tips : event.target.value
                                                    }
                                                }
                                            })
                                        }
                                    }
                                />
                            </span>
                            </FormItem>
                        </Form>
                    </Modal>

                    { /*modal 1 - 2*/ }
                    <Modal
                        className="account-user-modal1"
                        title="付款"
                        visible={this.props.account.supplier.pageState.modal1Show}
                        onOk={()=>{
                            this.props.supplierModal1Show({isShow:false});
                            if(Object.prototype.toString.call(this.state.modal1.model.id)==='[object Array]'){
                                this.payAccount2();
                            }
                            else {
                                this.payAccount1();
                            }

                        }
                    }
                        onCancel={()=>{this.props.supplierModal1Show({isShow:false})}}
                    >
                        <Form horizontal className="form-static">
                            <FormItem
                                {...modal5FormLayout}
                                label="公司名称"
                            >
                                <span>{this.state.modal1.model.supplier}</span>
                            </FormItem>
                            {
                                (Object.prototype.toString.call(this.state.modal1.model.id)==='[object Array]') ? (
                                    <FormItem
                                        {...modal5FormLayout}
                                        label="采购单"
                                    >
                                        {
                                             (
                                                <Table
                                                    pagination={false}
                                                    dataSource={this.state.modal1.model.id}
                                                    columns={this.props.PRESS_PRICE_ID_COLUMNS}
                                                ></Table>
                                            )
                                        }
                                    </FormItem>
                                ) : (
                                    <FormItem
                                        {...modal5FormLayout}
                                        label="编号"
                                    >
                                        {
                                            (
                                                <span>{this.state.modal1.model.id}</span>
                                            )
                                        }
                                    </FormItem>
                                )
                            }

                            {
                                (Object.prototype.toString.call(this.state.modal1.model.id)==='[object Array]') ? (
                                    <span></span>
                                ) : (
                                    <FormItem
                                        {...modal5FormLayout}
                                        label="欠款金额"
                                    >
                                        <span>{this.state.modal1.model.shouldPrice}</span>
                                    </FormItem>
                                )
                            }
                            <FormItem
                                {...modal5FormLayout}
                                label="实付金额"
                                validateStatus={this.state.validation.receive_money_status}
                                help={this.state.validation.receive_money_help}
                            >
                            <span>
                                <Input
                                    value={this.state.modal1.model.truePrice}
                                    onChange={
                                        (event)=>{
                                            var receive_money_validation = service.validation.account.checkAccount.money(event.target.value) ;
                                            this.setState({
                                                modal1 : {
                                                    ...this.state.modal1　,
                                                    model　:　{
                                                        ...this.state.modal1.model　,
                                                        truePrice　:　parseFloat(event.target.value)>parseFloat(this.state.modal1.model.shouldPrice)? event.target.value.substring(0,event.target.value.length-1) :event.target.value　
                                                    }
                                                },
                                                validation : {
                                                    ...this.state.validation ,
                                                    receive_money_status : receive_money_validation.validateStatus ,
                                                    receive_money_help : receive_money_validation.help ,
                                                }
                                            })
                                        }
                                    }
                                />
                            </span>
                            </FormItem>
                            <FormItem
                                {...modal5FormLayout}
                                label="账款类型"
                            >
                                <span>应付款</span>
                            </FormItem>
                            <FormItem
                                {...modal5FormLayout}
                                label="结算方式"
                                validateStatus={this.state.validation.payType_status}
                                help={this.state.validation.payType_help}
                            >
                                <Select
                                    value={this.state.modal1.model.payType}
                                    onChange={
                                    (value)=>{
                                        var payType_validation = service.validation.account.checkAccount.payType(event.target.value) ;
                                        this.setState({
                                            modal1 : {
                                                ...this.state.modal1　,
                                                model　: {
                                                    ...this.state.modal1.model ,
                                                    payType : value
                                                }
                                            },
                                            validation : {
                                                ...this.state.validation ,
                                                payType_status : payType_validation.validateStatus ,
                                                payType_help : payType_validation.help ,
                                            }
                                        })
                                    }
                                }
                                >
                                    <Option value="1" title="现金">现金</Option>
                                    {
                                        this.props.account.supplier.payType.data.map((v,i)=>{
                                            return <Option title={v.name} value={v.value} key={v.value}>{v.name}</Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                            <FormItem
                                {...modal5FormLayout}
                                label="业务日期"
                                validateStatus={this.state.validation.date_status}
                                help={this.state.validation.date_help}
                            >
                                <DatePicker
                                    size="large"
                                    key="for"
                                    defaultValue={this.state.modal1.model.date}
                                    format="yyyy-MM-dd"
                                    onChange={(v,dataString)=>{
                                    var date_validation = service.validation.account.checkAccount.date(event.target.value) ;
                                    this.setState({
                                        modal1 : {
                                            ...this.state.modal1 ,
                                            model : {
                                                ...this.state.modal1.model ,
                                                date : dataString ,
                                            }
                                        },
                                        validation : {
                                            ...this.state.validation ,
                                            date_status : date_validation.validateStatus ,
                                            date_help : date_validation.help ,
                                        }
                                    })
                                }}></DatePicker>
                            </FormItem>
                            <FormItem
                                {...modal5FormLayout}
                                label="备注"
                            >
                            <span>
                                <Input
                                    value={this.state.modal1.model.tips}
                                    onChange={
                                        (event)=>{
                                            this.setState({
                                                modal1 : {
                                                    ...this.state.modal1　,
                                                    model　:　{
                                                        ...this.state.modal1.model　,
                                                        tips　:　event.target.value　
                                                    }
                                                }
                                            })
                                        }
                                    }
                                />
                            </span>
                            </FormItem>
                        </Form>
                    </Modal>
                    <Modal
                        className="account-user-modal2"
                        title="确认付款"
                        visible={this.props.account.supplier.pageState.modal2Show}
                        onOk={()=>{this.props.supplierModal2Show({isShow:false})}}
                        onCancel={()=>{this.props.supplierModal2Show({isShow:false})}}
                    >
                        <Form horizontal className="form-static">
                            <FormItem
                                {...modal5FormLayout}
                                label="公司名称"
                            >
                                <span>{this.state.modal1.model.supplier}</span>
                            </FormItem>
                            <FormItem
                                {...modal5FormLayout}
                                label="编号"
                            >
                                {
                                    (Object.prototype.toString.call(this.state.modal1.model.id)==='[object Array]') ? (
                                        <Table
                                            pagination={false}
                                            dataSource={this.state.modal1.model.id}
                                            columns={this.props.PRESS_PRICE_ID_COLUMNS}
                                        ></Table>
                                    ) : (
                                        <span>{this.state.modal1.model.id}</span>
                                    )
                                }
                            </FormItem>
                            {
                                (Object.prototype.toString.call(this.state.modal1.model.id)==='[object Array]') ? (
                                    <span></span>
                                ) : (
                                    <FormItem
                                        {...modal5FormLayout}
                                        label="欠款金额"
                                    >
                                        <span>{this.state.modal1.model.remainPrice}</span>
                                    </FormItem>
                                )
                            }
                            <FormItem
                                {...modal5FormLayout}
                                label="实收金额"
                            >
                                <span>{this.state.modal1.model.truePrice}</span>
                            </FormItem>
                            <FormItem
                                {...modal5FormLayout}
                                label="账款类型"
                            >
                                <span>{this.state.modal1.model.accountType}</span>
                            </FormItem>
                            <FormItem
                                {...modal5FormLayout}
                                label="结算方式"
                            >
                                <span>{this.state.modal1.model.payType}</span>
                            </FormItem>
                            <FormItem
                                {...modal5FormLayout}
                                label="业务日期"
                            >
                                <span>{this.state.modal1.model.date}</span>
                            </FormItem>
                            <FormItem
                                {...modal5FormLayout}
                                label="备注"
                            >
                                <span>{this.state.modal1.model.tips}</span>
                            </FormItem>
                        </Form>
                    </Modal>
                    <Layer
                        addClass="marketDetail"
                        layerShow={this.props.account.supplier.pageState.layer1Show}
                        _handleLayerHide={()=>{this.props.supplierLayer1Show({isShow:false})}}
                    >
                        <div className="header">

                            <span className="header-east">

                                <span
                                    className="nav-return-name"
                                    onClick={()=>{
                                        this.props.supplierLayer1Show({
                                            isShow : false,
                                        })
                                    }}
                                >
                                    <i className="sprite-arrow3"></i>
                                    <span className="re-arrow">返回</span>
                                </span>

                                {/*<a className="left-irow" onClick={()=>{this.props.supplierLayer1Show({isShow:false})}}>&lt;</a>*/}
                                <Button style={{lineHeight:'26px'}} className="edit" onClick={(ev)=>{
                                    globalStore.dispatch(push('/purchase/order')) ; //route change
                                }}>
                                    <i></i>
                                    <span>去采购记录</span>
                                </Button>
                            </span>
                            <span className="header-west">
                                <div className="header-north">
                                    <span className="h3">{this.props.account.supplier.pageState.customer}</span>
                                </div>
                                <div className="header-south">
                                    <span className="h-span-2">
                                        <span className="span-third-in-one">
                                            <span className="h-label h-date">日期</span>
                                            <span className="h-dot">:</span>
                                            <span className="h-info">{this.props.account.supplier.pageState.date}</span>
                                        </span>
                                        <span className="span-third-in-one">
                                            <span className="h-label h-id">编号</span>
                                            <span className="h-dot">:</span>
                                            <span className="h-info">{this.props.account.supplier.pageState.id}</span>
                                        </span>
                                    </span>
                                    <span className="h-span">
                                        <span className="span-third-in-one">
                                            <span className="h-label h-contact">联系人</span>
                                            <span className="h-dot">:</span>
                                            <span className="h-info">{this.props.account.supplier.pageState.contacter}</span>
                                        </span>
                                        <span className="span-third-in-one">
                                            <span className="h-label h-phone">联系电话</span>
                                            <span className="h-dot">:</span>
                                            <span className="h-info">{this.props.account.supplier.pageState.phone}</span>
                                        </span>
                                        <span className="span-third-in-one">
                                            <span className="h-label h-remain">客户尚欠款</span>
                                            <span className="h-dot">:</span>
                                            <span className="h-info red">{this.props.account.supplier.pageState.remainPrice}</span>
                                        </span>
                                    </span>
                                </div>
                            </span>
                        </div>
                        <div className="content-wrap">
                            <div className="content">
                                <Form horizontal className="form-static">
                                    <FormItem
                                        {...formItemLayout_static}
                                        label="采购金额"
                                    >
                                        <span>{this.props.account.supplier.pageState.sellCount}</span>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout_static}
                                        label="结算方式"
                                    >
                                        <span>{this.props.account.supplier.pageState.payType}</span>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout_static}
                                        label="实付款"
                                    >
                                        <span>{this.props.account.supplier.pageState.truePrice}</span>
                                        <a className="view-detail">
                                            <span>查看明细</span>
                                            <i></i>
                                            <div className="detail-wrap" style={{overflow:'hidden'}}>
                                                {this.props.account.supplier.pageState.accountDetails.map((v, i) => {
                                                    return (
                                                        <div key={i}>
                                                                <span className="span-1">
                                                                    <span>{v.businessTime}</span>
                                                                </span>
                                                                <span className="span-2">
                                                                    <span>采购支出:</span>
                                                                    <span className="span-v">￥{v.money}</span>
                                                                    <span>结算方式:</span>
                                                                    <span className="span-v">{v.settlementWay}</span>
                                                                    <span>操作人:</span>
                                                                    <span className="span-v">{v.userName}</span>
                                                                </span>
                                                        </div>
                                                    ) ;

                                                })}
                                            </div>
                                        </a>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout_static}
                                        label="本单应付款"
                                    >
                                        <span className="red">{this.props.account.supplier.pageState.shouldPrice}</span>
                                    </FormItem>
                                    {/*<FormItem
                                        {...formItemLayout_static}
                                        label="图片"
                                    >
                                        <div>
                                            <img src={this.props.account.supplier.pageState.img} style={{width:'100px',height:'100px'}} alt="" />
                                        </div>
                                    </FormItem>*/}
                                    <FormItem
                                        {...formItemLayout_static}
                                        label="备注"
                                    >
                                        <span>{this.props.account.supplier.pageState.tips||'无'}</span>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout_static}
                                        label="操作人"
                                    >
                                        <span>{this.props.account.supplier.pageState.operator}</span>
                                    </FormItem>
                                </Form>
                                <div className="customer-form-image">
                                    <img src={this.props.account.supplier.pageState.img} alt="" />
                                </div>
                                <div className="productlist-wrap">
                                    <div className="productlist">
                                        <Row>
                                            <Col span={4}>
                                                <span className="title">货品清单</span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24} offset={0}>
                                                <Table
                                                    dataSource={this.props.account.supplier.pageState.product}
                                                    pagination={false}
                                                    columns={this.props.COLUMNS_PRODUCT_FORSHOW}
                                                ></Table>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24} offset={0}>
                                                <span className="staticCount">
                                                    <div className="sta-line">
                                                        <span className="sta-lable">数量&nbsp;:</span>
                                                        <span className="sta-value red">{this.props.account.supplier.pageState.productNum}</span>
                                                    </div>
                                                    <div className="sta-line">
                                                        <span className="sta-lable">合计&nbsp;:</span>
                                                        <span className="sta-value red">{}</span>
                                                    </div>
                                                    {/*<span className="staticCount-title">合计&nbsp;</span>
                                                    <span style={{color:'#aaa'}}>&nbsp;数量&nbsp;:&nbsp;</span>
                                                    <span className="red" style={{paddingLeft:'5px',paddingRight:'5px'}}>{this.props.account.supplier.pageState.productNum}</span>
                                                    <span style={{color:'#aaa'}}>&nbsp;采购金额&nbsp;:&nbsp;</span>
                                                    <span className="red" style={{paddingLeft:'5px',paddingRight:'5px'}}>{}</span>*/}
                                                </span>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Layer>

                </QueueAnim>

            </div>

        )
    }
}

Supplier.defaultProps = {
    COLUMNS : COLUMNS ,
    ROW_SELECTION : ROW_SELECTION ,
    PRESS_PRICE_ID_COLUMNS : PRESS_PRICE_ID_COLUMNS ,
    COLUMNS_PRODUCT_FORSHOW : COLUMNS_PRODUCT_FORSHOW ,
}

export default connect(
    state => {
        var account = state.account ;
        return {
            account
        }
    },
    {
        supplierInit ,
        supplierTable ,
        supplierLayer1Show ,
        supplierModal1Show ,
        supplierModal2Show ,
        supplierModal5Show ,
    }
)(Supplier)
