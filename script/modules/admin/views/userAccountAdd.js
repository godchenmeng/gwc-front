/**
 * @file 新增用户
 * @author CM 2017.08.16
 */

import React, { Component } from 'react'
import { render } from 'react-dom'

import UserAction from '../actions/userAction';
import UserStore from  '../stores/userStore';
import Urls from '../../../common/urls';

var UserAdd = React.createClass({
    componentDidMount: function () {
        let that = this;
        UserStore.listen(this.listenFun);
        that.initUserAccountFormValidator();
        that.initRoleSelect();
        UserStore.initSmsRoleSelect("sms_role");
        $('#userAccountAdd').on('hide.bs.modal', function (e) {
            if(e.target.tagName === "DIV") that.handleUserAccountClearBox(null);
        })
    },
    listenFun:function (type,result) {
        switch (type){
            case "adduseraccountsuccess":
                this.handleUserAccountClearBox(null);
                break;
        }
    },
    initRoleSelect:function () {
        let param = {};
        Urls.get(Urls.loadorgrole,param,function (result) {
            let roleSelecter = $("#user_acc_role");
            for(let i = 0; i < result.length; i++){
                roleSelecter.append("<option value='" + result[i].id + "'>" + result[i].name + "</option>");
            }
        })
    },
    initUserAccountFormValidator: function(){
        $('#user_acc_add_form').bootstrapValidator({
            message: 'This value is not valid',
            fields: {
                useraccname: {
                    message: 'The username is not valid',
                    container: '#user-acc-err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入用户姓名！'
                        },
                    }
                },
                useraccphone: {
                    message: 'The userphone is not valid',
                    container: '#user-acc-err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入手机号码！'
                        },
                        stringLength: {
                            min: 11,
                            max: 11,
                            message: '请输入11位手机号码'
                        },
                        regexp: {
                            regexp: /^1[3|5|7|8]{1}[0-9]{9}$/,
                            message: '请输入正确的手机号码'
                        }
                    }
                },
                useraccorgname: {
                    message: 'the user org is not valid',
                    container: '#user-acc-err-info',
                    trigger:"change",
                    validators: {
                        notEmpty: {
                            message: '请选择机构部门！'
                        },
                    }
                },
                useraccorg: {
                    message: 'the user org is not valid',
                    container: '#user-acc-err-info',
                    validators: {
                        notEmpty: {
                            message: '请选择机构部门！'
                        },
                    }
                },
                useraccloginname: {
                    message: 'The loginname is not valid',
                    container: '#user-acc-err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入登录名！'
                        },
                        callback:{
                            message:'登录名已存在',
                            callback: function (value, validator, $field) {
                                let isValid = false;
                                let param = {
                                    login_name: $("#user_acc_login_name").val()
                                }
                                Urls.customAJAX(Urls.checkloginname,param,'GET','text',false,function (result) {
                                    if(result == null || result == ''){
                                        isValid = true;
                                    }else{
                                        isValid = false;
                                    }
                                });
                                return isValid;
                            }
                        },
                    }
                },
                useraccpass:{
                    message: 'The accpass is not valid',
                    container: '#user-acc-err-infoo',
                    validators: {
                        notEmpty: {
                            message: '登录密码不能为空！'
                        },
                    }
                },
                useraccrepass:{
                    message: 'The repass is not valid',
                    container: '#user-acc-err-info',
                    validators: {
                        notEmpty: {
                            message: '确认密码不能为空！'
                        },
                        identical: {
                            field: 'useraccpass',
                            message: '两次输入密码不一致'
                        }
                    }
                },
                work_acc_phone: {
                    message: 'the work account phone is not valid',
                    container: '#user-acc-err-info',
                    validators: {
                        regexp: {
                            regexp: /^(\d{7,8}\b)$/,
                            message: '请输入正确的工作号码'
                        }
                    }
                }
            }
        });
    },
    handleAddUserAccount:function (event) {
        var bootstrapValidator = $('#user_acc_add_form').data('bootstrapValidator');
        bootstrapValidator.validate();//触发验证
        if(bootstrapValidator.isValid()){
            let userParam = {
                user_name: $('#user_acc_name').val(),
                sex: $('#user_acc_sex').val(),
                code:$('#user_acc_code').val(),
                mobile:$('#user_acc_phone').val(),
                phone:$('#work_acc_phone').val(),
                show_name:$('#user_acc_org_name').val(),
                org:$('#user_acc_org').val(),
                driver:2,
                status:$('#user_acc_state').val(),
                login_name: $('#user_acc_login_name').val(),
                password: $('#user_acc_pass').val(),
                password1:$('#user_acc_re_pass').val(),
                app:$('#user_acc_app').val(),
                web:$('#user_acc_web').val(),
                role:$('#user_acc_role').val(),
                sms_type:$('#sms_role').val(),
                leader:$('#user_acc_leader').val(),
            };
            UserAction.adduseraccount(userParam);
        }
    },
    handleUserAccountClearBox:function (event) {
        $('#user_acc_add_form').data('bootstrapValidator').resetForm();
        $('#user_acc_name').val('');
        $('#user_acc_sex').val(1);
        $('#user_acc_code').val('');
        $('#user_acc_phone').val('');
        $('#work_acc_phone').val('');
        $('#user_acc_org_name').val('');
        $('#user_acc_org').val('');
        $('#user_acc_state').val(1);
        $('#user_acc_login_name').val('');
        $('#user_acc_pass').val('');
        $('#user_acc_re_pass').val('');
        $('#user_acc_app').val(1);
        $('#user_acc_web').val(1);
        $('#user_acc_role').val($('#user_acc_role option:first').val());
        $('#sms_role').val($('#sms_role option:first').val());
        $('#user_acc_leader').val(1);
    },
    render: function () {
        return (
            <div className="modal fade bs-example-modal-lg" id="userAccountAdd" style={{overflowY:'scroll'}}>
                <form id="user_acc_add_form">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="user_acc_title">新增用户和账号</h4>
                            </div>
                            <div className="modal-body">
                                <ul className="modal-form-con">
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>用户姓名：</span>
                                        <input type="text" id="user_acc_name" name="useraccname" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span">性别：</span>
                                        <select id="user_acc_sex"><option value="1">男</option><option value="2">女</option></select>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">工号：</span><input type="text" id="user_acc_code" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>手机号码：</span>
                                        <input type="text" id="user_acc_phone" name="useraccphone"/>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">工作号码：</span><input type="text" id="work_acc_phone" name="work_acc_phone"/>
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>机构部门：</span>
                                        <input type="text" id="user_acc_org_name" name="useraccorgname"/>
                                        <input type="hidden" id="user_acc_org" name="useraccorg" />
                                        <div id="user_acc_org_tree" className="openTree-menu"  style={{width: "240px",maxHeight: "150px"}}></div>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">状态：</span>
                                        <select id="user_acc_state"><option value="1">使用</option></select>
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>登录名：</span>
                                        <input type="text" id="user_acc_login_name" name="useraccloginname" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>密码：</span>
                                        <input type="password" id="user_acc_pass" name="useraccpass" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>确认密码：</span>
                                        <input type="password" id="user_acc_re_pass" name="useraccrepass" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span">能否登录APP：</span>
                                        <select id="user_acc_app"><option value="1">能</option><option value="2">不能</option></select>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">能否登录WEB：</span>
                                        <select id="user_acc_web"><option value="1">能</option><option value="2">不能</option></select>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">权限角色：</span>
                                        <select id="user_acc_role"></select>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">短信角色：</span>
                                        <select id="sms_role"></select>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">是否领导：</span>
                                        <select id="user_acc_leader"><option value="1">是</option><option value="2">不是</option></select>
                                    </li>
                                    <li id="user-acc-err-info" style={{paddingLeft:'40%',width:'100%'}}>

                                    </li>
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.handleAddUserAccount}>提 交</button>
                                <button type="button" className="btn btn-default" onClick={this.handleUserAccountClearBox}>清 空</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
});

export default UserAdd;