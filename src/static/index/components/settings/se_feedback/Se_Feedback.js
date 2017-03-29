import React from 'react'
import { connect , dispatch } from 'react-redux'
import cx from 'classnames'
import QueueAnim from 'rc-queue-anim'
//component
import {
    Button , Pagination , Select , Input , DatePicker , Table , Form , Modal , Radio , Checkbox ,
    Upload ,
    Row , Col , Popconfirm ,
    Icon
} from 'antd/dist/antd.js'
const Option = Select.Option ;
const FormItem = Form.Item ;
const confirm = Modal.confirm ;
const RadioButton = Radio.Button ;
const RadioGroup = Radio.Group ;
//logic
import {
    showFeedback ,
    typingFeedback ,
    initSettingsFeedback
} from '../../../actions/settings'
import utils from '../../../service/utils/index'
import * as service from '../../../service'

import {
    USER_NAME,
    TENANT_ID
} from '../../../constants' ;

const COLUMNS = [
    {
        title : '时间' ,
        // dataIndex : 'sugTime'　,
        // key　:　'sugTime' ,
        dataIndex : 'createTime' ,
        key : 'createTime' ,
    },{
        title　:　'问题类型'　,
        dataIndex : 'type' ,
        key : 'type' ,
        render : (text)=>{
            if ( text == '1' ){
                return (
                    <span>产品建议</span>
                )
            } else if( text=='2'){
                return (
                    <span>服务投诉</span>
                )
            } else if( text=='3'){
                return (
                    <span>功能异常</span>
                )
            }
        }
    },{
        title : '反馈内容' ,
        dataIndex 　:　'content'　,
        key　:　'content'
    },{
        title　:　'问题截图'　,
        dataIndex　:　'imgUrl'　,
        key　:　'imgUrl',
        render :　(text,value)=>{
            return　(
                <a href={text} target="_blank">
                    <i
                        title="查看问题截图"　
                        target="_blink"　
                        className="sprite-view dib-table-icon"
                    ></i>
                </a>
            )
        }
    },{
        title　:　'联系方式'　,
        dataIndex　:　'contact'　,
        key　:　'contact'
    },{
        title　:　'状态'　,
        dataIndex　:　'state_forShow'　,
        key　:　'state_forShow'
    },
    /*{
        title　:　'操作'　,
        dataIndex　:　'operation'　,
        key　:　'operation' ,
        render: (text,value) => {
            return (
                <span>
                <Popconfirm
                    title="确认删除这个客户吗?"
                    onConfirm={()=>{
                        service.account.deleteChargeAccount({
                                id : value.orderID - 0
                        },(result)=>{
                            if ( result.mark == '000000000' ){
                                globalFunction.alert.info( '删除用户成功'　,　'操作提示'　) ;
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
                            <a className="cell-link cell-operation"
                               value={value.id}
                               onClick={(event)=>{
                                       console.log(value.id) ;
                                    }
                                }
                            >删除</a>
                        </Popconfirm>
            </span>
            )
        }
    }*/
] ;
const PAGINATION = {
    showSizeChanger: true,
};

