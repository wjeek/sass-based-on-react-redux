import {

} from '../constants'


//store init
const initialState = {
    market : {
        product : {
            totalCount : 0 ,
            dataSource : {
                data : []
            },
            product : {
                data : []
            } ,
            brand : {
                data : []
            } ,
            specifications : {
                data : []
            }
        },
        user : {
            totalCount : 0 ,
            dataSource : {
                data : []
            },
            customer : {
                data : []
            } ,
            contacter : {
                data : []
            } ,
        },
        market : {
            totalCount : 0 ,
            dataSource : {
                data : []
            },
            market : {
                data : []
            } ,
        },
        sale : {
            dataSource : {
                data : []
            }
        }
    },
    purchase : {
        product : {
            totalCount : 0 ,
            dataSource : {
                data : []
            },
            product : {
                data : []
            } ,
            brand : {
                data : []
            } ,
            specifications : {
                data : []
            }
        },
        supplier : {
            totalCount : 0 ,
            dataSource : {
                data : []
            },
            supplier : {
                data : []
            } ,
            contacter : {
                data : []
            } ,
        },
        purchase : {
            totalCount : 0 ,
            dataSource : {
                data : []
            },
            purchase : {
                data : []
            } ,
        }
    },
    account : {
        account : {
            dataSource : {
                data : []
            },
        },
        pay : {
            totalCount : 0 ,
            dataSource : {
                data : []
            },
        }
    },
    invoicing : {
        invoicing : {
            totalCount : 0 ,
            dataSource : {
                data : [] ,
            },
            product : {
                data : [] ,
            },
            brand : {
                data : [] ,
            },
            specifications : {
                data : []
            }
        },
    }
}

//reducer
export default function(state = initialState, action) {
    switch (action.type) {
        case 'INIT_MARKET_PRODUCT' :
            return {
                ...state,
                market : {
                    ...state.market,
                    product : {
                        ...state.market.product ,
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource: action.data.table ,
                        product : action.data.product ,
                        brand : action.data.brand ,
                        specifications : action.data.specifications
                    }
                },
            }
        break ;
        case 'TABLE_MARKET_PRODUCT' :
            return {
                ...state,
                market : {
                    ...state.market,
                    product : {
                        ...state.market.product ,
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource: action.data ,
                    }
                },
            }
        //
        case 'INIT_MARKET_USER' :
            return {
                ...state,
                market : {
                    ...state.market,
                    user : {
                        ...state.market.user ,
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0,
                        dataSource: action.data.table ,
                        customer : action.data.customer ,
                        contacter : action.data.contacter ,
                    }
                },
            }
        case 'TABLE_MARKET_USER' :
            return {
                ...state,
                market : {
                    ...state.market,
                    user : {
                        ...state.market.user ,
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource: action.data ,
                    }
                },
            }
        //
        case 'INIT_MARKET_MARKET' :
            return {
                ...state,
                market : {
                    ...state.market,
                    market : {
                        ...state.market.market ,
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource: action.data.table ,
                        market : action.data.market ,
                    }
                },
            }
        case 'TABLE_MARKET_MARKET' :
            return {
                ...state,
                market : {
                    ...state.market,
                    market : {
                        ...state.market.market ,
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource: action.data ,
                    }
                },
            }
        // 销售额 和其他不一样!
        case 'INIT_MARKET_SALE' :
            return {
                ...state,
                market : {
                    ...state.market,
                    sale : {
                        ...state.market.sale ,
                        dataSource: action.data.table ,
                    }
                },
            }
        case 'TABLE_MARKET_SALE' :
            return {
                ...state,
                market : {
                    ...state.market,
                    sale : {
                        ...state.market.sale ,
                        dataSource: action.data ,
                    }
                },
            }
        //
        //
        case 'INIT_PURCHASE_PRODUCT' :
            return {
                ...state,
                purchase : {
                    ...state.purchase,
                    product : {
                        ...state.purchase.product ,
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource: action.data.table ,
                        product : action.data.product ,
                        brand : action.data.brand ,
                        specifications : action.data.specifications
                    }
                },
            }
        case 'TABLE_PURCHASE_PRODUCT' :
            return {
                ...state,
                purchase : {
                    ...state.purchase,
                    product : {
                        ...state.purchase.product ,
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource: action.data ,
                    }
                },
            }
        //
        case 'INIT_PURCHASE_SUPPLIER' :
            return {
                ...state,
                purchase : {
                    ...state.purchase,
                    supplier : {
                        ...state.purchase.supplier ,
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource: action.data.table ,
                        supplier : action.data.supplier ,
                        contacter : action.data.contacter ,
                    }
                },
            }
        case 'TABLE_PURCHASE_SUPPLIER' :
            return {
                ...state,
                purchase : {
                    ...state.purchase,
                    supplier : {
                        ...state.purchase.supplier ,
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource: action.data ,
                    }
                },
            }
        //
        case 'INIT_PURCHASE_PURCHASE' :
            return {
                ...state,
                purchase : {
                    ...state.purchase,
                    purchase : {
                        ...state.purchase.purchase ,
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource: action.data.table ,
                        purchase : action.data.purchase ,
                    }
                },
            }
        case 'TABLE_PURCHASE_PURCHASE' :
            return {
                ...state,
                purchase : {
                    ...state.purchase,
                    purchase : {
                        ...state.purchase.purchase ,
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource: action.data ,
                    }
                },
            }
        //
        case 'INIT_ACCOUNT_ACCOUNT' :
            return {
                ...state,
                account : {
                    ...state.account,
                    account : {
                        dataSource: action.data.table ,
                    }
                }
            }
        case 'TABLE_ACCOUNT_ACCOUNT' :
            return {
                ...state,
                account : {
                    ...state.account,
                    account : {
                        dataSource: action.data ,
                    }
                }
            }
        //
        case 'INIT_ACCOUNT_PAY' :
            return {
                ...state,
                account : {
                    ...state.account,
                    pay : {
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource : action.data.table ,
                    }
                }
            }
        case 'TABLE_ACCOUNT_PAY' :
            return {
                ...state,
                account : {
                    ...state.account,
                    pay : {
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource: action.data ,
                    }
                }
            }
        //
        case 'INIT_INVOICING_INVOICING' :
            return {
                ...state,
                invoicing : {
                    ...state.invoicing,
                    invoicing : {
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource : action.data.table ,
                        product : action.data.product ,
                        brand : action.data.brand ,
                        specifications : action.data.specifications
                    }
                }
            }
        case 'TABLE_INVOICING_INVOICING' :
            return {
                ...state,
                invoicing : {
                    ...state.invoicing,
                    invoicing : {
                        ...state.invoicing.invoicing ,
                        totalCount : (action.data.table.data[0] && action.data.table.data[0].totalCount - 0) || 0 ,
                        dataSource: action.data ,
                    }
                }
            }
    }
    return state
}
