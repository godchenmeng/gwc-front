/**
 * @file 用户管理过滤 Reflux View
 * @author CM 2017.08.15
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共模块加载
import UserAction from '../actions/userAction';
import UserStore from '../stores/userStore';

//模块加载
import Datetimepicker from '../../../common/datetimepicker';
import Commonfun from '../../../common/commonfun';

var UserListFilter = React.createClass({
    componentDidMount: function () {
        let dateOpts = {
            endDate: Commonfun.getCurrentDate()
        };
        Datetimepicker.init("#startDate",dateOpts);
        Datetimepicker.init("#endDate",dateOpts);
    },
    handleSearch:function (event) {
        UserAction.getuserlist(null);
    },
    handleReset:function (event) {
        $("input#username").val("");
        $("input#usercode").val("");
        $("select#usersex").val(-1);
        $("input#startDate").val("");
        $("input#endDate").val("");
    },
    render:function () {
        return(
            <div className="search-box">
                <input type="text" id="username" placeholder="请输入用户姓名" />
                <input type="text" id="usercode" placeholder="请输入工号" />
                <select id="usersex">
                    <option value="-1">请选择性别</option>
                    <option value="1">男</option>
                    <option value="2">女</option>
                </select>

                <input type="text" id="startDate" className="date-icon" placeholder="开始日期" />至&nbsp;&nbsp;
                <input type="text" id="endDate" className="date-icon" placeholder="结束日期" />
                <button type="button" onClick={this.handleSearch} className="btn-search">搜索</button>
                <button type="button" onClick={this.handleReset} className="btn-reset">重置</button>
            </div>
        )
    }
});
export default UserListFilter;
