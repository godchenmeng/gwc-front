/**
 * @file 账号管理过滤 Reflux View
 * @author CM 2017.08.15
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共模块加载
import UserAction from '../actions/userAction';
import UserStore from '../stores/userStore';

import BootstrapTree from '../../../common/bootstrapTree';

var AccountListFilter = React.createClass({
    componentDidMount: function () {
    },
    handleAccountSearch:function (event) {
        UserAction.getaccountlist(null);
    },
    handleAccountReSet:function (event) {
        $("input#mb_name").val("");
        $("input#lo_name").val("");
        $("input#show_name").val("");
        $("input#hide_org").val("");
        //BootstrapTree.setUnSelectNode("account_filter_org_tree");
    },
    render:function () {
        return(
            <div className="search-box">
                <input type="text" id="mb_name" placeholder="请输入用户姓名" />
                <input type="text" id="lo_name" placeholder="请输入登录名" />
                <input type="text" id="show_name" placeholder="请选择机构部门" readOnly style={{width:"240px"}} />
                <input type="hidden" id="hide_org"/>
                <div id="account_filter_org_tree" style={{position: "absolute", zIndex: "999", top: "50px", left: "285px", width: "240px", overflow: "scroll",background:"#fff",display:"none"}}></div>
                <button type="button" onClick={this.handleAccountSearch} className="btn-search">搜索</button>
                <button type="button" onClick={this.handleAccountReSet} className="btn-reset">重置</button>
            </div>
        )
    }
});
export default AccountListFilter;
