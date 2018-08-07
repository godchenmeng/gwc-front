import React, { Component } from 'react';
import { render } from 'react-dom';

import ApplyStore from '../stores/applyStore';
import ApplyAction from '../actions/applyAction';

var ApplyModal = React.createClass({
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
        this.unsubscribe();//解除监听
    },
    listenEvent: function(type,result){
        switch (type){
            case 'repealApply':
                this.listenRepealApply(result);
                break;
        }
    },
    listenRepealApply:function(value){
        let that = this;
        that.setState({applyInfo:value});
    },
    handleClickSubmit:function(event){
        let that = this;
        let applyInfo = that.state.applyInfo;
        var data = {
            id:applyInfo.id,
            sp_status:applyInfo.sp_status,
            dd_status:applyInfo.dd_status,
            repeal_reason:$("#apply_modal textarea[name='repeal_reason']").val(),
        };
        ApplyAction.repeal(data,function(){
            $("#apply_modal").modal('toggle');
            ApplyStore.trigger('addApply');
        });
    },
    render: function() {
        let that =  this;
        let applyInfo = that.state.applyInfo;
        return (
            <div id="apply_modal" className="modal fade Reject">
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
                            <button type="button" className="btnOne btn-green" onClick={this.handleClickSubmit}><i className="icon-bg agree-icon"></i>提 交</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export  default  ApplyModal;