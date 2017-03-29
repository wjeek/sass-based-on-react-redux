import React from 'react' ;
import { Link, browserHistory } from 'react-router'
import {
    connect ,
    dispatch
} from 'react-redux' ;
import QueueAnim from 'rc-queue-anim' ;
import moment from 'moment' ;
import BigNumber from 'bignumber.js' ;
import {
    marketListInit, marketListTable,
    layerShow1, layerShow2, modalShow1, layerShow3, modalShow2 ,
    layer2_input_show
} from '../../../actions/market'
import * as service from '../../../service'
import {
    ReactTable ,
    Layer ,
    Auth ,
} from '../../index'
import {
    Button , Pagination , Select ,
    Input , DatePicker , Table , Form , Modal ,
    Upload , Checkbox , Transfer , Popconfirm ,
    Row , Col , InputNumber ,
    Icon
} from 'antd/dist/antd.js'
const Option = Select.Option;
const FormItem = Form.Item ;
const CheckboxGroup = Checkbox.Group;
import {
    FILE_IMAGE_ACCEPT ,
    FILE_EXCEL_ACCEPT ,
} from '../../../constants/index'


const COLUMNS = [
    {
        title: '日期',
        dataIndex: 'date',
        key: 'date'
    }, {
        title: '客户',
        // dataIndex: 'customer',
        // key: 'customer',
        dataIndex : 'customerName_forShow' ,
        key : 'customerName_forShow' ,
    }, {
        title: '编号',
        // dataIndex: 'id',
        // key: 'id',
        dataIndex : 'id_forShow_noPrefix'　,
        key : 'id_forShow_noPrefix' ,
    },{
        title: '货品数量',
        dataIndex: 'productNum',
        key: 'productNum',
        sorter: (a, b) => a.productNum - b.productNum ,
    },{
        title: '销售金额',
        dataIndex: 'sellCount',
        key: 'sellCount',
        sorter: (a, b) => a.sellCount - b.sellCount ,
    },
    /*{
     title: '结算方式',
     // dataIndex: 'payType',
     // key: 'payType',
     dataIndex : 'payType_forShow' ,
     key : 'payType_forShow' ,
     sorter: (a, b) => a.payType - b.payType ,
     },*/
    {
        title: '实收款',
        dataIndex: 'truePrice',
        key: 'truePrice',
        sorter: (a, b) => a.truePrice - b.truePrice ,
    },{
        title: '应收款',
        dataIndex: 'shouldPrice',
        key: 'shouldPrice',
        sorter: (a, b) => a.shouldPrice - b.shouldPrice ,
        /*render: text => <a href="#" className="cell-notice" value={text}>{text}</a>*/
        render: text => <span className="cell-notice">{text}</span>
    },{
        title : '到期日' ,
        dataIndex : 'endDate' ,
        key : 'endDate' ,
    },{
        title: '操作人',
        dataIndex: 'operator',
        key: 'operator',
    },{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text,value) => {
            //var globalPoint = this ;
            return (
                <span>
                <Auth
                    authIndex="1"
                >
                    {/*<a className="cell-link cell-operation" value={value.id}
                       onClick={(event)=>{
                            service.market.fetchMarketDeatil({
                                id : value.id
                            },(result)=>{
                                if ( result.mark == '000000000' ){
                                    service.base.fetchBaseCustomerDetail({
                                        id : result.data.salesOrderDto.customer ,
                                    },function(error,result2){
                                        result.data.salesOrderDto.customer_forDetail = result2.data ;
                                        globalStore.dispatch(layerShow3({
                                            isShow : true ,
                                            detail : result.data
                                        })) ;
                                    }) ;

                                } else {
                                    globalFunction.alert.warning( result.messages , '操作提示' ) ;
                                }
                            })

                       }}
                    >查看</a>*/}
                    <i
                        className="sprite-view dib-table-icon"
                        title="查看"
                        onClick={(event)=>{
                            service.market.fetchMarketDeatil({
                                id : value.id
                            },(result)=>{
                                if ( result.mark == '000000000' ){
                                    service.base.fetchBaseCustomerDetail({
                                        id : result.data.salesOrderDto.customer ,
                                    },function(error,result2){
                                        result.data.salesOrderDto.customer_forDetail = result2.data ;
                                        globalStore.dispatch(layerShow3({
                                            isShow : true ,
                                            detail : result.data
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
                    authIndex="5"
                >
                {
                    value.delFlag == '0' &&
                    <Popconfirm
                        title="确认撤销这条销售记录吗?"
                        onConfirm={()=>{
                            var listPoint = window.listPoint ;
                            service.market.deleteMarketList({
                                id : value.id ,
                                salesOrderNo : value.id_forShow_noPrefix ,
                            },(result)=>{
                                if ( result.mark == '000000000' ){
                                    let params = {
                                        init : {
                                            pageSize :10,
                                            pageNum : 1,
                                            startTime : listPoint.state.filter.startDate ,
                                            endTime : listPoint.state.filter.endDate ,
                                        } ,
                                        fetchCustomer : {
                                            pageSize :9999,
                                            pageNum : 1,
                                        } ,
                                        fetchMarketer : {
                                            pageSize :9999,
                                            pageNum : 1,
                                            //roleIds : [3]
                                        }
                                    }
                                    //let token =  utils.cookie.config( TOKEN_NAME ) ;
                                    if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
                                        params.fetchMarketer.roleIds = [1,3] ;
                                        params.init.tenantId = params.fetchCustomer.tenantId =params.fetchMarketer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                    } else {
                                        params.fetchMarketer.roleIds = [3] ;
                                        params.init.id = params.fetchCustomer.id = params.fetchMarketer.id = window.globalStore.getState().userstore.user.id ;
                                    }
                                    service.market.initMarketList(params,(error,data) => {
                                        globalFunction.alert.info( '撤销销售记录成功' , '操作提示' ) ;
                                        globalStore.dispatch(marketListInit(data)) ;

                                    });
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
                        {/*<a
                         className="cell-link cell-operation"
                         value={value.id}
                         onClick={(event)=>{
                         // store.dispatch(modalShow1(true,{
                         //      id:value.id
                         // }))
                         }}
                         >撤销</a>*/}
                        <i title="撤销" className="sprite-cancel dib-table-icon"></i>
                    </Popconfirm>
                }
                </Auth>
            </span>
            )
        }
    }] ;

const COLUMNS_PRODUCT = [
    {
        title: '序号',
        dataIndex: 'itemId',
        key: 'itemId'
    }, {
        title : '货品',
        dataIndex : 'itemName_forShow',
        key : 'itemName_forShow',
        render: (text,value) => {
            return  <a key={text} value={value.itemId}
                       onClick={
                (event)=>{
                    // debugger ;
                    // let id = event.target.attributes.value.value ;
                    // globalStore.dispatch(layerShow2(true,{
                    //     product : id
                    // })) ;
                }
            }
            >{text}</a>
        }
    },{
        title : '单位' ,
        dataIndex : 'unitName_forShow' ,
        key : 'unitName_forShow'
    },{
        title : '数量' ,
        dataIndex : 'quantity' ,
        key : 'quantity' ,
        render: (text,value) => {
            // return  <a className="blue" key={text}>{text}</a>
            return (
                <span>
                <InputNumber
                    className="antdcustomer-input-width50"
                    value={text}
                    step = {1}
                    min = {0}
                    onChange={(values)=>{
                        if(typeof values === 'undefined'){
                            values = 0 ;
                        }
                        globalEvent.market.onChange_modelProduct.dispatch({
                            id : value.itemId ,
                            attr : 'quantity' ,
                            operation : 'change' , //直接覆盖改变
                            data : values ,
                        }) ;
                    }}
                />
            </span>
            )
        }
    },{
        title : '单价' ,
        dataIndex : 'unitPrice' ,
        key : 'unitPrice' ,
        render: (text,value) => {
            // return  <a className="blue" key={text}>{text}</a>
            return (
                <span>
                <InputNumber
                    className="antdcustomer-input-width70"
                    value={text}
                    step = {0.01}
                    min = {0}
                    onChange={(values)=>{
                        if(typeof values === 'undefined'){
                            values = 0 ;
                        }
                        globalEvent.market.onChange_modelProduct.dispatch({
                            id : value.itemId ,
                            attr : 'unitPrice' ,
                            operation : 'change' , //直接覆盖改变
                            data : values ,
                        }) ;
                    }}
                />
            </span>
            )
        }
    },{
        title : '折扣(%)' ,
        dataIndex : 'discount' ,
        key : 'discount' ,
        render: (text,value) => {
            // return  <a className="blue" key={text}>{text}</a>
            return (
                <span>
                <InputNumber
                    className="antdcustomer-input-width50"
                    value={text}
                    step = {0.01}
                    min = {0}
                    onChange={(values)=>{
                        if(typeof values === 'undefined'){
                            values = 0 ;
                        }
                        globalEvent.market.onChange_modelProduct.dispatch({
                            id : value.itemId ,
                            attr : 'discount' ,
                            operation : 'change' ,
                            data : values ,
                        }) ;
                    }}
                />
            </span>
            )
        }
    },{
        title : '销售金额' ,
        dataIndex : 'discountAmount' ,
        key : 'discountAmount'　,
        render:　(text,value)　=>{
            return　(
                <span>
                <InputNumber
                    className="antdcustomer-input-width90"
                    disabled
                    value={text}
                    step = {0.01}
                    min = {0}
                    onChange={(values)=>{
                        globalEvent.market.onChange_modelProduct.dispatch({
                            id : value.itemId ,
                            attr : 'discountAmount' ,
                            operation : 'change' ,
                            data : values ,
                        }) ;
                    }}
                />
            </span>
            )
        }
    },
    /*{
     title : '状态' ,
     dataIndex : 'deliveryStateName_forShow' ,
     key : 'deliveryStateName_forShow' ,
     render:　(text,value)　=>　{
     return　(
     <a　
     onClick={(event)=>{
     globalEvent.market.onChange_modelProduct.dispatch({
     id : value.itemId ,
     attr : 'deliveryState' ,
     operation : 'reversal' ,
     }) ;
     }}
     >
     {text}
     </a>
     )
     }
     }*/
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text,value)=>{
            return (
                <span>
                    <i
                        className="sprite-delete dib"
                        style={{color:'#aaa',verticalAlign:'text-bottom',cursor:'pointer'}}
                        onClick={()=>{
                            globalEvent.market.onChange_modelProduct.dispatch({
                                id : value.itemId ,
                                attr : 'quantity' ,
                                operation : 'delete' ,
                            }) ;
                        }}
                    ></i>
                </span>
            )
        }
    }, ] ;

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
/*
 const COLUMNS_PRODUCT_FORSHOW = [
 {
 title: '序号',
 dataIndex: 'id',
 key: 'id'
 },{
 title : '货品',
 dataIndex : 'product',
 key : 'product',
 render: (text,value) => {
 return  <a className="blue" key={text} value={value.id}
 onClick={
 (event)=>{
 // let id = event.target.attributes.value.value ;
 // globalStore.dispatch(layerShow2(true,{
 //     product : id
 // })) ;
 }
 }
 >{text}</a>
 }
 },{
 title : '单位' ,
 dataIndex : 'unit' ,
 key : 'unit'
 },{
 title : '数量' ,
 dataIndex : 'number' ,
 key : 'number' ,
 render: (text) => {
 return  <a className="blue" key={text}>{text}</a>
 }
 },{
 title : '单价' ,
 dataIndex : 'one' ,
 key : 'one' ,
 render: (text) => {
 return  <a className="blue" key={text}>{text}</a>
 }
 },{
 title : '折扣(%)' ,
 dataIndex : 'count' ,
 key : 'count' ,
 render: (text) => {
 return  <a className="blue" key={text}>{text}</a>
 }
 },{
 title : '销售金额' ,
 dataIndex : 'price' ,
 key : 'price'
 }] ;

 */

/*List主页面,需要初始化*/


class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shadeShow : 'none' ,
            pageSize : 10 ,
            currentPage : 1 ,
            filter : {
                customer : 'default-all' ,
                id : '' ,
                startMoney : '' ,
                endMoney : '' ,
                //payType : 'default-all' ,
                userId : 'default-all' ,
                recodeType : 'default-all' ,
                items : '' ,
                startDate : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDate : moment().format('YYYY-MM-DD') ,
                tips : '' ,
                receivableState : false ,
                overDue : false ,
            },
            newModel : {
                date : moment().format('YYYY-MM-DD') ,
                customerId : '' ,
                purchasePrice : 0.00 ,
                payType : '1' ,
                truePrice : 0.00 ,
                endPriceDate : moment().format('YYYY-MM-DD') ,
                imgurl : '' ,
                tips : '' ,
                product : [
                    // {
                    //     itemId : '' ,
                    //     unitId : '' ,
                    //     quantity : '' ,
                    //     unitPrice : '' ,
                    //     discount : '' ,
                    //     discountAmount : '' ,
                    //     deliveryState : '' ,

                    //     itemName_forShow : '' ,
                    //     unitName_forShow : '' ,
                    //     deliveryStateName_forShow : '' ,
                    // }
                ] ,  //产品列表
            }
            ,
            validation : {
                purchasePrice_status : '' ,
                purchasePrice_help : '' ,
                truePrice_status : '' ,
                truePrice_help : '' ,
                imgurl_status : '' ,
                imgurl_help : '' ,
                tips_status : '' ,
                tips_help : '' ,
            } ,

            mockData: [], //穿梭框 source
            targetKeys: [], //穿梭框 target

            //event
            onChange_modelProduct : (data)=>{
                var tarObj = {} ;
                var isDeleteOneProduct = null ; //是否是在点击减号的时候删除掉一行
                var retArr = this.state.newModel.product.map((v,i)=>{
                    if ( v.itemId == data.id ){
                        switch (data.attr) {
                            case 'quantity' :
                                if ( data.operation === 'add' ){
                                    v.quantity = Math.floor( v.quantity - 0 ) + 1 ;
                                } else if ( data.operation === 'minus' ){
                                    if ( Math.floor( v.quantity - 0 ) > 1 ){
                                        v.quantity = Math.floor( v.quantity - 0 ) - 1 ;
                                    } else {
                                        v.quantity = 0 ;
                                        isDeleteOneProduct = v.itemId ;
                                    }
                                } else if ( data.operation === 'change' ){
                                    v.quantity = data.data ;
                                    v.discountAmount = this.__multiplyAll(v.quantity,v.unitPrice,v.discount/100);
                                } else if ( data.operation === 'delete' ){
                                    isDeleteOneProduct = v.itemId ;
                                }
                                break ;
                            case 'unitPrice' :
                                if ( data.operation === 'change' ){
                                    v.unitPrice = data.data ;
                                    v.discountAmount = this.__multiplyAll(v.quantity,v.unitPrice,v.discount/100);
                                }
                                break ;
                            case 'discount' :
                                if ( data.operation === 'change' ){
                                    v.discount = data.data ;
                                    v.discountAmount = this.__multiplyAll(v.quantity,v.unitPrice,v.discount/100);
                                }
                                break ;
                            case 'discountAmount' :
                                if ( data.operation === 'change' ){
                                    //v.discountAmount = data.data ;
                                }
                                break ;
                            case 'deliveryState' :
                                if ( data.operation === 'reversal' ){
                                    if ( v.deliveryState == '0' ){
                                        v.deliveryState = '1' ;
                                        v.deliveryStateName_forShow = '已发货' ;
                                    } else if ( v.deliveryState == '1' ){
                                        v.deliveryState = '0' ;
                                        v.deliveryStateName_forShow = '未发货' ;
                                    }
                                }
                                break ;
                        }
                    }
                    return v ;
                }) ;
                if ( isDeleteOneProduct !== null ){
                    retArr = retArr.filter((v)=>{
                        if ( v.itemId === isDeleteOneProduct ){
                            return false ;
                        } else {
                            return true ;
                        }
                    }) ;
                } ;
                this.setState({
                    newModel : {
                        ...this.state.newModel ,
                        product : retArr ,
                    }
                })
            }
        };
    }
    //init for market
    componentDidMount(){
        window.listPoint = this ;
        let params = {
            init : {
                pageSize :10,
                pageNum : 1,
                startTime : this.state.filter.startDate ,
                endTime : this.state.filter.endDate ,
            } ,
            fetchCustomer : {
                pageSize :9999,
                pageNum : 1,
            } ,
            fetchMarketer : {
                pageSize :9999,
                pageNum : 1,
                //roleIds : [3]
            }
        }
        //let token =  utils.cookie.config( TOKEN_NAME ) ;
        if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
            params.fetchMarketer.roleIds = [1,3] ;
            params.init.tenantId = params.fetchCustomer.tenantId =params.fetchMarketer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.fetchMarketer.roleIds = [3] ;
            params.init.id = params.fetchCustomer.id = params.fetchMarketer.id = window.globalStore.getState().userstore.user.id ;
        }
        service.market.initMarketList(params,(error,data) => {
            this.props.marketListInit(data) ;
            //货品穿梭框 全部货品数据
            service.market.fetchMarketProduct({
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
            },(result)=>{
                var proArr = result.data.items.map((v)=>{
                    v.key = v.itemId ;
                    v.title = v.brandName + '-' + v.itemName + ' ' + v.specification ;
                    // v.description = v.itemName + ' ' + v.specification ;
                    v.chosen = false ;
                    return v ;
                }) ;
                this.setState({
                    mockData : proArr ,
                    targetDate : [] ,
                },()=> {console.log(this.state)}) ;
                this.queryParamsInit( this.props.location.query ) ;
            }) ;
        });

        //global event init
        globalEvent.market.onChange_modelProduct = new signals.Signal() ;
        globalEvent.market.onChange_modelProduct.add(this.state.onChange_modelProduct) ;
    }
    queryParamsInit(params){
        if ( params[ 'state' ] === 'new' ){
            this.props.layerShow1({
                isShow : true ,
            }) ;
            this.setState({
                ...this.state ,
                newModel : {
                    date : moment().format('YYYY-MM-DD') ,
                    customerId : '' ,
                    purchasePrice : '' ,
                    payType : 1 ,
                    truePrice : '' ,
                    endPriceDate : moment().format('YYYY-MM-DD') ,
                    imgurl : '' ,
                    tips : '' ,
                    product : [] ,
                },
            })
        }
    }
    componentWillUnmount(){
        globalEvent.market.onChange_modelProduct.remove(this.state.onChange_modelProduct) ;
    }
    //filter
    _ev_filterSearch(event){
        let params = {
            init : {
                // appQueryTerm : '' ,
                //overDue : null , //逾期 0 未 1已 null全部
                // salesOrderNo : this.state.filter.id , //不包括前面XSD的号
                salesOrderNoSelect : this.state.filter.id , //模拟查询的参数
                customerId : this.state.filter.customer === 'default-all' ? '' : this.state.filter.customer  ,
                userId : this.state.filter.userId === 'default-all' ? '' : this.state.filter.userId,
                // receivable : '' ,
                settlementWay : this.state.filter.payType === 'default-all' ? '' :  this.state.filter.payType  , //结算方式
                //deliveryState : null , //发货状态 0未 1已 null全部
                pageSize : 10 ,
                pageNum : 1 ,
                startTime : this.state.filter.startDate , //开始日期
                endTime : this.state.filter.endDate ,
                // isBack : '' , //退货状态 没用
                delFlag : this.state.filter.recodeType === 'default-all' ? '' : this.state.filter.recodeType , //记录状态 0 未撤销 1 已撤销 null全部
                startAmount : this.state.filter.startMoney == '' ? '' : this.state.filter.startMoney - 0 , //
                endAmount : this.state.filter.endMoney == '' ? '' : this.state.filter.endMoney - 0 , //

                receivableState :this.state.filter.receivableState === false ? '' : 1 ,
                overDue : this.state.filter.overDue === false ? '' : 1 ,
            } ,
            fetchCustomer : {
                pageSize :9999,
                pageNum : 1,
            } ,
            fetchMarketer : {
                pageSize :9999,
                pageNum : 1,
                //roleIds : [3]
            }
        }
        //let token =  utils.cookie.config( TOKEN_NAME ) ;
        if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
            params.fetchMarketer.roleIds = [1,3] ;
            params.init.tenantId = params.fetchCustomer.tenantId = params.fetchMarketer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.fetchMarketer.roleIds = [3] ;
            params.init.id = params.fetchCustomer.id = params.fetchMarketer.id = window.globalStore.getState().userstore.user.id ;
        }
        service.market.fetchMarketList(params.init,(error,data)=>{
            this.props.marketListTable(data) ;
            this.setState({
                currentPage : 1
            });
        }) ;


    }
    //operation button
    _evClick_addMarket(callbackForOpenAgain){
        // console.log( this.state.filter ) ;
        if ( !this.state.newModel.customerId ){
            globalFunction.alert.warning( '请选择一个客户~' , '数据提示' ) ;
            return ;
        }else if( this.state.newModel.truePrice > this.state.newModel.purchasePrice){
            globalFunction.alert.warning( '实收款不能大于销售金额~' , '数据提示' ) ;
            return ;
        }
        this.setState({
            shadeShow : 'block'
        },()=> {
            service.market.addMarket({
                customerId : this.state.newModel.customerId ,
                amount : this.state.newModel.purchasePrice - 0 ,
                userId : window.globalStore.getState().userstore.user.id ,
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                received : this.state.newModel.truePrice - 0 ,
                businessTime : this.state.newModel.date ,
                settlementWay : this.state.newModel.payType ,
                comment : this.state.newModel.tips ,
                imgUrl : this.state.newModel.imgurl ,
                deadLine : this.state.newModel.endPriceDate ,
                // deliveryState : '' ,
                salesOrderDetailDtos : this.state.newModel.product.map((v)=>{
                    return {
                        deliveryState : v.deliveryState - 0 ,
                        discount : v.discount - 0 ,
                        discountAmount : v.discountAmount - 0 ,
                        itemId : v.itemId - 0 ,
                        quantity : v.quantity - 0 ,
                        unitId : v.unitId - 0 ,
                        unitPrice : v.unitPrice - 0 ,
                    }
                }) ,
            },(result)=>{
                if ( result.mark == '000000000' ){
                    let params = {
                        init : {
                            pageSize :10,
                            pageNum : 1,
                            startTime : this.state.filter.startDate ,
                            endTime : this.state.filter.endDate ,
                        } ,
                        fetchCustomer : {
                            pageSize :9999,
                            pageNum : 1,
                        } ,
                        fetchMarketer : {
                            pageSize :9999,
                            pageNum : 1,
                            //roleIds : [3]
                        }
                    }
                    //let token =  utils.cookie.config( TOKEN_NAME ) ;
                    if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
                        params.fetchMarketer.roleIds = [1,3] ;
                        params.init.tenantId = params.fetchCustomer.tenantId =params.fetchMarketer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                    } else {
                        params.fetchMarketer.roleIds = [3] ;
                        params.init.id = params.fetchCustomer.id = params.fetchMarketer.id = window.globalStore.getState().userstore.user.id ;
                    }
                    service.market.initMarketList(params,(error,data) => {
                        var self = this ;
                        globalFunction.alert.info( '新增销售记录成功' , '操作提示' ) ;
                        this.props.marketListInit(data) ;
                        setTimeout(function(){
                            self.setState({
                                shadeShow : 'none' ,
                                filter : {
                                    customer : 'default-all' ,
                                    id : '' ,
                                    startMoney : '' ,
                                    endMoney : '' ,
                                    payType : 'default-all' ,
                                    recodeType : 'default-all' ,
                                    items : '' ,
                                    startDate : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                                    endDate : moment().format('YYYY-MM-DD') ,
                                    userId : 'default-all' ,
                                    receivableState : false ,
                                    overDue : false ,
                                    // tips : ''
                                }
                            }) ;
                        },0); //因为退出动画时间为0.8s
                        callbackForOpenAgain && callbackForOpenAgain() ;
                    });

                } else {
                    this.setState({
                        shadeShow : 'none'
                    });
                    globalFunction.alert.warning( result.message , '操作提示' ) ;
                }
            }) ;
        });
    }
    _evClick_addMarketAndAgain(event){
        if ( !this.state.newModel.customerId ){
            globalFunction.alert.warning( '请选择一个客户~' , '数据提示' ) ;
            return ;
        }
        this._evClick_addMarket(()=>{
            this.props.layerShow1({
                isShow : true ,
            }) ;
            this.setState({
                ...this.state ,
                newModel : {
                    date : moment().format('YYYY-MM-DD') ,
                    customerId : '' ,
                    purchasePrice : '' ,
                    payType : 1 ,
                    truePrice : '' ,
                    endPriceDate : moment().format('YYYY-MM-DD') ,
                    imgurl : '' ,
                    tips : '' ,
                    product : [] ,
                },
            })
        }) ;
    }
    _evClick_selectProduct(event){
        this.props.layerShow2({
            isShow : false
        }) ;
        var targetArr = this.state.targetKeys ;
        var mockArr = this.state.mockData ;
        var modelProduct = this.state.newModel.product ;
        var arrTmp = targetArr.map((tarId)=>{
            var _tmp = {} ;
            mockArr.forEach((mock)=>{
                if ( mock.itemId == tarId ){
                    _tmp = {
                        itemId : mock.itemId ,
                        unitId : mock.unitId ,
                        quantity : 0 , //
                        unitPrice : 0 , //
                        discount : 100 , //
                        discountAmount : 0 , //
                        deliveryState : '0' ,

                        itemName_forShow : mock.itemName ,
                        unitName_forShow : mock.unitName ,
                        deliveryStateName_forShow : '未发货' ,
                    }
                }
            }) ;
            modelProduct.forEach((exist)=>{
                if ( exist.itemId == tarId ){
                    _tmp = exist ;
                }
            }) ;
            return _tmp ;
        }) ;
        this.setState({
            newModel : {
                ...this.state.newModel　,
                product : arrTmp ,
            }
        }) ;

    }
    _evClick_openSelectProduct(event){
        globalStore.dispatch(layerShow2({
            isShow : true ,
            // product : id
        })) ;
        // var targetArr = this.state.targetKeys ;
        // var mockArr = this.state.mockData ;
        var modelProduct = this.state.newModel.product ;

        var tranRight = modelProduct.map((v)=>{
            return v.itemId ;
        }) ;
        this.setState({
            targetKeys : tranRight ,
        }) ;
    }

    //勾选filter里的checkbox触发查询
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
    render (){
        //details
        // let detailsWaitShow = this.__findDetails(this.props.market.listState.showId) ;
        let detailsWaitShow = this.props.market.list.detail.salesOrderDto || {} ;
        //form layout
        const formItemLayout = {
            labelCol : {span:4} ,
            wrapperCol : {span:10}
        }
        const formItemLayout_static = {
            labelCol : {span:3} ,
            wrapperCol : {span:10}
        }
        const formItemLayout_modal = {
            labelCol : {span:5} ,
            wrapperCol : {span:15}
        }
        const formItemLayout_modal_submit = {
            wrapperCol : {span:15,offset:5}
        }
        return (
            <div>

                <div className="center-east-north">
                    <a className="active">销售记录</a>
                    <span className="operation">
                        <Auth
                            authIndex="2"
                        >
                            <Button
                                type="primary"
                                icon="plus-circle-o"
                                onClick={()=>{
                                    this.props.layerShow1({
                                        isShow : true ,
                                    }) ;
                                    this.setState({
                                        ...this.state ,
                                        newModel : {
                                            date : moment().format('YYYY-MM-DD') ,
                                            customerId : '' ,
                                            purchasePrice : '' ,
                                            payType : 1 ,
                                            truePrice : '' ,
                                            endPriceDate : moment().format('YYYY-MM-DD') ,
                                            imgurl : '' ,
                                            tips : '' ,
                                            product : [] ,
                                        },
                                    })
                                }}
                            >新建</Button>
                        </Auth>
                        <Auth
                            authIndex="3"
                        >
                            <Button style={{display:'none'}} type="primary" icon="export">导出</Button>
                        </Auth>
                    </span>
                </div>
                <div className="center-east-center">

                    <QueueAnim>

                        <div className="filter-wrap" key="anime-1">
                        <span className="filter">
                            <span className="filter-label">客户</span>
                            <span className="filter-component">
                                <Select
                                    showSearch
                                    style={{width:150}}
                                    placeholder="选择客户"
                                    notFoundContent=""
                                    optionFilterProp="children"
                                    value={this.state.filter.customer+''}
                                    onChange={(value)=>{
                                        this.setState({
                                            filter : {
                                                ...this.state.filter ,
                                                customer : value+'' ,
                                            }
                                        }) ;
                                    }}
                                >
                                    <Option value="default-all" title="全部客户">全部客户</Option>
                                    {
                                        this.props.market.list.customer.data.map((v,i)=>{
                                            return <Option title={v.name} value={v.value} key={v.value}>{v.name}</Option>
                                        })
                                    }
                                </Select>
                            </span>
                        </span>
                        <span className="filter">
                            <span className="filter-label">编号</span>
                            <span className="filter-component">
                                <Input
                                    value={this.state.filter.id}
                                    onChange={(event)=>{
                                        this.setState({
                                            filter : {
                                                ...this.state.filter ,
                                                id : event.target.value
                                            }
                                        })
                                    }}
                                />
                            </span>
                        </span>
                        <span className="filter">
                            <span className="filter-label">销售金额</span>
                            <span className="filter-component">
                                <Input
                                    value={this.state.filter.startMoney}
                                    onChange={(event)=>{
                                        this.setState({
                                            filter : {
                                                ...this.state.filter ,
                                                startMoney : event.target.value
                                            }
                                        })
                                    }}
                                />
                            </span>
                            <span className="filter-label">至</span>
                            <span className="filter-component">
                                <Input
                                    value={this.state.filter.endMoney}
                                    onChange={(event)=>{
                                        this.setState({
                                            filter : {
                                                ...this.state.filter ,
                                                endMoney : event.target.value
                                            }
                                        })
                                    }}
                                />
                            </span>
                        </span>
                            {/*<span className="filter">
                            <span className="filter-label">结算方式</span>
                            <span className="filter-component">
                                <Select
                                    style={{width:120}}
                                    value={this.state.filter.payType+''}
                                    onChange={(value)=>{
                                        this.setState({
                                            filter : {
                                                ...this.state.filter ,
                                                payType : value+''
                                            }
                                        })
                                    }}
                                >
                                    <Option value="default-all" title="全部结算方式">全部结算方式</Option>
                                    {
                                        this.props.market.list.payType.data.map((v,i)=>{
                                            return <Option title={v.name} value={v.value+''} key={v.value}>{v.name}</Option>
                                        })
                                    }
                                </Select>
                            </span>
                        </span>*/}
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
                                        this.props.market.list.salesMan.data.map((v,i)=>{
                                            return <Option title={v.name} value={v.value} key={v.value}>{v.name}</Option>
                                        })
                                    }
                                </Select>
                            </span>
                        </span>
                        <span className="filter">
                            <span className="filter-label">记录状态</span>
                            <span className="filter-component">
                                <Select
                                    style={{width:120}}
                                    value={this.state.filter.recodeType+''}
                                    onChange={(value)=>{
                                        this.setState({
                                            filter : {
                                                ...this.state.filter　,
                                                recodeType : value+'' ,
                                            }
                                        })
                                    }}
                                >
                                    <Option value="default-all" title="全部">全部</Option>
                                    {
                                        this.props.market.list.recodeType.data.map((v,i)=>{
                                            return <Option title={v.name} value={v.value+''} key={v.value}>{v.name}</Option>
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
                            <span className="filter-component">
                                <Checkbox
                                    checked={this.state.filter.receivableState}
                                    onChange={this._ev_receivableState_filterSearch.bind(this)}
                                >
                                    应收款不为0
                                </Checkbox>
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
                        <span className="searc-btn">
                            <Button type="default" icon="search" onClick={this._ev_filterSearch.bind(this)}>查询</Button>
                        </span>
                        </div>

                        <div className="tabel-wrap" key="anime-3">
                            <Table
                                dataSource={this.props.market.list.dataSource.data}
                                columns={this.props.COLUMNS}

                                pagination={{
                                showSizeChanger : true ,

                                total : this.props.market.list.totalCount ,

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
                                                // appQueryTerm : '' ,
                                                //overDue : null , //逾期 0 未 1已 null全部
                                                // salesOrderNo : this.state.filter.id , //不包括前面XSD的号
                                                salesOrderNoSelect : this.state.filter.id , //模拟查询的参数
                                                customerId : this.state.filter.customer === 'default-all' ? '' : this.state.filter.customer  ,
                                                userId : this.state.filter.userId === 'default-all' ? '' : this.state.filter.userId,
                                                // receivable : '' ,
                                                settlementWay : this.state.filter.payType === 'default-all' ? '' :  this.state.filter.payType  , //结算方式
                                                //deliveryState : null , //发货状态 0未 1已 null全部
                                                pageSize : self.state.pageSize ,
                                                pageNum : 1 ,
                                                startTime : this.state.filter.startDate , //开始日期
                                                endTime : this.state.filter.endDate ,
                                                // isBack : '' , //退货状态 没用
                                                delFlag : this.state.filter.recodeType === 'default-all' ? '' : this.state.filter.recodeType , //记录状态 0 未撤销 1 已撤销 null全部
                                                startAmount : this.state.filter.startMoney == '' ? '' : this.state.filter.startMoney - 0 , //
                                                endAmount : this.state.filter.endMoney == '' ? '' : this.state.filter.endMoney - 0 , //

                                                receivableState :this.state.filter.receivableState === false ? '' : 1 ,
                                                overDue : this.state.filter.overDue === false ? '' : 1 ,
                                            } ,
                                            fetchCustomer : {
                                                pageSize :9999,
                                                pageNum : 1,
                                            } ,
                                            fetchMarketer : {
                                                pageSize :9999,
                                                pageNum : 1,
                                                //roleIds : [3]
                                            }
                                        }
                                        //let token =  utils.cookie.config( TOKEN_NAME ) ;
                                        if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
                                            params.fetchMarketer.roleIds = [1,3] ;
                                            params.init.tenantId = params.fetchCustomer.tenantId = params.fetchMarketer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                        } else {
                                            params.fetchMarketer.roleIds = [3] ;
                                            params.init.id = params.fetchCustomer.id = params.fetchMarketer.id = window.globalStore.getState().userstore.user.id ;
                                        }
                                        service.market.initMarketList(params,(error,data)=>{
                                            self.props.marketListInit(data) ;
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
                                            // appQueryTerm : '' ,
                                            //overDue : null , //逾期 0 未 1已 null全部
                                            // salesOrderNo : this.state.filter.id , //不包括前面XSD的号
                                            salesOrderNoSelect : this.state.filter.id , //模拟查询的参数
                                            customerId : this.state.filter.customer === 'default-all' ? '' : this.state.filter.customer  ,
                                            userId : this.state.filter.userId === 'default-all' ? '' : this.state.filter.userId,
                                            // receivable : '' ,
                                            settlementWay : this.state.filter.payType === 'default-all' ? '' :  this.state.filter.payType  , //结算方式
                                            //deliveryState : null , //发货状态 0未 1已 null全部
                                            pageSize :self.state.pageSize,
                                            pageNum : value,
                                            startTime : this.state.filter.startDate , //开始日期
                                            endTime : this.state.filter.endDate ,
                                            // isBack : '' , //退货状态 没用
                                            delFlag : this.state.filter.recodeType === 'default-all' ? '' : this.state.filter.recodeType , //记录状态 0 未撤销 1 已撤销 null全部
                                            startAmount : this.state.filter.startMoney == '' ? '' : this.state.filter.startMoney - 0 , //
                                            endAmount : this.state.filter.endMoney == '' ? '' : this.state.filter.endMoney - 0 , //

                                            receivableState :this.state.filter.receivableState === false ? '' : 1 ,
                                            overDue : this.state.filter.overDue === false ? '' : 1 ,
                                        } ,
                                        fetchCustomer : {
                                            pageSize :9999,
                                            pageNum : 1,
                                        } ,
                                        fetchMarketer : {
                                            pageSize :9999,
                                            pageNum : 1,
                                            //roleIds : [3]
                                        }
                                    }
                                    //let token =  utils.cookie.config( TOKEN_NAME ) ;
                                    if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
                                        params.fetchMarketer.roleIds = [1,3] ;
                                        params.init.tenantId = params.fetchCustomer.tenantId = params.fetchMarketer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                    } else {
                                        params.fetchMarketer.roleIds = [3] ;
                                        params.init.id = params.fetchCustomer.id = params.fetchMarketer.id = window.globalStore.getState().userstore.user.id ;
                                    }
                                    service.market.initMarketList(params,(error,data)=>{
                                        self.props.marketListInit(data) ;
                                    });
                                }
                            }}
                            > </Table>
                        </div>

                        {/*<div className="pagenation-wrap">
                         <Pagination className="page" defaultCurrent={1} total={50} />
                         </div>*/}

                        <Layer layerShow={this.props.market.listState.layerShow1} _handleLayerHide={()=>{this.props.layerShow1({isShow:false})}}>
                            <div className="header">
                                {/*<span className="header-title">新建销售记录</span>*/}

                                <span
                                    className="nav-return-name"
                                    onClick={()=>{
                                        this.props.layerShow1({
                                            isShow:false
                                        })
                                    }}
                                >
                                    <i className="sprite-arrow3"></i>
                                    <span className="re-arrow">返回</span>
                                </span>

                                <span className="header-operation">

                                    <span
                                        className="operation save-add"
                                        onClick={this._evClick_addMarketAndAgain.bind(this)}
                                    >
                                        <span>保存并新增</span>
                                    </span>

                                    <span
                                        className="operation save"
                                        onClick={this._evClick_addMarket.bind(this)}
                                    >
                                        <i></i>
                                        <span>保存</span>
                                    </span>


                                    {/*<span
                                        className="operation cancel"
                                        onClick={()=>{
                                            this.props.layerShow1({isShow:false}) ;
                                        }}
                                    >
                                        <span>取消</span>
                                    </span>*/}
                                </span>
                            </div>
                            <div className="content-wrap">
                                <div className="content-name">
                                    新建销售记录
                                </div>
                                <div className="content">
                                    <Form horizontal onSubmit={this.handleFormSubmit}>
                                        <FormItem
                                            {...formItemLayout}
                                            label={<span><span className="red-mark">*</span>客户名称</span>}
                                        >
                                            <Select
                                                showSearch
                                                placeholder="请选择一个客户"
                                                optionFilterProp="children"
                                                value={this.state.newModel.customerId+''}
                                                notFoundContent=""
                                                onChange={(value)=>{
                                                this.setState({
                                                    newModel : {
                                                        ...this.state.newModel ,
                                                        customerId : value+''
                                                    }
                                                }) ;
                                            }}
                                            >
                                                {
                                                    this.props.market.list.customer.data.map((v,i)=>{
                                                        return <Option title={v.name} value={v.value} key={v.value}>{v.name}</Option>
                                                    })
                                                }
                                            </Select>
                                            <Link className="new " to="/base/b_customer?state=new">
                                                <i></i>
                                                <span>新增</span>
                                            </Link>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                            label={<span><span className="red-mark">*</span>销售金额</span>}
                                            validateStatus={this.state.validation.purchasePrice_status}
                                            help={this.state.validation.purchasePrice_help}
                                        >
                                            <InputNumber
                                                placeholder='0.00元'
                                                value={this.state.newModel.purchasePrice}
                                                min={0}
                                                max={100000000}
                                                step={0.01}
                                                onChange={(value)=>{
                                                if(typeof value === 'undefined'){
                                                    value = 0.00 ;
                                                }
                                                var purchasePrice_validation = service.validation.market.form_market.purchasePrice(value) ;
                                                this.setState({
                                                    newModel : {
                                                        ...this.state.newModel ,
                                                        purchasePrice : value ,
                                                    },
                                                    validation : {
                                                        ...this.state.validation ,
                                                        purchasePrice_status : purchasePrice_validation.validateStatus ,
                                                        purchasePrice_help : purchasePrice_validation.help ,
                                                    }
                                                })
                                            }}
                                            />
                                            {/*
                                             <Input
                                             placeholder='0.00元'
                                             value={this.state.newModel.purchasePrice}
                                             onChange={(event)=>{
                                             this.setState({
                                             newModel : {
                                             ...this.state.newModel ,
                                             purchasePrice : event.target.value ,
                                             }
                                             })
                                             }}
                                             />
                                             */}
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                            label={<span><span className="red-mark">*</span>实收款</span>}
                                            validateStatus={this.state.validation.truePrice_status}
                                            help={this.state.validation.truePrice_help}
                                        >
                                            <InputNumber
                                                placeholder='0.00元'
                                                value={this.state.newModel.truePrice}
                                                min={0}
                                                max={100000000}
                                                step={0.01}
                                                onChange={(value)=>{
                                                if(typeof value === 'undefined'){
                                                    value = 0.00 ;
                                                }
                                                var truePrice_validation = service.validation.market.form_market.truePrice(value) ;
                                                this.setState({
                                                    newModel : {
                                                        ...this.state.newModel ,
                                                        truePrice : value ,
                                                    },
                                                    validation : {
                                                        ...this.state.validation ,
                                                        truePrice_status : truePrice_validation.validateStatus ,
                                                        truePrice_help : truePrice_validation.help ,
                                                    }
                                                })
                                            }}
                                            />
                                            {/*
                                             <Input
                                             placeholder='0.00元'
                                             value={this.state.newModel.truePrice}
                                             onChange={(event)=>{
                                             this.setState({
                                             newModel : {
                                             ...this.state.newModel ,
                                             truePrice : event.target.value ,
                                             }
                                             })
                                             }}
                                             />
                                             */}
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                            label="业务日期"
                                        >
                                            <DatePicker
                                                size="large"
                                                key="for"
                                                value={this.state.newModel.date}
                                                format="yyyy-MM-dd"
                                                onChange={(v,dataString)=>{
                                                this.setState({
                                                    newModel : {
                                                        ...this.state.newModel ,
                                                        date : dataString ,
                                                    }
                                                })
                                            }}
                                            ></DatePicker>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                            label="结算方式"
                                        >

                                            <Select
                                                value={this.state.newModel.payType+''}
                                                onChange={(value)=>{
                                                this.setState({
                                                    newModel : {
                                                        ...this.state.newModel ,
                                                        payType : value+''
                                                    }
                                                }) ;
                                            }}
                                            >
                                                {
                                                    this.props.market.list.payType.data.map((v,i)=>{
                                                        return <Option title={v.name} value={v.value+''} key={v.value}>{v.name}</Option>
                                                    })
                                                }
                                            </Select>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                            label={<span>尾款到期日</span>}
                                        >
                                            <DatePicker
                                                size="large"
                                                key="for"
                                                value={this.state.newModel.endPriceDate}
                                                format="yyyy-MM-dd"
                                                onChange={(v,dataString)=>{
                                                this.setState({
                                                    newModel : {
                                                        ...this.state.newModel ,
                                                        endPriceDate : dataString ,
                                                    }
                                                })
                                            }}
                                            ></DatePicker>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                            label={"图片"}
                                            validateStatus={this.state.validation.imgurl_status}
                                            help={this.state.validation.imgurl_help}
                                        >
                                            <Upload
                                                className="antd-img-uploader"
                                                name="file"
                                                showUploadList={false}
                                                action="/api/upload-file-SASORE011"
                                                beforeUpload={(file)=>{
                                                if ( file.size > 1024*1024*5 ){
                                                    this.setState({
                                                        validation : {
                                                            ...this.state.validation ,
                                                            imgurl_status : 'error' ,
                                                            imgurl_help : '文件大小超过5M' ,
                                                        },
                                                    }) ;
                                                    return false ;
                                                }
                                                if ( FILE_IMAGE_ACCEPT.indexOf( file.name.split('.').pop().toLowerCase() ) == -1 ){
                                                    this.setState({
                                                        validation : {
                                                            ...this.state.validation ,
                                                            imgurl_status : 'error' ,
                                                            imgurl_help : '文件必须以jpg,jpeg或png格式' ,
                                                        },
                                                    }) ;
                                                    return false ;
                                                }
                                                this.setState({
                                                    validation : {
                                                        ...this.state.validation ,
                                                        imgurl_status : undefined ,
                                                        imgurl_help : '' ,
                                                    },
                                                }) ;
                                            }}
                                                onChange={(info)=>{
                                                if (info.file.status === 'done') {
                                                    var result = info.file.response ;
                                                    if ( result.mark == '000000000' ){
                                                        globalFunction.alert.info( '图片上传成功' , '操作提示' ) ;
                                                        this.setState({
                                                            newModel : {
                                                                ...this.state.newModel ,
                                                                imgurl : result.data.img_url ,
                                                            }
                                                        }) ;
                                                    } else {
                                                        globalFunction.alert.warning( result.message , '操作提示' ) ;
                                                    }
                                                } else {
                                                    globalFunction.alert.info( '图片上传中' , '操作提示' ) ;
                                                }
                                            }}
                                            >
                                                {
                                                    this.state.newModel.imgurl ?
                                                        <img src={this.state.newModel.imgurl} role="presentation" className="ehsy-image" /> :
                                                        <Icon type="plus" className="avatar-uploader-trigger" />
                                                }
                                            </Upload>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                            label={"备注"}
                                            validateStatus={this.state.validation.tips_status}
                                            help={this.state.validation.tips_help}
                                        >
                                            <Input
                                                value={this.state.newModel.tips}
                                                onChange={(event)=>{
                                                var tips_validation = service.validation.market.form_market.tips(event.target.value) ;
                                                this.setState({
                                                    newModel : {
                                                        ...this.state.newModel ,
                                                        tips : event.target.value ,
                                                    },
                                                    validation : {
                                                        ...this.state.validation ,
                                                        tips_status : tips_validation.validateStatus ,
                                                        tips_help : tips_validation.help ,
                                                    }
                                                })
                                            }}
                                            />
                                        </FormItem>
                                    </Form>
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
                                                        dataSource={this.state.newModel.product}
                                                        pagination={false}
                                                        columns={this.props.COLUMNS_PRODUCT}
                                                    ></Table>

                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24} offset={0}>
                                                <span className="staticCount">
                                                    <div className="sta-line">
                                                        <span className="sta-lable">数量&nbsp;:</span>
                                                        <span className="sta-value red">{this._count.call(this,'quantity')}</span>
                                                    </div>
                                                    <div className="sta-line">
                                                        <span className="sta-lable">合计&nbsp;:</span>
                                                        <span className="sta-value red">{this._count.call(this,'discountAmount')}</span>
                                                    </div>
                                                    {/*<span className="staticCount-title">合计&nbsp;</span>
                                                    <span style={{color:'#aaa'}}>&nbsp;数量&nbsp;:&nbsp;</span>
                                                    <span className="red" style={{paddingLeft:'5px',paddingRight:'5px'}}>{this._count.call(this,'quantity')}</span>
                                                    <span style={{color:'#aaa'}}>&nbsp;销售金额&nbsp;:&nbsp;</span>
                                                    <span className="red" style={{paddingLeft:'5px',paddingRight:'5px'}}>{this._count.call(this,'discountAmount')}</span>*/}
                                                </span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24} offset={0}>
                                                    <a
                                                        className="in-table-add-product"
                                                        onClick={this._evClick_openSelectProduct.bind(this)}
                                                    >
                                                        选择货品
                                                    </a>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Layer>

                        <div className="shadeForClick" style={{display: this.state.shadeShow}}></div>

                        <Layer
                            addClass="highlevel"
                            layerShow={this.props.market.listState.layerShow2}
                            _handleLayerHide={()=>{
                            this.props.layerShow2({isShow:false})
                        }}
                        >
                            <div className="transpant-wrap">
                                {/*
                                 <Row className="row1">
                                 <Col span={24} className="col1">选择货品</Col>
                                 </Row>
                                 <Row className="row2">
                                 <Col span={24} className="col2">
                                 <Input placeholder="请输入查找关键字" className="input" />
                                 <Button type="default" icon="search">查询</Button>
                                 </Col>
                                 </Row>
                                 <Row className="row3">
                                 <Col span={11} >
                                 <span className="fontSize14">货品名称</span>
                                 <span>(双击进行选择)</span>
                                 </Col>
                                 <Col span={11} offset={2}>
                                 <span>已选商品列表</span>
                                 </Col>
                                 </Row>
                                 <Row className="row4">
                                 <Col span={11}>
                                 <div className="r-table">
                                 <div className="row-header line">
                                 <span className="s1">商品名称</span>
                                 <span className="s2">品牌</span>
                                 <span className="s3">型号规格</span>
                                 </div>
                                 <div className="line row-content" >
                                 <span className="s1">XX商品</span>
                                 <span className="s2">XX品牌</span>
                                 <span className="s3">XX型号</span>
                                 </div>
                                 <div className="line row-content" >
                                 </div>
                                 <div className="line row-content" >
                                 </div>
                                 <div className="line row-content" >
                                 </div>
                                 <div className="line row-content" >
                                 </div>
                                 <div className="line row-content" >
                                 </div>
                                 <div className="line row-content" >
                                 </div>
                                 <div className="line row-content" >
                                 </div>
                                 <div className="line row-content" >
                                 </div>
                                 </div>
                                 </Col>
                                 <Col span={11} offset={2}>
                                 <div className="r-table">
                                 <div className="row-header line">
                                 <span className="s1">商品名称</span>
                                 <span className="s2">品牌</span>
                                 <span className="s3">型号规格</span>
                                 </div>
                                 <div className="line row-content" >
                                 <span className="s1">XX商品</span>
                                 <span className="s2">XX品牌</span>
                                 <span className="s3">XX型号</span>
                                 </div>
                                 <div className="line row-content" >
                                 <span className="s1">XX商品</span>
                                 <span className="s2">XX品牌</span>
                                 <span className="s3">XX型号</span>
                                 </div>
                                 <div className="line row-content" >
                                 <span className="s1">XX商品</span>
                                 <span className="s2">XX品牌</span>
                                 <span className="s3">XX型号</span>
                                 </div>
                                 <div className="line row-content" >
                                 <span className="s1">XX商品</span>
                                 <span className="s2">XX品牌</span>
                                 <span className="s3">XX型号</span>
                                 </div>
                                 <div className="line row-content" >
                                 </div>
                                 <div className="line row-content" >
                                 </div>
                                 <div className="line row-content" >
                                 </div>
                                 <div className="line row-content" >
                                 </div>
                                 <div className="line row-content" >
                                 </div>
                                 </div>
                                 </Col>
                                 </Row>
                                 <Row className="row5">
                                 <Col span={24}>
                                 <span className="blue" onClick={()=>{this.props.layer2_input_show(true)}}>没有可选对象?</span>
                                 </Col>
                                 </Row>
                                 <Row className={"row6" + ( (this.props.market.listState.layer2_input_show)?' show':'') }>
                                 <Col span={24}>
                                 <Input placeholder="请输入货品名称, 多个货品用逗号隔开" className="input" />
                                 </Col>
                                 </Row>
                                 <Row className="row7">
                                 <Col span={24}>
                                 <Button
                                 className="btn-submit"
                                 onClick={()=>{
                                 this.props.layerShow2({
                                 isShow : false
                                 })
                                 }}
                                 >
                                 确定
                                 </Button>
                                 </Col>
                                 </Row>
                                 */}

                                <Row className="row1">
                                    <Col span={24} className="col1">选择货品</Col>
                                </Row>

                                <Row>

                                    <Transfer
                                        dataSource={this.state.mockData}
                                        listStyle={{
                                      width: 300,
                                      height: 500,
                                    }}
                                        searchPlaceholder={'货品关键字'}
                                        targetKeys={this.state.targetKeys}
                                        onChange={(targetKeys, direction, moveKeys)=>{
                                        //console.log(targetKeys, direction, moveKeys);
                                        this.setState({
                                            targetKeys : targetKeys ,
                                        });
                                    }}
                                        showSearch
                                        render={(item)=>{
                                        let customeLabel = (
                                            <span className="custom-item">
                                                {item.title} - {item.description}
                                            </span>
                                        ) ;
                                        return {
                                            label : customeLabel ,
                                            value : item.title ,
                                        }
                                    }}
                                    />

                                </Row>
                                <Auth
                                    authIndex="34"
                                >
                                    <Row>
                                        <Link className="no-object-to-select" to="/base/b_product?state=new">
                                            没有可选货品? 去新增!
                                        </Link>
                                    </Row>
                                </Auth>
                                <Row className="row7">
                                    <Col span={24}>
                                        <Button
                                            className="btn-submit"
                                            type="ghost"
                                            onClick={()=>{
                                            this.props.layerShow2({
                                                isShow : false
                                            }) ;
                                        }}
                                            style={{marginRight:'30px'}}
                                        >
                                            取消
                                        </Button>
                                        <Button
                                            className="btn-submit"
                                            onClick={this._evClick_selectProduct.bind(this)}
                                        >
                                            确定
                                        </Button>
                                    </Col>
                                </Row>

                            </div>
                        </Layer>


                        <Layer
                            addClass="marketDetail"
                            layerShow={this.props.market.listState.layerShow3}
                            _handleLayerHide={()=>{
                            this.props.layerShow3({
                                isShow : false ,
                                detail : {}
                            })
                        }}
                        >   {
                            detailsWaitShow.customer_forDetail &&
                            <div className="header">
                                <span className="header-east">
                                    
                                    <span
                                        className="nav-return-name"
                                        onClick={()=>{
                                            this.props.layerShow3({
                                                isShow : false ,
                                                detail : {}
                                            })
                                        }}
                                            >
                                        <i className="sprite-arrow3"></i>
                                        <span className="re-arrow">返回</span>
                                    </span>
                                    
                                    {/*<a
                                        className="left-irow"
                                        onClick={()=>{
                                            this.props.layerShow3({
                                                isShow : false ,
                                                detail : {}
                                            })
                                        }}
                                    >&lt;</a>*/}
                                    
                                    <Auth
                                        authIndex="5"
                                    >
                                        {
                                            detailsWaitShow.delFlag == 0 &&
                                            <Popconfirm
                                                title="确认撤销这条销售记录吗?"
                                                onConfirm={()=>{
                                                    service.market.deleteMarketList({
                                                        id : detailsWaitShow.id ,
                                                        salesOrderNo : detailsWaitShow.id_forShow_noPrefix ,
                                                    },(result)=>{
                                                        if ( result.mark == '000000000' ){
                                                            let params = {
                                                                init : {
                                                                    pageSize :10,
                                                                    pageNum : 1,
                                                                    startTime : this.state.filter.startDate ,
                                                                    endTime : this.state.filter.endDate ,
                                                                } ,
                                                                fetchCustomer : {
                                                                    pageSize :9999,
                                                                    pageNum : 1,
                                                                } ,
                                                                fetchMarketer : {
                                                                    pageSize :9999,
                                                                    pageNum : 1,
                                                                    //roleIds : [3]
                                                                }
                                                            }
                                                            //let token =  utils.cookie.config( TOKEN_NAME ) ;
                                                            if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
                                                                params.fetchMarketer.roleIds = [1,3] ;
                                                                params.init.tenantId = params.fetchCustomer.tenantId =params.fetchMarketer.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                                            } else {
                                                                params.fetchMarketer.roleIds = [3] ;
                                                                params.init.id = params.fetchCustomer.id = params.fetchMarketer.id = window.globalStore.getState().userstore.user.id ;
                                                            }
                                                            service.market.initMarketList(params,(error,data) => {
                                                                globalFunction.alert.info( '撤销销售记录成功' , '操作提示' ) ;
                                                                globalStore.dispatch(marketListInit(data)) ;
                                                            });
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
                                                <span
                                                    className="edit"
                                                >
                                                    <i></i>
                                                    <span>撤销</span>
                                                </span>
                                            </Popconfirm>
                                        }
                                    </Auth>
                                </span>
                                <span className="header-west">
                                    <div className="header-north">
                                        <span className="h3">{detailsWaitShow.customerName_forShow}</span>
                                    </div>
                                    <div className="header-south">
                                        <span className="h-span-2">
                                            <span className="span-third-in-one">
                                                <span className="h-label h-date">日期</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info">{detailsWaitShow.date}</span>
                                            </span>
                                            <span className="span-third-in-one">
                                                <span className="h-label h-id">编号</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info">{detailsWaitShow.id_forShow_noPrefix}</span>
                                            </span>
                                        </span>
                                        <span className="h-span">
                                            <span className="span-third-in-one">
                                                <span className="h-label h-contact">联系人</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info">{detailsWaitShow.customer_forDetail.contacter}</span>
                                            </span>
                                            <span className="span-third-in-one">
                                                <span className="h-label h-phone">联系电话</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info">{detailsWaitShow.customer_forDetail.phone}</span>
                                            </span>
                                            <span className="span-third-in-one">
                                                <span className="h-label h-remain">客户尚欠款</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info red">{detailsWaitShow.customer_forDetail.shouldPrice}</span>
                                            </span>
                                        </span>
                                    </div>
                                </span>
                            </div>
                        }
                            {detailsWaitShow.customer_forDetail &&
                            <div className="content-wrap">
                                {detailsWaitShow.delFlag == 1 && <i className="sprite-label_已撤销"></i>}
                                <div className="content">
                                    <Form horizontal className="form-static">
                                        <FormItem
                                            {...formItemLayout_static}
                                            label="销售金额"
                                        >
                                            <span>{detailsWaitShow.sellCount}</span>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout_static}
                                            label="结算方式"
                                        >
                                            <span>{detailsWaitShow.payType_forShow}</span>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout_static}
                                            label="实收款"
                                        >
                                            <span>{detailsWaitShow.truePrice}</span>
                                            <a className="view-detail">
                                                <span>查看明细</span>
                                                <i></i>
                                                <div className="detail-wrap">
                                                    {detailsWaitShow.accountDetails.map((v, i) => {
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
                                            <span className="red">{detailsWaitShow.shouldPrice}</span>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout_static}
                                            label="尾款到期日"
                                        >
                                            <span className="red">{detailsWaitShow.endDate}</span>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout_static}
                                            label="备注"
                                        >
                                            <span>{detailsWaitShow.tips||'无'}</span>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout_static}
                                            label="操作人"
                                        >
                                            <span>{detailsWaitShow.operator}</span>
                                        </FormItem>
                                    </Form>
                                    <div className="customer-form-image">
                                        <img src={detailsWaitShow.img} alt="" />
                                    </div>
                                    <div className="productlist-wrap">
                                        {/*<div className="productlist">
                                         <Row>
                                         <Col span={4}>
                                         <span className="title">货品清单</span>
                                         </Col>
                                         </Row>
                                         <Row>
                                         <Col span={24} offset={0}>
                                         <Table dataSource={this.props.market.list.productDataSource} columns={this.props.COLUMNS_PRODUCT1}></Table>
                                         </Col>
                                         </Row>
                                         <Row>
                                         <Col span={24} offset={0}>
                                         <span className="staticCount">合计</span>
                                         </Col>
                                         </Row>
                                         </div>*/}
                                        <div className="productlist">
                                            <Row>
                                                <Col span={4}>
                                                    <span className="title">货品清单</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24} offset={0}>

                                                    <Table
                                                        dataSource={detailsWaitShow.product}
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
                                                        <span className="sta-value red">{detailsWaitShow.productNum}</span>
                                                    </div>
                                                    <div className="sta-line">
                                                        <span className="sta-lable">合计&nbsp;:</span>
                                                        <span className="sta-value red">{this._countForShow.call(this,'discountAmount')}</span>
                                                    </div>
                                                    {/*<span className="staticCount-title">合计&nbsp;</span>
                                                    <span style={{color:'#aaa'}}>&nbsp;数量&nbsp;:&nbsp;</span>
                                                    <span className="red" style={{paddingLeft:'5px',paddingRight:'5px'}}>{detailsWaitShow.productNum}</span>
                                                    <span style={{color:'#aaa'}}>&nbsp;销售金额&nbsp;:&nbsp;</span>
                                                    <span className="red" style={{paddingLeft:'5px',paddingRight:'5px'}}>{this._countForShow.call(this,'discountAmount')}元</span>*/}
                                                </span>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }
                        </Layer>

                        <Modal className="market-modal1" title="结款" visible={this.props.market.listState.modalShow1}
                               onOk={()=>{this.props.modalShow1(false,{})}} onCancel={()=>{this.props.modalShow1(false,{})}}
                        >
                            <div className="modal-content">
                                <Form horizontal className="form-static">
                                    <FormItem
                                        {...formItemLayout_modal}
                                        label="对方"
                                    >
                                        <Input placeholder="上海西域机电" />
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout_modal}
                                        label="收入类型"
                                    >
                                        <Input placeholder="应收款" />
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout_modal}
                                        label="结算方式"
                                    >
                                        <Select defaultValue="all" onChange={(value)=>{this.state.filter.payType = value}}>
                                            <Option value="all" title="全部结算方式">全部结算方式</Option>
                                            {
                                                this.props.market.list.payType.data.map((v,i)=>{
                                                    return <Option title={v.name} value={v.value+''} key={v.value}>{v.name}</Option>
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout_modal}
                                        label="实收款"
                                    >
                                        <Input placeholder="$1000.00" />
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout_modal}
                                        label="业务日期"
                                    >
                                        <DatePicker size="large" key="for" defaultValue={this.state.filter.startDate} format="yyyy-MM-dd"></DatePicker>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout_modal}
                                        label="备注"
                                    >
                                        <Input placeholder="" />
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout_modal_submit}
                                    >
                                        <Button type="primary" className="save-submit" htmlType="submit">保存</Button>
                                    </FormItem>
                                </Form>
                            </div>
                        </Modal>

                    </QueueAnim>
                </div>
            </div>

        )
    }
    _count(attr){
        var ret = 0 ;
        this.state.newModel.product.forEach((v)=>{
            var _ret = new BigNumber( ret ) ;
            //ret = parseInt( _ret.plus( new BigNumber( v[ attr ] ) ) ) - 0 ;
            ret = _ret.plus( new BigNumber( v[ attr ] ) ) - 0 ;
        }) ;
        return isNaN( ret )?0:ret ;
    }
    _countForShow(attr){
        var ret = 0 ;
        var details = this.props.market.list.detail.salesOrderDto || {} ;
        details.product && details.product.forEach((v)=>{
            var _ret = new BigNumber( ret );
            var amount = ( v[ attr ] && new BigNumber( v[ attr ] ) ) || 0 ;
            ret = _ret.plus( amount ) - 0 ;
        }) ;
        return isNaN( ret )?0:ret ;
    }
    __findDetails(id){
        let result = {} ;
        this.props.market.list.dataSource.data.forEach((v)=>{
            if ( v.id === id ){
                result = v
            }
        }) ;
        return result ;
    }
    __multiplyAll(arg1,arg2,arg3){
        var result = null ;
        try {
            var _result = 0 ;
            //arguments = Array.prototype.silce.call(arguments);
            // arguments.forEach(function(v,i){
            //     v = new BigNumber( v ) ;
            // });
            arg1 = new BigNumber(arg1); //数量
            arg2 = new BigNumber(arg2); //单价
            arg3 = new BigNumber(arg3); //折扣
            _result = arg1.times(arg2).times(arg3);
            result = _result - 0 ;
        } catch (e){
            console.warn( '销售金额计算错误' ) ;
        }
        if ( result === null ){
            return 0 ;
        } else {
            return result ;
        }
    }
}

List.defaultProps = {

    COLUMNS : COLUMNS ,

    COLUMNS_PRODUCT : COLUMNS_PRODUCT ,
    COLUMNS_PRODUCT_FORSHOW : COLUMNS_PRODUCT_FORSHOW ,


} ;




 //<Filter innerComponent={ {　...filter　} }></Filter>
export default connect((state)=>{

    var market = state.market ;
    return {
        market ,
    } ;
},{
    layerShow1 ,
    layerShow2 ,
    layerShow3 ,
    layer2_input_show ,
    marketListInit ,
    marketListTable ,
    modalShow1 ,
})(List) ;