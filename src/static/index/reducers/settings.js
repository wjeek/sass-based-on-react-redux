import {
    SHOW_FEEDBACK ,
    TYPING_FEEDBACK
} from '../constants'
import moment from 'moment'

//store init //销售
const initialState = {
    personal : {
        details : {
            data : {
                // account : "18110908730" ,
                // address : null ,
                // addressId: null ,
                // createTime : "2016-10-09" ,
                // delFlag : "0" ,
                // fax : null ,
                // gender : null ,
                // id : "1471318825280" ,
                // invitation : null ,
                // isAdmin : "1" ,
                // jobNumber : null ,
                // mailAddress : null ,
                // memberName : null ,
                // password : "-1ef523c6b645a65441a91fa80df077c2" ,
                // portrait : null ,
                // position : null ,
                // qq : null ,
                // telephone : null ,
                // tenantId : null ,
                // tenantName : null ,
                // updateTime : "2016-10-09" ,
                // wechat : null ,
                
                //
                
                // id : '' ,
                // name : '' ,
                // sex : 'male'　,
                // post : 'boss' , //boss , purchase销售 , markedt采购 , finance财务
                // phone : '' ,
                // staticPhone : '' ,
                // email : '' ,
                // qq : '' ,
                // wechat : '' ,
                // fax : ''
            }
        },
        pageState : {
            modalShow1 : false
        }
    },
    company : {
        details : {
            data : {
                company : '' ,
                dist : '' ,
                area : '' ,
                id : '' ,
            }
        },
        city : {

        },
    },
    team : {
        totalCount : '0' ,
        dataSource : {
            data : []
        } ,
        searchPhone : {
            data : []
        } ,
        inviteSource : {
            data : []
        } ,
        adminSource : {
            data : []
        } ,
        inviteMessage : {
            imgSrc : '' ,
            inviteCode : '' ,
            inviteLink : '' ,
        },
        pageState : {
            modal1Show : false ,
            modal2Show : false ,

            modal2Tab : 0 ,

            layer1Show : false ,

            layer1Page : 'normal' , // | search

            layer2Show : false ,

            layer2Mode : 'admin' , // admin | changeAdmin | member
        },

    },
    log : {
        dataSource : []　,
        operationType : {
            data : []
        } ,
        contentType : {
            data : []
        } ,
        operatingMan : {
            data : []
        }
    },
    feedback : {
        currentIndex : 0 ,
        dataSource : []　
    } ,
}

