/**
 * @file 轨迹搜索框 Reflux View
 * @author CM 2017.08.08
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共方法加载
import TrackStore from '../stores/trackStore';
import TrackAction from '../actions/trackAction';


var TrackTable = React.createClass({
    getInitialState: function() {
        return {
            isShowArrow:false,
            isShowTable:false,
            trackInfo:[],
        }
    },
    componentDidMount: function () {
        TrackStore.listen(this.onGetCarTrack);
    },
    onGetCarTrack: function (type,result) {
        switch (type){
            case 'cartrack':
                this.listenCarTrack(result);
                break;
            case 'settrackinfobox':
                this.setTrackInfobox(result);
                break;
            case 'clearTrack':
                this.listenClearTrack(result);
                break;
        }
    },
    setTrackInfobox:function (result) {
        this.setState({trackInfo:result});
    },
    listenCarTrack:function (result) {
        this.setState({
            isShowArrow:true,
        });
    },
    listenClearTrack:function (result) {
        this.setState({
            isShowArrow:false,
        });
    },
    handleShowTable:function (event) {
        if(this.state.isShowTable){
            this.setState({
                isShowTable:false,
            });
            $("#tableHead").addClass('hide');
            $("#tableBody").addClass('hide');
            $("#arrowICO").attr("src",__uri("/static/images/jt-up.png"));
        }else{
            this.setState({
                isShowTable:true,
            });
            $("#tableHead").removeClass('hide');
            $("#tableBody").removeClass('hide');
            $("#arrowICO").attr("src",__uri("/static/images/jt-down.png"));
        }

    },
    componentWillUnmount:function () {},
    render: function() {
        let that = this;
        let isShowArrow = that.state.isShowArrow;
        let isShowTable = that.state.isShowTable;
        let trackInfo = that.state.trackInfo;
        return (
            <div className="tableOpen-Box">
                <div className={isShowArrow ? "Open-Arrow" : "Open-Arrow hide"} onClick={that.handleShowTable}><img id="arrowICO" src={__uri("/static/images/jt-up.png")} /></div>
                <div id="tableHead" className={isShowTable ? "table-head" : "table-head hide"} style={{overflowY:"hidden"}}>
                    <table className="table-striped tab-border">
                        <tbody>
                            <tr>
                                <th style={{width:"15%",textAlign:"center"}} className="bgWhite">定位时间</th>
                                <th style={{width:"7%",textAlign:"center"}} className="bgWhite">方向</th>
                                <th style={{width:"18%",textAlign:"center"}} className="bgWhite">Acc状态</th>
                                <th style={{width:"24%",textAlign:"center"}} className="bgWhite">GPS位置 </th>
                                <th style={{width:"8%",textAlign:"center"}} className="bgWhite">车速 </th>
                                <th style={{width:"8%",textAlign:"center"}} className="bgWhite">三急</th>
                                <th style={{width:"8%",textAlign:"center"}} className="bgWhite">本次里程</th>
                                <th style={{width:"12%",textAlign:"center"}} className="bgWhite">事件</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="tableBody" className={isShowTable ? "table-con" : "table-con hide"}>
                    <table className="table-striped tab-border" style={{borderTop: "none", width:"100%"}}>
                        <tbody>
                        {
                            trackInfo.map(function(item, key){
                                return(
                                    <tr key={key}>
                                        <td style={{width:"15%",textAlign:"center",verticalAlign:"middle"}}>{item.timeText}</td>
                                        <td style={{width:"7%",textAlign:"center",verticalAlign:"middle"}}>{item.directText}</td>
                                        <td style={{width:"18%",textAlign:"center",verticalAlign:"middle"}}><span className="red1">{item.accText}</span></td>
                                        <td style={{width:"24%",textAlign:"center",verticalAlign:"middle"}}>{!item.gpsText?"-":item.gpsText.split(",")[0]}<br/>{!item.gpsText?"-":item.gpsText.split(",")[1]}</td>
                                        <td style={{width:"8%",textAlign:"center",verticalAlign:"middle"}} className="green1">{item.speed} Km/h</td>
                                        <td style={{width:"8%",textAlign:"center",verticalAlign:"middle"}} className="orange">{item.sanJiJiaSu}/{item.sanJiJianSu}/{item.sanJiZhuanWan}</td>
                                        <td style={{width:"8%",textAlign:"center",verticalAlign:"middle"}}>{item.distanceText}</td>
                                        <td style={{width:"12%",textAlign:"center",verticalAlign:"middle"}}>{item.eventText}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
});
export default TrackTable;
