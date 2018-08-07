/**
 * @file 账号管理 Reflux View
 * @author CM 2017.08.18
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共模块加载
import UserAction from '../actions/userAction';
import UserStore from '../stores/userStore';
import Urls from '../../../common/urls';
import BootstrapTree from '../../../common/bootstrapTree';
import BootstrapTable from '../../../common/bootstrapTable';
import CommonStore from '../../common/stores/commonStore';

//模块加载
import AccountListFilter from "accountListFilter";
import AccountAdd from "accountAdd";
import ChangePassword from "changePassword";

var AccountList = React.createClass({
    componentDidMount: function () {
        let queryParam = function (params) {  //配置参数
            let param = {
                mb_name : $("#mb_name").val(),
                lo_name : $("#lo_name").val(),
                show_name: $("#show_name").val(),
                hide_org: $("#hide_org").val(),
                limit: params.limit,
                pageIndex: params.pageNumber - 1
            };
            return param;
        }
        UserAction.getaccountlist(queryParam);
        this.initOrgTree();
    },
    /**
     * 初始化机构选取树
     */
    initOrgTree:function () {
        Urls.get(Urls.loadorgtree,{},function(data){
            // BootstrapTree.initTree("acc_tree",data,"acc_org_name","acc_org");
            BootstrapTree.initTree("account_filter_org_tree",data,"show_name","hide_org");
            //BootstrapTree.initTree("acc_tree",data,"acc_org_name","acc_org")
        });
    },
    handleChangePWShow:function (event) {
        let selRow = BootstrapTable.getSelected("account_list_table");
        if(selRow.length != 1){
            toastr.warning("请选择一个账号重置！");
        }else{
            $("#changePW").modal("show");
            $("#user_id").val(selRow[0].id);
        }
    },
    render:function () {
        return(
            <div className="right_col">
                <div className="page-title" style={{height: "65px"}}>
                    <div className="title_left" style={{marginTop: "5px"}}> <img src={__uri("/static/images/bread-nav.png")} />后台管理 > 账号管理 </div>
                    <div className="title_right" style={{textAlign:"right"}}>
                        <button type="button" className={CommonStore.verifyPermission('user/pwd/reset')?"btnOne btn-bule":"hide"} onClick={this.handleChangePWShow}><i className="icon-bg password-icon"></i>重置密码</button>
                    </div>
                </div>
                <br /><br />
                <AccountListFilter />
                <table id="account_list_table" className="table-striped mart12 clear" style={{width:"100%",borderCollapse:"collapse"}}></table>
                <ChangePassword />
                <AccountAdd />
            </div>
        )
    }
});

export default AccountList;
