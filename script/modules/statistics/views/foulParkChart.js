/**
 * @file 违规停运统计报表 Reflux View
 * @author Banji 2017.09.05
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import FoulParkStore from '../stores/foulParkStore'

import Urls from '../../../common/urls'

var FoulParkChart = React.createClass({
    componentDidMount: function () {
        this.unsubscribe = FoulParkStore.listen(this.listenEvent);
    },
    componentWillUnmount: function () {
        this.unsubscribe(); //解除监听
    },
    listenEvent: function(type,result){
        switch (type){
            case 'showFoulParkChart':
                this.showFoulParkChart(result);
                break;
        }
    },
    showFoulParkChart:function(value,show_type){
        var series = this.initData(value,show_type);
        var categories = [];
        if(!!show_type && show_type == "month"){
            categories = FoulParkStore.data.listMonth;
        }else {
            categories = FoulParkStore.data.listWeek;
        }
        $('#foul_park_chart').highcharts({
            chart: {
                type: 'spline'
            },
            credits: {
                enabled: false
            },
            title: {
                text: '违规停运统计',
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
                    text: '违规停运次数'
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
    initData:function(oData,show_type){
        var nData = [];
        if(!!oData && oData.length >0) {

            oData.forEach(function(obj){
                var series = {
                    name: "",
                    tooltip: {
                        valueSuffix: ' 次'
                    },
                    data: []
                }
                series.name = obj.org_name;
                if(!!show_type && show_type == "month"){
                    var listMonth = FoulParkStore.data.listMonth;
                    listMonth.forEach(function(key){
                        series.data.push(obj[key]);
                    });
                }else{
                    var listWeek = FoulParkStore.data.listWeek;
                    listWeek.forEach(function(key){
                        series.data.push(obj[key]);
                    });
                }
                nData.push(series);
            });
        }
        return nData;
    },
    handleChangeShowType: function (event) {
        let that = this;
        $(".data-li a[data-type]").removeClass("active");
        $(event.target).addClass("active");
        var show_type = $(event.target).data("type");
        var org_ids = [],tableData;
        tableData = $('#foul_park_table').bootstrapTable('getData', true) || [];
        tableData.forEach(function(item,index){
            org_ids.push(item.org_id);
        });
        var params = {
            org_ids:org_ids,
            start_time:FoulParkStore.data.listWeek[0],
            end_time:FoulParkStore.data.listWeek[6]
        };
        switch(show_type){
            case "week":
                break;
            case "month":
                params.start_time = FoulParkStore.data.listMonth[0];
                params.end_time = FoulParkStore.data.listMonth[FoulParkStore.data.listMonth.length -1];
                break;
        }
        Urls.get(Urls.foulParkStatistics,params,function(data){
            if(data.responseCode == "1" && data.responseMsg=="success"){
                that.showFoulParkChart(data.datas,show_type);
            }else{
                toastr.error(data.responseMsg);
            }
        });
    },
    render: function () {
        let that = this;
        return (
            <div className="row mart12 marb12">
                <div className="col-md-12">
                    <div className="chart-box-l">
                        <div  className="title">
                            <img src={__uri("/static/images/line-title.jpg")}/>违规停运统计
                            <div className="data-li">
                                <a className="active" data-type="week" onClick={that.handleChangeShowType}>周</a>
                                <a data-type="month" onClick={that.handleChangeShowType}>月</a>
                            </div>
                        </div>
                        <div id="foul_park_chart"></div>
                    </div>
                </div>
            </div>
        )
    }
});

export default FoulParkChart;