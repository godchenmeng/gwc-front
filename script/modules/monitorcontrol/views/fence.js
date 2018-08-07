/**
 * @file 越界查询 Reflux View
 * @author CM 2017.08.23
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共方法加载
import CommonAction from '../../common/actions/commonAction';
import FenceAction from '../actions/fenceAction';
import FenceStore from '../stores/fenceStore';
import CommonStore from "../../common/stores/commonStore";

//模块加载
import FenceSearch from 'fenceSearch';
import TreeComponent from 'treeComponent';
import MapComponent from 'mapComponent';
import TableComponent from 'tableComponent';

var Fence = React.createClass({
    getInitialState: function() {
        return {
            mapName:'fence_map',
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
                title:'触发时间',
                align:'center',
                valign:'middle'
            },{
                field:'address',
                title:'触发位置',
                align:'center',
                valign:'middle'
            },{
                field:'rule',
                title:'触发规则',
                align:'center',
                valign:'middle',
            }],
        }
    },
    componentDidMount: function () {
        FenceAction.setfencetab(false);//设置当前TAB
        FenceAction.setcartree('fence_car_tree');
        CommonStore.listen(this.onCommonTrigger);
    },
    componentWillUnmount:function () {
    },
    onCommonTrigger:function (type,result) {
        switch (type){
            case 'loadedmap':
                if(result == this.state.mapName){
                    mapControl.initDrawingManager(FenceAction);
                }
                break;
        }
    },
    /**
     * DOM操作回调，查询按钮点击事件
     * @param {object} event 事件对象
     */
    handleSearchClick:function (event) {
        FenceAction.getfence(this.state.columns, this.state);
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
        $("#fence_map").removeClass("r-shortA");
        $("#fence_car_tree").removeClass("l-shortA");
        $("#outputFence").addClass("hidden");
        FenceAction.clearmap();
    },
    render: function() {
        return (
            <div className= 'right_col'>
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />监控管理 > 越界查询 </div>
                    <div className="title_right">
                        <ul id="myTab1" className="Mon-tab">
                            <li className="active" id="home-tabb">越界查询</li>
                            <li className="" id="profile-tabb" onClick={() => {window.location.href='monitor.html?act=FenceSet'}}>越界设置</li>
                        </ul>
                    </div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="Monitor-left-box">
                        <FenceSearch />
                        <TreeComponent treeName={"fence_car_tree"} />
                        <div className="mart12" style={{textAlign:"center"}}>
                            <button type="button" className="btnOne btn-query" onClick={this.handleSearchClick}><i className="icon-bg query-icon"></i>查询</button>
                            {/*<button type="button" id="outputFence" className="btnOne btn-export1 hidden" onClick={this.handleExportClick}><i className="icon-bg export1-icon"></i>导出</button>*/}
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
                    <TableComponent tableName={"fence_table"} />
                </div>
            </div>
        )
    }
});

export default Fence;
