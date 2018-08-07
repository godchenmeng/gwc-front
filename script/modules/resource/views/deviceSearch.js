/**
 * @file 设备管理-搜索框 Reflux View
 * @author XuHong 2017.09.08
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import DeviceAction from "../actions/deviceAction";

var DeviceSearch = React.createClass({
    getInitialState: function() {
        return {}
    },
    handleDeviceSearch: function(event) {
        DeviceAction.getDeviceList();
    },
    handleReset: function() {
        $(".search-box").children().each(function() {
            var searchCon = $(this);
            if(searchCon.is("input")) {
                searchCon.val("");
            } else if(searchCon.is("select")) {
                searchCon.val("");
                searchCon.val(searchCon.find("option:eq(0)").val());
            }
        });
    },
    render: function() {
        return (
            <div className="search-box">
                <input id="car_no_r" type="text" placeholder="请输入车牌号"/>
                <input id="device_qr" type="text" placeholder="请输入设备编号"/>
                <input id="show_name" type="text" placeholder="请选择机构部门" style={{width:'240px'}}/>
                <input id="hide_org" type="hidden"/>
                <div id="device_org_tree" style={{position:'absolute',zIndex:'999',top:'45px',left:'286px',width:'240px',height:'180px',background:'#fff',overflow:'scroll',display:'none'}}></div>
                <button type="submit" onClick={this.handleDeviceSearch} className="btn-search">搜索</button>
                <button type="submit" onClick={this.handleReset} className="btn-reset">重置</button>
            </div>
        )
    }
});

export default DeviceSearch;