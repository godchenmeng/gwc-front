/**
 * @file 设备GPS数据查询导出-搜索框 Reflux View
 * @author Banji 2018.01.04
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import DataQueryExportAction from '../actions/dataQueryExportAction'
import DataQueryExportStore from '../stores/dataQueryExportStore'

import DateTimePicker from '../../../common/datetimepicker'
import BootstrapTree from '../../../common/bootstrapTree'
import Urls from '../../../common/urls'
import CommonFun from '../../../common/commonfun'


var DataQueryExportSearch = React.createClass({
    getInitialState: function() {
        return {
            col_name_data:{},
            column_name_data:{}
        }
    },
    componentDidMount: function () {
        let that = this;
        let dateOption = {endDate:CommonFun.getLocalTime(),minView:'hour',format:'yyyy-mm-dd hh:ii:ss'};
        DateTimePicker.init("input[name='start_date']",dateOption);
        DateTimePicker.init("input[name='end_date']",dateOption);
        that.renderSelect();
        that.renderSelectColumn();
        that.renderTree();
        $("select#table_name").on("change",function(){
            that.renderSelect();
        });
    },
    /**
     * DOM操作回调，上部分搜索按钮点击事件
     * @param {object} event 事件对象
     */
    handleSearchUpClick:function (event) {
        let device = $("#device_no").val();
        if(!device){
            toastr.warning("请输入设备编号！");
            return;
        }
        let col_names = $('#col_names').val();
        if(!col_names || col_names.length < 0){
            toastr.warning("请选择列名！");
            return;
        }
        let start_time = $("input[name='start_date']").val();
        let end_time = $("input[name='end_date']").val();
        if(!start_time || !end_time){
            toastr.warning("请选择开始时间和结束时间！");
            return;
        }
        start_time = new Date(start_time).getTime();
        end_time = new Date(end_time).getTime();
        if(end_time < start_time){
            toastr.warning("结束时间不能小于开始时间！");
            return;
        }
        let table_name = $("select#table_name").val();
        if(table_name != "yx_gps_current" && (end_time - start_time) > 24*60*60*1000){
            toastr.warning("查询的表数据量太多，时间跨度不能超过24小时！");
            return;
        }
        DataQueryExportAction.tableSearch();
        //DataQueryExportStore.trigger("showTable");
    },
    /**
     * DOM操作回调，上部分重置按钮点击事件
     * @param {object} event 事件对象
     */
    handleResetUpClick:function (event) {
        $("#device_no").val("");
        $('select#table_name').prop('selectedIndex', 0);
        this.renderSelect();
        $("input[name='start_date']").val("");
        $("input[name='end_date']").val("");
    },
    /**
     * DOM操作回调，下部分搜索按钮点击事件
     * @param {object} event 事件对象
     */
    handleSearchDownClick:function (event) {
        let column_names = $('#column_names').val();
        if(!column_names || column_names.length < 1){
            toastr.warning("请选择列名！");
            return;
        }
        DataQueryExportAction.searchDeviceNoData();
        //DataQueryExportStore.trigger("showGpsTable");
    },
    /**
     * DOM操作回调，下部分重置按钮点击事件
     * @param {object} event 事件对象
     */
    handleResetDownClick:function (event) {
        $('select#time_type').prop('selectedIndex', 0);
        $('#column_names').selectpicker('deselectAll');
        $("input#org_names").val("").attr("title","");
        $("input#org_ids").val("");
        BootstrapTree.setAllNodeUnCheck("org_tree");
    },
    /**
     * DOM操作回调，下部分导出按钮点击事件
     * @param {object} event 事件对象
     */
    handleExportDownClick:function (event) {
        let column_names = $('#column_names').val();
        if(!column_names || column_names.length < 1){
            toastr.warning("请选择列名！");
            return;
        }

        var org_ids = [];
        if(!!$('#org_tree').treeview(true).getChecked){
            org_ids  = BootstrapTree.getChecked("org_tree",true);
        }
        // var tableData = $("#data_query_export_table").bootstrapTable('getData');
        // if(tableData.length <= 0){
        //     toastr.warning("没有数据，无法完成导出！");
        //     return;
        // }
        var col = DataQueryExportStore.getGpsColumns();
        var param = {
            type:$('select#time_type').val(),
            org_str:org_ids.join(","),
            col:col,
        };
        DataQueryExportAction.deviceNoDateExport(param);
    },
    renderSelect:function(){
        $('#col_names').selectpicker({
            actionsBox: true,
            deselectAllText:'取消全选',
            selectAllText:'全选',
            showTick:true,
            liveSearch: true,
            width:'200px',
            size: 10
        });
        let params = {};
        params.table_name = $("select#table_name").val();
        Urls.get(Urls.queryTableColumn,params,function(result){
            if(result.length > 0){
                var optionsHtml = "";
                result.forEach(function(col_name){
                    optionsHtml += "<option value='"+col_name.value+"'>"+col_name.text+"</option>";
                });
                $('#col_names').empty();
                $('#col_names').append(optionsHtml);
                $('#col_names').selectpicker('render');
                $('#col_names').selectpicker('refresh');
            }
        });
    },
    renderSelectColumn:function(){
        $('#column_names').selectpicker({
            actionsBox: true,
            deselectAllText:'取消全选',
            selectAllText:'全选',
            showTick:true,
            liveSearch: true,
            width:'200px',
            size: 10
        });
        let params = {table_name:"yx_gps_current"};
        Urls.get(Urls.queryTableColumn,params,function(result){
            if(result.length > 0){
                var optionsHtml = "";
                optionsHtml += "<option value='yo.name'>机构名称</option>";
                optionsHtml += "<option value='yc.car_no'>车牌号</option>";
                optionsHtml += "<option value='yd.sim'>sim卡号</option>";
                result.forEach(function(col_name){
                    if(col_name.value == "device"){
                        optionsHtml += "<option value='"+"yd."+col_name.value+"'>"+col_name.text+"</option>";
                    }else if (col_name.value == "text"){
                        optionsHtml += "<option value='"+"ydi."+col_name.value+"'>"+col_name.text+"</option>";
                    } else{
                        optionsHtml += "<option value='"+"ygs."+col_name.value+"'>"+col_name.text+"</option>";
                    }
                });
                $('#column_names').empty();
                $('#column_names').append(optionsHtml);
                $('#column_names').selectpicker('render');
                $('#column_names').selectpicker('refresh');
            }
        });
    },
    renderTree:function(){
        $("#org_tree").css({
            top:$("#org_names").position().top + 30,
            left:$("#org_names").position().left
        });
        Urls.get(Urls.loadorgtree,{},function(data){
            BootstrapTree.initTree("org_tree",data,"org_names","org_ids",null,true,null,true);
        });
    },
    render: function () {
        return (
            <div className="search-box">
                <label htmlFor="device_no">设备编号：</label>
                <input type="text" id="device_no" placeholder="请输入设备编号"></input>
                <label htmlFor="table_name">表名：</label>
                <select id="table_name" name="table_name">
                    <option value="yx_gps">gps历史数据表</option>
                    <option value="yx_gps_current">gps实时数据表</option>
                    <option value="yx_car_notice">驾驶行为(点)数据表</option>
                    <option value="yx_behavior">驾驶行为(段)数据表</option>
                </select>

                <span className="tree-spanBox" style={{width:"249px"}}>
                    <label htmlFor="col_names">列名：</label>
                    <select id="col_names" className="selectpicker tree-divCon tree-divCon2" multiple></select>
                </span>

                <label htmlFor="start_date">发送时间：</label>
                <input type="text" id="start_date" name="start_date" placeholder="开始日期" className="date-icon" style={{width:"175px"}} readOnly/>至&nbsp;&nbsp;<input type="text" id="end_date" name="end_date" placeholder="结束日期" className="date-icon" style={{width:"175px"}} readOnly/>
                <button className="btn-search" onClick={this.handleSearchUpClick}>搜索</button>
                <button className="btn-reset" onClick={this.handleResetUpClick}>重置</button>

                <div style={{marginTop:"12px"}}>
                    <label htmlFor="time_type">时间区间：</label>
                    <select id="time_type" name="time_type">
                        <option value="3">3至7天</option>
                        <option value="7">大于7天</option>
                        <option value="1">一直没有数据</option>
                    </select>
                    <span className="tree-spanBox" style={{width:"249px"}}>
                        <label htmlFor="column_names">列名：</label>
                        <select id="column_names" className="selectpicker tree-divCon tree-divCon2" multiple></select>
                    </span>
                    <span className="tree-spanBox">
                        <div id="org_tree_box">
                            <input type="text" id="org_names" name="org_names" placeholder="没有选中任何机构" style={{width:"227px"}} readOnly/>
                            <input type="hidden" id="org_ids" name="org_ids"></input>
                            <div id="org_tree" className="openTree-menu" style={{width: "227px",maxHeight: "270px"}}></div>
                        </div>
                    </span>
                    <button className="btn-search" onClick={this.handleSearchDownClick}>搜索</button>
                    <button className="btn-reset" onClick={this.handleResetDownClick}>重置</button>
                    <button className="export-data" onClick={this.handleExportDownClick} style={{float:"none"}}>导出数据</button>
                </div>
            </div>
        )
    }
});

export default DataQueryExportSearch;