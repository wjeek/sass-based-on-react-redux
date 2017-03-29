import React from 'react' ;
import {

} from 'antd/dist/antd.js' ;
import className from 'classnames' ;

class Detail extends React.Component{

    //TODO
    constructor(props) {
        super(props);
    }
    render(){
        var cx = className({
            'react-component-layer' : true ,
            'show' : this.props.layerShow
        }) ;
        return (
            <div className={cx + ( this.props.addClass ? (' ' + this.props.addClass):'' ) }>
                <div className="layer-mask" onClick={this.props._handleLayerHide.bind(this)}></div>
                <div className="layer-wrap">
                    {this.props.children}
                </div>
            </div>
        )


        // <Layer layerShow={this.props.base.b_productState.layerShow1} _handleLayerHide={()=>{this.props.layerShow1(false,{})}}>
        //     <div className="header">
        //
        //     </div>
        //     <div className="content-wrap">
        //         <div className="content">
        //         </div>
        //     </div>
        // </Layer>

    }
}

Detail.defaultProps = {
    _handleLayerHide : function () {

    },
    leftWidth : '20%' ,
    rightWidth : '80%' ,

    leftAttr : [{
        name : '类别' ,
        value : 'category'
    },{
        name : '品牌' ,
        value : 'brand'
    },{
        name : '规格型号' ,
        value : 'specification'
    },{
        name : '单位' ,
        value : 'unit'
    },{
        name : '现有数量' ,
        value : 'number'
    },{
        name : '库存成本' ,
        value : 'inventoryCost'
    },{
        name : '排序' ,
        value : 'sort'
    },{
        name : '图片' ,
        value : 'img'
    },{
        name : '备注' ,
        value : 'tips'
    },{
        name : '操作人' ,
        value : 'operator'
    }]
}

// ReactDOM.render('',document.getElementsById()) ;

export default Detail ;