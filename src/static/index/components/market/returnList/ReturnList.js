import React from 'react' ;

class ReturnList extends React.Component {
    render (){

        console.log( this ) ;

        return (
            <div>
                <div className="center-east-north">
                    <a className="active">销售退货记录</a>
                </div>
                <div className="center-east-center">
                    销售退货记录
                </div>
            </div>

        )
    }
}

export default ReturnList ;