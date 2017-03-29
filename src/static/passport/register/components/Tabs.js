import React from 'react'
import { connect } from 'react-redux'

class Tabs extends React.Component {

    render() {

        var s1 = 'step1' ;
        var s2 = 'step2' ;
        var s3 = 'step3' ;
        var s4 = 'line'  ;

        switch ( this.props.currentIndex ){
            case 1 :
                s1 = 'step1 on' ;
                break ;
            case 2 :
                s2 = 'step2 on' ;
                break ;
            case 3 :
                s3 = 'step3 on' ;
                break ;
            default :
                break ;
        }

        return (

            <div className="tabs">

                <div className={s1}>
                    <div className="circle">
                        <span className="order">
                            1
                        </span>
                    </div>
                    <span className="words">手机验证</span>
                </div>
                <div className={s4}></div>

                <div className={s2}>
                    <div className="circle">
                        <span className="order">
                            2
                        </span>
                    </div>
                    <span className="words">填写信息</span>
                </div>
                <div className={s4}></div>

                <div className={s3}>
                    <div className="circle">
                        <span className="order">
                            3
                        </span>
                    </div>
                    <span className="words">注册成功</span>
                </div>

            </div>

        )
    }
}

export default connect(

    state => {
        return (
            { currentIndex : state.default.currentIndex }
        )
    },

    {}

)(Tabs)
