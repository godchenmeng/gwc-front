/**
 * @file 新增账号
 * @author CM 2017.08.17
 */

import React, { Component } from 'react'
import { render } from 'react-dom'

import UserAction from '../actions/userAction';
import UserStore from  '../stores/userStore';
import Urls from '../../../common/urls';

var AccountAdd = React.createClass({
    componentDidMount: function () {
        let that = this;
        that.initRoleSelect();
        that.initAccountFormValidator();
        UserStore.listen(this.listenFun);
        $('#accountAdd').on('show.bs.modal', function () {
            $("#acc_title").html("新增账号");
            $('#acc_id').val('0');
        })
        $('#accountAdd').on('hide.bs.modal', function (e) {
            if(e.target.tagName === "DIV") that.clearBox();
        })
    },
    listenFun:function (type,result) {
        switch (type){
            case "updateaccountsuccess":
                this.clearBox();
                $('#acc_id').val('0');
                $('#acc_user_id').val('0');
                break;
            case "editaccount":
                this.editAccount(result);
                break;
        }
    },
    initRoleSelect:function () {
        let param = {};
        Urls.get(Urls.loadorgrole,param,function (result) {
            let roleSelecter = $("#acc_role");
            for(let i = 0; i < result.length; i++){
                roleSelecter.append("<option value='" + result[i].id + "'>" + result[i].name + "</option>");
            }
        })
    },
    initAccountFormValidator: function(){
        $('#acc_add_form').bootstrapValidator({
            message: 'This value is not valid',
            fields: {
                loginname: {
                    message: 'The loginname is not valid',
                    container: '#acc-err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入登录名！'
                        },
                        callback:{
                            message:'登录名已存在',
                            callback: function (value, validator, $field) {
                                if($("#acc_id").val() == 0){
                                    let isValid = false;
                                    let param = {
                                        login_name: $("#login_name").val()
                                    }
                                    Urls.customAJAX(Urls.checkloginname,param,'GET','text',false,function (result) {
                                        if(result == null || result == ''){
                                            isValid = true;
                                        }else{
                                            isValid = false;
                                        }
                                    });
                                    return isValid;
                                }else{
                                    return true;
                                }

                            }
                        },
                    }
                },
                accpass:{
                    message: 'The accpass is not valid',
                    container: '#acc-err-info',
                    validators: {
                        notEmpty: {
                            message: '登录密码不能为空！'
                        },
                    }
                },
                accrepass:{
                    message: 'The repass is not valid',
                    container: '#acc-err-info',
                    validators: {
                        notEmpty: {
                            message: '确认密码不能为空！'
                        },
                        identical: {
                            field: 'accpass',
                            message: '两次输入密码不一致'
                        }
                    }
                },
                accorgname: {
                    message: 'the user org is not valid',
                    container: '#acc-err-info',
                    validators: {
                        notEmpty: {
                            message: '请选择机构部门！'
                        },
                    }
                },
                accorg: {
                    message: 'the user org is not valid',
                    container: '#acc-err-info',
                    validators: {
                        notEmpty: {
                            message: '请选择机构部门！'
                        },
                    }
                }
            }
        });
    },
    handleAddAccount:function (event) {
        var bootstrapValidator = $('#acc_add_form').data('bootstrapValidator');
        bootstrapValidator.validate();//触发验证
        if(bootstrapValidator.isValid()){
            let accountParam = {
                names: $('#acc_name').val(),
                login_name: $('#login_name').val(),
                app:$('#app').val(),
                web:$('#web').val(),
                show_name:$('#acc_org_name').val(),
                org:$('#acc_org').val(),
                role:$('#acc_role').val(),
                leader:$('#leader').val(),
                status:$('#acc_state').val(),
            };
            if($('#acc_id').val() != 0){
                accountParam.id = $('#acc_id').val();
                UserAction.updateaccount(accountParam);
            }else{
                accountParam.mid = $('#acc_user_id').val();
                accountParam.password = $('#acc_pass').val();
                accountParam.password1 = $('#acc_re_pass').val();
                UserAction.addaccount(accountParam);
            }
        }
    },
    editAccount:function (account) {
        $("#accountAdd").modal("show");
        $("#acc_title").html("编辑账号");
        $("#acc_id").val(account.id);
        $('#acc_name').val(account.user_name);
        $('#login_name').val(account.name);
        $('#login_name').attr("readonly",true);
        $('#acc_pass').val("123456");
        $('#acc_pass').hide();
        $('#acc_pass_span').hide();
        $('#acc_re_pass').val("123456");
        $('#acc_re_pass').hide();
        $('#acc_re_pass_span').hide();
        $('#acc_tree').css("top","120px");
        $('#acc_org_name').val(account.oname);
        $('#acc_org').val(account.org);
        $('#app').val(account.app);
        $('#web').val(account.web);
        $('#acc_role').val(account.role);
        $('#leader').val(account.leader);
    },
    clearBox:function () {
        $('#acc_add_form').data('bootstrapValidator').resetForm();
        $('#acc_user_id').val(0);
        $('#acc_name').val('');
        $('#login_name').val('');
        $('#acc_pass').val('');
        $('#acc_re_pass').val('');
        $('#app').val(1);
        $('#web').val(1);
        $('#acc_org_name').val('');
        $('#acc_org').val('');
        $('#acc_role').val(1);
        $('#leader').val(1);
        $('#acc_state').val(1);
    },
    render: function () {
        return (
            <div className="modal fade bs-example-modal-lg" id="accountAdd">
                <form id="acc_add_form">
                    <input type="hidden" name="accid" id="acc_id" value="0" />
                    <input type="hidden" name="accuserid" id="acc_user_id" value="0" />
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="acc_title">新增账号</h4>
                            </div>
                            <div className="modal-body">
                                <ul className="modal-form-con">
                                    <li className="form-group">
                                        <span className="span">用户姓名：</span>
                                        <input type="text" id="acc_name" name="accname" readOnly />
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>登录名：</span>
                                        <input type="text" id="login_name" name="loginname" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span" id="acc_pass_span"><span className="red">*&nbsp;</span>密码：</span>
                                        <input type="password" id="acc_pass" name="accpass" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span" id="acc_re_pass_span"><span className="red">*&nbsp;</span>确认密码：</span>
                                        <input type="password" id="acc_re_pass" name="accrepass" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>机构部门：</span>
                                        <input type="text" id="acc_org_name" name="accorgname" readOnly={true}/>
                                        <input type="hidden" id="acc_org" name="accrorg" />
                                        <div id="acc_tree" className="openTree-menu" style={{width: "240px",maxHeight: "150px"}}></div>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">能否登录APP：</span>
                                        <select id="app"><option value="1">能</option><option value="2">不能</option></select>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">能否登录WEB：</span>
                                        <select id="web"><option value="1">能</option><option value="2">不能</option></select>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">状态：</span>
                                        <select id="acc_state"><option value="1">使用</option></select>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">角色：</span>
                                        <select id="acc_role"></select>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">是否领导：</span>
                                        <select id="leader"><option value="1">是</option><option value="2">不是</option></select>
                                    </li>
                                    <li id="acc-err-info" style={{paddingLeft:'40%',width:'100%'}}>

                                    </li>
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.handleAddAccount}>提 交</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
});

export default AccountAdd;