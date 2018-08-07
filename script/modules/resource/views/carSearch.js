/**
 * @file 车辆管理-搜索框 Reflux View
 * @author XuHong 2017.08.30
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import CarAction from "../actions/carAction";

import CommonAction from "../../common/actions/commonAction";

var CarSearch = React.createClass({
    getInitialState: function() {
        return {
            carType:[],
        }
    },
    componentDidMount: function () {
        let that = this;
        CommonAction.loadDataDictionary("carType",{parentId:1},function(data){
            that.setState({carType: data.datas});
        });
    },
    handleCarSearch: function(event) {
        CarAction.getCarList();
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
        let that = this;
        let carType = that.state.carType;
        return (
            <div className="search-box">
                <input id="car_no_r" type="text" placeholder="请输入车牌号"/>
                <select id="type">
                    <option value="-1">车辆类型</option>
                    {
                        carType.map(function(item, index){
                            return (
                                <option value={item.value} key={index}>{item.text}</option>
                            )
                        })
                    }
                </select>
                <input id="show_name" type="text" placeholder="请选择机构部门" style={{width:'240px'}}/>
                <input id="hide_org" type="hidden"/>
                <div id="car_org_tree" className="openTree-menu" style={{width:'240px',maxHeight:'180px'}} ></div>
                <select id="check">
                    <option value="-1">审核状态</option>
                    <option value="1">已审核</option>
                    <option value="2">未审核</option>
                </select>
                <select id="status">
                    <option value="-1">处理状态</option>
                    <option value="1">正常</option>
                    <option value="2">报废</option>
                </select>
                <button type="submit" onClick={this.handleCarSearch} className="btn-search">搜索</button>
                <button type="submit" onClick={this.handleReset} className="btn-reset">重置</button>
            </div>
        )
    }
});

export default CarSearch;