class Se_Feedback extends React.Component {
    constructor(props){
        super(props) ;
        this.state= {
            priviewVisible: false,
            priviewImage: '',
            inputCount: 300,
            phone : '',
            text : '',
            type : 1,
            img: '',
            valid:{
                hasInput: false,
                legalImg: true,
                legalContact: true,
                changeContact: false,
            },

            changeType : (value)=>{
                this.setState({
                        ...this.state,
                        type : value.data
                    }
                )
            }


        }
    }
    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    }
    _ev_input_text_onchange(event){
        let text=event.target.value;
        let validLength=text.replace(/\s+/g,"").length;
        let leftLength=300-text.length;
        if(validLength>0){
            this.setState({
                ...this.state,
                text : text,
                valid:{
                    ...this.state.valid,
                    hasInput: true,
                }
            });
        }else{
            this.setState({
                ...this.state,
                text : text,
                valid:{
                    ...this.state.valid,
                    hasInput: false,
                }
            });
        }
        if(leftLength<=0){
            this.setState({
                inputCount: 0,
            });
        }else {
            this.setState({
                inputCount: leftLength,
            });
        }
    }
    _ev_input_phone_onchange(event){
        let phone=event.target.value;
        let reg1=/^[0-9]{5,10}$/;
        let reg2=/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        let reg3=/^((\+?86)|(\(\+86\)))?\d{3,4}-\d{7,8}(-\d{3,4})?$|^((\+?86)|(\(\+86\)))?1\d{10}$/;
        let reg=reg1.test(phone)||reg2.test(phone)||reg3.test(phone);
        if((!reg)){
            this.setState({
                ...this.state,
                phone : phone,
                valid:{
                    ...this.state.valid,
                    legalContact: false,
                    changeContact: true,
                }
            });
        }else{
            this.setState({
                ...this.state,
                phone : phone,
                valid:{
                    ...this.state.valid,
                    legalContact: true,
                    changeContact: true,
                }
            });
        }
    }
    handleSubmit(){
        var text = this.state.text;
        var phone = this.state.phone;
        var type = this.state.type;
        var img = this.state.img;
        service.settings.feedbackSubmit({
            type : type,
            imgUrl : img,
            contact : phone,
            content : text
        },(error,data) => {
            if(!error){
                console.log(data);
                service.settings.initSettingsFeedback({

                },(error,data) => {
                    this.props.initSettingsFeedback(data) ;
                }) ;
                this.props.showFeedback() ;
            }
        }) ;
    }
    componentDidMount(){
        service.settings.initSettingsFeedback({
            tenantId : window.globalStore.getState().userstore.user.tenantId
        },(error,data) => {
            this.props.initSettingsFeedback(data) ;
        }) ;

        globalEvent.settings.changeType = new signals.Signal() ;
        globalEvent.settings.changeType.add(this.state.changeType) ;
    }
    render(){
        var class1 = cx({
            'feedbackBox' : true ,
            'list-show' : ( this.props.settings.feedback.currentIndex　===　0 )
        }) ;
        var class2 = cx({
            'feedbackBox' : true ,
            'typing-show' : ( this.props.settings.feedback.currentIndex　===　1 )
        }) ;
        const imgProps = {
            action: '/api/upload-file-IMG001',
            listType: 'picture-card',
            defaultFileList: [{
                uid: -1,
                name: 'xxx.png',
                status: 'done',
                url: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
                thumbUrl: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
            }],
            onChange: (info)=>{
                // console.log( arguments ) ;
                let fileList = info.fileList;
                console.log( fileList ) ;
            },
            onPreview: (file) => {
                console.log(file) ;
                this.setState({
                    priviewImage: file.url,
                    priviewVisible: true,
                });
            },
        };
        return (
            <div>
                <div className="center-east-north">
                    <a className="active">意见反馈</a>
                    { this.props.settings.feedback.currentIndex==0?<Button className="history" onClick={this.props.showFeedback.bind(this)}>历史反馈</Button>
                        :<Button className="changePostPage" onClick={this.props.typingFeedback.bind(this)}>发送反馈</Button>}
                </div>
                <div className="center-east-center">

                    <QueueAnim>

                    <div className={class1} key="anime-1">
                        <div className="feedbackContents">
                            <div className="feedbackTypes">
                                <div className="types">
                                    <span>问题类型</span>
                                    <RadioGroup defaultValue="1" size="large"onChange={(event)=>{
                                                globalEvent.settings.changeType.dispatch({
                                                    data :  event.target.value,
                                                }) ;
                                            }
                                        }>
                                        <RadioButton value="1">产品建议</RadioButton>
                                        <RadioButton value="2">服务投诉</RadioButton>
                                        <RadioButton value="3">功能异常</RadioButton>
                                    </RadioGroup>
                                </div>
                            </div>
                            <div className="contentText">
                                <span className="title">反馈内容</span>
                                <span className="bitian">(*必填)</span>
                                <Input type="textarea" rows={7} placeholder="请在此描述您的问题和建议"
                                       size="large" onChange={this._ev_input_text_onchange.bind(this)}/>
                                <span className="textLeft">您还能输入{this.state.inputCount}字</span>
                            </div>
                            <div className="contentImg">
                                <FormItem
                                    label="问题截图"
                                >
                                    <Upload
                                        className="antd-img-uploader"
                                        name="file"
                                        showUploadList={false}
                                        action="/api/upload-file-SAITEM007"
                                        onChange={(info)=>{
                                            if (info.file.status === 'done') {
                                                var result = info.file.response ;
                                                if ( result.mark == '000000000' ){
                                                    globalFunction.alert.info( '图片上传成功' , '操作提示' ) ;
                                                    this.setState({
                                                        img : result.data.img_url
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
                                            this.state.img ?
                                                <img src={this.state.img} role="presentation" className="ehsy-image" /> :
                                                <Icon type="plus" className="avatar-uploader-trigger" />
                                        }
                                    </Upload>
                                </FormItem>
                            </div>
                            <div className="contentPhone">
                                <span className="title">联系方式</span>
                                <Input size="large" placeholder="请填写您的QQ/邮箱/手机号码"
                                       onChange={this._ev_input_phone_onchange.bind(this)}/>
                                <span className="phoneTips">请留下您的联系方式，以便更好地为您服务</span>
                                {this.state.valid.legalContact==false?<span className="phoneError">请输入正确格式</span>:''}
                            </div>

                            {this.state.valid.hasInput&&this.state.valid.legalImg&&this.state.valid.legalContact && this.state.valid.changeContact?
                            <Button type="primary" onClick={this.handleSubmit.bind(this)}>提交</Button>
                                :<Button type="primary" disabled>提交</Button>}

                            <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
                                <img alt="example" src={this.state.priviewImage} />
                            </Modal>
                        </div>
                    </div>
                    <div className={class2} key="anime-2">
                        <Table dataSource={this.props.settings.feedback.dataSource.data} columns={this.props.COLUMNS} pagination={this.props.PAGINATION}></Table>
                    </div>

                    </QueueAnim>
                    
                </div>
            </div>

        )

    }

}
Se_Feedback.defaultProps = {
    COLUMNS : COLUMNS ,
    PAGINATION : PAGINATION ,
}
export default connect(
    (state) => {
        var settings = state.settings ;
        return {
            settings ,
        }
    },
    {
        showFeedback ,
        typingFeedback ,
        initSettingsFeedback
    }
)(Se_Feedback)
