import React from 'react'
import { connect , dispatch } from 'react-redux'
import moment from 'moment'
import QueueAnim from 'rc-queue-anim'
import { push } from 'react-router-redux'
//component
import {
    Button , Pagination , Select , Input , DatePicker , Table , Form , Modal , Radio ,
    Upload ,
    Row , Col , Popconfirm ,
    Icon
} from 'antd/dist/antd.js'
const Option = Select.Option ;
const FormItem = Form.Item ;
const confirm = Modal.confirm ;
const RadioButton = Radio.Button ;
const RadioGroup = Radio.Group ;
import {
    Layer , Auth ,
} from '../../index'
//logic
import {
    chargeInit ,
    chargeTable ,
    chargeLayer1Show ,
    chargeLayer1Hide,
    chargeLayer2Show ,
    chargeModal1Show ,
    chargeModal2Show
} from '../../../actions/account'
import * as service from '../../../service'

import utils from '../../../service/utils/index'
import {
    TOKEN_NAME,
    TENANT_ID
} from '../../../constants' ;
import BigNumber from 'bignumber.js' ;

//const
const COLUMNS = [
    {
        title : '业务日期' ,
        dataIndex : 'date' ,
        key : 'date'
    },{
        title : '编号' ,
        dataIndex : 'id' ,
        key : 'id'
    },{
        title : '结算方式' ,
        dataIndex : 'payType_forShow' ,
        key : 'payType_forShow' ,
        sorter: (a, b) => a.payType - b.payType ,
    },{
        title : '账款类型' ,
        dataIndex : 'accountType_forShow' ,
        key : 'accountType_forShow' ,
        sorter: (a, b) => a.accountType - b.accountType ,
    },{
        title : '交易方' ,
        dataIndex : 'customer' ,
        key : 'customer' ,
        sorter: (a, b) => a.customer - b.customer ,
    },{
        title : '收入' ,
        dataIndex : 'income' ,
        key : 'income' ,
        sorter: (a, b) => a.income - b.income ,
    },{
        title : '支出' ,
        dataIndex : 'payment' ,
        key : 'payment' ,
        sorter: (a, b) => a.payment - b.payment ,
    },{
        title : '备注' ,
        dataIndex : 'tips' ,
        key : 'tips' ,
    },{
        title : '操作人' ,
        dataIndex : 'operator' ,
        key : 'operator'
    },{
        title : '操作' ,
        dataIndex : 'operation' ,
        key : 'operation' ,
        render: (text,value)=>{
            return (
                <span>
                    { (value.accountType == '2' || value.accountType == '3')&&
                        (<Auth
                            authIndex="21"
                        >
                            <i title="查看" className="sprite-view dib-table-icon" value={value.id}
                               onClick={(event)=>{
                           if(value.accountType == '2')
                               {
                                   service.account.fetchChargeAccountDetail({
                                        tallyType : value.accountType,
                                        tallyNo : value.id
                                    },(error,result) =>{
                                        if ( result.data ){
                                            service.base.fetchBaseCustomerDetail({
                                                id : result.data[0].customerId ,
                                            },function(error,result2){

                                                globalStore.dispatch(chargeLayer1Show({
                                                    isShow : true ,
                                                    showId : value.id,
                                                    value : result.data[0],
                                                    data : result2.data
                                                })) ;
                                            }) ;
                                        }
                                         else {
                                            globalFunction.alert.warning( result.messages , '操作提示' ) ;
                                         }

                                        }
                                   )
                               }
                           else if(value.accountType == '3'){
                                service.account.fetchChargeAccountDetail2({
                                        tallyType : value.accountType,
                                        tallyNo : value.id
                                    },(error,result) =>{
                                        if ( result.data ){
                                            service.base.fetchBaseSupplierDetail({
                                                id : result.data[0].supplierId ,
                                            },function(error,result2){

                                                globalStore.dispatch(chargeLayer2Show({
                                                    isShow : true ,
                                                    showId : value.id,
                                                    value : result.data[0],
                                                    data : result2.data
                                                })) ;
                                            }) ;

                                            }
                                        }
                                   )
                           }

                           else{
                                globalStore.alert.warning('此单暂不能查看','操作提示')
                           }
                           }}

                            ></i>
                        </Auth>)
                    }
                    {
                        value.type === 'SKD' && (
                            <i className="sprite-edit dib-table-icon" value="编辑"
                               onClick={(event)=>{
                                    globalStore.dispatch(chargeModal1Show({
                                        isShow : true ,
                                        id : value.id
                                    }))
                                }}
                            ></i>
                        )
                    }
                    <Auth
                        authIndex="22"
                    >
                        {
                            (value.settlementType == '1' || value.settlementType == '6') && (
                                <Popconfirm
                                    title="确认删除这条流水账吗?"
                                    onConfirm={()=>{
                                    service.account.deleteChargeAccount({
                                            id : value.orderID - 0
                                    },(result)=>{
                                        if ( result.mark == '000000000' ){
                                            globalFunction.alert.info( '删除流水账成功'　,　'操作提示'　) ;
                                            service.account.fetchChargeTable({
                                                pageSize :10,
                                                pageNum : 1,
                                                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                                delFlag: 0
                                            },(error,result)=>{
                                                globalEvent.account.chargeTable.dispatch({
                                                    data : result
                                                }) ;
                                            }) ;
                                        } else {
                                            globalFunction.alert.warning( result.message　,　'操作提示'　) ;
                                        }
                                    }) ;
                                }}
                                    onCancel={()=>{

                                }}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <i title="删除" className="sprite-delete dib-table-icon"
                                       value={value.id}
                                       onClick={(event)=>{
                                           console.log(value.id) ;
                                        }
                                    }
                                    ></i>
                                </Popconfirm>

                            )
                        }
                    </Auth>
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
        title : '销售金额' ,
        dataIndex : 'discountAmount' ,
        key : 'discountAmount'　,
    }
    // ,{
    //     title : '状态' ,
    //     dataIndex : 'deliveryStateName' ,
    //     key : 'deliveryStateName' ,
    // }
] ;

const COLUMNS_PRODUCT = [ {
    title : '货品',
    dataIndex : 'itemName',
    key : 'itemName',
    render: (text,value) => {
        return  <a
            className="blue"
            key={text}
            value={value.id}
            onClick={
                        (event)=>{
                    //     let id = event.target.attributes.value.value ;
                    //     globalStore.dispatch(layerShow2(true,{
                    //         product : id
                    //     })) ;
                        }
                    }
        >{text}</a>
    }
},{
    title : '单位' ,
    dataIndex : 'unitName' ,
    key : 'unitName'
},{
    title : '数量' ,
    dataIndex : 'quantity' ,
    key : 'quantity' ,
    render: (text) => {
        return  <a className="blue" key={text}>{text}</a>
    }
},{
    title : '单价' ,
    dataIndex : 'unitPrice' ,
    key : 'unitPrice' ,
    render: (text) => {
        return  <a className="blue" key={text}>{text}</a>
    }
},{
    title : '折扣(%)' ,
    dataIndex : 'discount' ,
    key : 'discount' ,
    render: (text) => {
        return  <a className="blue" key={text}>{text}</a>
    }
},{
    title : '销售金额' ,
    dataIndex : 'discountAmount' ,
    key : 'discountAmount'
}] ;

class ChargeAccount extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            pageSize : 10 ,
            currentPage : 1 ,
            filter : {
                startDate : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDate : moment().format('YYYY-MM-DD') ,
                startDateForShow : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDateForShow : moment().format('YYYY-MM-DD') ,
                payType : 'default-all' ,
                accountType : 'default-all' ,
                payTypeInTab : '全部' ,    //search-important部分显示用的
                accountTypeInTab : '全部' ,
                payTypeInTabShow : '全部' ,    //点查询之后变化
                accountTypeInTabShow : '全部' ,
            } ,
            modal1Model : {
                modalType : 'income' , //income, payment

                customer : '' ,
                incomeType : 'marker' ,
                truePrice : '' ,
                date : moment().format('YYYY-MM-DD') ,
                tips : ''
            },

            chargeTable : (value)=>{
                this.props.chargeTable(value.data);
            }
        }
    }
    //
    componentDidMount(){
        let token =  utils.cookie.config( TOKEN_NAME ) ;
        service.account.initCharge({
            pageSize :10,
            pageNum : 1,
            tenantId : window.globalStore.getState().userstore.user.tenantId,
            delFlag: 0 ,
            startDate : this.state.filter.startDate ,
            endDate : this.state.filter.endDate ,
        },(error,result)=>{
            this.props.chargeInit(result) ;
        }) ;


        globalEvent.account.chargeTable = new signals.Signal() ;
        globalEvent.account.chargeTable.add(this.state.chargeTable) ;
    }

    _countForShow(attr){
        var ret = 0 ;
        var details = this.props.account.charge.productDataSource.data || {} ;
        details && details.forEach((v)=>{
            var _ret = new BigNumber( ret );
            var amount = ( v[ attr ] && new BigNumber( v[ attr ] ) ) || 0 ;
            ret = _ret.plus( amount ) - 0 ;
        }) ;
        return isNaN( ret )?0:ret ;
    }
    //
    _evClick_filterSearch(event){
        var startDate = this.state.filter.startDate;
        var endDate = this.state.filter.endDate;
        var payType = this.state.filter.payType === 'default-all' ? '' :  this.state.filter.payType;
        var accountType = this.state.filter.accountType === 'default-all' ? '' :  this.state.filter.accountType;
        service.account.fetchChargeTable({
            pageSize :10,
            pageNum : 1,
            tenantId : window.globalStore.getState().userstore.user.tenantId,
            delFlag: 0,
            startTime: startDate,
            endTime: endDate,
            settlementWay: payType,
            settlementType: accountType
        },(error,result)=>{
            this.props.chargeTable(result) ;
            this.setState({
                currentPage : 1 ,
                filter : {
                    ...this.state.filter ,
                    payTypeInTabShow : this.state.filter.payTypeInTab ,
                    accountTypeInTabShow : this.state.filter.accountTypeInTab ,
                    startDateForShow : this.state.filter.startDate ,
                    endDateForShow : this.state.filter.endDate
                }
            });
        }) ;
    }
    _evClick_modal1Submit(event){
        console.log(this.state.modal1Model) ;
    }
    //utils
    _findDetails(id){
        let result = {} ;
        this.props.account.charge.dataSource.data.forEach((v)=>{
            if ( v.id === id ){
                result = v;
            }
        }) ;
        return result ;
    }

    render (){
        const formItemLayout_static = {
            labelCol : {span:4} ,
            wrapperCol : {span:10}
        }

        console.log(this.props.account.charge) ;

        const modal1FormLayout = {
            labelCol : { span : 5 } ,
            wrapperCol : { span : 14 }
        } ;
        const modal1FormBtnLayout = {
            wrapperCol : { span : 14 , offset : 5 }
        } ;
        const layer1FormLayout = {
            labelCol : {span:4} ,
            wrapperCol : {span:10}
        } ;

        //let detailsWaitShow = this._findDetails(this.props.account.charge.pageState.showId) ;

        return (
            <div>

                <div className="center-east-north">

                    <a className="active">流水账</a>

                </div>

                <div className="center-east-center">
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
                                ></DatePicker>
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
                                ></DatePicker>
                            </span>
                        </span>
                        <span className="filter">
                            <span className="filter-label">结算方式</span>
                            <span className="filter-component">
                                <Select
                                    style={{width:120}}
                                    labelInValue
                                    value={{key : this.state.filter.payType + ''}}
                                    onChange={(values)=>{
                                        this.setState({
                                            filter : {
                                                ...this.state.filter ,
                                                payType : values.key+'' ,
                                                payTypeInTab : values.label+'' ,
                                            }
                                        }) ;
                                    }}
                                >
                                    <Option value="default-all" title="全部结算方式">全部结算方式</Option>
                                    {
                                        this.props.account.charge.payType.data.map((v,i)=>{
                                            return <Option title={v.name} value={v.value+''} key={v.value}>{v.name}</Option>
                                        })
                                    }
                                </Select>
                            </span>
                        </span>
                        <span className="filter">
                            <span className="filter-label">账款类型</span>
                            <span className="filter-component">
                                <Select
                                    style={{width:120}}
                                    labelInValue
                                    value={{key : this.state.filter.accountType+''}}
                                    onChange={(values)=>{
                                        this.setState({
                                            filter : {
                                                ...this.state.filter ,
                                                accountType : values.key+ '' ,
                                                accountTypeInTab : values.label+ '' ,
                                            }
                                        }) ;
                                    }}
                                >
                                    <Option value="default-all" title="全部账款类型">全部</Option>
                                    {
                                        this.props.account.charge.accountType.data.map((v,i)=>{
                                            return <Option title={v.name} value={v.value+''} key={v.value}>{v.name}</Option>
                                        })
                                    }
                                </Select>
                            </span>
                        </span>
                        </div>
                        <div className="search-wrap" key="anime-2">
                        <span className="searc-btn">
                            <Button type="default" icon="search" onClick={this._evClick_filterSearch.bind(this)}>查询</Button>
                        </span>
                            {/*
                             <span className="searc-btn">
                             <Button type="primary" icon="search" onClick={()=>{this.props.chargeModal1Show({isShow:true})}}>记一笔</Button>
                             </span>
                             */}
                        </div>
                        <div className="search-important" key="anime-3">
                        <span className="search-importantwrap">
                            <span className="lab">结算方式: </span>
                            <span>{this.state.filter.payTypeInTabShow}</span>
                        </span>
                        <span className="search-importantwrap">
                            <span className="lab">账款类型: </span>
                            <span>{this.state.filter.accountTypeInTabShow}</span>
                        </span>
                        <span className="search-importantwrap">
                            <span className="lab">日期: </span>
                            <span>{this.state.filter.startDateForShow}</span>
                            <span>至</span>
                            <span>{this.state.filter.endDateForShow}</span>
                        </span>
                        <span className="search-importantwrap">
                            <span className="lab">总收入: </span>
                            <span className="totalNumber">{this.props.account.charge.dataSource.data.length != 0 && this.props.account.charge.dataSource.data[0].sumSoMoney}</span>
                        </span>
                        <span className="search-importantwrap">
                            <span className="lab">总支出: </span>
                            <span className="totalNumber">{this.props.account.charge.dataSource.data.length != 0 && this.props.account.charge.dataSource.data[0].sumPoMoney}</span>
                        </span>
                        </div>
                        <div className="tabel-wrap" key="anime-4">
                            <Table
                                dataSource={this.props.account.charge.dataSource.data}
                                columns={this.props.COLUMNS}
                                pagination={{
                                showSizeChanger : true ,

                                total : this.props.account.charge.totalCount ,

                                pageSize : this.state.pageSize ,

                                current :　this.state.currentPage ,
                                onShowSizeChange : (current , pageSize)=>{
                                    var self = this;

                                    self.setState({
                                        currentPage : 1 ,
                                        pageSize : pageSize
                                    },()=> {
                                        service.account.initCharge({
                                            tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                            pageSize :self.state.pageSize,
                                            pageNum : 1,
                                            delFlag: 0,
                                            startTime: this.state.filter.startDate,
                                            endTime: this.state.filter.endDate,
                                            settlementWay: this.state.filter.payType === 'default-all' ? '' :  this.state.filter.payType,
                                            settlementType: this.state.filter.accountType === 'default-all' ? '' :  this.state.filter.accountType
                                        },(error,data)=>{
                                            self.props.chargeInit(data) ;
                                        });
                                    });
                                },
                                onChange : (value)=>{
                                    var self = this;
                                    self.setState({
                                        currentPage : value
                                    });
                                    service.account.initCharge({
                                        tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                        pageSize :self.state.pageSize,
                                        pageNum : value,
                                        delFlag: 0,
                                        startTime: this.state.filter.startDate,
                                        endTime: this.state.filter.endDate,
                                        settlementWay: this.state.filter.payType === 'default-all' ? '' :  this.state.filter.payType,
                                        settlementType: this.state.filter.accountType === 'default-all' ? '' :  this.state.filter.accountType
                                    },(error,data)=>{
                                        self.props.chargeInit(data) ;
                                    });
                                }
                            }}
                            ></Table>
                        </div>

                        {/*EXTENSION*/}
                        {/*modal hide! 本处的modal暂时不显示*/}
                        <Modal className="account-charge-modal1" title="提示"
                               visible = {this.props.account.charge.pageState.modal1}
                               onOk={()=>{this.props.chargeModal1Show({isShow:false})}}
                               onCancel={()=>{this.props.chargeModal1Show({isShow:false})}}
                        >
                            <div className="modal-content">
                                <Form horizontal className="form-static">
                                    <FormItem
                                        {...modal1FormBtnLayout}
                                        label=""
                                    >
                                    <span>
                                        <RadioGroup onChange={(event)=>{
                                            // this.setState({
                                            //     modal1Model : {
                                            //         ...this.state.modal1Model ,
                                            //         modalType : event.target.value ,
                                            //     }
                                            // })
                                        }} value={this.state.modal1Model.modalType} >
                                            <RadioButton value="income">收款</RadioButton>
                                            <RadioButton value="payment">付款</RadioButton>
                                        </RadioGroup>
                                    </span>
                                    </FormItem>
                                    <FormItem
                                        {...modal1FormLayout}
                                        label="对方"
                                    >
                                        <Select defaultValue="all"
                                                value={this.state.modal1Model.customer+''}
                                                onChange={(value)=>{
                                        // this.setState({
                                        //     modal1Model : {
                                        //         ...this.state.modal1Model ,
                                        //         customer : value ,
                                        //     }
                                        // })
                                    }}
                                        >
                                            <Option value="all" title="默认">默认</Option>
                                            {
                                                this.props.account.charge.customer.data.map((v,i)=>{
                                                    return <Option title={v.name} value={v.value+''} key={v.value}>{v.name}</Option>
                                                })
                                            }
                                        </Select>
                                        <a>
                                            <i></i>
                                            <span>添加</span>
                                        </a>
                                    </FormItem>
                                    <FormItem
                                        {...modal1FormLayout}
                                        label={this.state.modal1Model.modalType==='income'?'收款类型':'付款类型'}
                                    >
                                        <Select defaultValue="all"
                                                value={this.state.modal1Model.incomeType+''}
                                                onChange={(value)=>{
                                                confirm({
                                                    title: '请问是否要冲抵[ ' + this.state.modal1Model.customer + ' ]的应收款',
                                                    content: '是 - 应收款减少   否 - 应收款增加',
                                                    onOk() {
                                                      return new Promise((resolve) => {
                                                        //

                                                      });
                                                    },
                                                    onCancel() {},
                                                });
                                    }}
                                        >
                                            <Option value="all" title="默认">默认</Option>
                                            {
                                                this.props.account.charge.incomeType.data.map((v,i)=>{
                                                    return <Option title={v.name} value={v.value+''} key={v.value}>{v.name}</Option>
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                    <FormItem
                                        {...modal1FormLayout}
                                        label="结算方式"
                                    >
                                        <Select defaultValue="all"
                                                value={this.state.modal1Model.payType+''}
                                                onChange={(value)=>{
                                                // this.setState({
                                                //     modal1Model : {
                                                //         ...this.state.modal1Model ,
                                                //         payType : value ,
                                                //     }
                                                // })
                                            }}
                                        >
                                            <Option value="all" title="默认">默认</Option>
                                            {
                                                this.props.account.charge.payType.data.map((v,i)=>{
                                                    return <Option title={v.name} value={v.value+''} key={v.value}>{v.name}</Option>
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                    <FormItem
                                        {...modal1FormLayout}
                                        label="实收款"
                                    >
                                        <Input placeholder="$0.00"
                                               value={this.state.modal1Model.truePrice}
                                               onChange={(event)=>{
                                        // this.setState({
                                        //     modal1Model : {
                                        //         ...this.state.modal1Model ,
                                        //         truePrice : event.target.value
                                        //     }
                                        // }) ;
                                    }} />
                                    </FormItem>
                                    <FormItem
                                        {...modal1FormLayout}
                                        label="业务日期"
                                    >
                                        <DatePicker size="large" key="for"
                                                    value={this.state.modal1Model.date}
                                                    defaultValue={this.state.modal1Model.date}
                                                    format="yyyy-MM-dd"></DatePicker>
                                    </FormItem>
                                    <FormItem
                                        {...modal1FormLayout}
                                        label="备注"
                                    >
                                        <Input placeholder=""
                                               value={this.state.modal1Model.truePrice}
                                               onChange={(event)=>{
                                        // this.setState({
                                        //     modal1Model : {
                                        //         ...this.state.modal1Model ,
                                        //         truePrice : event.target.value
                                        //     }
                                        // }) ;
                                    }} />
                                    </FormItem>
                                    <FormItem
                                        {...modal1FormBtnLayout}
                                        label=""
                                    >
                                        <Button type="primary" onClick={this._evClick_modal1Submit.bind(this)}>保存</Button>
                                    </FormItem>
                                </Form>
                            </div>
                        </Modal>


                        <Layer
                            addClass="marketDetail"
                            layerShow={this.props.account.charge.pageState.layer1}
                            _handleLayerHide={()=>{this.props.chargeLayer1Show({isShow:false,value:{}})}}
                        >
                            <div className="header">

                                <span className="header-east">
                                    <span
                                        className="nav-return-name"
                                        onClick={()=>{
                                            this.props.chargeLayer1Show({
                                                isShow : false,
                                                value:{}
                                            })
                                        }}
                                    >
                                        <i className="sprite-arrow3"></i>
                                        <span className="re-arrow">返回</span>
                                    </span>

                                    {/*<a className="left-irow" onClick={()=>{this.props.chargeLayer1Hide({isShow:false})}}>&lt;</a>*/}
                                    <Button style={{lineHeight:'26px'}} className="edit" onClick={(ev)=>{
                                        globalStore.dispatch(push('/market/list')) ; //route change
                                    }}>
                                        <i></i>
                                        <span>去销售记录</span>
                                    </Button>
                                </span>
                                <span className="header-west">
                                    <div className="header-north">
                                        <span className="h3">{this.props.account.charge.pageState.customer}</span>
                                    </div>
                                    <div className="header-south">
                                        <span className="h-span-2">
                                            <span className="span-third-in-one">
                                                <span className="h-label h-date">日期</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info">{this.props.account.charge.pageState.date}</span>
                                            </span>
                                            <span className="span-third-in-one">
                                                <span className="h-label h-id">编号</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info">{this.props.account.charge.pageState.id}</span>
                                            </span>
                                        </span>
                                        <span className="h-span">
                                            <span className="span-third-in-one">
                                                <span className="h-label h-contact">联系人</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info">{this.props.account.charge.pageState.contacter}</span>
                                            </span>
                                            <span className="span-third-in-one">
                                                <span className="h-label h-phone">联系电话</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info">{this.props.account.charge.pageState.phone}</span>
                                            </span>
                                            <span className="span-third-in-one">
                                                <span className="h-label h-remain">客户尚欠款</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info red">{this.props.account.charge.pageState.remainPrice}</span>
                                            </span>
                                        </span>
                                    </div>
                                </span>
                            </div>
                            <div className="content-wrap">
                                <div className="content">
                                    <Form horizontal className="form-static">
                                        <FormItem
                                            {...layer1FormLayout}
                                            label="销售金额"
                                        >
                                            <span>{this.props.account.charge.pageState.sellCount}</span>
                                        </FormItem>
                                        <FormItem
                                            {...layer1FormLayout}
                                            label="结算方式"
                                        >
                                            <span>{this.props.account.charge.pageState.payType}</span>
                                        </FormItem>
                                        <FormItem
                                            {...layer1FormLayout}
                                            label="实收款"
                                        >
                                            <span>{this.props.account.charge.pageState.truePrice}</span>
                                            <a className="view-detail">
                                                <span>查看明细</span>
                                                <i></i>
                                                <div className="detail-wrap" style={{overflow:'hidden'}}>
                                                    {this.props.account.charge.pageState.continualTallyDtos && this.props.account.charge.pageState.continualTallyDtos.map((v, i) => {
                                                        return (
                                                            <div key={i}>
                                                                <span className="span-1">
                                                                    <span>{v.businessTime}</span>
                                                                </span>
                                                                <span className="span-2">
                                                                    <span>金额:</span>
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
                                            {...layer1FormLayout}
                                            label="本单应收款"
                                        >
                                            <span className="red">{this.props.account.charge.pageState.shouldPrice}</span>
                                        </FormItem>
                                        {/*<FormItem
                                            {...layer1FormLayout}
                                            label="图片"
                                        >
                                            <div>
                                                <img src={this.props.account.charge.pageState.img} style={{width:'100px',height:'100px'}} alt="" />
                                            </div>
                                        </FormItem>*/}
                                        <FormItem
                                            {...layer1FormLayout}
                                            label="备注"
                                        >
                                            <span>{this.props.account.charge.pageState.tips||'无'}</span>
                                        </FormItem>
                                        <FormItem
                                            {...layer1FormLayout}
                                            label="操作人"
                                        >
                                            <span>{this.props.account.charge.pageState.operator}</span>
                                        </FormItem>
                                    </Form>
                                    <div className="customer-form-image">
                                        <img src={this.props.account.charge.pageState.img} alt="" />
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
                                                    <Table dataSource={this.props.account.charge.productDataSource.data} columns={this.props.COLUMNS_PRODUCT} pagination={false}></Table>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24} offset={0}>
                                                    <span className="staticCount">
                                                        <span className="staticCount-title">合计&nbsp;</span>
                                                        <span style={{color:'#aaa'}}>&nbsp;数量&nbsp;:&nbsp;</span>
                                                        <span className="red" style={{paddingLeft:'5px',paddingRight:'5px'}}>{this._countForShow.call(this,'quantity')}</span>
                                                        <span style={{color:'#aaa'}}>&nbsp;销售金额&nbsp;:&nbsp;</span>
                                                        <span className="red" style={{paddingLeft:'5px',paddingRight:'5px'}}>{this._countForShow.call(this,'discountAmount')}</span>
                                                    </span>


                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Layer>

                        <Layer
                            addClass="marketDetail"
                            layerShow={this.props.account.charge.pageState.layer2}
                            _handleLayerHide={()=>{this.props.chargeLayer2Show({isShow:false})}}
                        >
                            <div className="header">

                                <span className="header-east">
                                    <span
                                        className="nav-return-name"
                                        onClick={()=>{
                                            this.props.layerShow2({
                                                isShow : false ,
                                            })
                                        }}
                                    >
                                        <i className="sprite-arrow3"></i>
                                        <span className="re-arrow">返回</span>
                                    </span>
                                    {/*<a className="left-irow" onClick={()=>{this.props.chargeLayer2Show({isShow:false})}}>&lt;</a>*/}
                                    <Button style={{lineHeight:'26px'}} className="edit" onClick={(ev)=>{
                                        globalStore.dispatch(push('/market/list')) ; //route change
                                    }}>
                                        <i></i>
                                        <span>去采购记录</span>
                                    </Button>
                                </span>
                                <span className="header-west">
                                    <div className="header-north">
                                        <span className="h3">{this.props.account.charge.pageState.customer}</span>
                                    </div>
                                    <div className="header-south">
                                        <span className="h-span-2">
                                            <span className="span-third-in-one">
                                                <span className="h-label h-date">日期</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info">{this.props.account.charge.pageState.date}</span>
                                            </span>
                                            <span className="span-third-in-one">
                                                <span className="h-label h-id">编号</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info">{this.props.account.charge.pageState.id}</span>
                                            </span>
                                        </span>
                                        <span className="h-span">
                                            <span className="span-third-in-one">
                                                <span className="h-label h-contact">联系人</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info">{this.props.account.charge.pageState.contacter}</span>
                                            </span>
                                            <span className="span-third-in-one">
                                                <span className="h-label h-phone">联系电话</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info">{this.props.account.charge.pageState.phone}</span>
                                            </span>
                                            <span className="span-third-in-one">
                                                <span className="h-label h-remain">客户尚欠款</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info red">{this.props.account.charge.pageState.remainPrice}</span>
                                            </span>
                                        </span>
                                    </div>
                                </span>
                            </div>
                            <div className="content-wrap">
                                <div className="content">
                                    <Form horizontal className="form-static">
                                        <FormItem
                                            {...layer1FormLayout}
                                            label="销售金额"
                                        >
                                            <span>{this.props.account.charge.pageState.sellCount}</span>
                                        </FormItem>
                                        <FormItem
                                            {...layer1FormLayout}
                                            label="结算方式"
                                        >
                                            <span>{this.props.account.charge.pageState.payType}</span>
                                        </FormItem>
                                        <FormItem
                                            {...layer1FormLayout}
                                            label="实付款"
                                        >
                                            <span>{this.props.account.charge.pageState.truePrice}</span>
                                            <a className="view-detail">
                                                <span>查看明细</span>
                                                <i></i>
                                                <div className="detail-wrap" style={{overflow:'hidden'}}>
                                                    {this.props.account.charge.pageState.continualTallyDtos && this.props.account.charge.pageState.continualTallyDtos.map((v, i) => {
                                                        return (
                                                            <div key={i}>
                                                                <span className="span-1">
                                                                    <span>{v.businessTime}</span>
                                                                </span>
                                                                <span className="span-2">
                                                                    <span>金额:</span>
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
                                            {...layer1FormLayout}
                                            label="本单应收款"
                                        >
                                            <span className="red">{this.props.account.charge.pageState.shouldPrice}</span>
                                        </FormItem>
                                        {/*<FormItem
                                            {...layer1FormLayout}
                                            label="图片"
                                        >
                                            <div>
                                                <img src={this.props.account.charge.pageState.img} style={{width:'100px',height:'100px'}} alt="" />
                                            </div>
                                        </FormItem>*/}
                                        <FormItem
                                            {...layer1FormLayout}
                                            label="备注"
                                        >
                                            <span>{this.props.account.charge.pageState.tips}</span>
                                        </FormItem>
                                        <FormItem
                                            {...layer1FormLayout}
                                            label="操作人"
                                        >
                                            <span>{this.props.account.charge.pageState.operator}</span>
                                        </FormItem>
                                    </Form>
                                    <div className="customer-form-image">
                                        <img src={this.props.account.charge.pageState.img} alt="" />
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
                                                    <Table dataSource={this.props.account.charge.productDataSource.data} columns={this.props.COLUMNS_PRODUCT} pagination={false}></Table>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24} offset={0}>
                                                    <span className="staticCount">
                                                        <span className="staticCount-title">合计&nbsp;</span>
                                                        <span style={{color:'#aaa'}}>&nbsp;数量&nbsp;:&nbsp;</span>
                                                        <span className="red" style={{paddingLeft:'5px',paddingRight:'5px'}}>{this._countForShow.call(this,'quantity')}</span>
                                                        <span style={{color:'#aaa'}}>&nbsp;销售金额&nbsp;:&nbsp;</span>
                                                        <span className="red" style={{paddingLeft:'5px',paddingRight:'5px'}}>{this._countForShow.call(this,'discountAmount')}</span>
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

            </div>
        )
    }

}

ChargeAccount.defaultProps = {
    COLUMNS : COLUMNS ,
    COLUMNS_PRODUCT : COLUMNS_PRODUCT ,
    COLUMNS_PRODUCT_FORSHOW : COLUMNS_PRODUCT_FORSHOW ,
}


export default connect(
    ( state ) => {
        var account = state.account ;
        return {
            account : account
        }
    },
    {
        chargeInit ,
        chargeTable ,
        chargeLayer1Show ,
        chargeLayer1Hide,
        chargeLayer2Show ,
        chargeModal1Show ,
        chargeModal2Show
    }
)(ChargeAccount)
