import React from 'react'
import {
    connect
} from 'react-redux'
import moment from 'moment'
import QueueAnim from 'rc-queue-anim'
import ReactEcharts from 'echarts-for-react' ;

import BigNumber from 'bignumber.js' ;

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

import * as service from '../../../../service'

class S_A_Sale extends React.Component {
    constructor(props){
        super(props) ;
        this.state = {
            filter : {
                startDate : moment().subtract(6, 'days').format('YYYY-MM-DD') ,
                endDate : moment().format('YYYY-MM-DD') ,
            } ,
            chartSale : {
                rate : '0' ,
                totalSales : '0' ,
                chartData : {
                    color: ['#03d6d1'],
                    tooltip : {
                        formatter : "{b} : {c}元"
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : [],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value' ,
                            name: '金额（元）',
                        }
                    ],
                    series : [
                        {
                            name:'销售额',
                            type:'line', //折线图
                            data:[]
                        }
                    ]
                }
            }
        }
    }
    componentDidMount(){
        var self = this ;
        var params = {};
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.statistics.initMarketSale(params,(error,data) => {
            if(!error){
                var saleArray = data.table.data.statisticsResults;
                let sale_data = [];  //毛利
                let sale_date = [];
                let sale_total = 0;
                ;(function () {
                    try{
                        for( let i=0; i<saleArray.length; i++){
                            sale_date[i] = saleArray[i].abscissaPoint;
                        }
                        sale_data = saleArray.map((v,i) => {
                            return v.salesAmount;
                        });
                        sale_total = self.__plusAll(saleArray,self.state.chartSale.totalSales,'statistics') ;
                    } catch (e){
                        console.warn( '销售额图表数据处理失败。' ) ;
                    }
                })() ;
                this.setState({
                    chartSale : {
                        ...this.state.chartSale ,
                        totalSales : sale_total ,
                        chartData : {
                            ...this.state.chartSale.chartData ,
                            xAxis : [
                                {
                                    type : 'category',
                                    data : sale_date,
                                    axisTick: {
                                        alignWithLabel: true
                                    } ,
                                }
                            ],
                            series : [
                                {
                                    name:'销售毛利',
                                    type:'line', //折线图
                                    data: sale_data
                                }
                            ]
                        } ,
                    },
                }) ;
            }
        })
    }
    _ev_filterSearch(){
        var self = this ;
        var params = {
            startDate : this.state.filter.startDate , //开始日期
            endDate : this.state.filter.endDate ,
        }
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.statistics.fetchMarketSale(params,(error,data) => {
            console.log(data);
            var saleArray = data.data.statisticsResults;
            if(!error){
                let sale_data = [];  //毛利
                let sale_date = [];
                let sale_total = 0;
                ;(function () {
                    try{
                        for( let i=0; i<saleArray.length; i++){
                            sale_date[i] = saleArray[i].abscissaPoint;
                        }
                        sale_data = saleArray.map((v,i) => {
                            return v.salesAmount;
                        });
                        sale_total = self.__plusAll(saleArray,self.state.chartSale.totalSales,'statistics') ;
                    } catch (e){
                        console.warn( '销售额图表数据处理失败。' ) ;
                    }
                })() ;
                this.setState({
                    chartSale : {
                        ...this.state.chartSale ,
                        totalSales : sale_total ,
                        chartData : {
                            ...this.state.chartSale.chartData ,
                            xAxis : [
                                {
                                    type : 'category',
                                    data : sale_date,
                                    axisTick: {
                                        alignWithLabel: true
                                    } ,
                                }
                            ],
                            series : [
                                {
                                    name:'销售毛利',
                                    type:'line', //折线图
                                    data: sale_data
                                }
                            ]
                        } ,
                    },
                }) ;
            }
        })
    }
    _ev_sale_changeRate(event){
        var rate = event.target.value;
        var self = this;
        self.setState({
            chartSale : {
                ...self.state.chartSale ,
                rate : rate
            }
        },()=> {
            if( rate == '0' ){
                var params = {
                    timeType : rate ,
                }
                if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                    params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                } else {
                    params.userId = window.globalStore.getState().userstore.user.id ;
                }
                service.statistics.fetchMarketSale(params , (error , data)=>{
                    if(!error){
                        var saleArray = data.data.statisticsResults ;
                        let sale_data = [];  //毛利
                        let sale_date = [];
                        let sale_total = 0;
                        ;(function () {
                            try{
                                for( let i=0; i<saleArray.length; i++){
                                    sale_date[i]= saleArray[i].abscissaPoint ;
                                }
                                sale_data = saleArray.map((v,i) => {
                                    return v.salesAmount;
                                });
                                sale_total = self.__plusAll(saleArray,self.state.chartSale.totalSales,'statistics') ;
                            } catch (e){
                                console.warn( '销售额图表数据处理失败。' ) ;
                            }
                        })() ;
                        this.setState({
                            chartSale : {
                                ...self.state.chartSale ,
                                totalSales : sale_total ,
                                chartData : {
                                    ...self.state.chartSale.chartData ,
                                    xAxis : [
                                        {
                                            type : 'category',
                                            data : sale_date,
                                            axisTick: {
                                                alignWithLabel: true
                                            } ,
                                        }
                                    ],
                                    series : [
                                        {
                                            name:'销售毛利',
                                            type:'line', //折线图
                                            data: sale_data
                                        }
                                    ]
                                } ,
                            },
                        }) ;
                    }
                });
            }else{
                var params = {
                    timeType : rate ,
                }
                if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
                    params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
                    params.roleId = 1 ;
                } else {
                    params.userId = window.globalStore.getState().userstore.user.id ;
                    params.roleId = 3 ;
                }
                service.home.abnormal_market(params , (error , data)=>{
                    console.log(data);
                    if(!error){
                        var saleArray = data.data.dashBoardDtos ;
                        let sale_data = [];  //毛利
                        let sale_date = [];
                        let sale_total = 0;
                        ;(function () {
                            try{
                                var rate = saleArray[0] && parseInt(saleArray[0].abscissaPoints);
                                if(rate==12){
                                    sale_date = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
                                }else if(rate>12&&rate<32){
                                    for( let i=0; i<rate; i++){
                                        sale_date[i]=i+'日';
                                    }
                                }else{
                                    for( let i=0; i<rate; i++){
                                        sale_date[i]=i+'周';
                                    }
                                }
                                sale_data = saleArray.map((v,i) => {
                                    return v.soAmount;
                                });
                                sale_total = self.__plusAll(saleArray,self.state.chartSale.totalSales,'dashboard') ;
                            } catch (e){
                                console.warn( '销售额图表数据处理失败。' ) ;
                            }
                        })() ;
                        this.setState({
                            chartSale : {
                                ...self.state.chartSale ,
                                totalSales : sale_total ,
                                chartData : {
                                    ...self.state.chartSale.chartData ,
                                    xAxis : [
                                        {
                                            type : 'category',
                                            data : sale_date,
                                            axisTick: {
                                                alignWithLabel: true
                                            } ,
                                        }
                                    ],
                                    series : [
                                        {
                                            name:'销售毛利',
                                            type:'line', //折线图
                                            data: sale_data
                                        }
                                    ]
                                } ,
                            },
                        }) ;
                    }
                });
            }
        });
    }
    render(){
        return (
            <div className="statistics-saleChart">
                <QueueAnim>
                    {this.state.chartSale.rate == '0' &&
                    <div className="filter-wrap" key="anime-1" style={{}}>
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
                            <span className="search-btn">
                                <Button type="default" icon="search" onClick={this._ev_filterSearch.bind(this)}>查询</Button>
                            </span>
                        </span>
                    </div> }
                    <div className="tabel-wrap" key="anime-2">
                        <span className="totalSales">累计销售额：&nbsp;&nbsp;{this.state.chartSale.totalSales}元</span>
                        <RadioGroup
                            onChange={this._ev_sale_changeRate.bind(this)}
                            value={this.state.chartSale.rate}
                        >
                            <RadioButton value="2">月度</RadioButton>
                            <RadioButton value="1">周度</RadioButton>
                            <RadioButton value="0">日度</RadioButton>
                        </RadioGroup>
                        <ReactEcharts
                            ref="chart-capital"
                            className="sale-chart"
                            option={this.state.chartSale.chartData}
                            notMerge={true}
                            lazyUpdate={true}
                            style={{width: '870px',height: '450px',margin: '0 auto'}}
                        />
                    </div>
                </QueueAnim>
            </div>
        )
    }

    __plusAll(arr,defaultValue,target){
        var ret = null ;
        try {
            var _ret = 0 ;
            arr.forEach((v,i)=>{
                if(target == 'statistics'){
                    var _v = new BigNumber( v.salesAmount ) ;
                }else{
                    var _v = new BigNumber( v.soAmount ) ;
                }
                var _r = new BigNumber( _ret ) ;
                _ret = _r.plus( _v ) ;
            }) ;
            ret = _ret - 0 ;
        } catch (e){
            console.warn( '累计销售额计算错误' ) ;
        }
        if ( ret === null ){
            return defaultValue ;
        } else {
            return ret ;
        }
    }
}

export default connect(
    (state)=>{
        var statistics = state.statistics ;
        var userstore = state.userstore ;
        return {
            statistics : statistics ,
            userstore
        }
    }  ,
    {

    }
)(S_A_Sale)
