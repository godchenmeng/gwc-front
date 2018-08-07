/**
 * @file 实时监控-搜索框 Reflux View
 * @author CM 2017.07.21
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import MonitorNewAction from "../actions/monitorNewAction";
import MonitorNewStore from '../stores/monitorNewStore';


var MonitorNewSearch = React.createClass({
    getInitialState: function() {
        return {
            carstatus:0, //当前车辆状态集合
            keyword:'' //搜索关键词
        }
    },
    componentDidMount: function () {
        MonitorNewStore.listen(this.onStatusChange);
    },
    onStatusChange: function (type,data) {
        switch (type){
            case 'carstatus':
                this.listenCarstatus(data);
                break;
        }
    },
    listenCarstatus:function (status) {
        this.setState({carstatus:status});
        //$("[name='locateStateCK']").attr("checked",'true');//全选
    },
    /**
     * DOM操作回调，检索框value改变
     * @param event
     */
    handleBlur: function(event) {
        let that = this;
        MonitorNewAction.searchcar($('#search_key').val());
    },
    /**
     * DOM操作回调，点击回车检索
     *
     * @param event 事件对象 s
     */
    handleKeyBoard: function(event) {
        let that = this;
        if (event.key === 'Enter') {
            MonitorNewAction.searchcar($('#search_key').val());
        }
    },
    handleClickAcc:function(event){
        MonitorNewAction.getcarstatus(true);
    },
    render: function () {
        let that = this;
        let total_online = this.state.carstatus.total_online;
        let total_offline = this.state.carstatus.total_offline;
        let total_stay = this.state.carstatus.total_stay;
        return (
            <div className="Monitor-left">
                <ul className="state-box">
                    <li>
                        <input type="checkbox" name="locateStateCK" id="locateRun" value="1" onClick={this.handleClickAcc}/>&nbsp;<label htmlFor="locateRun">运动</label>
                    </li>
                    <li>
                        <input type="checkbox" name="locateStateCK" id="locateStop" value="2" onClick={this.handleClickAcc}/>&nbsp;<label htmlFor="locateStop">静止</label>
                    </li>
                    <li>
                        <input type="checkbox" name="locateStateCK" id="locateOut" value="0" onClick={this.handleClickAcc}/>&nbsp;<label htmlFor="locateOut">离线</label>
                    </li>
                    <li><span className="green-text">{total_online}</span></li>
                    <li><span className="red-text">{total_stay}</span></li>
                    <li><span className="gray-text">{total_offline}</span></li>
                </ul>
                <input type="text"  placeholder="请输入车牌号码" className="input-car" onBlur={that.handleBlur} onKeyPress={that.handleKeyBoard} id="search_key" />
            </div>
        )
    }
});

export default MonitorNewSearch;