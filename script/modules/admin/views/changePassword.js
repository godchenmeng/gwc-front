/**
 * @file 修改密码
 * @author CM 2017.08.21
 */

import React, { Component } from 'react'
import { render } from 'react-dom'

import UserAction from '/script/modules/admin/actions/userAction';
import UserStore from  '/script/modules/admin/stores/userStore';

var ChangePassword = React.createClass({
    componentDidMount: function () {
        let that = this;
        this.initChangePasswordFormValidator();
        UserStore.listen(this.listenFun);
        let cpName = this.props.cpName ? this.props.cpName : "changePW";
        $('#' + cpName).on('hide.bs.modal', function (e) {
            if(e.target.tagName === "DIV") that.handleClearBox(null);
        });
    },
    listenFun:function (type,result) {
        switch (type){
            case "changepwsuccess":
                this.handleClearBox(null);
                break;
        }
    },
    initChangePasswordFormValidator: function(){
        let formName = this.props.formName ? this.props.formName : "re_pass_form";
        let chErrInfoName = '#' + (this.props.chErrInfoName ? this.props.chErrInfoName : "ch_err_info");
        $('#' + formName).bootstrapValidator({
            message: 'This value is not valid',
            fields: {
                chpass:{
                    message: 'The chpass is not valid',
                    container: chErrInfoName,
                    validators: {
                        notEmpty: {
                            message: '密码不能为空！'
                        },
                    }
                },
                repass:{
                    message: 'The repass is not valid',
                    container: chErrInfoName,
                    validators: {
                        notEmpty: {
                            message: '确认密码不能为空！'
                        },
                        identical: {
                            field: 'chpass',
                            message: '两次输入密码不一致'
                        }
                    }
                }
            }
        });
    },
    handleChangePassword:function (event) {
        let formName = this.props.formName ? this.props.formName : "re_pass_form";
        let cpName = this.props.cpName ? this.props.cpName : "changePW";
        let userIDName = this.props.userIDName ? this.props.userIDName : "user_id";
        let chPassIDName = this.props.chPassIDName ? this.props.chPassIDName : "ch_pass";
        var bootstrapValidator = $('#' + formName).data('bootstrapValidator');
        bootstrapValidator.validate();//触发验证
        if(bootstrapValidator.isValid()){
            if($('#' + userIDName).val() > 0){
                UserAction.changepassword($("#" + userIDName).val(), $("#" + chPassIDName).val(),cpName);
            }
        }
    },
    handleClearBox:function (event) {
        let formName = this.props.formName ? this.props.formName : "re_pass_form";
        let userIDName = this.props.userIDName ? this.props.userIDName : "user_id";
        let chPassIDName = this.props.chPassIDName ? this.props.chPassIDName : "ch_pass";
        let rePassIDName = this.props.rePassIDName ? this.props.rePassIDName : "re_pass";
        $('#' + userIDName).val(0);
        $('#' + chPassIDName).val('');
        $('#' + rePassIDName).val('');
        $('#' + formName).data('bootstrapValidator').resetForm();
    },
    render: function () {
        let cpName = this.props.cpName ? this.props.cpName : "changePW";
        let formName = this.props.formName ? this.props.formName : "re_pass_form";
        let userIDName = this.props.userIDName ? this.props.userIDName : "user_id";
        let chPassIDName = this.props.chPassIDName ? this.props.chPassIDName : "ch_pass";
        let rePassIDName = this.props.rePassIDName ? this.props.rePassIDName : "re_pass";
        let chErrInfoName = this.props.chErrInfoName ? this.props.chErrInfoName : "ch_err_info";
        return (
            <div className="modal fade bs-example-modal-lg" id={cpName}>
                <form id={formName}>
                    <input type="hidden" name="userid" id={userIDName} value="0" />
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title">重置密码</h4>
                            </div>
                            <div className="modal-body">
                                <ul className="modal-form-con">
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>新的密码：</span>
                                        <input type="password" id={chPassIDName} name="chpass" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>确认密码：</span>
                                        <input type="password" id={rePassIDName} name="repass" />
                                    </li>
                                    <li id={chErrInfoName} style={{paddingLeft:'40%',width:'100%'}}>

                                    </li>
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.handleChangePassword}>提 交</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
});

export default ChangePassword;