import React from 'react'
import { connect , dispatch } from 'react-redux'
import { push } from 'react-router-redux'
import moment from 'moment'
import QueueAnim from 'rc-queue-anim'
import className from 'classnames'
import cx from 'classnames'
import {
    Button , Pagination , Select , Input , DatePicker , Table , Form , Modal ,
    Upload , Radio , Progress , InputNumber ,
    Row , Col ,
    Icon ,Steps , Popconfirm
} from 'antd/dist/antd.js'
const Option = Select.Option;
const FormItem = Form.Item ;
const Step = Steps.Step;
const RadioGroup = Radio.Group ;
const RadioButton = Radio.Button ;
import * as service from '../../../service'
import {
    baseProductInit , baseProductTable ,
    baseProductCategoryFilter , baseProductBrandFilter , baseProductUnitFilter ,
    modalShow1 , layerShow1 , modalShow3_product ,cancelImport_product ,startImport_product
} from '../../../actions/base.js'
import {
    Detail , Layer , Auth ,
} from '../../index'
import {
    FILE_IMAGE_ACCEPT ,
    FILE_EXCEL_ACCEPT ,
} from '../../../constants/index'

//SACSTM
//列表 006 OK
//新建 /save 003  OK
//导入 009 OK
//通过id查询详情 002 OK
//编辑指定id 004
//删除制定id 005
//保存商品 SAITEM004
//上传图片 SAITEM007

