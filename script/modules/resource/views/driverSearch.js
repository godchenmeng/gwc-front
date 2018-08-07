/**
 * @file 驾驶员管理-搜索框 Reflux View
 * @author XuHong 2017.09.09
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import DriverAction from "../actions/driverAction";

var DriverSearch = React.createClass({
    getInitialState: function() {
        return {}
    },
    handleDriverSearch: function(event) {
        DriverAction.getDriverList();
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
                <input id="q_driver_name" type="text" placeholder="请输入驾驶员姓名"/>
                <input id="q_driver_no" type="text" placeholder="请输入驾驶证号"/>
                <select id="q_driver_type">
                    <option value="-1">准驾车型</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="A3">A3</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                </select>
                <button type="submit" onClick={this.handleDriverSearch} className="btn-search">搜索</button>
                <button type="submit" onClick={this.handleReset} className="btn-reset">重置</button>
            </div>
        )
    }
});

export default DriverSearch;