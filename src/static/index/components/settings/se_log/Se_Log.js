import React from 'react'
import { connect , dispatch } from 'react-redux'
import moment from 'moment'
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
//logic
import {
    initSettingsLog ,
    tableSettingsLog
} from '../../../actions/settings'
import * as service from '../../../service'

//const
const COLUMNS = [
    {
        title : '编号' ,
        dataIndex : 'index'　,
        key　:　'index'
    },{
        title　:　'操作类型'　,
        dataIndex : 'operationType' ,
        key : 'operationType'
    },{
        title : '操作时间' ,
        dataIndex 　:　'operationTime'　,
        key　:　'operationTime'
    },{
        title　:　'操作人'　,
        dataIndex　:　'oPerson'　,
        key　:　'oPerson'
    },{
        title　:　'IP地址'　,
        dataIndex　:　'ipAddress'　,
        key　:　'ipAddress'
    },{
        title　:　'内容类型'　,
        dataIndex　:　'contentType'　,
        key　:　'contentType'
    },{
        title　:　'详细内容'　,
        dataIndex　:　'details'　,
        key　:　'details'
    }
] ;
const PAGINATION = {
    showSizeChanger: true,
};

class Se_Log extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            filter : {
                operationType : 'all' ,
                contentType : 'all' ,
                operatingMan : 'all' ,
                startDate : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endDate : moment().format('YYYY-MM-DD') ,
            }
        }
    }
    componentDidMount(){
        service.settings.initSettingsLog({

        },(error,data) => {
            this.props.initSettingsLog(data) ;
        }) ;
    }
    _evClick_filterSearch(){
        service.settings.fetchSettingsLog({

        },(error,data)=>{
            this.props.tableSettingsLog(data) ;
        }) ;
    }
    render(){
        return (
            <div>
                <div className="center-east-north">
                    <a className="active">操作日志</a>
                </div>
                <div className="center-east-center">



                    <div className="logPage">

                        <QueueAnim>

                        <div className="filter-wrap" key="anime-1">
                            <span className="filter">
                                <span className="filter-label">操作类型</span>
                                <span className="filter-component">
                                    <Select
                                        style={{width:120}}
                                        value={this.state.filter.operationType}
                                        onChange={
                                            (value)=>{
                                                this.setState({
                                                    filter : {
                                                        ...this.state.filter ,
                                                        operationType : value
                                                    }
                                                })
                                            }
                                        }
                                    >
                                        <Option value="all" title="全部">全部</Option>
                                        {
                                            this.props.settings.log.operationType.data.map((v,i)=>{
                                                return <Option title={v.name} value={v.value} key={v.value}>{v.name}</Option>
                                            })
                                        }
                                    </Select>
                                </span>
                            </span>
                            <span className="filter">
                                <span className="filter-label">内容类型</span>
                                <span className="filter-component">
                                    <Select
                                        style={{width:120}}
                                        value={this.state.filter.contentType}
                                        onChange={
                                            (value)=>{
                                                this.setState({
                                                    filter : {
                                                        ...this.state.filter ,
                                                        contentType : value
                                                    }
                                                })
                                            }
                                        }
                                    >
                                        <Option value="all" title="全部">全部</Option>
                                        {
                                            this.props.settings.log.contentType.data.map((v,i)=>{
                                                return <Option title={v.name} value={v.value} key={v.value}>{v.name}</Option>
                                            })
                                        }
                                    </Select>
                                </span>
                            </span>
                            <span className="filter">
                                <span className="filter-label">操作人</span>
                                <span className="filter-component">
                                    <Select
                                        style={{width:120}}
                                        value={this.state.filter.operatingMan}
                                        onChange={
                                            (value)=>{
                                                this.setState({
                                                    filter : {
                                                        ...this.state.filter ,
                                                        operatingMan : value
                                                    }
                                                })
                                            }
                                        }
                                    >
                                        <Option value="all" title="全部">全部</Option>
                                        {
                                            this.props.settings.log.operatingMan.data.map((v,i)=>{
                                                return <Option title={v.name} value={v.value} key={v.value}>{v.name}</Option>
                                            })
                                        }
                                    </Select>
                                </span>
                            </span>
                            <span className="filter">
                                <span className="filter-label">操作时间</span>
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
                                </div>
                                <div className="search-wrap">
                            <span className="searc-btn">
                                <Button type="default" icon="search" onClick={this._evClick_filterSearch.bind(this)}>查询</Button>
                            </span>
                        </div>
                        <div className="tabel-wrap" key="anime-2">
                            <Table dataSource={this.props.settings.log.dataSource.data} columns={this.props.COLUMNS} pagination={this.props.PAGINATION}></Table>
                        </div>

                        </QueueAnim>

                    </div>
                </div>
            </div>

        )

    }

}
Se_Log.defaultProps = {
    COLUMNS : COLUMNS ,
    PAGINATION : PAGINATION ,
}
export default connect(
    (state) => {
        var settings = state.settings ;
        return {
            settings
        }
    },
    {
        initSettingsLog ,
        tableSettingsLog
    }
)(Se_Log)
