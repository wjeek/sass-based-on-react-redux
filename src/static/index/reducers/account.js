import {

} from '../constants'

//store init //账款
const initialState = {
    charge: {
        totalCount : 0 ,
        dataSource: {
            data: [] ,
        },
        productDataSource : {
            data : [
                {
                    id : 1 ,
                    operation : '' ,
                    product : '默认商品' ,
                    unit : '1个' ,
                    number : 0 ,
                    one : '$10.00' ,
                    count : '80' ,
                    price : '$100' ,
                    state : '已发货'
                },
                {
                    id : 1 ,
                    operation : '' ,
                    product : '默认商品' ,
                    unit : '1个' ,
                    number : 0 ,
                    one : '$10.00' ,
                    count : '80' ,
                    price : '$100' ,
                    state : '已发货'
                }
            ] ,
        },
        
        customer : {
            data : [] ,
        },
        payType : {
            data : []
        },
        accountType : {
            data : []
        },
        incomeType : {
            data : []
        },
        pageState:{
            layer1 : false ,
            layer2 : false ,
            showId : '' ,
            
            modal1 : false ,
            modal2 : false ,

            customer: '',
            contacter: '',
            phone: '',
            remainPrice: '',
            date: '',
            id: '',
            sellCount: '',
            payType: '',
            truePrice: '',
            shouldPrice: '',
            img: '',
            tips: '',
            operator: '',
            continualTallyDtos: []
        }
        
    },
    user : {
        totalCount : 0 ,
        dataSource : {
            data : []
        },
        user : {
            data : []
        },
        payType : {
            data : []
        },
        marketer : {
            data : []
        },

        pageState : {
            layer1Show : false ,
            modal1Show : false ,
            modal2Show : false ,
            // modal3Show : false ,
            // modal4Show : false ,
            modal5Show : false ,
            modal6Show : false ,
            modal6Show2 : false ,

            customer: '',
            contacter: '',
            phone: '',
            remainPrice: '',
            date: '',
            id: '',
            sellCount: '',
            payType: '',
            truePrice: '',
            shouldPrice: '',
            img: '',
            tips: '',
            operator: '',
            accountDetails:[0,1],
            product:[],
            productNum: ''
        }
    },
    supplier : {
        totalCount : 0 ,
        dataSource : {
            data : []
        },
        supplier : {
            data : []
        },
        payType : {
            data : []
        },
        purchaseer : {
            data : []
        },

        pageState : {
            layer1Show : false ,
            modal1Show : false ,
            modal2Show : false ,
            // modal3Show : false ,
            // modal4Show : false ,
            modal5Show : false ,

            customer: '',
            contacter: '',
            phone: '',
            remainPrice: '',
            date: '',
            id: '',
            sellCount: '',
            payType: '',
            truePrice: '',
            shouldPrice: '',
            img: '',
            tips: '',
            operator: '',
            accountDetails:[0,1],
            product:[],
            productNum: ''
        }
    }
}

