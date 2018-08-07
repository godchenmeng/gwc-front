/**
 * @file 设备管理-弹窗 Reflux View
 * @author XuHong 2017.09.08
 */

import React, { Component } from 'react';
import { render } from 'react-dom';
import Urls from '../../../common/urls';

import BootstrapTree from '../../../common/bootstrapTree';
import DeviceStore from "../stores/deviceStore";
import DeviceAction from "../actions/deviceAction";

var DeviceAddModal = React.createClass({
    getInitialState: function() {
        return { };
    },
    componentDidMount: function() {
        this.unsubscribe = DeviceStore.listen(this.listenEvent);
        this.initDeviceOrgTree();
        this.initDeviceFormValidator();
        this.initSimListener();
    },
    initSimListener: function() {
        var that = this;
        var operModal = $("#device_oper_modal");
        operModal.find("#sim").on("blur", function() {
            var sim = $(this);
            that.simValida(sim.val());
        });
    },
    simValida: function(sim) {
        var flag = true;
        if(sim) {
            Urls.get(Urls.simValide, {sim:$.trim(sim)}, null,null,function(msg) {
                var errMsg = msg.responseText;
                if(errMsg) {
                    toastr.error(errMsg);
                    flag = false;
                }
            },null,false);
        }

        return flag;
    },
    initDeviceOrgTree: function() {
        var that = this;
        $("#oper_device_org_tree").css({
            top:$("#device_oper_show_name").position().top + $("#device_oper_show_name").outerHeight() + 1,
            left:$("#device_oper_show_name").position().left + 105
        });
        Urls.get(Urls.loadorgtree,{},function(data) {
            BootstrapTree.initTree('oper_device_org_tree',data,'device_oper_show_name','device_oper_hide_org');
            $("#oper_device_org_tree").on('nodeSelected ', function(event, data) {
                that.initOrgCarSelect();
            });
        });
    },
    initOrgCarSelect: function() {
        Urls.get(Urls.loadOrgCarList,{"id":$("#device_oper_modal").find("#device_oper_hide_org").val()},function(data) {
            var carSelect = $("#device_oper_modal").find("#car_id");
            carSelect.html("<option value='-1'>请选择车辆</option>");
            for(var i = 0; i < data.length; i++) {
                var car = data[i];
                carSelect.append("<option value='"+car.value+"'>"+car.text+"</option>");
            }
            carSelect.val("-1");
        });
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    listenEvent: function(type, result) {
        switch(type) {
            case 'deviceAddEvent' :
                this.listenDeviceAddEvent();
                break;
        }
    },
    listenDeviceAddEvent: function() {
        this.clearDevice();
    },
    clearDevice: function() {
        var operModal = $("#device_oper_modal");
        operModal.data('bootstrapValidator').resetForm();
        operModal.find("#device_oper_show_name").val('');
        operModal.find("#device_oper_hide_org").val('');
        operModal.find('#oper_device_org_tree').treeview('collapseAll', { silent: true });
        operModal.find("#oper_device_org_tree").css("display","none");
        operModal.find("#car_id").val('');
        operModal.find("#car_id").html("<option value='-1'></option>");
        operModal.find("#device").val('');
        operModal.find("#sim").val('');
        operModal.find("#status").val('1');
        operModal.find("#connectway").val('');
    },
    resetDevice: function() {
        var operModal = $("#device_oper_modal");
        operModal.data('bootstrapValidator').resetForm();
        operModal.find("#device_oper_show_name").val('');
        operModal.find("#device_oper_hide_org").val('');
        operModal.find("#car_id").val('');
        operModal.find("#device").val('');
        operModal.find("#sim").val('');
        operModal.find("#status").val('');
        operModal.find("#connectway").val('');
    },
    handleDeviceAdd: function() {
        var operModal = $("#device_oper_modal");
        var validator = $("#device_oper_modal").data("bootstrapValidator");
        if(!this.simValida(operModal.find("#sim").val())) {
            return;
        }
        validator.validate();
        if(validator.isValid()){
            var device = {
                show_name_device: operModal.find("#device_oper_show_name").val(),
                hide_org_device: operModal.find("#device_oper_hide_org").val(),
                car_id: operModal.find("#car_id").val(),
                device: $.trim(operModal.find("#device").val()),
                sim: $.trim(operModal.find("#sim").val()),
                status: operModal.find("#status").val(),
                connectway:operModal.find("#connectway").val()
            };
            DeviceAction.addDevice(device);
        }
    },
    handleCarSelectClick: function(event){
        var operModal = $("#device_oper_modal");
        if(!operModal.find("#device_oper_show_name").val()){
            toastr.warning("请先选择机构部门！");
        }
    },
    initDeviceFormValidator: function(){
        $('#device_oper_modal').bootstrapValidator({
            excluded: [':disabled'],
            message: 'This value is not valid',
            fields: {
                org_name: {
                    message: 'The org name is not valid',
                    container: '#err-info',
                    trigger: 'change',
                    validators: {
                        notEmpty: {
                            message: '请选择机构部门！'
                        }
                    }
                },
                car: {
                    message: 'The car is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty: {
                            message: '请选择车辆！'
                        },
                        regexp: {
                            regexp: /^\+?[1-9][0-9]*$/,
                            message: '请选择车辆！'
                        }
                    }
                },
                device: {
                    message: 'The device is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入设备编号！'
                        },
                        regexp: {
                            regexp:/^(H)[A-Za-z0-9]{12}$|^[0-9]{11}$/,
                            message:'设备编号不能输入空格或特殊符号，请重新输入！'
                        }
                    }
                },
                sim: {
                    message: 'The sim is not valid',
                    container: '#err-info',
                    validators: {
                        regexp: {
                            regexp:/^[A-Za-z0-9]+$/,
                            message:'sim号不能输入空格或特殊符号，请重新输入！'
                        }
                    }
                }
            }
        });
    },
    render: function() {
        return (
            <div className="modal fade bs-example-modal-lg top-mar" id="device_oper_modal" style={{overflowY:'scroll'}} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="device_title">注册设备</h4>
                        </div>
                        <div className="modal-body">
                            <ul className="modal-form-con">
                                <li className="form-group">
                                    <span className="span"><span className="red">*&nbsp;</span>机构部门：</span>
                                    <input id="device_oper_show_name" name="org_name" type="text" placeholder="请选择机构部门" style={{width:'240px'}} readOnly="true"/>
                                    <input id="device_oper_hide_org" type="hidden"/>
                                    <div id="oper_device_org_tree" className="openTree-menu" style={{width:'240px',height:'123px'}}></div>
                                </li>
                                <li className="form-group"><span className="span"><span className="red">*&nbsp;</span>选择车辆：</span>
                                    <select id="car_id" name="car" onClick={this.handleCarSelectClick}></select>
                                </li>
                                <li className="form-group"><span className="span"><span className="red">*&nbsp;</span>设备编号：</span>
                                    <input id="device" name="device" type="text" />
                                </li>
                                <li className="form-group"><span className="span">sim卡号：</span>
                                    <input id="sim" name="sim" type="text" />
                                </li>
                                <li className="form-group">
                                    <span className="span">状态：</span>
                                    <select id="status"><option value="1">正常使用</option></select>
                                </li>
                                <li className="form-group">
                                    <span className="span">接线方式：</span>
                                    <select id="connectway">
                                        <option value="常规">常规</option>
                                        <option value="非常规">非常规</option>
                                    </select>
                                </li>
                                <li id="err-info" style={{paddingLeft:'110px'}}></li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.handleDeviceAdd}>提 交</button>
                            <button type="button" className="btn btn-default" onClick={this.resetDevice}>清 空</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var DeviceUpdateModal = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        this.unsubscribe = DeviceStore.listen(this.listenEvent);
        this.initDeviceFormValidator();
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    listenEvent: function(type, result) {
        switch(type) {
            case 'deviceUpdateEvent' :
                this.listenDeviceUpdateEvent(result);
                break;
        }
    },
    listenDeviceUpdateEvent: function(result) {
        this.clearDevice();
        this.editDevice(result);
    },
    editDevice: function(device) {
        var upModal = $("#device_update_modal");
        if(device) {
            upModal.find("#up_device_id").val(device.id);
            upModal.find("#up_car_no").val(device.car_no);
            upModal.find("#up_device").val(device.device);
            upModal.find('#up_sim').val(device.sim);
            upModal.find('#up_connectway').val(device.connectway);
        }
    },
    clearDevice: function() {
        var upModal = $("#device_update_modal");
        upModal.data('bootstrapValidator').resetForm();
        upModal.find("#up_device_id").val("");
        upModal.find("#up_car_no").val("");
        upModal.find("#up_device").val("");
        upModal.find('#up_sim').val("");
        upModal.find('#up_connectway').val("");
    },
    resetDevice: function() {
        var upModal = $("#device_update_modal");
        upModal.data('bootstrapValidator').resetForm();
        upModal.find("#up_device").val("");
        upModal.find('#up_sim').val("");
        upModal.find('#up_connectway').val("");
    },
    handleDeviceUpdate: function() {
        var upModal = $("#device_update_modal");
        var validator = $("#device_update_modal").data("bootstrapValidator");
        validator.validate();
        if(validator.isValid()){
            var device = {
                id: upModal.find("#up_device_id").val(),
                car_no: upModal.find("#up_car_no").val(),
                device: $.trim(upModal.find("#up_device").val()),
                sim: $.trim(upModal.find("#up_sim").val()),
                connectway: upModal.find('#up_connectway').val(),
            };
            DeviceAction.updateDevice(device);
        }

    },
    initDeviceFormValidator: function(){
        $('#device_update_modal').bootstrapValidator({
            excluded: [':disabled'],
            message: 'This value is not valid',
            fields: {
                deviceUp: {
                    message: 'The device is not valid',
                    container: '#up-err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入设备编号！'
                        },
                        regexp: {
                            regexp:/^(H)[A-Za-z0-9]{12}$|^[0-9]{11}$/,
                            message:'设备编号不能输入空格或特殊符号，请重新输入！'
                        }
                    }
                },
                simUp: {
                    message: 'The sim is not valid',
                    container: '#up-err-info',
                    validators: {
                        regexp: {
                            regexp:/^[A-Za-z0-9]+$/,
                            message:'sim号不能输入空格或特殊符号，请重新输入！'
                        }
                    }
                }
            }
        });
    },
    render: function() {
        return (
            <div className="modal fade bs-example-modal-lg top-mar" id="device_update_modal" style={{overflowY:'scroll'}} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="device_title">换设备</h4>
                        </div>
                        <div className="modal-body">
                            <input id="up_device_id" type="hidden"/>
                            <ul className="modal-form-con">
                                <li>
                                    <span className="span">车牌号码：</span>
                                    <input id="up_car_no" type="text" readOnly="true"/>
                                </li>
                                <li><span className="span"><span className="red">*&nbsp;</span>设备编号：</span>
                                    <input id="up_device" type="text" name="deviceUp"/>
                                </li>
                                <li><span className="span">sim卡号：</span>
                                    <input id="up_sim" type="text" name="simUp"/>
                                </li>
                                <li className="form-group">
                                    <span className="span">接线方式：</span>
                                    <select id="up_connectway">
                                        <option value="常规">常规</option>
                                        <option value="非常规">非常规</option>
                                    </select>
                                </li>
                                <li id="up-err-info" style={{paddingLeft:'110px'}}></li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.handleDeviceUpdate}>提 交</button>
                            <button type="button" className="btn btn-default" onClick={this.resetDevice}>清 空</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var DeviceOperModal = React.createClass({
    getInitialState: function() {
        return {}
    },
    render: function() {
        return (
            <div>
                <DeviceAddModal/>
                <DeviceUpdateModal/>
            </div>
        )
    }
});

export default DeviceOperModal;