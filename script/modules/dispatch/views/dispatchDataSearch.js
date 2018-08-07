/**
 * @file 调度数据-搜索框 Reflux View
 * @author Banji 2017.08.23
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import DispatchDataAction from '../actions/dispatchDataAction';
import DateTimePicker from '../../../common/datetimepicker';

import BootstrapTree from '../../../common/bootstrapTree';
import Urls from '../../../common/urls';
import DispatchDataStore from "../stores/dispatchDataStore";

var DispatchDataSearch = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        DateTimePicker.init("input[name='start_date']");
        DateTimePicker.init("input[name='end_date']");
        this.renderTree();
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
        DispatchDataAction.search();
    },
    handleResetClick:function(event){
        $("input[name='org_name']").val("");
        $("input[name='org_id']").val("");
        $("input[name='start_date']").val("");
        $("input[name='end_date']").val("");
        $("input[name='use_name']").val("");
    },
    /**
     * DOM操作回调，导出按钮点击事件
     * @param {object} event 事件对象
     */
    handleExportClick:function (event) {
        var param = DispatchDataStore.data.dispatchDataSearchParam;
        DispatchDataAction.export(param);
    },
    renderTree:function(){
        $("#org_tree").css({
            top:$("#org_name").position().top + 30,
            left:$("#org_name").position().left
        });
        Urls.get(Urls.loadorgtree,{},function(data){
            BootstrapTree.initTree("org_tree",data,"org_name","org_id");
        });
    },
    render: function () {
        return (
            <div className="search-box">
                <span className="tree-spanBox">
                    <input type="text" id="org_name" name="org_name" placeholder="请选择机构" style={{width:"227px"}} readOnly/>
                    <div id="org_tree"style={{position: "absolute", zIndex: "999", width: "227px",maxHeight: "270px", overflow: "scroll",background:"#fff",border: "1px solid #dbd9d9",borderRadius:"5px",display:"none"}}></div>
                </span>
                <input type="hidden" id="org_id" name="org_id"/>
                <input type="text" name="start_date" placeholder="开始日期" className="date-icon"/>至&nbsp;&nbsp;<input type="text" name="end_date" placeholder="结束日期" className="date-icon"/>
                <input type="text" name="use_name" placeholder="用车人" />
                <button className="btn-search" onClick={this.handleSearchClick}>搜索</button>
                <button className="btn-reset" onClick={this.handleResetClick}>重置</button>
                <button className="export-data" onClick={this.handleExportClick}>导出数据</button>
            </div>
        )
    }
});

export default DispatchDataSearch;