/**
 * Created by jove_jin on 2016/9/27.
 */
import React from 'react'
import {
    Button , Pagination , Select , Input , DatePicker , Table , Form , Modal ,
    Upload ,
    Row , Col ,
    Icon
} from 'antd/dist/antd.js'

import { browserHistory } from 'react-router'
class NotFound extends React.Component {
    constructor(props){
        super(props) ;
    }
    _evClick_ToFront(){
        browserHistory.push('/');
    }
    _evClick_GoBack(){
        this.props.history.goBack();
    }
    render(){
        return (
            <div className="center">
                <div className="notFind-box">
                    <img src="/static/resource/images/404.png" />
                    <div className="returnButton">
                        <Button onClick={this._evClick_GoBack.bind(this)}>返回上一页</Button>
                        <Button type="primary" onClick={this._evClick_ToFront.bind(this)}>返回网站首页</Button>
                    </div>
                </div>
            </div>

        )
    }

}
/*
export default connect(
    ( state ) => {
        return {

        }
    } ,
    {}
)( NotFound )*/
export default NotFound ;