import React from 'react'

class Header extends React.Component {

    render() {

        return (

            <header  className="header">
                {/*<h1  className="logo">西域进销存</h1>*/}
                <i className="sprite-logo_white new-logo"></i>
                {/*<div className="Vertical"></div>*/}
                <h2  className="register">用户注册</h2>
                {/*<h2  className="login">用户登录</h2>*/}
                <h2  className="pwd">找回密码</h2>
                <h2  className="team">我的团队</h2>
            </header>

        )

    }

}

export default Header ;