const COLUMNS = [
//     {
//     title : '序号' ,
//     dataIndex : 'id' ,
//     key : 'id'
// },
    {
    title : '货品名称' ,
    dataIndex : 'product' ,
    key : 'product'
},{
    title : '类别' ,
    // dataIndex : 'category' ,
    // key : 'category' ,
    dataIndex : 'categoryName_forShow' ,
    key : 'categoryName_forShow'
},{
    title : '品牌' ,
    // dataIndex : 'brand' ,
    // key : 'brand'
    dataIndex : 'brandName_forShow' ,
    key : 'brandName_forShow'
},{
    title : '规格型号' ,
    dataIndex : 'specification' ,
    key : 'specification'
},{
    title : '单位' ,
    dataIndex : 'unitName_forShow' ,
    key : 'unitName_forShow'
},{
    title : '现有数量' ,
    dataIndex : 'number' ,
    key : 'number'
},{
    title : '库存成本' ,
    dataIndex : 'inventoryCost' ,
    key : 'inventoryCost'
},{
    title : '操作' ,
    dataIndex : 'operation' ,
    key : 'operation' ,
    render : (text,value) => {
        return (
            <span>
                <Auth
                    authIndex="36"
                >
                    <i
                        title="查看"
                        className="sprite-view dib-table-icon"
                        value={value.id}
                        onClick={(event)=>{
                            service.base.fetchBaseProductDetail({
                                itemId : value.itemId
                            },(error,result) => {
                                if ( !error ){

                                    globalStore.dispatch(layerShow1({
                                        isShow : true ,
                                        // id:value.id ,
                                        value:result.data
                                    }))
                                }
                            }) ;

                       }}
                    ></i>
                </Auth>
                <Auth
                    authIndex="37"
                >
                    <i title="编辑" className="sprite-edit dib-table-icon" value={value.id}
                       onClick={(event)=>{
                            service.base.fetchBaseProductDetail({
                                itemId : value.itemId
                            },(error,result) => {
                                if ( !error ){
                                    globalStore.dispatch(modalShow1({
                                        isShow : true ,
                                        operation : 'edit'
                                    }))　;
                                    globalEvent.base.editProduct.dispatch({
                                        operation : 'edit' ,
                                        data : result.data ,
                                        validation : {
                                            name_status : '' ,
                                            name_help : '' ,
                                            cost_status : '' ,
                                            cost_help : '' ,
                                            type_status : '' ,
                                            type_help : '' ,
                                            brand_status : '' ,
                                            brand_help : '' ,
                                            spec_status : '' ,
                                            spec_help : '' ,
                                            amount_status : '' ,
                                            amount_help : '' ,
                                            unit_status : '' ,
                                            unit_help : '' ,
                                            // sort_status : '' ,
                                            // sort_help : '' ,
                                            remarks_status : '' ,
                                            remarks_help : '' ,
                                        } ,
                                    }) ;
                                }
                            }) ;
                       }}
                    ></i>
                </Auth>
                <Auth
                    authIndex="38"
                >
                    <Popconfirm
                        title="确认删除这个商品吗?"
                        onConfirm={()=>{
                            service.base.deleteBaseProduct({
                                itemId : value.itemId - 0
                            },(result)=>{
                                if ( result.mark == '000000000' ){
                                    globalFunction.alert.info( '删除商品成功'　,　'操作提示'　) ;
                                    service.base.initBaseProduct({
                                        tenantId : window.globalStore.getState().userstore.user.tenantId ,

                                        itemName : '' ,
                                        categoryId : '' ,
                                        brandId : '' ,
                                        specification : '' ,

                                        pageSize :10,
                                        pageNum : 1,
                                    },(error,data)=>{
                                        window.globalFunction.alert.info( '商品删除成功' , '操作提示' ) ;
                                        globalStore.dispatch(baseProductInit(data)) ;
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
                        <i
                            title="删除"
                            className="sprite-delete dib-table-icon"
                            value={value.id}
                            onClick={(event)=>{
                            // store.dispatch(modalShow1(true,{
                            //      id:value.id
                            // }))
                            }}
                        ></i>
                    </Popconfirm>
                </Auth>
            </span>
        )
    }
}] ;

const DETAILS = [
    {
    title : '类别' ,
    // key : 'category' ,
    key : 'categoryName_forShow' ,
},{
    title : '品牌' ,
    // key : 'brand'
    key : 'brandName_forShow' ,
},{
    title : '规格型号' ,
    key : 'specification'
},{
    title : '单位' ,
    key : 'unitName'
},{
    title : '现有数量'　,
    key : 'number' 　
},{
    title : '库存成本' ,
    key : 'inventoryCost'
},
//     {
//     title : '排序' ,
//     key : 'id'
// },
    {
    title : '图片' ,
    key : 'img' ,
    type : 'image' ,
},{
    title : '备注' ,
    key : 'tips'
},{
    title : '操作人' ,
    key : 'userName'
}]


class B_Product extends React.Component {

    constructor(props){
        super(props) ;
        this.state = {
            percent : 0,
            pageSize : 10 ,
            currentPage : 1 ,
            filter : {
                product : '' ,
                categoryId : 'default-all' ,
                brandId : 'default-all' ,
                specifications : '' ,
            } ,
            editProduct : (value) => {
                this.setState({
                    modalModel　:　value.data ,
                    validation : value.validation ,
                }) ;
            } ,
            modalModel : {
                product : '' ,
                category : '3' ,
                brand : '1' ,
                specification : '' ,
                unit : '1' ,
                number : '' ,
                inventoryCost : '' ,
                img : '' ,
                // sort : '' ,
                tips : ''
            },
            modalImport : {
                href : '' ,
                type : '1' ,

                importStatus : 'waiting'　, //waiting / success / failed
                importStatusText: '数据正在导入中...请耐心等待...' ,
                importErrorPath: '' ,
            },
            newCategory : '' ,
            newBrand : '' ,
            newUnit : '' ,
            validation : {
                name_status : '' ,
                name_help : '' ,
                cost_status : '' ,
                cost_help : '' ,
                type_status : '' ,
                type_help : '' ,
                brand_status : '' ,
                brand_help : '' ,
                spec_status : '' ,
                spec_help : '' ,
                amount_status : '' ,
                amount_help : '' ,
                unit_status : '' ,
                unit_help : '' ,
                // sort_status : '' ,
                // sort_help : '' ,
                remarks_status : '' ,
                remarks_help : '' ,

                excel_status : '' ,
                excel_help : '' ,
            } ,
        }
    }
    //init for market
    componentDidMount(){
        //data init
        service.base.initBaseProduct({
            tenantId : window.globalStore.getState().userstore.user.tenantId ,

            itemName : '' ,
            categoryId : '' ,
            brandId : '' ,
            specification : '' ,

            pageSize :10,
            pageNum : 1,
        },(error,data)=>{
            this.props.baseProductInit(data) ;
            this.queryParamsInit( this.props.location.query ) ;
        });

        //global event init
        globalEvent.base.editProduct = new signals.Signal() ;
        globalEvent.base.editProduct.add(this.state.editProduct) ;
    }
    queryParamsInit(params){
        if ( params[ 'state' ] === 'new' ){
            globalStore.dispatch(modalShow1({
                isShow : true ,
                operation : 'new'
            })) ;
            globalEvent.base.editProduct.dispatch({
                operation : 'new' ,
                data : {
                    product : '' ,
                    category : '3' ,
                    brand : '1' ,
                    specification : '' ,
                    unit : '1' ,
                    number : '' ,
                    inventoryCost : '' ,
                    img : '' ,
                    // sort : '' ,
                    tips : ''
                } ,
                validation : {
                    name_status : '' ,
                    name_help : '' ,
                    cost_status : '' ,
                    cost_help : '' ,
                    type_status : '' ,
                    type_help : '' ,
                    brand_status : '' ,
                    brand_help : '' ,
                    spec_status : '' ,
                    spec_help : '' ,
                    amount_status : '' ,
                    amount_help : '' ,
                    unit_status : '' ,
                    unit_help : '' ,
                    // sort_status : '' ,
                    // sort_help : '' ,
                    remarks_status : '' ,
                    remarks_help : '' ,
                } ,
            }) ;
        }
    }
    componentWillUnmount(){
        globalEvent.base.editProduct.remove(this.state.editProduct) ;
    }

    //filter
    _ev_filterSearch(event){
        service.base.fetchBaseProduct({
            tenantId : window.globalStore.getState().userstore.user.tenantId ,

            itemName : this.state.filter.product ,
            categoryId : this.state.filter.categoryId === 'default-all' ? '' : this.state.filter.categoryId ,
            brandId : this.state.filter.brandId === 'default-all' ? '' : this.state.filter.brandId ,
            specification : this.state.filter.specifications ,
        },(error,data)=>{
            this.props.baseProductTable(data) ;
            this.setState({
                currentPage : 1
            });
        }) ;
    }
    _ev_submit_saveAdd(){
        //保存完了之后再次打开新增
        // service.base.
        this._ev_submit_save(()=>{

            globalStore.dispatch(modalShow1({
                isShow : true ,
                operation : 'new'
            })) ;
            globalEvent.base.editProduct.dispatch({
                operation : 'new' ,
                data : {
                    product : '' ,
                    category : '3' ,
                    brand : '1' ,
                    specification : '' ,
                    unit : '1' ,
                    number : '0' ,
                    inventoryCost : '' ,
                    img : '' ,
                    // sort : '' ,
                    tips : ''
                } ,
                validation : {
                    name_status : '' ,
                    name_help : '' ,
                    cost_status : '' ,
                    cost_help : '' ,
                    type_status : '' ,
                    type_help : '' ,
                    brand_status : '' ,
                    brand_help : '' ,
                    spec_status : '' ,
                    spec_help : '' ,
                    amount_status : '' ,
                    amount_help : '' ,
                    unit_status : '' ,
                    unit_help : '' ,
                    // sort_status : '' ,
                    // sort_help : '' ,
                    remarks_status : '' ,
                    remarks_help : '' ,
                } ,
            }) ;

        }) ;
    }
    _ev_submit_save(callbackForSaveAdd){
        //保存
        if ( service.validation.base.form_product.productName(this.state.modalModel.product).validateStatus == 'error' ||
            service.validation.base.form_product.productSpec(this.state.modalModel.specification).validateStatus == 'error'||
            service.validation.base.form_product.productAmount(this.state.modalModel.number).validateStatus == 'error'||
            service.validation.base.form_product.productCost(this.state.modalModel.inventoryCost).validateStatus == 'error'||
            // service.validation.base.form_product.productSort(this.state.modalModel.sort).validateStatus == 'error'||
            service.validation.base.form_product.productRemarks(this.state.modalModel.tips).validateStatus == 'error'
        ){
            globalFunction.alert.warning( '请正确填写您的表单信息' , '表单验证' ) ;
            return ;
        }
        service.base.addBaseProduct({
            tenantId : window.globalStore.getState().userstore.user.tenantId , //公司Id

            itemName : this.state.modalModel.product , //商品ID
            categoryId : this.state.modalModel.category , //分类ID
            brandId : this.state.modalModel.brand , //品牌ID
            specification : this.state.modalModel.specification , //规格
            unitId : this.state.modalModel.unit , //计量单位ID
            existingQuantity : this.state.modalModel.number , //现有库存
            stockCost : this.state.modalModel.inventoryCost , //库存成本
            // sort : this.state.modalModel.sort == '' ? 99999 : this.state.modalModel.sort, //排序
            //unitPrice : 1000 , //可有可无的单价
            comment : this.state.modalModel.tips , //备注
            imgUrl : this.state.modalModel.img , //商品图片路径
        },(result)=>{
            if ( result.mark == '000000000' ){
                //data init
                service.base.initBaseProduct({
                    tenantId : window.globalStore.getState().userstore.user.tenantId ,

                    itemName : '' ,
                    categoryId : '' ,
                    brandId : '' ,
                    specification : '' ,

                    pageSize :this.state.pageSize ,
                    pageNum : this.state.currentPage ,
                },(error,data)=>{
                    window.globalFunction.alert.info( '新增货品成功' , '操作提示' ) ;
                    this.props.baseProductInit(data) ;
                    this.setState({
                        filter : {
                            product : '' ,
                            categoryId : 'default-all' ,
                            brandId : 'default-all' ,
                            specifications : '' ,
                        } ,
                    }) ;
                    callbackForSaveAdd && callbackForSaveAdd() ;
                });
                
            } else {
                globalFunction.alert.warning( result.message , '操作提示' ) ;
            }
        }) ;
    }
    _ev_submit_edit(){
        //console.log(this.state.modalModel) ;
        //编辑
        
        if ( service.validation.base.form_product.productName(this.state.modalModel.product).validateStatus == 'error' ||
            service.validation.base.form_product.productSpec(this.state.modalModel.specification).validateStatus == 'error'||
            service.validation.base.form_product.productAmount(this.state.modalModel.number).validateStatus == 'error'||
            service.validation.base.form_product.productCost(this.state.modalModel.inventoryCost).validateStatus == 'error'||
            // service.validation.base.form_product.productSort(this.state.modalModel.sort).validateStatus == 'error'||
            service.validation.base.form_product.productRemarks(this.state.modalModel.tips).validateStatus == 'error'
        ){
            globalFunction.alert.warning( '请正确填写您的表单信息' , '表单验证' ) ;
            return ;
        }
        service.base.editBaseProduct({
            "itemParameter" : {
                // itemId : this.state.modalModel.id ,
                // itemName : this.state.modalModel.product ,
                // // itemNameEN : '' ,
                // categoryId : '' ,
                // categoryName : '' ,
                // brandId : '' ,
                // brandName : '' ,
                // specification : '' ,
                // unitId : '' ,
                // unitName : '' ,
                // packing : '' ,
                // existingQuantity : '' ,
                // sku : '' ,
                // purchasePrice : '' ,
                // stockCost : '' ,
                // salePrice : '' ,
                // barCode : '' ,
                // imgUrl : '' ,
                // tenantId : '' ,
                // specialHint : '' ,
                // comment : '' ,
                // delFlag : '' ,
                // createTime : '' ,
                // updateTime : '' ,
                // pageSize : '' ,
                // pageNum : '' ,
                // excelPath : '' ,
                // unitPrice : '' ,

                itemId : this.state.modalModel.itemId ,
                tenantId : window.globalStore.getState().userstore.user.tenantId , //公司Id
                itemName : this.state.modalModel.product , //商品ID
                categoryId : this.state.modalModel.category , //分类ID
                brandId : this.state.modalModel.brand , //品牌ID
                specification : this.state.modalModel.specification , //规格
                unitId : this.state.modalModel.unit , //计量单位ID
                existingQuantity : this.state.modalModel.number , //现有库存
                stockCost : this.state.modalModel.inventoryCost , //库存成本
                // sort : this.state.modalModel.sort == '' ? 99999 : this.state.modalModel.sort, //排序,
                unitPrice : 1000 , //可有可无的单价
                comment : this.state.modalModel.tips , //备注
                imgUrl : this.state.modalModel.img , //商品图片路径
            }
        },(result)=>{
            if ( result.mark == '000000000' ){
                //data init
                service.base.initBaseProduct({
                    tenantId : window.globalStore.getState().userstore.user.tenantId ,

                    itemName : '' ,
                    categoryId : '' ,
                    brandId : '' ,
                    specification : '' ,

                    pageSize :10,
                    pageNum : 1,
                },(error,data)=>{
                    window.globalFunction.alert.info( '商品更新成功' , '操作提示' ) ;
                    this.props.baseProductInit(data) ;
                    this.setState({
                        filter : {
                            product : '' ,
                            categoryId : 'default-all' ,
                            brandId : 'default-all' ,
                            specifications : '' ,
                        } ,
                    }) ;
                });
            } else {
                window.globalFunction.alert.warning( result.message , '操作提示' ) ;
            }
        }) ;
    }
    startImport(){
        if ( !this.state.modalImport.href ){
            window.globalFunction.alert.warning( '您尚未选择上传文件' , '操作提示' ) ;
            return ;
        }

        service.base.importBaseProduct({
            importParameter : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                importedExcelPath : this.state.modalImport.href ,
                importedType : this.state.modalImport.type , //1 不导入, 2 覆盖
            }
        },(result)=>{
            if ( result.mark == '000000000' ){
                this.props.startImport_product() ;
                if　(result.data.importResult.importedResult == '0' ){
                    this.setState({
                        modalImport: {
                            ...this.state.modalImport,
                            importStatus: 'success',
                            importStatusText: result.data.importResult.importedResultMsg,
                            importErrorPath: '',
                        }
                    }) ;
                    globalFunction.alert.info( '货品数据已成功导入' , '操作提示' ) ;
                    var self = this ;
                    setTimeout(function(){
                        //data init
                        service.base.initBaseProduct({
                            tenantId : window.globalStore.getState().userstore.user.tenantId ,

                            itemName : '' ,
                            categoryId : '' ,
                            brandId : '' ,
                            specification : '' ,

                            pageSize :10,
                            pageNum : 1,
                        },(error,data)=>{
                            self.props.baseProductInit(data) ;
                        });
                    },1000) ;
                } else {
                    this.setState({
                        modalImport: {
                            ...this.state.modalImport,
                            importStatus: 'failed',
                            importStatusText: result.data.importResult.importedResultMsg,
                            importErrorPath: result.data.importResult.errorFilePath || '',
                        }
                    }) ;
                    var self = this ;
                    setTimeout(function(){
                        //data init
                        service.base.initBaseProduct({
                            tenantId : window.globalStore.getState().userstore.user.tenantId ,

                            itemName : '' ,
                            categoryId : '' ,
                            brandId : '' ,
                            specification : '' ,

                            pageSize :10,
                            pageNum : 1,
                        },(error,data)=>{
                            self.props.baseProductInit(data) ;
                        });
                    },1000) ;
                }
            } else {
                globalFunction.alert.warning( result.message , '操作提示' ) ;
                this.setState({
                    modalImport : {
                        ...this.state.modalImport ,
                        importStatus : 'failed' ,
                        importStatusText: '导入文件失败, 请检查网络连接' ,
                        importErrorPath: '' ,
                    }
                })
            }
        }) ;



        this.props.startImport_product();
        this.setState({
            modalImport : {
                ...this.state.modalImport ,
                href : '' ,
                importStatus : 'waiting' ,
            }
        }) ;
    }
    //unit
    _unit_className(type){
        if ( type === 'new1' ){
            return className({
                "submit-save-add" : true ,
                "none"　:　this.props.base.b_productState.modalType1　===　'new'　?　false　:　true
            })
        } else if ( type === 'new2' ){
            return className({
                "submit-save" : true　,
                "none"　:　this.props.base.b_productState.modalType1　===　'new'　?　false　:　true
            })
        } else {
            return　className({
                "submit-save-edit"　:　true　,
                "none"　:　this.props.base.b_productState.modalType1　===　'edit'　?　false　:　true
            })
        }
    }

    render (){
        console.log(this.state);
        const formItemLayout_modal = {
            labelCol : {span:7} ,
            wrapperCol : {span:10}
        }
        const formItemLayout_modal_submit = {
            wrapperCol : {span:10,offset:7}
        }
        const formItemLayout_modal_import = {
            wrapperCol : {span:6,offset:18}
        }
        var preImport = cx({
            'preImport' : true ,
            'none' : ( this.props.base.b_productState.onImportShow　===　true　?　true　:　false )
        }) ;
        var onImport = cx({
            'onImport' : true ,
            'none' : ( this.props.base.b_productState.onImportShow　===　true　?　true　:　false )
        }) ;
        return (
            <div>

                <div className="center-east-north">

                    <a className="active">库存管理</a>

                    <span className="operation">
                        <Auth
                            authIndex="35"
                        >
                            <Button
                                type="ghost"
                                icon="upload"
                                onClick={(event) => {
                                    globalStore.dispatch(modalShow3_product(true)) ;
                                    this.setState({
                                        modalImport : {
                                            ...this.state.modalImport ,
                                            importStatus : 'waiting' ,
                                        }
                                    }) ;
                                }}
                            >导入</Button>
                        </Auth>
                        <Auth
                            authIndex="34"
                        >
                            <Button
                                type="primary"
                                icon="plus-circle-o"
                                onClick={(event)=>{
                                    globalStore.dispatch(modalShow1({
                                        isShow : true ,
                                        operation : 'new'
                                    })) ;
                                    globalEvent.base.editProduct.dispatch({
                                        operation : 'new' ,
                                        data : {
                                            product : '' ,
                                            category : '3' ,
                                            brand : '1' ,
                                            specification : '' ,
                                            unit : '1' ,
                                            number : '0' ,
                                            inventoryCost : '' ,
                                            img : '' ,
                                            // sort : '' ,
                                            tips : ''
                                        } ,
                                        validation : {
                                            name_status : '' ,
                                            name_help : '' ,
                                            cost_status : '' ,
                                            cost_help : '' ,
                                            type_status : '' ,
                                            type_help : '' ,
                                            brand_status : '' ,
                                            brand_help : '' ,
                                            spec_status : '' ,
                                            spec_help : '' ,
                                            amount_status : '' ,
                                            amount_help : '' ,
                                            unit_status : '' ,
                                            unit_help : '' ,
                                            // sort_status : '' ,
                                            // sort_help : '' ,
                                            remarks_status : '' ,
                                            remarks_help : '' ,
                                        } ,
                                    }) ;
                                }}
                            >新建</Button>
                        </Auth>
                    </span>

                </div>

                <div className="center-east-center">

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
                                <span className="filter-label">类别</span>
                                <span className="filter-component">
                                    <Select
                                        style={{width:120}}
                                        value={this.state.filter.categoryId}
                                        onChange={(value)=>{
                                            this.setState({
                                                filter : {
                                                    ...this.state.filter ,
                                                    categoryId : value ,
                                                }
                                            })
                                        }}
                                    >
                                        <Option title="全部" value="default-all" key="default-all" >全部</Option>
                                        {
                                            this.props.base.b_product.category.data.map((v,i)=>{
                                                return <Option title={v.name} value={v.value} key={v.value}>{v.name}</Option>
                                            })
                                        }
                                    </Select>
                                </span>
                            </span>
                            <span className="filter">
                                <span className="filter-label">品牌</span>
                                <span className="filter-component">
                                    <Select
                                        style={{width:120}}
                                        value={this.state.filter.brandId}
                                        onChange={(value)=>{
                                            this.setState({
                                                filter : {
                                                    ...this.state.filter ,
                                                    brandId : value
                                                }
                                            }) ;
                                        }}
                                    >
                                        <Option title="全部" value="default-all" key="default-all" >全部</Option>
                                        {
                                            this.props.base.b_product.brandId.data.map((v,i)=>{
                                                return <Option title={v.name} value={v.value} key={v.value}>{v.name}</Option>
                                            })
                                        }
                                    </Select>
                                </span>
                            </span>
                            <span className="filter">
                                <span className="filter-label">规格型号</span>
                                <span className="filter-component">
                                    <Input
                                        placeholder='请输入规格'
                                        value={this.state.filter.specifications}
                                        onChange={(event)=>{
                                            this.setState({
                                                filter : {
                                                    ...this.state.filter ,
                                                    specifications : event.target.value ,
                                                }
                                            })
                                        }}
                                    />
                                </span>
                            </span>
                            <div className="search-wrap base-product">
                                <span className="searc-btn">
                                    <Button type="default" icon="search" onClick={this._ev_filterSearch.bind(this)}>查询</Button>
                                </span>
                            </div>
                        </div>


                        <div className="tabel-wrap" key="anime-3">
                        <Table
                            dataSource={this.props.base.b_product.dataSource.data}
                            columns={this.props.COLUMNS}
                            pagination={{
                                showSizeChanger : true ,
                                total : this.props.base.b_product.totalCount ,

                                pageSize : this.state.pageSize ,

                                current :　this.state.currentPage ,
                                onShowSizeChange : (current , pageSize)=>{
                                    var self = this;
                                    self.setState({
                                        currentPage : 1 ,
                                        pageSize : pageSize
                                    },()=> {
                                        service.base.initBaseProduct({
                                            tenantId : window.globalStore.getState().userstore.user.tenantId ,

                                            itemName : this.state.filter.product ,
                                            categoryId : this.state.filter.categoryId === 'default-all' ? '' : this.state.filter.categoryId ,
                                            brandId : this.state.filter.brandId === 'default-all' ? '' : this.state.filter.brandId ,
                                            specification : this.state.filter.specifications ,

                                            pageSize :self.state.pageSize,
                                            pageNum : 1,
                                        },(error,data)=>{
                                            self.props.baseProductInit(data) ;
                                        });
                                    });
                                },
                                onChange : (value)=>{
                                    var self = this;
                                    self.setState({
                                        currentPage : value
                                    });
                                    service.base.initBaseProduct({
                                        tenantId : window.globalStore.getState().userstore.user.tenantId ,

                                        itemName : this.state.filter.product ,
                                        categoryId : this.state.filter.categoryId === 'default-all' ? '' : this.state.filter.categoryId ,
                                        brandId : this.state.filter.brandId === 'default-all' ? '' : this.state.filter.brandId ,
                                        specification : this.state.filter.specifications ,

                                        pageSize :self.state.pageSize,
                                        pageNum : value,
                                    },(error,data)=>{
                                        self.props.baseProductInit(data) ;
                                    });
                                }
                            }}
                        ></Table>
                    </div>

                    <Modal className="base-modal3" title="导入货品" visible={this.props.base.b_productState.modalShow3}
                           onOk={()=>{this.props.modalShow3_product(false)}} onCancel={()=>{this.props.modalShow3_product(false)}}
                           footer={
                                <span></span>
                           } width={800}
                    >
                        <div className="modal-content">
                            <Steps className="steps" size="small" current={this.props.base.b_productState.currentStep}>
                                <Step title="上传文档" />
                                <Step title="导入数据" />
                                <Step title="完成" />
                            </Steps>
                            <div className={preImport}>
                                <div className="importTips">
                                    <span className="text1">一、请按照数据模板的格式准备要导入的数据</span>
                                    <span className="text2">注意事项</span>
                                    <a
                                        className="text3"
                                        href="http://ehsy-saas.oss-cn-hangzhou.aliyuncs.com/resource/download/%E8%B4%A7%E5%93%81%E7%AE%A1%E7%90%86-%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%87%86.xlsx"
                                        target="_blank"
                                    >
                                        下载数据模板
                                    </a>
                                    <div className="text4">
                                        <span>1.模板中的表头名称不可改变，表头行不能删除;</span>
                                        <span>2.项目顺序可以调整，不需要的项目可以删减;</span>
                                        <span>3.其中"客户名称"、"期初欠款"为必填项，不能删除;</span>
                                        <span>4.导入文件请勿超过1MB。</span>
                                    </div>
                                </div>
                                <div className="importForm">
                                    <Form horizontal className="">
                                        <div className="repeatType">
                                            <span>二、请选择数据重复时的操作方式</span>
                                            <span className="text2">查重规则 ：（货品名称、品牌、规格型号）</span>
                                        </div>
                                        <FormItem>
                                            <RadioGroup
                                                value={this.state.modalImport.type}
                                                onChange={(event)=>{
                                                    this.setState({
                                                        modalImport : {
                                                            ...this.state.modalImport ,
                                                            type : event.target.value ,
                                                        }
                                                    })
                                                }}
                                                size="large"
                                            >
                                                <RadioButton value="1">不导入</RadioButton>
                                                <RadioButton value="2">覆盖导入</RadioButton>
                                                {/*<RadioButton value="coverRepeat">不导入新数据，仅覆盖重复数据</RadioButton>*/}
                                            </RadioGroup>
                                        </FormItem>
                                        <div className="chooseImport">
                                            <span>二、请选择需要导入的Excel文件</span>
                                        </div>
                                        <FormItem
                                            style={{paddingLeft:15}}
                                            validateStatus={this.state.validation.excel_status}
                                            help={this.state.validation.excel_help}
                                        >
                                            <Upload
                                                className="upload-excel"
                                                name="file"
                                                showUploadList={false}
                                                action="/api/upload-file-SAITEM007"
                                                beforeUpload={(file)=>{
                                                    if ( file.size > 1024*1024*2 ){
                                                        this.setState({
                                                            validation : {
                                                                ...this.state.validation ,
                                                                excel_status : 'error' ,
                                                                excel_help : '文件大小超过2M' ,
                                                            },
                                                        }) ;
                                                        return false ;
                                                    }
                                                    if ( FILE_EXCEL_ACCEPT.indexOf( file.name.split('.').pop().toLowerCase() ) == -1 ){
                                                        this.setState({
                                                            validation : {
                                                                ...this.state.validation ,
                                                                excel_status : 'error' ,
                                                                excel_help : '文件必须是xls,xlsx格式' ,
                                                            },
                                                        }) ;
                                                        return false ;
                                                    }
                                                    this.setState({
                                                        validation : {
                                                            ...this.state.validation ,
                                                            excel_status : undefined ,
                                                            excel_help : '' ,
                                                        },
                                                    }) ;
                                                }}
                                                onChange={(info)=>{
                                                    if (info.file.status === 'done') {
                                                        var result = info.file.response ;
                                                        if ( result.mark == '000000000' ){
                                                            globalFunction.alert.info( 'excel文件上传成功' , '操作提示' ) ;
                                                            this.setState({
                                                                modalImport : {
                                                                    ...this.state.modalImport ,
                                                                    href : result.data.img_url ,
                                                                }
                                                            }) ;
                                                        } else {
                                                            globalFunction.alert.warning( result.message , '操作提示' ) ;
                                                        }
                                                    } else {
                                                        globalFunction.alert.info( 'excel上传中' , '操作提示' ) ;
                                                    }
                                                }}
                                            >
                                                <Button type="ghost">
                                                    <Icon type="upload" />
                                                    { this.state.modalImport.href ?
                                                        ( this.state.modalImport.href ) :
                                                        '点击上传'
                                                    }
                                                </Button>
                                            </Upload>
                                            <div className="text2">文件大小不超过2M</div>
                                        </FormItem>
                                        <FormItem
                                            {...formItemLayout_modal_import}
                                        >
                                            <Button type="ghost"  htmlType="submit" onClick={this.props.cancelImport_product.bind(this)}>取消</Button>
                                            <Button type="primary" className="import-button" htmlType="submit" onClick={this.startImport.bind(this)}>开始导入</Button>
                                        </FormItem>
                                    </Form>
                                </div>
                            </div>
                            <div className={onImport}>
                                {/*<Progress className="import-percent" strokeWidth={10} percent={this.state.percent} />*/}
                                {/*<span className="onImport-text">数据正在导入中，预计剩余时间1秒</span>*/}
                                <span
                                    className="onImport-text"
                                    style={( this.state.modalImport.importStatus === 'waiting' ? {} : {display:'none'})}
                                >数据正在导入中，请耐心等待。。。<Icon type="loading" /></span>
                                <span
                                    className="onImport-text"
                                    style={( this.state.modalImport.importStatus === 'success' ? {} : {display:'none'})}
                                >{this.state.modalImport.importStatusText}</span>
                                <span
                                    className="onImport-text"
                                    style={( this.state.modalImport.importStatus === 'failed' ? {} : {display:'none'})}
                                >{this.state.modalImport.importStatusText}</span>
                                <div className="tips">
                                    <span>提示：</span>
                                    <span>1.点点帐拥有云端自动导入数据的功能，如果导入时间较长，您可以选择关闭此页面，进行其他操作。</span>
                                    <span>2.数据导入后，将自动给您发送结果通知。</span>
                                </div>
                                {  (this.state.modalImport.importStatus === 'failed' && this.state.modalImport.importErrorPath !== '')?
                                    ( <div className="error">
                                        <a href={this.state.modalImport.importErrorPath}　target="_blink">下载错误报告，查看失败原因</a>
                                    </div> ) :
                                    <div className="error"></div>
                                }
                                <Button 
                                    type="primary" 
                                    className="closed" 
                                    htmlType="submit" 
                                    onClick={this.props.cancelImport_product.bind(this)}
                                >关闭</Button>
                            </div>
                        </div>
                    </Modal>


                    <Modal
                        className="base-modal1"
                        title={this.props.base.b_productState.modalType1==='new'?'新建货品':'编辑货品'}
                        visible={this.props.base.b_productState.modalShow1}
                        onOk={()=>{this.props.modalShow1({isShow : false})}}
                        onCancel={()=>{
                            var that = this;
                            Modal.confirm({
                                title: '确认',
                                content: '确认要取消该商品录入吗',
                                okText: '确认',
                                cancelText: '取消',
                                onOk() {
                                  that.props.modalShow1({isShow : false});
                                },
                                onCancel() {},
                              })
                          }
                        }
                    >
                        <div className="modal-content">
                            <Form horizontal className="form-static">
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="货品名称"
                                    required
                                    hasFeedback
                                    validateStatus={this.state.validation.name_status}
                                    help={this.state.validation.name_help}
                                >
                                    <Input placeholder="" value={this.state.modalModel.product}　
                                        onChange={(event)=>{
                                            var name_validation = service.validation.base.form_product.productName(event.target.value) ;
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    product : event.target.value
                                                },
                                                validation : {
                                                    ...this.state.validation ,
                                                    name_status : name_validation.validateStatus ,
                                                    name_help : name_validation.help ,
                                                },
                                            })

                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="类别"
                                >
                                    <Select
                                        value={this.state.modalModel.category}
                                        onChange={(v)=>{
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    category : v
                                                }
                                            })
                                        }}
                                    >
                                        {
                                            this.props.base.b_product.category.data.map((v,i)=>{
                                                return  (
                                                    <Option title={v.name} value={v.value} key={v.value}>
                                                        {v.name}
                                                        <a
                                                            className="antdcustomer-options-delete"
                                                            onClick={(event)=>{
                                                                event.preventDefault() ;
                                                                service.base.deleteProductCategory({
                                                                    categoryId : v.value
                                                                },(result)=>{
                                                                    if ( result.mark == '000000000' ){
                                                                        service.base.fetchCategory({
                                                                            tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                                                        },(error,result)=>{
                                                                            globalFunction.alert.info( '删除分类成功' , '操作提示' ) ;
                                                                            this.props.baseProductCategoryFilter(result.data) ;
                                                                            this.setState({
                                                                                modalModel : {
                                                                                    ...this.state.modalModel ,
                                                                                    category : '1' ,
                                                                                }
                                                                            }) ;
                                                                        }) ;
                                                                    } else {
                                                                        globalFunction.alert.warning( result.message , '操作提示' ) ;
                                                                    }
                                                                }) ;
                                                            }}
                                                        >删除</a>
                                                    </Option>
                                                ) ;
                                            })
                                        }
                                    </Select>
                                    <Popconfirm
                                        className="antdcustomer-popconfirm-noicon"
                                        title={
                                            <span>
                                                <Input
                                                    placeholder=""
                                                    value={this.state.newCategory}　
                                                    onChange={(event)=>{
                                                        this.setState({
                                                            newCategory :  event.target.value ,
                                                        }) ;
                                                    }}
                                                />
                                            </span>
                                        }
                                        onConfirm={()=>{
                                            var catTmp = $.trim( this.state.newCategory ) ;                                          
                                            if ( catTmp == ''){
                                                globalFunction.alert.warning( '类型不能为空' , '操作提示' ) ;
                                                return ;
                                            }else if( !service.validation.reg.base.product.type.test(catTmp)){
                                                globalFunction.alert.warning( '类型格式错误' , '操作提示' ) ;
                                                this.setState({
                                                    newCategory :  '' ,
                                                })
                                                return ;
                                            }
                                            service.base.addProductCategory({
                                                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                                categoryName　:　catTmp　,
                                                categoryType　:　1 , //能新增的就是1
                                            },(result)=>{
                                                if ( result.mark === '000000000' ){
                                                    this.setState({
                                                        newCategory : '' ,
                                                    }) ;
                                                    service.base.fetchCategory({
                                                        tenantId : window.globalStore.getState().userstore.user.tenantId
                                                    },(error,result)=>{
                                                        globalFunction.alert.info( '新增分类成功' , '操作提示' ) ;
                                                        this.props.baseProductCategoryFilter(result.data) ;
                                                        this.setState({
                                                            modalModel : {
                                                                ...this.state.modalModel ,
                                                                category : '1' ,
                                                            }
                                                        }) ;
                                                    }) ;
                                                } else {
                                                    globalFunction.alert.warning( result.message , '操作提示' ) ;
                                                }
                                            }) ;
                                        }}
                                        onCancel={()=>{
                                            this.setState({
                                                newCategory : '' ,
                                            }) ;
                                        }}
                                        okText="新增"
                                        cancelText="取消"
                                    >
                                        <span className="customer-define">
                                            <i></i>
                                            <span>新增</span>
                                        </span>
                                    </Popconfirm>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="品牌"
                                    required
                                >
                                    <Select
                                        value={this.state.modalModel.brand}
                                        onChange={(v)=>{
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    brand : v
                                                }
                                            })
                                        }}
                                    >
                                        {
                                            this.props.base.b_product.brandId.data.map((v,i)=>{
                                                return  (
                                                    <Option title={v.name} value={v.value} key={v.value}>
                                                        {v.name}
                                                        <a
                                                            className="antdcustomer-options-delete"
                                                            onClick={()=>{
                                                                event.preventDefault() ;
                                                                service.base.deleteProductBrand({
                                                                    brandId : v.value
                                                                },(result)=>{
                                                                    if ( result.mark == '000000000' ){
                                                                        service.base.fetchBrandId({
                                                                            tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                                                        },(error,result)=>{
                                                                            globalFunction.alert.info( '删除品牌成功' , '操作提示' ) ;
                                                                            this.props.baseProductBrandFilter(result.data) ;
                                                                            this.setState({
                                                                                modalModel : {
                                                                                    ...this.state.modalModel ,
                                                                                    brand : '1' ,
                                                                                }
                                                                            }) ;
                                                                        }) ;
                                                                    } else {
                                                                        globalFunction.alert.warning( result.message , '操作提示' ) ;
                                                                    }
                                                                }) ;
                                                            }}
                                                        >删除</a>
                                                    </Option>
                                                ) ;
                                            })
                                        }
                                    </Select>
                                    <Popconfirm
                                        className="antdcustomer-popconfirm-noicon"
                                        title={
                                            <span>
                                                <Input
                                                    placeholder=""
                                                    value={this.state.newBrand}　
                                                    onChange={(event)=>{
                                                        this.setState({
                                                            newBrand :  event.target.value
                                                        }) ;
                                                    }}
                                                />
                                            </span>
                                        }
                                        onConfirm={()=>{
                                            var catTmp = $.trim( this.state.newBrand ) ;
                                            if ( catTmp == ''){
                                                globalFunction.alert.warning( '品牌不能为空' , '操作提示' ) ;
                                                return ;
                                            }else if( !service.validation.reg.base.product.brand.test(catTmp)){
                                                globalFunction.alert.warning( '品牌格式错误' , '操作提示' ) ;
                                                this.setState({
                                                    newBrand :  '' ,
                                                })
                                                return ;
                                            }
                                            service.base.addProductBrand({
                                                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                                brandName　:　catTmp　,
                                                brandType　:　1 , //能新增的就是1
                                            },(result)=>{
                                                if ( result.mark === '000000000' ){
                                                    this.setState({
                                                        newBrand : '' ,
                                                    }) ;
                                                    service.base.fetchBrandId({
                                                        tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                                    },(error,result)=>{
                                                        globalFunction.alert.info( '新增品牌成功' , '操作提示' ) ;
                                                        this.props.baseProductBrandFilter(result.data) ;
                                                        this.setState({
                                                            modalModel : {
                                                                ...this.state.modalModel ,
                                                                brand : '1' ,
                                                            }
                                                        }) ;
                                                    }) ;
                                                } else {
                                                    globalFunction.alert.warning( result.message , '操作提示' ) ;
                                                }
                                            }) ;
                                        }}
                                        onCancel={()=>{
                                            this.setState({
                                                newBrand : '' ,
                                            }) ;
                                        }}
                                        okText="新增"
                                        cancelText="取消"
                                    >
                                        <span className="customer-define">
                                            <i></i>
                                            <span>新增</span>
                                        </span>
                                    </Popconfirm>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="规格型号"
                                    required
                                    hasFeedback
                                    validateStatus={this.state.validation.spec_status}
                                    help={this.state.validation.spec_help}
                                >
                                    <Input placeholder="" value={this.state.modalModel.specification}　
                                       onChange={(event)=>{
                                            var spec_validation = service.validation.base.form_product.productSpec(event.target.value) ;
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    specification : event.target.value
                                                } ,
                                                validation : {
                                                    ...this.state.validation ,
                                                    spec_status : spec_validation.validateStatus ,
                                                    spec_help : spec_validation.help ,
                                                },
                                            })

                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="单位"
                                    required
                                >
                                    <Select
                                        value={this.state.modalModel.unit}
                                        onChange={(v)=>{
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    unit : v
                                                }
                                            })
                                        }}
                                    >
                                        {
                                            this.props.base.b_product.unit.data.map((v,i)=>{
                                                return  (
                                                    <Option title={v.name} value={v.value} key={v.value}>
                                                        {v.name}
                                                        <a
                                                            className="antdcustomer-options-delete"
                                                            onClick={(event)=>{
                                                                event.preventDefault() ;
                                                                service.base.deleteProductUnit({
                                                                    id : v.value
                                                                },(result)=>{
                                                                    if ( result.mark == '000000000' ){
                                                                        service.base.fetchUnit({
                                                                            tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                                                        },(error,result)=>{
                                                                            globalFunction.alert.info( '删除单位成功' , '操作提示' ) ;
                                                                            this.props.baseProductUnitFilter(result.data) ;
                                                                            this.setState({
                                                                                modalModel : {
                                                                                    ...this.state.modalModel ,
                                                                                    unit : '1' ,
                                                                                }
                                                                            }) ;
                                                                        }) ;
                                                                    } else {
                                                                        globalFunction.alert.warning( result.message , '操作提示' ) ;
                                                                    }
                                                                }) ;
                                                            }}
                                                        >删除</a>
                                                    </Option>
                                                ) ;
                                            })
                                        }
                                    </Select>
                                    <Popconfirm
                                        className="antdcustomer-popconfirm-noicon"
                                        title={
                                            <span>
                                                <Input
                                                    placeholder=""
                                                    value={this.state.newUnit}　
                                                    onChange={(event)=>{
                                                        this.setState({
                                                            newUnit :  event.target.value
                                                        }) ;
                                                    }}
                                                />
                                            </span>
                                        }
                                        onConfirm={()=>{
                                            var catTmp = $.trim( this.state.newUnit ) ;
                                            if ( catTmp == ''){
                                                globalFunction.alert.warning( '单位不能为空' , '操作提示' ) ;
                                                return ;
                                            }else if( !service.validation.reg.base.product.unit.test(catTmp)){
                                                globalFunction.alert.warning( '单位格式错误' , '操作提示' ) ;
                                                this.setState({
                                                    newUnit :  '' ,
                                                })
                                                return ;
                                            }
                                            service.base.addProductUnit({
                                                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                                name　:　catTmp　,
                                                family : catTmp ,
                                                type　:　1 , //能新增的就是1
                                            },(result)=>{
                                                if ( result.mark === '000000000' ){
                                                    this.setState({
                                                        newUnit : '' ,
                                                    }) ;
                                                    service.base.fetchUnit({
                                                        tenantId : window.globalStore.getState().userstore.user.tenantId ,

                                                    },(error,result)=>{
                                                        globalFunction.alert.info( '新增单位成功' , '操作提示' ) ;
                                                        this.props.baseProductUnitFilter(result.data) ;
                                                        this.setState({
                                                            modalModel : {
                                                                ...this.state.modalModel ,
                                                                unit : '1' ,
                                                            }
                                                        }) ;
                                                    }) ;
                                                } else {
                                                    globalFunction.alert.warning( result.message , '操作提示' ) ;
                                                }
                                            }) ;
                                        }}
                                        onCancel={()=>{
                                            this.setState({
                                                newUnit : '' ,
                                            }) ;
                                        }}
                                        okText="新增"
                                        cancelText="取消"
                                    >
                                        <span className="customer-define">
                                            <i></i>
                                            <span>新增</span>
                                        </span>
                                    </Popconfirm>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="现有数量"
                                    validateStatus={this.state.validation.amount_status}
                                    help={this.state.validation.amount_help}
                                >
                                    <InputNumber
                                       min= {0}
                                       max={100000000}
                                       value={this.state.modalModel.number}
                                       onChange={(value)=>{
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    number : value
                                                }
                                            })
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="库存成本"
                                    validateStatus={this.state.validation.cost_status}
                                    help={this.state.validation.cost_help}
                                >
                                    <InputNumber
                                        placeholder="0.00元"
                                        min= {0}
                                        max={100000000}
                                        step={0.01}
                                        value={this.state.modalModel.inventoryCost}
                                        onChange={(value)=>{
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    inventoryCost : value
                                                }
                                            })
                                        }}
                                    />
                                    {/*
                                    <Input placeholder=""　value={this.state.modalModel.inventoryCost}
                                           onChange={(event)=>{
                                            var cost_validation = service.validation.base.form_product.productCost(event.target.value) ;
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    inventoryCost : event.target.value
                                                } ,
                                                validation : {
                                                    ...this.state.validation ,
                                                    cost_status : cost_validation.validateStatus ,
                                                    cost_help : cost_validation.help ,
                                                },
                                            })

                                        }}
                                    />
                                     */}
                                </FormItem>
                                {/*<FormItem
                                    {...formItemLayout_modal}
                                    label="排序"
                                    validateStatus={this.state.validation.sort_status}
                                    help={this.state.validation.sort_help}
                                >
                                    <Input placeholder=""　value={this.state.modalModel.sort}
                                           onChange={(event)=>{
                                           var sort_validation = service.validation.base.form_product.productSort(event.target.value) ;
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    sort : event.target.value
                                                } ,
                                                validation : {
                                                    ...this.state.validation ,
                                                    sort_status : sort_validation.validateStatus ,
                                                    sort_help : sort_validation.help ,
                                                },
                                            })

                                        }}
                                    />
                                </FormItem>*/}
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="图片"
                                    validateStatus={this.state.validation.img_status}
                                    help={this.state.validation.img_help}
                                >
                                    <Upload
                                        className="antd-img-uploader"
                                        name="file"
                                        showUploadList={false}
                                        action="/api/upload-file-SAITEM007"
                                        beforeUpload={(file)=>{
                                            if ( file.size > 1024*1024*5 ){
                                                this.setState({
                                                    validation : {
                                                        ...this.state.validation ,
                                                        img_status : 'error' ,
                                                        img_help : '文件大小超过5M' ,
                                                    },
                                                }) ;
                                                return false ;
                                            }
                                            if ( FILE_IMAGE_ACCEPT.indexOf( file.name.split('.').pop().toLowerCase() ) == -1 ){
                                                this.setState({
                                                    validation : {
                                                        ...this.state.validation ,
                                                        img_status : 'error' ,
                                                        img_help : '文件必须以jpg,jpeg或png格式' ,
                                                    },
                                                }) ;
                                                return false ;
                                            }
                                            this.setState({
                                                validation : {
                                                    ...this.state.validation ,
                                                    img_status : undefined ,
                                                    img_help : '' ,
                                                },
                                            }) ;
                                        }}
                                        onChange={(info)=>{
                                            if (info.file.status === 'done') {
                                                var result = info.file.response ;
                                                if ( result.mark == '000000000' ){
                                                    globalFunction.alert.info( '图片上传成功' , '操作提示' ) ;
                                                    this.setState({
                                                        modalModel : {
                                                            ...this.state.modalModel ,
                                                            img : result.data.img_url ,
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
                                            this.state.modalModel.img ?
                                                <img src={this.state.modalModel.img} role="presentation" className="ehsy-image" /> :
                                                <Icon type="plus" className="avatar-uploader-trigger" />
                                        }
                                    </Upload>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal}
                                    label="备注"
                                    validateStatus={this.state.validation.remarks_status}
                                    help={this.state.validation.remarks_help}
                                >
                                    <Input placeholder=""　value={this.state.modalModel.tips}
                                           onChange={(event)=>{
                                           var remarks_validation = service.validation.base.form_product.productRemarks(event.target.value) ;
                                            this.setState({
                                                modalModel : {
                                                    ...this.state.modalModel ,
                                                    tips : event.target.value
                                                } ,
                                                validation : {
                                                    ...this.state.validation ,
                                                    remarks_status : remarks_validation.validateStatus ,
                                                    remarks_help : remarks_validation.help ,
                                                },
                                            })
                                        }}
                                    />
                                </FormItem>
                                <FormItem
                                    {...formItemLayout_modal_submit}
                                >
                                    <Button type="ghost" className={this._unit_className('new1')} htmlType="submit" onClick={this._ev_submit_saveAdd.bind(this)}>保存并新增</Button>
                                    <Button type="primary" className={this._unit_className('new2')} htmlType="submit" onClick={this._ev_submit_save.bind(this)}>保存</Button>

                                    <Button type="primary" className={this._unit_className('edit')} htmlType="submit" onClick={this._ev_submit_edit.bind(this)}>保存</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </Modal>


                    <Layer
                        addClass="layer1"
                        layerShow={this.props.base.b_productState.layerShow1}
                        _handleLayerHide={()=>{
                            this.props.layerShow1({
                                isShow : false ,
                                value : {}
                            })
                        }}
                    >
                        <div className="header">
                            {/*<span className="product-name">{this.props.base.b_product.details.product}</span>*/}
                            
                            <span 
                                className="product-name"
                                onClick={()=>{
                                    this.props.layerShow1({
                                        isShow : false ,
                                        value : {}
                                    })
                                }}
                            >
                                <i className="sprite-arrow3"></i>
                                <span className="re-arrow">返回</span>
                            </span>

                            <div className="operation">
                                {/*<a
                                    className="left-arrow"
                                    onClick={()=>{
                                        this.props.layerShow1({
                                            isShow : false ,
                                            value : {}
                                        })
                                    }}
                                >&lt;</a>*/}

                                <a
                                    className="edit-arrow"
                                    title="编辑货品"
                                    onClick={(event)=>{
                                        globalStore.dispatch(modalShow1({
                                            isShow : true ,
                                            operation : 'edit'
                                        }))　;
                                        service.base.fetchBaseProductDetail({
                                            itemId : this.props.base.b_product.details.itemId
                                        },(error,result) => {
                                            if ( !error ){
                                                globalEvent.base.editProduct.dispatch({
                                                    operation : 'edit' ,
                                                    data : result.data ,
                                                    validation : {
                                                        name_status : '' ,
                                                        name_help : '' ,
                                                        cost_status : '' ,
                                                        cost_help : '' ,
                                                        type_status : '' ,
                                                        type_help : '' ,
                                                        brand_status : '' ,
                                                        brand_help : '' ,
                                                        spec_status : '' ,
                                                        spec_help : '' ,
                                                        amount_status : '' ,
                                                        amount_help : '' ,
                                                        unit_status : '' ,
                                                        unit_help : '' ,
                                                        // sort_status : '' ,
                                                        // sort_help : '' ,
                                                        remarks_status : '' ,
                                                        remarks_help : '' ,
                                                    } ,
                                                }) ;
                                            }
                                        }) ;
                                   }}
                                >
                                    <i className="saas-icon saas-icon-edit"></i>
                                    {/*<span>编辑</span>*/}
                                </a>

                                <a className="down-arrow">
                                    {/*<span>更多</span>*/}
                                    <i className="saas-icon saas-icon-more"></i>
                                    <ul className="more-operation-ul">
                                        <Popconfirm
                                            title="确认删除这个商品吗?"
                                            onConfirm={()=>{
                                                service.base.deleteBaseProduct({
                                                    itemId : this.props.base.b_product.details.itemId
                                                },(result)=>{
                                                    if ( result.mark == '000000000' ){
                                                        globalFunction.alert.info( '删除商品成功'　,　'操作提示'　) ;
                                                        service.base.initBaseProduct({
                                                            tenantId : window.globalStore.getState().userstore.user.tenantId ,

                                                            itemName : '' ,
                                                            categoryId : '' ,
                                                            brandId : '' ,
                                                            specification : '' ,

                                                            pageSize :10,
                                                            pageNum : 1,
                                                        },(error,data)=>{
                                                            window.globalFunction.alert.info( '商品删除成功' , '操作提示' ) ;
                                                            globalStore.dispatch(baseProductInit(data)) ;
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
                                            <li>删除货品</li>
                                        </Popconfirm>
                                        <Auth
                                            authIndex="60"
                                        >
                                            <li onClick={()=> {
                                                globalStore.dispatch(push('/statistics/s_invoicing/s_d_invoicing')) ;
                                                this.props.layerShow1({
                                                    isShow : false ,
                                                    value : {}
                                                });
                                            }}>查看进销对比</li>
                                        </Auth>
                                    </ul>
                                </a>
                            </div>

                        </div>
                        <div className="content-wrap">

                            <div className="content-title">
                                <span className="title-name">{this.props.base.b_product.details.product}</span>
                            </div>

                            <div className="content">

                                <Detail 
                                    detailAttr={this.props.DETAIL_ATTR}
                                    detail={this.props.base.b_product.details}
                                    /* detail={this.__findDetails(this.props.base.b_productState.showId)} */
                                ></Detail>

                            </div>
                        </div>
                    </Layer>
                    </QueueAnim>
                </div>
            </div>
        )
    }
    __findDetails(id){
        let result = {} ;
        this.props.base.b_product.dataSource.data.forEach((v)=>{
            if ( v.id === id ){
                result = v
            }
        }) ;
        return result ;
    }
} ;

B_Product.defaultProps = {

    COLUMNS : COLUMNS ,

    DETAIL_ATTR : DETAILS ,
    // COLUMNS_PRODUCT_DETAIL : COLUMNS_PRODUCT_DETAIL ,

} ;

export default connect(
    ( state ) => {
        var base = state.base ;
        return {
            base
        }
    },
    {
        baseProductInit ,
        baseProductTable ,

        baseProductCategoryFilter ,
        baseProductBrandFilter ,
        baseProductUnitFilter ,

        modalShow1 ,
        modalShow3_product ,
        layerShow1 ,
        cancelImport_product ,
        startImport_product ,

    }
)(B_Product)