//reducer
export default function(state = initialState, action) {
    switch (action.type) {
        case 'CHARGE_INIT' :
            console.log(action);
            return {
                ...state,
                charge: {
                    ...state.charge,
                    totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                    dataSource: action.data.table ,
                    cutomer : action.data.customer ,
                    payType : action.data.payType ,
                    accountType : action.data.accountType ,
                    incomeType : action.data.incomeType ,

                    pageState : {
                        layer1 : false ,
                        layer2 : false ,
                        showId : '' ,

                        modal1 : false ,
                        modal2 : false ,
                        continualTallyDtos : [1]
                    }
                },

            }
            break;
        case 'CHARGE_TABLE' :
            return {
                ...state ,
                charge : {
                    ...state.charge ,
                    totalCount : ( action.data.data[0] && action.data.data[0].totalCount - 0) || 0 ,
                    dataSource: action.data
                }
            }
        case 'CHARGE_LAYER1_SHOW' :
            return  {
                ...state  ,
                charge : {
                    ...state.charge ,
                    pageState : {
                        ...state.charge.pageState ,
                        layer1 : !!action.data.isShow ,
                        showId : action.data.showId || '' ,
                        customer: action.data.value.customerName || '',
                        contacter: action.data.data.contacter || '',
                        phone: action.data.data.phone || '',
                        remainPrice: action.data.value.arrearage || '',
                        date: action.data.value.businessTime || '',
                        id: action.data.value.salesOrderNoName || '',
                        sellCount: action.data.value.amount || '',
                        payType: action.data.value.payType_forShow || '',
                        shouldPrice: action.data.value.receivable || '',
                        img: action.data.value.imgUrl || '',
                        tips: action.data.value.comment || '',
                        operator: action.data.value.userName || '',
                        truePrice: action.data.value.received || '',
                        continualTallyDtos : action.data.value.continualTallyDtos
                    },
                    productDataSource : {
                        ...state.charge.productDataSource ,
                        data : action.data.value.salesOrderDetailDtos
                    }
                }
            }
        case 'CHARGE_LAYER1_HIDE' :
            return  {
                ...state  ,
                charge : {
                    ...state.charge ,
                    pageState : {
                        ...state.charge.pageState ,
                        layer1 : !!action.data.isShow ,
                    }
                }
            }
        case 'CHARGE_LAYER2_SHOW' :
            if(action.data.value){
                return  {
                    ...state  ,
                    charge : {
                        ...state.charge ,
                        pageState : {
                            ...state.charge.pageState ,
                            layer2 : !!action.data.isShow ,
                            showId : action.data.showId || '' ,
                            customer: action.data.value.supplierName || '',
                            contacter: action.data.data.contacter,
                            phone: action.data.data.phone,
                            remainPrice: action.data.value.arrearage || '',
                            date: action.data.value.businessTime || '',
                            id: action.data.value.purchaseOrderNoName || '',
                            sellCount: action.data.value.amount || '',
                            payType: action.data.value.payType_forShow || '',
                            shouldPrice: action.data.value.payable || '',
                            img: action.data.value.imgUrl || '',
                            tips: action.data.value.comment || '',
                            operator: action.data.value.userName || '',
                            truePrice: action.data.value.paid || '',
                            continualTallyDtos : action.data.value.continualTallyDtos
                        },
                        productDataSource : {
                            ...state.charge.productDataSource ,
                            data : action.data.value.purchaseOrderDetailDtos
                        }
                    }
                }
            }
            else{
                return  {
                    ...state  ,
                    charge : {
                        ...state.charge ,
                        pageState : {
                            ...state.charge.pageState ,
                            layer2 : !!action.data.isShow ,
                        },
                    }
                }
            }

        case 'CHARGE_MODAL1_SHOW' :
            return {
                ...state ,
                charge : {
                    ...state.charge ,
                    pageState : {
                        ...state.charge.pageState ,
                        modal1 : !!action.data.isShow ,
                    }
                }
            }
        case 'CHARGE_MODAL2_SHOW' :
            return {
                ...state ,
                charge : {
                    ...state.charge ,
                    pageState : {
                        ...state.charge.pageState ,
                        modal2 : !!action.data.isShow ,
                    }
                }

            }
        //
        case 'USER_INIT' :
            return  {
                ...state ,
                user : {
                    ...state.user ,
                    totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                    dataSource : action.data.table ,
                    user : action.data.user ,
                    payType : action.data.payType ,
                    marketer : action.data.marketer ,

                    pageState : {
                        layer1Show : false ,
                        modal1Show : false ,
                        modal2Show : false ,
                        modal3Show : false ,
                        modal4Show : false ,
                        accountDetails : [0],
                        product : [{}]
                    }

                }
            }
        case 'USER_TABLE' :
            return  {
                ...state ,
                user : {
                    ...state.user ,
                    totalCount : ( action.data.data[0] && action.data.data[0].totalCount - 0) || 0 ,
                    dataSource : action.data ,
                }
            }

        case 'USER_LAYER1_SHOW' :
            if(action.data.value){
                return {
                    ...state ,
                    user : {
                        ...state.user ,
                        pageState : {
                            ...state.user.pageState ,
                            layer1Show : !!action.data.isShow ,
                            showId : action.data.showId || '' ,
                            customer: action.data.value.customerName_forShow || '',
                            contacter: action.data.data.contacter,
                            phone: action.data.data.phone ,
                            remainPrice: action.data.value.shouldPrice || '',
                            date: action.data.value.endDate || '',
                            id: action.data.value.id_forShow || '',
                            sellCount: action.data.value.sellCount || '',
                            payType: action.data.value.payType_forShow || '',
                            shouldPrice: action.data.value.shouldPrice || '',
                            img: action.data.value.img || '',
                            tips: action.data.value.tips || '',
                            operator: action.data.value.operator || '',
                            truePrice: action.data.value.truePrice || '',
                            accountDetails: action.data.value.accountDetails,
                            product: action.data.value.product,
                            productNum : action.data.value.productNum,
                        }
                    }
                }
            }
            else{
                return {
                    ...state ,
                    user : {
                        ...state.user ,
                        pageState : {
                            ...state.user.pageState ,
                            layer1Show : !!action.data.isShow ,
                        }
                    }
                }
            }


        case 'USER_MODAL1_SHOW' :
            return {
                ...state ,
                user : {
                    ...state.user ,
                    pageState : {
                        ...state.user.pageState ,
                        modal1Show : !!action.data.isShow ,
                    }
                }
            }
        case 'USER_MODAL2_SHOW' :
            return {
                ...state ,
                user : {
                    ...state.user ,
                    pageState : {
                        ...state.user.pageState ,
                        modal2Show : !!action.data.isShow ,
                    }
                }
            }
        // case 'USER_MODAL3_SHOW' :
        //     return {
        //         ...state ,
        //         user : {
        //             ...state.user ,
        //             pageState : {
        //                 ...state.user.pageState ,
        //                 modal3Show : !!action.data.isShow ,
        //             }
        //         }
        //     }
        // case 'USER_MODAL4_SHOW' :
        //     return {
        //         ...state ,
        //         user : {
        //             ...state.user ,
        //             pageState : {
        //                 ...state.user.pageState ,
        //                 modal4Show : !!action.data.isShow ,
        //             }
        //         }
        //     }
        case 'USER_MODAL5_SHOW' :
            return {
                ...state ,
                user : {
                    ...state.user ,
                    pageState : {
                        ...state.user.pageState ,
                        modal5Show : !!action.data.isShow ,
                    }
                }
            }
        case 'USER_MODAL6_SHOW' :
            return {
                ...state ,
                user : {
                    ...state.user ,
                    pageState : {
                        ...state.user.pageState ,
                        modal6Show : !!action.data.isShow ,
                    }
                }
            }
        case 'USER_MODAL6_SHOW_2' :
            return {
                ...state ,
                user : {
                    ...state.user ,
                    pageState : {
                        ...state.user.pageState ,
                        modal6Show2 : !!action.data.isShow ,
                    }
                }
            }
        //
        case 'SUPPLIER_INIT' :
            return  {
                ...state ,
                supplier : {
                    ...state.supplier ,
                    totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                    dataSource : action.data.table ,
                    supplier : action.data.supplier ,
                    payType : action.data.payType ,
                    purchaseer : action.data.purchaseer ,

                    pageState : {
                        layer1Show : false ,
                        modal1Show : false ,
                        modal2Show : false ,
                        modal3Show : false ,
                        modal4Show : false ,
                        accountDetails : [0],
                        product : [{}]
                    }

                }
            }
        case 'SUPPLIER_TABLE' :
            return  {
                ...state ,
                supplier : {
                    ...state.supplier ,
                    totalCount : ( action.data.data[0] && action.data.data[0].totalCount - 0) || 0 ,
                    dataSource : action.data ,
                }
            }

        case 'SUPPLIER_LAYER1_SHOW' :
            if(action.data.value){
                return {
                    ...state ,
                    supplier : {
                        ...state.supplier ,
                        pageState : {
                            ...state.supplier.pageState ,
                            layer1Show : !!action.data.isShow ,
                            showId : action.data.showId || '' ,
                            customer: action.data.value.supplierName_forShow || '',
                            contacter: action.data.data.contacter,
                            phone: action.data.data.phone ,
                            remainPrice: action.data.value.shouldPrice || '',
                            date: action.data.value.date || '',
                            id: action.data.value.id_forShow || '',
                            sellCount: action.data.value.purchaseCount || '',
                            payType: action.data.value.payType_forShow || '',
                            shouldPrice: action.data.value.shouldPrice || '',
                            img: action.data.value.img || '',
                            tips: action.data.value.tips || '',
                            operator: action.data.value.operator || '',
                            truePrice: action.data.value.truePrice || '',
                            accountDetails: action.data.value.accountDetails,
                            product: action.data.value.product,
                            productNum : action.data.value.productNum,
                        }
                    }
                }
            }
            else{
                return {
                    ...state ,
                    supplier : {
                        ...state.supplier ,
                        pageState : {
                            ...state.supplier.pageState ,
                            layer1Show : !!action.data.isShow ,
                        }
                    }
                }
            }
        case 'SUPPLIER_MODAL1_SHOW' :
            return {
                ...state ,
                supplier : {
                    ...state.supplier ,
                    pageState : {
                        ...state.supplier.pageState ,
                        modal1Show : !!action.data.isShow ,
                    }
                }
            }
        case 'SUPPLIER_MODAL2_SHOW' :
            return {
                ...state ,
                supplier : {
                    ...state.supplier ,
                    pageState : {
                        ...state.supplier.pageState ,
                        modal2Show : !!action.data.isShow ,
                    }
                }
            }
        case 'SUPPLIER_MODAL5_SHOW' :
            return {
                ...state ,
                supplier : {
                    ...state.supplier ,
                    pageState : {
                        ...state.supplier.pageState ,
                        modal5Show : !!action.data.isShow ,
                    }
                }
            }
        default:    
            return state;
    }
}
