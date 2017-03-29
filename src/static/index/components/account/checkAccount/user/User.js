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
    userInit ,
    userTable ,
    userLayer1Show ,
    userModal1Show ,
    userModal2Show ,
    userModal5Show ,
    userModal6Show ,
    userModal6Show2 ,
} from '../../../../actions/account'
import * as service from '../../../../service'
import BigNumber from 'bignumber.js' ;

import utils from '../../../../service/utils/index'
import {
    TOKEN_NAME,
    TENANT_ID
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
        title : '客户名称' ,
        dataIndex 　:　'user'　,
        key　:　'user'
    },{
        title　:　'应收款'　,
        dataIndex　:　'shouldPrice'　,
        key　:　'shouldPrice' ,
        sorter: (a, b) => a.shouldPrice - b.shouldPrice ,
    },{
        title　:　'到期日'　,
        dataIndex　:　'endDate'　,
        key　:　'endDate' ,
        sorter: (a, b) => a.endDate - b.endDate ,
    },{
        title　:　'备注'　,
        dataIndex　:　'tips'　,
        key　:　'tips'
    },{
        title　:　'销售员'　,
        dataIndex　:　'marketer'　,
        key　:　'marketer'
    },{
        title　:　'收款'　,
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
                                globalStore.dispatch(userModal1Show({
                                    isShow : true ,
                                })) ;
                                globalEvent.account.editUserPressMoney.dispatch({
                                    data : value
                                }) ;
                            }
                        }
                    >收款</a>
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
                        authIndex="27"
                    >
                        <i title="查看" className="sprite-view dib-table-icon" value={value.id}
                           onClick={(event)=>{
                               service.market.fetchMarketDeatil({
                                id : value.orderID
                            },(result)=>{
                                if ( result.mark == '000000000' ){
                                    service.base.fetchBaseCustomerDetail({
                                        id : result.data.salesOrderDto.customer ,
                                    },function(error,result2){
                                        globalStore.dispatch(userLayer1Show({
                                            isShow : true ,
                                            showId : value.id,
                                            value : result.data.salesOrderDto,
                                            data : result2.data
                                        })) ;
                                    }) ;

                                } else {
                                    globalFunction.alert.warning( result.messages , '操作提示' ) ;
                                }
                            })
                           }}
                        ></i>
                    </Auth>
                    <Auth
                        authIndex="28"
                    >
                        <a
                            title="催款"
                            className="cell-link cell-operation"
                            value={value.id}
                            onClick={
                                (event)=>{
                                    globalEvent.account.sendMessage.dispatch({
                                        data : value
                                    }) ;
                                }
                            }
                        >催款</a>
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

