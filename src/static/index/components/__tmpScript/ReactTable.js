import React from 'react'
import {Table, Column, Cell} from 'fixed-data-table';

import 'fixed-data-table/dist/fixed-data-table-base.css'
// import 'fixed-data-table/dist/fixed-data-table-style.css'
// import 'fixed-data-table/dist/fixed-data-table.css'

// Table data as a list of array.
const rows = [
    ['2016-08-03 09:53:20', '上海西域机电系统有限公司', '   XSD2016082015141', '146', '18758.00', '现金', '10000.00', '8758.00', '已全部发货', '销售员', '查看 撤销 结款'],
    ['2016-08-03 09:53:20', '上海西域机电系统有限公司', '   XSD2016082015141', '146', '18758.00', '现金', '10000.00', '8758.00', '已全部发货', '销售员', '查看 撤销 结款'],
    ['2016-08-03 09:53:20', '上海西域机电系统有限公司', '   XSD2016082015141', '146', '18758.00', '现金', '10000.00', '8758.00', '已全部发货', '销售员', '查看 撤销 结款'],
    ['2016-08-03 09:53:20', '上海西域机电系统有限公司', '   XSD2016082015141', '146', '18758.00', '现金', '10000.00', '8758.00', '已全部发货', '销售员', '查看 撤销 结款'],
    ['2016-08-03 09:53:20', '上海西域机电系统有限公司', '   XSD2016082015141', '146', '18758.00', '现金', '10000.00', '8758.00', '已全部发货', '销售员', '查看 撤销 结款'],
    ['2016-08-03 09:53:20', '上海西域机电系统有限公司', '   XSD2016082015141', '146', '18758.00', '现金', '10000.00', '8758.00', '已全部发货', '销售员', '查看 撤销 结款'],
    ['2016-08-03 09:53:20', '上海西域机电系统有限公司', '   XSD2016082015141', '146', '18758.00', '现金', '10000.00', '8758.00', '已全部发货', '销售员', '查看 撤销 结款'],
    ['2016-08-03 09:53:20', '上海西域机电系统有限公司', '   XSD2016082015141', '146', '18758.00', '现金', '10000.00', '8758.00', '已全部发货', '销售员', '查看 撤销 结款'],
    ['2016-08-03 09:53:20', '上海西域机电系统有限公司', '   XSD2016082015141', '146', '18758.00', '现金', '10000.00', '8758.00', '已全部发货', '销售员', '查看 撤销 结款'],
    ['2016-08-03 09:53:20', '上海西域机电系统有限公司', '   XSD2016082015141', '146', '18758.00', '现金', '10000.00', '8758.00', '已全部发货', '销售员', '查看 撤销 结款']
];


class ReactTable extends React.Component {
    constructor(props) {
        super() ;

    }
    render(){

        let prop = this.props.initProps ;

        return (
            <div key="for" className="react-component-table">
                <Table
                    rowHeight={50}
                    height={500}
                    rowsCount={rows.length}
                    width={1020}
                    headerHeight={36}>
                    <Column
                        header={<Cell>日期</Cell>}
                        cell={({rowIndex})=>{
                            return ( <Cell>{rows[rowIndex][0]}</Cell> )
                        }}
                        width={90}
                    />
                    <Column
                        header={<Cell>客户</Cell>}
                        cell={({rowIndex})=>{
                            return (<Cell className="blueCell">{rows[rowIndex][1]}</Cell>)
                        }}
                        width={130}
                    />
                    <Column
                        header={<Cell>编号</Cell>}
                        cell={({rowIndex})=>{
                            return <Cell>{rows[rowIndex][2]}</Cell>
                        }}
                        width={120}
                    />
                    <Column
                        header={<Cell>货品数量</Cell>}
                        cell={({rowIndex})=>{
                            return <Cell>{rows[rowIndex][3]}</Cell>
                        }}
                        width={90}
                    />
                    <Column
                        header={<Cell>销售金额</Cell>}
                        cell={({rowIndex})=>{
                            return <Cell>{rows[rowIndex][4]}</Cell>
                        }}
                        width={90}
                    />
                    <Column
                        header={<Cell>结算方式</Cell>}
                        cell={({rowIndex})=>{
                            return <Cell>{rows[rowIndex][5]}</Cell>
                        }}
                        width={80}
                    />
                    <Column
                        header={<Cell>实收款</Cell>}
                        cell={({rowIndex})=>{
                            return <Cell>{rows[rowIndex][6]}</Cell>
                        }}
                        width={80}
                    />
                    <Column
                        header={<Cell>应收款</Cell>}
                        cell={({rowIndex})=>{
                            return <Cell className="redCell">{rows[rowIndex][7]}</Cell>
                        }}
                        width={80}
                    />
                    <Column
                        header={<Cell>发货状态</Cell>}
                        cell={({rowIndex})=>{
                            return <Cell>{rows[rowIndex][8]}</Cell>
                        }}
                        width={80}
                    />
                    <Column
                        header={<Cell>操作人</Cell>}
                        cell={({rowIndex})=>{
                            return <Cell>{rows[rowIndex][9]}</Cell>
                        }}
                        width={80}
                    />
                    <Column
                        header={<Cell>操作</Cell>}
                        cell={({rowIndex})=>{
                            return <Cell className="blueCell">{rows[rowIndex][10]}</Cell>
                        }}
                        width={100}
                    />
                </Table>
            </div>
        )
    }
}

export default ReactTable ;