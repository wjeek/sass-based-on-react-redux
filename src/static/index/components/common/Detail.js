import React from 'react'

class Detail extends React.Component{

    render(){
        var hasImage = false ;
        var table = this.props.detailAttr.map((v,i)=>{
            if ( v.type == 'image' ){
                hasImage = v ;
                return (
                    <tr key={i} style={{display:'none'}}>
                        <td className="cat" value={v.key}>{v.title}</td>
                        <td>{ this._renderTd(v) }</td>
                    </tr>
                )
            } else {
                return (
                    <tr key={i}>
                        <td className="cat" value={v.key}>{v.title}</td>
                        <td>{ this._renderTd(v) }</td>
                    </tr>
                )
            }
        })
        return ( !hasImage )?(
            <table className="customer-detail-table">
                <tbody>
                    {
                        table
                    }
                </tbody>
            </table>
        ) : (
            <div style={{width:'100%'}}>
                <table className="customer-detail-table-left">
                    <tbody>
                    {
                        table
                    }
                    </tbody>
                </table>
                <div className="customer-detail-table-right">
                    <a target="_blink" href={this.props.detail[hasImage.key]}>
                        <img
                            src={this.props.detail[hasImage.key]}
                        />
                    </a>
                </div>
            </div>
        )
    }

    _renderTd(value){
        if ( value.type == 'image' ){
            return (
                <img
                    style={{width:'100px',height:'100px'}}
                    src={this.props.detail[ value.key ]}
                />
            )
        } else {
            return (
                <span>
                    {this.props.detail[ value.key ]}
                </span>
            )
        }
    }
}

Detail.defaultProps = {
    detailAttr : [] ,
    detail : {}
}

export default Detail ;