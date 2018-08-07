/**
 * @file 角色管理过滤 Reflux View
 * @author CM 2017.08.22
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共模块加载
import RoleAction from '../actions/roleAction';
import RoleStore from '../stores/roleStore';

var RoleListFilter = React.createClass({
    componentDidMount: function () {
    },
    handleRoleSearch:function (event) {
        RoleAction.getrolelist(null);
    },
    handleRoleReset:function (event) {
        $("input#s_role_name").val("");
    },
    render:function () {
        return(
            <div className="search-box">
                <input type="text" id="s_role_name" placeholder="请输入角色名称" />
                <button type="button" onClick={this.handleRoleSearch} className="btn-search">搜索</button>
                <button type="button" onClick={this.handleRoleReset} className="btn-reset">重置</button>
            </div>
        )
    }
});
export default RoleListFilter;
