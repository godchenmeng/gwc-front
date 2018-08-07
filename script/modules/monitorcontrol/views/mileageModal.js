/**
 * @file 当月里程报表弹窗 Reflux View
 * @author Banji 2017.10.10
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import LocateStore from '../stores/locateStore'
import MonitorStore from '../stores/monitorStore'

import Url from '../../../common/urls'

var MileageModal = React.createClass({
    getInitialState: function() {
        return {
            car_id:undefined,
        };
    },
    componentDidMount: function () {
        let that = this;
        let modName = that.props.modName ? that.props.modName : "mileage_modal";
        if(modName == "locate_mileage_modal"){//区分在定位信息查询模块里点击里程还是在实时监控模块，添加对应的监听
            this.unsubscribe = LocateStore.listen(that.listenEvent);
        }else{
            this.unsubscribe = MonitorStore.listen(that.listenEvent);
        }
    },
    componentDidUpdate:function(){
        let that = this;
        let car_id = that.state.car_id;
        if(!!car_id){
            that.loadMileageData(car_id);
        }
    },
    componentWillUnmount:function(){
        this.unsubscribe(); //解除监听
    },
    listenEvent: function(type,result){
        switch (type){
            case 'showMileageModal':
                this.showMileageModal(result);
                break;
        }
    },
    showMileageModal:function(value){
        let that = this;
        that.setState({car_id:value});
    },
    loadMileageData:function(car_id){
        let that = this;
        let param = {
            car_id : car_id
        }
        Url.post(Url.loadcarmil,param,function(data){
            that.showOnlineChart(data);
        })
    },
    showOnlineChart:function(value){
        let that = this;
        let chartData = that.initData(value);
        let categories = chartData.categories;
        var series = chartData.series;
        $('#mileage_chart').highcharts({
            chart: {
                type: 'spline',
            },
            credits: {
                enabled: false
            },
            title: {
                text: '里程',
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
                    text: '公里数'
                },
                labels: {
                    formatter: function () {
                        return this.value + ' 千米';
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
        var nData = {
            series:[],
            categories:[]
        };
        if(oData.length >0) {
            var mileage = {
                name: "里程",
                tooltip: {
                    valueSuffix: ' 千米'
                },
                data: []
            }
            oData.forEach(function(obj){
                nData.categories.push(obj.day);
                mileage.data.push(obj.mil);
            });
            nData.series.push(mileage);
        }
        return nData;
    },
    render: function() {
        let that =  this;
        let modName = that.props.modName ? that.props.modName : "mileage_modal";
        return (
            <div id={modName} className="modal fade Mileage">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal"><span>&times;</span></button>
                            <h4 className="modal-title">里程</h4>
                        </div>
                        <div className="modal-body">
                            <div id="mileage_chart"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export  default  MileageModal;