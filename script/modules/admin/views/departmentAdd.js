/**
 * @file 新增部门
 * @author CM 2017.08.22
 */

import React, { Component } from 'react'
import { render } from 'react-dom'

import DepartmentAction from '../actions/departmentAction';
import DepartmentStore from  '../stores/departmentStore';

var DepartmentAdd = React.createClass({
    componentDidMount: function () {
        let that = this;
        that.initDepartmentFormValidator();
        DepartmentStore.listen(this.listenFun);
        $('#departmentAdd').on('show.bs.modal', function () {
            $("#department_title").html("新增机构");
        })
        $('#departmentAdd').on('hide.bs.modal', function (e) {
            if(e.target.tagName === "DIV") that.clearBox();
        })
    },
    listenFun:function (type,result) {
        switch (type){
            case "updatedepartmentsuccess":
                $("#departmentAdd").modal("hide");
                this.clearBox();
                break;
            case "editdepartment":
                this.editDepartment(result);
                break;
        }
    },

    initDepartmentFormValidator: function(){
        $('#department_add_form').bootstrapValidator({
            message: 'This value is not valid',
            fields: {
                departmentname: {
                    message: 'The departmentname is not valid',
                    container: '#department-err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入机构名称！'
                        },
                    }
                },
                departmentshortname:{
                    message: 'The departmentshortname is not valid',
                    container: '#department-err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入机构简称！'
                        },
                    }
                },
                departmentphone: {
                    message: 'The departmentphone is not valid',
                    container: '#department-err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入移动电话号码！'
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
            }
        });
    },
    handleAddDepartment:function (event) {
        var bootstrapValidator = $('#department_add_form').data('bootstrapValidator');
        bootstrapValidator.validate();//触发验证
        if(bootstrapValidator.isValid()){
            let departmentParam = {
                type: 2,
                name:$('#department_name').val(),
                short_name:$('#department_short_name').val(),
                relation:$('#department_contact').val(),
                phone:$('#department_tel').val(),
                mobile:$('#department_phone').val(),
                address:$('#department_addr').val(),
            };
            if($('#department_id').val() != 0){
                departmentParam.id = $('#department_id').val();
                DepartmentAction.updatedepartment(departmentParam);
            }else{
                departmentParam.org_id = $('#dep_parent_id').val();
                DepartmentAction.adddepartment(departmentParam);
            }
        }
    },
    editDepartment:function (department) {
        $("#departmentAdd").modal("show");
        $("#department_title").html("编辑部门");
        $('#department_id').val(department.id);
        $('#department_name').val(department.name);
        $('#department_short_name').val(department.short_name);
        $('#department_contact').val(department.relation);
        $('#department_tel').val(department.phone);
        $('#department_phone').val(department.mobile);
        $('#department_addr').val(department.address);
    },
    clearBox:function () {
        $('#department_id').val(0);
        $('#department_name').val('');
        $('#department_short_name').val('');
        $('#department_contact').val('');
        $('#department_tel').val('');
        $('#department_phone').val('');
        $('#department_addr').val('');
        $('#department_add_form').data('bootstrapValidator').resetForm();
    },
    render: function () {
        return (
            <div className="modal fade bs-example-modal-lg" id="departmentAdd">
                <form id="department_add_form">
                    <input type="hidden" name="departmentid" id="department_id" value="0" />
                    <input type="hidden" name="depparentid" id="dep_parent_id" value="0" />
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="department_title">新增部门</h4>
                            </div>
                            <div className="modal-body">
                                <ul className="modal-form-con">
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>部门名称：</span>
                                        <input type="text" id="department_name" name="departmentname" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>部门简称：</span>
                                        <input type="text" id="department_short_name" name="departmentshortname" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span">联系人：</span>
                                        <input type="text" id="department_contact" name="departmentcontact"/>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">办公室电话：</span>
                                        <input type="text" id="department_tel" name="departmenttel"/>
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>联系人电话：</span>
                                        <input type="text" id="department_phone" name="departmentphone"/>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">地址：</span>
                                        <input type="text" id="department_addr" name="departmentaddr"/>
                                    </li>
                                    <li id="department-err-info" style={{paddingLeft:'40%',width:'100%'}}>

                                    </li>
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.handleAddDepartment}>提 交</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
});

export default DepartmentAdd;