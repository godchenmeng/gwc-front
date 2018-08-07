/**
 * @file 综合统计报表 Reflux View
 * @author Banji 2017.09.08
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import SynthesizeStore from '../stores/synthesizeStore';

import Urls from '../../../common/urls';

var SynthesizeChart = React.createClass({
    componentDidMount: function () {
        this.unsubscribe = SynthesizeStore.listen(this.listenEvent);
        //this.showSynthesizeChart();
    },
    componentWillUnmount: function () {
        this.unsubscribe(); //解除监听
    },
    listenEvent: function(type,result){
        switch (type){
            case 'showSynthesizeChart':
                this.showSynthesizeChart(result);
                break;
        }
    },
    showSynthesizeChart:function(show_type){
        let that = this;
        var params = SynthesizeStore.getQueryParams();
        switch (show_type) {
            case 'month':
                params.start_time = SynthesizeStore.data.listMonth[0];
                params.end_time = SynthesizeStore.data.listMonth[SynthesizeStore.data.listMonth.length - 1];
                break;
            case 'week':
                params.start_time = SynthesizeStore.data.listWeek[0];
                params.end_time = SynthesizeStore.data.listWeek[6];
                break;
        }
        Urls.get(Urls.synthesizeStatistics,params,function(result){
            if(result.responseCode == "1" && result.responseMsg == "success"){
                var series = that.initData(result.datas,show_type);
                var categories = [];
                if(!!show_type){
                    if(show_type == "month"){
                        categories = SynthesizeStore.data.listMonth;
                    }else if(show_type == "week"){
                        categories = SynthesizeStore.data.listWeek;
                    }
                }else{
                    categories = SynthesizeStore.data.listDate;
                }
                $('#synthesize_chart').highcharts({
                    chart: {
                        type: 'spline'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: '综合统计',
                        floating: true,
                        align: 'left',
                        x: -999,
                        y: -999
                    },
                    xAxis: {
                        categories: categories
                    },
                    yAxis: {
                        title: {
                            text: '综合次数'
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
            }else{
                toastr.error(result.responseMsg);
            }
        });
    },
    initData:function(oData){
        var nData = [];
        if(!!oData && oData.length >0) {
            var series_over_speed = {
                name: "超速",
                tooltip: {
                    valueSuffix: ' 次'
                },
                data: []
            },series_outside = {
                name: "越界",
                tooltip: {
                    valueSuffix: ' 次'
                },
                data: []
            },series_not_return = {
                name: "未入库",
                tooltip: {
                    valueSuffix: ' 次'
                },
                data: []
            },series_foul_park = {
                name: "违停",
                tooltip: {
                    valueSuffix: ' 次'
                },
                data: []
            },series_foul_task = {
                name: "无单违规",
                tooltip: {
                    valueSuffix: ' 次'
                },
                data: []
            },series_foul_time = {
                name: "非规定时段",
                tooltip: {
                    valueSuffix: ' 次'
                },
                data: []
            },series_violation = {
                name: "违章",
                tooltip: {
                    valueSuffix: ' 次'
                },
                data: []
            };
            oData.forEach(function(obj){
                series_over_speed.data.push(obj.overspeed);
                series_outside.data.push(obj.outside);
                series_not_return.data.push(obj.not_return);
                series_foul_park.data.push(obj.foul_park);
                series_foul_task.data.push(obj.foul_task);
                series_foul_time.data.push(obj.foul_time);
                series_violation.data.push(obj.break_rule);
            });
            nData.push(series_over_speed);
            nData.push(series_outside);
            nData.push(series_not_return);
            nData.push(series_foul_park);
            nData.push(series_foul_task);
            nData.push(series_foul_time);
            nData.push(series_violation);
        }
        return nData;
    },
    handleChangeShowType: function (event) {
        let that = this;
        $(".data-li a[data-type]").removeClass("active");
        $(event.target).addClass("active");
        var show_type = $(event.target).data("type");
        that.showSynthesizeChart(show_type);
    },
    render: function () {
        let that = this;
        return (
            <div className="row mart12 marb12">
                <div className="col-md-12">
                    <div className="chart-box-l">
                        <div  className="title">
                            <img src={__uri("/static/images/line-title.jpg")}/>综合统计
                            <div className="data-li">
                                <a className="active" data-type="week" onClick={that.handleChangeShowType}>周</a>
                                <a data-type="month" onClick={that.handleChangeShowType}>月</a>
                            </div>
                        </div>
                        <div id="synthesize_chart"></div>
                    </div>
                </div>
            </div>
        )
    }
});

export default SynthesizeChart;