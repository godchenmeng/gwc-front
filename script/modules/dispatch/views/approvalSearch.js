/**
 * @file 审批-搜索框 Reflux View
 * @author Banji 2017.08.14
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import ApprovalAction from '../actions/approvalAction';
import ApprovalStore from '../stores/approvalStore';

import DateTimePicker from '../../../common/datetimepicker';

var ApprovalSearch = React.createClass({
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
        ApprovalAction.search();
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
        var param = ApprovalStore.data.approvalSearchParam;
        ApprovalAction.export(param);
    },
    render: function () {
        return (
            <div className="search-box">
                <a data-status="1" onClick={this.handleChangeStatus}>待办</a>
                <a data-status="2" onClick={this.handleChangeStatus}>同意</a>
                <a data-status="3" onClick={this.handleChangeStatus}>驳回</a>
                <a data-status="4" onClick={this.handleChangeStatus}>已撤销</a>
                <a className="active" data-status="-1" onClick={this.handleChangeStatus}>全部</a>
                <input type="text" name="start_date" className="date-icon" placeholder="开始日期" />至&nbsp;&nbsp;<input type="text" name="end_date" className="date-icon" placeholder="结束日期" />
                <input type="text" name="use_name" placeholder="用车人" />
                <button className="btn-search" onClick={this.handleSearchClick}>搜索</button>
                <button className="btn-reset" onClick={this.handleResetClick}>重置</button>
                <button className="export-data" onClick={this.handleExportClick}>导出数据</button>
            </div>
        )
    }
});

export default ApprovalSearch;