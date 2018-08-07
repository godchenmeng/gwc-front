import React, { Component } from 'react';
import { render } from 'react-dom';

import ApprovalStore from '../stores/approvalStore';
import ApprovalAction from '../actions/approvalAction';
import CommonStore from "../../common/stores/commonStore";

var ApprovalModal = React.createClass({
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
        that.unsubscribe = ApprovalStore.listen(that.listenEvent);
    },
    componentWillUnmount:function(){
        let that = this;
        that.unsubscribe();//解除监听
    },
    listenEvent: function(type,result){
        switch (type){
            case 'showDetails':
                this.listenShowDetails(result);
                break;
            case 'rejectApply':
                this.listenRejectApply(result);
                break;
        }
    },
    listenShowDetails:function(value){
        let that = this;
        that.setState({applyInfo:value});
        that.clearModal();
    },
    listenRejectApply:function(value){
        let that = this;
        that.setState({applyInfo:value});
        that.clearModal();
    },
    handleClickAgree:function(event){
        let that = this;
        let applyInfo = that.state.applyInfo;
        var sp_status = $(event.target).data("status");
        var data = {
            id:applyInfo.id,
            sp_status:sp_status
        };
        ApprovalAction.agree(data,function(){
            $("#approval_modal").modal('toggle');
        });
    },
    handleClickReject:function(event){
        let that = this;
        let applyInfo = that.state.applyInfo;
        var sp_status = $(event.target).data("status");
        var sp_reason = $("#approval_modal textarea[name='sp_reason']").val();
        if(!sp_reason){
            toastr.warning("请填写驳回理由！");
            return;
        }
        var data = {
            id:applyInfo.id,
            sp_status:sp_status,
            sp_reason:sp_reason,
        };
        ApprovalAction.reject(data);
    },
    clearModal: function () {
        $("#approval_modal textarea[name='sp_reason']").val("");
    },
    render: function() {
        let that =  this;
        let applyInfo = that.state.applyInfo;
        let sp_result = {
            "1":"待办",
            "2":"同意",
            "3":"驳回",
            "4":"已撤回",
        };
        return (
            <div id="approval_modal" className="modal fade Reject">
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
                                <li className="li01" id="li_sp_reason"><span className="span grey">驳回原因：</span><textarea name="sp_reason" rows="5"  style={{width:"60%", height:"120px"}} placeholder="如驳回，请填写驳回理由..."></textarea></li>
                                <li className="li01" id="li_sp_result"><span className="span grey">处理结果：</span>{sp_result[applyInfo.sp_status]}</li>
                                <li className="li01" id="li_reason"><span className="span grey">原因：</span>{applyInfo.sp_reason}</li>
                                <li className="li01" id="li_repeal_reason"><span className="span grey">撤销原因：</span>{applyInfo.repeal_reason}</li>
                            </ul>
                            <div className="mesSet-box">

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id="btn-green" className="btnOne btn-green" data-status="2" onClick={this.handleClickAgree}><i className="icon-bg agree-icon"></i>同 意</button>
                            <button type="button" id="btn-orange" className="btnOne btn-orange" data-status="3" onClick={this.handleClickReject}><i className="icon-bg reject-icon"></i>驳 回</button>
                            <button type="button" id="btn-submit" className="btnOne btn-green" data-status="3" onClick={this.handleClickReject}><i className="icon-bg agree-icon"></i>提 交</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export  default  ApprovalModal;