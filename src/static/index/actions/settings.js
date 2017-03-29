import {
    SHOW_FEEDBACK ,
    TYPING_FEEDBACK
} from '../constants'

//
export function initSettingsPersonal(data) {
    return {
        type: 'INIT_SETTINGS_PERSONAL' ,
        data : data
    }
}
export function settingsPersonalModal1Show(isShow){
    return {
        type : 'SETTINGS_PERSONAL_MODAL1_SHOW' ,
        state : !!isShow ? true : false
    }
}

//
export function initSettingsCompany(data) {
    return {
        type: 'INIT_SETTINGS_COMPANY',
        data : data
    }
}

//
export function settingsTeamInit(data){
    return {
        type : 'SETTINGS_TEAM_INIT' ,
        data : data 
    }
}
export function settingsTeamInitInvite(data){
    return {
        type : 'SETTINGS_TEAM_INIT_INVITE' ,
        data : data
    }
}
export function settingsTeamTable(data){
    return {
        type : 'SETTINGS_TEAM_TABLE' ,
        data : data
    }
}
export function settingsTeamInviteTable(data){
    return {
        type : 'SETTINGS_TEAM_INVITE_TABLE' ,
        data : data
    }
}
export function settingsTeamSearchPhone(data){
    return {
        type : 'SETTINGS_TEAM_SEARCH_PHONE' ,
        data : data
    }
}
export function settingsTeamAdminTable(data){
    return {
        type : 'SETTINGS_TEAM_ADMIN_TABLE' ,
        data : data
    }
}
export function initSettingsLog(data){
    return {
        type : 'INIT_SETTINGS_LOG' ,
        data : data
    }
}
export function tableSettingsLog(data){
    return {
        type : 'TABLE_SETTINGS_LOG' ,
        data : data
    }
}
export function initSettingsFeedback(data){
    return {
        type : 'INIT_SETTINGS_FEEDBACK' ,
        data : data
    }
}
export function modal1Show(data){
    return {
        type : 'SETTINGS_TEAM_MODAL1_SHOW' ,
        data : data
    }
}
export function modal2Show(data){
    return {
        type : 'SETTINGS_TEAM_MODAL2_SHOW' ,
        data : data
    }
}
export function modal2TabChange(data) {
    return {
        type : 'MODAL2_TAB_CHANGE' ,
        data : data ,
    }
}
export function layer1Show(data){
    return {
        type : 'SETTINGS_TEAM_LAYER1_SHOW' ,
        data : data ,
    }
}
export function layer1PageChange(data){
    return {
        type : 'SETTINGS_TEAM_LAYER1_PAGE_CHANGE' ,
        data : data ,
    }
}
export function layer2Show(data){
    return {
        type : 'SETTINGS_TEAM_LAYER2_SHOW' ,
        data : data ,
    }
}
export function layer2Mode(data) {
    return {
        type : 'SETTINGS_TEAM_LAYER2_MODE' ,
        data : data
    }
}
export function showFeedback() {
    return {
        type: SHOW_FEEDBACK
    }
}
export function typingFeedback() {
    return {
        type: TYPING_FEEDBACK
    }
}