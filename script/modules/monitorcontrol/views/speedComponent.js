/**
 * @file 速度监控 Reflux View
 * @author CM 2017.08.14
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共方法加载
import TrackAction from "../actions/trackAction";
import TrackStore from "../stores/trackStore";

var SpeedComponent = React.createClass({
    getInitialState: function() {
        return{
            isShow:false,
            gaugeOptions : {
                chart: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    type: 'solidgauge'
                },
                title: null,
                pane: {
                    center: ['50%', '95%'],
                    size: '100%',
                    startAngle: -90,
                    endAngle: 90,
                    background: {
                        innerRadius: '60%',
                        outerRadius: '100%',
                        shape: 'arc'
                    }
                },
                tooltip: {
                    enabled: false
                },
                // the value axis
                yAxis: {
                    stops: [
                        [0.1, '#DF5353'], // red
                        [0.25, '#DDDF0D'], // yellow
                        [0.6, '#55BF3B'] // green
                    ],
                    lineWidth: 0,
                    minorTickInterval: null,
                    tickPixelInterval: 400,
                    tickWidth: 0,
                    title: {
                        y: -70
                    },
                    labels: {
                        y: 16
                    }
                },
                plotOptions: {
                    solidgauge: {
                        dataLabels: {
                            y: 5,
                            borderWidth: 0,
                            useHTML: true
                        }
                    }
                }
            },
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
            case 'clearTrack':
                this.listenClearTrack(result);
                break;
        }
    },
    listenSetTimeLine:function (time) {
        let that = this;
        this.setState({
            isShow:true,
        });
        // The speed gauge
        $('#container-speed').highcharts(Highcharts.merge(that.state.gaugeOptions, {
            yAxis: {
                min: 0,
                max: 200
            },
            credits: {
                enabled: false
            },
            series: [{
                name: '速度',
                data: [0],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                    '<span style="font-size:12px;color:black">km/h</span></div>'
                },
                tooltip: {
                    valueSuffix: ' km/h'
                }
            }]
        }));
    },
    listenClearTrack:function (result) {
        this.setState({
            isShow:false,
        });
    },
    componentWillUnmount:function () {},
    render: function() {
        return (
            <div id="container-speed" className={this.state.isShow ? 'speed-monitor' : 'speed-monitor'} style={{width:"300px",height:"200px"}}></div>
        )
    }
});
export default SpeedComponent;
