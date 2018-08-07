/**
 * @file 主页君 Reflux View
 * @author CM 2017.07.21
 */

import React, { Component } from 'react'
import { render } from 'react-dom'

//公共方法加载
import CommonStore from '../../common/stores/commonStore';
import CommonAction from "../actions/commonAction";

//模块加载
import AutoComplete from '../../../common/autoComplete';

var Main = React.createClass({
    getInitialState: function() {
        return {
            countCars: [], // 当前车辆监控树
            monitorCars:[],//快速监控的车辆
            countTask:[],//任务统计
            msgCenter:[],//消息中心
            infoTimer:null, //信息刷新定时器
        }
    },
    componentDidMount: function () {
        CommonAction.loadindexdata();
        this.setState({
            infoTimer:setInterval(() => {CommonAction.loadindexdata();},18000),
        });
        AutoComplete.initInput("#car_no");
        this.unsubscribe = CommonStore.listen(this.triggerMethod);
    },
    componentWillUnmount:function () {
        clearInterval(this.state.infoTimer);
        this.unsubscribe(); //解除监听
    },
    triggerMethod:function (type, result) {
        if(type == 'loadedindexdata'){
            this.setState({
                countCars: result.car_count,
                monitorCars: result.monitor_car,
                countTask: result.task_count,
                msgCenter:result.info_center
            });
        }else if(type == 'opmonitorcarsuccess'){
            CommonAction.loadindexdata();
            toastr.success("操作成功！");
            $('#addMonitor').modal('hide');
            $('#car_no').val('');
        }
    },
    handleOpenTrace:function (device,event) {
        window.open('monitor.html?modal=trace&device=' + device);
    },
    handleDelCar:function (carId, event) {
        event.stopPropagation();//阻止事件冒泡
        let param = {
            opType: 2,
            carId: carId
        };
        CommonAction.opmonitorcar(param);
    },
    handleAddMonitorCar:function (event) {
        let carNo = $('#car_no').val();
        if(carNo == ''){
            toastr.warning('请输入车牌号码!');
        }else{
            let param = {
                opType:1,
                carNo: carNo
            }
            CommonAction.opmonitorcar(param);
        }
    },
    handleOpenBox:function (event) {
      $('#addMonitor').modal('show');
    },
    handleCloseBox:function (event) {
        $('#addMonitor').modal('hide');
    },
    render: function () {
        let that = this;
        let countCars = this.state.countCars;
        let monitorCars = this.state.monitorCars;
        let countTask = this.state.countTask;
        let msgCenter = this.state.msgCenter;
        return (
            <div className= 'right_col' >
                <div className="row">
                    <div className="col-md-3">
                        <div className="leftTop-car">
                            <div  className="Statis-data">
                                <span className="iconBase in-icon inCar-icon"></span>
                                <div className="Sta-number"><span className="bule font36">{countCars.all_car}</span><br />当前车辆总数</div>
                            </div>
                            <div  className="Statis-data">
                                <span className="iconBase in-icon inCar1-icon"></span>
                                <div className="Sta-number"><span className="green1 font36">{countCars.online_car}</span><br />当前在线车辆数</div>
                            </div>
                        </div>
                        <div className="newsBox mart15">
                            <div className="x_panel">
                                <div className="x_title">
                                    <h4><i className="iconTitle  in-icon news-icon"></i>消息中心</h4>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="x_content">
                                    <div className="dashboard-widget-content">

                                        <ul className="list-unstyled timeline widget">
                                            {
                                                msgCenter.map(function(item, index) {
                                                    let text = '';
                                                    let cssName = '';
                                                    switch (item.illegal_type){
                                                        case '0':
                                                            text = '违章';
                                                            cssName = 'new-state st-red';
                                                            break;
                                                        case '1':
                                                            text = '越界行驶';
                                                            cssName = 'new-state st-orange';
                                                            break;
                                                        case '2':
                                                            text = '超速(' + item.illegal_speed + '/'+ item.limit_speed +')';
                                                            cssName = 'new-state st-red';
                                                            break;
                                                        case '3':
                                                            text = '非规定时段';
                                                            cssName = 'new-state st-orange';
                                                            break;
                                                        case '4':
                                                            text = '供电中断';
                                                            cssName = 'new-state st-orange';
                                                            break;
                                                        case '5':
                                                            text = '保险提醒';
                                                            cssName = 'new-state st-bule';
                                                            break;
                                                        case '6':
                                                            text = '年检提醒';
                                                            cssName = 'new-state st-bule';
                                                            break;
                                                        case '7':
                                                            text = '保养提醒';
                                                            cssName = 'new-state st-bule';
                                                            break;
                                                        case '8':
                                                            text = '违规路径';
                                                            cssName = 'new-state st-red';
                                                            break;
                                                    }
                                                    return(
                                                        <li key={index}>
                                                            <div className="block" >
                                                                <div className="block_content" >
                                                                    <h2 className="title"><a>{item.car_no}</a>
                                                                        <span className={cssName}>{text}</span></h2>
                                                                    <div className="byline"><img src={__uri("/static/images/date.png")} className="img" />{item.happen_time}</div>
                                                                    <p className="excerpt"><img src={__uri("/static/images/weizhi_icon.png")} className="img" />{item.illegal_address}</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="blockBox padR18">
                            <div className="x_panel fixed_height_280 paadLr">
                                <div className="x_title mar-b0">
                                    <h4 className="ml-12"><i className="iconTitle  in-icon addcar-icon"></i>快速实时监控</h4>
                                    <div className="clearfix"></div>
                                </div>
                                <ul className="carAdd-list">
                                    {
                                        monitorCars.map(function (item, index) {
                                            return(
                                                <li key={index} style={{cursor:"pointer"}} onClick={that.handleOpenTrace.bind(null, item.device)}><img src={__uri("/static/images/car.png")} /><p>{item.car_no}</p><a className="in-icon active" onClick={that.handleDelCar.bind(null,item.car_id)}></a></li>
                                            )
                                        })
                                    }
                                    <li className={monitorCars.length < 6 ? "" : "hide"} style={{cursor:"pointer"}} onClick={that.handleOpenBox}><img src={__uri("/static/images/car-add.png")} /><p className="grey">增加车辆</p></li>
                                </ul>
                            </div>
                        </div>


                        <div className="blockBox">
                            <div className="x_panel fixed_height_280">
                                <div className="x_title">
                                    <h4><i className="iconTitle  in-icon task-icon"></i>任务统计</h4>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="x_content">
                                    <div className="widget_summary  mart8">
                                        <div className="w_left w_25">
                                            <i className="iconTask in-icon tijiao-icon"></i>
                                            <span>已提交</span>
                                        </div>
                                        <div className="w_center w_55">
                                            <div className="progress">
                                                <div className="progress-bar bg-green" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: '100%'}}>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w_right w_20">
                                            <span>{countTask.all_task}</span>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>

                                    <div className="widget_summary mart8">
                                        <div className="w_left w_25">
                                            <i className="iconTask in-icon shenpi-icon"></i>
                                            <span>待审批</span>
                                        </div>
                                        <div className="w_center w_55">
                                            <div className="progress">
                                                <div className="progress-bar bg-grass" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: countTask.wait_allow * 100/countTask.all_task + '%'}}>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w_right w_20">
                                            <span>{countTask.wait_allow}</span>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                    <div className="widget_summary  mart8">
                                        <div className="w_left w_25">
                                            <i className="iconTask in-icon diaodu-icon"></i>
                                            <span>待调度 </span>
                                        </div>
                                        <div className="w_center w_55">
                                            <div className="progress">
                                                <div className="progress-bar bg-orange"  role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: countTask.wait_apply * 100/countTask.all_task + '%'}}>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w_right w_20">
                                            <span>{countTask.wait_apply}</span>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                    <div className="widget_summary  mart8">
                                        <div className="w_left w_25">
                                            <i className="iconTask in-icon zhixing-icon"></i>
                                            <span>待执行</span>
                                        </div>
                                        <div className="w_center w_55">
                                            <div className="progress">
                                                <div className="progress-bar bg-blue" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: countTask.wait_do * 100/countTask.all_task + '%'}}></div>
                                            </div>
                                        </div>
                                        <div className="w_right w_20">
                                            <span>{countTask.wait_do}</span>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="addMonitor" role="dialog" aria-labelledby="loading" data-backdrop='static'>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">添加监控车辆</h4>
                            </div>
                            <div className="modal-body">
                                <ul className="modal-form-cons">
                                    <li className="form-group">
                                        <span className="span">车牌号码：</span>
                                        <input type="text" id="car_no" name="carno" />
                                    </li>
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.handleAddMonitorCar}>添  加</button>
                                <button type="button" className="btn btn-default" onClick={this.handleCloseBox}>取  消</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export default Main;
