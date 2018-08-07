import React, { Component } from 'react';
import { render } from 'react-dom';

import ApplyStore from '../stores/applyStore';
import ApplyAction from '../actions/applyAction';

import CommonStore from '../../common/stores/commonStore'

var ApplyListModal = React.createClass({
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
        this.unsubscribe = ApplyStore.listen(that.listenEvent);
    },
    componentWillUnmount:function(){
        this.unsubscribe();
    },
    listenEvent: function(type,result){
        switch (type){
            case 'repealListApply':
                this.listenRepealApply(result);
                break;
        }
    },
    listenRepealApply:function(value){
        let that = this;
        that.setState({applyInfo:value});
        that.clearModal();
    },
    handleClickEdit:function(event){
        let that = this;
        $("#apply_list_modal").modal('toggle');
        ApplyAction.editApply(that.state.applyInfo);
    },
    handleClickCopyAdd:function(event){
        let that = this;
        $("#apply_list_modal").modal('toggle');
        ApplyAction.copyAddApply(that.state.applyInfo);
    },
    handleClickRevoke:function(){
        $("textarea[name='repeal_reason']").parent().removeClass("hide");
        $("button#btn-green").removeClass("hide");
        $("button#btn-revoke,button#btn-c-add,button#btn-edit").addClass("hide");
    },
    handleClickSubmit:function(event){
        let that = this;
        let applyInfo = that.state.applyInfo;
        var data = {
            id:applyInfo.id,
            sp_status:applyInfo.sp_status,
            dd_status:applyInfo.dd_status,
            repeal_reason:$("#apply_list_modal textarea[name='repeal_reason']").val(),
        };
        ApplyAction.repeal(data,function(){
            $("#apply_list_modal").modal('toggle');
            ApplyAction.search();
        });
    },
    clearModal: function(){
        $("textarea[name='repeal_reason']").val("");
    },
    render: function() {
        let that =  this;
        let applyInfo = that.state.applyInfo;
        return (
            <div id="apply_list_modal" className="modal fade Reject">
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
                                <li className="li01"><span className="span grey">撤销原因：</span><textarea name="repeal_reason" rows="5"  style={{width:"60%", height:"120px"}} placeholder="请填写撤销理由..."></textarea></li>
                            </ul>
                            <div className="mesSet-box">

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id="btn-edit" className="btnOne btn-bule" onClick={this.handleClickEdit}><i className="icon-bg edit-icon"></i>修 改</button>
                            <button type="button" id="btn-c-add" className="btnOne btn-green" onClick={this.handleClickCopyAdd}><i className="icon-bg c-add-icon"></i>复制新增</button>
                            <button type="button" id="btn-revoke" className="btnOne btn-gray" onClick={this.handleClickRevoke}><i className="icon-bg revoke-icon"></i>撤 回</button>
                            <button type="button" id="btn-green" className="btnOne btn-green" onClick={this.handleClickSubmit}><i className="icon-bg agree-icon"></i>提 交</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export  default  ApplyListModal;