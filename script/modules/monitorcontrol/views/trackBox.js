/**
 * @file 轨迹搜索结果框 Reflux View
 * @author CM 2017.08.08
 */

import React, { Component } from 'react';
import { render } from 'react-dom';

import TrackStore from '../stores/trackStore';
import TrackAction from '../actions/trackAction';

var TrackBox = React.createClass({
    getInitialState: function() {
        return {
            isShow:false,
            device_id:'',
            car_no:'', //车牌号
            today_start_time:'', //全天开始时间
            today_end_time:'', //全天结束时间
            today_start_addr:'', //全天开始地址
            today_end_addr:'', //全天结束地址
            today_mileage: 0.00, //全天里程
            today_fuel: 0.00, //全天油耗
            today_line:new Array() //全天行程
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
            case 'clearTrack':
                this.listenClearTrack(result);
                break;
        }
    },
    listenCarTrack:function (result) {
        this.setState({
            isShow:true,
            device_id:result.device,
            car_no:result.carNo,
            today_start_time:result.todayDriverLine.start,
            today_end_time:result.todayDriverLine.end,
            today_start_addr:result.todayDriverLine.startAddr,
            today_end_addr:result.todayDriverLine.endAddr,
            today_mileage:result.todayDriverLine.mileage.toFixed(2),
            today_fuel:result.todayDriverLine.fuel.toFixed(2),
            today_line:result.allDriverLine
        });
    },
    listenClearTrack:function (result) {
        this.setState({
            isShow:false,
        });
    },
    /**
     * 获取指定轨迹段GPS
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param isAllDay 是否全天
     * @param event
     */
    handleGetGPSClick:function (startTime,endTime,event) {
        $('#loading').modal('show');
        TrackAction.gettrackgps(startTime,endTime);
    },
    render: function() {
        let that = this;
        let device_id = that.state.device_id;
        return (
        <div className={this.state.isShow ? "trail-popBox visible" : "trail-popBox"}>
            <div className="trajectory-car-name font16 bule"><img src={__uri("/static/images/car-logo.png")} />{this.state.car_no}
                <button type="submit" className="btnTwo btn-export1 f-r mart6"><i className="icon-bg export2-icon"></i>导出</button>
            </div>
            <div className="car-scroll">
                <div className="arear-search-mile" onClick={that.handleGetGPSClick.bind(null,this.state.today_start_time,this.state.today_end_time)}>
                    <div className="allday">全天</div>
                    <ul className="start-nopic"><li><b className="blue-time">{this.state.today_start_time.substr(-8)}</b></li><li>{this.state.today_start_addr == '' ? '未知地址' : this.state.today_start_addr}</li></ul>
                    <ul className="start border-b"></ul>
                    <ul className="start-nopic1"><li><b className="blue-time">{this.state.today_end_time.substr(-8)}</b></li><li>{this.state.today_end_addr == '' ? '未知地址' : this.state.today_end_addr}</li></ul>
                    <ul className="start border-b"></ul>
                    <div className="ul-note1"  style={{height: "40px"}}>
                        <li><img src={__uri("/static/images/stop-icon.png")} />油耗<span className="orange">{this.state.today_fuel}</span>L</li>
                        <li><img src={__uri("/static/images/road-icon.png")} />行驶<span className="green1">{this.state.today_mileage}</span>Ｋｍ</li>
                    </div>
                </div>
                {
                    this.state.today_line.map(function(item, key) {
                        return(
                            <div key={key} className="cd-container-box" onClick={that.handleGetGPSClick.bind(null,item.start,item.end)}>
                                <section  className="cd-container">
                                    <div className="cd-timeline-block">
                                        <div className="cd-timeline-img"><img src={__uri("/static/images/rise-icon.png")} /></div>
                                        <div className="cd-timeline-content">
                                            <p className="blue-time"><b>{item.start.substr(-8)}</b></p>
                                            <p className="mar-t">{item.startAddr == '' ? '未知地址' : item.startAddr}</p>
                                        </div>
                                    </div>
                                    <div className="cd-timeline-block">
                                        <div className="cd-timeline-img"><img src={__uri("/static/images/end-icon.png")} /></div>
                                        <div className="cd-timeline-content">
                                            <p className="blue-time"><b>{item.end.substr(-8)}</b></p>
                                            <p className="mar-t">{item.endAddr == '' ? '未知地址' : item.endAddr}</p>
                                        </div>
                                    </div>
                                </section>
                                <ul className="ul-note">
                                    <li><img src={__uri("/static/images/stop-icon.png")} />油耗<span className="orange">{item.fuel.toFixed(2)}</span>L</li>
                                    <li><img src={__uri("/static/images/road-icon.png")} />行驶<span className="green1">{item.mileage.toFixed(2)}</span>Ｋm</li>
                                </ul>
                            </div>
                        )
                    })
                }
            </div>
        </div>
        )
    }
});
export default TrackBox;