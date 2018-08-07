/**
 * @file 用车申请总览 Reflux View
 * @author Banji 2017.08.03
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import Urls from '../../../common/urls';

import ApplyStore from '../stores/applyStore';

import CommonStore from '../../common/stores/commonStore';

var ApplyOverview = React.createClass({
    getInitialState: function() {
        return {
            applyOverview:{
                "apply_status_1": 0,//待审批条数
                "apply_status_2": 0,//待调度条数
                "apply_status_3": 0,//待出车条数
                "apply_status_6": 0 //驳回条数
            },
        }
    },
    componentDidMount: function () {
        let that = this;
        that.initData();
        that.unsubscribe = ApplyStore.listen(that.listenEvent);
    },
    componentWillUnmount:function(){
        this.unsubscribe(); //解除监听
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
    initData: function(){
        let that = this;
        Urls.post(Urls.applyCount,{},function(data){
            if(data.responseCode == "1" && data.responseMsg == "success"){
                that.setState({applyOverview:data.datas});
            }else{
                toastr.error(data.responseMsg);
            }
        });
    },
    handleClickStatus:function(event){
        let status = $(event.target).data("status");
        ApplyStore.data.currentSelectStatus = status;
        CommonStore.trigger('switchtab', 'ApplyList');
    },
    render: function () {
        let that = this;
        return (
            <div className="bg-box">
                <ul className="state-ul">
                    <li data-status="6" onClick={that.handleClickStatus}>驳 回<span className="right bohui">{that.state.applyOverview.apply_status_6}</span></li>
                    <li data-status="1" onClick={that.handleClickStatus}>待审批 <span className="right shenpi">{that.state.applyOverview.apply_status_1}</span></li>
                    <li data-status="2" onClick={that.handleClickStatus}>待调度 <span className="right diaodu">{that.state.applyOverview.apply_status_2}</span></li>
                    <li data-status="3" onClick={that.handleClickStatus}>待出车 <span className="right chuche">{that.state.applyOverview.apply_status_3}</span></li>
                </ul>
            </div>
        )
    }
});

export default ApplyOverview;