const ROW_SELECTION = {
    onChange(selectedRowKeys, selectedRows) {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        globalEvent.account.checkOrder.dispatch({
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

const ALREADY_SEND_ID_COLUMNS = [
    {
        title : '编号' ,
        dataIndex : 'tallyNo'　,
        key　:　'tallyNo'
    },
    {
        title : '客户名称' ,
        dataIndex : 'oppositeName'　,
        key　:　'oppositeName'
    },
    {
        title : '上次催款日期' ,
        dataIndex : 'lastRemindTime'　,
        key　:　'lastRemindTime'
    },
] ;

class User extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            pageSize : 10 ,
            currentPage : 1 ,
            filter : {
                id : '' ,
                startDate : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDate : moment().format('YYYY-MM-DD') ,
                user : 'default-all' ,
                marketer : 'default-all' ,

                overDue : false , //逾期应收
                receivableState : false , //下周应收
            },
            editUserPressMoney : (value)=>{
                value.data.payType = 1;
                this.setState({
                    modal1 : {
                        ...this.state.modal1 ,
                        model : value.data
                    }
                })
            },
            editUserPressMoney2 : (value)=>{
                if(this.state.modal1.selectedRows.length == 0){
                    globalFunction.alert.warning('请勾选销售单','操作提示');
                }
                else{
                    this.props.userModal1Show({
                        isShow : true ,
                    })
                    this.setState({
                        modal1 : {
                            ...this.state.modal1 ,
                            model : {
                                ...this.state.modal1.model ,
                                //user : '上海游戏公司' ,
                                id : this.state.modal1.selectedRows,

                                truePrice : '' ,
                                accountType : '应收款' ,
                                payType : '' ,
                                date : moment().format('YYYY-MM-DD') ,
                                tips : ''
                            }
                        }
                    })
                }
            },
            checkOrder : (value)=>{
                var i = 0;
                var user = '';
                var salesOrderNos = [];
                var confirmRemindDtos = [];
                var sendIds = [];
                var teamModal = [];
                value.data.forEach(function(ext){
                    ext.order = i + 1;
                    var id = ext.id;
                    salesOrderNos[i] = {salesOrderNo : id};
                    confirmRemindDtos[i] ={userId: ext.marketerId ,tallyNo: ext.id ,oppositeName: ext.user};
                    sendIds[i] = {userId: ext.marketerId , tallyNo : ext.id};
                    teamModal[i] = {tallyNo: ext.id, oppositeName: ext.user, lastRemindTime : '暂无记录'};
                    user = ext.user;
                    i = i + 1;
                });
                this.setState({
                    modal1 : {
                        ...this.state.modal1 ,
                        selectedRows : value.data ,
                        salesOrderNos : salesOrderNos,
                        model : {
                            ...this.state.modal1.model,
                            user : user
                        }
                    },
                    modal6 : {
                        ...this.state.modal6 ,
                        confirmRemindDtos : confirmRemindDtos,
                        sendIds : sendIds,
                        teamModal : teamModal
                    }
                })
            },

            modal5 : {
                model : {
                    user : 'all' ,
                    firstCount : '' ,
                    date : moment().format('YYYY-MM-DD') ,
                    tips : ''
                }
            },
            modal1 : {
                selectedRows : [],
                salesOrderNos : [],
                model : {
                    company : '' ,
                    id : '' ,
                    remainPrice : '' ,
                    truePrice : '' ,
                    accountType : 'all' ,
                    payType : 'all' ,
                    date : moment().format('YYYY-MM-DD') ,
                    tips : ''
                }
            },

            modal6 :{
                modal : [{
                    tallyNo : '暂无记录' ,
                    oppositeName : '暂无记录' ,
                    lastRemindTime : '暂无记录'
                }],
                sendId: '',
                sendIds : [],
                confirmRemindDtos : [],
                teamModal : []
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
            },

            sendMessage : (value)=>{
                if(value.data == '2'){
                    var confirmRemindDtos = this.state.modal6.confirmRemindDtos;
                    if(confirmRemindDtos.length == 0){
                        globalFunction.alert.warning('请勾选需要催收的销售单','操作提示');
                    }
                    else{
                        service.account.alreadySend(
                            confirmRemindDtos
                            ,(error,result) => {
                                if(result.data.length != 0){
                                    this.setState({
                                        modal6 : {
                                            ...this.state.modal6,
                                            teamModal: result.data
                                        }
                                    });
                                    this.props.userModal6Show2({
                                        isShow: true,
                                    });
                                }
                                else{
                                    globalEvent.account.sendMessageFinish.dispatch({
                                        data : '2'
                                    }) ;
                                }
                            }) ;
                    }

                }
                else{
                    this.setState({
                        modal6 :{
                            ...this.state.modal6,
                            sendId : [{userId: value.data.marketerId , tallyNo: value.data.id}],
                            modal : [
                                {tallyNo : value.data.id,
                                oppositeName:value.data.user,
                                lastRemindTime: '暂无记录'
                                }]
                        }
                    });
                    service.account.alreadySend(
                        [{userId: value.data.marketerId,tallyNo:value.data.id,oppositeName:value.data.user}]
                        ,(error,result) => {
                            if(result.data.length != 0){
                                this.setState({
                                    modal6 : {
                                        ...this.state.modal6,
                                        modal: result.data
                                    }
                                });
                                this.props.userModal6Show({
                                    isShow: true,
                                });
                            }
                            else{
                                globalEvent.account.sendMessageFinish.dispatch({
                                    data : '1'
                                }) ;
                            }

                        }) ;
                }

                /*service.account.sendMessage(
                 [{userId: value.data.userID}]
                 ,(error,data) => {
                 globalFunction.alert.success('催款成功','操作提示');
                 service.account.initUser({
                 pageSize :10,
                 pageNum : 1,
                 tenantId : utils.cookie.config( TENANT_ID ),
                 delFlag: 0,
                 roleIds: [3]
                 //customerId: '1'
                 },(error,data) => {
                 this.props.userInit(data) ;
                 }) ;
                 }) ;*/
            },

            sendMessageFinish : (value)=>{
                if (value.data == '1'){
                    var sendId = this.state.modal6.sendId;
                    service.account.sendMessage(
                        sendId
                        ,(error,data) => {
                            globalFunction.alert.success('催款成功','操作提示');
                            var self = this ;
                            let params = {
                                init : {

                                    pageSize :self.state.pageSize,
                                    pageNum : 1,

                                    startTime: this.state.filter.startDate,
                                    endTime: this.state.filter.endDate,

                                    customerId: this.state.filter.user === 'default-all' ? '' : this.state.filter.user,
                                    salesman: this.state.filter.marketer === 'default-all' ? '' : this.state.filter.marketer,
                                    salesOrderNoSelect : this.state.filter.id || '' ,

                                    //receivableState :this.state.filter.receivableState === false ? '' : 1 ,
                                    receivableState : 1,
                                    overDue : this.state.filter.overDue === false ? '' : 1 ,


                                } ,
                                fetchCustomer : {
                                    pageSize :9999,
                                    pageNum : 1,
                                } ,
                                fetchMarketer : {
                                    pageSize :9999,
                                    pageNum : 1,
                                    roleIds : [1,3]
                                }
                            };
                            params.init.tenantId = params.fetchCustomer.tenantId =params.fetchMarketer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                            service.account.initUser(params,(error,data)=>{
                                self.props.userInit(data) ;
                            });
                        }) ;
                }
                else {
                    var sendIds = this.state.modal6.sendIds;
                    service.account.sendMessage(
                        sendIds
                        ,(error,data) => {
                            globalFunction.alert.success('催款成功','操作提示');
                            var self = this ;
                            let params = {
                                init : {

                                    pageSize :self.state.pageSize,
                                    pageNum : 1,

                                    startTime: this.state.filter.startDate,
                                    endTime: this.state.filter.endDate,

                                    customerId: this.state.filter.user === 'default-all' ? '' : this.state.filter.user,
                                    salesman: this.state.filter.marketer === 'default-all' ? '' : this.state.filter.marketer,
                                    salesOrderNoSelect : this.state.filter.id || '' ,

                                    //receivableState :this.state.filter.receivableState === false ? '' : 1 ,
                                    receivableState : 1,
                                    overDue : this.state.filter.overDue === false ? '' : 1 ,


                                } ,
                                fetchCustomer : {
                                    pageSize :9999,
                                    pageNum : 1,
                                } ,
                                fetchMarketer : {
                                    pageSize :9999,
                                    pageNum : 1,
                                    roleIds : [1,3]
                                }
                            };
                            params.init.tenantId = params.fetchCustomer.tenantId =params.fetchMarketer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                            service.account.initUser(params,(error,data)=>{
                                self.props.userInit(data) ;
                            });
                        }) ;
                }

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
                receivableState : 1,
            } ,
            fetchCustomer : {
                pageSize :9999,
                pageNum : 1,
            } ,
            fetchMarketer : {
                pageSize :9999,
                pageNum : 1,
                roleIds : [1,3]
            }
        };
        params.init.tenantId = params.fetchCustomer.tenantId =params.fetchMarketer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        service.account.initUser(params,(error,data) => {
            this.props.userInit(data) ;
        }) ;
        //
        globalEvent.account.editUserPressMoney = new signals.Signal() ;
        globalEvent.account.editUserPressMoney.add(this.state.editUserPressMoney) ;

        globalEvent.account.editUserPressMoney2 = new signals.Signal() ;
        globalEvent.account.editUserPressMoney2.add(this.state.editUserPressMoney2) ;

        globalEvent.account.checkOrder = new signals.Signal() ;
        globalEvent.account.checkOrder.add(this.state.checkOrder) ;

        globalEvent.account.sendMessage = new signals.Signal() ;
        globalEvent.account.sendMessage.add(this.state.sendMessage) ;

        globalEvent.account.sendMessageFinish = new signals.Signal() ;
        globalEvent.account.sendMessageFinish.add(this.state.sendMessageFinish) ;
    }
    componentWillUnmount(){
        globalEvent.account.editUserPressMoney.remove(this.state.editUserPressMoney) ;
    }
    //event
    _ev_filterSearch(){
        //let userId =  utils.cookie.config( 's_user' ) ;
        var id = this.state.filter.id || '';
        var startDate = this.state.filter.startDate;
        var endDate = this.state.filter.endDate;
        var customerName = this.state.filter.user === 'default-all' ? '' : this.state.filter.user;
        var salesman = this.state.filter.marketer === 'default-all' ? '' : this.state.filter.marketer;
        service.account.fetchUserTable({
            pageSize :10,
            pageNum : 1,
            tenantId : window.globalStore.getState().userstore.user.tenantId,
            startTime: startDate,
            endTime: endDate,
            customerId: customerName ,
            userId: salesman ,
            salesOrderNoSelect : id ,
            //receivableState :this.state.filter.receivableState === false ? '' : 1 ,
            receivableState : 1,
            overDue : this.state.filter.overDue === false ? '' : 1 ,
        },(error,data)=>{
            this.props.userTable(data) ;
            this.setState({
                currentPage : 1
            });
        }) ;
    }

    earlyStageAdjustment(){
        var firstCount = this.state.modal5.model.firstCount || '';
        var date = this.state.modal5.model.date;
        var tips = this.state.modal1.model.tips;
        var userId = this.state.modal5.model.user ;
        service.account.earlyStageAdjustment({
            earlyArrears: firstCount || '100',
            id : '1',     //客户id
            tenantId : window.globalStore.getState().userstore.user.tenantId,    //公司id
            userId : userId,    //操作人id
        },(error,data)=>{
            if(data.data.mark == '000000000'){
                globalFunction.alert.success('期初调整成功','操作提示')
            }
        }) ;

    }

    receiveAccount1(){
        var money = this.state.modal1.model.truePrice;
        var settlementWay = this.state.modal1.model.payType || 1;
        var businessTime = this.state.modal1.model.date;
        var comment = this.state.modal1.model.tips;
        var opposite = this.state.modal1.model.user;
        var salesOrderNo = this.state.modal1.model.id;
        service.account.receiveAccount1({
            money : money || '0',
            settlementWay : settlementWay || '0',
            businessTime : businessTime,
            comment : comment || '',
            settlementType : 1,
            opposite : this.state.modal1.model.userID,
            //salesOrderNo : salesOrderNo,
            tenantId : window.globalStore.getState().userstore.user.tenantId,    //公司id
            userId : 1,    //操作人id

            salesOrderDtos :[
                {salesOrderNo :salesOrderNo}
            ],
            purchaseOrderDtos : []

        },(error,data)=>{
            console.log(data);
            globalFunction.alert.success('收款成功','操作提示');
            var self = this ;
            let params = {
                init : {

                    pageSize :self.state.pageSize,
                    pageNum : 1,

                    startTime: this.state.filter.startDate,
                    endTime: this.state.filter.endDate,

                    customerId: this.state.filter.user === 'default-all' ? '' : this.state.filter.user,
                    salesman: this.state.filter.marketer === 'default-all' ? '' : this.state.filter.marketer,
                    salesOrderNoSelect : this.state.filter.id || '' ,

                    //receivableState :this.state.filter.receivableState === false ? '' : 1 ,
                    receivableState : 1,
                    overDue : this.state.filter.overDue === false ? '' : 1 ,


                } ,
                fetchCustomer : {
                    pageSize :9999,
                    pageNum : 1,
                } ,
                fetchMarketer : {
                    pageSize :9999,
                    pageNum : 1,
                    roleIds : [1,3]
                }
            };
            params.init.tenantId = params.fetchCustomer.tenantId =params.fetchMarketer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
            service.account.initUser(params,(error,data)=>{
                self.props.userInit(data) ;
            });
        }) ;
    }

    receiveAccount2(){
        var money = this.state.modal1.model.truePrice;
        var settlementWay = this.state.modal1.model.payType || 1;
        var businessTime = this.state.modal1.model.date;
        var comment = this.state.modal1.model.tips;
        var opposite = this.state.modal1.model.user;
        var salesOrderNos = this.state.modal1.salesOrderNos;

        service.account.receiveAccount1({
            money : money || '0',
            settlementWay : settlementWay || '0',
            businessTime : businessTime,
            comment : comment || '',
            settlementType : 1,
            opposite :  this.state.modal1.model.userID,
            //salesOrderNo : salesOrderNo,
            tenantId :window.globalStore.getState().userstore.user.tenantId,    //公司id
            userId : 1,    //操作人id

            salesOrderDtos :salesOrderNos,
            purchaseOrderDtos : []

        },(error,data)=>{
            console.log(data);
            if(data.data && data.data.mark == '000000000'){
                globalFunction.alert.success('收款成功','操作提示');
                var self = this ;
                let params = {
                    init : {

                        pageSize :self.state.pageSize,
                        pageNum : 1,

                        startTime: this.state.filter.startDate,
                        endTime: this.state.filter.endDate,

                        customerId: this.state.filter.user === 'default-all' ? '' : this.state.filter.user,
                        salesman: this.state.filter.marketer === 'default-all' ? '' : this.state.filter.marketer,
                        salesOrderNoSelect : this.state.filter.id || '' ,

                        //receivableState :this.state.filter.receivableState === false ? '' : 1 ,
                        receivableState : 1,
                        overDue : this.state.filter.overDue === false ? '' : 1 ,


                    } ,
                    fetchCustomer : {
                        pageSize :9999,
                        pageNum : 1,
                    } ,
                    fetchMarketer : {
                        pageSize :9999,
                        pageNum : 1,
                        roleIds : [1,3]
                    }
                };
                params.init.tenantId = params.fetchCustomer.tenantId =params.fetchMarketer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                service.account.initUser(params,(error,data)=>{
                    self.props.userInit(data) ;
                });
            }

            else{
                globalFunction.alert.warning('收款失败','操作提示');
            }

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

    _countForShow(attr){
        var ret = 0 ;
        var details = this.props.account.user.pageState || {} ;
        details.product && details.product.forEach((v)=>{
            var _ret = new BigNumber( ret );
            var amount = ( v[ attr ] && new BigNumber( v[ attr ] ) ) || 0 ;
            ret = _ret.plus( amount ) - 0 ;
        }) ;
        return isNaN( ret )?0:ret ;
    }

    render(){
        console.log(this.props.account.user) ;

        const modal5FormLayout = {
            labelCol : {span:5} ,
            wrapperCol : {span:14}
        }

        const formItemLayout_static = {
            labelCol : {span:4} ,
            wrapperCol : {span:10}
        }


        return (
            <div>

                <QueueAnim>

                    <div className="filter-wrap" key="anime-1">
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
                        <span className="filter-label">客户名称</span>
                        <span className="filter-component">
                            <Select
                                labelInValue
                                showSearch
                                style={{width:150}}
                                placeholder="选择客户"
                                notFoundContent=""
                                optionFilterProp="children"
                                value={{key : this.state.filter.user+''}}
                                onChange={
                                    (values)=>{
                                        this.setState({
                                            filter : {
                                                ...this.state.filter ,
                                                user : values.key+'' ,
                                                userInTab : values.label+''
                                            }
                                        })
                                    }
                                }
                            >
                                <Option value="default-all" title="全部">全部</Option>
                                {
                                    this.props.account.user.user.data.map((v,i)=>{
                                        return <Option title={v.name} value={v.value} key={v.value}>{v.name}</Option>
                                    })
                                }
                            </Select>
                        </span>
                    </span>
                    <span className="filter">
                        <span className="filter-label">销售员</span>
                        <span className="filter-component">
                            <Select
                                labelInValue
                                showSearch
                                style={{width:150}}
                                placeholder="选择销售员"
                                notFoundContent=""
                                optionFilterProp="children"
                                value={{key : this.state.filter.marketer+''}}
                                onChange={
                                    (values)=>{
                                        this.setState({
                                            filter : {
                                                ...this.state.filter ,
                                                marketer : values.key+'' ,
                                                marketerInTab : values.label+''
                                            }
                                        })
                                    }
                                }
                            >
                                <Option value="default-all" title="全部">全部</Option>
                                {
                                    this.props.account.user.marketer.data.map((v,i)=>{
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
                                        checked={this.state.filter.receivableState}
                                        onChange={this._ev_receivableState_filterSearch.bind(this)}
                                    >
                                        应收款不为0
                                    </Checkbox>*/
                                }
                                <Checkbox
                                    checked={this.state.filter.overDue}
                                    onChange={this._ev_overDue_filterSearch.bind(this)}
                                >
                                    逾期应收
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
                            authIndex="23"
                        >
                        <span className="search-importantwrap">
                            <a
                                onClick={
                                    ()=>{
                                    globalEvent.account.sendMessage.dispatch({
                                        data : '2'
                                    }) ;
                                    }
                                }
                            >一键催收</a>
                        </span>
                        </Auth>
                        <Auth
                            authIndex="24"
                        >
                        <span className="search-importantwrap">
                            <a
                                onClick={
                                    ()=>{
                                    globalEvent.account.editUserPressMoney2.dispatch({
                                        data : ''
                                    }) ;
                                    }
                                }
                            >一键收款</a>
                        </span>
                        </Auth>
                        <Auth
                            authIndex="25"
                        >
                        <span className="search-importantwrap">
                            <a onClick={()=>{
                                this.props.userModal5Show({
                                    isShow: true,
                                })
                            }}>期初调整</a>
                        </span>
                        </Auth>
                    </div>
                    <div className="table-wrap" key="anime-4">
                        <Table
                            dataSource={this.props.account.user.dataSource.data}
                            columns={this.props.COLUMNS}
                            rowSelection={this.props.ROW_SELECTION}
                            pagination={{
                            showSizeChanger : true ,

                            total : this.props.account.user.totalCount ,

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

                                            startTime: this.state.filter.startDate,
                                            endTime: this.state.filter.endDate,

                                            customerId: this.state.filter.user === 'default-all' ? '' : this.state.filter.user,
                                            salesman: this.state.filter.marketer === 'default-all' ? '' : this.state.filter.marketer,
                                            salesOrderNoSelect : this.state.filter.id || '' ,

                                            //receivableState :this.state.filter.receivableState === false ? '' : 1 ,
                                            receivableState : 1,
                                            overDue : this.state.filter.overDue === false ? '' : 1 ,


                                        } ,
                                        fetchCustomer : {
                                            pageSize :9999,
                                            pageNum : 1,
                                        } ,
                                        fetchMarketer : {
                                            pageSize :9999,
                                            pageNum : 1,
                                            roleIds : [1,3]
                                        }
                                    };                                    
                                    params.init.tenantId = params.fetchCustomer.tenantId =params.fetchMarketer.tenantId = window.globalStore.getState().userstore.user.tenantId ;                                                                                                             
                                    service.account.initUser(params,(error,data)=>{
                                        self.props.userInit(data) ;
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

                                        startTime: this.state.filter.startDate,
                                        endTime: this.state.filter.endDate,

                                        customerId: this.state.filter.user === 'default-all' ? '' : this.state.filter.user,
                                        salesman: this.state.filter.marketer === 'default-all' ? '' : this.state.filter.marketer,
                                        salesOrderNoSelect : this.state.filter.id || '' ,

                                        //receivableState :this.state.filter.receivableState === false ? '' : 1 ,
                                        receivableState : 1,
                                        overDue : this.state.filter.overDue === false ? '' : 1 ,


                                    } ,
                                    fetchCustomer : {
                                        pageSize :9999,
                                        pageNum : 1,
                                    } ,
                                    fetchMarketer : {
                                        pageSize :9999,
                                        pageNum : 1,
                                        roleIds : [1,3]
                                    }
                                };
                                params.init.tenantId = params.fetchCustomer.tenantId =params.fetchMarketer.tenantId = window.globalStore.getState().userstore.user.tenantId ;                                                                                                  
                                service.account.initUser(params,(error,data)=>{
                                    self.props.userInit(data) ;
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
                        visible={this.props.account.user.pageState.modal5Show}
                        onOk={()=>{this.props.userModal5Show({isShow:false});this.earlyStageAdjustment();}}
                        onCancel={()=>{this.props.userModal5Show({isShow:false})}}
                    >
                        <Form horizontal className="form-static">
                            <FormItem
                                {...modal5FormLayout}
                                label="客户名称"
                            >
                                <Select
                                    value={this.state.modal5.model.user}
                                    onChange={
                                    (value)=>{
                                        this.setState({
                                            modal5 : {
                                                ...this.state.modal5　,
                                                model　: {
                                                    ...this.state.modal5.model ,
                                                    user : value
                                                }
                                            }
                                        })
                                    }
                                }
                                >
                                    <Option value="all" title="全部">全部</Option>
                                    {
                                        this.props.account.user.user.data.map((v,i)=>{
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
                    <Modal
                        className="account-user-modal1"
                        title="已催收提示"
                        visible={this.props.account.user.pageState.modal6Show}
                        onOk={()=>{
                        globalEvent.account.sendMessageFinish.dispatch({
                            data : '1'
                        }) ;
                        this.props.userModal6Show({isShow:false});
                    }}
                        onCancel={()=>{this.props.userModal6Show({isShow:false})}}
                    >
                        <div>
                            <Table
                                pagination={false}
                                dataSource={this.state.modal6.modal}
                                columns={this.props.ALREADY_SEND_ID_COLUMNS}
                            ></Table>
                        </div>
                        <div><span className="red-send">是否确定继续催收？</span></div>
                    </Modal>

                    <Modal
                        className="account-user-modal1"
                        title="已催收提示"
                        visible={this.props.account.user.pageState.modal6Show2}
                        onOk={()=>{
                        globalEvent.account.sendMessageFinish.dispatch({
                            data : '2'
                        }) ;
                        this.props.userModal6Show({isShow:false});
                    }}
                        onCancel={()=>{this.props.userModal6Show2({isShow:false})}}
                    >
                        <div>
                            <Table
                                pagination={false}
                                dataSource={this.state.modal6.teamModal}
                                columns={this.props.ALREADY_SEND_ID_COLUMNS}
                            ></Table>
                        </div>
                        <div>
                            <span className="red-send">以上是24小时内已催收过的订单，是否确定继续催收？</span>
                        </div>
                    </Modal>

                    { /*modal 1 - 2*/ }
                    <Modal
                        className="account-user-modal1"
                        title="收款"
                        visible={this.props.account.user.pageState.modal1Show}
                        onOk={()=>{
                            this.props.userModal1Show({isShow:false});
                            if(Object.prototype.toString.call(this.state.modal1.model.id)==='[object Array]'){
                                this.receiveAccount2();
                            }
                            else {
                                this.receiveAccount1();
                            }
                        }
                    }
                        onCancel={()=>{this.props.userModal1Show({isShow:false})}}
                    >
                        <Form horizontal className="form-static">
                            <FormItem
                                {...modal5FormLayout}
                                label="公司名称"
                            >
                                <span>{this.state.modal1.model.user}</span>
                            </FormItem>
                            {
                                (Object.prototype.toString.call(this.state.modal1.model.id)==='[object Array]') ? (
                                    <FormItem
                                        {...modal5FormLayout}
                                        label="销售单"
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
                                label="实收金额"
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
                                            ...this.state ,
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
                                <span>应收款</span>
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
                                        this.props.account.user.payType.data.map((v,i)=>{
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
                        title="确认收款"
                        visible={this.props.account.user.pageState.modal2Show}
                        onOk={()=>{
                        this.props.userModal2Show({isShow:false});
                    }}
                        onCancel={()=>{this.props.userModal2Show({isShow:false})}}
                    >
                        <Form horizontal className="form-static">
                            <FormItem
                                {...modal5FormLayout}
                                label="公司名称"
                            >
                                <span>{this.state.modal1.model.user}</span>
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
                        layerShow={this.props.account.user.pageState.layer1Show}
                        _handleLayerHide={()=>{this.props.userLayer1Show({isShow:false})}}
                    >
                        <div className="header">

                            <span className="header-east">
                                <span
                                    className="nav-return-name"
                                    onClick={()=>{
                                        this.props.userLayer1Show({
                                            isShow : false ,
                                        })
                                    }}
                                >
                                    <i className="sprite-arrow3"></i>
                                    <span className="re-arrow">返回</span>
                                </span>

                                {/*/<a className="left-irow" onClick={()=>{this.props.userLayer1Show({isShow:false})}}>&lt;</a>*/}
                                <Button style={{lineHeight:'26px'}} className="edit" onClick={(ev)=>{
                                    globalStore.dispatch(push('/market/list')) ; //route change
                                }}>
                                    <i></i>
                                    <span>去销售记录</span>
                                </Button>
                            </span>
                            <span className="header-west">
                                <div className="header-north">
                                    <span className="h3">{this.props.account.user.pageState.customer}</span>
                                </div>
                                <div className="header-south">
                                    <span className="h-span-2">
                                        <span className="span-third-in-one">
                                            <span className="h-label h-date">日期</span>
                                            <span className="h-dot">:</span>
                                            <span className="h-info">{this.props.account.user.pageState.date}</span>
                                        </span>
                                        <span className="span-third-in-one">
                                            <span className="h-label h-id">编号</span>
                                            <span className="h-dot">:</span>
                                            <span className="h-info">{this.props.account.user.pageState.id}</span>
                                        </span>
                                    </span>
                                    <span className="h-span">
                                        <span className="span-third-in-one">
                                            <span className="h-label h-contact">联系人</span>
                                            <span className="h-dot">:</span>
                                            <span className="h-info">{this.props.account.user.pageState.contacter}</span>
                                        </span>
                                        <span className="span-third-in-one">
                                            <span className="h-label h-phone">联系电话</span>
                                            <span className="h-dot">:</span>
                                            <span className="h-info">{this.props.account.user.pageState.phone}</span>
                                        </span>
                                        <span className="span-third-in-one">
                                            <span className="h-label h-remain">客户尚欠款</span>
                                            <span className="h-dot">:</span>
                                            <span className="h-info red">{this.props.account.user.pageState.remainPrice}</span>
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
                                        label="销售金额"
                                    >
                                        <span>{this.props.account.user.pageState.sellCount}</span>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout_static}
                                        label="结算方式"
                                    >
                                        <span>{this.props.account.user.pageState.payType}</span>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout_static}
                                        label="实收款"
                                    >
                                        <span>{this.props.account.user.pageState.truePrice}</span>
                                        <a className="view-detail">
                                            <span>查看明细</span>
                                            <i></i>
                                            <div className="detail-wrap" style={{overflow:'hidden'}}>
                                                {this.props.account.user.pageState.accountDetails.map((v, i) => {
                                                    return (
                                                        <div key={i}>
                                                                <span className="span-1">
                                                                    <span>{v.businessTime}</span>
                                                                </span>
                                                                <span className="span-2">
                                                                    <span>销售收入:</span>
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
                                        label="本单应收款"
                                    >
                                        <span className="red">{this.props.account.user.pageState.shouldPrice}</span>
                                    </FormItem>
                                    {/*<FormItem
                                        {...formItemLayout_static}
                                        label="图片"
                                    >
                                        <div>
                                            <img src={this.props.account.user.pageState.img} style={{width:'100px',height:'100px'}} alt="" />
                                        </div>
                                    </FormItem>*/}
                                    <FormItem
                                        {...formItemLayout_static}
                                        label="备注"
                                    >
                                        <span>{this.props.account.user.pageState.tips||'无'}</span>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout_static}
                                        label="操作人"
                                    >
                                        <span>{this.props.account.user.pageState.operator}</span>
                                    </FormItem>
                                </Form>
                                <div className="customer-form-image">
                                    <img src={this.props.account.user.pageState.img} alt="" />
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
                                                    dataSource={this.props.account.user.pageState.product}
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
                                                        <span className="sta-value red">{this.props.account.user.pageState.productNum}</span>
                                                    </div>
                                                    <div className="sta-line">
                                                        <span className="sta-lable">合计&nbsp;:</span>
                                                        <span className="sta-value red">{}</span>
                                                    </div>
                                                    {/*<span className="staticCount-title">合计&nbsp;</span>
                                                    <span style={{color:'#aaa'}}>&nbsp;数量&nbsp;:&nbsp;</span>
                                                    <span className="red" style={{paddingLeft:'5px',paddingRight:'5px'}}>{this.props.account.user.pageState.productNum}</span>
                                                    <span style={{color:'#aaa'}}>&nbsp;销售金额&nbsp;:&nbsp;</span>
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

User.defaultProps = {
    COLUMNS : COLUMNS ,
    ROW_SELECTION : ROW_SELECTION ,
    PRESS_PRICE_ID_COLUMNS : PRESS_PRICE_ID_COLUMNS ,
    ALREADY_SEND_ID_COLUMNS : ALREADY_SEND_ID_COLUMNS,
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
        userInit ,
        userTable ,
        userLayer1Show ,
        userModal1Show ,
        userModal2Show ,
        userModal5Show ,
        userModal6Show ,
        userModal6Show2 ,
    }
)(User)
