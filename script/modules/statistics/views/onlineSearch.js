/**
 * @file 上线率-搜索框 Reflux View
 * @author Banji 2017.08.24
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import OnlineStore from "../stores/onlineStore"
import OnlineAction from '../actions/onlineAction'

import DateTimePicker from '../../../common/datetimepicker'
import BootstrapTree from '../../../common/bootstrapTree'
import Urls from '../../../common/urls'
import CommonFun from '../../../common/commonfun'

var OnlineSearch = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        let that = this;
        //DateTimePicker.init("input[name='start_date']");
        DateTimePicker.init("input[name='end_date']");
        this.renderTree();
        $("input[name='start_date']").val(OnlineStore.data.listWeek[0]);
        DateTimePicker.setDate("input[name='end_date']",OnlineStore.data.listWeek[6]);
        $("input[name='end_date']").on('changeDate', function() {
            that.handleChangeDate();
        });

    },
    handleChangeDate:function(){
        //var start_date = $("input[name='start_date']").datetimepicker('getFormattedDate');
        var end_date = $("input[name='end_date']").datetimepicker('getDate');
        OnlineStore.data.listWeek = CommonFun.getDateArray("listWeek",end_date);
        $("input[name='start_date']").val(OnlineStore.data.listWeek[0]);
        OnlineStore.data.isChangeDate = true;
    },
    /**
     * DOM操作回调，搜索按钮点击事件
     * @param {object} event 事件对象
     */
    handleSearchClick:function (event) {
        if(OnlineStore.data.isChangeDate){
            OnlineStore.trigger("showTable");
            OnlineStore.data.isChangeDate = false;
        }else{
            OnlineAction.search();
        }
    },
    handleResetClick:function (event) {
        $("input#org_names").val("").attr("title","");
        $("input#org_ids").val("");
        BootstrapTree.setAllNodeUnCheck("org_tree");
        OnlineStore.data.listWeek = CommonFun.getDateArray("listWeek");
        DateTimePicker.setDate("input[name='start_date']",OnlineStore.data.listWeek[0]);
        DateTimePicker.setDate("input[name='end_date']",OnlineStore.data.listWeek[6]);
    },
    /**
     * DOM操作回调，导出按钮点击事件
     * @param {object} event 事件对象
     */
    handleExportClick:function (event) {
        var tableData = $("#online_rate_table").bootstrapTable('getData');
        if(tableData.length <= 0){
            toastr.warning("没有数据，无法完成导出！");
            return;
        }
        var org_ids = BootstrapTree.getChecked("org_tree",true);
        var param = {
            org_ids:org_ids,
            start_time : $("input[name='start_date']").val(),
            end_time : $("input[name='end_date']").val()
        }
        OnlineAction.export(param);
    },
    renderTree:function(){
        $("#org_tree").css({
            top:$("#org_names").position().top + 30,
            left:$("#org_names").position().left
        });
        Urls.get(Urls.loadorgtree,{},function(data){
            BootstrapTree.initTree("org_tree",data,"org_names","org_ids",null,true);
            // setTimeout(function(){
            //     BootstrapTree.setAllNodeCheck("org_tree");
            // });
        });
    },
    render: function () {
        let that = this;
        return (
            <div className="search-box">
                <span className="tree-spanBox">
                    <input type="text" id="org_names" name="org_names" placeholder="没有选中任何机构" style={{width:"227px"}} readOnly/>
                    <input type="hidden" id="org_ids" name="org_ids"></input>
                    <div id="org_tree"style={{position: "absolute", zIndex: "999", width: "227px",maxHeight: "270px", overflow: "scroll",background:"#fff",border: "1px solid #dbd9d9",borderRadius:"5px",display:"none"}}></div>
                </span>
                <input type="text" name="start_date" placeholder="开始日期" className="date-icon"/>至&nbsp;&nbsp;<input type="text" name="end_date" placeholder="结束日期" className="date-icon"/>
                <button className="btn-search" onClick={that.handleSearchClick}>搜索</button>
                <button className="btn-reset" onClick={that.handleResetClick}>重置</button>
                <button className="export-data" onClick={that.handleExportClick}>导出数据</button>
            </div>
        )
    }
});

export default OnlineSearch;