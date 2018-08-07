/**
 * @file 定位查询-状态框 Reflux View
 * @author CM 2017.08.02
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import LocateAction from "../actions/locateAction";
import LocateStore from '../stores/locateStore';

var LocateState = React.createClass({
    getInitialState: function() {
        return {
            carstatus:0, //当前车辆状态集合
            keyword:'' //搜索关键词
        }
    },
    componentDidMount: function () {
        LocateStore.listen(this.onStatusChange);
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
    handleClickAcc:function(event){
        LocateAction.getcarstatus(true);
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
            </div>
        )
    }
});

export default LocateState;