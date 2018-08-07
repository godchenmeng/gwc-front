/**
 * @file 追踪页面 Reflux View
 * @author CM 2017.09.11
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共方法加载
import TraceAction from "../actions/traceAction";
import TraceStore from "../stores/traceStore";
import CommonFun from "../../../common/commonfun";
import CommonStore from "../../common/stores/commonStore";
import CommonAction from "../../common/actions/commonAction";

//模块加载
import MapComponent from 'mapComponent';

var Trace = React.createClass({
    getInitialState: function() {
        return {
            gpsTimer:undefined,
            mapName:'trace_map',
            traceInfo:[],
            scrollTimer:null,
        }
    },
    componentDidMount: function () {
        let that = this;
        $('#loading').modal('show');
        TraceStore.data.monitorcars.push(CommonFun.getQueryString("device"));
        CommonStore.listen(this.onCommonTrigger);
        TraceStore.listen(this.onGetCarTrace);
        this.setState({
            scrollTimer:setInterval(() => {that.setScrollToBottom();},17000)
        });
        CommonAction.loadDeviceCarType({});
    },
    componentWillUnmount:function () {
        clearInterval(this.state.gpsTimer);
    },
    onGetCarTrace: function (type,result) {
        if(type == 'settrackinfobox'){
            this.setState({traceInfo:result});
        }
    },
    onCommonTrigger:function (type,result) {
        switch (type){
            case 'loadedmap':
                if(result == this.state.mapName){
                    TraceAction.loadcartrace();
                    TraceAction.setcargps();
                    this.setState({
                        gpsTimer:setInterval(() => {TraceAction.setcargps();},18000),
                    });
                }
                break;
        }
    },
    setScrollToBottom:function () {
        $('#endMsg').click();
    },
    render: function() {
        let traceInfo = this.state.traceInfo;
        return (
            <div id='trace'>
                <input type='hidden' id='trace_devic' />
                <div className="ZZmap-box">
                    <MapComponent mapName={this.state.mapName} />
                </div>
                <div className="map-table">
                    <div className="table-head">
                        <table cellSpacing={"0"} cellPadding={"0"} width="100%"  className="table-striped tab-border">
                            <tbody>
                            <tr>
                                <th style={{width:"15%",textAlign:"center"}} className="bgWhite">定位时间</th>
                                <th style={{width:"7%",textAlign:"center"}} className="bgWhite">方向</th>
                                <th style={{width:"18%",textAlign:"center"}} className="bgWhite">Acc状态</th>
                                <th style={{width:"24%",textAlign:"center"}} className="bgWhite">地理位置 </th>
                                <th style={{width:"8%",textAlign:"center"}} className="bgWhite">车速 </th>
                                <th style={{width:"8%",textAlign:"center"}} className="bgWhite">三急</th>
                                <th style={{width:"8%",textAlign:"center"}} className="bgWhite">本次里程</th>
                                <th style={{width:"12%",textAlign:"center"}} className="bgWhite">事件</th>
                            </tr>
                            </tbody>
                        </table></div>
                    <div className="table-con" id='tableCon' style={{height:'300px',overflowY:'scroll'}}>
                        <table cellSpacing={"0"} className="table-striped tab-border" style={{borderTop: 'none',width:'100%'}}>
                            <tbody>
                            {
                                traceInfo.map(function(item, key){
                                    return(
                                        <tr style={{background:"#d9edf7"}} key={key}>
                                            <td style={{width:"15%",textAlign:"center"}}>{item.timeText}</td>
                                            <td style={{width:"7%",textAlign:"center"}}>{item.directText}</td>
                                            <td style={{width:"18%",textAlign:"center"}}><span className="red1">{item.accText}</span></td>
                                            <td style={{width:"24%",textAlign:"center"}}>{item.address}</td>
                                            <td style={{width:"8%",textAlign:"center"}} className="green1">{item.speed} Km/h</td>
                                            <td style={{width:"8%",textAlign:"center"}} className="orange">{item.sanJiJiaSu}/{item.sanJiJianSu}/{item.sanJiZhuanWan}</td>
                                            <td style={{width:"8%",textAlign:"center"}}>{item.distanceText}</td>
                                            <td style={{width:"12%",textAlign:"center"}}>{item.eventText}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                        <div><a name="1" href='#1'><span id='endMsg'>&nbsp;</span></a></div>
                    </div>
                </div>
            </div>
        )
    }
});
export default Trace;
