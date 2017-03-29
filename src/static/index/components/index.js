//common component
export Crumbs from './common/Crumbs.js'
export Layer from './common/Layer.js'
export Detail from './common/Detail.js'
export Auth from './common/Auth.js'

//levelRoot
export App from './App.js'

//level1
export Home from './home/Home.js'

//level1
export Purchase from './purchase/Purchase.js'
    //level2
    export Order from './purchase/order/Order.js'
    //level2
    export ReturnOrder from './purchase/returnOrder/ReturnOrder.js'

//level1
export Market from './market/Market.js'
    //level2
    export List from './market/list/List.js'
    //level2
    export ReturnList from './market/returnList/ReturnList.js'

//level1
export Account from './account/Account'
    //level2
    export ChargeAccount from './account/chargeAccount/ChargeAccount.js'
    //level2
    export CheckAccount from './account/checkAccount/CheckAccount'
        //level3
        export User from './account/checkAccount/user/User.js'
        //level3
        export Supplier from './account/checkAccount/supplier/Supplier.js'

//level1
export Statistics from './statistics/Statistics.js'
    //level2
    export S_Market from './statistics/s_market/S_Market.js'
        //level3
        export S_A_Product from './statistics/s_market/s_a_product/S_A_Product'
        //level3
        export S_A_User from './statistics/s_market/s_a_user/S_A_User'
        //level3
        export S_A_Market from './statistics/s_market/s_a_market/S_A_Market'
        //level3
        export S_A_Sale from './statistics/s_market/s_a_sale/S_A_Sale'
    //level2
    export S_Purchase from './statistics/s_purchase/S_Purchase'
        //level3
        export S_B_Product from './statistics/s_purchase/s_b_product/S_B_Product'
        //level3
        export S_B_Supplier from './statistics/s_purchase/s_b_supplier/S_B_Supplier'
        //level3
        export S_B_Purchase from './statistics/s_purchase/s_b_purchase/S_B_Purchase'
    //level2
    export S_Account from './statistics/s_account/S_Account'
        //level3
        export S_C_Account from './statistics/s_account/s_c_account/S_C_Account'
        //level3
        export S_C_Pay from './statistics/s_account/s_c_pay/S_C_Pay'
    //level2
    export S_Invoicing from './statistics/s_invoicing/S_Invoicing'
        //level3
        export S_D_Invoicing from './statistics/s_invoicing/s_d_invoicing/S_D_Invoicing'

//level1
export Base from './base/Base.js'
    //level2
    export B_Product from './base/b_product/B_Product.js'
    // export Detail from './base/b_product/Detail.js'

    //level2
    export B_Customer from './base/b_customer/B_Customer.js'
    //level2
    export B_Supplier from './base/b_supplier/B_Supplier.js'
//level1
export Settings from './settings/Settings.js'
    //level2
    export Se_Account from './settings/se_account/Se_Account.js'
        //level3
        export Se_A_Personal from './settings/se_account/se_a_personal/Se_A_Personal.js'
        //level3
        export Se_A_Personaledit from './settings/se_account/se_a_personaledit/Se_A_Personaledit.js'
        //level3
        export Se_A_Company from './settings/se_account/se_a_company/Se_A_Company.js'
        //level3
        export Se_A_Companyedit from './settings/se_account/se_a_companyedit/Se_A_Companyedit.js'
    //level2
    export Se_Team from './settings/se_team/Se_Team.js'
    //level3
    export Se_Log from './settings/se_log/Se_Log.js'
    //level3
    export Se_Feedback from './settings/se_feedback/Se_Feedback.js'
//level1
export NotFound from './NotFound.js'