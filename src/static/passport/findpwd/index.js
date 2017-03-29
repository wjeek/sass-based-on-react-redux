import React from 'react' ;
import ReactDOM from 'react-dom' ;
import 'antd/dist/antd.css';
import {
    createStore , combineReducers
} from 'redux' ;
import {
    Provider
} from 'react-redux' ;
import * as reducers from './reducers'
import {
    Header
} from '../register/components'
import {
    Tabs ,
    Contents
} from './components'

const store = createStore(
    combineReducers({
        ...reducers
    })
) ;


window.globalEvent = {
    findpwd : {}
}

ReactDOM.render(
    <Provider store={store}>
        <div className="main">
            <Header>
                <header  className="header">
                    <h1  className="logo">点点账</h1>
                    <div className="Vertical"></div>
                    <h2  className="pwd">找回密码</h2>
                </header>
            </Header>
            <div className="body">
                <div className="body-content">
                    <Contents>

                    </Contents>
                </div>
            </div>
        </div>
    </Provider>,
    document.getElementById('findpwd-entry')
) ;