//reducer
export default function(state = initialState, action) {
    switch ( action.type ){
        case 'INIT_SETTINGS_PERSONAL' :
            return {
                ...state ,
                personal : {
                    ...state.personal ,
                    details : action.data.personal ,
                }
            }
            break ;
        case 'SETTINGS_PERSONAL_MODAL1_SHOW' :
            return  {
                ...state ,
                personal : {
                    ...state.personal ,
                    pageState : {
                        modalShow1 : action.state
                    }
                }
            }
        //
        case 'INIT_SETTINGS_COMPANY' :
            return {
                ...state ,
                company : {
                    ...state.company ,
                    details : action.data.company ,
                    city : action.data.city ,
                }
            }
            break ;
        //
        case 'SETTINGS_TEAM_INIT' :
            console.log(action);
            return {
                ...state ,
                team : {
                    ...state.team ,
                    totalCount : ( action.data.team.data[0] && action.data.team.data[0].totalCount ) || 0 ,
                    dataSource : action.data.team ,
                    inviteMessage : action.data.inviteMessage.data ,
                    inviteSource : action.data.inviteSource ,
                    pageState : {
                        modal1Show : false ,
                        modal2Show : false ,

                        modal2Tab : 0 ,

                        layer1Show : false ,

                        layer1Page : 'normal' ,

                        layer2Show : false ,
                    }
                }
            }
            break ;
        case 'SETTINGS_TEAM_INIT_INVITE' :
            console.log(action);
            return {
                ...state ,
                team : {
                    ...state.team ,
                    totalCount : ( action.data.team.data[0] && action.data.team.data[0].totalCount ) || 0 ,
                    dataSource : action.data.team ,
                    inviteMessage : action.data.inviteMessage.data ,
                    inviteSource : action.data.inviteSource ,
                    pageState : {
                        modal1Show : false ,
                        modal2Show : true ,

                        modal2Tab : 0 ,

                        layer1Show : false ,

                        layer1Page : 'normal' ,

                        layer2Show : false ,
                    }
                }
            }
            break ;
        case 'SETTINGS_TEAM_TABLE' :
            console.log(action);
            return {
                ...state ,
                team : {
                    ...state.team ,
                    totalCount : ( action.data.data[0] && action.data.data[0].totalCount ) || 0 ,
                    dataSource : action.data ,
                }
            }
            break ;
        case 'SETTINGS_TEAM_SEARCH_PHONE' :
            return {
                ...state ,
                team : {
                    ...state.team ,
                    searchPhone : action.data ,
                }
            }
        case 'SETTINGS_TEAM_INVITE_TABLE' :
            return {
                ...state ,
                team : {
                    ...state.team ,
                    inviteSource : action.data ,
                }
            }
            break ;
        case 'SETTINGS_TEAM_ADMIN_TABLE' :
            return  {
                ...state ,
                team : {
                    ...state.team ,
                    adminSource : action.data ,
                }
            }
        case 'SETTINGS_TEAM_MODAL1_SHOW' :
            return {
                ...state ,
                team : {
                    ...state.team ,
                    pageState : {
                        ...state.team.pageState ,
                        modal1Show : !!action.data.isShow
                    }
                }
            }
            break ;
        case 'SETTINGS_TEAM_MODAL2_SHOW' :
            return {
                ...state ,
                team : {
                    ...state.team ,
                    pageState : {
                        ...state.team.pageState ,
                        modal2Show : !!action.data.isShow
                    }
                }
            }
            break ;
        case 'MODAL2_TAB_CHANGE' :
            return {
                ...state ,
                team : {
                    ...state.team ,
                    pageState : {
                        ...state.team.pageState ,
                        modal2Tab : action.data.index
                    }
                }
            }
            break ;
        case 'SETTINGS_TEAM_LAYER1_SHOW' :
            return {
                ...state ,
                team : {
                    ...state.team ,
                    pageState : {
                        ...state.team.pageState ,
                        layer1Show : !!action.data.isShow ,

                    }
                }
            }
            break ;
        case 'SETTINGS_TEAM_LAYER1_PAGE_CHANGE' :
            return {
                ...state ,
                team : {
                    ...state.team ,
                    pageState : {
                        ...state.team.pageState ,
                        layer1Page : action.data.page ,
                    }
                }
            }
        case 'SETTINGS_TEAM_LAYER2_SHOW' :
            return {
                ...state ,
                team : {
                    ...state.team ,
                    pageState : {
                        ...state.team.pageState ,
                        layer2Show : !!action.data.isShow ,
                        layer2Mode : action.data.mode || 'member' ,
                    }
                }
            }
            break ;
        case 'SETTINGS_TEAM_LAYER2_MODE' :
            var _store = {
                ...state ,
                team : {
                    ...state.team ,
                    pageState : {
                        ...state.team.pageState　,
                        layer2Mode　:　action.data.mode ,
                    }
                }
            }
            if ( action.data.mode === 'changeAdmin' ){
                _store.team.adminSource.data = action.data.admin ;
            }
            return _store ;
            break ;
        case 'INIT_SETTINGS_LOG' :
            return {
                ...state ,
                log : {
                    ...state.log ,
                    dataSource : action.data.table ,
                    operationType : action.data.OperationType ,
                    contentType : action.data.ContentType ,
                    operatingMan : action.data.Operson
                }
            }
            break ;
        case 'TABLE_SETTINGS_LOG' :
            return {
                ...state ,
                log : {
                    ...state.log ,
                    dataSource : action.data ,
                }
            }
            break ;
        case SHOW_FEEDBACK :
            return {
                ...state ,
                feedback : {
                    ...state.feedback ,
                    currentIndex : 1
                }
            }
            break ;
        case TYPING_FEEDBACK :
            return {
                ...state ,
                feedback : {
                    ...state.feedback,
                    currentIndex: 0
                }
            }
            break ;
        case 'INIT_SETTINGS_FEEDBACK' :
            return {
                ...state ,
                feedback : {
                    ...state.feedback ,
                    dataSource : action.data.table ,
                }
            }
            break ;
    }
    return state
}
