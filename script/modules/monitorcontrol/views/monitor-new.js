/**
 * @file 实时监控 Reflux View
 * @author CM 2017.07.21
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共方法加载
import MonitorNewAction from "../actions/monitorNewAction";
import MonitorNewStore from "../stores/monitorNewStore";
import CommonStore from "../../common/stores/commonStore";
import CommonAction from "../../common/actions/commonAction";
import Urls from '../../../common/urls';

//模块加载
import MonitorNewSearch from 'monitorSearch-new';
import TreeComponent from 'treeComponent';
import MapComponent from 'mapComponent';
import MileageModal from 'mileageModal';


var MonitorNew = React.createClass({
    getInitialState: function() {
        return {
            gpsTimer:undefined,
            mapName:'monitor_map',
        }
    },
    componentDidMount: function () {
        CommonStore.listen(this.onCommonTrigger);
        CommonAction.loadDeviceCarType({});
    },
    componentWillUnmount:function () {
        clearInterval(this.state.gpsTimer);
        MonitorNewStore.data.isFirstimeLoadMarkers = true;
    },
    onCommonTrigger:function (type,result) {
        switch (type){
            case 'loadedmap':
                if(result == this.state.mapName){
                    this.initOrgCarData();
                    MonitorNewAction.linkwebsocket();
                    this.setState({
                        gpsTimer:setInterval(() => {this.setIntervalMethod();},5000),
                    });
                }
                break;
        }
    },
    setIntervalMethod:function () {
        MonitorNewAction.setcargps();
        // MonitorNewAction.getcarstatus();
    },
    /**
     * 加载实时监控模块树
     *
     */
    initOrgCarData: function () {
        MonitorNewAction.setcartree('monitor_org_tree');
    },
    render: function() {
        return (
            <div className='right_col visible'>
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />监控管理 > 实时监控 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="Monitor-left-box">
                        <MonitorNewSearch />
                        <TreeComponent />
                    </div>
                    <div className="Monitor-right" >
                        <MapComponent  mapName={this.state.mapName}/>
                    </div>
                </div>
                <MileageModal />
            </div>

        )
    }
});

export default MonitorNew;
