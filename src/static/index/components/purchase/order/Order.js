import React from 'react' ;
import { Link, browserHistory } from 'react-router'
import {
    connect ,
    dispatch
} from 'react-redux' ;
import moment from 'moment' ;
import QueueAnim from 'rc-queue-anim' ;
import BigNumber from 'bignumber.js' ;
import {
    purchaseOrderInit, purchaseOrderTable,
    layerShow1, layerShow2, modalShow1, layerShow3, modalShow2 ,
    layer2_input_show
} from '../../../actions/purchase'
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
        title: '供应商',
        dataIndex : 'supplierName_forShow' ,
        key : 'supplierName_forShow' ,
    }, {
        title: '编号',
        dataIndex : 'id_forShow_noPrefix'　,
        key : 'id_forShow_noPrefix' ,
    },{
        title: '货品数量',
        dataIndex: 'productNum',
        key: 'productNum',
        sorter: (a, b) => a.productNum - b.productNum ,
    },{
        title: '采购金额',
        dataIndex: 'purchaseCount',
        key: 'purchaseCount',
        sorter: (a, b) => a.purchaseCount - b.purchaseCount ,
    },
    /*{
     title: '结算方式',
     dataIndex : 'payType_forShow' ,
     key : 'payType_forShow' ,
     sorter: (a, b) => a.payType - b.payType ,
     },*/
    {
        title: '实付款',
        dataIndex: 'truePrice',
        key: 'truePrice',
        sorter: (a, b) => a.truePrice - b.truePrice ,
    },{
        title: '应付款',
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
            return (
                <span>
                <Auth
                    authIndex="10"
                >
                    <i
                        title="查看"
                        className="sprite-view dib-table-icon"
                        onClick={(event)=>{
                            service.purchase.fetchPurchaseDeatil({
                                id : value.id
                            },(result)=>{
                                if ( result.mark == '000000000' ){
                                    service.base.fetchBaseSupplierDetail({
                                        id : result.data.purchaseOrderDto.supplier ,
                                    },function(error,result2){
                                        result.data.purchaseOrderDto.supplier_forDetail = result2.data ;
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
                    authIndex="14"
                >
                    {
                        value.delFlag == '0' &&
                        <Popconfirm
                            title="确认撤销这条采购记录吗?"
                            onConfirm={()=>{
                                var orderPoint = window.orderPoint ;
                                //console.log(value.id_forShow_noPrefix);
                                service.purchase.deletePurchaseList({
                                    id : value.id ,
                                    purchaseOrderNo : value.id_forShow_noPrefix ,
                                },(result)=>{
                                    if ( result.mark == '000000000' ){
                                       
                                        let params = {
                                            init : {
                                                pageSize :10,
                                                pageNum : 1,
                                                startTime : orderPoint.state.filter.startDate ,
                                                endTime : orderPoint.state.filter.endDate ,
                                                //startTime : filter.startDate ,
                                                //endTime : filter.endDate ,
                                            } ,
                                            fetchSupplier : {
                                                pageSize :9999,
                                                pageNum : 1,
                                            } ,
                                            fetchPurchase : {
                                                pageSize :9999,
                                                pageNum : 1,
                                                //roleIds : [4]
                                            }
                                        }
                                        //let token =  utils.cookie.config( TOKEN_NAME ) ;
                                        if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
                                            params.fetchPurchase.roleIds = [1,4] ;
                                            params.init.tenantId = params.fetchSupplier.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                        } else {
                                            params.fetchPurchase.roleIds = [4] ;
                                            params.init.id = params.fetchSupplier.id = params.fetchPurchase.id = window.globalStore.getState().userstore.user.id ;
                                        }
                                        service.purchase.initPurchaseOrder(params,(error,data) => {
                                            globalFunction.alert.info( '撤销采购记录成功' , '操作提示' ) ;
                                            globalStore.dispatch(purchaseOrderInit(data)) ;
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
                       onClick={(event)=>{

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
                        globalEvent.purchase.onChange_modelProduct.dispatch({
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
                        globalEvent.purchase.onChange_modelProduct.dispatch({
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
                        globalEvent.purchase.onChange_modelProduct.dispatch({
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
        title : '采购金额' ,
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
                        globalEvent.purchase.onChange_modelProduct.dispatch({
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
     dataIndex : 'arrivalStateName_forShow' ,
     key : 'arrivalStateName_forShow' ,
     render:　(text,value)　=>　{
     return　(
     <a
     onClick={(event)=>{
     globalEvent.purchase.onChange_modelProduct.dispatch({
     id : value.itemId ,
     attr : 'arrivalState' ,
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
                    <a
                        style={{color:'#aaa'}}
                        onClick={()=>{
                            globalEvent.purchase.onChange_modelProduct.dispatch({
                                id : value.itemId ,
                                attr : 'quantity' ,
                                operation : 'delete' ,
                            }) ;
                        }}
                    >删除</a>
                </span>
            )
        }
    },
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
    //     dataIndex : 'arrivalState' ,
    //     key : 'arrivalState' ,
    // }
] ;

/*Order主页面,需要初始化*/


class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shadeShow : 'none' ,
            pageSize : 10 ,
            currentPage : 1 ,
            filter : {
                supplier : 'default-all' ,
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
                payableState : false ,
                nextPayableState : false ,
            },
            newModel : {
                date : moment().format('YYYY-MM-DD') ,
                supplierId : '' ,
                purchasePrice : 0.00 ,
                payType : '1' ,
                truePrice : 0.00 ,
                endPriceDate : moment().format('YYYY-MM-DD') ,
                imgurl : '' ,
                tips : '' ,
                product : [

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
                                    //v.quantity = Math.floor( data.data - 0 ) ;
                                    v.quantity = data.data ;
                                    v.discountAmount = this.__multiplyAll(v.quantity,v.unitPrice,v.discount/100);
                                } else if ( data.operation === 'delete' ){
                                    isDeleteOneProduct = v.itemId ;
                                }
                                break ;
                            case 'unitPrice' :
                                if ( data.operation === 'change' ){
                                    //v.unitPrice = Math.floor( data.data - 0 ) ;
                                    v.unitPrice = data.data ;
                                    v.discountAmount = this.__multiplyAll(v.quantity,v.unitPrice,v.discount/100);
                                }
                                break ;
                            case 'discount' :
                                if ( data.operation === 'change' ){
                                    //v.discount = Math.floor( data.data - 0 ) ;
                                    v.discount = data.data
                                    v.discountAmount = this.__multiplyAll(v.quantity,v.unitPrice,v.discount/100);
                                }
                                break ;
                            case 'discountAmount' :
                                if ( data.operation === 'change' ){
                                    //v.discountAmount = Math.floor( data.data - 0 ) ;
                                    //v.discountAmount = data.data ;
                                }
                                break ;
                            case 'arrivalState' :
                                if ( data.operation === 'reversal' ){
                                    if ( v.arrivalState == '0' ){
                                        v.arrivalState = '1' ;
                                        v.arrivalStateName_forShow = '已发货' ;
                                    } else if ( v.arrivalState == '1' ){
                                        v.arrivalState = '0' ;
                                        v.arrivalStateName_forShow = '未发货' ;
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
            } ,
        };
    }
    //init for market
    componentDidMount(){
        window.orderPoint = this ;
        let params = {
            init : {
                pageSize :10,
                pageNum : 1,
                startTime : this.state.filter.startDate ,
                endTime : this.state.filter.endDate ,
            } ,
            fetchSupplier : {
                pageSize :9999,
                pageNum : 1,
            } ,
            fetchPurchase : {
                pageSize :9999,
                pageNum : 1,
                //roleIds : [4]
            }
        }
        //let token =  utils.cookie.config( TOKEN_NAME ) ;
        if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
            params.fetchPurchase.roleIds = [1,4] ;
            params.init.tenantId = params.fetchSupplier.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.fetchPurchase.roleIds = [4] ;
            params.init.id = params.fetchSupplier.id = params.fetchPurchase.id = window.globalStore.getState().userstore.user.id ;
        }
        service.purchase.initPurchaseOrder(params,(error,data) => {
            this.props.purchaseOrderInit(data) ;
            //货品穿梭框 全部货品数据
            service.purchase.fetchPurchaseProduct({
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
                }) ;
                this.queryParamsInit( this.props.location.query ) ;
            }) ;
        });

        //global event init
        globalEvent.purchase.onChange_modelProduct = new signals.Signal() ;
        globalEvent.purchase.onChange_modelProduct.add(this.state.onChange_modelProduct) ;
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
                    supplierId : '' ,
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
        globalEvent.purchase.onChange_modelProduct.remove(this.state.onChange_modelProduct) ;
    }
    _ev_filterSearch(event){
        let params = {
            init : {
                purchaseOrderNoSelect : this.state.filter.id , //不包括前面XSD的号
                supplierId : this.state.filter.supplier === 'default-all' ? '' : this.state.filter.supplier  ,
                //settlementWay : this.state.filter.payType === 'default-all' ? '' :  this.state.filter.payType  , //结算方式
                pageSize : 10 ,
                pageNum : 1 ,
                startTime : this.state.filter.startDate , //开始日期
                endTime : this.state.filter.endDate ,
                delFlag : this.state.filter.recodeType === 'default-all' ? '' : this.state.filter.recodeType , //记录状态 0 未撤销 1 已撤销 null全部
                startAmount : this.state.filter.startMoney == '' ? '' : this.state.filter.startMoney - 0 , //
                endAmount : this.state.filter.endMoney == '' ? '' : this.state.filter.endMoney - 0 , //
                userId : this.state.filter.userId === 'default-all' ? '' : this.state.filter.userId,
                payableState :this.state.filter.payableState === false ? '' : 1 ,
                nextPayableState : this.state.filter.nextPayableState === false ? '' : 1 ,
            } ,
            fetchSupplier : {
                pageSize :9999,
                pageNum : 1,
            } ,
            fetchPurchase : {
                pageSize :9999,
                pageNum : 1,
                //roleIds : [4]
            }
        }
        //let token =  utils.cookie.config( TOKEN_NAME ) ;
        if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
            params.fetchPurchase.roleIds = [1,4] ;
            params.init.tenantId = params.fetchSupplier.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.fetchPurchase.roleIds = [4] ;
            params.init.id = params.fetchSupplier.id = params.fetchPurchase.id = window.globalStore.getState().userstore.user.id ;
        }
        service.purchase.fetchPurchaseOrder(params.init ,(error,data)=>{
            this.props.purchaseOrderTable(data) ;
            this.setState({
               currentPage : 1
            });
        }) ;


    }
    //operation button
    _evClick_addPurchase(callbackForOpenAgain){
        if ( !this.state.newModel.supplierId ){
            globalFunction.alert.warning( '请选择一个供应商~' , '数据提示' ) ;
            return ;
        }else if( this.state.newModel.truePrice > this.state.newModel.purchasePrice){
            globalFunction.alert.warning( '实付款不能大于采购金额~' , '数据提示' ) ;
            return ;
        }
        this.setState({
            shadeShow : 'block'
        },()=> {
            service.purchase.addPurchase({
                supplierId : this.state.newModel.supplierId ,
                amount : this.state.newModel.purchasePrice - 0 ,
                userId : window.globalStore.getState().userstore.user.id ,
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                paid : this.state.newModel.truePrice - 0 ,
                businessTime : this.state.newModel.date ,
                settlementWay : this.state.newModel.payType ,
                comment : this.state.newModel.tips ,
                imgUrl : this.state.newModel.imgurl ,
                deadLine : this.state.newModel.endPriceDate ,
                // arrivalState : '' ,
                purchaseOrderDetailDtos : this.state.newModel.product.map((v)=>{
                    return {
                        arrivalState : v.arrivalState - 0 ,
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
                        fetchSupplier : {
                            pageSize :9999,
                            pageNum : 1,
                        } ,
                        fetchPurchase : {
                            pageSize :9999,
                            pageNum : 1,
                            //roleIds : [4]
                        }
                    }
                    //let token =  utils.cookie.config( TOKEN_NAME ) ;
                    if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
                        params.fetchPurchase.roleIds = [1,4] ;
                        params.init.tenantId = params.fetchSupplier.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                    } else {
                        params.fetchPurchase.roleIds = [4] ;
                        params.init.id = params.fetchSupplier.id = params.fetchPurchase.id = window.globalStore.getState().userstore.user.id ;
                    }
                    service.purchase.initPurchaseOrder(params,(error,data) => {
                        var self = this ;
                        globalFunction.alert.info( '新增采购记录成功' , '操作提示' ) ;
                        this.props.purchaseOrderInit(data) ;
                        setTimeout(function(){
                            self.setState({
                                shadeShow : 'none' ,
                                filter : {
                                    supplier : 'default-all' ,
                                    id : '' ,
                                    startMoney : '' ,
                                    endMoney : '' ,
                                    payType : 'default-all' ,
                                    recodeType : 'default-all' ,
                                    userId : 'default-all' ,
                                    items : '' ,
                                    startDate : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                                    endDate : moment().format('YYYY-MM-DD') ,
                                    payableState : false ,
                                    nextPayableState : false ,
                                    // tips : ''
                                }
                            }) ;
                        },0);   //因为退出动画时间为0.8s
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
    _evClick_addPurchaseAndAgain(event){
        if ( !this.state.newModel.supplierId ){
            globalFunction.alert.warning( '请选择一个供应商~' , '数据提示' ) ;
            return ;
        }
        this._evClick_addPurchase(()=>{
            this.props.layerShow1({
                isShow : true ,
            }) ;
            this.setState({
                ...this.state ,
                newModel : {
                    date : moment().format('YYYY-MM-DD') ,
                    supplierId : '' ,
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
                        arrivalState : '0' ,

                        itemName_forShow : mock.itemName ,
                        unitName_forShow : mock.unitName ,
                        arrivalStateName_forShow : '未发货' ,
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
        var modelProduct = this.state.newModel.product ;
        var tranRight = modelProduct.map((v)=>{
            return v.itemId ;
        }) ;
        this.setState({
            targetKeys : tranRight ,
        }) ;
    }
    //勾选filter里的checkbox触发查询
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
    render (){
        //details
        let detailsWaitShow = this.props.purchase.order.detail.purchaseOrderDto || {} ;
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
                    <a className="active">采购记录</a>
                    <span className="operation">
                        <Auth
                            authIndex="11"
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
                                            supplierId : '' ,
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
                            authIndex="12"
                        >
                            <Button style={{display:'none'}} type="primary" icon="export">导出</Button>
                        </Auth>
                    </span>
                </div>
                <div className="center-east-center">

                    <QueueAnim>

                        <div className="filter-wrap" key="anime-1">
                        <span className="filter">
                            <span className="filter-label">供应商</span>
                            <span className="filter-component">
                                <Select
                                    showSearch
                                    style={{width:150}}
                                    placeholder="选择供应商"
                                    notFoundContent=""
                                    optionFilterProp="children"
                                    value={this.state.filter.supplier+''}
                                    onChange={(value)=>{
                                        this.setState({
                                            filter : {
                                                ...this.state.filter ,
                                                supplier : value+'' ,
                                            }
                                        }) ;
                                    }}
                                >
                                    <Option value="default-all" title="全部供应商">全部供应商</Option>
                                    {
                                        this.props.purchase.order.supplier.data.map((v,i)=>{
                                            return <Option title={v.name} value={v.value+''} key={v.value}>{v.name}</Option>
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
                            <span className="filter-label">采购金额</span>
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
                                        this.props.purchase.order.payType.data.map((v,i)=>{
                                            return <Option title={v.name} value={v.value+''} key={v.value}>{v.name}</Option>
                                        })
                                    }
                                </Select>
                            </span>
                        </span>*/}
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
                                                    userIdInTab : values.label ,
                                                }
                                            })
                                        }
                                    }
                                >
                                    <Option value="default-all" title="全部">全部</Option>
                                    {
                                        this.props.purchase.order.purchaser.data.map((v,i)=>{
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
                                        this.props.purchase.order.recodeType.data.map((v,i)=>{
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
                                    checked={this.state.filter.payableState}
                                    onChange={this._ev_payableState_filterSearch.bind(this)}
                                >
                                    应付款不为0
                                </Checkbox>
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
                        <span className="searc-btn">
                            <Button type="default" icon="search" onClick={this._ev_filterSearch.bind(this)}>查询</Button>
                        </span>
                        </div>

                        <div className="tabel-wrap" key="anime-3">
                            <Table
                                dataSource={this.props.purchase.order.dataSource.data}
                                columns={this.props.COLUMNS }
                                pagination={{
                                showSizeChanger : true ,

                                total : this.props.purchase.order.totalCount ,

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
                                                purchaseOrderNoSelect : this.state.filter.id , //不包括前面XSD的号
                                                supplierId : this.state.filter.supplier === 'default-all' ? '' : this.state.filter.supplier  ,
                                                //settlementWay : this.state.filter.payType === 'default-all' ? '' :  this.state.filter.payType  , //结算方式
                                                pageSize :self.state.pageSize,
                                                pageNum : 1 ,
                                                startTime : this.state.filter.startDate , //开始日期
                                                endTime : this.state.filter.endDate ,
                                                delFlag : this.state.filter.recodeType === 'default-all' ? '' : this.state.filter.recodeType , //记录状态 0 未撤销 1 已撤销 null全部
                                                startAmount : this.state.filter.startMoney == '' ? '' : this.state.filter.startMoney - 0 , //
                                                endAmount : this.state.filter.endMoney == '' ? '' : this.state.filter.endMoney - 0 , //
                                                userId : this.state.filter.userId === 'default-all' ? '' : this.state.filter.userId,
                                                payableState :this.state.filter.payableState === false ? '' : 1 ,
                                                nextPayableState : this.state.filter.nextPayableState === false ? '' : 1 ,
                                            } ,
                                            fetchSupplier : {
                                                pageSize :9999,
                                                pageNum : 1,
                                            } ,
                                            fetchPurchase : {
                                                pageSize :9999,
                                                pageNum : 1,
                                                //roleIds : [4]
                                            }
                                        }
                                        //let token =  utils.cookie.config( TOKEN_NAME ) ;
                                        if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
                                            params.fetchPurchase.roleIds = [1,4] ;
                                            params.init.tenantId = params.fetchSupplier.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                        } else {
                                            params.fetchPurchase.roleIds = [4] ;
                                            params.init.id = params.fetchSupplier.id = params.fetchPurchase.id = window.globalStore.getState().userstore.user.id ;
                                        }
                                        service.purchase.initPurchaseOrder(params,(error,data)=>{
                                            self.props.purchaseOrderInit(data) ;
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
                                            purchaseOrderNoSelect : this.state.filter.id , //不包括前面XSD的号
                                            supplierId : this.state.filter.supplier === 'default-all' ? '' : this.state.filter.supplier  ,
                                            //settlementWay : this.state.filter.payType === 'default-all' ? '' :  this.state.filter.payType  , //结算方式
                                            pageSize :self.state.pageSize,
                                            pageNum : value,
                                            startTime : this.state.filter.startDate , //开始日期
                                            endTime : this.state.filter.endDate ,
                                            delFlag : this.state.filter.recodeType === 'default-all' ? '' : this.state.filter.recodeType , //记录状态 0 未撤销 1 已撤销 null全部
                                            startAmount : this.state.filter.startMoney == '' ? '' : this.state.filter.startMoney - 0 , //
                                            endAmount : this.state.filter.endMoney == '' ? '' : this.state.filter.endMoney - 0 , //
                                            userId : this.state.filter.userId === 'default-all' ? '' : this.state.filter.userId,
                                            payableState :this.state.filter.payableState === false ? '' : 1 ,
                                            nextPayableState : this.state.filter.nextPayableState === false ? '' : 1 ,
                                        } ,
                                        fetchSupplier : {
                                            pageSize :9999,
                                            pageNum : 1,
                                        } ,
                                        fetchPurchase : {
                                            pageSize :9999,
                                            pageNum : 1,
                                            //roleIds : [4]
                                        }
                                    }
                                    //let token =  utils.cookie.config( TOKEN_NAME ) ;
                                    if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
                                        params.fetchPurchase.roleIds = [1,4] ;
                                        params.init.tenantId = params.fetchSupplier.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                    } else {
                                        params.fetchPurchase.roleIds = [4] ;
                                        params.init.id = params.fetchSupplier.id = params.fetchPurchase.id = window.globalStore.getState().userstore.user.id ;
                                    }
                                    service.purchase.initPurchaseOrder(params,(error,data)=>{
                                        self.props.purchaseOrderInit(data) ;
                                    });
                                }
                            }}
                            ></Table>
                        </div>

                        {/*<div className="pagenation-wrap">
                         <Pagination className="page" defaultCurrent={1} total={50} />
                         </div>*/}

                        <Layer layerShow={this.props.purchase.orderState.layerShow1} _handleLayerHide={()=>{this.props.layerShow1({isShow:false})}}>
                            <div className="header">
                                {/*<span className="header-title">新建采购记录</span>*/}
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
                                        onClick={this._evClick_addPurchaseAndAgain.bind(this)}
                                    >
                                        <span>保存并新增</span>
                                    </span>
                                    <span
                                        className="operation save"
                                        onClick={this._evClick_addPurchase.bind(this)}
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
                                    新建采购记录
                                </div>
                                <div className="content">
                                    <Form horizontal onSubmit={this.handleFormSubmit}>
                                        <FormItem
                                            {...formItemLayout}
                                            label={<span><span className="red-mark">*</span>供应商名称</span>}
                                        >
                                            <Select
                                                showSearch
                                                placeholder="请选择一个供应商"
                                                optionFilterProp="children"
                                                value={this.state.newModel.supplierId+''}
                                                notFoundContent=""
                                                onChange={(value)=>{
                                                this.setState({
                                                    newModel : {
                                                        ...this.state.newModel ,
                                                        supplierId : value+''
                                                    }
                                                }) ;
                                            }}
                                            >
                                                {
                                                    this.props.purchase.order.supplier.data.map((v,i)=>{
                                                        return <Option title={v.name} value={v.value+''} key={v.value}>{v.name}</Option>
                                                    })
                                                }
                                            </Select>
                                            <Link className="new" to="/base/b_supplier?state=new">
                                                <i></i>
                                                <span>新增</span>
                                            </Link>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout}
                                            label={<span><span className="red-mark">*</span>采购金额</span>}
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
                                                var purchasePrice_validation = service.validation.purchase.form_purchase.purchasePrice(value) ;
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
                                            label={<span><span className="red-mark">*</span>实付款</span>}
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
                                                var truePrice_validation = service.validation.purchase.form_purchase.truePrice(value) ;
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
                                                    this.props.purchase.order.payType.data.map((v,i)=>{
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
                                                action="/api/upload-file-SAPORE011"
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
                                                var tips_validation = service.validation.purchase.form_purchase.tips(event.target.value) ;
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
                                                    <span style={{color:'#aaa'}}>&nbsp;采购金额&nbsp;:&nbsp;</span>
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
                            layerShow={this.props.purchase.orderState.layerShow2}
                            _handleLayerHide={()=>{
                            this.props.layerShow2({isShow:false})
                        }}
                        >
                            <div className="transpant-wrap">
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
                                        console.log(targetKeys, direction, moveKeys);
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
                                        <a className="no-object-to-select" href="/base/b_product?state=new">
                                            没有可选货品? 去新增!
                                        </a>
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
                            layerShow={this.props.purchase.orderState.layerShow3}
                            _handleLayerHide={()=>{
                            this.props.layerShow3({
                                isShow : false ,
                                detail : {}
                            })
                        }}
                        >
                            { detailsWaitShow.supplier_forDetail &&
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
                                        authIndex="14"
                                    >
                                        {
                                            detailsWaitShow.delFlag == 0 &&
                                            <Popconfirm
                                                title="确认撤销这条采购记录吗?"
                                                onConfirm={()=>{
                                                    service.purchase.deletePurchaseList({
                                                        id : detailsWaitShow.id ,
                                                        purchaseOrderNo : detailsWaitShow.id_forShow_noPrefix ,
                                                    },(result)=>{
                                                        if ( result.mark == '000000000' ){
                                                            let params = {
                                                                init : {
                                                                    pageSize :10,
                                                                    pageNum : 1,
                                                                    startTime : this.state.filter.startDate ,
                                                                    endTime : this.state.filter.endDate ,
                                                                } ,
                                                                fetchSupplier : {
                                                                    pageSize :9999,
                                                                    pageNum : 1,
                                                                } ,
                                                                fetchPurchase : {
                                                                    pageSize :9999,
                                                                    pageNum : 1,
                                                                    roleIds : [4]
                                                                }
                                                            }
                                                            //let token =  utils.cookie.config( TOKEN_NAME ) ;
                                                            if ( window.globalStore.getState().userstore.user.roleIds[ 0 ] == 1 ){
                                                                params.init.tenantId = params.fetchSupplier.tenantId = params.fetchPurchase.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                                                            } else {
                                                                params.init.id = params.fetchSupplier.id = params.fetchPurchase.id = window.globalStore.getState().userstore.user.id ;
                                                            }
                                                            service.purchase.initPurchaseOrder(params,(error,data) => {
                                                                globalFunction.alert.info( '撤销采购记录成功' , '操作提示' ) ;
                                                                globalStore.dispatch(purchaseOrderInit(data)) ;
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
                                        <span className="h3">{detailsWaitShow.supplierName_forShow}</span>
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
                                                <span className="h-info">{detailsWaitShow.supplier_forDetail.contacter}</span>
                                            </span>
                                            <span className="span-third-in-one">
                                                <span className="h-label h-phone">联系电话</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info">{detailsWaitShow.supplier_forDetail.phone}</span>
                                            </span>
                                            <span className="span-third-in-one">
                                                <span className="h-label h-remain">客户尚欠款</span>
                                                <span className="h-dot">:</span>
                                                <span className="h-info red">{detailsWaitShow.supplier_forDetail.shouldPrice}</span>
                                            </span>
                                        </span>
                                    </div>
                                </span>
                            </div>
                            }
                            { detailsWaitShow.supplier_forDetail &&
                            <div className="content-wrap">
                                {detailsWaitShow.delFlag == 1 && <i className="sprite-label_已撤销"></i>}
                                <div className="content">
                                    <Form horizontal className="form-static">
                                        <FormItem
                                            {...formItemLayout_static}
                                            label="采购金额"
                                        >
                                            <span>{detailsWaitShow.purchaseCount}</span>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout_static}
                                            label="结算方式"
                                        >
                                            <span>{detailsWaitShow.payType_forShow}</span>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout_static}
                                            label="实付款"
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
                                                                    <span>采购支出:</span>
                                                                    <span className="span-v">￥{v.money}</span>
                                                                    <span>结算方式:</span>
                                                                    <span className="span-v">{v.settlementWay}</span>
                                                                    <span>操作人:</span>
                                                                    <span className="span-v">{v.userName}</span>
                                                                </span>
                                                            </div>
                                                        )

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
                                        {/*<FormItem
                                            {...formItemLayout_static}
                                            label="图片"
                                        >
                                            <div>
                                                <img src={detailsWaitShow.img} style={{width:'100px',height:'100px'}} alt="" />
                                            </div>
                                        </FormItem>*/}
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
                                                    <span style={{color:'#aaa'}}>&nbsp;采购金额&nbsp;:&nbsp;</span>
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

                        <Modal className="market-modal1" title="结款" visible={this.props.purchase.orderState.modalShow1}
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
                                                this.props.purchase.order.payType.data.map((v,i)=>{
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
        var details = this.props.purchase.order.detail.purchaseOrderDto || {} ;
        details.product && details.product.forEach((v)=>{
            var _ret = new BigNumber( ret );
            var amount = ( v[ attr ] && new BigNumber( v[ attr ] ) ) || 0 ;
            ret = _ret.plus( amount ) - 0 ;
        }) ;
        return isNaN( ret )?0:ret ;
    }
    __multiplyAll(arg1,arg2,arg3){
        var result = null ;
        try {
            var _result = 0 ;
            // arguments.forEach(function(v,i){
            //     v = new BigNumber( v ) ;
            // });
            arg1 = new BigNumber(arg1); //数量
            arg2 = new BigNumber(arg2); //单价
            arg3 = new BigNumber(arg3); //折扣
            _result = arg1.times(arg2).times(arg3);
            result = _result - 0 ;
        } catch (e){
            console.warn( '采购金额计算错误' ) ;
        }
        if ( result === null ){
            return 0 ;
        } else {
            return result ;
        }
    }
}

Order.defaultProps = {

    COLUMNS : COLUMNS ,

    COLUMNS_PRODUCT : COLUMNS_PRODUCT ,

    COLUMNS_PRODUCT_FORSHOW : COLUMNS_PRODUCT_FORSHOW ,


} ;





// <Filter innerComponent={ {　...filter　} }></Filter>
export default connect((state)=>{

    var purchase = state.purchase ;

    return {
        purchase
    } ;
},{
    layerShow1 ,
    layerShow2 ,
    layerShow3 ,
    layer2_input_show ,
    purchaseOrderInit ,
    purchaseOrderTable ,
    modalShow1 ,
})(Order) ;