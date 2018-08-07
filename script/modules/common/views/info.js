/**
 * @file 消息中心 Reflux View
 * @author Banji 2017.10.11
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import CommonAction from '../actions/commonAction'
import CommonStore from '../stores/commonStore'

import BootstrapTable from '../../../common/bootstrapTable'
import Urls from '../../../common/urls'

var Info = React.createClass({
    getInitialState: function() {
        return {
            columns:[{
                field: '',
                checkbox: true,
                align: 'center',
                valign: 'middle'
            },{
                field:'name',
                title:'部门',
                align:'center',
                valign:'middle',
                formatter:function (value,row,index) {
                    switch (row.status){
                        case "0"://未读
                            return value;
                            break;
                        case "1"://已读
                            return value;
                            break;
                        case "2"://置顶 取消置顶时，消息状态改为未读
                            return value + '&nbsp;<img src="' + __uri("/static/images/star-icon.png")+ '" class="mart-5">';
                            break;
                    }
                }
            },{
                field:'car_no',
                title:'车牌号',
                align:'center',
                valign:'middle'
            },{
                field:'happen_time',
                title:'时间',
                align:'center',
                valign:'middle'
            },{
                field:'illegal_type',
                title:'类型',
                align:'center',
                valign:'middle',
                width:'10%',
                formatter:function (value,row,index) {
                    switch (value){
                        case "0":
                            return "违章";
                            break;
                        case "1":
                            return "越界";
                            break;
                        case "2":
                            return "超速";
                            break;
                        case "3":
                            return "非规定时段";
                            break;
                        case "4":
                            return "供电中断";
                            break;
                        case "5":
                            return "保险到期";
                            break;
                        case "6":
                            return "年检到期";
                            break;
                        case "7":
                            return "保养提醒";
                            break;
                        case "8":
                            return "违规停运";
                            break;
                        case "9":
                            return "未入库";
                            break;
                        case "10":
                            return "无单用车";
                            break;
                    }
                }
            }],
        }
    },
    componentDidMount: function(){
        let that = this;
        that.unsubscribe = CommonStore.listen(that.listenEvent);
    },
    componentWillUnmount:function(){
        this.unsubscribe(); //解除监听
    },
    listenEvent: function(type,params){
        switch (type){
            case 'showInfoList':
                this.showInfoList(params);
                break;
        }
    },
    handleClickUpdate:function(event){
        let ids = BootstrapTable.getSelected("info_table",true);
        if(ids.length == 0){
            toastr.warning("请至少选择一行！");
            return;
        }
        let status = $(event.target).data("status");
        let params = {
            status:status,
            ids:ids
        };
        CommonAction.updateInfoStatus(params,function(){
            BootstrapTable.render("info_table");
        });
    },
    handleClickHistory:function(event){
        $("button#btn_read,button#btn_stick,button#btn_cancel_stick,button#btn_history").addClass("hide");
        $("button#btn_back").removeClass("hide");
        this.showInfoList("2");//只查看消息状态为已读的
    },
    handleClickBack:function (event) {
        $(event.target).addClass("hide");
        $("button#btn_read,button#btn_stick,button#btn_cancel_stick,button#btn_history").removeClass("hide");
        this.showInfoList("1");//只查看消息状态为未读或置顶的
    },
    showInfoList:function(find_type){
        let columns = this.state.columns;
        let queryParams = function (params) {//配置参数
            let param = {
                find_type:find_type,
                limit: params.limit,
                pageIndex: params.pageNumber - 1
            };
            return param;
        };
        $("#info_table").bootstrapTable("destroy");
        BootstrapTable.initTable("info_table", 5, [5,10], Urls.loadInfo, columns, queryParams, Urls.post);
    },
    render: function () {
        return (
            <div className="modal fade bs-example-modal-lg"  id="info_center_modal">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal"><span>&times;</span></button>
                            <h4 className="modal-title">消息中心</h4>
                        </div>
                        <div className="modal-body">
                            <div style={{height:"40px"}} >
                                <button type="button" data-status="1" id="btn_read" className="btnOne btn-bule font12" onClick={this.handleClickUpdate}><i className="icon-bg read-icon"></i>标记为已读</button>
                                <button type="button" data-status="2" id="btn_stick" className="btnOne btn-orange font12" onClick={this.handleClickUpdate}><i className="icon-bg star-icon"></i>置顶</button>
                                <button type="button" data-status="0" id="btn_cancel_stick" className="btnOne btn-grey font12" onClick={this.handleClickUpdate}><i className="icon-bg star-icon"></i>取消置顶</button>
                                <button type="button" id="btn_history" className="btnOne btn-green1 font12" onClick={this.handleClickHistory}><i className="icon-bg record-icon"></i>历史记录</button>
                                <button type="button" id="btn_back" className="btnOne btn-bule font12 hide" onClick={this.handleClickBack}><i className="icon-bg back-icon"></i>返回</button>
                            </div>
                            <table className="table-striped padding" id="info_table"></table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export default Info;