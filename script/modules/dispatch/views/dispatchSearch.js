/**
 * @file 调度-搜索框 Reflux View
 * @author Banji 2017.07.25
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import DispatchAction from '../actions/dispatchAction';
import DateTimePicker from '../../../common/datetimepicker';
import DispatchStore from "../stores/dispatchStore";

var DispatchSearch = React.createClass({
    getInitialState: function() {
        return {
        }
    },
    componentDidMount: function () {
        DateTimePicker.init("input[name='start_date']");
        DateTimePicker.init("input[name='end_date']");
    },
    /**
     * DOM操作回调，搜索按钮点击事件
     * @param {object} event 事件对象
     */
    handleSearchClick:function (event) {
        var start_date = $("input[name='start_date']").datetimepicker('getUTCDate');
        var end_date = $("input[name='end_date']").datetimepicker('getUTCDate');
        if(start_date && end_date){
            if(start_date.getTime() > end_date.getTime()) {
                toastr.error("开始日期不能大于结束日期");
                return;
            }
        }
        DispatchAction.search();
    },
    handleResetClick:function(event){
        $("a[data-status]").removeClass("active");
        $("a[data-status='-1']").addClass("active");
        $("input[name='start_date']").val("");
        $("input[name='end_date']").val("");
        $("input[name='use_name']").val("");
    },
    handleChangeStatus:function(event){
        $("a[data-status]").removeClass("active");
        $(event.target).addClass("active");
    },
    /**
     * DOM操作回调，导出按钮点击事件
     * @param {object} event 事件对象
     */
    handleExportClick:function (event) {
        var param = DispatchStore.data.dispatchSearchParam;
        DispatchAction.export(param);
    },
    /**
     * DOM操作回调，紧急调度按钮点击事件
     * @param {object} event 事件对象
     */
    handleEmerClick:function(event){
        $("#emergency_dispatch_modal").modal('toggle');
    },
    render: function () {
        return (
            <div className="search-box">
                <a data-status="1" onClick={this.handleChangeStatus}>待办</a>
                <a data-status="2" onClick={this.handleChangeStatus}>同意</a>
                <a data-status="3" onClick={this.handleChangeStatus}>驳回</a>
                <a data-status="4" onClick={this.handleChangeStatus}>已撤销</a>
                <a className="active" data-status="-1" onClick={this.handleChangeStatus}>全部</a>
                <input type="text" name="start_date" placeholder="开始日期" className="date-icon"/>至&nbsp;&nbsp;<input type="text" name="end_date" placeholder="结束日期" className="date-icon"/>
                <input type="text" name="use_name" placeholder="用车人" />
                <button className="btn-search" onClick={this.handleSearchClick}>搜 索</button>
                <button className="btn-reset" onClick={this.handleResetClick}>重 置</button>
                <button className="export-data" onClick={this.handleExportClick}>导出数据</button>
                <button type="button" className="btnThree btn-orange lineH" onClick={this.handleEmerClick}>
                    <i className="icon-bg dispatch-icon"></i>紧急调度
                </button>
            </div>
        )
    }
});

export default DispatchSearch;