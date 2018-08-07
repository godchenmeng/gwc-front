/**
 * @file 用车申请列表-搜索框 Reflux View
 * @author Banji 2017.08.03
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import DateTimePicker from '../../../common/datetimepicker';
import CommonFun from '../../../common/commonfun';

import ApplyAction from '../actions/applyAction';
import ApplyStore from '../stores/applyStore';

var ApplyListSearch = React.createClass({
    componentDidMount: function () {
        let that = this;
        DateTimePicker.init("input[name='start_date']");
        DateTimePicker.init("input[name='end_date']");
        if(!!ApplyStore.data.currentSelectStatus) {
            $("a[data-status]").removeClass("active");
            $("select[name='apply_status']").val(ApplyStore.data.currentSelectStatus);
            ApplyStore.data.currentSelectStatus = undefined;
        }else{
            var currentDate = ApplyStore.data.currentDate;
            DateTimePicker.setDate("input[name='start_date']",currentDate);
            DateTimePicker.setDate("input[name='end_date']",currentDate);
        }
        $("input[name='start_date']").on('changeDate', function() {
            that.handleChangeDate();
        });
        $("input[name='end_date']").on('changeDate', function() {
            that.handleChangeDate();
        });
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
        ApplyAction.search();
    },
    handleResetClick:function(){
        $("a[data-status]").removeClass("active");
        $("a[data-status='today']").addClass("active");
        var currentDate = ApplyStore.data.currentDate;
        DateTimePicker.setDate("input[name='start_date']",currentDate);
        DateTimePicker.setDate("input[name='end_date']",currentDate);
        $("select[name='apply_status']").val(-1);
        $("input[name='use_name']").val("");
    },
    /**
     * DOM操作回调，导出按钮点击事件
     * @param {object} event 事件对象
     */
    handleExportClick:function (event) {
        var param = ApplyStore.data.applySearchParam;
        ApplyAction.export(param);
    },
    /**
     * DOM操作回调，时间选择操作函数
     * @param {object} event 事件对象
     */
    handleSelectDate:function(event){
        $("a[data-status]").removeClass("active");
        $(event.target).addClass("active");
        var type = $(event.target).data("status");
        switch(type){
            case "today":
                var today = ApplyStore.data.today;
                DateTimePicker.setDate("input[name='start_date']",today);
                DateTimePicker.setDate("input[name='end_date']",today);
                break;
            case "yesterday":
                var yesterday = ApplyStore.data.yesterday;
                DateTimePicker.setDate("input[name='start_date']",yesterday);
                DateTimePicker.setDate("input[name='end_date']",yesterday);
                break;
            case "thisWeek":
                var thisWeek = ApplyStore.data.thisWeek;
                DateTimePicker.setDate("input[name='start_date']",thisWeek.start_date);
                DateTimePicker.setDate("input[name='end_date']",thisWeek.end_date);
                break;
            case "lastWeek":
                var lastWeek = ApplyStore.data.lastWeek;
                DateTimePicker.setDate("input[name='start_date']",lastWeek.start_date);
                DateTimePicker.setDate("input[name='end_date']",lastWeek.end_date);
                break;
            case "thisMonth":
                var thisMonth = ApplyStore.data.thisMonth;
                DateTimePicker.setDate("input[name='start_date']",thisMonth.start_date);
                DateTimePicker.setDate("input[name='end_date']",thisMonth.end_date);
                break;
            case "lastMonth":
                var lastMonth = ApplyStore.data.lastMonth;
                DateTimePicker.setDate("input[name='start_date']",lastMonth.start_date);
                DateTimePicker.setDate("input[name='end_date']",lastMonth.end_date);
                break;
        }
    },
    /**
     * 时间控件改变监听
     */
    handleChangeDate:function(){
        var start_date = $("input[name='start_date']").datetimepicker('getFormattedDate');
        var end_date = $("input[name='end_date']").datetimepicker('getFormattedDate');
        var today = ApplyStore.data.today;
        var yesterday = ApplyStore.data.yesterday;
        var thisWeek = ApplyStore.data.thisWeek;
        var lastWeek = ApplyStore.data.lastWeek;
        var thisMonth = ApplyStore.data.thisMonth;
        var lastMonth = ApplyStore.data.lastMonth;
        $("a[data-status]").removeClass("active");
        if(start_date == today && end_date == today){
            $("a[data-status='today']").addClass("active");
        }else if(start_date == yesterday && end_date == yesterday){
            $("a[data-status='yesterday']").addClass("active");
        }else if(start_date == thisWeek.start_date && end_date == thisWeek.end_date){
            $("a[data-status='thisWeek']").addClass("active");
        }else if(start_date == lastWeek.start_date && end_date == lastWeek.end_date){
            $("a[data-status='lastWeek']").addClass("active");
        }else if(start_date == thisMonth.start_date && end_date == thisMonth.end_date){
            $("a[data-status='thisMonth']").addClass("active");
        }else if(start_date == lastMonth.start_date && end_date == lastMonth.end_date){
            $("a[data-status='lastMonth']").addClass("active");
        }
    },
    render: function () {
        return (
            <div className="search-box">
                <a data-status="today" onClick={this.handleSelectDate} className="active">今天</a>
                <a data-status="yesterday" onClick={this.handleSelectDate}>昨天</a>
                <a data-status="thisWeek" onClick={this.handleSelectDate}>本周</a>
                <a data-status="lastWeek" onClick={this.handleSelectDate}>上周</a>
                <a data-status="thisMonth" onClick={this.handleSelectDate}>本月</a>
                <a data-status="lastMonth" onClick={this.handleSelectDate}>上月</a>
                <input type="text" name="start_date" placeholder="开始日期"/>至&nbsp;&nbsp;<input type="text" name="end_date" placeholder="结束日期"/>
                <select name="apply_status">
                    <option value="-1">处理状态</option>
                    <option value="1">待审批</option>
                    <option value="2">待调度</option>
                    <option value="3">待出车</option>
                    <option value="5">已完成</option>
                    <option value="6">驳回</option>
                </select>
                <input type="text" name="use_name" placeholder="用车人" />
                <button className="btn-search" onClick={this.handleSearchClick}>搜索</button>
                <button className="btn-reset" onClick={this.handleResetClick}>重置</button>
                <button className="export-data" onClick={this.handleExportClick}>导出数据</button>
            </div>
        )
    }
});

export default ApplyListSearch;