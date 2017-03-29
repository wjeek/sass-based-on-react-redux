import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import cx from 'classnames' ;
import moment from 'moment' ;
import { push } from 'react-router-redux'
import BigNumber from 'bignumber.js' ;
import Sortable from 'sortablejs' ;
import QueueAnim from 'rc-queue-anim' ;

import {
    Radio , Modal , Form , Input ,
    Button ,InputGroup ,Col , Table ,
    DatePicker , Icon ,Select , Popconfirm , Checkbox ,
} from 'antd/dist/antd.js'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item ;
const Option = Select.Option ;
const CheckboxGroup = Checkbox.Group;
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react' ;

import {
    Crumbs
} from '../index'
import {
    MONTH_CN ,
    CHARTS_COLLECTION_BOSS ,
} from '../../constants/index'
import {
    home_init_alert ,
    home_market_showModal ,
} from '../../actions/home.js'

import * as service from '../../service'

// echarts.registerTheme('my_theme', {
//     backgroundColor: '#f4cccc'
// });
const COLUMNS = [
    {
        title: '类型',
        dataIndex: 'payableType',
        key: 'payableType'
    },{
        title: '摘要',
        dataIndex: 'remark',
        key: 'remark' ,
        width: 123   ,
    },{
        title: '金额',
        dataIndex: 'payable',
        key: 'payable'
    }
];

