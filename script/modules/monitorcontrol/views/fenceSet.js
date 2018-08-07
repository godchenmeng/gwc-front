
/**
 * @file 越界设置 Reflux View
 * @author CM 2017.09.08
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

var FenceSet = React.createClass({
    getInitialState: function() {
        return {
            columns:[{
                field:'fence_name',
                title:'规则名称',
                align:'center',
                valign:'middle',
                width:'20%',
            },{
                field:'fence_type',
                title:'触发规则',
                align:'center',
                valign:'middle',
                width:'20%',
                formatter : function (value,row,index){
                    switch(value){
                        case 1:
                            return "驶入触发";
                            break;
                        case 2:
                            return "驶出触发";
                            break;
                        case 3:
                            return "驶出或驶入触发";
                            break;
                    }
                }
            },{
                field:'fence_relation_car_ids',
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
                            if(FenceStore.data.treecars[carIds[i]]){
                                carsStr += FenceStore.data.treecars[carIds[i]].car_no;
                            }else{
                                carsStr += "车辆已被移除";
                            }
                        }else{
                            if(FenceStore.data.treecars[carIds[i]]) {
                                carsStr += FenceStore.data.treecars[carIds[i]].car_no + ',';
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
                        FenceAction.fenceswitch(e.target.checked,row.id);
                    },
                    'click #isDelete': function(e, value, row, index) {
                        CommonStore.trigger("showModal",{msg:"您确认要删除这条规则吗？",btnclShow:true,callback:function(){
                            FenceAction.deletefence(row.id);
                        }});
                    }
                },
                formatter : function (value,row,index){
                    let opHTML = '<div class="action-icon1">';
                    if(CommonStore.verifyPermission('bars/open') && CommonStore.verifyPermission('bars/close')){
                        if(row.fence_status == 1){
                            opHTML += '<label><input class="mui-switch mui-switch-anim" id="isOpen" type="checkbox" checked></label>';
                        }else{
                            opHTML += '</label><input class="mui-switch mui-switch-anim" id="isOpen" type="checkbox"></label>';
                        }
                    }
                    if(CommonStore.verifyPermission('bars/delete')) opHTML += '&nbsp;&nbsp;<a class="delete" id="isDelete" title="删除"></a>';
                    opHTML += '</div>';
                    return opHTML;
                }
            }],
        }
    },
    componentDidMount: function () {
        $("#fenceSet_map").addClass("r-shortA");
        $("#fence_car_tree").addClass("l-shortA");
        FenceAction.setfencetab(true);//设置当前TAB
        FenceAction.setcartree('fence_car_tree');
        CommonStore.listen(this.onCommonTrigger);
        FenceStore.listen(this.onChangeSuccess);

    },
    componentWillUnmount:function () {
    },
    onCommonTrigger:function (type,result) {
        switch (type){
            case 'loadedmap':
                mapControl.initDrawingManager(FenceAction);
                break;
        }
    },
    /**
     * DOM操作回调，查询按钮点击事件
     * @param {object} event 事件对象
     */
    handleSaveClick:function (event) {
        FenceAction.savefenceset();
    },
    /**
     * 设置绘制模式
     * @param mode 绘制模式
     * @param event
     */
    handleDrawMode:function (mode, event) {
        CommonStore.trigger("showModal",{msg:"此操作将会清空已有绘图，是否继续？",btnclShow:true,callback:function(){
            FenceAction.clearmap();
            mapControl.setDrawingMode(mode);
        }});
    },
    handleClearDraw:function (event) {
        FenceAction.clearmap();
        FenceStore.data.modifyFenceId = 0;
        $("#ruleName").val('');
        $("#selCondition").val(0);
        treeControl.setAllNodeUnCheck('fence_car_tree');
    },
    onChangeSuccess:function (type) {
      if(type == 'fencesetsuccess'){
          this.handleClearDraw(null);
      }else if(type == 'loadedtree'){
          treeControl.setAllNodeUnCheck('fence_car_tree');
          FenceAction.getfenceset(this.state.columns);
          let carNo = this.props.param ? Commfun.getSplitParam(this.props.param,'car_no') : '';
          if(carNo){
              treeControl.setNodeCheckByCarNo('fence_car_tree',carNo);
          }
      }
    },
    render: function() {
        return (
            <div className='right_col'>
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />监控管理 > 越界设置 </div>
                    <div className="title_right">
                        <ul id="myTab1" className="Mon-tab">
                            <li className="" id="home-tabb" onClick={() => {window.location.href='monitor.html?act=Fence'}}>越界查询</li>
                            <li className="active" id="profile-tabb">越界设置</li>
                        </ul>
                    </div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="Monitor-left-box">
                        <div className="Monitor-left">
                            <div className="state-box mart5">
                                <input type="text" placeholder="规则名称" className="input-date ml-10" style={{width:"88%"}} id="ruleName" />
                                <select className="input-car" id="selCondition">
                                    <option value="0">选择触发条件</option>
                                    <option value="1">驶入触发</option>
                                    <option value="2">驶出触发</option>
                                    <option value="3">驶入驶出触发</option>
                                </select>
                            </div>
                        </div>
                        <TreeComponent treeName={"fence_car_tree"} />
                        <div className="mart12" style={{textAlign:"center"}}>
                            <button type="button" className={(CommonStore.verifyPermission('bars/add') && CommonStore.verifyPermission('bars/update'))?"btnOne btn-query":"hide"} onClick={this.handleSaveClick}><i className="icon-bg save-icon"></i>保存</button>
                        </div>
                    </div>
                    <div className="Monitor-right" >
                        <MapComponent mapName={"fenceSet_map"} />
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
                    <TableComponent tableName={"fence_set_table"} />
                </div>
            </div>

        )
    }
});

export default FenceSet;
