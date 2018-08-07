
/**
 * @file 超速设置 Reflux View
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

var SpeedingSet = React.createClass({
    getInitialState: function() {
        return {
            columns:[{
                field:'speeding_name',
                title:'限速名称',
                align:'center',
                valign:'middle',
                width:'20%',
            },{
                field:'speeding_limit',
                title:'限制速度',
                align:'center',
                valign:'middle',
                width:'20%',

            },{
                field:'speeding_time',
                title:'超速生效所需时长',
                align:'center',
                valign:'middle',
                width:'20%',
                formatter : function (value,row,index){
                    return value?value + 's':'0s';
                }
            },{
                field:'speeding_relation_car_ids',
                title:'对象',
                align:'center',
                valign:'middle',
                width:'50%',
                formatter : function (value,row,index){
                    let carIds = value.split(',');
                    let carsStr = "";
                    let shortCarsStr = "";
                    for(let i = 0; i < carIds.length; i++){
                        if(i == carIds.length - 1){
                            if(SpeedingStore.data.treecars[carIds[i]]){
                                carsStr += SpeedingStore.data.treecars[carIds[i]].car_no;
                            }else{
                                carsStr += "车辆已被移除";
                            }
                        }else{
                            if(SpeedingStore.data.treecars[carIds[i]]) {
                                carsStr += SpeedingStore.data.treecars[carIds[i]].car_no + ',';
                            }else{
                                carsStr += "车辆已被移除" + ',';
                            }
                        }
                    }
                    if(carsStr.length > 80){
                        shortCarsStr = carsStr.substring(0,80) + "...(" + carIds.length + "台)";
                    }else{
                        shortCarsStr = carsStr;
                    }
                    return '<div title="' + carsStr + '">' + shortCarsStr + '</div>';
                }
            },{
                field:'',
                title:'操作',
                align:'center',
                valign:'middle',
                width:'10%',
                events: {
                    'click #isOpen': function(e, value, row, index) {
                        SpeedingAction.speedingswitch(e.target.checked,row.id);
                    },
                    'click #isDelete': function(e, value, row, index) {
                        CommonStore.trigger("showModal",{msg:"您确认要删除这条规则吗？",btnclShow:true,callback:function(){
                            SpeedingAction.deletespeeding(row.id);
                        }});
                    }
                },
                formatter : function (value,row,index){
                    let opHTML = '<div class="action-icon1"><label>';
                    if(row.speeding_status == 1){
                        opHTML += '<input class="mui-switch mui-switch-anim" id="isOpen" type="checkbox" checked>';
                    }else{
                        opHTML += '<input class="mui-switch mui-switch-anim" id="isOpen" type="checkbox">';
                    }
                    opHTML += '</label>&nbsp;&nbsp;<a class="delete" id="isDelete" title="删除"></a></div>';
                    return opHTML;
                }
            }],
        }
    },
    componentDidMount: function () {
        $("#speedingSet_map").addClass("r-shortB");
        $("#speeding_car_tree").addClass("l-shortA");
        SpeedingAction.setspeedingtab(true);//设置当前TAB
        SpeedingAction.setcartree('speeding_car_tree');
        CommonStore.listen(this.onCommonTrigger);
        SpeedingStore.listen(this.onChangeSuccess);
        SpeedingAction.clearmap();
        this.renderSpeedingTimeSlider();
    },
    componentWillUnmount:function () {
    },
    onCommonTrigger:function (type,result) {
        switch (type){
            case 'loadedmap':
                mapControl.initDrawingManager(SpeedingAction);
                break;
        }
    },
    /**
     * DOM操作回调，查询按钮点击事件
     * @param {object} event 事件对象
     */
    handleSaveClick:function (event) {
        SpeedingAction.savespeedingset();
    },
    /**
     * 设置绘制模式
     * @param mode 绘制模式
     * @param event
     */
    handleDrawMode:function (mode, event) {
        CommonStore.trigger("showModal",{msg:"此操作将会清空已有绘图，是否继续？",btnclShow:true,callback:function(){
            SpeedingAction.clearmap();
            mapControl.setDrawingMode(mode);
        }});
    },
    handleClearDraw:function (event) {
        SpeedingAction.clearmap();
        SpeedingStore.data.modifySpeedingId = 0;
        $("#ruleName").val('');
        $("#speedingLimit").val(0);
        $('#ex1Slider').bootstrapSlider('setValue', 0);
        treeControl.setAllNodeUnCheck('speeding_car_tree');
    },
    handleLimitInput:function (event) {
        let val = $('#speedingLimit').val();
        if(isNaN(val)) {
            $('#speedingLimit').val(val.substring(0,val.length - 1));
        }
    },
    onChangeSuccess:function (type) {
        if(type == 'speedingsetsuccess'){
            this.handleClearDraw(null);
        }else if(type == 'loadedtree'){
            treeControl.setAllNodeUnCheck('speeding_car_tree');
            SpeedingAction.getspeedingset(this.state.columns);
            let carNo = this.props.param ? Commfun.getSplitParam(this.props.param,'car_no') : '';
            if(carNo){
                treeControl.setNodeCheckByCarNo('speeding_car_tree',carNo);
            }
        }
    },
    renderSpeedingTimeSlider:function(){
        $('#ex1Slider').bootstrapSlider({
            formatter: function(value) {
                return '时长: ' + value + "s";
            }
        });
    },
    render: function() {
        return (
            <div className='right_col'>
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />监控管理 > 超速设置 </div>
                    <div className="title_right">
                        <ul id="myTab1" className="Mon-tab">
                            <li className="" id="home-tabb" onClick={() => {window.location.href='monitor.html?act=Speeding'}}>超速查询</li>
                            <li className="active" id="profile-tabb">超速设置</li>
                        </ul>
                    </div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="Monitor-left-box">
                        <div className="Monitor-left" style={{overflow:"visible"}}>
                            <div className="state-box mart5">
                                <span className="red ml-10">*</span><input type="text" placeholder="限速名称" className="input-date ml-6 " style={{width:"86%"}} id="ruleName" />
                            </div>
                            <span className="red ml-10">*</span><input type="text" placeholder="请输入限速数值" className="input-data ml-6 mart8 " style={{width:"86%"}} id="speedingLimit" onChange={this.handleLimitInput} maxLength="3" size="150"  />
                            <div className="state-box mart5" style={{marginLeft:"12px"}}>
                                <p>超速生效所需时长/（S）</p>
                                <input id="ex1Slider" data-slider-id="speedingSetSlider" type="text" data-slider-min="0" data-slider-max="300" data-slider-step="15" data-slider-value="0" style={{display:"none"}} />
                            </div>
                        </div>
                        <TreeComponent treeName={"speeding_car_tree"} />
                        <div className="mart12" style={{textAlign:"center"}}>
                            <button type="button" className="btnOne btn-query" onClick={this.handleSaveClick}><i className="icon-bg save-icon"></i>保存</button>
                        </div>
                    </div>
                    <div className="Monitor-right" >
                        <MapComponent mapName={"speedingSet_map"} />
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
                    <TableComponent tableName={"speeding_set_table"} />
                </div>
            </div>

        )
    }
});

export default SpeedingSet;
