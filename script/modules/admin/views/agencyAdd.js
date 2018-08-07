/**
 * @file 新增机构
 * @author CM 2017.08.17
 */

import React, { Component } from 'react'
import { render } from 'react-dom'

import DepartmentAction from '../actions/departmentAction';
import DepartmentStore from  '../stores/departmentStore';

var AgencyAdd = React.createClass({
    componentDidMount: function () {
        let that = this;
        that.initAgencyFormValidator();
        DepartmentStore.listen(this.listenFun);
        $('#agencyAdd').on('show.bs.modal', function () {
            $("#agency_title").html("新增机构");
            $('#agency_id').val('0');
        })
        $('#agencyAdd').on('hide.bs.modal', function (e) {
            if(e.target.tagName === "DIV") that.clearBox();
        })
    },
    listenFun:function (type,result) {
        switch (type){
            case "updateagencysuccess":
                $("#agencyAdd").modal("hide");
                this.clearBox();
                break;
            case "editagency":
                this.editAgency(result);
                break;
        }
    },

    initAgencyFormValidator: function(){
        $('#agency_add_form').bootstrapValidator({
            message: 'This value is not valid',
            fields: {
                agencyname: {
                    message: 'The agencyname is not valid',
                    container: '#agency-err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入机构名称！'
                        },
                    }
                },
                agencyshortname:{
                    message: 'The agencyshortname is not valid',
                    container: '#agency-err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入机构简称！'
                        },
                    }
                },
                agencyphone: {
                    message: 'The agencyphone is not valid',
                    container: '#agency-err-info',
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
                agencysavetel: {
                    message: 'the agencysavetel org is not valid',
                    container: '#agency-err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入保险救援电话！'
                        },
                    }
                },
            }
        });
    },
    handleAddAgency:function (event) {
        var bootstrapValidator = $('#agency_add_form').data('bootstrapValidator');
        bootstrapValidator.validate();//触发验证
        if(bootstrapValidator.isValid()){
            let agencyParam = {
                type: 1,
                name:$('#agency_name').val(),
                short_name:$('#agency_short_name').val(),
                orders:$('#agency_index').val(),
                post_code:$('#agency_code').val(),
                relation:$('#agency_contact').val(),
                phone:$('#agency_tel').val(),
                mobile:$('#agency_phone').val(),
                texts:$('#agency_mem').val(),
                address:$('#agency_addr').val(),
                emergency:$('#agency_save_tel').val(),
            };
            if($('#agency_id').val() != 0){
                agencyParam.id = $('#agency_id').val();
                DepartmentAction.updateagency(agencyParam);
            }else{
                agencyParam.org_id = $('#parent_id').val();
                DepartmentAction.addagency(agencyParam);
            }
        }
    },
    editAgency:function (agency) {
        $("#agencyAdd").modal("show");
        $("#agency_title").html("编辑机构");
        $('#agency_id').val(agency.id);
        $('#agency_name').val(agency.name);
        $('#agency_short_name').val(agency.short_name);
        $('#agency_index').val(agency.orders);
        $('#agency_code').val(agency.post_code);
        $('#agency_contact').val(agency.relation);
        $('#agency_tel').val(agency.phone);
        $('#agency_phone').val(agency.mobile);
        $('#agency_addr').val(agency.address);
        $('#agency_save_tel').val(agency.emergency);
        $('#agency_mem').val(agency.texts);
    },
    clearBox:function () {
        $('#agency_id').val(0);
        $('#agency_name').val('');
        $('#agency_short_name').val('');
        $('#agency_index').val('');
        $('#agency_code').val('');
        $('#agency_contact').val('');
        $('#agency_tel').val('');
        $('#agency_phone').val('');
        $('#agency_addr').val('');
        $('#agency_save_tel').val('');
        $('#agency_mem').val('');
        $('#agency_add_form').data('bootstrapValidator').resetForm();
    },
    render: function () {
        return (
            <div className="modal fade bs-example-modal-lg" id="agencyAdd">
                <form id="agency_add_form">
                    <input type="hidden" name="agencyid" id="agency_id" value="0" />
                    <input type="hidden" name="parentid" id="parent_id" value="0" />
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="agency_title">新增机构</h4>
                            </div>
                            <div className="modal-body">
                                <ul className="modal-form-con">
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>机构名称：</span>
                                        <input type="text" id="agency_name" name="agencyname" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>机构简称：</span>
                                        <input type="text" id="agency_short_name" name="agencyshortname" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span">排序号：</span>
                                        <input type="text" id="agency_index" name="agencyindex" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span">邮编：</span>
                                        <input type="text" id="agency_code" name="agencycode" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span">联系人：</span>
                                        <input type="text" id="agency_contact" name="agencycontact"/>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">办公室电话：</span>
                                        <input type="text" id="agency_tel" name="agencytel"/>
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>移动电话：</span>
                                        <input type="text" id="agency_phone" name="agencyphone"/>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">地址：</span>
                                        <input type="text" id="agency_addr" name="agencyaddr"/>
                                    </li>
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>保险救援电话：</span>
                                        <input type="text" id="agency_save_tel" name="agencysavetel"/>
                                    </li>
                                    <li className="form-group">
                                        <span className="span">备注：</span>
                                        <input type="text" id="agency_mem" name="agencymem"/>
                                    </li>
                                    <li id="agency-err-info" style={{paddingLeft:'40%',width:'100%'}}>

                                    </li>
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.handleAddAgency}>提 交</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
});

export default AgencyAdd;