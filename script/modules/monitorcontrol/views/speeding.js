/**
 * @file 超速查询 Reflux View
 * @author CM 2017.09.18
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共方法加载
import CommonAction from '../../common/actions/commonAction';
import SpeedingAction from '../actions/speedingAction';
import SpeedingStore from '../stores/speedingStore';
import CommonStore from "../../common/stores/commonStore";

//模块加载
import SpeedingSearch from 'speedingSearch';
import TreeComponent from 'treeComponent';
import MapComponent from 'mapComponent';
import TableComponent from 'tableComponent';

var Speeding = React.createClass({
    getInitialState: function() {
        return {
            mapName:'speeding_map',
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
                field:'datetime',
                title:'超速时间',
                align:'center',
                valign:'middle'
            },{
                field:'lasttime',
                title:'持续时长',
                align:'center',
                valign:'middle'
            },{
                field:'address',
                title:'超速位置',
                align:'center',
                valign:'middle'
            },{
                field:'maxspeed',
                title:'最高速度(Km/h)',
                align:'center',
                valign:'middle',
            }],
        }
    },
    componentDidMount: function () {
        SpeedingAction.setspeedingtab(false);//设置当前TAB
        SpeedingAction.setcartree('speeding_car_tree');
        CommonStore.listen(this.onCommonTrigger);
        SpeedingAction.clearmap();
    },
    componentWillUnmount:function () {
    },
    onCommonTrigger:function (type,result) {
        switch (type){
            case 'loadedmap':
                if(result == this.state.mapName){
                    mapControl.initDrawingManager(SpeedingAction);
                }
                break;
        }
    },
    /**
     * DOM操作回调，查询按钮点击事件
     * @param {object} event 事件对象
     */
    handleSearchClick:function (event) {
        SpeedingAction.getspeeding(this.state.columns);
    },
    /**
     * 设置绘制模式
     * @param mode 绘制模式
     * @param event
     */
    handleDrawMode:function (mode, event) {
        let that = this;
        CommonStore.trigger("showModal",{msg:"此操作将会清空已有绘图，是否继续？",btnclShow:true,callback:function(){
            that.handleClearDraw(null);
            mapControl.setDrawingMode(mode);
        }});
    },
    handleClearDraw:function (event) {
        $("#speeding_map").removeClass("r-shortA");
        $("#speeding_car_tree").removeClass("l-shortA");
        $("#outputSpeeding").addClass("hidden");
        SpeedingAction.clearmap();
    },
    render: function() {
        return (
            <div className= 'right_col'>
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />监控管理 > 超速查询 </div>
                    <div className="title_right">
                        <ul id="myTab1" className="Mon-tab">
                            <li className="active" id="home-tabb">超速查询</li>
                            <li className="" id="profile-tabb" onClick={() => {window.location.href='monitor.html?act=SpeedingSet'}}>超速设置</li>
                        </ul>
                    </div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="Monitor-left-box">
                        <SpeedingSearch />
                        <TreeComponent treeName={"speeding_car_tree"} />
                        <div className="mart12" style={{textAlign:"center"}}>
                            <button type="button" className="btnOne btn-query" onClick={this.handleSearchClick}><i className="icon-bg query-icon"></i>查询</button>
                            {/*<button type="button" id="outputSpeeding" className="btnOne btn-export1 hidden" onClick={this.handleExportClick}><i className="icon-bg export1-icon"></i>导出</button>*/}
                        </div>
                    </div>
                    <div className="Monitor-right" >
                        <MapComponent  mapName={this.state.mapName}/>
                        <ul className="layerbox_item" style={{top:"145px",right:"25px"}}>
                            <li className="mapDraw">
                                <ul className="block shadow an-first">
                                    <span className="right-Arrow"></span>
                                    <li className="li01" onClick={this.handleDrawMode.bind(null,1)}>多边行</li>
                                    <li className="li02" onClick={this.handleDrawMode.bind(null,2)}>线</li>
                                </ul>
                            </li>
                            <li className="mapDelete" onClick={this.handleClearDraw}></li>
                        </ul>
                    </div>
                    <div style={{height:"10px"}}></div>
                    <TableComponent tableName={"speeding_table"} />
                </div>
            </div>
        )
    }
});

export default Speeding;
