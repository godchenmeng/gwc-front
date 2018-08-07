/**
 * @file 上线率报表 Reflux View
 * @author Banji 2017.08.24
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import OnlineStore from '../stores/onlineStore';

var OnlineChart = React.createClass({
    componentDidMount: function () {
        this.unsubscribe = OnlineStore.listen(this.listenEvent);
    },
    componentWillUnmount: function () {
        this.unsubscribe(); //解除监听
    },
    listenEvent: function(type,result){
        switch (type){
            case 'showOnlineChart':
                this.showOnlineChart(result);
                break;
        }
    },
    showOnlineChart:function(value){
        let that = this;
        var series = that.initData(value);
        $('#online_chart').highcharts({
            chart: {
                type: 'spline',
            },
            credits: {
                enabled: false
            },
            title: {
                text: '上线率统计',
                floating: true,
                align: 'left',
                x: -999,
                y: -999
            },
            xAxis: {
                categories: OnlineStore.data.listWeek
            },
            yAxis: {
                title: {
                    text: '上线率'
                },
                labels: {
                    formatter: function () {
                        return this.value + '%';
                    }
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666666',
                        lineWidth: 1
                    }
                }
            },
            series: series,
            lang: {
                noData: '暂无数据'
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
                }
            }
        });
    },
    initData:function(oData){
        var nData = [];
        if(oData.length >0) {
            var listWeek = OnlineStore.data.listWeek;
            oData.forEach(function(obj){
                var series = {
                    name: "",
                    tooltip: {
                        valueSuffix: ' %'
                    },
                    data: []
                }
                series.name = obj.org_name;
                listWeek.forEach(function(key){
                    series.data.push(obj[key]);
                });
                nData.push(series);
            });
        }
        return nData;
    },
    render: function () {
        return (
            <div className="row mart12 marb12">
                <div className="col-md-12">
                    <div className="chart-box-l">
                        <div  className="title">
                            <img src={__uri("/static/images/line-title.jpg")}/>上线率统计
                        </div>
                        <div id="online_chart"></div>
                    </div>
                </div>
            </div>
        )
    }
});

export default OnlineChart;