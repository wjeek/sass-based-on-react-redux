import React from 'react'
import {
    ReactSelect ,
    ReactInput ,
    ReactText ,
    ReactDatepicker ,
    ReactButton
} from '../index'
import {
    DatePicker ,
    Select
} from 'antd/dist/antd.js';


const initInput = ( value ) => {

    var componentLable = ( <span key="label"> { value.label } </span> ) ;
    var component = (
        <ReactText initProps={ value } key="for"></ReactText>
    ) ;
    switch ( value.type ){
        case 'select' :
            component = (
                // <Select defaultValue="lucy" style={{ width: 120 }} onChange={handleChange}>
                //     <Option value="jack">Jack</Option>
                //     <Option value="lucy">Lucy</Option>
                //     <Option value="yiminghe">yiminghe</Option>
                // </Select>
                <ReactSelect initProps= { value }  key="for" ></ReactSelect>
            )
            break ;
        case 'input' :
            component = (
                <ReactInput initProps= { value } key="for" ></ReactInput>
            ) ;
            break ;
        case 'datepicker' :
            component = (
                <DatePicker size="large" key="for" defaultValue="2016-08-20" format="yyyy-MM-dd"></DatePicker>
                // <ReactDatepicker initProps = { value } key="for"></ReactDatepicker>
            ) ;
            break ;
        case 'text' :
            component = (
                <ReactText initProps={ value } key="for"></ReactText>
            ) ;
        default :
            break ;
    }
    return Array.of( componentLable , component ) ;
}




class Filter extends React.Component {

    constructor() {
        super() ;
    }
    componentWillMount(){

    }
    __handleFilterSearch(){
        alert( 'searching!' ) ;
    }
    render(){

        let innerString = this.props.innerString ;
        if ( Object.prototype.toString.call( innerString.children ) !== '[object Array]' ){
            return ;
        }
        let innerChild = innerString.children ;
        let childFilter = innerChild.map( ( value , index ) => {
            return (
                <span key={index} className="filter-wrap">
                   { initInput( value ) }
                </span>
            ) ;
        }) ;
        return (
            <div className="react-component-filter">
                <div className="filter-area">{ childFilter }</div>
                <div className="filter-submit">
                    <ReactButton initProps={
                        {
                            icon : 'sprite-ico_captcha_s' ,
                            text : '查询' ,
                            addClass : 'lighter' ,
                            onClick : this.__handleFilterSearch.bind(this)
                        }
                    }></ReactButton>
                </div>
            </div>
        )
    }

}


export default Filter ;