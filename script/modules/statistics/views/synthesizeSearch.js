/**
 * @file 综合统计-搜索框 Reflux View
 * @author Banji 2017.08.30
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import SynthesizeAction from '../actions/synthesizeAction';
import SynthesizeStore from '../stores/synthesizeStore';

import DateTimePicker from '../../../common/datetimepicker';
import BootstrapTree from '../../../common/bootstrapTree';
import Urls from '../../../common/urls';
import CommonFun from '../../../common/commonfun';


var SynthesizeSearch = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        let that = this;
        DateTimePicker.init("input[name='start_date']");
        DateTimePicker.init("input[name='end_date']");
        that.renderTree();
        that.renderSelect();
        DateTimePicker.setDate("input[name='start_date']",SynthesizeStore.data.listWeek[0]);
        DateTimePicker.setDate("input[name='end_date']",SynthesizeStore.data.listWeek[6]);
        $("input[name='start_date']").on('changeDate', function() {
            that.handleChangeDate("start");
        });
        $("input[name='end_date']").on('changeDate', function() {
            that.handleChangeDate("end");
        });
    },
    handleChangeShowType: function (event) {
        if(!this.dateSelectCheck()) return;
        $(".search-box  a[data-type]").removeClass("active");
        $(event.target).addClass("active");
        var show_type = $(event.target).data("type");
        switch(show_type){
            case "time":
                $('#org_tree').parent().show();
                $('#org_tree').parent().next().show();
                $('.selectpicker').selectpicker('show');
                SynthesizeStore.trigger("showTableByTime");
                break;
            case "org":
                $('#org_tree').parent().show();
                $('#org_tree').parent().next().hide();
                $('.selectpicker').selectpicker('hide');
                SynthesizeStore.trigger("showTableByOrg");
                break;
            case "car":
                $('#org_tree').parent().hide();
                $('#org_tree').parent().next().show();
                $('.selectpicker').selectpicker('show');
                SynthesizeStore.trigger("showTableByCar");
                break;
        }
    },
    handleChangeDate:function(change_type){
        //var start_date = $("input[name='start_date']").datetimepicker('getFormattedDate');
        var start_date = $("input[name='start_date']").datetimepicker('getDate');
        var end_date = $("input[name='end_date']").datetimepicker('getDate');
        if(change_type == "start"){
            SynthesizeStore.data.listDate = CommonFun.getDateArray("listDate",end_date,start_date);
        }else if(change_type == "end"){
            SynthesizeStore.data.listDate = CommonFun.getDateArray("listDate",end_date,start_date);
            SynthesizeStore.data.listWeek = CommonFun.getDateArray("listWeek",end_date);
            SynthesizeStore.data.listMonth = CommonFun.getDateArray("listMonth",end_date);
        }
        SynthesizeStore.data.isChangeDate = true;
    },
    /**
     * DOM操作回调，搜索按钮点击事件
     * @param {object} event 事件对象
     */
    handleSearchClick:function (event) {
        if(!this.dateSelectCheck()) return;
        $(".data-li a[data-type]").removeClass("active");
        SynthesizeAction.search();
        SynthesizeStore.trigger("showSynthesizeChart");
    },
    handleResetClick:function (event) {
        $(".search-box  a[data-type]").removeClass("active");
        $(".search-box  a[data-type='time']").addClass("active");
        $('#org_tree').parent().show();
        $('#org_tree').parent().next().show();
        $('.selectpicker').selectpicker('show');
        $("input#org_names").val("").attr("title","");
        $("input#org_ids").val("");
        BootstrapTree.setAllNodeUnCheck("org_tree");
        $('.selectpicker').selectpicker('deselectAll');
        SynthesizeStore.data.listWeek = CommonFun.getDateArray("listWeek");
        DateTimePicker.setDate("input[name='start_date']",SynthesizeStore.data.listWeek[0]);
        DateTimePicker.setDate("input[name='end_date']",SynthesizeStore.data.listWeek[6]);
    },
    /**
     * DOM操作回调，导出按钮点击事件
     * @param {object} event 事件对象
     */
    handleExportClick:function (event) {
        var tableData = $("#synthesize_table").bootstrapTable('getData') || [];
        if(tableData.length <= 0){
            toastr.warning("没有数据，无法完成导出！");
            return;
        }
        var param = SynthesizeStore.getQueryParams();
        SynthesizeAction.export(param);
        SynthesizeStore.trigger("showSynthesizeChart");
    },
    dateSelectCheck: function(){
        var start_date = $("input[name='start_date']").datetimepicker('getUTCDate');
        var end_date = $("input[name='end_date']").datetimepicker('getUTCDate');
        if(start_date && end_date){
            if(start_date.getTime() > end_date.getTime()) {
                toastr.error("开始日期不能大于结束日期！");
                return false;
            }
            if(end_date.getTime() - start_date.getTime() > 31*24*60*60*1000){
                toastr.error("日期跨度不能超过31天！");
                return false;
            }
        }else{
            toastr.error("请选择查询日期期间！");
            return false;
        }
        return true;
    },
    renderTree:function(){
        $("#org_tree").css({
            top:$("#org_names").position().top + 30,
            left:$("#org_names").position().left
        });
        Urls.get(Urls.loadorgtree,{},function(data){
            BootstrapTree.initTree("org_tree",data,"org_names","org_ids",null,true,null,true);
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
        //$('.selectpicker').selectpicker('hide');//初始默认隐藏车辆选择控件
    },
    render: function () {
        return (
            <div className="search-box">
                <a className="active" data-type="time" onClick={this.handleChangeShowType}>按时间查看</a>
                <a data-type="org" onClick={this.handleChangeShowType}>按部门查看</a>
                <a data-type="car" onClick={this.handleChangeShowType}>按车辆查看</a>
                <span className="tree-spanBox" style={{width: '208px'}}>
                    <input type="text" id="org_names" name="org_names" placeholder="没有选中任何机构" style={{width:"200px"}} readOnly/>
                    <input type="hidden" id="org_ids" name="org_ids"></input>
                    <div id="org_tree"style={{position: "absolute", zIndex: "999", width: "200px",maxHeight: "270px", overflow: "scroll",background:"#fff",border: "1px solid #dbd9d9",borderRadius:"5px",display:"none"}}></div>
                </span>
                <span className="tree-spanBox" style={{width: '208px'}}>
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

export default SynthesizeSearch;