class Home extends React.Component {
    constructor(props){
        super(props) ;
        var localStoreShow = localStorage && JSON.parse( localStorage.getItem( 'chart-show-array' ) ) ;
        if ( localStoreShow === null ){
            localStoreShow = [
                'chartMarket' ,
                'chartCapital' ,
                'chartPurchaseStore' ,
                'chartMarketProfit' ,
                'chartPurchase' ,
            ] ;
        }
        this.state = {
            //boss页其他数据
            statisticsBoss : {
                isReady : false ,
                alertShould_all : 0 ,
                alertShould_delay : 0 ,
                alertPay_next : 0 ,
                alertPay_percent : 0 ,
                alertMarket_all : 0 ,
                alertMarket_percent : 0 ,
                alertStore_all : 0 ,
                alertStore_percent : 0 ,

                // chartShowList : {
                //     chartMarket : true ,
                //     chartCapital : true ,
                //     chartPurchaseStore : true ,
                //     chartMarketProfit : true ,
                //     chartPurchase : true ,
                //     chartCustomer : false ,
                //     chartWarn : false ,
                //     chartRecord : false ,
                //     chartProduct : false ,
                //     chartUser : false ,
                // } ,
                chartShowArray :  localStoreShow ,
            },
            //销售页其他数据
            statisticsMarket : {
                isReady : false ,
                targetShow : false , //销售数据是否显示
            },
            //采购页其他数据
            statisticsPurchase : {
                isReady : false ,
            },
            //财务页其他数据
            statisticsFinance : {
                isReady : false ,
            },


            //销售表state
            //boss | market
            chartMarket : {
                rate : '2' ,
                timeMark : {
                    mouth : MONTH_CN[ moment().format('MMMM') ] || moment().format('MMMM') , //九月
                    day : moment().format('Do') , //20日
                    year : moment().format('YYYY') , //2016
                    week : moment().week() , //周
                },
                bossYearTarget : 0 ,
                bossMonthTarget : [0,0,0,0,0,0,0,0,0,0,0,0] ,
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
                            type : 'value'
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
            } ,
            //资金情况state
            //boss | finance(多了一个现金流tab)
            chartCapital : {
                tabShow : 1 ,
                chartData : {
                    // color : ['#03d6d1'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend : {
                      data : ['利润' , '收入' , '支出']
                    },
                    xAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    yAxis : [
                        {
                            type : 'category',
                            axisTick : {show: false},
                            data : ['周一','周二','周三','周四','周五','周六','周日']
                        }
                    ],
                    series : [
                        {
                            name:'利润',
                            type:'bar',
                            label: {
                                normal: {
                                    show: false,
                                    position: 'left'
                                }
                            },
                            data:[]
                        },
                        {
                            name:'收入',
                            type:'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: false ,
                                    position : 'left' ,
                                }
                            },
                            data:[]
                        },
                        {
                            name:'支出',
                            type:'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: false,
                                    position: 'right'
                                }
                            },
                            data:[]
                        }
                    ]
                } ,
                //现金流走势
                chartDataFlow : {
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
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'现金流走势',
                            type:'line', //折线图
                            data:[]
                        }
                    ]
                }
            },
            //库存情况state
            //boss | purchase(多了个按月查看)
            chartPurchaseStore : {
                //purchase页面才有的9个属性
                month : (new Date()).getMonth() - (-1) ,
                productStore : [] ,
                storeChart : [] ,
                storeChartData : [] ,
                typeStore : [] ,
                typeTableData : [] ,
                monthAllCount : [] ,
                currentMonthAllCount : '0' ,
                currentTypeTableData : [] ,

                currentStockCost : 0 ,
                chartData : {
                    // color : ['#03d6d1'],
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: []
                    },
                    series : [
                        {
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[

                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                } ,
            },
            //销售毛利state
            //boss
            chartMarketProfit : {
                checkboxValue : '2' ,
                todaySalesGrossProfit : '' ,
                salesGrossProfitWeek : '' ,
                salesGrossProfitMonth : '' ,
                salesGrossProfitYear : '' ,
                chartData : {
                    color: ['#03d6d1'],
                    tooltip : {
                        formatter : "{b} : {c}元"
                    },
                    // itemStyle : {
                    //     normal : {
                    //         label : {
                    //             show : true
                    //         }
                    //     }
                    // } ,
                    xAxis : [
                        {
                            type : 'category',
                            data : [],
                            axisTick: {
                                alignWithLabel: true
                            } ,
                            //axisLabel :{
                                //interval : 0
                            //}
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'销售毛利',
                            type:'line', //折线图
                            data:[]
                        }
                    ]
                } ,
            },
            //采购情况state
            //boss
            chartPurchase : {
                yearPrev : [ 0 ] ,
                yearPrevExist : 0 , //
                yearPrevPercent : '0%' ,
                yearAllMount : 0 ,
                chartData : {
                    // color : ['#03d6d1'],
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: []
                    },
                    series : [
                        {
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[

                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                } ,
            },
            //客户管理state
            //boss
            chartCustomer : {
                customerCount : 0 ,
                customerThisWeek : 0 ,
                chartData1 : {
                    // color : ['#03d6d1'],
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['本周成交客户','本周未成交客户']
                    },
                    series : [
                        {
                            type: 'pie',
                            radius: ['30%','50%'],
                            label: {
                                normal: {
                                    show: false,
                                },
                            },
                            data:[

                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                        }
                    ]
                } ,
                chartData2 : {
                    // color : ['#03d6d1'],
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['成交客户','未成交客户']
                    },
                    series : [
                        {
                            type: 'pie',
                            radius: ['30%','50%'],
                            label: {
                                normal: {
                                    show: false,
                                },
                            },
                            data:[

                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                        }
                    ]
                }
            },
            //异常预警state
            //boss | market
            chartWarn : {
                tabShow : 1 ,
                charts_warn_soWeekOverRecAmount : '' , //
                charts_warn_soOverRecAmount : '' ,
                charts_warn_salesReceivableAmount : '' ,
                charts_warn_right_table : [] ,
                chartData : {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data:['应收金额','逾期应收']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    yAxis : [
                        {
                            type : 'category',
                            data : [],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    xAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'应收金额',
                            type:'bar',
                            barWidth: '30%',
                            stack: '统计',
                            data:[]
                        },
                        {
                            name:'逾期应收',
                            type:'bar',
                            barWidth : '30%' ,
                            stack: '统计',
                            data:[]
                        },
                    ]
                } ,
                //下周应付提醒图
                chartDataPayNext : {
                    color : ['#03d6d1'],
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
                            type : 'value'
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
            },
            //龙虎榜state
            //boss
            chartRecord : {
                startTime : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endTime : moment().format('YYYY-MM-DD') ,
                type : '0' , // 0销售额 1销售金额占比 2销售单数 3新增客户数 4销售回款 5xi销售回款率
                chartData : {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    yAxis : [
                        {
                            type : 'category',
                            data : [],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    xAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'销售金额',
                            type:'bar',
                            barWidth: '30%',
                            data:[]
                        },
                    ]
                } ,
            },
            //热销产品state
            //boss
            chartProduct : {
                startTime : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endTime : moment().format('YYYY-MM-DD') ,
                filter : 'price' , // 'count'
                chartData : {
                    color: ['#03d6d1'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid : {
                        bottom : '30%' ,
                        top : '-10%'
                    } ,
                    xAxis : [
                        {
                            type : 'category',
                            data : [],
                            axisTick: {
                                alignWithLabel: true
                            } ,
                            axisLabel :{
                                interval : 0 ,
                                rotate: 35,
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'销售额',
                            type:'bar', //折线图
                            data:[]
                        }
                    ]
                } ,
            },
            //客户前十state
            //boss | market
            chartUser : {
                startTime : moment().subtract(30, 'days').format('YYYY-MM-DD') ,
                endTime : moment().format('YYYY-MM-DD') ,
                filter : 'price' , // 'count' 销售额 和 销售单
                chartData : {
                    color: ['#03d6d1'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid : {
                        bottom : '30%' ,
                        top : '-10%'
                    } ,
                    xAxis : [
                        {
                            type : 'category',
                            data : [],
                            axisTick: {
                                alignWithLabel: true
                            } ,
                            axisLabel :{
                                interval : 0 ,
                                rotate : 35
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'购买额',
                            type:'bar', //折线图
                            data:[]
                        }
                    ]
                } ,
            },



            //需要展示的图表们

            showState : [ ] ,

            //event
            market_goal_settings : (value) => {
                this.setState({
                    market_modal　:　value.data
                }) ;
            } ,
        }
    }
    componentDidMount(){
        switch ( this.props.userstore.user.roleIds[ 0 ] ){
            case (1) :
                this._dataInit_boss() ;
                break ;
            case (3) :
                this._dataInit_market() ;
                break ;
            case (4) :
                this._dataInit_purchase() ;
                break ;
            case (2) :
                this._dataInit_finance() ;
                break ;
            default :
                break ;
        }
        globalEvent.home.market_goal_settings = new signals.Signal() ;
        globalEvent.home.market_goal_settings.add(this.state.market_goal_settings) ;

    }
    _eventInit_all(){
        setTimeout(function(){
            var el = document.getElementsByClassName('chart-area-sortable')[0] ;
            if ( el ){
                var sortable = Sortable.create(el,{
                    delay: 100,
                    animation: 150,
                    // handle: ".c-title",
                    ghostClass: "sortable-ghost",
                    chosenClass: "sortable-chosen",
                    dragClass: "sortable-drag",
                    scroll: true, // or HTMLElement
                    scrollSensitivity: 350, // px, how near the mouse must be to an edge to start scrolling.
                    scrollSpeed: 70, // px
                });
            }

            var staticEl = document.getElementsByClassName('comp-statistics')[0] ;
            if ( staticEl ){
                var sortableStaticEl = Sortable.create(staticEl,{
                    delay: 100,
                    animation: 150,
                    // handle: ".c-title",
                    ghostClass: "sortable-ghost",
                    chosenClass: "sortable-chosen",
                    dragClass: "sortable-drag",
                    scroll: true, // or HTMLElement
                    scrollSensitivity: 350, // px, how near the mouse must be to an edge to start scrolling.
                    scrollSpeed: 70, // px
                });
            }


        },3000) ;
    }
    _dataInit_boss(){
        var a = new Date() ;
        service.home.initHomeDashBoard({
            homeAlertText1 : {
                tenantId : window.globalStore.getState().userstore.user.tenantId  ,
            },
            homeAlertText2 : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
            },
            homeAlertText3 : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
            },
            homeAlertText4 : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
            },
            chartMarket : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                roleId : 1
                // userId : window.globalStore.getState().userstore.user.id ,
            },
            chartWarning : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                // userId : window.globalStore.getState().userstore.user.id
            },
            chartUser : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                // userId : window.globalStore.getState().userstore.user.id ,
                startTime : this.state.chartUser.startTime ,
                endTime : this.state.chartUser.endTime ,
            },
            bossPurchaseStore : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
            },
            bossPurchase : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
            },
            bossNewUser : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
            },
            bossTopMarket : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                startTime : this.state.chartRecord.startTime ,
                endTime : this.state.chartRecord.endTime ,
                type : this.state.chartRecord.type ,
            },
            bossTopProduct : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                startTime : this.state.chartProduct.startTime ,
                endTime : this.state.chartProduct.endTime ,
            },
            bossPurchaseGoles : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
            },
            bossCapital : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
            },
            bossMarketProfit : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
            },
        },(error,data) => {
            var b = new Date() ;
            console.info('boss数据准备完毕, 耗时:' + ( b - a ) + 'ms') ;

            if ( error ){
                return ;
            }

            var self = this ;
            console.log( data ) ;

            //全部统计
            let alertShould_all = 0 ;
            let alertShould_delay = 0 ;
            let alertPay_next = 0 ;
            let alertPay_percent = 0 ;
            let alertMarket_all = 0 ;
            let alertMarket_percent = 0 ;
            let alertStore_all = 0 ;
            let alertStore_percent = 0 ;
            ;(function(){
                try{
                    alertShould_all = data.alertText1.data.dashBoardDto.salesReceivableAmount || 0 ;
                    alertShould_delay = data.alertText1.data.dashBoardDto.soOverRecAmount || 0 ;
                    alertPay_next = data.alertText2.data.dashBoardDto.poNextPayableAmount || 0 ;
                    alertPay_percent = data.alertText2.data.dashBoardDto.growth || 0 ;
                    alertMarket_all = data.alertText3.data.dashBoardDto.salesGrossProfit || 0;
                    alertMarket_percent = data.alertText3.data.dashBoardDto.growth || 0;
                    alertStore_all = data.alertText4.data.dashBoardDto.stockCost || 0;
                    alertStore_percent = data.alertText4.data.dashBoardDto.growth || 0;
                } catch(e){
                    console.warn( 'boss统计信息处理失败' , e ) ;
                }
            })() ;

            //销售情况
            let market_monthComplete = 0 ;
            let market_yearComplete = 0 ;
            let market_amount = [] ;
            let market_rate = [] ;
            ;(function(){
                //market_chart
                try{
                    var rate = data.market_chart.data.dashBoardDtos[0] && parseInt(data.market_chart.data.dashBoardDtos[0].abscissaPoints);
                    if(rate==12){
                        market_rate = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
                    }else if(rate>12&&rate<32){
                        for( let i=0; i<rate; i++){
                            market_rate[i]=(i+1)+'日';
                        }
                    }else{
                        for( let i=0; i<rate; i++){
                            market_rate[i]=(i+1)+'周';
                        }
                    }
                    market_amount = data.market_chart.data.dashBoardDtos.map((v,i) => {
                        return v.soAmount;
                    });
                    market_monthComplete = data.market_chart.data.dashBoardDtos[0].monthComplete;
                    market_yearComplete = data.market_chart.data.dashBoardDtos[0].yearComplete;
                } catch (e){
                    console.warn( '销售记录图表数据处理失败。' , e ) ;
                }
            })() ;

            //异常预警
            let soWeekOverRecAmount = 0 ;
            let warn_sRA = [] ;
            let warn_sORA = [] ;
            let warn_ctms = [] ;
            ;(function () {
                //warn_chart
                try {
                    warn_ctms = data.warn_chart.data.dashBoardDtos.map((v,i) => {
                        return v.customerName;
                    });
                    warn_sRA = data.warn_chart.data.dashBoardDtos.map((v,i) => {
                        return v.salesReceivableAmount;
                    });
                    warn_sORA = data.warn_chart.data.dashBoardDtos.map((v,i) => {
                        return v.soOverRecAmount;
                    });
                    soWeekOverRecAmount = data.warn_chart.data.dashBoardDtos[0] ? data.warn_chart.data.dashBoardDtos[0].soWeekOverRecAmount : ''　;
                } catch(e) {
                    console.warn( '异常预警图表数据处理失败。' , e ) ;
                }
            })() ;

            //客户前十
            let user_name = [] ;
            let user_value = [] ;
            let user_store = [] ;
            ;(function(){
                try {
                    user_store = data.top_users_chart.data.dashBoardDtos ;
                    user_name = user_store.map((v)=>{
                        return v.customerName ? v.customerName : '客户' + v.customerId ;
                    }) ;
                    var type = self.state.chartUser.filter ;
                    user_value = user_store.map((v)=>{
                        return type === 'price' ? v.soAmountPer-0 : v.soQuantityPer-0 ;
                    }) ;
                } catch (e){
                    console.warn( '客户图表数据处理失败。' , e ) ;
                }
            })() ;

            //货品前十
            let product_name = [] ;
            let product_value = [] ;
            let product_store = [] ;
            ;(function(){
                try {
                    product_store = data.topProduct.data.dashBoardDtos || [] ;
                    product_name = product_store.map((v)=>{
                        return v.itemName ? v.itemName : '货品' + v.itemId ;
                    }) ;
                    var type = self.state.chartProduct.filter ;
                    product_value = product_store.map((v)=>{
                        return type === 'price' ? v.soAmountPer-0 : v.soQuantityPer-0 ;
                    }) ;
                } catch (e){
                    console.warn( '货品图表数据处理失败。' , e ) ;
                }
            })() ;

            //龙虎榜
            let top_market_store = [] ;
            let top_market_name = [] ;
            let top_market_value = [] ;
            ;(function(){
                try{
                    top_market_store = data.topMarket.data.dashBoardDtos ;
                    top_market_name = top_market_store.map((v)=>{
                        return v.userName ? v.userName : '销售员' + v.userId ;
                    }) ;
                    var map = {
                        '0' : 'soAmount' ,
                        '1' : 'soAmountRatio' ,
                        '2' : 'soQuantity' ,
                        '3' : 'customerQuantity' ,
                        '4' : 'soReceivedAmount' ,
                        '5' : 'soReceivedRatio' ,
                    } ;
                    top_market_value = top_market_store.map((v)=>{
                        return v[ map[ self.state.chartRecord.type+'' ] ] ;
                    }) ;
                }catch(e){
                    console.warn( '销售排行数据处理失败。' , e ) ;
                }
            })() ;


            //库存情况
            let purchaseStore_currentStockCost = 0 ;
            let purchaseStore_name = [] ;
            let purchaseStore_value = [] ;
            ;(function(){
                try{
                    var purchaseStore_store = data.purchaseStore.data.dashBoardDtos ;
                    purchaseStore_currentStockCost = purchaseStore_store[0] ? purchaseStore_store[0].currentStockCost : 0 ;
                    purchaseStore_name = purchaseStore_store.map((v)=>{
                        return v.itemName ? v.itemName : '货品' + v.itemId ;
                    }) ;
                    purchaseStore_value = purchaseStore_store.map((v)=>{
                        return {
                            name : v.itemName ? v.itemName : '货品' + v.itemId ,
                            value : parseInt( v.stockCost ) - 0
                        }
                    }) ;
                }catch(e){
                    console.warn( '库存图表数据处理失败。' , e ) ;
                }
            })() ;

            //客户管理
            let customerCount = 0 ;
            let customerThisWeek = 0 ;
            let customerData1 = [{
                value : 0 ,
                name : '本周成交客户' ,
            },{
                value : 0 ,
                name : '本周未成交客户' ,
            }] ;
            let customerData2 = [{
                value : 0 ,
                name : '成交客户'
            },{
                value : 0 ,
                name : '未成交客户'
            }] ;
            ;(function(){
                try{
                    var customer_store = data.newUser.data.dashBoardDto ;
                    customerCount = customer_store.customerCount ;
                    customerThisWeek = customer_store.customerThisWeek ;
                    customerData1 = [{
                        value : parseInt(customer_store.dealCustomerThisWeek) - 0  ,
                        name : '本周成交客户' ,
                    },{
                        value : ( parseInt(customerCount) - 0 ) - ( parseInt(customer_store.dealCustomerThisWeek) - 0 ),
                        name : '本周未成交客户' ,
                    }] ;
                    customerData2 = [{
                        value : parseInt(customer_store.dealCustomerCount) - 0  ,
                        name : '成交客户' ,
                    },{
                        value : ( parseInt(customerCount) - 0 ) - ( parseInt(customer_store.dealCustomerCount) - 0 ),
                        name : '未成交客户' ,
                    }] ;
                }catch(e){
                    console.warn( '客户管理图表数据处理失败。' , e ) ;
                }
            })() ;

            //采购情况
            let purchase_yearAllMount = 0 ;
            let purchase_yearPrev = [0] ;
            let purchase_yearPrevExist = 0 ;
            let purchase_yearPrevPercent = '0%' ;
            let purchase_name = [] ;
            let purchase_value = [] ;
            ;(function(){
                try{
                    var purchase_store = data.purchase.data.dashBoardDtos ;
                    purchase_yearPrevExist = data.purchaseGoles.data.dashBoardDto && (data.purchaseGoles.data.dashBoardDto.tenantTargets[0]-0) ;
                    purchase_yearPrev = [ purchase_yearPrevExist ] ;
                    purchase_store.forEach((v,i)=>{
                        if ( i === 0 ){
                            purchase_yearAllMount = v.poAmount - 0 ;
                        } else {
                            purchase_name.push( v.itemName ? v.itemName : '采购货品' + v.itemId ) ;
                            purchase_value.push({
                                name : v.itemName ? v.itemName : '采购货品' + v.itemId ,
                                value : v.poAmount - 0 ,
                            }) ;
                        }
                    }) ;
                    purchase_yearPrevPercent = (purchase_yearPrevExist === 0)
                        ? '0%'
                        : ( ( purchase_yearAllMount/purchase_yearPrevExist ) * 100 ).toFixed( 2 ) + '%'  ;
                }catch(e){
                    console.warn( '采购情况图表数据处理失败。' , e ) ;
                }
            })() ;

            //资金情况
            let capital_income = [];  //收入
            let capital_paid = [];    //支出
            let capital_surplus = []; //结余
            let capital_Date = [];
            ;(function () {
                //capital_chart
                try {
                    capital_income = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                        return v.income;
                    });
                    capital_paid = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                        return v.expenditure;
                    });
                    capital_surplus = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                        return v.surplus;
                    });
                    capital_Date = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                        return v.weekDay;
                    });
                } catch(e) {
                    console.warn( '资金流动图表数据处理失败。' , e ) ;
                }
            })() ;
            //销售毛利
            let market_profit = [];  //毛利
            let market_profit_Date = [];
            let todaySalesGrossProfit = [];
            let salesGrossProfitWeek = [];
            let salesGrossProfitMonth = [];
            let salesGrossProfitYear = [];
            ;(function () {
                //market_profit_chart
                try {
                    console.log(data);
                    var rate = data.market_profit_chart.data.dashBoardDtos[0] && parseInt(data.market_profit_chart.data.dashBoardDtos[0].abscissaPoints);
                    if(rate==12){
                        market_profit_Date = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
                    }else if(rate>12&&rate<32){
                        for( let i=0; i<rate; i++){
                            market_profit_Date[i]=(i+1)+'日';
                        }
                    }else{
                        for( let i=0; i<rate; i++){
                            market_profit_Date[i]=(i+1)+'周';
                        }
                    }
                    market_profit = data.market_profit_chart.data.dashBoardDtos.map((v,i) => {
                        return v.salesGrossProfit;
                    });
                    todaySalesGrossProfit = data.market_profit_chart.data.dashBoardDtos[0].todaySalesGrossProfit;
                    //salesGrossProfitWeek = data.market_profit_right_tab.data.dashBoardDtos[0].salesGrossProfitWeek;
                    //salesGrossProfitMonth = data.market_profit_right_tab.data.dashBoardDtos[0].salesGrossProfitMonth;
                    //salesGrossProfitYear = data.market_profit_right_tab.data.dashBoardDtos[0].salesGrossProfitYear;
                } catch(e) {
                    console.warn( '销售毛利图表数据处理失败。' , e ) ;
                }
            })() ;
            
            var self = this ;
            setTimeout(function(){
            self.setState({
                statisticsBoss : {
                    ...self.state.statisticsBoss ,
                    isReady : true ,
                    alertShould_all : alertShould_all ,
                    alertShould_delay : alertShould_delay ,
                    alertPay_next : alertPay_next ,
                    alertPay_percent : alertPay_percent ,
                    alertMarket_all : alertMarket_all ,
                    alertMarket_percent : alertMarket_percent ,
                    alertStore_all : alertStore_all ,
                    alertStore_percent : alertStore_percent ,
                },
                chartMarket : {
                    ...self.state.chartMarket　,
                    rate : '2' ,
                    charts_market_monthComplete : market_monthComplete ,
                    charts_market_yearComplete : market_yearComplete ,
                    chartData : {
                        ...self.state.chartMarket.chartData,
                        xAxis : [{
                            type : 'category',
                            data : market_rate,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }],
                        series :[
                            {
                                name:'销售额',
                                type:'line', //折线图
                                data:market_amount ,
                            },
                        ]
                    }
                },
                chartWarn : {
                    ...self.state.chartWarn ,
                    charts_warn_soWeekOverRecAmount : soWeekOverRecAmount , //
                    chartData : {
                        ...self.state.chartWarn.chartData ,
                        yAxis : [{
                            ...self.state.chartWarn.chartData.yAxis[0] ,
                            data : warn_ctms
                        }],
                        series :[
                            {
                                name:'应收金额',
                                type:'bar',
                                barWidth: '30%',
                                stack: '统计',
                                data:warn_sRA
                            },
                            {
                                name:'逾期应收',
                                type:'bar',
                                barWidth : '30%' ,
                                stack: '统计',
                                data:warn_sORA
                            },
                        ]
                    }
                },
                chartUser : {
                    ...self.state.chartUser ,
                    user_store : user_store ,
                    chartData : {
                        ...self.state.chartUser.chartData ,
                        xAxis : [
                            {
                                ...self.state.chartUser.chartData.xAxis[0] ,
                                data : user_name ,
                            }
                        ],
                        series : [
                            {
                                name : '购买额' ,
                                type : 'bar' ,
                                data : user_value ,
                            }
                        ]
                    }
                },
                chartProduct : {
                    ...self.state.chartProduct ,
                    product_store : product_store ,
                    chartData : {
                        ...self.state.chartProduct.chartData ,
                        xAxis : [
                            {
                                ...self.state.chartProduct.chartData.xAxis[0] ,
                                data : product_name ,
                            }
                        ],
                        series : [
                            {
                                name : '销售额' ,
                                type : 'bar' ,
                                data : product_value ,
                            }
                        ]
                    }
                },
                chartRecord : {
                    ...self.state.chartRecord ,
                    chartData : {
                        ...self.state.chartRecord.chartData ,
                        yAxis : [
                            {
                                type : 'category',
                                data : top_market_name ,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        series : [
                            {
                                name:'销售金额',
                                type:'bar',
                                barWidth: '30%',
                                data:top_market_value
                            },
                        ]
                    } ,
                },
                chartPurchaseStore : {
                    ...self.state.chartPurchaseStore ,
                    currentStockCost : purchaseStore_currentStockCost ,
                    chartData : {
                        ...self.state.chartPurchaseStore.chartData ,
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: purchaseStore_name ,
                        },
                        series : [
                            {
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                data: purchaseStore_value,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    } ,
                },
                chartCustomer : {
                    ...self.state.chartCustomer ,
                    customerCount :　customerCount　,
                    customerThisWeek : customerThisWeek ,
                    chartData1 : {
                        ...self.state.chartCustomer.chartData1 ,
                        series : [
                            {
                                type: 'pie',
                                // radius: ['50%', '70%'],
                                radius: ['30%','50%'],
                                label: {
                                    normal: {
                                        show: false,
                                    },
                                },
                                data: customerData1,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                },
                            }
                        ]
                    } ,
                    chartData2 : {
                        ...self.state.chartCustomer.chartData2 ,
                        series : [
                            {
                                type: 'pie',
                                radius: ['30%','50%'],
                                label: {
                                    normal: {
                                        show: false,
                                    },
                                },
                                data:customerData2,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                },
                            }
                        ]
                    }
                },
                chartPurchase : {
                    ...self.state.chartPurchase ,
                    yearPrev : purchase_yearPrev ,
                    yearPrevExist : purchase_yearPrevExist ,
                    yearPrevPercent : purchase_yearPrevPercent ,
                    yearAllMount : purchase_yearAllMount ,
                    chartData : {
                        ...self.state.chartPurchase.chartData ,
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: purchase_name
                        },
                        series : [
                            {
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                data: purchase_value ,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    } ,
                },
                chartCapital : {
                    ...self.state.chartCapital ,
                    chartData : {
                        ...self.state.chartCapital.chartData ,
                        series : [
                            {
                                name:'利润',
                                type:'bar',
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'left'
                                    }
                                },
                                data: capital_surplus
                            },
                            {
                                name:'收入',
                                type:'bar',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: false ,
                                        position: 'left'
                                    }
                                },
                                data: capital_income
                            },
                            {
                                name:'支出',
                                type:'bar',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'right'
                                    }
                                },
                                data: capital_paid
                            }
                        ]
                    } ,
                },
                chartMarketProfit : {
                    ...self.state.chartMarketProfit ,
                    todaySalesGrossProfit : todaySalesGrossProfit ,
                    chartData : {
                        ...self.state.chartMarketProfit.chartData ,
                        xAxis : [
                            {
                                type : 'category',
                                data : market_profit_Date,
                                axisTick: {
                                    alignWithLabel: true
                                } ,
                                //axisLabel :{
                                    //interval : 0
                                //}
                            }
                        ],
                        series : [
                            {
                                name:'销售毛利',
                                type:'line', //折线图
                                data: market_profit
                            }
                        ]
                    } ,
                },
            })

            },0) ;

            this._eventInit_all() ;
        });
    }
    _dataInit_market(){
        //销售数据初始化 使用userId
        var a = new Date() ;
        service.home.initHomeDashBoardMarket({
            marketParams : {
                userId : window.globalStore.getState().userstore.user.id ,
                roleId : 3 ,
            },
            warnParams : {
                userId : window.globalStore.getState().userstore.user.id
            },
            topUserParams : {
                userId : window.globalStore.getState().userstore.user.id ,
                startTime : this.state.chartUser.startTime ,
                endTime : this.state.chartUser.endTime ,
            },
            marketStatistics　:　{
                userId : window.globalStore.getState().userstore.user.id ,
            }
        },(error,data) => {
            var b = new Date() ;
            console.info('销售人员数据准备完毕, 耗时:' + ( b - a ) + 'ms') ;

            var self = this ;

            let market_monthComplete = 0 ;
            let market_yearComplete = 0 ;
            let market_amount = [] ;
            let market_rate = [] ;

            let market_data_allTarget = data.marketStatistics.data.dashBoardDto.userTargets[0] ;
            let market_data_week = data.marketStatistics.data.dashBoardDto.soWeekAmount ;
            let market_data_month = data.marketStatistics.data.dashBoardDto.soMonthAmount ;
            let market_data_year = data.marketStatistics.data.dashBoardDto.soYearAmount ;

            ;(function(){
                //market_chart
                try{
                    var rate = data.market_chart.data.dashBoardDtos[0] && parseInt(data.market_chart.data.dashBoardDtos[0].abscissaPoints);
                    if(rate==12){
                        market_rate = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
                    }else if(rate>12&&rate<32){
                        for( let i=0; i<rate; i++){
                            market_rate[i]=(i+1)+'日';
                        }
                    }else{
                        for( let i=0; i<rate; i++){
                            market_rate[i]=(i+1)+'周';
                        }
                    }
                    market_amount = data.market_chart.data.dashBoardDtos.map((v,i) => {
                        return v.soAmount;
                    });
                    market_monthComplete = data.market_chart.data.dashBoardDtos[0].monthComplete;
                    market_yearComplete = data.market_chart.data.dashBoardDtos[0].yearComplete;
                } catch (e){
                    console.warn( '销售记录图表数据处理失败。' , e ) ;
                }
            })() ;

            let soWeekOverRecAmount = 0 ;
            let warn_sRA = [] ;
            let warn_sORA = [] ;
            let warn_ctms = [] ;
            ;(function () {
                //warn_chart
                try {
                    warn_ctms = data.warn_chart.data.dashBoardDtos.map((v,i) => {
                        return v.customerName;
                    });
                    warn_sRA = data.warn_chart.data.dashBoardDtos.map((v,i) => {
                        return v.salesReceivableAmount;
                    });
                    warn_sORA = data.warn_chart.data.dashBoardDtos.map((v,i) => {
                        return v.soOverRecAmount;
                    });
                    soWeekOverRecAmount = data.warn_chart.data.dashBoardDtos[0] ? data.warn_chart.data.dashBoardDtos[0].soWeekOverRecAmount : ''　;
                } catch(e) {
                    console.warn( '异常预警图表数据处理失败。' , e ) ;
                }
            })() ;

            let user_name = [] ;
            let user_value = [] ;
            let user_store = [] ;
            ;(function(){
                try {
                    user_store = data.top_users_chart.data.dashBoardDtos ;
                    user_name = user_store.map((v)=>{
                        return v.customerName ? v.customerName : '客户' + v.customerId ;
                    }) ;
                    var type = self.state.chartUser.filter ;
                    user_value = user_store.map((v)=>{
                        return type === 'price' ? v.soAmountPer-0 : v.soQuantityPer-0 ;
                    }) ;
                } catch (e){
                    console.warn( '客户图表数据处理失败。' , e ) ;
                }
            })() ;

            this.setState({
                statisticsMarket : {
                    ...this.state.statisticsMarket ,
                    isReady : true ,
                    targetShow : false ,
                    all_yearTaget : market_data_allTarget ,
                    all_week : market_data_week ,
                    all_month : market_data_month ,
                    all_year : market_data_year ,
                },
                chartMarket : {
                    ...this.state.chartMarket　,
                    rate : '2' ,
                    charts_market_monthComplete : market_monthComplete ,
                    charts_market_yearComplete : market_yearComplete ,
                    chartData : {
                        ...this.state.chartMarket.chartData,
                        xAxis : [{
                            type : 'category',
                            data : market_rate,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }],
                        series :[
                            {
                                name:'销售额',
                                type:'line', //折线图
                                data:market_amount ,
                            },
                        ]
                    }
                },
                chartWarn : {
                    ...this.state.chartWarn ,
                    charts_warn_soWeekOverRecAmount : soWeekOverRecAmount , //
                    chartData : {
                        ...this.state.chartWarn.chartData ,
                        yAxis : [{
                            ...this.state.chartWarn.chartData.yAxis[0] ,
                            data : warn_ctms
                        }],
                        series :[
                            {
                                name:'应收金额',
                                type:'bar',
                                barWidth: '30%',
                                stack: '统计',
                                data:warn_sRA
                            },
                            {
                                name:'逾期应收',
                                type:'bar',
                                barWidth : '30%' ,
                                stack: '统计',
                                data:warn_sORA
                            },
                        ]
                    }
                },
                chartUser : {
                    ...this.state.chartUser ,
                    user_store : user_store ,
                    chartData : {
                        ...this.state.chartUser.chartData ,
                        xAxis : [
                            {
                                ...this.state.chartUser.chartData.xAxis[0] ,
                                data : user_name ,
                            }
                        ],
                        series : [
                            {
                                name : '购买额' ,
                                type : 'bar' ,
                                data : user_value ,
                            }
                        ]
                    }
                }

            }) ;

            this._eventInit_all() ;

        }) ;
    }
    _dataInit_purchase(){
        //采购数据初始化 使用userId(后来ida说是tenantid)
        var a = new Date() ;
        service.home.initHomeDashBoardPurchase({
            purchaseStore : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                 //tenantId : 251 ,
            },
            byType : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                //tenantId : 251 ,
            }
        },(error,data) => {
            var b = new Date() ;
            var currentMonth = b.getMonth() - 0;
            console.info('采购人员数据准备完毕, 耗时:' + ( b - a ) + 'ms') ;
            console.log( data ) ;
            var self = this ;
            
            let purchase_product_store = [] ;  //后台返回的所有数据
            let purchase_product_chart = [] ;  //拆分后的左侧图表数据
            let purchase_product_name = new Array(12) ;   // 图表左上侧的名称列表展示
            let purchase_product_value = new Array(12) ;  //左侧图表里的数据
            let purchase_product_month_account = ['0','0','0','0','0','0','0','0','0','0','0','0',] ; //当月总的库存量
            
            let purchase_type_store = [] ;  // 右侧table的数据源（数组）
            // let purchase_type_name = [] ;
            let purchase_type_value = new Array(12) ;  //  右侧适配成table可以用的格式
            ;(function(){
                try {
                    purchase_product_store = data.purchaseStore.data.dashBoardDtos ;
                    purchase_product_store.forEach(function(v,i){
                        if( i % 2 == 0 ){
                            purchase_product_chart.push(v) ;
                        }else{
                            purchase_type_store.push(v) ;
                        }
                    });
                    purchase_product_chart.forEach((v,i) => {
                        if (v.dashBoardDtos !== null) {
                            purchase_product_value[i] = new Array();
                            v.dashBoardDtos.forEach((eachMonth)=> {
                                //purchase_product_name[i].push(eachMonth.itemName ? eachMonth.itemName : eachMonth.itemId);
                                purchase_product_value[i].push({
                                    name: eachMonth.itemName ? eachMonth.itemName : eachMonth.itemId,
                                    value: parseInt(eachMonth.stockCost) - 0
                                });
                            });
                            purchase_product_month_account[i] = v.stockTotal ;
                        }else{
                            purchase_product_name[i] = [] ;
                            purchase_product_value[i] = [] ;
                        }
                    });
                    purchase_type_store.forEach((v,i)=>{
                        if(v.dashBoardDtos !== null){
                            purchase_type_value[i] = new Array();
                            v.dashBoardDtos.forEach((eachMonth) => {
                                purchase_type_value[i].push({
                                    categoryName : eachMonth.categoryName ,
                                    stockCost : eachMonth.stockCost ,
                                    stockCostPCT : eachMonth.stockCostPCT ,
                                }) ;
                            });
                        }else{
                            purchase_type_value[i] = [] ;
                        }
                    }) ;

                    // purchase_product_store = data.purchaseStore.data.dashBoardDtos ;
                    // purchase_type_store = data.productByType.data.dashBoardDtos ;
                    // purchase_product_store[ self.state.chartPurchaseStore.month - 0 - 1 ].forEach((v)=>{
                    //     purchase_product_name.push( v.itemName ? v.itemName : v.itemId ) ;
                    //     purchase_product_value.push({
                    //         name : v.itemName ? v.itemName : v.itemId ,
                    //         value : parseInt( v.stockCost ) - 0
                    //     }) ;
                    //     purchase_product_month_account = (new BigNumber(purchase_product_month_account)).plus(new BigNumber(v.stockCost)) - 0 ;
                    // }) ;
                    // purchase_type_store[ self.state.chartPurchaseStore.month - 0 - 1 ].forEach((v)=>{
                    //     purchase_type_value.push({
                    //         categoryName : v.categoryName ,
                    //         stockCost : v.stockCost ,
                    //         stockCostPCT : v.stockCostPCT ,
                    //     }) ;
                    // }) ;
                } catch (e){
                    console.warn( '采购图表数据处理失败。' , e ) ;
                }
            })() ;

            this.setState({
                statisticsPurchase : {
                    ...this.state.statisticsPurchase ,
                    isReady : true ,
                },
                chartPurchaseStore : {
                    ...this.state.chartPurchaseStore　,
                    productStore : purchase_product_store ,
                    storeChart : purchase_product_chart ,
                    storeChartData : purchase_product_value ,
                    typeStore : purchase_type_store ,
                    typeTableData : purchase_type_value ,
                    monthAllCount : purchase_product_month_account ,
                    currentMonthAllCount : purchase_product_month_account[currentMonth] ,
                    currentTypeTableData : purchase_type_value[currentMonth] ,
                    chartData : {
                        ...this.state.chartPurchaseStore.chartData,
                        // legend: {
                        //     orient: 'vertical',
                        //     left: 'left',
                        //     data: purchase_product_name ,
                        // },
                        series : [
                            {
                                type: 'pie',
                                radius : '70%',
                                center: ['50%', '55%'],
                                data: purchase_product_value[10],
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    } ,
                },
                
            })

            this._eventInit_all() ;

        }) ;
    }
    _dataInit_finance(){
        //销售数据初始化 使用tenantId
        service.home.initHomeDashBoardFinance({
            warnParams : {
                tenantId : window.globalStore.getState().userstore.user.tenantId
            },
            payNextParams : {
                tenantId : window.globalStore.getState().userstore.user.tenantId
            },
            capitalParams : {
                tenantId : window.globalStore.getState().userstore.user.tenantId ,
            },
            marketProfit : {
                tenantId : window.globalStore.getState().userstore.user.tenantId
            }
        },(error,data) => {
            var self = this ;
            //预警图表
            let soWeekOverRecAmount = 0 ;
            let soOverRecAmount = 0 ;
            let salesReceivableAmount = 0 ;
            let warn_sRA = [] ;
            let warn_sORA = [] ;
            let warn_ctms = [] ;
            let charts_warn_right_table = [];
            ;(function () {
                //warn_chart
                try {
                    warn_ctms = data.warn_chart.data.dashBoardDtos.map((v,i) => {
                        return v.customerName;
                    });
                    warn_sRA = data.warn_chart.data.dashBoardDtos.map((v,i) => {
                        return v.salesReceivableAmountPer;
                    });
                    warn_sORA = data.warn_chart.data.dashBoardDtos.map((v,i) => {
                        return v.soOverRecAmountPer;
                    });
                    charts_warn_right_table = data.warn_payNext_right_table.data.dashBoardDtos;
                    soWeekOverRecAmount = data.warn_chart.data.dashBoardDtos[0] ? data.warn_chart.data.dashBoardDtos[0].soWeekOverRecAmount : ''　;
                    soOverRecAmount = data.warn_chart.data.dashBoardDtos[0] ? data.warn_chart.data.dashBoardDtos[0].soOverRecAmount : ''　;
                    salesReceivableAmount = data.warn_chart.data.dashBoardDtos[0] ? data.warn_chart.data.dashBoardDtos[0].salesReceivableAmount : ''　;

                } catch(e) {
                    console.warn( '异常预警图表数据处理失败。' , e ) ;
                }
            })() ;
            //下周应付
            let payNext_Amount = [] ;
            let payNext_Date = [] ;
            ;(function () {
                //payNext_chart
                try {
                    payNext_Amount = data.payNext_chart.data.dashBoardDtos.map((v,i) => {
                        return v.payable;
                    });
                    payNext_Date = data.payNext_chart.data.dashBoardDtos.map((v,i) => {
                        return v.weekDay;
                    });
                } catch(e) {
                    console.warn( '下周应付图表数据处理失败。' , e ) ;
                }
            })() ;
            //资金情况
            let capital_income = [];  //收入
            let capital_paid = [];    //支出
            let capital_surplus = []; //结余
            let capital_Date = [];
            ;(function () {
                //capital_chart
                try {
                    capital_income = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                        return v.income;
                    });
                    capital_paid = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                        return v.expenditure;
                    });
                    capital_surplus = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                        return v.surplus;
                    });
                    capital_Date = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                        return v.weekDay;
                    });
                } catch(e) {
                    console.warn( '资金流动图表数据处理失败。' , e ) ;
                }
            })() ;
            //销售毛利
            let market_profit = [];  //毛利
            let market_profit_Date = [];
            let todaySalesGrossProfit = [];
            let salesGrossProfitWeek = [];
            let salesGrossProfitMonth = [];
            let salesGrossProfitYear = [];
            ;(function () {
                //market_profit_chart
                try {
                    console.log(data);
                    var rate = data.market_profit_chart.data.dashBoardDtos[0] && parseInt(data.market_profit_chart.data.dashBoardDtos[0].abscissaPoints);
                    if(rate==12){
                        market_profit_Date = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
                    }else if(rate>12&&rate<32){
                        for( let i=0; i<rate; i++){
                            market_profit_Date[i]=(i+1)+'日';
                        }
                    }else{
                        for( let i=0; i<rate; i++){
                            market_profit_Date[i]=(i+1)+'周';
                        }
                    }
                    market_profit = data.market_profit_chart.data.dashBoardDtos.map((v,i) => {
                        return v.salesGrossProfit;
                    });
                    todaySalesGrossProfit = data.market_profit_right_tab.data.dashBoardDtos[0].todaySalesGrossProfit;
                    salesGrossProfitWeek = data.market_profit_right_tab.data.dashBoardDtos[0].salesGrossProfitWeek;
                    salesGrossProfitMonth = data.market_profit_right_tab.data.dashBoardDtos[0].salesGrossProfitMonth;
                    salesGrossProfitYear = data.market_profit_right_tab.data.dashBoardDtos[0].salesGrossProfitYear;
                } catch(e) {
                    console.warn( '销售毛利图表数据处理失败。' , e ) ;
                }
            })() ;
            this.setState({
                statisticsFinance : {
                  isReady : true  
                },
                chartWarn : {
                    ...this.state.chartWarn ,
                    charts_warn_soWeekOverRecAmount : soWeekOverRecAmount , //
                    charts_warn_soOverRecAmount : soOverRecAmount ,
                    charts_warn_salesReceivableAmount : salesReceivableAmount ,
                    charts_warn_right_table : charts_warn_right_table ,
                    chartData : {
                        ...this.state.chartWarn.chartData ,
                        yAxis : [{
                            type : 'category',
                            axisTick: {
                                alignWithLabel: true
                            } ,
                            data : warn_ctms
                        }],
                        series :[
                            {
                                name:'应收金额',
                                type:'bar',
                                barWidth: '30%',
                                stack: '统计',
                                data: warn_sRA
                            },
                            {
                                name:'逾期应收',
                                type:'bar',
                                barWidth : '30%' ,
                                stack: '统计',
                                data: warn_sORA
                            },
                        ]
                    } ,
                    chartDataPayNext : {
                        ...this.state.chartWarn.chartDataPayNext ,
                        xAxis : [
                            {
                                type : 'category',
                                axisTick: {
                                    alignWithLabel: true
                                },
                                data : payNext_Date,
                            }
                        ],
                        series : [
                            {
                                name:'下周应付',
                                type:'line', //折线图
                                data: payNext_Amount
                            }
                        ]
                    }
                },
                chartCapital : {
                    ...this.state.chartCapital ,
                    chartData : {
                        ...this.state.chartCapital.chartData ,
                        series : [
                            {
                                name:'利润',
                                type:'bar',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'left'
                                    }
                                },
                                data: capital_surplus
                            },
                            {
                                name:'收入',
                                type:'bar',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: true ,
                                        position: 'left'
                                    }
                                },
                                data: capital_income
                            },
                            {
                                name:'支出',
                                type:'bar',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'right'
                                    }
                                },
                                data: capital_paid
                            }
                        ]
                    } ,
                    //现金流走势
                    chartDataFlow : {
                        ...this.state.chartCapital.chartDataFlow ,
                        xAxis : [
                            {
                                type : 'category',
                                axisTick : {show: false},
                                data : capital_Date
                            }
                        ],
                        series : [
                            {
                                name:'现金流走势',
                                type:'line', //折线图
                                data: capital_surplus
                            }
                        ]
                    }
                },
                chartMarketProfit : {
                    ...this.state.chartMarketProfit ,
                    todaySalesGrossProfit : todaySalesGrossProfit ,
                    salesGrossProfitWeek : salesGrossProfitWeek ,
                    salesGrossProfitMonth : salesGrossProfitMonth ,
                    salesGrossProfitYear : salesGrossProfitYear ,
                    chartData : {
                        ...this.state.chartMarketProfit.chartData ,
                        xAxis : [
                            {
                                type : 'category',
                                data : market_profit_Date,
                                axisTick: {
                                    alignWithLabel: true
                                } ,
                                axisLabel :{
                                    interval : 0
                                }
                            }
                        ],
                        series : [
                            {
                                name:'销售毛利',
                                type:'line', //折线图
                                data: market_profit
                            }
                        ]
                    } ,
                },
            })
        }) ;
    }
    componentWillUnmount(){
        globalEvent.home.market_goal_settings.remove(this.state.market_goal_settings) ;
    }
    _readyCallback_market(){
        // console.info( '销售情况图表完毕' ) ;
    }
    _readyCallback_purchase_store(){

    }
    _readyCallback_capital(){

    }
    _readyCallback_market_profit(){

    }
    _readyCallback_purchase(){

    }
    _readyCallback_customer1(){

    }
    _readyCallback_customer2(){

    }
    _readyCallback_warn(){

    }
    _readyCallback_record(){

    }
    _readyCallback_product(){

    }
    _readyCallback_user(){

    }
    //销售情况 年度 月度 日度
    _ev_market_changeRate(event){
        var rate = event.target.value;
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
        service.home.abnormal_market( params , (error , data)=>{
            console.log(data);
            data = {
                market_chart : data
            } ;
            if(!error){
                // let market_monthComplete = 0 ;
                // let market_yearComplete = 0 ;
                let market_amount = [] ;
                let market_rate = [] ;
                ;(function(){
                    //market_chart
                    try{
                        var rate = data.market_chart.data.dashBoardDtos[0] && parseInt(data.market_chart.data.dashBoardDtos[0].abscissaPoints);
                        if(rate==12){
                            market_rate = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
                        }else if(rate>12&&rate<32){
                            for( let i=0; i<rate; i++){
                                market_rate[i]=(i+1)+'日';
                            }
                        }else{
                            for( let i=0; i<rate; i++){
                                market_rate[i]=(i+1)+'周';
                            }
                        }
                        market_amount = data.market_chart.data.dashBoardDtos.map((v,i) => {
                            return v.soAmount;
                        });
                        // market_monthComplete = data.market_chart.data.dashBoardDtos[0].monthComplete;
                        // market_yearComplete = data.market_chart.data.dashBoardDtos[0].yearComplete;
                    } catch (e){
                        console.warn( '销售记录图表数据处理失败。' ) ;
                    }
                })() ;
                this.setState({
                    chartMarket : {
                        ...this.state.chartMarket ,
                        rate : rate ,
                        chartData : {
                            ...this.state.chartMarket.chartData,
                            xAxis : [{
                                type : 'category',
                                data : market_rate,
                                axisTick: {
                                    alignWithLabel: true
                                } ,
                            }],
                            series :[
                                {
                                    name:'销售额',
                                    type:'line', //折线图
                                    data:market_amount ,
                                },
                            ]
                        }
                    }
                }) ;
            }
        });
    }
    //资金流动 年度 月度 日度
    /*_ev_capital_changeRate(event){
        console.log(this.state);
        var rate = event.target.value;
        service.home.abnormal_capital({
            tenantId: window.globalStore.getState().userstore.user.tenantId ,
            timeType: rate ,
        } , (error , data)=>{
            console.log(data);
            data = {
                capital_chart : data
            } ;
            if(!error){
                let capital_income = [];  //收入
                let capital_paid = [];    //支出
                let capital_surplus = []; //结余
                let capital_Date = [];
                ;(function () {
                    //capital_chart
                    try {
                        capital_income = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                            return v.income;
                        });
                        capital_paid = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                            return v.paid;
                        });
                        capital_surplus = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                            return v.surplus;
                        });
                        capital_Date = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                            return v.weekDay;
                        });
                    } catch(e) {
                        console.warn( '资金流动图表数据处理失败。' , e ) ;
                    }
                })() ;
                this.setState({
                    chartCapital : {
                        ...this.state.chartCapital ,
                        chartData : {
                            ...this.state.chartCapital.chartData ,
                            yAxis : [
                                {
                                    ...this.state.chartCapital.chartData.yAxis[0] ,
                                    data : capital_Date
                                }
                            ],
                            series : [
                                {
                                    name:'利润',
                                    type:'bar',
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'left'
                                        }
                                    },
                                    data: capital_surplus
                                },
                                {
                                    name:'收入',
                                    type:'bar',
                                    stack: '总量',
                                    label: {
                                        normal: {
                                            show: true ,
                                            position: 'left'
                                        }
                                    },
                                    data: capital_income
                                },
                                {
                                    name:'支出',
                                    type:'bar',
                                    stack: '总量',
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'right'
                                        }
                                    },
                                    data: capital_paid
                                }
                            ]
                        } ,
                    },
                }) ;
            }
        });
    }*/
    //现金流走势 年度 月度 日度
    /*_ev_cashFlow_changeRate(event){
        var rate = event.target.value;
        service.home.abnormal_capital({
            tenantId: window.globalStore.getState().userstore.user.tenantId ,
            timeType: rate ,
        } , (error , data)=>{
            console.log(data);
            data = {
                capital_chart : data
            } ;
            if(!error){
                let capital_income = [];  //收入
                let capital_paid = [];    //支出
                let capital_surplus = []; //结余
                let capital_Date = [];
                ;(function () {
                    //capital_chart
                    try {
                        capital_income = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                            return v.income;
                        });
                        capital_paid = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                            return v.paid;
                        });
                        capital_surplus = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                            return v.surplus;
                        });
                        capital_Date = data.capital_chart.data.dashBoardDtos.map((v,i) => {
                            return v.weekDay;
                        });
                    } catch(e) {
                        console.warn( '资金流动图表数据处理失败。' , e ) ;
                    }
                })() ;
                this.setState({
                    chartCapital : {
                        ...this.state.chartCapital ,
                        //现金流走势
                        chartDataFlow : {
                            ...this.state.chartDataFlow ,
                            xAxis : [
                                {
                                    ...this.state.chartDataFlow.xAxis[0] ,
                                    data : capital_Date,
                                }
                            ],
                            series : [
                                {
                                    ...this.state.chartDataFlow.series[0] ,
                                    data: capital_surplus
                                }
                            ]
                        }
                    },
                }) ;
            }
        });
    }*/
    //销售毛利 年度 月度 日度
    _ev_market_profit_changeRate(event){
        var rate = event.target.value;
        var self = this;
        self.setState({
            chartMarketProfit : {
                ...self.state.chartMarketProfit ,
                checkboxValue : rate
            }
        });
        service.home.abnormal_market_profit({
            tenantId: window.globalStore.getState().userstore.user.tenantId ,
            timeType: rate ,
        } , (error , data)=>{
            console.log(data);
            data = {
                market_profit_chart : data
            } ;
            if(!error){
                let market_profit = [];  //毛利
                let market_profit_Date = [];
                ;(function () {
                    //market_profit_chart
                    try{
                        var rate = data.market_profit_chart.data.dashBoardDtos[0] && parseInt(data.market_profit_chart.data.dashBoardDtos[0].abscissaPoints);
                        if(rate==12){
                            market_profit_Date = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
                        }else if(rate>12&&rate<32){
                            for( let i=0; i<rate; i++){
                                market_profit_Date[i]=(i+1)+'日';
                            }
                        }else{
                            for( let i=0; i<rate; i++){
                                market_profit_Date[i]=(i+1)+'周';
                            }
                        }
                        market_profit = data.market_profit_chart.data.dashBoardDtos.map((v,i) => {
                            return v.salesGrossProfit;
                        });
                    } catch (e){
                        console.warn( '销售毛利图表数据处理失败。' ) ;
                    }
                })() ;
                this.setState({
                    chartMarketProfit : {
                        ...self.state.chartMarketProfit ,
                        chartData : {
                            ...self.state.chartMarketProfit.chartData ,
                            xAxis : [
                                {
                                    type : 'category',
                                    data : market_profit_Date,
                                    axisTick: {
                                        alignWithLabel: true
                                    } ,
                                    //axisLabel :{
                                        //interval : 0
                                    //}
                                }
                            ],
                            series : [
                                {
                                    name:'销售毛利',
                                    type:'line', //折线图
                                    data: market_profit
                                }
                            ]
                        } ,
                    },
                }) ;
            }
        });
    }
    //销售设置公司目标
    _ev_market_goal(){
        var market_modal = this.state.chartMarket.bossMonthTarget.map((v)=>{
            return v-0 ;
        }) ;
        market_modal.unshift( this.state.chartMarket.bossYearTarget ) ;
        var goal = market_modal ;
        service.home.market_setting_goals({
            tenantId: window.globalStore.getState().userstore.user.tenantId ,
            tenantTargets: goal ,
        } , (error , data)=>{
            if(data.data.mark == '000000000' ){
                this._evClick_refresh_chartMarket.call(this);
                globalStore.dispatch(home_market_showModal({
                    isShow : false ,
                }));
            }else{
                globalFunction.alert.warning( data.message　,　'操作提示'　) ;
            }
        });
    }
    //客户前十 销售额 销售单数 , filter
    _ev_user_changeFilter(event){
        var type = event.target.value ;
        var self = this ;

        let user_name = [] ;
        let user_value = [] ;
        let user_store = [] ;
        ;(function(){
            try {
                user_store = self.state.chartUser.user_store ;
                user_name = user_store.map((v)=>{
                    return v.customerName ? v.customerName : '客户' + v.customerId ;
                }) ;
                user_value = user_store.map((v)=>{
                    return type === 'price' ? v.soAmountPer-0 : v.soQuantityPer-0 ;
                }) ;
            } catch (e){
                console.warn( '客户图表数据处理失败。' , e ) ;
            }
        })() ;
        this.setState({
            chartUser : {
                ...this.state.chartUser ,
                filter : type ,
                chartData : {
                    ...this.state.chartUser.chartData ,
                    xAxis : [
                        {
                            ...this.state.chartUser.chartData.xAxis[0] ,
                            data : user_name ,
                        }
                    ],
                    series : [
                        {
                            name : '购买额' ,
                            type : 'bar' ,
                            data : user_value ,
                        }
                    ]
                }
            }
        })

    }
    //货品前十 销售额 销售单数 , filter
    _ev_product_changeFilter(event){
        var type = event.target.value ;
        var self = this ;

        let product_name = [] ;
        let product_value = [] ;
        let product_store = [] ;
        ;(function(){
            try {
                product_store = self.state.chartProduct.product_store ;
                product_name = product_store.map((v)=>{
                    return v.itemName ? v.itemName : '客户' + v.itemId ;
                }) ;
                product_value = product_store.map((v)=>{
                    return type === 'price' ? v.soAmountPer-0 : v.soQuantityPer-0 ;
                }) ;
            } catch (e){
                console.warn( '货品图表数据处理失败。' , e ) ;
            }
        })() ;
        this.setState({
            chartProduct : {
                ...this.state.chartProduct ,
                filter : type ,
                chartData : {
                    ...this.state.chartProduct.chartData ,
                    xAxis : [
                        {
                            ...this.state.chartProduct.chartData.xAxis[0] ,
                            data : product_name ,
                        }
                    ],
                    series : [
                        {
                            name : '销售额' ,
                            type : 'bar' ,
                            data : product_value ,
                        }
                    ]
                }
            }
        })
    }
    //销售榜 filter
    _ev_record_changeType(value){
        var type = value ;
        var self = this ;

        var params = {
            startTime : this.state.chartRecord.startTime ,
            endTime : this.state.chartRecord.endTime ,
            type : type ,
        } ;
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.home.fetch_top_market(params,(error,result)=>{
            let top_market_store = [] ;
            let top_market_name = [] ;
            let top_market_value = [] ;
            ;(function(){
                try{
                    top_market_store = result.data.dashBoardDtos ;
                    top_market_name = top_market_store.map((v)=>{
                        return v.userName ? v.userName : '销售员' + v.userId ;
                    }) ;
                    var map = {
                        '0' : 'soAmount' ,
                        '1' : 'soAmountRatio' ,
                        '2' : 'soQuantity' ,
                        '3' : 'customerQuantity' ,
                        '4' : 'soReceivedAmount' ,
                        '5' : 'soReceivedRatio' ,
                    } ;
                    top_market_value = top_market_store.map((v)=>{
                        return v[ map[ type+'' ] ] ;
                    }) ;
                }catch(e){
                    console.warn( '销售排行数据处理失败。' , e ) ;
                }
            })() ;
            this.setState({
                chartRecord : {
                    ...self.state.chartRecord ,
                    type : type ,
                    chartData : {
                        ...self.state.chartRecord.chartData ,
                        yAxis : [
                            {
                                type : 'category',
                                data : top_market_name ,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        series : [
                            {
                                name:'销售金额',
                                type:'bar',
                                barWidth: '30%',
                                data:top_market_value
                            },
                        ]
                    } ,
                },
            })
        })
    }
    //刷新 销售情况
    _evClick_refresh_chartMarket(){
        var params = {
            roleId : 1 ,
        } ;
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.home.abnormal_market(params,(error,data)=>{
            let market_monthComplete = 0 ;
            let market_yearComplete = 0 ;
            let market_amount = [] ;
            let market_rate = [] ;
            ;(function(){
                //market_chart
                try{
                    var rate = data.data.dashBoardDtos[0] && parseInt(data.data.dashBoardDtos[0].abscissaPoints);
                    if(rate==12){
                        market_rate = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
                    }else if(rate>12&&rate<32){
                        for( let i=0; i<rate; i++){
                            market_rate[i]=(i+1)+'日';
                        }
                    }else{
                        for( let i=0; i<rate; i++){
                            market_rate[i]=(i+1)+'周';
                        }
                    }
                    market_amount = data.data.dashBoardDtos.map((v,i) => {
                        return v.soAmount;
                    });
                    market_monthComplete = data.data.dashBoardDtos[0].monthComplete;
                    market_yearComplete = data.data.dashBoardDtos[0].yearComplete;
                } catch (e){
                    console.warn( '销售记录图表数据处理失败。' , e ) ;
                }
            })() ;
            var self = this ;
            setTimeout(function(){
                self.setState({
                    chartMarket: {
                        ...self.state.chartMarket,
                        rate: '2',
                        charts_market_monthComplete: market_monthComplete,
                        charts_market_yearComplete: market_yearComplete,
                        chartData: {
                            ...self.state.chartMarket.chartData,
                            xAxis: [{
                                type: 'category',
                                data: market_rate,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }],
                            series: [
                                {
                                    name: '销售额',
                                    type: 'line', //折线图
                                    data: market_amount,
                                },
                            ]
                        }
                    },
                });
            },0) ;

        })
    }
    //刷新 异常
    _evClick_refresh_chartWarn(){
        var self = this ;

        var params = {

        } ;
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.home.abnormal_warning(params,(error,result)=>{
            let soWeekOverRecAmount = 0 ;
            let warn_sRA = [] ;
            let warn_sORA = [] ;
            let warn_ctms = [] ;
            ;(function () {
                //warn_chart
                try {
                    warn_ctms = result.data.dashBoardDtos.map((v,i) => {
                        return v.customerName;
                    });
                    warn_sRA = result.data.dashBoardDtos.map((v,i) => {
                        return v.salesReceivableAmount;
                    });
                    warn_sORA = result.data.dashBoardDtos.map((v,i) => {
                        return v.soOverRecAmount;
                    });
                    soWeekOverRecAmount = result.data.dashBoardDtos[0] ? result.data.dashBoardDtos[0].soWeekOverRecAmount : ''　;
                } catch(e) {
                    console.warn( '异常预警图表数据处理失败。' , e ) ;
                }
            })() ;
            this.setState({
                chartWarn : {
                    ...this.state.chartWarn ,
                    charts_warn_soWeekOverRecAmount : soWeekOverRecAmount , //
                    chartData : {
                        ...this.state.chartWarn.chartData ,
                        yAxis : [{
                            ...this.state.chartWarn.chartData.yAxis[0] ,
                            data : warn_ctms
                        }],
                        series :[
                            {
                                name:'应收金额',
                                type:'bar',
                                barWidth: '30%',
                                stack: '统计',
                                data:warn_sRA
                            },
                            {
                                name:'逾期应收',
                                type:'bar',
                                barWidth : '30%' ,
                                stack: '统计',
                                data:warn_sORA
                            },
                        ]
                    }
                },
            })
        })
    }
    //刷新 客户
    _evClick_refresh_chartUser(){
        var self = this ;

        var params = {
            startTime : this.state.chartUser.startTime ,
            endTime : this.state.chartUser.endTime ,
        } ;
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.home.abnormal_top_users(params,(error,result)=>{
            let user_name = [] ;
            let user_value = [] ;
            let user_store = [] ;
            ;(function(){
                try {
                    user_store = result.data.dashBoardDtos ;
                    user_name = user_store.map((v)=>{
                        return v.customerName ? v.customerName : '客户' + v.customerId ;
                    }) ;
                    var type = self.state.chartUser.filter ;
                    user_value = user_store.map((v)=>{
                        return type === 'price' ? v.soAmountPer-0 : v.soQuantityPer-0 ;
                    }) ;
                } catch (e){
                    console.warn( '客户图表数据处理失败。' , e ) ;
                }
            })() ;
            this.setState({
                chartUser : {
                    ...this.state.chartUser ,
                    user_store : user_store ,
                    chartData : {
                        ...this.state.chartUser.chartData ,
                        xAxis : [
                            {
                                ...this.state.chartUser.chartData.xAxis[0] ,
                                data : user_name ,
                            }
                        ],
                        series : [
                            {
                                name : '购买额' ,
                                type : 'bar' ,
                                data : user_value ,
                            }
                        ]
                    }
                }
            })
        })
    }
    //刷新 货品
    _evClick_refresh_chartProduct(){
        var self = this ;

        var params = {
            startTime : this.state.chartProduct.startTime ,
            endTime : this.state.chartProduct.endTime ,
        } ;
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.home.fetch_top_product(params,(error,result)=>{
            let product_name = [] ;
            let product_value = [] ;
            let product_store = [] ;
            ;(function(){
                try {
                    product_store = result.data.dashBoardDtos ;
                    product_name = product_store.map((v)=>{
                        return v.itemName ? v.itemName : '货品' + v.itemId ;
                    }) ;
                    var type = self.state.chartProduct.filter ;
                    product_value = product_store.map((v)=>{
                        return type === 'price' ? v.soAmountPer-0 : v.soQuantityPer-0 ;
                    }) ;
                } catch (e){
                    console.warn( '货品图表数据处理失败。' , e ) ;
                }
            })() ;
            this.setState({
                chartProduct : {
                    ...this.state.chartProduct ,
                    product_store : product_store ,
                    chartData : {
                        ...this.state.chartProduct.chartData ,
                        xAxis : [
                            {
                                ...this.state.chartProduct.chartData.xAxis[0] ,
                                data : product_name ,
                            }
                        ],
                        series : [
                            {
                                name : '销售额' ,
                                type : 'bar' ,
                                data : product_value ,
                            }
                        ]
                    }
                }
            })
        })
    }
    //刷新 销售榜单
    _evClick_refresh_chartRecord(){
        var self = this ;

        var params = {
            startTime : this.state.chartRecord.startTime ,
            endTime : this.state.chartRecord.endTime ,
            type : this.state.chartRecord.type ,
        } ;
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.home.fetch_top_market(params,(error,result)=>{
            let top_market_store = [] ;
            let top_market_name = [] ;
            let top_market_value = [] ;
            ;(function(){
                try{
                    top_market_store = result.data.dashBoardDtos ;
                    top_market_name = top_market_store.map((v)=>{
                        return v.userName ? v.userName : '销售员' + v.userId ;
                    }) ;
                    var map = {
                        '0' : 'soAmount' ,
                        '1' : 'soAmountRatio' ,
                        '2' : 'soQuantity' ,
                        '3' : 'customerQuantity' ,
                        '4' : 'soReceivedAmount' ,
                        '5' : 'soReceivedRatio' ,
                    } ;
                    top_market_value = top_market_store.map((v)=>{
                        return v[ map[ self.state.chartRecord.type+'' ] ] ;
                    }) ;
                }catch(e){
                    console.warn( '销售排行数据处理失败。' , e ) ;
                }
            })() ;
            this.setState({
                chartRecord : {
                    ...self.state.chartRecord ,
                    chartData : {
                        ...self.state.chartRecord.chartData ,
                        yAxis : [
                            {
                                type : 'category',
                                data : top_market_name ,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        series : [
                            {
                                name:'销售金额',
                                type:'bar',
                                barWidth: '30%',
                                data:top_market_value
                            },
                        ]
                    } ,
                },
            })
        })
    }
    //刷新 库存数据
    _evClick_refresh_chartPurchaseStore(){
        var self = this ;
        var params = {} ;
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.home.fetch_pruchase_store_boss(params,(error,result)=>{
            let purchaseStore_currentStockCost = 0 ;
            let purchaseStore_name = [] ;
            let purchaseStore_value = [] ;
            ;(function(){
                try{
                    var purchaseStore_store = result.data.dashBoardDtos || [] ;
                    purchaseStore_currentStockCost = purchaseStore_store[0] ? purchaseStore_store[0].currentStockCost : 0 ;
                    purchaseStore_name = purchaseStore_store.map((v)=>{
                        return v.itemName ? v.itemName : '货品' + v.itemId ;
                    }) ;
                    purchaseStore_value = purchaseStore_store.map((v)=>{
                        return {
                            name : v.itemName ? v.itemName : '货品' + v.itemId ,
                            value : parseInt( v.stockCost ) - 0
                        }
                    }) ;
                }catch(e){
                    console.warn( '库存图表数据处理失败。' , e ) ;
                }
            })() ;
            this.setState({
                chartPurchaseStore : {
                    ...this.state.chartPurchaseStore ,
                    currentStockCost : purchaseStore_currentStockCost ,
                    chartData : {
                        ...this.state.chartPurchaseStore.chartData ,
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: purchaseStore_name ,
                        },
                        series : [
                            {
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                data: purchaseStore_value,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    } ,
                },
            }) ;
        })
    }
    //刷新 客户管理
    _evClick_refresh_chartCustomer(){
        var self = this ;
        var params = {} ;
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.home.fetch_usernew_boss(params,(error,result)=>{
            //客户管理
            let customerCount = 0 ;
            let customerThisWeek = 0 ;
            let customerData1 = [{
                value : 0 ,
                name : '本周成交客户' ,
            },{
                value : 0 ,
                name : '本周未成交客户' ,
            }] ;
            let customerData2 = [{
                value : 0 ,
                name : '成交客户'
            },{
                value : 0 ,
                name : '未成交客户'
            }] ;
            ;(function(){
                try{
                    var customer_store = result.data.dashBoardDto ;
                    customerCount = customer_store.customerCount ;
                    customerThisWeek = customer_store.customerThisWeek ;
                    customerData1 = [{
                        value : parseInt(customer_store.dealCustomerThisWeek) - 0  ,
                        name : '本周成交客户' ,
                    },{
                        value : ( parseInt(customerCount) - 0 ) - ( parseInt(customer_store.dealCustomerThisWeek) - 0 ),
                        name : '本周未成交客户' ,
                    }] ;
                    customerData2 = [{
                        value : parseInt(customer_store.dealCustomerCount) - 0  ,
                        name : '成交客户' ,
                    },{
                        value : ( parseInt(customerCount) - 0 ) - ( parseInt(customer_store.dealCustomerCount) - 0 ),
                        name : '未成交客户' ,
                    }] ;
                }catch(e){
                    console.warn( '客户管理图表数据处理失败。' , e ) ;
                }
            })() ;
            this.setState({
                chartCustomer : {
                    ...this.state.chartCustomer ,
                    customerCount : customerCount ,
                    customerThisWeek : customerThisWeek ,
                    chartData1 : {
                        ...this.state.chartCustomer.chartData1 ,
                        series : [
                            {
                                type: 'pie',
                                radius: ['30%','50%'],
                                label: {
                                    normal: {
                                        show: false,
                                    },
                                },
                                data: customerData1,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                },
                            }
                        ]
                    } ,
                    chartData2 : {
                        ...this.state.chartCustomer.chartData2 ,
                        series : [
                            {
                                type: 'pie',
                                radius: ['30%','50%'],
                                label: {
                                    normal: {
                                        show: false,
                                    },
                                },
                                data:customerData2,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                },
                            }
                        ]
                    }
                },
            }) ;
        })
    }
    //刷新 库存管理
    _evClick_refresh_chartPurchase(){
        var self = this ;
        var params = {} ;
        if ( this.props.userstore.user.roleIds[ 0 ] == 1 ){
            params.tenantId = window.globalStore.getState().userstore.user.tenantId ;
        } else {
            params.userId = window.globalStore.getState().userstore.user.id ;
        }
        service.home.fetch_pruchase_boss(params,(error1,result1)=>{
            service.home.fetchPurchaseYearGoals(params,(error2,result2)=>{
                if ( error1 || error2 ){
                    globalFunction.alert.warning( '库存数据获取失败' , '操作提示' ) ;
                    return ;
                }
                //采购情况
                let purchase_yearAllMount = 0 ;
                let purchase_yearPrev = [0] ;
                let purchase_yearPrevExist = 0 ;
                let purchase_yearPrevPercent = '0%' ;
                let purchase_name = [] ;
                let purchase_value = [] ;
                ;(function(){
                    try{
                        var purchase_store = result1.data.dashBoardDtos ;
                        purchase_yearPrevExist = result2.data.dashBoardDto && (result2.data.dashBoardDto.tenantTargets[0]-0) ;
                        purchase_yearPrev = [ purchase_yearPrevExist ] ;
                        purchase_store.forEach((v,i)=>{
                            if ( i === 0 ){
                                purchase_yearAllMount = v.poAmount - 0 ;
                            } else {
                                purchase_name.push( v.itemName ? v.itemName : '采购货品' + v.itemId ) ;
                                purchase_value.push({
                                    name : v.itemName ? v.itemName : '采购货品' + v.itemId ,
                                    value : v.poAmount - 0 ,
                                }) ;
                            }
                        }) ;
                        purchase_yearPrevPercent = (purchase_yearPrevExist === 0)
                            ? '0%'
                            : ( ( purchase_yearAllMount/purchase_yearPrevExist ) * 100 ).toFixed( 2 ) + '%'  ;
                    }catch(e){
                        console.warn( '采购情况图表数据处理失败。' , e ) ;
                    }
                })() ;
                this.setState({
                    chartPurchase : {
                        ...this.state.chartPurchase ,
                        yearPrev : purchase_yearPrev ,
                        yearPrevExist : purchase_yearPrevExist ,
                        yearPrevPercent : purchase_yearPrevPercent ,
                        yearAllMount : purchase_yearAllMount ,
                        chartData : {
                            ...this.state.chartPurchase.chartData ,
                            legend: {
                                orient: 'vertical',
                                left: 'left',
                                data: purchase_name
                            },
                            series : [
                                {
                                    type: 'pie',
                                    radius : '55%',
                                    center: ['50%', '60%'],
                                    data: purchase_value ,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        }
                                    }
                                }
                            ]
                        } ,
                    },
                })

            })
        }) ;
    }
    //刷新 资金情况
    _evClick_refresh_chartCapital(){
        var self = this ;

        var params = {
            tenantId :window.globalStore.getState().userstore.user.tenantId
        } ;
        service.home.abnormal_capital(params,(error,data)=>{
            let capital_income = [];  //收入
            let capital_paid = [];    //支出
            let capital_surplus = []; //结余
            let capital_Date = [];
            ;(function () {
                //capital_chart
                try {
                    capital_income = data.data.dashBoardDtos.map((v,i) => {
                        return v.income;
                    });
                    capital_paid = data.data.dashBoardDtos.map((v,i) => {
                        return v.expenditure;
                    });
                    capital_surplus = data.data.dashBoardDtos.map((v,i) => {
                        return v.surplus;
                    });
                    capital_Date = data.data.dashBoardDtos.map((v,i) => {
                        return v.weekDay;
                    });
                } catch(e) {
                    console.warn( '资金流动图表数据处理失败。' , e ) ;
                }
            })() ;
            this.setState({
                chartCapital : {
                    ...self.state.chartCapital ,
                    chartData : {
                        ...self.state.chartCapital.chartData ,
                        series : [
                            {
                                name:'利润',
                                type:'bar',
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'left'
                                    }
                                },
                                data: capital_surplus
                            },
                            {
                                name:'收入',
                                type:'bar',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: false ,
                                        position: 'left'
                                    }
                                },
                                data: capital_income
                            },
                            {
                                name:'支出',
                                type:'bar',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'right'
                                    }
                                },
                                data: capital_paid
                            }
                        ]
                    } ,
                },
            })
        })
    }
    //刷新 销售毛利
    _evClick_refresh_chartMarketProfit(){
        var self = this ;

        var params = {
            tenantId :window.globalStore.getState().userstore.user.tenantId
        } ;
        service.home.abnormal_market_profit(params,(error,data)=>{
            let market_profit = [];  //毛利
            let market_profit_Date = [];
            let todaySalesGrossProfit = [];
            let salesGrossProfitWeek = [];
            let salesGrossProfitMonth = [];
            let salesGrossProfitYear = [];
            ;(function () {
                //market_profit_chart
                try {
                    console.log(data);
                    var rate = data.data.dashBoardDtos[0] && parseInt(data.data.dashBoardDtos[0].abscissaPoints);
                    if(rate==12){
                        market_profit_Date = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
                    }else if(rate>12&&rate<32){
                        for( let i=0; i<rate; i++){
                            market_profit_Date[i]=(i+1)+'日';
                        }
                    }else{
                        for( let i=0; i<rate; i++){
                            market_profit_Date[i]=(i+1)+'周';
                        }
                    }
                    market_profit = data.data.dashBoardDtos.map((v,i) => {
                        return v.salesGrossProfit;
                    });
                    todaySalesGrossProfit = data.data.dashBoardDtos[0].todaySalesGrossProfit;
                    salesGrossProfitWeek = data.data.dashBoardDtos[0].salesGrossProfitWeek;
                    salesGrossProfitMonth = data.data.dashBoardDtos[0].salesGrossProfitMonth;
                    salesGrossProfitYear = data.data.dashBoardDtos[0].salesGrossProfitYear;
                } catch(e) {
                    console.warn( '销售毛利图表数据处理失败。' , e ) ;
                }
            })() ;
            this.setState({
                chartMarketProfit : {
                    ...self.state.chartMarketProfit ,
                    checkboxValue : '2' ,
                    todaySalesGrossProfit : todaySalesGrossProfit ,
                    salesGrossProfitWeek : salesGrossProfitWeek ,
                    salesGrossProfitMonth : salesGrossProfitMonth ,
                    salesGrossProfitYear : salesGrossProfitYear ,
                    chartData : {
                        ...self.state.chartMarketProfit.chartData ,
                        xAxis : [
                            {
                                type : 'category',
                                data : market_profit_Date,
                                axisTick: {
                                    alignWithLabel: true
                                } ,
                                //axisLabel :{
                                    //interval : 0
                                //}
                            }
                        ],
                        series : [
                            {
                                name:'销售毛利',
                                type:'line', //折线图
                                data: market_profit
                            }
                        ]
                    } ,
                },
            });
        })
    }
    _ev_goto_marketList(){
        browserHistory.push('/market/list?state=new');
    }
    _ev_goto_baseCustomer(){
        browserHistory.push('/base/b_customer?state=new');
    }
    _ev_goto_chargeAccount(){
        browserHistory.push('/account/chargeAccount');
    }
    _ev_goto_baseProduct(){
        browserHistory.push('/base/b_product?state=new');
    }
    _ev_goto_baseProductForShow(){
        browserHistory.push('/base/b_product');
    }
    _ev_goto_s_invoicing(){
        browserHistory.push('/statistics/s_invoicing/s_d_invoicing');
    }
    _ev_goto_purchaseOrder(){
        browserHistory.push('/purchase/order?state=new');
    }
    _ev_goto_baseSupplier(){
        browserHistory.push('/base/b_supplier?state=new');
    }
    _ev_goto_accountUser(){
        browserHistory.push('/account/checkAccount/user');
    }
    _ev_goto_statistics_accountPay(){
        browserHistory.push('/statistics/s_account/s_c_pay');
    }
    render(){
        //根据roleId决定渲染模式
        if ( this.props.userstore.user.isEmpty ){
            return (
                <span></span>
            ) ;
        } else {
            console.log( this.props.userstore.user.roleIds[ 0 ] ) ;
            //注意顺序
            switch ( this.props.userstore.user.roleIds[ 0 ] ){
                case (1) :
                    return this._renderBoss() ;
                break ;
                case (3) :
                    return this._renderMarket() ;
                break ;
                case (4) :
                    return this._renderPurchase() ;
                break ;
                case (2) :
                    return this._renderFinance() ;
                break ;
                default :
                    globalFunction.alert.warning( '你尚未选择自身角色, 请重新登录。' )
                    setTimeout(function(){
                        window.location.href = '/passport/login' ;
                    },2000) ;
                    return (
                        <span>您尚无权限查看报表</span>
                    ) ;
                break ;
            }
        }
    }
    _renderBoss(){
        var classes = cx({
            'home-modal-market' : true ,
            'content-show' : ( this.props.home.market_modal_show )
        }) ;
        let alertPay_percent = this.state.statisticsBoss.alertPay_percent ;
        let alertMarket_percent = this.state.statisticsBoss.alertMarket_percent ;
        let alertStore_percent = this.state.statisticsBoss.alertStore_percent ;

        console.info( 'boss render with data : ' ,  this.state ) ;

        if ( !this.state.statisticsBoss.isReady ){
            return ( <div className="home-waiting">

            </div> ) ;
        }

        return (
            <div className="body-content">

                <Crumbs></Crumbs>

                <div className="all-statistics-wrap">

                    <div className="all-statistics">

                        <div className="comp-title">公司预警信息</div>

                        <div className="comp-statistics">
                            <span className="each-statistics" onClick={this._ev_goto_statistics_accountPay}>
                                <div className="s-title">应收总额</div>
                                {/*<div className="s-count">￥{this.props.home.alertText.salesReceivableAmount}</div>*/}
                                <div className="s-count">￥{this.state.statisticsBoss.alertShould_all}</div>
                                <div className="s-foot">
                                    <span>应收逾期</span>
                                    {/*<span>￥{this.props.home.alertText.soOverRecAmount}</span>*/}
                                    <span>￥{this.state.statisticsBoss.alertShould_delay}</span>
                                </div>
                            </span>
                            <span className="each-statistics" onClick={this._ev_goto_statistics_accountPay}>
                                <div className="s-title">下周应付总额</div>
                                {/*<div className="s-count">￥{this.props.home.alertText.poNextPayableAmount}</div>*/}
                                <div className="s-count">￥{this.state.statisticsBoss.alertPay_next}</div>
                                <div className="s-foot">
                                    <span>同比上周{parseFloat(alertPay_percent) < 0 ? '下降' : '增长'}</span>
                                    <span><i></i>{Math.abs(parseFloat(alertPay_percent))}%</span>
                                </div>
                            </span>
                            <span className="each-statistics" onClick={this._ev_goto_s_invoicing}>
                                <div className="s-title">销售毛利</div>
                                <div className="s-count">￥{this.state.statisticsBoss.alertMarket_all}</div>
                                <div className="s-foot">
                                    <span>同比上一工作日{parseFloat(alertMarket_percent) < 0 ? '下降' : '增长'}</span>
                                    <span><i></i>{Math.abs(parseFloat(alertMarket_percent))}%</span>
                                </div>
                            </span>
                            <span className="each-statistics" onClick={this._ev_goto_baseProductForShow}>
                                <div className="s-title">库存成本</div>
                                <div className="s-count">￥{this.state.statisticsBoss.alertStore_all}</div>
                                <div className="s-foot">
                                    <span>同比上周{parseFloat(alertStore_percent) < 0 ? '下降' : '增长'}</span>
                                    <span><i></i>{Math.abs(parseFloat(alertStore_percent))}%</span>
                                </div>
                            </span>
                        </div>

                    </div>

                    <div className="chart-outer-title">公司整体运营</div>

                    <div className="chart-area">

                        <QueueAnim className="chart-area-sortable"
                            type="bottom"
                            duration={800}
                            interval={250}
                        >

                        <div key="anime-1" className="chart-market-wrap e-chart-wrap" style={this._setChartVisiable.call(this,'chartMarket')}>
                            <div className="c-title">
                                <span className="c-title-text">销售情况</span>
                                <span className="c-title-operation">
                                    <span className="c-operation">
                                        <i className="sprite-btn_add" />
                                        <ul className="c-operation-ul">
                                            <li onClick={this._ev_goto_marketList}>新增销售记录</li>
                                            <li onClick={this._ev_goto_baseCustomer}>新增客户</li>
                                        </ul>
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={()=>{
                                            globalStore.dispatch(home_market_showModal({
                                                isShow : true ,
                                            }));
                                            service.home.fetchCompanyGoals({
                                                tenantId : window.globalStore.getState().userstore.user.tenantId
                                            },(result)=>{
                                                if ( result.mark == '000000000' ){
                                                    var year = result.data.dashBoardDto.tenantTargets.shift() - 0 ;
                                                    var month = result.data.dashBoardDto.tenantTargets.map((v)=>{
                                                        return v-0 ;
                                                    }) ;
                                                    this.setState({
                                                        chartMarket : {
                                                            ...this.state.chartMarket ,
                                                            bossMonthTarget : month ,
                                                            bossYearTarget : year ,
                                                        }
                                                    })
                                                } else {
                                                    globalFunction.alert.warning( result.message , '提示' ) ;
                                                }
                                            }) ;
                                        }
                                    }>
                                        <i className="sprite-btn_setting_s" />
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={()=>{
                                            this._hideChart.call(this,'chartMarket') ;
                                        }}
                                    >
                                        <i className="sprite-btn_del_s" />
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={this._evClick_refresh_chartMarket.bind(this)}
                                    >
                                        <i className="sprite-btn_refresh_s" />
                                    </span>
                                </span>
                            </div>
                            <div className="c-content">
                                <div className="c-count">
                                    <span className="c-count-choose">
                                        <RadioGroup
                                            onChange={this._ev_market_changeRate.bind(this)}
                                            value={this.state.chartMarket.rate}
                                        >
                                            <RadioButton value="2">月度</RadioButton>
                                            <RadioButton value="1">周度</RadioButton>
                                            <RadioButton value="0">日度</RadioButton>
                                        </RadioGroup>
                                    </span>
                                    <span className="c-count-span">
                                        本月完成进度<span>{this.state.chartMarket.charts_market_monthComplete}</span>, 本年完成进度<span>{this.state.chartMarket.charts_market_yearComplete}</span>
                                    </span>
                                </div>
                                <div className="chart-market e-chart">

                                    <ReactEcharts
                                        ref="chart-market"
                                        option={this.state.chartMarket.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '560px',height: '252px'}}
                                        /* theme={"my_theme"} */
                                        onChartReady={this._readyCallback_market.bind(this)}
                                    />

                                </div>
                            </div>
                            <div className={classes}>
                                <div className="c-title">
                                    <span className="c-title-text">目标设置</span>
                                    <span className="c-title-operation">
                                        <span
                                            className="c-operation"
                                            onClick={()=>{
                                                    globalStore.dispatch(home_market_showModal({
                                                        isShow : false ,
                                                    }));
                                                }
                                            }
                                        >
                                            关闭
                                        </span>
                                    </span>
                                </div>
                                <div className="modal-content">
                                    <Form
                                        className="form-static"
                                    >
                                        <FormItem
                                            label="年度目标"
                                            labelCol={{span:4}}
                                            wrapperCol={{span:12}}
                                        >
                                            <Input
                                                size="default"
                                                disabled
                                                value={this.state.chartMarket.bossYearTarget}
                                                onChange={(event)=>{
                                                    this.setState({
                                                        chartMarket : {
                                                            ...this.state.chartMarket ,
                                                            bossYearTarget : event.target.value ,
                                                        }
                                                    })
                                                }}
                                            />

                                        </FormItem>
                                    </Form
                                        >
                                    <Form
                                        inline
                                        className="form-static"
                                        style={{
                                            paddingLeft: '37px',
                                            marginBottom: '18px'
                                        }}
                                    >
                                        <FormItem
                                            label="1月目标"
                                        >
                                            <Input
                                                size="default"
                                                value={this.state.chartMarket.bossMonthTarget[0]}
                                                onChange={(event)=>{
                                                    var _t = this.state.chartMarket.bossMonthTarget.concat() ;
                                                    _t[0] = event.target.value ;
                                                    this.setState({
                                                        chartMarket : {
                                                            ...this.state.chartMarket ,
                                                            bossMonthTarget : _t ,
                                                            bossYearTarget : this.__plusAll(_t,this.state.chartMarket.bossYearTarget)
                                                        }
                                                    })

                                                }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="2月目标"
                                        >
                                            <Input
                                                size="default"
                                                value={this.state.chartMarket.bossMonthTarget[1]}
                                                onChange={(event)=>{
                                                    var _t = this.state.chartMarket.bossMonthTarget.concat() ;
                                                    _t[1] = event.target.value  ;
                                                    this.setState({
                                                        chartMarket : {
                                                            ...this.state.chartMarket ,
                                                            bossMonthTarget : _t ,
                                                            bossYearTarget : this.__plusAll(_t,this.state.chartMarket.bossYearTarget) ,
                                                        }
                                                    })

                                                }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="3月目标"
                                        >
                                            <Input
                                                size="default"
                                                value={this.state.chartMarket.bossMonthTarget[2]}
                                                onChange={(event)=>{
                                                    var _t = this.state.chartMarket.bossMonthTarget.concat() ;
                                                    _t[2] = event.target.value  ;
                                                    this.setState({
                                                        chartMarket : {
                                                            ...this.state.chartMarket ,
                                                            bossMonthTarget : _t ,
                                                            bossYearTarget : this.__plusAll(_t,this.state.chartMarket.bossYearTarget) ,
                                                        }
                                                    })

                                                }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="4月目标"
                                        >
                                            <Input
                                                size="default"
                                                value={this.state.chartMarket.bossMonthTarget[3]}
                                                onChange={(event)=>{
                                                    var _t = this.state.chartMarket.bossMonthTarget.concat() ;
                                                    _t[3] = event.target.value  ;
                                                    this.setState({
                                                        chartMarket : {
                                                            ...this.state.chartMarket ,
                                                            bossMonthTarget : _t ,
                                                            bossYearTarget : this.__plusAll(_t,this.state.chartMarket.bossYearTarget) ,
                                                        }
                                                    })

                                                }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="5月目标"
                                        >
                                            <Input
                                                size="default"
                                                value={this.state.chartMarket.bossMonthTarget[4]}
                                                onChange={(event)=>{
                                                    var _t = this.state.chartMarket.bossMonthTarget.concat() ;
                                                    _t[4] = event.target.value ;
                                                    this.setState({
                                                        chartMarket : {
                                                            ...this.state.chartMarket ,
                                                            bossMonthTarget : _t ,
                                                            bossYearTarget : this.__plusAll(_t,this.state.chartMarket.bossYearTarget) ,
                                                        }
                                                    })

                                                }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="6月目标"
                                        >
                                            <Input
                                                size="default"
                                                value={this.state.chartMarket.bossMonthTarget[5]}
                                                onChange={(event)=>{
                                                    var _t = this.state.chartMarket.bossMonthTarget.concat() ;
                                                    _t[5] = event.target.value ;
                                                    this.setState({
                                                        chartMarket : {
                                                            ...this.state.chartMarket ,
                                                            bossMonthTarget : _t ,
                                                            bossYearTarget : this.__plusAll(_t,this.state.chartMarket.bossYearTarget) ,
                                                        }
                                                    })

                                                }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="7月目标"
                                        >
                                            <Input
                                                size="default"
                                                value={this.state.chartMarket.bossMonthTarget[6]}
                                                onChange={(event)=>{
                                                    var _t = this.state.chartMarket.bossMonthTarget.concat() ;
                                                    _t[6] = event.target.value ;
                                                    this.setState({
                                                        chartMarket : {
                                                            ...this.state.chartMarket ,
                                                            bossMonthTarget : _t ,
                                                            bossYearTarget : this.__plusAll(_t,this.state.chartMarket.bossYearTarget) ,
                                                        }
                                                    })

                                                }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="8月目标"
                                        >
                                            <Input
                                                size="default"
                                                value={this.state.chartMarket.bossMonthTarget[7]}
                                                onChange={(event)=>{
                                                    var _t = this.state.chartMarket.bossMonthTarget.concat() ;
                                                    _t[7] = event.target.value ;
                                                    this.setState({
                                                        chartMarket : {
                                                            ...this.state.chartMarket ,
                                                            bossMonthTarget : _t ,
                                                            bossYearTarget : this.__plusAll(_t,this.state.chartMarket.bossYearTarget) ,
                                                        }
                                                    })

                                                }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="9月目标"
                                        >
                                            <Input
                                                size="default"
                                                value={this.state.chartMarket.bossMonthTarget[8]}
                                                onChange={(event)=>{
                                                    var _t = this.state.chartMarket.bossMonthTarget.concat() ;
                                                    _t[8] = event.target.value ;
                                                    this.setState({
                                                        chartMarket : {
                                                            ...this.state.chartMarket ,
                                                            bossMonthTarget : _t ,
                                                            bossYearTarget : this.__plusAll(_t,this.state.chartMarket.bossYearTarget) ,
                                                        }
                                                    })

                                                }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="10月目标"
                                        >
                                            <Input
                                                size="default"
                                                value={this.state.chartMarket.bossMonthTarget[9]}
                                                onChange={(event)=>{
                                                    var _t = this.state.chartMarket.bossMonthTarget.concat() ;
                                                    _t[9] = event.target.value ;
                                                    this.setState({
                                                        chartMarket : {
                                                            ...this.state.chartMarket ,
                                                            bossMonthTarget : _t ,
                                                            bossYearTarget : this.__plusAll(_t,this.state.chartMarket.bossYearTarget) ,
                                                        }
                                                    })

                                                }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="11月目标"
                                        >
                                            <Input
                                                size="default"
                                                value={this.state.chartMarket.bossMonthTarget[10]}
                                                onChange={(event)=>{
                                                    var _t = this.state.chartMarket.bossMonthTarget.concat() ;
                                                    _t[10] = event.target.value ;
                                                    this.setState({
                                                        chartMarket : {
                                                            ...this.state.chartMarket ,
                                                            bossMonthTarget : _t ,
                                                            bossYearTarget : this.__plusAll(_t,this.state.chartMarket.bossYearTarget) ,
                                                        }
                                                    })

                                                }}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="12月目标"
                                        >
                                            <Input
                                                size="default"
                                                value={this.state.chartMarket.bossMonthTarget[11]}
                                                onChange={(event)=>{
                                                    var _t = this.state.chartMarket.bossMonthTarget.concat() ;
                                                    _t[11] = event.target.value ;
                                                    this.setState({
                                                        chartMarket : {
                                                            ...this.state.chartMarket ,
                                                            bossMonthTarget : _t ,
                                                            bossYearTarget : this.__plusAll(_t,this.state.chartMarket.bossYearTarget) ,
                                                        }
                                                    })

                                                }}
                                            />
                                        </FormItem>
                                    </Form>
                                    <Button type="primary"  htmlType="submit" onClick={this._ev_market_goal.bind(this)}>确定</Button>
                                </div>
                            </div>
                        </div>
                        
                        <div key="anime-2" className="chart-capital-wrap e-chart-wrap" style={this._setChartVisiable.call(this,'chartCapital')}>
                            <div className="c-title">
                                <span className="c-title-text">资金情况</span>
                                <span className="c-title-operation">
                                    <span className="c-operation">
                                        <i className="sprite-btn_add" />
                                        <ul className="c-operation-ul">
                                            <li onClick={this._ev_goto_chargeAccount}>查看流水</li>

                                        </ul>
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={()=>{
                                            this._hideChart.call(this,'chartCapital') ;
                                        }}
                                    >
                                        <i className="sprite-btn_del_s" />
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={this._evClick_refresh_chartCapital.bind(this)}
                                    >
                                        <i className="sprite-btn_refresh_s" />
                                    </span>
                                </span>
                            </div>
                            <div className="c-content">
                                <div className="chart-capital e-chart">
                                    <ReactEcharts
                                        ref="chart-capital"
                                        option={this.state.chartCapital.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '560px',height: '287px'}}
                                        onChartReady={this._readyCallback_capital.bind(this)}
                                    />

                                </div>
                            </div>
                        </div>
                        
                        <div key="anime-3" className="chart-purchase-store-wrap e-chart-wrap" style={this._setChartVisiable.call(this,'chartPurchaseStore')}>
                            <div className="c-title">
                                <span className="c-title-text">库存情况</span>
                                <span className="c-title-operation">
                                    <span className="c-operation">
                                        <i className="sprite-btn_add" />
                                        <ul className="c-operation-ul">
                                            <li onClick={this._ev_goto_baseProduct}>新增货品</li>
                                        </ul>
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={()=>{
                                            this._hideChart.call(this,'chartPurchaseStore') ;
                                        }}
                                    >
                                        <i className="sprite-btn_del_s" />
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={this._evClick_refresh_chartPurchaseStore.bind(this)}
                                    >
                                        <i className="sprite-btn_refresh_s" />
                                    </span>
                                </span>
                            </div>
                            <div className="c-content">
                                <div className="c-count">
                                    {/*<span className="left-span">
                                        <div>
                                            <span>本周库存情况:</span>
                                            <span>$100</span>
                                        </div>
                                        <div>
                                            <span>本月库存情况:</span>
                                            <span>$200</span>
                                        </div>
                                    </span>*/}
                                    <span className="center-span">
                                        <span>当前库存:</span>
                                        <span>￥{this.state.chartPurchaseStore.currentStockCost}</span>
                                    </span>
                                    {/*
                                    <span className="right-span">
                                        <div>
                                            <span>低库存预警:</span>
                                            <span>0</span>
                                        </div>
                                        <div>
                                            <span>高库存预警:</span>
                                            <span>0</span>
                                        </div>
                                    </span>
                                     */}
                                </div>
                                <div className="chart-purchase-store e-chart">
                                    <ReactEcharts
                                        ref="chart-purchase-store"
                                        option={this.state.chartPurchaseStore.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '560px',height: '252px'}}
                                        onChartReady={this._readyCallback_purchase_store.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div key="anime-4" className="chart-market-profit-wrap e-chart-wrap" style={this._setChartVisiable.call(this,'chartMarketProfit')}>
                            <div className="c-title">
                                <span className="c-title-text">销售毛利</span>
                                <span className="c-title-operation">
                                    <span className="c-operation">
                                        <i className="sprite-btn_add" />
                                        <ul className="c-operation-ul">
                                            <li onClick={this._ev_goto_s_invoicing}>查看进销对比</li>

                                        </ul>
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={()=>{
                                            this._hideChart.call(this,'chartMarketProfit') ;
                                        }}
                                    >
                                        <i className="sprite-btn_del_s" />
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={this._evClick_refresh_chartMarketProfit.bind(this)}
                                    >
                                        <i className="sprite-btn_refresh_s" />
                                    </span>
                                </span>
                            </div>
                            <div className="c-content">
                                <div className="c-count">
                                    <span className="c-count-choose">
                                        <RadioGroup onChange={this._ev_market_profit_changeRate.bind(this)} value={this.state.chartMarketProfit.checkboxValue}>
                                            <RadioButton value="2">月度</RadioButton>
                                            <RadioButton value="1">周度</RadioButton>
                                            <RadioButton value="0">日度</RadioButton>
                                        </RadioGroup>
                                    </span>
                                    <span className="c-count-daily">
                                        <span>今日销售毛利:</span>
                                        <span>￥{this.state.chartMarketProfit.todaySalesGrossProfit}</span>
                                    </span>
                                </div>
                                <div className="chart-market-profit e-chart">

                                    <ReactEcharts
                                        ref="chart-market-profit"
                                        option={this.state.chartMarketProfit.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '560px',height: '252px'}}
                                        onChartReady={this._readyCallback_market_profit.bind(this)}
                                    />

                                </div>
                            </div>
                        </div>

                        <div key="anime-5" className="chart-purchase-wrap e-chart-wrap" style={this._setChartVisiable.call(this,'chartPurchase')}>
                            <div className="c-title">
                                <span className="c-title-text">采购情况</span>
                                <span className="c-title-operation">
                                    <span className="c-operation">
                                        <i className="sprite-btn_add" />
                                        <ul className="c-operation-ul">
                                            <li onClick={this._ev_goto_purchaseOrder}>新增采购记录</li>
                                            <li onClick={this._ev_goto_baseSupplier}>新增供应商</li>
                                            <li onClick={this._ev_goto_baseProduct}>新增货品</li>
                                        </ul>
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={()=>{
                                            this._hideChart.call(this,'chartPurchase') ;
                                        }}
                                    >
                                        <i className="sprite-btn_del_s" />
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={this._evClick_refresh_chartPurchase.bind(this)}
                                    >
                                        <i className="sprite-btn_refresh_s" />
                                    </span>
                                    <Popconfirm
                                        className="antdcustomer-popconfirm-noicon"
                                        title={
                                            <span>
                                                年度预算
                                                <Input
                                                    placeholder=""
                                                    value={this.state.chartPurchase.yearPrev[0]}　
                                                    onChange={(event)=>{
                                                        var n = parseInt( event.target.value ) ;
                                                        if ( isNaN( n ) ){
                                                            n = 0 ;
                                                        }
                                                        this.setState({
                                                            chartPurchase : {
                                                                ...this.state.chartPurchase ,
                                                                yearPrev : [n] ,
                                                            }
                                                        }) ;
                                                    }}
                                                />
                                            </span>
                                        }
                                        onConfirm={()=>{
                                            var nTmp = parseInt( $.trim( this.state.chartPurchase.yearPrev[0] ) ) - 0 ;
                                            service.home.setPurchaseYearAmount({
                                                tenantId : window.globalStore.getState().userstore.user.tenantId ,
                                                tenantTargets : [ nTmp ] ,
                                            },(result)=>{
                                                if (result.mark=='000000000'){
                                                    this._evClick_refresh_chartPurchase() ;
                                                } else {
                                                    globalFunction.alert.warning( '设置采购预算失败' , '操作提示' ) ;
                                                }
                                            })

                                        }}
                                        onCancel={()=>{

                                        }}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <span
                                            className="c-operation"
                                            onClick={()=>{
                                                this.setState({
                                                    chartPurchase : {
                                                        ...this.state.chartPurchase ,
                                                        yearPrev : [ this.state.chartPurchase.yearPrevExist ] ,
                                                    }
                                                }) ;
                                            }}
                                        >
                                            <i className="sprite-btn_setting_s" />
                                        </span>
                                    </Popconfirm>
                                </span>
                            </div>
                            <div className="c-content">
                                <div className="c-count">
                                    <span className="center-span">
                                        <span>年度采购预算比:</span>
                                        <span>&nbsp;{this.state.chartPurchase.yearPrevPercent}&nbsp;&nbsp;</span>
                                    </span>
                                    <span className="center-span">
                                        <span>年度预算:</span>
                                        <span>&nbsp;￥&nbsp;{this.state.chartPurchase.yearPrevExist}&nbsp;&nbsp;</span>
                                    </span>
                                    <span className="center-span">
                                        <span>年度采购额:</span>
                                        <span>&nbsp;￥&nbsp;{this.state.chartPurchase.yearAllMount}</span>
                                    </span>
                                </div>
                                <div className="chart-purchase e-chart">
                                    <ReactEcharts
                                        ref="chart-purchase"
                                        option={this.state.chartPurchase.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '560px',height: '252px'}}
                                        onChartReady={this._readyCallback_purchase.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div key="anime-6" className="chart-customer-wrap e-chart-wrap" style={this._setChartVisiable.call(this,'chartCustomer')}>
                            <div className="c-title">
                                <span className="c-title-text">客户管理</span>
                                <span className="c-title-operation">
                                    <span className="c-operation">
                                        <i className="sprite-btn_add" />
                                        <ul className="c-operation-ul">
                                            <li onClick={this._ev_goto_baseCustomer}>新增客户</li>
                                        </ul>
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={()=>{
                                            this._hideChart.call(this,'chartCustomer') ;
                                        }}
                                    >
                                        <i className="sprite-btn_del_s" />
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={this._evClick_refresh_chartCustomer.bind(this)}
                                    >
                                        <i className="sprite-btn_refresh_s" />
                                    </span>
                                </span>
                            </div>
                            <div className="c-content">
                                <div className="c-count">
                                    <span className="center-span">
                                        <span>客户总数:</span>
                                        <span>{this.state.chartCustomer.customerCount}</span>
                                        <span className="text-right">本周新增用户:</span>
                                        <span>{this.state.chartCustomer.customerThisWeek}</span>
                                    </span>
                                </div>
                                <div className="chart-customer e-chart">
                                    <ReactEcharts
                                        className="chart-customer-left"
                                        ref="chart-customer1"
                                        option={this.state.chartCustomer.chartData1}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '280px',height: '252px'}}
                                        onChartReady={this._readyCallback_customer1.bind(this)}
                                    />
                                    <ReactEcharts
                                        className="chart-customer-right"
                                        ref="chart-customer2"
                                        option={this.state.chartCustomer.chartData2}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '280px',height: '252px'}}
                                        onChartReady={this._readyCallback_customer2.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div key="anime-7" className="chart-warn-wrap e-chart-wrap" style={this._setChartVisiable.call(this,'chartWarn')}>
                            <div className="c-title">
                                <span className="c-title-text">异常预警</span>
                                <span className="c-title-operation">
                                    <span className="c-operation">
                                        <i className="sprite-btn_add" />
                                        <ul className="c-operation-ul">
                                            <li onClick={this._ev_goto_accountUser}>去催收</li>
                                        </ul>
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={()=>{
                                            this._hideChart.call(this,'chartWarn') ;
                                        }}
                                    >
                                        <i className="sprite-btn_del_s" />
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={this._evClick_refresh_chartWarn.bind(this)}
                                    >
                                        <i className="sprite-btn_refresh_s" />
                                    </span>
                                </span>
                            </div>
                            
                            <div className="c-content">
                                <div className="c-count">
                                    <span className="center-span">
                                        <span>本周逾期应收总金额:</span>
                                        <span>￥{this.state.chartWarn.charts_warn_soWeekOverRecAmount}元</span>
                                    </span>
                                </div>
                                <div className="chart-warn e-chart">
                                    <ReactEcharts
                                        ref="chart-warn"
                                        option={this.state.chartWarn.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '560px',height: '252px'}}
                                        onChartReady={this._readyCallback_warn.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div key="anime-8" className="chart-record-wrap e-chart-wrap" style={this._setChartVisiable.call(this,'chartRecord')}>
                            <div className="c-title">
                                <span className="c-title-text">龙虎榜</span>
                                <span className="c-title-operation">
                                    <span className="c-operation">
                                        <i className="sprite-btn_add" />
                                        <ul className="c-operation-ul">
                                            <li onClick={this._ev_goto_marketList}>新增销售单</li>
                                        </ul>
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={()=>{
                                            this._hideChart.call(this,'chartRecord') ;
                                        }}
                                    >
                                        <i className="sprite-btn_del_s" />
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={this._evClick_refresh_chartRecord.bind(this)}
                                    >
                                        <i className="sprite-btn_refresh_s" />
                                    </span>
                                </span>
                            </div>
                            <div className="c-content">
                                <div className="c-count">
                                    <span className="left-span">
                                        <span>日期&nbsp;</span>
                                        <span>
                                            <DatePicker
                                                key="for"
                                                style={{width:120}}
                                                value={this.state.chartRecord.startTime}
                                                format="yyyy-MM-dd"
                                                onChange={(v,dataString)=>{
                                                    this.setState({
                                                        chartRecord : {
                                                            ...this.state.chartRecord ,
                                                            startTime : dataString
                                                        }
                                                    }) ;
                                                    setTimeout(()=>{
                                                        this._evClick_refresh_chartRecord() ;
                                                    },100) ;
                                                }}
                                            ></DatePicker>
                                        </span>
                                        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                                        <span>
                                             <DatePicker
                                                 key="for"
                                                 style={{width:120}}
                                                 value={this.state.chartRecord.endTime}
                                                 format="yyyy-MM-dd"
                                                 onChange={(v,dataString)=>{
                                                    this.setState({
                                                        chartRecord : {
                                                            ...this.state.chartRecord ,
                                                            endTime : dataString
                                                        }
                                                    }) ;
                                                    setTimeout(()=>{
                                                        this._evClick_refresh_chartRecord() ;
                                                    },100) ;
                                                }}
                                             ></DatePicker>
                                        </span>
                                    </span>
                                    <span className="right-span">
                                        <Select
                                            style={{width : 150}}
                                            value={this.state.chartRecord.type}
                                            onChange={this._ev_record_changeType.bind(this)}
                                        >
                                            <Option value="0" title="销售额">销售额</Option>
                                            <Option value="1" title="销售金额占比">销售金额占比</Option>
                                            <Option value="2" title="销售单数">销售单数</Option>
                                            <Option value="3" title="新建客户数">新建客户数</Option>
                                            <Option value="4" title="销售回款">销售回款</Option>
                                            <Option value="5" title="销售回款率">销售回款率</Option>
                                        </Select>
                                    </span>
                                </div>
                                <div className="chart-record e-chart">
                                    <ReactEcharts
                                        ref="chart-record"
                                        option={this.state.chartRecord.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '560px',height: '252px'}}
                                        onChartReady={this._readyCallback_record.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div key="anime-9" className="chart-product-wrap e-chart-wrap" style={this._setChartVisiable.call(this,'chartProduct')}>
                            <div className="c-title">
                                <span className="c-title-text">热销商品</span>
                                <span className="c-title-operation">
                                    <span className="c-operation">
                                        <i className="sprite-btn_add" />
                                        <ul className="c-operation-ul">
                                            <li onClick={this._ev_goto_baseProduct}>新增货品</li>
                                        </ul>
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={()=>{
                                            this._hideChart.call(this,'chartProduct') ;
                                        }}
                                    >
                                        <i className="sprite-btn_del_s" />
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={this._evClick_refresh_chartProduct.bind(this)}
                                    >
                                        <i className="sprite-btn_refresh_s" />
                                    </span>
                                </span>
                            </div>
                            <div className="c-content">
                                <div className="c-count">
                                    <span className="left-span">
                                        <span>日期&nbsp;</span>
                                        <span>
                                            <DatePicker
                                                key="for"
                                                style={{width:120}}
                                                value={this.state.chartProduct.startTime}
                                                format="yyyy-MM-dd"
                                                onChange={(v,dataString)=>{
                                                    this.setState({
                                                        chartProduct : {
                                                            ...this.state.chartProduct ,
                                                            startTime : dataString
                                                        }
                                                    }) ;
                                                    setTimeout(()=>{
                                                        this._evClick_refresh_chartProduct() ;
                                                    },100) ;
                                                }}
                                            ></DatePicker>
                                        </span>
                                        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                                        <span>
                                            <DatePicker
                                                key="for"
                                                style={{width:120}}
                                                value={this.state.chartProduct.endTime}
                                                format="yyyy-MM-dd"
                                                onChange={(v,dataString)=>{
                                                    this.setState({
                                                        chartProduct : {
                                                            ...this.state.chartProduct ,
                                                            endTime : dataString
                                                        }
                                                    }) ;
                                                    setTimeout(()=>{
                                                        this._evClick_refresh_chartProduct() ;
                                                    },100) ;
                                                }}
                                            ></DatePicker>
                                        </span>
                                    </span>
                                    <span className="right-span">
                                        <RadioGroup
                                            onChange={this._ev_product_changeFilter.bind(this)}
                                            value={this.state.chartProduct.filter}
                                        >
                                            <RadioButton value="price">销售额</RadioButton>
                                            <RadioButton value="count">销售单数</RadioButton>
                                        </RadioGroup>
                                    </span>
                                </div>
                                <div className="chart-product e-chart">

                                    <ReactEcharts
                                        ref="chart-product"
                                        option={this.state.chartProduct.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '560px',height: '252px'}}
                                        onChartReady={this._readyCallback_product.bind(this)}
                                    />

                                </div>
                            </div>
                        </div>

                        <div key="anime-10" className="chart-user-wrap e-chart-wrap" style={this._setChartVisiable.call(this,'chartUser')}>
                            <div className="c-title">
                                <span className="c-title-text">客户前十</span>
                                <span className="c-title-operation">
                                    <span className="c-operation">
                                        <i className="sprite-btn_add" />
                                        <ul className="c-operation-ul">
                                            <li onClick={this._ev_goto_baseCustomer}>新增客户</li>
                                        </ul>
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={()=>{
                                            this._hideChart.call(this,'chartUser') ;
                                        }}
                                    >
                                        <i className="sprite-btn_del_s" />
                                    </span>
                                    <span
                                        className="c-operation"
                                        onClick={this._evClick_refresh_chartUser.bind(this)}
                                    >
                                        <i className="sprite-btn_refresh_s" />
                                    </span>
                                </span>
                            </div>
                            <div className="c-content">
                                <div className="c-count">
                                   <span className="left-span">
                                        <span>日期&nbsp;</span>
                                        <span>
                                            <DatePicker
                                                key="for"
                                                style={{width:120}}
                                                value={this.state.chartUser.startTime}
                                                format="yyyy-MM-dd"
                                                onChange={(v,dataString)=>{
                                                    this.setState({
                                                        chartUser : {
                                                            ...this.state.chartUser ,
                                                            startTime : dataString
                                                        }
                                                    }) ;
                                                    setTimeout(()=>{
                                                        this._evClick_refresh_chartUser() ;
                                                    },100) ;
                                                }}
                                            ></DatePicker>
                                        </span>
                                        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                                        <span>
                                             <DatePicker
                                                 key="for"
                                                 style={{width:120}}
                                                 value={this.state.chartUser.endTime}
                                                 format="yyyy-MM-dd"
                                                 onChange={(v,dataString)=>{
                                                    this.setState({
                                                        chartUser : {
                                                            ...this.state.chartUser ,
                                                            endTime : dataString
                                                        }
                                                    }) ;
                                                    setTimeout(()=>{
                                                        this._evClick_refresh_chartUser() ;
                                                    },100) ;
                                                }}
                                             ></DatePicker>
                                        </span>
                                    </span>
                                    <span className="right-span">
                                        <RadioGroup
                                            onChange={this._ev_user_changeFilter.bind(this)}
                                            value={this.state.chartUser.filter}
                                        >
                                            <RadioButton value="price">销售额</RadioButton>
                                            <RadioButton value="count">销售单数</RadioButton>
                                        </RadioGroup>
                                    </span>
                                </div>
                                <div className="chart-user e-chart">

                                    <ReactEcharts
                                        ref="chart-user"
                                        option={this.state.chartUser.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '560px',height: '252px'}}
                                        onChartReady={this._readyCallback_user.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div key="anime-11" className="chart-config-wrap e-chart-wrap" style={this._setConfigVisiable.call(this)}>
                            <div className="checkbox-chart-config">
                                <CheckboxGroup
                                    options={CHARTS_COLLECTION_BOSS}
                                    value={this.state.statisticsBoss.chartShowArray}
                                    onChange={(checkedValues)=>{
                                        this.setState({
                                            statisticsBoss : {
                                                ...this.state.statisticsBoss ,
                                                chartShowArray : checkedValues ,
                                            }
                                        }) ;
                                        localStorage && localStorage.setItem( 'chart-show-array' , JSON.stringify(checkedValues) ) ;
                                    }}
                                />
                            </div>
                            <span className="ant-customer-icon-large">
                                <Icon type="plus-circle-o" />
                            </span>
                        </div>

                        </QueueAnim>
                    </div>

                </div>
            </div>
        )
    }
    _renderMarket(){
        if ( !this.state.statisticsMarket.isReady ){
            return <span></span> ;
        }
        var classes = cx({
            'home-modal-market' : true ,
            'content-show' : ( this.props.home.market_modal_show )
        }) ;
        var staticHideClass = cx({
            'each-statistics' : true ,
            'hide' : !this.state.statisticsMarket.targetShow ,
        }) ;
        var staticClass = cx({
            'each-statistics' : true ,
            'hide' : !!this.state.statisticsMarket.targetShow ,
        }) ;
        return (
            <div className="body-content">

                <Crumbs></Crumbs>

                <div className="all-statistics-wrap role-market">

                    <div className="all-statistics">
                        <div className="comp-statistics">
                            <Link to="/market/list?state=new">
                                <span className="each-statistics">
                                    <div className="ant-customer-icon-large">

                                        <Icon type="plus-circle-o" />
                                    </div>
                                    <div>新增销售记录</div>
                                </span>
                            </Link>
                            <Link to="/base/b_customer?state=new">
                                <span className="each-statistics">
                                    <div className="ant-customer-icon-large">

                                        <Icon type="plus-circle-o" />
                                    </div>
                                    <div>新增客户</div>
                                </span>
                            </Link>
                            <span
                                className={staticClass}
                                onClick={()=>{
                                    service.home.fetchMarketOneTarget({
                                        userId : window.globalStore.getState().userstore.user.id ,
                                    },(result)=>{
                                        if ( result.mark === '000000000' ){
                                            this.setState({
                                                statisticsMarket : {
                                                    ...this.state.statisticsMarket ,
                                                    targetShow : true ,
                                                    yearTarget : result.data.dashBoardDto.userTargets[0] ,
                                                    monthTarget : result.data.dashBoardDto.userTargets[1] ,
                                                }
                                            }) ;
                                        } else {
                                            globalFunction.alert.warning( result.message , '操作提示' ) ;
                                        }
                                    }) ;
                                }}
                            >
                                <div className="ant-customer-icon-large">

                                    <Icon type="setting" />
                                </div>
                                <div>
                                    设置任务
                                </div>
                            </span>
                            <span
                                className={staticHideClass + ' targetSet'}
                            >
                                <div>
                                    <div className="tar-form">
                                        <span className="tar-lable">年度目标</span>
                                        <span className="tar-input" >
                                            <Input
                                                placeholder="元"
                                                value={this.state.statisticsMarket.yearTarget}
                                                onChange={(event)=>{
                                                    console.log(this) ;
                                                    console.log(event) ;
                                                    this.setState({
                                                        statisticsMarket : {
                                                            ...this.state.statisticsMarket ,
                                                            yearTarget : event.target.value
                                                        }
                                                    })
                                                }}
                                            />
                                        </span>
                                    </div>
                                    <div className="tar-form">
                                        <span className="tar-lable">本月目标</span>
                                        <span className="tar-input">
                                            <Input
                                                placeholder="元"
                                                value={this.state.statisticsMarket.monthTarget}
                                                onChange={(event)=>{
                                                    this.setState({
                                                        statisticsMarket : {
                                                            ...this.state.statisticsMarket ,
                                                            monthTarget : event.target.value
                                                        }
                                                    })
                                                }}
                                            />
                                        </span>
                                    </div>
                                    <div style={{marginTop:'5px'}}>
                                        <span className="tar-ope">
                                            <Button
                                                type="primary"
                                                className="tar-cancel"
                                                onClick={()=>{
                                                    this.setState({
                                                        statisticsMarket : {
                                                            ...this.state.statisticsMarket ,
                                                            targetShow : false ,
                                                        }
                                                    })
                                                }}
                                            >
                                                取消
                                            </Button>
                                            <Button
                                                className="tar-confirm"
                                                type="primary"
                                                onClick={()=>{
                                                    service.home.editMarketOneTarget({
                                                        userId : window.globalStore.getState().userstore.user.id ,
                                                        userTargets : [ this.state.statisticsMarket.yearTarget - 0 , this.state.statisticsMarket.monthTarget - 0 ]
                                                    },(result)=>{
                                                        if (result.mark == '000000000'){
                                                            globalFunction.alert.info( '修改销售目标成功' , '操作提示' ) ;
                                                            this._dataInit_market() ;
                                                        } else {
                                                            globalFunction.alert.warning( result.message , '操作提示' ) ;
                                                        }
                                                    })
                                                }}
                                            >确定</Button>
                                        </span>
                                    </div>
                                </div>
                            </span>
                        </div>

                    </div>

                    <div className="chart-outer-title">销售情况</div>

                    <div className="chart-area">

                        <QueueAnim className="chart-area-sortable"
                            type="bottom"
                            duration={800}
                            interval={250}
                        >

                        <div className="chart-market-wrap e-chart-wrap" key="anime-1">
                            <div className="c-content-left">
                                <div className="c-count">
                                    <span className="c-count-choose">
                                        <RadioGroup
                                            onChange={this._ev_market_changeRate.bind(this)}
                                            value={this.state.chartMarket.rate}
                                        >
                                            <RadioButton value="2">月度</RadioButton>
                                            <RadioButton value="1">周度</RadioButton>
                                            <RadioButton value="0">日度</RadioButton>
                                        </RadioGroup>
                                    </span>
                                    <span className="c-count-span">
                                        本月完成进度&nbsp;<span>{this.state.chartMarket.charts_market_monthComplete}</span>&nbsp;, 本年完成进度&nbsp;<span>{this.state.chartMarket.charts_market_yearComplete}</span>
                                    </span>
                                </div>
                                <div className="chart-market e-chart">

                                    <ReactEcharts
                                        ref="chart-market"
                                        option={this.state.chartMarket.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '900px',height: '350px'}}
                                        /* theme={"my_theme"} */
                                        onChartReady={this._readyCallback_market.bind(this)}
                                    />

                                </div>
                            </div>
                            <div className="c-content-right">
                                <div className="blo1 blo">
                                    <span className="blo-line">
                                        <div className="blo-block-top">{this.state.chartMarket.timeMark.mouth}</div>
                                        <div className="blo-block">{this.state.chartMarket.timeMark.day}</div>
                                    </span>
                                    <span className="blo-span">
                                        <div className="blo-title">总销售金额目标</div>
                                        <div className="blo-value" style={{color:'red'}}>￥{this.state.statisticsMarket.all_yearTaget}</div>
                                    </span>
                                </div>
                                <div className="blo2 blo">
                                    <span className="blo-line">
                                        <div className="blo-block-top">{this.state.chartMarket.timeMark.week}</div>
                                        <div className="blo-block">周</div>
                                    </span>
                                    <span className="blo-span"> 
                                        <div className="blo-title" style={{color:'#ccc'}}>本周销售毛利</div>
                                        <div className="blo-value">￥{this.state.statisticsMarket.all_week}</div>
                                    </span>
                                </div>
                                <div className="blo3 blo">
                                    <span className="blo-line">
                                        <div className="blo-block-all">{this.state.chartMarket.timeMark.mouth}</div>
                                    </span>
                                    <span className="blo-span">
                                        <div className="blo-title" style={{color:'#ccc'}}>本月累计销售毛利</div>
                                        <div className="blo-value">￥{this.state.statisticsMarket.all_month}</div>
                                    </span>
                                </div>
                                <div className="blo4 blo">
                                    <span className="blo-line">
                                        <div className="blo-block-top">{this.state.chartMarket.timeMark.year}</div>
                                        <div className="blo-block">年</div>
                                    </span>
                                    <span className="blo-span">
                                        <div className="blo-title" style={{color:'#ccc'}}>本年累计销售毛利</div>
                                        <div className="blo-value">￥{this.state.statisticsMarket.all_year}</div>
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div className="chart-warn-wrap e-chart-wrap" key="anime-2">
                            <div className="c-title">
                                <span className="c-title-text">异常预警</span>
                                <span className="c-title-operation">
                                    <span className="c-operation">
                                        <i className="sprite-btn_add" />
                                        <ul className="c-operation-ul">
                                            <li onClick={this._ev_goto_accountUser}>去催收</li>
                                        </ul>
                                    </span>
                                    {/*<span className="c-operation">
                                        <i className="sprite-btn_del_s" />
                                    </span>*/}
                                    <span
                                        className="c-operation"
                                        onClick={this._evClick_refresh_chartWarn.bind(this)}
                                    >
                                        <i className="sprite-btn_refresh_s" />
                                    </span>
                                </span>
                            </div>
                            <div className="c-content">
                                <div className="c-count">
                                    <span className="center-span">
                                        <span>本周逾期应收总金额:</span>
                                        <span>&nbsp;${this.state.chartWarn.charts_warn_soWeekOverRecAmount}元</span>
                                    </span>
                                </div>
                                <div className="chart-warn e-chart">
                                    <ReactEcharts
                                        ref="chart-warn"
                                        option={this.state.chartWarn.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '560px',height: '252px'}}
                                        onChartReady={this._readyCallback_warn.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="chart-user-wrap e-chart-wrap" key="anime-3">
                            <div className="c-title">
                                <span className="c-title-text">客户前十</span>
                                <span className="c-title-operation">
                                    <span className="c-operation">
                                        <i className="sprite-btn_add" />
                                        <ul className="c-operation-ul">
                                            <li
                                                onClick={this._ev_goto_baseCustomer}
                                            >新增客户</li>
                                        </ul>
                                    </span>
                                    {/*<span className="c-operation">
                                        <i className="sprite-btn_del_s" />
                                    </span>*/}
                                    <span
                                        className="c-operation"
                                        onClick={this._evClick_refresh_chartUser.bind(this)}
                                    >
                                        <i className="sprite-btn_refresh_s" />
                                    </span>
                                </span>
                            </div>
                            <div className="c-content">
                                <div className="c-count">
                                   <span className="left-span">
                                        <span>日期&nbsp;</span>
                                        <span>
                                            <DatePicker
                                                key="for"
                                                style={{width:120}}
                                                value={this.state.chartUser.startTime}
                                                format="yyyy-MM-dd"
                                                onChange={(v,dataString)=>{
                                                    this.setState({
                                                        chartUser : {
                                                            ...this.state.chartUser ,
                                                            startTime : dataString
                                                        }
                                                    }) ;
                                                    setTimeout(()=>{
                                                        this._evClick_refresh_chartUser() ;
                                                    },100) ;
                                                }}
                                            ></DatePicker>
                                        </span>
                                        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                                        <span>
                                             <DatePicker
                                                 key="for"
                                                 style={{width:120}}
                                                 value={this.state.chartUser.endTime}
                                                 format="yyyy-MM-dd"
                                                 onChange={(v,dataString)=>{
                                                    this.setState({
                                                        chartUser : {
                                                            ...this.state.chartUser ,
                                                            endTime : dataString
                                                        }
                                                    }) ;
                                                    setTimeout(()=>{
                                                        this._evClick_refresh_chartUser() ;
                                                    },100) ;
                                                }}
                                             ></DatePicker>
                                        </span>
                                    </span>
                                    <span className="right-span">
                                        <RadioGroup
                                            onChange={this._ev_user_changeFilter.bind(this)}
                                            value={this.state.chartUser.filter}
                                        >
                                            <RadioButton value="price">销售额</RadioButton>
                                            <RadioButton value="count">销售单数</RadioButton>
                                        </RadioGroup>
                                    </span>
                                </div>
                                <div className="chart-user e-chart">

                                    <ReactEcharts
                                        ref="chart-user"
                                        option={this.state.chartUser.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '560px',height: '252px'}}
                                        /* theme={"my_theme"} */
                                        onChartReady={this._readyCallback_user.bind(this)}
                                    />

                                </div>
                            </div>
                        </div>

                        </QueueAnim>

                    </div>

                </div>
            </div>
        )
    }
    _renderPurchase(){
        if ( !this.state.statisticsPurchase.isReady ){
            return <span></span> ;
        }

        var classes = cx({
            'home-modal-market' : true ,
            'content-show' : ( this.props.home.market_modal_show )
        }) ;
        return (
            <div className="body-content">

                <Crumbs></Crumbs>

                <div className="all-statistics-wrap role-purchase">

                    <div className="all-statistics">
                        <div className="comp-statistics">
                            <Link to="/purchase/order?state=new">
                            <span className="each-statistics">
                                <div className="ant-customer-icon-large">
                                    {/*<i></i>*/}
                                    <Icon type="plus-circle-o" />
                                </div>
                                <div>新增采购记录</div>
                            </span>
                            </Link>
                            <Link to="/base/b_product?state=new">
                            <span className="each-statistics">
                                <div className="ant-customer-icon-large">
                                    {/*<i></i>*/}
                                    <Icon type="plus-circle-o" />
                                </div>
                                <div>新增货品</div>
                            </span>
                            </Link>
                            <Link to="/base/b_supplier?state=new">
                            <span className="each-statistics">
                                <div className="ant-customer-icon-large">
                                    {/*<i></i>*/}
                                    <Icon type="plus-circle-o" />
                                </div>
                                <div>新增供应商</div>
                            </span>
                            </Link>
                        </div>
                    </div>

                    <div className="chart-outer-title">库存情况</div>

                    <div className="chart-area">

                        <QueueAnim className="chart-area-sortable"
                            type="bottom"
                            duration={800}
                            interval={250}
                        >

                        <div className="chart-purchase-store-wrap e-chart-wrap" key="anime-1">
                            <div className="c-content-left">
                                <div className="c-count">
                                    <span className="left-span">
                                        <span>当前库存:</span>
                                        <span>&nbsp;￥&nbsp;{this.state.chartPurchaseStore.currentMonthAllCount}</span>
                                    </span>
                                </div>
                                <div className="chart-purchase-store e-chart">
                                    <ReactEcharts
                                        ref="chart-purchase-store"
                                        option={this.state.chartPurchaseStore.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '900px',height: '350px'}}
                                        onChartReady={this._readyCallback_purchase_store.bind(this)}
                                    />
                                </div>
                                <div className="month-select">
                                    <RadioGroup
                                        value={this.state.chartPurchaseStore.month+''}
                                        size="large"
                                        onChange={(event)=>{
                                            var self = this ;
                                            var currentMonth = event.target.value - 0 ;
                                            var storeChartData = this.state.chartPurchaseStore.storeChartData[ currentMonth-1 ] ;
                                            var currentTypeTableData = this.state.chartPurchaseStore.typeTableData[ currentMonth-1 ] ;
                                            var currentMonthAllCount = this.state.chartPurchaseStore.monthAllCount[ currentMonth-1 ] ;
                                            this.setState({
                                                chartPurchaseStore : {
                                                    ...this.state.chartPurchaseStore ,
                                                    month : event.target.value - 0 ,
                                                    currentTypeTableData : currentTypeTableData ,
                                                    currentMonthAllCount : currentMonthAllCount ,
                                                    chartData : {
                                                        ...this.state.chartPurchaseStore.chartData ,
                                                        series : [
                                                            {
                                                                type: 'pie',
                                                                radius : '70%',
                                                                center: ['50%', '55%'],
                                                                data: storeChartData,
                                                                itemStyle: {
                                                                    emphasis: {
                                                                        shadowBlur: 10,
                                                                        shadowOffsetX: 0,
                                                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            }) ;
                                            // setTimeout(()=>{
                                            //     self._dataInit_purchase() ;
                                            // },0) ;
                                        }}
                                    >
                                        <RadioButton value="1">1月</RadioButton>
                                        <RadioButton value="2">2月</RadioButton>
                                        <RadioButton value="3">3月</RadioButton>
                                        <RadioButton value="4">4月</RadioButton>
                                        <RadioButton value="5">5月</RadioButton>
                                        <RadioButton value="6">6月</RadioButton>
                                        <RadioButton value="7">7月</RadioButton>
                                        <RadioButton value="8">8月</RadioButton>
                                        <RadioButton value="9">9月</RadioButton>
                                        <RadioButton value="10">10月</RadioButton>
                                        <RadioButton value="11">11月</RadioButton>
                                        <RadioButton value="12">12月</RadioButton>
                                    </RadioGroup>
                                </div>
                            </div>
                            <div className="c-content-right">
                                <Table
                                    pagination={false}
                                    columns={
                                        [{
                                            title : '货品类别' ,
                                            dataIndex : 'categoryName' ,
                                            key : 'categoryName'
                                        },{
                                            title : '库存成本' ,
                                            dataIndex : 'stockCost' ,
                                            key : 'stockCost' ,
                                        },{
                                            title : '库存占比' ,
                                            dataIndex : 'stockCostPCT' ,
                                            key : 'stockCostPCT' ,
                                        }]
                                    }
                                    dataSource={
                                        this.state.chartPurchaseStore.currentTypeTableData
                                    }
                                ></Table>
                            </div>
                        </div>

                        </QueueAnim>

                    </div>

                </div>
            </div>
        )
    }
    _renderFinance(){
        var class1 = cx({
            'chart-warn' : true ,
            'e-chart' : true ,
            'content-hide' : ( this.state.chartWarn.tabShow　===　1? false : true )
        }) ;
        var class2 = cx({
            'chart-warn' : true ,
            'e-chart' : true ,
            'content-hide' : ( this.state.chartWarn.tabShow　===　1? true : false )
        }) ;
        var class3 = cx({
            'content-hide' : ( this.state.chartCapital.tabShow　===　1? false : true )
        }) ;
        var class4 = cx({
            'content-hide' : ( this.state.chartCapital.tabShow　===　1? true : false )
        }) ;
        var href_shouldPay = cx({
            'c-title-text' : true ,
            'active' : ( this.state.chartWarn.tabShow === 1? true : false)
        });
        var href_nextPay = cx({
            'c-title-text' : true ,
            'active' : ( this.state.chartWarn.tabShow === 1? false : true)
        });
        var href_cash_capital = cx({
            'c-title-text' : true ,
            'active' : ( this.state.chartCapital.tabShow === 1? true : false)
        });
        var href_cash_flow = cx({
            'c-title-text' : true ,
            'active' : ( this.state.chartCapital.tabShow === 1? false : true)
        });
        if ( !this.state.statisticsFinance.isReady ){
            return <span></span> ;
        }

        return (
            <div className="body-content">

                <Crumbs></Crumbs>

                <div className="all-statistics-wrap role-finance">

                    <div className="chart-area">

                        <QueueAnim className="chart-area-sortable"
                            type="bottom"
                            duration={800}
                            interval={250}
                        >
                        <div className="chart-outer-title">预警管理</div>

                        <div className="chart-warn-wrap e-chart-wrap" key="anime-1">
                            <div className="c-title">
                                <a className={href_shouldPay}
                                      onClick={()=>this.setState({
                                        chartWarn :{
                                            ...this.state.chartWarn ,
                                            tabShow : 1
                                        }
                                      })}
                                >
                                    应收预警
                                </a>
                                <a className={href_nextPay}
                                      onClick={ ()=>this.setState({
                                        chartWarn :{
                                            ...this.state.chartWarn ,
                                            tabShow : 2
                                        }
                                      })}
                                >
                                    下周应付提醒
                                </a>
                            </div>
                            <div className="c-content-left">
                                <div className={class1}>
                                    <ReactEcharts
                                        ref="chart-warn"
                                        option={this.state.chartWarn.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '870px',height: '450px'}}
                                        onChartReady={this._readyCallback_warn.bind(this)}
                                    />
                                </div>
                                <div className={class2}>
                                    <ReactEcharts
                                        ref="chart-warn"
                                        option={this.state.chartWarn.chartDataPayNext}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '870px',height: '450px'}}
                                        onChartReady={this._readyCallback_warn.bind(this)}
                                    />
                                </div>
                            </div>
                            <div className="c-content-right">
                                <div className={class1}>
                                    <div className="c-count">
                                        <span className="center-span-title">应收总金额</span>
                                        <span className="center-span-money font-red">￥{this.state.chartWarn.charts_warn_salesReceivableAmount}</span>
                                    </div>
                                    <div className="c-count">
                                        <span className="center-span-title">逾期总金额</span>
                                        <span className="center-span-money">￥{this.state.chartWarn.charts_warn_soOverRecAmount}</span>
                                    </div>
                                    <div className="c-count">
                                        <span className="center-span-title">本周逾期应收总金额</span>
                                        <span className="center-span-money">￥{this.state.chartWarn.charts_warn_soWeekOverRecAmount}</span>
                                    </div>
                                    <Button type="primary" className="press-gathering" onClick={(ev)=>{
                                        globalStore.dispatch(push('/account/checkAccount/user')) ; //route change
                                    }}
                                    >
                                        去催收
                                    </Button>
                                </div>
                                <div className={class2}>
                                    <Table
                                        dataSource={this.state.chartWarn.charts_warn_right_table}

                                        columns={this.props.COLUMNS } pagination={false}>
                                    </Table>
                                    <Button type="primary" className="press-gathering" onClick={(ev)=>{
                                        globalStore.dispatch(push('account/checkAccount/supplier')) ; //route change
                                    }}
                                    >
                                        去付款
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="chart-outer-title">资金流动</div>

                        <div className="chart-capital-wrap e-chart-wrap" key="anime-2">
                            <div className="c-title">
                                <a className={href_cash_capital}
                                      onClick={()=> this.setState({
                                        chartCapital :{
                                            ...this.state.chartCapital ,
                                            tabShow : 1
                                        }
                                      })}
                                >
                                    资金流动情况
                                </a>
                                <a className={href_cash_flow}
                                      onClick={()=> this.setState({
                                        chartCapital :{
                                            ...this.state.chartCapital ,
                                            tabShow : 2
                                        }
                                      })}
                                >
                                    现金走势流
                                </a>
                            </div>
                            <div className={class3}>
                                <div className="chart-capital e-chart">
                                    {/*<div className="c-count">
                                        <span className="c-count-choose">
                                            <RadioGroup onChange={this._ev_capital_changeRate.bind(this)} defaultValue="2">
                                                <RadioButton value="2">本周</RadioButton>
                                                <RadioButton value="1">本月</RadioButton>
                                                <RadioButton value="0">本年</RadioButton>
                                            </RadioGroup>
                                        </span>
                                    </div>*/}
                                    <ReactEcharts
                                        ref="chart-capital"
                                        option={this.state.chartCapital.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '870px',height: '450px',margin: '0 auto'}}
                                        onChartReady={this._readyCallback_capital.bind(this)}
                                    />
                                </div>
                            </div>
                            <div className={class4}>
                                <div className="chart-capital e-chart">
                                    {/*<div className="c-count">
                                     <span className="c-count-choose">
                                     <RadioGroup onChange={this._ev_cashFlow_changeRate.bind(this)} defaultValue="2">
                                     <RadioButton value="2">本周</RadioButton>
                                     <RadioButton value="1">本月</RadioButton>
                                     <RadioButton value="0">本年</RadioButton>
                                     </RadioGroup>
                                     </span>
                                     </div>*/}
                                    <ReactEcharts
                                        ref="chart-capital"
                                        option={this.state.chartCapital.chartDataFlow}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '870px',height: '450px',margin: '0 auto'}}
                                        onChartReady={this._readyCallback_capital.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="chart-outer-title" key="anime-3">销售毛利</div>

                        <div className="chart-market-wrap e-chart-wrap">
                            <div className="c-content-left">
                                <div className="c-count">
                                    <span className="c-count-choose">
                                        <RadioGroup onChange={this._ev_market_profit_changeRate.bind(this)} defaultValue="2">
                                            <RadioButton value="2">月度</RadioButton>
                                            <RadioButton value="1">周度</RadioButton>
                                            <RadioButton value="0">日度</RadioButton>
                                        </RadioGroup>
                                    </span>
                                </div>
                                <div className="chart-market e-chart">

                                    <ReactEcharts
                                        ref="chart-market"
                                        option={this.state.chartMarketProfit.chartData}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        style={{width: '900px',height: '350px'}}
                                        /* theme={"my_theme"} */
                                        onChartReady={this._readyCallback_market.bind(this)}
                                    />

                                </div>
                            </div>
                            <div className="c-content-right">
                                <div className="blo1 blo">
                                    {/*<span className="blo-line">
                                        <div className="blo-block-top">九月</div>
                                        <div className="blo-block">13</div>
                                    </span>*/}
                                    <span className="blo-span">
                                        <div className="blo-value font-red">￥{this.state.chartMarketProfit.todaySalesGrossProfit}</div>
                                        <div className="blo-title">今日销售毛利</div>
                                    </span>
                                </div>
                                <div className="blo2 blo">
                                    {/*<span className="blo-line">
                                        <div className="blo-block-top">38</div>
                                        <div className="blo-block">周</div>
                                    </span>*/}
                                    <span className="blo-span">
                                        <div className="blo-title">本周销售毛利</div>
                                        <div className="blo-value">￥{this.state.chartMarketProfit.salesGrossProfitWeek}</div>
                                    </span>
                                </div>
                                <div className="blo3 blo">
                                    {/*<span className="blo-line">
                                        <div className="blo-block-all">九月</div>
                                    </span>*/}
                                    <span className="blo-span">
                                        <div className="blo-title">本月累计销售毛利</div>
                                        <div className="blo-value">￥{this.state.chartMarketProfit.salesGrossProfitMonth}</div>
                                    </span>
                                </div>
                                <div className="blo4 blo">
                                    {/*<span className="blo-line">
                                        <div className="blo-block-top">2016</div>
                                        <div className="blo-block">年</div>
                                    </span>*/}
                                    <span className="blo-span">
                                        <div className="blo-title">本年累计销售毛利</div>
                                        <div className="blo-value">￥{this.state.chartMarketProfit.salesGrossProfitYear}</div>
                                    </span>
                                </div>
                            </div>

                        </div>

                        </QueueAnim>

                    </div>

                </div>
            </div>
        )
    }
    __plusAll(arr,defaultValue){
        var ret = null ;
        try {
            var _ret = 0 ;
            arr.forEach((v,i)=>{
                var _v = new BigNumber( v ) ;
                var _r = new BigNumber( _ret ) ;
                _ret = _r.plus( _v ) ;
            }) ;
            ret = _ret - 0 ;
        } catch (e){
            console.warn( '年度销售数值计算错误' ) ;
        }
        if ( ret === null ){
            return defaultValue ;
        } else {
            return ret ;
        }
    }
    _setChartVisiable(chartName){
        if ( this.state.statisticsBoss.chartShowArray.indexOf( chartName ) === -1 ){
            return {
                display : 'none' ,
            }
        } else {
            return {} ;
        }
    }
    _setConfigVisiable(){
        if ( this.state.statisticsBoss.chartShowArray.length === 10 ){
            return {
                display : 'none' ,
            }
        } else {
            return {} ;
        }
    }
    _hideChart(chartName){
        var arr = this.state.statisticsBoss.chartShowArray.concat() ;
        var index = arr.indexOf( chartName ) ;
        if ( index > -1 ){
            arr.splice( index , 1 ) ;
            this.setState({
                statisticsBoss : {
                    ...this.state.statisticsBoss ,
                    chartShowArray : arr ,
                }
            }) ;
            localStorage && localStorage.setItem( 'chart-show-array' , JSON.stringify(arr) ) ;
        }
    }
}

Home.defaultProps = {

    COLUMNS : COLUMNS ,

} ;

export default connect(
    state => {
        var home = state.home ;
        var userstore = state.userstore ;
        return {
            home ,
            userstore ,
        }
    },
    {
        home_init_alert ,
        home_market_showModal ,
    }
)(Home)


