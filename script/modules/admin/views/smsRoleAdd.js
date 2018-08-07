/**
 * @file 短信角色新增
 * @author Banji 2017.10.30
 */

import React, { Component } from 'react';
import { render } from 'react-dom';

import SmsRoleAction from '../actions/smsRoleAction';
import SmsRoleStore from  '../stores/smsRoleStore';

var SmsRoleAdd = React.createClass({
    getInitialState: function() {
        return{
            isSpeed:false,
            isCross:false,
            isLllegal:false,
            isPlug:false,
            isOuttime:false,
        }
    },
    componentDidMount: function () {
        let that = this;
        that.initRoleFormValidator();
        SmsRoleStore.listen(this.listenFun);
        $('#smsRoleAdd').on('hide.bs.modal', function (e) {
            if(e.target.tagName === "DIV") that.clearModal();
        });
    },
    listenFun:function (type,result) {
        switch (type){
            case "updateSmsRole":
                this.setModalValue(result);
                break;
        }
    },
    setModalValue:function (data) {
        let that = this;
        $("#sms_role_title").html("编辑短信角色");
        $("input[name='id']").val(data.id);
        $("input[name='name']").val(data.name);
        $("input[name='descr']").val(data.descr);
        let sendTypes = !!data.sendtypes?data.sendtypes.split(','):[];
        if(sendTypes.length > 0){
            sendTypes.forEach(function(type){
                that.setCheckedSendType(type);
            });

        }
    },
    setCheckedSendType: function (type) {
        switch(+type){
            case 2:
                this.setState({
                    isSpeed:this.state.isSpeed ? false : true
                });
                break;
            case 1:
                this.setState({
                    isCross:this.state.isCross ? false : true
                });
                break;
            case 0:
                this.setState({
                    isLllegal:this.state.isLllegal ? false : true
                });
                break;
            case 4:
                this.setState({
                    isPlug:this.state.isPlug ? false : true
                });
                break;
            case 3:
                this.setState({
                    isOuttime:this.state.isOuttime ? false : true
                });
                break;
        }
    },
    getSendTypes:function () {
        let typeFilters = "";
        if(this.state.isSpeed){
            typeFilters += "2,"
        }
        if(this.state.isCross){
            typeFilters += "1,"
        }
        if(this.state.isLllegal){
            typeFilters += "0,"
        }
        if(this.state.isPlug){
            typeFilters += "4,"
        }
        if(this.state.isOuttime){
            typeFilters += "3,"
        }
        typeFilters = typeFilters.substr(0,typeFilters.length - 1);
        return typeFilters;
    },
    initRoleFormValidator: function(){
        $('#sms_role_form').bootstrapValidator({
            message: 'This value is not valid',
            fields: {
                name: {
                    message: 'The name is not valid',
                    container: '#role-err-info',
                    validators: {
                        notEmpty: {
                            message: '请输短信角色名称！'
                        },
                    }
                },
            }
        });
    },
    handleSaveSmsRole:function (event) {
        var bootstrapValidator = $('#sms_role_form').data('bootstrapValidator');
        bootstrapValidator.validate();//触发验证
        if(bootstrapValidator.isValid()){
            let that = this;
            let sendTypes = this.getSendTypes();
            let params = {
                id: $("input[name='id']").val(),
                name: $("input[name='name']").val(),
                descr: $("input[name='descr']").val(),
                sendtypes:sendTypes
            };
            if(!!params.id) {
                SmsRoleAction.updateSmsRole(params,function(){
                    $("#smsRoleAdd").modal("hide");
                    that.clearModal();
                });
            } else {
                SmsRoleAction.addSmsRole(params,function(){
                    $("#smsRoleAdd").modal("hide");
                    that.clearModal();
                });
            }
        }
    },
    handleChangeSendType:function (type,event) {
        this.setCheckedSendType(type);
    },
    clearModal:function () {
        this.setState({
            isSpeed:false,
            isCross:false,
            isLllegal:false,
            isPlug:false,
            isOuttime:false
        });
        $("input[name='id']").val("");
        $("input[name='name']").val("");
        $("input[name='descr']").val("");
        $('#sms_role_form').data('bootstrapValidator').resetForm();
    },
    render: function () {
        return (
            <div className="modal fade bs-example-modal-lg" id="smsRoleAdd">
                <form id="sms_role_form">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="sms_role_title">新增角色</h4>
                            </div>
                            <div className="modal-body">
                                <div className="mesSet-box">
                                    <input type="hidden" id="id" name="id"></input>
                                    <ul className="modal-form-con">
                                        <li className="form-group">
                                            <span className="span"><span className="red">*&nbsp;</span>短信角色名称：</span>
                                            <input type="text" id="name" name="name" />
                                        </li>
                                        <li className="form-group">
                                            <span className="span">短信角色描述：</span>
                                            <input type="text" id="descr" name="descr" />
                                        </li>
                                    </ul>
                                    <ul id="role-err-info" className="form-group"></ul>
                                    <ul className="mesSet-con">
                                        <li>超速<label className="f-r"><input className="mui-switch mui-switch-anim" type="checkbox" checked={this.state.isSpeed ? "checked" : ""} onClick={this.handleChangeSendType.bind(null,2)}/></label></li>
                                        <li>越界<label className="f-r"><input className="mui-switch mui-switch-anim" type="checkbox" checked={this.state.isCross ? "checked" : ""} onClick={this.handleChangeSendType.bind(null,1)}/></label></li>
                                        <li>违章<label className="f-r"><input className="mui-switch mui-switch-anim" type="checkbox" checked={this.state.isLllegal ? "checked" : ""} onClick={this.handleChangeSendType.bind(null,0)}/></label></li>
                                        <li>设备拔插<label className="f-r"><input className="mui-switch mui-switch-anim" type="checkbox" checked={this.state.isPlug ? "checked" : ""} onClick={this.handleChangeSendType.bind(null,4)}/></label></li>
                                        <li>非规定时间<label className="f-r"><input className="mui-switch mui-switch-anim" type="checkbox" checked={this.state.isOuttime ? "checked" : ""} onClick={this.handleChangeSendType.bind(null,3)}/></label></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.handleSaveSmsRole}>保 存</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
});

export default SmsRoleAdd;