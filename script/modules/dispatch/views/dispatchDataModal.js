/**
 * @file 调度数据-模式框 Reflux View
 * @author Banji 2017.08.23
 */

import React, { Component } from 'react';
import { render } from 'react-dom';

import DispatchDataAction from '../actions/dispatchDataAction'
import DispatchDataStore from '../stores/dispatchDataStore';

var DispatchDataModal = React.createClass({
    getInitialState: function() {
        return {
            applyInfo:{
                "id": 0,
                "sq_id": 0,
                "sq_name": "",
                "sq_org": 0,
                "sq_org_name": "",
                "sq_mobile": "",
                "use_name": "",//用车人
                "use_org": 0,    //用车单位code
                "user_org_name": "",//用车单位名称
                "use_mobile": "",//用车人电话
                "use_number": 0,//用车人数
                "plan_car_num":0,//用车数
                "plan_time": "0000-00-00 00:00:00",//用车开始时间
                "plan_return": "0000-00-00 00:00:00",//用车结束时间
                "start_place": "",//上车地点
                "end_place": "",//目的地
                "car": "",//用车类型
                "reason": "",//用车事由
                "texts": "",//备注
                "apply_status": "",//申请单状态
            },
        };
    },
    componentDidMount: function () {
        let that = this;
        that.unsubscribe = DispatchDataStore.listen(that.listenEvent);
        $('#control_task_table').bootstrapTable({
            columns: [{
                field: 'car_org_name',
                title: '部门',
                align:'center',
                valign:'middle'
            }, {
                field: 'car_no',
                title: '车牌号',
                align:'center',
                valign:'middle'
            }, {
                field: 'type_name',
                title: '车辆类型',
                align:'center',
                valign:'middle'
            },{
                field: 'driver_org_name',
                title: '部门',
                align:'center',
                valign:'middle'
            }, {
                field: 'driver_name',
                title: '姓名',
                align:'center',
                valign:'middle'
            }, {
                field: 'driver_type',
                title: '驾驶证类型',
                align:'center',
                valign:'middle'
            }],
            data: []
        });
    },
    componentWillUnmount: function(){
        this.unsubscribe(); //解除监听
    },
    componentDidUpdate: function(){
        let that = this;
        let applyInfo = that.state.applyInfo;
        if(!!applyInfo.dd_status && (applyInfo.dd_status == "2" || applyInfo.dd_status == "4")){
            $('#dispatch_data_modal .bootstrap-table').show();
            DispatchDataAction.taskList({id:applyInfo.id});
        }else{
            $('#dispatch_data_modal .bootstrap-table').hide();
        }
    },
    listenEvent: function(type,result){
        switch (type){
            case 'dispatchDataEvent':
                this.listenDispatchDataEvent(result);
                break;
        }
    },
    listenDispatchDataEvent:function(value){
        let that = this;
        that.setState({applyInfo:value});
    },
    render: function() {
        let that = this;
        let applyInfo = that.state.applyInfo;
        let result = {
            "2":"同意",
            "3":"驳回",
            "4":"撤销"
        };
        return (
            <div>
                <div id="dispatch_data_modal" className="modal fade">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header" style={{background:'#fff',borderBottom:'none'}}>
                                <button type="button" className="close" data-dismiss="modal"><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <ul className="modal-form-con" style={{marginTop:'-30px'}}>
                                    <li><span className="span grey">用车人：</span>{applyInfo.use_name}&nbsp;&nbsp;</li>
                                    <li><span className="span grey">用车人电话：</span>{applyInfo.use_mobile}</li>
                                    <li><span className="span grey">用车时间：</span>{applyInfo.plan_time.substring(0,10)}&nbsp;至&nbsp;{applyInfo.plan_return.substring(0,10)}</li>
                                    <li><span className="span grey">用车部门：</span>{applyInfo.user_org_name}</li>
                                    <li><span className="span grey">用车人事由：</span>{applyInfo.reason}</li>
                                    <li><span className="span grey">上车地点：</span>{applyInfo.start_place}</li>
                                    <li>
                                        <span className="span grey">用车类型：</span>{!!applyInfo.type_name?applyInfo.type_name:""}&nbsp;&nbsp;
                                        <span className="span grey">用车数：</span>{applyInfo.plan_car_num}
                                    </li>
                                    <li><span className="span grey">目的地：</span>{applyInfo.end_place}</li>
                                    <li><span className="span grey">备注：</span>{applyInfo.texts}</li>
                                    <li><span className="span grey">结果：</span>{result[applyInfo.dd_status]}</li>
                                    <li className={applyInfo.dd_status == "4"?"":"hide"}><span className="span grey"></span></li>
                                    <li className={applyInfo.dd_status == "4"?"":"hide"}><span className="span grey">撤销原因：</span>{applyInfo.repeal_reason}</li>
                                    <li className="li01">
                                        <table id="control_task_table" style={{width:"100%", cellSpacing:"0", cellPadding:"0"}} className="table-dispatch"></table>
                                    </li>
                                </ul>
                                <div className="mesSet-box">

                                </div>
                            </div>
                            <div className="modal-footer">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export  default  DispatchDataModal;