import React from 'react' ;
import {
    Affix ,
    Button
} from 'antd/dist/antd.js' ;
import className from 'classnames' ;

class Layer extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        var cx = className({
            'react-component-layer' : true ,
            'show' : this.props.layerShow
        }) ;
        return (
            <div
                className={cx + ( this.props.addClass ? (' ' + this.props.addClass):'' ) }
            >
                <div
                    className="layer-mask"
                    onClick={this.props._handleLayerHide.bind(this)}
                ></div>
                <div
                    className="layer-wrap"
                >
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

Layer.defaultProps = {
    _handleLayerHide : function () {
        
    }
}

// ReactDOM.render('',document.getElementsById()) ;

export default Layer ;