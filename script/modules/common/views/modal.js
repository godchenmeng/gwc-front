/**
 * @file 公用模态框，用于消息提示  例如删除某个数据时提示
 * @author Banji 2017.11.14
 * @file http://www.runoob.com/bootstrap/bootstrap-modal-plugin.html
 */

import React, { Component } from 'react'
import { render } from 'react-dom'

import CommonStore from '../stores/commonStore';


var Modal = React.createClass({
    getInitialState: function() {
        return {
            title: "提示",
            msg: "",
            btnok: "确定",
            btncl: "取消",
            btnclShow: false,
            smallShow: true
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
            case 'showModal':
                this.showModal(params);
                break;
        }
    },
    showModal: function(params){
        this.setState(params);
        $("#modal").modal("show");
        if(params.callback) {
            $("#modal").find("button.btn-primary").unbind('click').on("click",function(){
                params.callback();
            })
        }
    },
    render: function () {
        return (
            <div className="modal fade" id="modal" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
                <div className={this.state.smallShow?"modal-dialog modal-sm":"modal-dialog"}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                &times;
                            </button>
                            <h4 className="modal-title" id="modalLabel">{this.state.title}</h4>
                        </div>
                        <div className="modal-body">{this.state.msg}</div>
                        <div className="modal-footer">
                            <button type="button" className={this.state.btnclShow?"btn btn-default":"btn btn-default hide"} data-dismiss="modal">{this.state.btncl}</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal">{this.state.btnok}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export default Modal;