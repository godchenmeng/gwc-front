/**
 * @file 驾驶统计报表 Reflux View
 * @author Banji 2017.09.07
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import DriveStore from '../stores/driveStore';

import Urls from '../../../common/urls';

var DriveChart = React.createClass({
    componentDidMount: function () {
        this.unsubscribe = DriveStore.listen(this.listenEvent);
    },
    componentWillUnmount: function () {
        this.unsubscribe(); //解除监听
    },
    listenEvent: function(type,result){
        switch (type){
            case 'showDriveMileageChart':
                this.showDriveMileageChart(result);
                break;
        }
    },
    showDriveMileageChart:function(value,show_type){
        var series = this.initDriveMileageData(value,show_type);
        var categories = [];
        if(!!show_type && show_type == "month"){
            categories = DriveStore.data.listMonth;
        }else {
            categories = DriveStore.data.listWeek;
        }
        $('#drive_mileage_chart').highcharts({
            chart: {
                type: 'spline',
                height: 255
            },
            credits: {
                enabled: false
            },
            title: {
                text: '驾驶统计',
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
                    text: '驾驶里程数'
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
        this.showDriveBreakChart(value,show_type);
    },
    initDriveMileageData:function(oData,show_type){
        var nData = [];
        if(!!oData && oData.length >0) {

            oData.forEach(function(obj){
                var series = {
                    name: "",
                    tooltip: {
                        valueSuffix: ' 千米'
                    },
                    data: []
                }
                series.name = obj.org_name;
                if(!!show_type && show_type == "month"){
                    var listMonth = DriveStore.data.listMonth;
                    listMonth.forEach(function(key){
                        series.data.push(obj[key]);
                    });
                }else{
                    var listWeek = DriveStore.data.listWeek;
                    listWeek.forEach(function(key){
                        series.data.push(obj[key]);
                    });
                }
                nData.push(series);
            });
        }
        return nData;
    },
    showDriveBreakChart:function(value,show_type){
        let that = this;
        var org_ids = [],start_time,end_time,params;
        $.each(value,function(index,item){
            org_ids.push(item.org_id);
        });
        if(!!show_type && show_type == "month"){
            var listMonth = DriveStore.data.listMonth;
            start_time = listMonth[0];
            end_time = listMonth[listMonth.length - 1];
        }else{
            var listWeek = DriveStore.data.listWeek;
            start_time = listWeek[0];
            end_time = listWeek[listWeek.length - 1];
        }
        params = {
            org_ids:org_ids,
            start_time:start_time,
            end_time:end_time
        };
        Urls.get(Urls.driveBreak,params,function(result){
            if(result.responseCode == "1" && result.responseMsg=="success"){
                var data = that.initDriveBreakData(result.datas);
                $('#drive_break_chart').highcharts({
                    chart: {
                        type: 'pie',
                        height:229,
                        margin: [0, 0, 30, 0]
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: '三急数据饼状图',
                        x:-999,
                        y:-999
                    },
                    tooltip: {
                        headerFormat: '{series.name}<br>',
                        pointFormat: '{point.name}: <b>{point.percentage:.1f}%({point.count}次)</b>'
                    },
                    legend: {
                        y:10
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    series: [{
                        name: '三急占比',
                        data: data
                    }],
                    exporting: {
                        enabled: false
                    },
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
    initDriveBreakData:function(oData){//数据加工
        var nData = oData || [];
        //to do
        return nData;
    },
    handleChangeShowType: function (event) {
        let that = this;
        $(".data-li a[data-type]").removeClass("active");
        $(event.target).addClass("active");
        var show_type = $(event.target).data("type");
        var org_ids = [],tableData;
        tableData = $('#drive_table').bootstrapTable('getData', true) || [];
        tableData.forEach(function(item,index){
            org_ids.push(item.org_id);
        });
        var params = {
            org_ids:org_ids,
            start_time:DriveStore.data.listWeek[0],
            end_time:DriveStore.data.listWeek[6]
        };
        switch(show_type){
            case "week":
                break;
            case "month":
                params.start_time = DriveStore.data.listMonth[0];
                params.end_time = DriveStore.data.listMonth[DriveStore.data.listMonth.length -1];
                break;
        }
        Urls.get(Urls.driveStatistics,params,function(result){
            if(result.responseCode == "1" && result.responseMsg=="success"){
                that.showDriveMileageChart(result.datas,show_type);
            }else{
                toastr.error(result.responseMsg);
            }
        });
    },
    render: function () {
        let that = this;
        return (
            <div className="row mart12 marb12">
                <div className="col-md-9">
                    <div className="chart-box-l">
                        <div  className="title">
                            <img src={__uri("/static/images/line-title.jpg")}/>驾驶统计
                            <div className="data-li">
                                <a className="active" data-type="week" onClick={that.handleChangeShowType}>周</a>
                                <a data-type="month" onClick={that.handleChangeShowType}>月</a>
                            </div>
                        </div>
                        <div id="drive_mileage_chart"></div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="page-chart-title">三急数据统计</div>
                    <div className="page-chart-con">
                        <div id="drive_break_chart"></div>
                    </div>
                </div>
            </div>
        )
    }
});

export default DriveChart;