/**
 * @file 时间轴 Reflux View
 * @author CM 2017.08.08
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共方法加载
import TrackAction from "../actions/trackAction";
import TrackStore from "../stores/trackStore";

var TimeLineComponent = React.createClass({
    getInitialState: function() {
        return{
            isShow:false,
            isPlay:false,
            isFirstTimeLoad: true,
            playStep: 1,
            playTime: 0,
        }
    },
    componentDidMount: function () {
        TrackStore.listen(this.onGetCarTrack);
    },
    onGetCarTrack: function (type,result) {
        switch (type){
            case 'settimeline':
                this.listenSetTimeLine(result);
                break;
            case 'resettimeline':
                this.restTimeLine();
                break;
            case 'clearTrack':
                this.listenClearTrack(result);
                break;
        }
    },
    listenSetTimeLine:function (time) {
        this.setState({
            isShow:true,
            playTime:time,
        });
        if(this.state.isFirstTimeLoad){
            $.playBar.addBar($('#timebar'),time);
            this.setState({
                isFirstTimeLoad:false,
            });
        }else{
            $.playBar.restTime(time);
        }
    },
    listenClearTrack:function (result) {
        this.setState({
            isShow:false,
        });
    },
    handleSlow:function (event) {
        let that = this;
        $("#fastImg").attr("src",_uri("static/images/quick.png"));
        if(this.state.playStep > 1){
            let nowStep = this.state.playStep - 1;
            this.setState({
                playStep:nowStep
            });
            TrackStore.data.runCar.slow(nowStep);
            if(nowStep == 1){
                $("#slowImg").attr("src","static/images/slow1.png");
            }
        }
    },
    handlePlay:function (event) {
        if(this.state.isPlay){
            $("#slowImg").attr("src",__uri("/static/images/slow1.png"));
            $("#fastImg").attr("src",__uri("/static/images/quick1.png"));
            $("#playImg").attr("src",__uri("/static/images/play.png"));
            this.setState({isPlay:false});
            TrackStore.data.runCar.pause();
        }else{
            $("#playImg").attr("src",__uri("/static/images/pause.png"));
            this.setState({isPlay:true});
            TrackStore.data.runCar.start(this);
            if(this.state.playStep > 1 && this.state.playStep < 3){
                $("#fastImg").attr("src",__uri("/static/images/quick.png"));
                $("#slowImg").attr("src",__uri("/static/images/slow.png"));
            }else{
                if(this.state.playStep == 1){
                    $("#fastImg").attr("src",__uri("/static/images/quick.png"));
                }else{
                    $("#slowImg").attr("src",__uri("/static/images/slow.png"));
                }
            }
        }
    },
    handleFast:function (event) {
        let that = this;
        $("#slowImg").attr("src",__uri("/static/images/slow.png"));
        if(this.state.playStep < 3){
            let nowStep = this.state.playStep + 1;
            this.setState({
                playStep:nowStep
            });
            TrackStore.data.runCar.fast(nowStep);
            if(nowStep == 3){
                $("#fastImg").attr("src","static/images/quick1.png");
            }
        }
    },
    /**
     * 设置当前坐标点事件信息
     * @param index 坐标点索引
     */
    setTrackInfoTable: function (index) {
        TrackAction.setTrackInfoBox(index);
    },
    /**
     * 重置时间轴
     */
    restTimeLine:function () {
        $("#slowImg").attr("src",__uri("/static/images/slow1.png"));
        $("#fastImg").attr("src",__uri("/static/images/quick1.png"));
        $("#playImg").attr("src",__uri("/static/images/play.png"));
        $.playBar.restTime(this.state.playTime);
        this.setState({isPlay:false,playStep:1});
    },
    componentWillUnmount:function () {},
    render: function() {
        let that = this;
        return (
            <div className={that.state.isShow ? "time-play-box" : "time-play-box hide"}>
                <div className="contral">
                    <a title="快退" onClick={that.handleSlow}><img id="slowImg" src={__uri("/static/images/slow1.png")} /></a>
                    <a title="播放" onClick={that.handlePlay} className="start"><img id="playImg" src={__uri("/static/images/play.png")} /></a>
                    <a title="快进" onClick={that.handleFast}><img id="fastImg" src={__uri("/static/images/quick1.png")} /></a>
                </div>
                <div id="timebar">
                    <div className="bar-control">
                        <div className="bar-begin-time" style={{marginRight:"5px"}}>00:00</div>
                        <div className="the-bar"><div className="time-ball"></div>
                            <div className="the-color-bar"></div>
                        </div>
                        <div className="bar-finish-time">00:00</div>
                    </div>
                </div>
            </div>
        )
    }
});
export default TimeLineComponent;
