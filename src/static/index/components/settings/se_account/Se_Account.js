import React from 'react'
import {
    Link
} from 'react-router'
import {
    connect
} from 'react-redux'

class Se_Account extends React.Component {

    render(){
        var isEdit = this.props.settings.personal ;
        return (
            <div>
                <div className="center-east-north">
                    <a className="active">账户信息</a>
                </div>
                <div className="center-east-center">
                    <div className="center-east-center-content for-account">

                        <div className="center-east-center-content-north">

                            <Link to="/settings/se_account/se_a_personal" activeClassName="active" className="show-pure personal-link">个人信息</Link>
                            <Link to="/settings/se_account/se_a_company" activeClassName="active" className="show-pure company-link">公司信息</Link>

                            <Link to="/settings/se_account/se_a_personaledit" activeClassName="active">个人信息(编辑)</Link>
                            <Link to="/settings/se_account/se_a_companyedit" activeClassName="active">公司信息(编辑)</Link>

                        </div>

                        <div className="center-east-center-content-center">

                            {
                                this.props.children
                            }

                        </div>
                        
                    </div>
                    
                </div>
            </div>

        )

    }

}

export default connect(
    (state) => {
        var settings = state.settings ;
        return {
            settings
        }
    },
    {

    }
)(Se_Account)
