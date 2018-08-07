/**
 * @file 定位查询 Reflux View
 * @author CM 2017.08.02
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共方法加载
import LocateAction from "../actions/locateAction";
import LocateStore from "../stores/locateStore";
import CommonStore from "../../common/stores/commonStore";

//模块加载
import LocateState from 'locateState';
import TreeComponent from 'treeComponent';
import MapComponent from 'mapComponent';
import TableComponent from 'tableComponent';
import MileageModal from 'mileageModal';

var Locate = React.createClass({
    getInitialState: function() {
        return {
            mapName:'locate_map',
            modName:'locate_mileage_modal',
            gpsTimer:0,
            isLoadTable: false,
            columns:[{
                field:'org',
                title:'部门',
                align:'center',
                valign:'middle'
            },{
                field:'car_no',
                title:'车牌号',
                align:'center',
                valign:'middle'
            },{
                field:'type_name',
                title:'类型',
                align:'center',
                valign:'middle'
            },{
                field:'address',
                title:'位置',
                align:'center',
                valign:'middle'
            },{
                field:'alm_id',
                title:'ACC状态',
                align:'center',
                valign:'middle',
                formatter : function (value,row,index){
                    switch(value){
                        case "0001":
                            return "<span class=\"green1\">点火</span>";
                            break;
                        case "0002":
                            return "<span class=\"red\">熄火</span>";
                            break;
                    }
                }
            },{
                field:'acc',
                title:'当前状态',
                align:'center',
                valign:'middle',
                formatter : function (value,row,index){
                    switch(value){
                        case "0":
                            return "<span class=\"red\">离线</span>";
                            break;
                        case "1":
                            return "<span class=\"green1\">运动</span>";
                            break;
                        case "2":
                            return "<span class=\"red\">静止</span>";
                            break;
                    }
                }
            },{
                field:'senddate',
                title:'通讯时间',
                align:'center',
                valign:'middle'
            }],
        }
    },
    componentDidMount: function () {
        CommonStore.listen(this.onCommonTrigger);
    },
    componentWillUnmount:function () {
        clearInterval(this.state.gpsTimer);
        LocateStore.data.isFirstimeLoadMarkers = true;
    },
    onCommonTrigger:function (type,result) {
        switch (type){
            case 'loadedmap':
                if(result == this.state.mapName) {
                    this.initOrgCarData();
                    this.setState({
                        gpsTimer: setInterval(() => {
                            this.setIntervalMethod();
                        }, 18000),
                    });
                }
                break;
        }
    },
    setIntervalMethod:function () {
        LocateAction.setcargps();
        LocateAction.getcarstatus();
    },
    /**
     * 加载实时监控模块树
     *
     */
    initOrgCarData: function () {
        LocateAction.setcartree('monitor_org_tree');
    },
    /**
     * DOM操作回调，查询按钮点击事件
     * @param {object} event 事件对象
     */
    handleSearchClick:function (event) {
        LocateAction.getlocate(this.state.columns, this.state.isLoadTable);
        this.state.isLoadTable = true;
        $("#locate_map").addClass("r-shortA");
        $("#monitor_org_tree").addClass("l-shortA");
        $("#outputLocate").removeClass("hidden");
    },
    handleExportClick:function (event) {
        LocateAction.exportexcel();
    },
    render: function() {
        return (
            <div className= 'right_col'>
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />监控管理 > 定位信息 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="Monitor-left-box">
                        <LocateState />
                        <TreeComponent />
                        <div className="mart12" style={{textAlign:"center"}}>
                            <button type="button" className="btnOne btn-query" onClick={this.handleSearchClick}><i className="icon-bg query-icon"></i>查询</button>
                            <button type="button" id="outputLocate" className="btnOne btn-export1 hidden" onClick={this.handleExportClick}><i className="icon-bg export1-icon"></i>导出</button>
                        </div>
                    </div>
                    <div className="Monitor-right" >
                        <MapComponent mapName={this.state.mapName} />
                    </div>
                    <div style={{height:"10px"}}></div>
                    <TableComponent />
                    <MileageModal modName={this.state.modName}/>
                </div>
            </div>
        )
    }
});

export default Locate;
