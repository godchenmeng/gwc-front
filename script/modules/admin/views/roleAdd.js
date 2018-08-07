/**
 * @file 新增角色
 * @author CM 2017.08.22
 */

import React, { Component } from 'react'
import { render } from 'react-dom'

import RoleAction from '../actions/roleAction';
import RoleStore from  '../stores/roleStore';
import BootstrapTree from '../../../common/bootstrapTree';

var RoleAdd = React.createClass({
    getInitialState: function() {
        return {
            permission_selected:[],
            role_id:0
        }
    },
    componentDidMount: function () {
        let that = this;
        that.initRoleFormValidator();
        RoleAction.getpermissionlist();
        RoleStore.listen(this.listenFun);
        $('#roleAdd').on('show.bs.modal', function () {
            $("#role_title").html("新增角色");
        })
        $('#roleAdd').on('hide.bs.modal', function (e) {
            if(e.target.tagName === "DIV") that.clearBox();
        })
    },
    listenFun:function (type,result) {
        switch (type){
            case "setchecked":
                this.setCheckedPermission(result);
                break;
            case "editrole":
                this.editRole(result);
                break;
            case "updaterolesuccess":
                $("#roleAdd").modal("hide");
                this.clearBox();
                break;
        }
    },
    setCheckedPermission:function (nodes) {
        let tmpSel = [];
        for(let i = 0; i < nodes.length; i++){
            tmpSel.push(nodes[i].org_id);
        }
        this.setState({
            permission_selected:tmpSel
        });
    },
    initRoleFormValidator: function(){
        $('#role_add_form').bootstrapValidator({
            message: 'This value is not valid',
            fields: {
                rolename: {
                    message: 'The rolename is not valid',
                    container: '#role-err-info',
                    validators: {
                        notEmpty: {
                            message: '请输角色名称！'
                        },
                    }
                },
            }
        });
    },
    handleAddRole:function (event) {
        var bootstrapValidator = $('#role_add_form').data('bootstrapValidator');
        bootstrapValidator.validate();//触发验证
        if(bootstrapValidator.isValid()){
            let pid = this.state.permission_selected.length == 0?[-1]:this.state.permission_selected;
            let roleParam = {
                name:$('#role_name').val(),
                descr:$('#role_desc').val(),
                pid:pid
            };
            if(this.state.role_id != 0){
                roleParam.id = this.state.role_id;
                RoleAction.updaterole(roleParam);
            }else{
                RoleAction.addrole(roleParam);
            }
        }
    },
    editRole:function (role) {
        $("#roleAdd").modal("show");
        $("#role_title").html("编辑角色");
        this.setState({role_id: role.id});
        $('#role_id').val(role.id);
        $('#role_name').val(role.name);
        $('#role_desc').val(role.descr);
    },
    clearBox:function () {
        $('#role_add_form').data('bootstrapValidator').resetForm();
        this.setState({role_id:0});
        $('#role_id').val(0);
        $('#role_name').val('');
        $('#role_desc').val('');
        BootstrapTree.setAllNodeUnCheck("role_tree");
    },
    render: function () {
        return (
            <div className="modal fade bs-example-modal-lg" id="roleAdd" style={{overflowY:"scroll"}}>
                <form id="role_add_form">
                    <input type="hidden" name="roleid" id="role_id" value="0" />
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title" id="role_title">新增角色</h4>
                            </div>
                            <div className="modal-body">
                                <ul className="modal-form-con">
                                    <li className="form-group">
                                        <span className="span"><span className="red">*&nbsp;</span>角色名称：</span>
                                        <input type="text" id="role_name" name="rolename" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span">角色描述：</span>
                                        <input type="text" id="role_desc" name="roledesc" />
                                    </li>
                                    <li className="form-group">
                                        <span className="span" style={{verticalAlign:"top"}}>权限：</span>
                                        <div id="role_tree" style={{display:"inline-block",border:"1px solid #ddd",width:"240px"}}></div>
                                    </li>
                                    <li id="role-err-info" className="form-group">

                                    </li>
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.handleAddRole}>提 交</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
});

export default RoleAdd;