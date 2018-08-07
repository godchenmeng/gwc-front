/**
 * @file 用车申请详情 Reflux View
 * @author Banji 2017.08.03
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import Urls from '../../../common/urls'

import ApplyAction from '../actions/applyAction'
import ApplyStore from '../stores/applyStore'
import CommonStore from "../../common/stores/commonStore";

var ApplyInfo = React.createClass({
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
        }
    },
    componentDidMount: function () {
        let that = this;
        that.initData();
        that.unsubscribe = ApplyStore.listen(that.listenEvent);
    },
    componentWillUnmount:function(){
        this.unsubscribe();//解除监听
    },
    listenEvent: function(type,result){
        switch (type){
            case 'addApply':
                this.addApplyInfo(result);
                break;
        }
    },
    addApplyInfo:function(value){
        let that = this;
        that.initData();
    },
    initData:function(){
        let that = this;
        Urls.get(Urls.applyFirst,{},function(data){
            if(data.responseCode == "1" && data.responseMsg == "success"){
                if(!!data.datas){
                    that.setState({applyInfo:data.datas});
                }
            }else{
                toastr.error(data.responseMsg);
            }
        });
    },
    handleClickHistoryData:function(event){
        window.location.href = 'dispatch.html?act=ApplyList';
    },
    handleClickRepeal:function(event){
        let that = this;
        $("#apply_modal").modal('toggle');
        ApplyStore.trigger('repealApply',that.state.applyInfo);
    },
    handleClickEdit: function(event){
        ApplyStore.trigger('editApply',this.state.applyInfo);
    },
    handleClickCopy: function(event){
        ApplyStore.trigger('copyApply',this.state.applyInfo);
    },
    render: function () {
        let that = this;
        let applyInfo = this.state.applyInfo;
        return (
            <div className="bg-box mart-pad ">
                <div className={applyInfo.id > 0?"":"hide"}>
                    <div className="approve-state">
                        <span className={applyInfo.apply_status == "1"?"shenpi":"shenpi hide"}>待审批</span>
                        <span className={applyInfo.apply_status == "2"?"diaodu":"diaodu hide"}>待调度</span>
                        <span className={applyInfo.apply_status == "3"?"chuche":"chuche hide"}>待出车</span>
                        <span className={applyInfo.apply_status == "4"?"chuche":"chuche hide"}>待完成</span>
                        <span className={applyInfo.apply_status == "5"?"bohui":"bohui hide"}>已完成</span>
                    </div>
                    <div className="action-icon">
                        <a className={(applyInfo.apply_status == "1" || applyInfo.apply_status == "2" || applyInfo.apply_status == "3")?"revoke":"revoke hide"} title="撤销" onClick={that.handleClickRepeal}></a>
                        <a className={(applyInfo.apply_status == "1" || applyInfo.apply_status == "6")?"edit":"edit hide"} title="编辑" onClick={that.handleClickEdit}></a>
                        <a className="c-add" title="复制并新增" onClick={that.handleClickCopy}></a>
                    </div>
                    <p><span className="text-title">用车人：</span><span>{applyInfo.use_name}</span></p>
                    <p><span className="text-title">用车时间：</span><span>{applyInfo.plan_time.substring(5,applyInfo.plan_time.length-3)+" 至 "+applyInfo.plan_return.substring(5,applyInfo.plan_return.length-3)}</span></p>
                    <p><span className="text-title">用车人电话：</span><span>{applyInfo.use_mobile}</span></p>
                    <p><span className="text-title">用车人数：</span><span className="orange">{applyInfo.use_number+"人"}</span></p>
                    <p><span className="text-title">用车类型：</span><span>{!!applyInfo.type_name?applyInfo.type_name:""}</span></p>
                    <p><span className="text-title">用车事由：</span><span>{applyInfo.reason}</span></p>
                    <p><span className="text-title">用车单位：</span><span>{applyInfo.user_org_name}</span></p>
                    <p><span className="text-title">上车地点：</span><span>{applyInfo.start_place}</span></p>
                    <p><span className="text-title">目的地：</span><span>{applyInfo.end_place}</span></p>
                    <p><span className="text-title">备 注：</span><span>{applyInfo.texts}</span></p>
                    <div  className="detailed-group" style={{textAlign: 'center'}}>
                        <button className="btn btn-record" onClick={that.handleClickHistoryData}>查看历史记录</button>
                    </div>
                </div>
                <div className={applyInfo.id > 0?"hide":""} style={{textAlign:'center',marginTop:'50px',height:'290px'}}>
                    <img src={__uri("/static/images/nodata-2.png")}/>
                </div>
            </div>
        )
    }
});

export default ApplyInfo;