/**
 * @file 短信角色管理过滤查询 Reflux View
 * @author Banji 2017.10.30
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共模块加载
import SmsRoleAction from '../actions/smsRoleAction';
import SmsRoleStore from '../stores/smsRoleStore';

var SmsRoleListFilter = React.createClass({
    getInitialState: function() {
        return{
        }
    },
    componentDidMount: function () {

    },
    handleSmsRoleSearch:function (event) {
        SmsRoleAction.getSmsRoleList(null);
    },
    handleSmsRoleReset: function(event){
        $("input#sms_role_name").val("");
    },
    render:function () {
        return(
            <div className="search-box">
                <input type="text" id="sms_role_name" placeholder="请输入角色名称" />
                <button type="button" className="btn-search" onClick={this.handleSmsRoleSearch}>搜索</button>
                <button type="button" className="btn-reset" onClick={this.handleSmsRoleReset}>重置</button>
            </div>
        )
    }
});
export default SmsRoleListFilter;
