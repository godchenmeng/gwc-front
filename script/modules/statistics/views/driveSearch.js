/**
 * @file 驾驶统计-搜索框 Reflux View
 * @author Banji 2017.09.07
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import DriveAction from '../actions/driveAction'
import DriveStore from '../stores/driveStore'

import DateTimePicker from '../../../common/datetimepicker'
import BootstrapTree from '../../../common/bootstrapTree'
import Urls from '../../../common/urls'
import CommonFun from '../../../common/commonfun'


var DriveSearch = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        //DateTimePicker.init("input[name='start_date']");
        let that = this;
        DateTimePicker.init("input[name='end_date']");
        that.renderTree();
        that.renderSelect();
        $("input[name='start_date']").val(DriveStore.data.listWeek[0]);
        DateTimePicker.setDate("input[name='end_date']",DriveStore.data.listWeek[6]);
        $("input[name='end_date']").on('changeDate', function() {
            that.handleChangeDate();
        });
    },
    handleChangeShowType: function (event) {
        $(".search-box  a[data-type]").removeClass("active");
        $(event.target).addClass("active");
        var show_type = $(event.target).data("type");
        switch(show_type){
            case "org":
                $('.selectpicker').selectpicker('hide');
                $('#org_tree_box').show();
                DriveStore.trigger("showTableByOrg");
                break;
            case "car":
                $('.selectpicker').selectpicker('show');
                $('#org_tree_box').hide();
                DriveStore.trigger("showTableByCar");
                break;
        }
    },
    handleChangeDate:function(){
        //var start_date = $("input[name='start_date']").datetimepicker('getFormattedDate');
        var end_date = $("input[name='end_date']").datetimepicker('getDate');
        DriveStore.data.listWeek = CommonFun.getDateArray("listWeek",end_date);
        DriveStore.data.listMonth = CommonFun.getDateArray("listMonth",end_date);
        $("input[name='start_date']").val(DriveStore.data.listWeek[0]);
        DriveStore.data.isChangeDate = true;
    },
    /**
     * DOM操作回调，搜索按钮点击事件
     * @param {object} event 事件对象
     */
    handleSearchClick:function (event) {
        $(".data-li a[data-type]").removeClass("active");
        $(".data-li a[data-type]:first").addClass("active");
        if(DriveStore.data.isChangeDate){
            var show_type = $(".search-box a.active[data-type]").data("type");
            switch(show_type){
                case "org":
                    DriveStore.trigger("showTableByOrg");
                    DriveStore.data.isChangeDate = false;
                    break;
                case "car":
                    DriveAction.search();
                    break;
                default:
                    DriveAction.search();
                    break;
            }
        }else{
            DriveAction.search();
        }
    },
    handleResetClick:function (event) {
        $(".search-box  a[data-type]").removeClass("active");
        $(".search-box  a[data-type='org']").addClass("active");
        $('#org_tree_box').show();
        $("input#org_names").val("").attr("title","");
        $("input#org_ids").val("");
        BootstrapTree.setAllNodeUnCheck("org_tree");
        $('.selectpicker').selectpicker('hide');
        $('.selectpicker').selectpicker('deselectAll');
        DriveStore.data.listWeek = CommonFun.getDateArray("listWeek");
        DateTimePicker.setDate("input[name='start_date']",DriveStore.data.listWeek[0]);
        DateTimePicker.setDate("input[name='end_date']",DriveStore.data.listWeek[6]);
    },
    /**
     * DOM操作回调，导出按钮点击事件
     * @param {object} event 事件对象
     */
    handleExportClick:function (event) {
        var tableData = $("#drive_table").bootstrapTable('getData');
        if(tableData.length <= 0){
            toastr.warning("没有数据，无法完成导出！");
            return;
        }
        var show_type = $('.search-box a.active[data-type]').data("type");
        var param;
        if(show_type == "org"){
            var org_ids = BootstrapTree.getChecked("org_tree",true);
            param = {
                show_type:show_type,
                org_ids:org_ids,
                start_time : $("input[name='start_date']").val(),
                end_time : $("input[name='end_date']").val()
            }
        }else if(show_type == "car"){
            var car_ids = $('.selectpicker').val();
            param = {
                show_type:show_type,
                car_ids:car_ids,
                start_time : $("input[name='start_date']").val(),
                end_time : $("input[name='end_date']").val()
            }
        }
        DriveAction.export(param);
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
    renderSelect:function(){
        $('.selectpicker').selectpicker({
            actionsBox: true,
            deselectAllText:'取消全选',
            selectAllText:'全选',
            showTick:true,
            liveSearch: true,
            width:'200px',
            size: 10
        });
        Urls.get(Urls.queryCars,{},function(result){
            if(result.length > 0){
                var optionsHtml = "";
                result.forEach(function(car){
                    optionsHtml += "<option value='"+car.id+"'>"+car.car_no+"</option>";
                });
                $('.selectpicker').empty();
                $('.selectpicker').append(optionsHtml);
                $('.selectpicker').selectpicker('render');
                $('.selectpicker').selectpicker('refresh');
            }
        });
        $('.selectpicker').selectpicker('hide');//初始默认隐藏车辆选择控件
    },
    render: function () {
        return (
            <div className="search-box">
                <a className="active" data-type="org" onClick={this.handleChangeShowType}>按部门查看</a>
                <a data-type="car" onClick={this.handleChangeShowType}>按车辆查看</a>
                <span className="tree-spanBox">
                    <div id="org_tree_box">
                        <input type="text" id="org_names" name="org_names" placeholder="没有选中任何机构" style={{width:"227px"}} readOnly/>
                        <input type="hidden" id="org_ids" name="org_ids"></input>
                        <div id="org_tree"style={{position: "absolute", zIndex: "999", width: "227px",maxHeight: "270px", overflow: "scroll",background:"#fff",border: "1px solid #dbd9d9",borderRadius:"5px",display:"none"}}></div>
                    </div>
                    <select className="selectpicker tree-divCon" multiple></select>
                </span>
                <input type="text" name="start_date" placeholder="开始日期" className="date-icon" readOnly/>至&nbsp;&nbsp;<input type="text" name="end_date" placeholder="结束日期" className="date-icon"/>
                <button className="btn-search" onClick={this.handleSearchClick}>搜索</button>
                <button className="btn-reset" onClick={this.handleResetClick}>重置</button>
                <button className="export-data" onClick={this.handleExportClick}>导出数据</button>
            </div>
        )
    }
});

export default DriveSearch;