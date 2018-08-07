/**
 * @file 公用模态框，用于消息提示  例如删除某个数据时提示
 * @author Banji 2017.11.14
 * @file http://www.runoob.com/bootstrap/bootstrap-modal-plugin.html
 */

import React, { Component } from 'react'
import { render } from 'react-dom'

import CommonStore from '../stores/commonStore';


var ImgModal = React.createClass({
    getInitialState: function() {
        return {
            title: "查看图片",
            imgUrl: "",
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
            case 'showImgModal':
                this.showImgModal(params);
                break;
        }
    },
    showImgModal: function(params){
        this.setState(params);
        $("#img_modal").modal("show");
    },
    render: function () {
        return (
            <div className="modal fade" id="img_modal" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 className="modal-title" id="modalLabel">{this.state.title}</h4>
                        </div>
                        <div className="modal-body">
                            <a href="#" className="thumbnail">
                                <img src={this.state.imgUrl}/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export default ImgModal;