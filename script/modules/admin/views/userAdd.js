/**
 * @file 新增用户
 * @author CM 2017.08.16
 */

import React, { Component } from 'react'
import { render } from 'react-dom'

import UserAction from '../actions/userAction';
import UserStore from  '../stores/userStore';

var UserAdd = React.createClass({
    componentDidMount: function () {
        let that = this;
        UserStore.listen(this.listenFun);
        that.initUserFormValidator();
        $('#userAdd').on('show.bs.modal', function () {
            $("#user_title").html("新增用户");
            $('#user_id').val('0');
        });
        $('#userAdd').on('hide.bs.modal', function (e) {
            if(e.target.tagName === "DIV") that.handleClearBox(null);
        });
        UserStore.initSmsRoleSelect("sms_role_add");
    },
    listenFun:function (type,result) {
        switch (type){
            case "updateusersuccess":
                this.handleClearBox(null);
                $('#user_id').val('0');
                break;
            case "edituser":
                this.editUser(result);
                break;
        }
    },
    initUserFormValidator: function(){
        $('#user_add_form').bootstrapValidator({
            message: 'This value is not valid',
            fields: {
                username: {
                    message: 'The username is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入用户姓名！'
                        },
                    }
                },
                userphone: {
                    message: 'The userphone is not valid',
                    container: '#err-info',
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
                userorgname: {
                    message: 'the user org is not valid',
                    container: '#err-info',
                    trigger: 'change',
                    validators: {
                        notEmpty: {
                            message: '请选择机构部门！'
                        },
                    }
                },
                userorg: {
                    message: 'the user org is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty: {
                            message: '请选择机构部门！'
                        },
                    }
                },
                work_phone: {
                    message: 'the work phone is not valid',
                    container: '#err-info',
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
    editUser:function (user) {
        $("#userAdd").modal("show");
        $("#user_title").html("编辑用户");
        $('#user_name').val(user.name);
        $('#user_sex').val(user.sex);
        $('#user_code').val(user.code);
        $('#user_phone').val(user.mobile);
        $('#work_phone').val(user.phone);
        $('#user_org_name').val(user.oname);
        $('#user_org').val(user.org);
        $('#user_state').val(user.status);
        $('#user_id').val(user.id);
        $('#sms_role_add').val(user.sms_type);
    },
    handleAddUser:function (event) {
        var bootstrapValidator = $('#user_add_form').data('bootstrapValidator');
        bootstrapValidator.validate();//触发验证
        if(bootstrapValidator.isValid()){
            let userParam = {
                name: $('#user_name').val(),
                sex: $('#user_sex').val(),
                code:$('#user_code').val(),
                mobile:$('#user_phone').val(),
                phone:$('#work_phone').val(),
                show_name:$('#user_org_name').val(),
                org:$('#user_org').val(),
                driver:2,
                status:$('#user_state').val(),
                sms_type:$('#sms_role_add').val(),
            };
            if($('#user_id').val() != 0){
                userParam.id = $('#user_id').val();
                UserAction.updateuser(userParam);
            }else{
                UserAction.adduser(userParam);
            }
        }
    },
    handleClearBox:function (event) {
        $('#user_add_form').data('bootstrapValidator').resetForm();
        $('#user_name').val('');
        $('#user_sex').val(1);
        $('#user_code').val('');
        $('#user_phone').val('');
        $('#work_phone').val('');
        $('#user_org_name').val('');
        $('#user_org').val('');
        $('#user_state').val(1);
        $('#sms_role_add').val($('#sms_role_add option:first').val());
    },
    render: function () {
        return (
            <div className="modal fade bs-example-modal-lg" id="userAdd" style={{overflowY:'scroll'}}>
                <form id="user_add_form">
                    <input type="hidden" name="userid" id="user_id" value="0" />
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="user_title">新增用户</h4>
                            </div>
                            <div className="modal-body">
                                <ul className="modal-form-con">
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>用户姓名：</span>
                                        <input type="text" id="user_name" name="username" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span">性别：</span>
                                        <select id="user_sex"><option value="1">男</option><option value="2">女</option></select>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">工号：</span><input type="text" id="user_code" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>手机号码：</span>
                                        <input type="text" id="user_phone" name="userphone"/>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">工作号码：</span><input type="text" id="work_phone" name="work_phone" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>机构部门：</span>
                                        <input type="text" id="user_org_name" name="userorgname" readOnly={true}/>
                                        <input type="hidden" id="user_org" name="userorg" />
                                        <div id="org_tree" className="openTree-menu" style={{width: "240px",maxHeight: "75px"}}></div>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">状态：</span>
                                        <select id="user_state"><option value="1">使用</option></select>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">短信角色：</span>
                                        <select id="sms_role_add" ></select>
                                    </li>
                                    <li id="err-info" style={{paddingLeft:'110px'}}>

                                    </li>
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.handleAddUser}>提 交</button>
                                <button type="button" className="btn btn-default" onClick={this.handleClearBox}>清 空</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
});

export default UserAdd;