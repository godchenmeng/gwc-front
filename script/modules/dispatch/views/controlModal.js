/**
 * @file 派遣-模式框 Reflux View
 * @author Banji 2017.08.21
 */

import React, { Component } from 'react';
import { render } from 'react-dom';

import Urls from '../../../common/urls';

import ControlStore from '../stores/controlStore';
import ControlAction from '../actions/controlAction';

var ControlModal = React.createClass({
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
        that.unsubscribe = ControlStore.listen(that.listenEvent);
    },
    componentWillUnmount: function(){
        let that = this;
        that.unsubscribe();
    },
    listenEvent: function(type,result){
        switch (type){
            case 'controlEvent':
                this.listenControlEvent(result);
                break;
        }
    },
    listenControlEvent:function(value){
        let that = this;
        that.setState({applyInfo:value});
        that.clearModal();
    },
    handleClickSign:function(event){
        let that = this;
        var id = that.state.applyInfo.pq_id;
        if(!id){
            toastr.error("派遣单信息丢失，操作失败！");
            return;
        }
        ControlAction.sign({id:id},function(){
            $("#control_modal").modal('toggle');
        });
    },
    handleClickFeedback:function(event){
        let that = this;
        var id = that.state.applyInfo.pq_id;
        var feedback = $("#control_modal textarea[name='feedback']").val();
        if(!id){
            toastr.error("派遣单信息丢失，操作失败！");
            return;
        }
        if(!feedback){
            toastr.error("请填写反馈理由！");
            return;
        }
        var param = {
            id:id,
            feedback:feedback
        };
        ControlAction.feedback(param,function(){
            $("#control_modal").modal('toggle');
        });
    },
    clearModal: function () {
        $("#control_modal textarea[name='feedback']").val("");
    },
    render: function() {
        let that = this;
        let applyInfo = that.state.applyInfo;
        let dd_result = {
            "1":"待办",
            "2":"同意",
            "3":"驳回",
            "4":"已撤回",
        };
        let pq_result = {
            "1":"待出车",
            "2":"待完成",
            "3":"待完成",
            "5":"待完成",
            "6":"已完成",
            "7":"作废",
            "8":"已撤销",
            "9":"已反馈",
        };
        return (
            <div>
                <div id="control_modal" className="modal fade Reject">
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
                                    <li><span className="span grey">用车类型：</span>{!!applyInfo.type_name?applyInfo.type_name:""}</li>
                                    <li><span className="span grey">目的地：</span>{applyInfo.end_place}</li>
                                    <li className="li01"><span className="span grey">备注：</span>{applyInfo.texts}</li>
                                    <li className="li01" id="driver_feedback">
                                        <span className="span grey">驾驶员反馈：</span>
                                        <textarea name="feedback" rows="5"  style={{width:"60%", height:"120px"}} placeholder="如反馈，请填写理由..."></textarea>
                                    </li>
                                    <li className="li01" id="li_dd_result"><span className="span grey">处理结果：</span>{dd_result[applyInfo.dd_status]}</li>
                                    <li className="li01" id="li_repeal_reason"><span className="span grey">撤销原因：</span>{applyInfo.repeal_reason}</li>
                                    <li className="li_driver_info"><span className="span grey">驾驶员：</span>{applyInfo.driver_name}</li>
                                    <li className="li_driver_info"><span className="span grey">车牌号：</span>{applyInfo.car_no}</li>
                                    <li className="li01 li_driver_info"><span className="span grey">驾驶员电话：</span>{applyInfo.driver_mobile}</li>
                                    <li className="li01" id="li_driver_feedback"><span className="span grey">驾驶员反馈：</span>{applyInfo.feedback}</li>
                                    <li className="li01" id="li_pq_status"><span className="span grey">任务状态：</span>{pq_result[applyInfo.pq_status]}</li>
                                </ul>
                                <div className="mesSet-box">

                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" id="btn-green" className="btnOne btn-green" onClick={this.handleClickSign}><i className="icon-bg agree-icon"/>签收</button>
                                <button type="button" id="btn-orange" className="btnOne btn-orange" onClick={this.handleClickFeedback}><i className="icon-bg reject-icon"></i>反馈</button>
                                <button type="button" id="btn-submit" className="btnOne btn-green" onClick={this.handleClickFeedback}><i className="icon-bg agree-icon"/>提交</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export  default  ControlModal;