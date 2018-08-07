/**
 * @file 驾驶员管理-弹窗 Reflux View
 * @author XuHong 2017.09.09
 */

import React, { Component } from 'react';
import { render } from 'react-dom';
import DateTimePicker from '../../../common/datetimepicker';
import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';

import CommonStore from '../../common/stores/commonStore';

import DriverStore from "../stores/driverStore";
import DriverAction from "../actions/driverAction";
import GlobalParam from "../../../common/globalParam";

var MemberDriverModal = React.createClass({
    getInitialState: function() {
        return {}
    },
    componentDidMount: function() {
        this.unsubscribe = DriverStore.listen(this.listenEvent);
        $("#member_driver_modal").on('hide.bs.modal', function() {
            $("#driver_oper_modal").modal("show");
        });
        BootstrapTable.initTable("member_driver_table",10,[10,20],Urls.loadMemberDriver,DriverStore.memberData.columns,DriverStore.memberData.queryParams,Urls.post);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    listenEvent: function(type, result) {
        switch(type) {
            case 'driverMemberEvent' :
                this.listenDriverMemberEvent();
                break;
        }
    },
    listenDriverMemberEvent: function() {
        $("#member_driver_modal").find("#member_name").val("");
        DriverStore.onGetMemberList();
    },
    handleMemberSearch: function() {
        DriverAction.getMemberList();
    },
    handleCheckPerson: function() {
        var row = BootstrapTable.getSelected("member_driver_table");
        if(row.length <= 0){
            toastr.warning("请选择一个人员！");
            return;
        }else{
            DriverStore.trigger('checkPersonEvent',row[0]);
        }
        $("#member_driver_modal").modal('hide');
    },
    hideMemberModal: function() {
        $("#member_driver_modal").modal('hide');
    },
    render: function() {
        return (
            <div className="modal fade bs-example-modal-lg top-mar" id="member_driver_modal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" style={{overflowY:'scroll'}}>
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">选择人员信息</h4>
                        </div>
                        <div className="modal-body">
                            <input id="member_name" type="text" placeholder="请输入人员姓名"/>&nbsp;&nbsp;
                            <button type="submit" onClick={this.handleMemberSearch} className="btn-search">搜索</button>
                            <button type="submit" className="btnOne btn-bule" onClick={this.handleCheckPerson}><i className="icon-bg add-icon"/>选择</button>
                            <table id="member_driver_table" cellSpacing="0" className="table-striped mart12" cellPadding="0" width="100%"></table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.handleCheckPerson}>确定</button>
                            <button type="button" className="btn btn-default" onClick={this.hideMemberModal}>取消</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var DriverOperModal = React.createClass({
    getInitialState: function() {
        return {
            operType: 'add'
        }
    },
    componentDidMount: function() {
        let that = this;
        that.unsubscribe = DriverStore.listen(that.listenEvent);
        DateTimePicker.init("input[name='birthday']");
        DateTimePicker.init("input[name='arriveTime']");
        $("input[name='birthday']").on('changeDate', function() {
            $(this).trigger("change");
        });
        $("input[name='arriveTime']").on('changeDate', function() {
            $(this).trigger("change");
        });
        that.initDriverFormValidator();
        $('#driver_oper_modal').on('hide.bs.modal', function (e) {
            if(e.target.tagName === "DIV") that.clearDriver();
        });
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    listenEvent: function(type, result) {
        switch(type) {
            case 'driverUpdateEvent' :
                this.listenDriverUpdateEvent(result);
                break;
            case 'driverAddEvent' :
                this.listenDriverAddEvent();
                break;
            // case 'driverDetailEvent' :
            //     this.listenDriverDetailEvent(result);
            //     break;
            case 'checkPersonEvent' :
                this.listenCheckPersonEvent(result);
                break;
        }
    },
    listenDriverAddEvent: function() {
        this.setState({operType:'add'});
        $("#driver_oper_modal").find("#driver_title").text('新增驾驶员');
        // $("#car_oper_modal").find("#car_id").val('');
        this.clearDriver();
    },
    listenDriverUpdateEvent: function(result) {
        this.setState({operType:'update'});
        $("#driver_oper_modal").find("#driver_title").text('编辑驾驶员信息');
        this.clearDriver();
        this.editDriver(result);
    },
    // listenDriverDetailEvent: function(result) {
    //     this.setState({operType:'detail'});
    //     $("#driver_oper_modal").find("#driver_title").text('查看驾驶员信息');
    //     this.clearDriver();
    //     this.editDriver(result);
    // },
    listenCheckPersonEvent: function(result) {
        this.clearDriverMember();
        this.editDriverMember(result);
        var operModal = $("#driver_oper_modal");
        operModal.find("#driver_name").trigger("change");
    },
    clearDriver: function() {
        var operModal = $("#driver_oper_modal");
        operModal.data('bootstrapValidator').resetForm();
        operModal.find("#driver_id").val('');
        operModal.find("#uid").val('');
        operModal.find("#driver_name").val('');
        operModal.find("#driver_name").css('display','none');
        operModal.find("#sex").val('');
        operModal.find("#birth_time").val('');
        operModal.find("#card").val('');
        operModal.find("#mobile").val('');
        operModal.find("#arrive_time").val('');
        operModal.find("#driver_no").val('');
        operModal.find("#driver_type").val('');
        operModal.find("#p_image").attr("src",__uri('/static/images/photo1.png'));
        operModal.find("#d_inmage_1").attr("src",__uri('/static/images/photo2.png'));
        operModal.find("#d_inmage_2").attr("src",__uri('/static/images/photo3.png'));
    },
    editDriver: function(driver) {
        var operModal = $("#driver_oper_modal");

        operModal.find("#driver_id").val(driver.id);
        operModal.find("#uid").val(driver.uid);
        operModal.find("#driver_name").val(driver.name);
        if(driver.name) {
            operModal.find("#driver_name").css('display','');
        }
        operModal.find("#sex").val(driver.sex);
        operModal.find("#birth_time").val(driver.birth);
        operModal.find("#card").val(driver.card);
        operModal.find("#mobile").val(driver.mobile);
        operModal.find("#arrive_time").val(driver.arrive);
        operModal.find("#driver_no").val(driver.driver_no);
        operModal.find("#driver_type").val(driver.driver_type);
        operModal.find("#p_image").attr("src",!driver.p_image?__uri('/static/images/photo1.png'):Urls.imgUrl+driver.p_image);
        operModal.find("#d_inmage_1").attr("src",!driver.d_inmage_1?__uri('/static/images/photo2.png'):Urls.imgUrl+driver.d_inmage_1);
        operModal.find("#d_inmage_2").attr("src",!driver.d_inmage_2?__uri('/static/images/photo3.png'):Urls.imgUrl+driver.d_inmage_2);
    },
    clearDriverMember: function() {
        var operModal = $("#driver_oper_modal");
        operModal.find("#uid").val('');
        operModal.find("#driver_name").val('');
        operModal.find("#sex").val('');
        operModal.find("#birth_time").val('');
        operModal.find("#card").val('');
        operModal.find("#mobile").val('');
        operModal.find("#p_image_input").resetForm();
        operModal.find("#d_inmage_1_form").resetForm();
        operModal.find("#d_inmage_2_form").resetForm();
        operModal.find("#p_image").attr("src",__uri('/static/images/photo1.png'));
        operModal.find("#d_inmage_1").attr("src",__uri('/static/images/photo2.png'));
        operModal.find("#d_inmage_2").attr("src",__uri('/static/images/photo3.png'));
    },
    editDriverMember: function(member) {
        var operModal = $("#driver_oper_modal");

        if(member) {
            operModal.find("#uid").val(member.id);
            operModal.find("#driver_name").val(member.name);
            operModal.find("#driver_name").css('display','');
            operModal.find("#sex").val(member.sex);
            operModal.find("#birth_time").datetimepicker('update',!member.birth?'':new Date(member.birth));
            operModal.find("#card").val(member.card);
            operModal.find("#mobile").val(member.mobile);
        }
    },
    resetDriver: function() {
        var operModal = $("#driver_oper_modal");

        operModal.find("#uid").val('');
        operModal.find("#driver_name").val('');
        operModal.find("#driver_name").css('display','none');
        operModal.find("#sex").val('');
        operModal.find("#birth_time").val('');
        operModal.find("#card").val('');
        operModal.find("#mobile").val('');
        operModal.find("#arrive_time").val('');
        operModal.find("#driver_no").val('');
        operModal.find("#driver_type").val('');
        operModal.find("#p_image_input").resetForm();
        operModal.find("#d_inmage_1_form").resetForm();
        operModal.find("#d_inmage_2_form").resetForm();
        operModal.find("#p_image").attr("src",__uri('/static/images/photo1.png'));
        operModal.find("#d_inmage_1").attr("src",__uri('/static/images/photo2.png'));
        operModal.find("#d_inmage_2").attr("src",__uri('/static/images/photo3.png'));
    },
    handleChoosePerson: function() {
        $("#driver_oper_modal").modal("hide");
        DriverStore.trigger('driverMemberEvent', null);
        $("#member_driver_modal").modal("show");
    },
    handleDriverSubmit: function() {
        var operModal = $("#driver_oper_modal");
        var validator = $("#driver_oper_modal").data("bootstrapValidator");
        validator.validate();
        if(validator.isValid()){
            var that = this;
            var driver = {
                uid: operModal.find("#uid").val(),
                name: operModal.find("#driver_name").val(),
                sex: operModal.find("#sex").val(),
                birth_time: operModal.find("#birth_time").val(),
                card: operModal.find("#card").val(),
                mobile: operModal.find("#mobile").val(),
                arrive_time: operModal.find("#arrive_time").val(),
                driver_no: operModal.find("#driver_no").val(),
                driver_type: operModal.find("#driver_type").val(),
                p_image: that.getImgFileUrl("p_image"),
                d_inmage_1: that.getImgFileUrl("d_inmage_1"),
                d_inmage_2: that.getImgFileUrl("d_inmage_2")
            };
            var id = operModal.find("#driver_id").val();

            if(!!id){
                driver.id = id;
                DriverAction.updateDriver(driver);
            }else{
                DriverAction.addDriver(driver);
            }
       }
    },
    handleClickImg: function(event){
        var imgUrl = $(event.target)[0].src;
        if(!!imgUrl){
            CommonStore.trigger("showImgModal",{imgUrl:imgUrl});
        }
    },
    initDriverFormValidator: function(){
        $('#driver_oper_modal').bootstrapValidator({
            message: 'This value is not valid',
            fields: {
                driver_name: {
                    message: 'The name is not valid',
                    container: '#err-info',
                    trigger: 'change',
                    validators: {
                        notEmpty: {
                            message: '请输入驾驶员姓名！'
                        },
                        stringLength: {
                            max: 10,
                            message: '驾驶员姓名长度不符！'
                        }
                    }
                },
                sex: {
                    message: 'The sex is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty:{
                            message:'请选择驾驶员性别！'
                        }
                    }
                },
                birthday: {
                    message:'The birthday is not valid',
                    container: '#err-info',
                    trigger: 'change',
                    validators: {
                        notEmpty:{
                            message:'请选择出生日期！'
                        }
                    }
                },
                card: {
                    message:'The card is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty:{
                            message:'请输入身份证号！'
                        },
                        regexp: {
                            regexp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                            message: '请输入合法的身份证号！'
                        }
                    }
                },
                mobile: {
                    message: 'The mobile is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入手机号码！'
                        },
                        regexp: {
                            regexp: /^1[3|5|7|8]{1}[0-9]{9}$/,
                            message: '请输入正确的手机号码！'
                        }
                    }
                },
                arriveTime: {
                    message:'The arriveTime is not valid',
                    container: '#err-info',
                    trigger: 'change',
                    validators: {
                        notEmpty:{
                            message:'请选择入单位时间！'
                        }
                    }
                },
                driver_no:{
                    message:'The arriveTime is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty:{
                            message:'请输入驾驶证号！'
                        }
                    }
                },
                driver_type: {
                    message: 'the driver type is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty: {
                            message: '请选择准驾车型！'
                        }
                    }
                }
            }
        });
    },
    handleImageUpload: function(event) {
        var inputId = event.target.id;
        var imgId = inputId.substring(0, inputId.indexOf("_input"));

        var img = $("#driver_oper_modal").find("#" + imgId);
        $("#driver_oper_modal").find("#" + imgId + "_form").ajaxSubmit({
            url: Urls.uploadImage,
            type: "POST",
            data: {
                keyid:GlobalParam.get("user").id,
                token:GlobalParam.get("user").token
            },
            success: function(data) {
                if(data) {
                    if(data.isSuccess) {
                        var imgUrl = Urls.imgUrl+data.url;
                        img.attr("src",imgUrl);
                    } else {
                        toastr.error(data.msg);
                    }
                }
            },
            error: function(msg) {
                toastr.error("上传图片失败！");
            }
        });
    },
    deleteImg: function(event) {
        var operModal = $("#driver_oper_modal");
        var imgSrcs = {"p_image":"1","d_inmage_1":"2","d_inmage_2":"3"};

        var deleteId = event.target.id;
        var imgId = deleteId.substring(0, deleteId.indexOf("_delete"));

        var imgSrc = __uri("/static/images/photo" + imgSrcs[imgId] + ".png");
        operModal.find("#" + imgId).attr("src", imgSrc);
        operModal.find("#" + imgId + "_form").resetForm();
    },
    getImgFileUrl: function(imgId) {
        var imgFileUrl = "";
        var operModal = $("#driver_oper_modal");
        var imgSrc = operModal.find("#"+imgId).attr("src");
        if(imgSrc.indexOf(Urls.imgUrl) >= 0) {
            imgFileUrl = imgSrc.replace(Urls.imgUrl,"");
        }
        return imgFileUrl;
    },
    render: function() {
        return (
            <div className="modal fade bs-example-modal-lg top-mar" id="driver_oper_modal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" style={{overflowY:"scroll"}}>
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="driver_title">新增驾驶员</h4>
                        </div>
                        <div className="modal-body">
                            <ul className="modal-form-con">
                                <input type="hidden" id="driver_id"/>
                                <input type="hidden" id="uid"/>
                                <li className="form-group"><span className="span"><span className="red">*&nbsp;</span>驾驶员姓名：</span><input type="text" id="driver_name" name="driver_name" readOnly="true" style={{width:'37%',display:'none'}}/>
                                    <button type="button" className="btn btn-staff" onClick={this.handleChoosePerson}>选择人员</button></li>
                                <li className="form-group"><span className="span"><span className="red">*&nbsp;</span>性别：</span>
                                    <select id="sex" name="sex">
                                        <option value="1">男</option>
                                        <option value="2">女</option>
                                    </select>
                                </li>
                                <li className="form-group"><span className="span"><span className="red">*&nbsp;</span>出生日期：</span><input type="text" name="birthday" id="birth_time" className="date-icon"/></li>
                                <li className="form-group"><span className="span"><span className="red">*&nbsp;</span>身份证号：</span><input type="text" id="card" name="card"/></li>
                                <li className="form-group"><span className="span"><span className="red">*&nbsp;</span>手机号：</span><input type="text" id="mobile"/></li>
                                <li className="form-group"><span className="span"><span className="red">*&nbsp;</span>上岗时间：</span><input type="text" className="date-icon" name="arriveTime" id="arrive_time"/></li>
                                <li className="form-group"><span className="span"><span className="red">*&nbsp;</span>驾驶证编号：</span><input type="text" id="driver_no" name="driver_no"/></li>
                                <li className="form-group"><span className="span"><span className="red">*&nbsp;</span>准驾车型：</span>
                                    <select id="driver_type" name="driver_type">
                                        <option value="A1">A1</option>
                                        <option value="A2">A2</option>
                                        <option value="A3">A3</option>
                                        <option value="B1">B1</option>
                                        <option value="B2">B2</option>
                                        <option value="C1">C1</option>
                                        <option value="C2">C2</option>
                                    </select>
                                </li>
                                <li id="err-info" style={{paddingLeft:'110px'}}>

                                </li>
                            </ul>
                            <ul className="fileUp-con">
                                <li className="form-group">人员照片：<form id="p_image_form" style={{position:'absolute',top:'251px',left:'118px'}}><input id="p_image_input" name="Filedata" type="file" style={{opacity:'0',width:'72px'}} onChange={this.handleImageUpload}/></form><button type="button" className="btn btn-file fileW">选择文件</button>
                                    <div className="file-img"><img id="p_image" onClick={this.handleClickImg} src={__uri("/static/images/photo1.png")}/><button id="p_image_delete" type="button" className="btn  file-img-del" onClick={this.deleteImg}>删除</button></div>
                                </li>
                                <li className="form-group">驾驶证正本照片：<form id="d_inmage_1_form" style={{position:'absolute',top:'251px',left:'398px'}}><input id="d_inmage_1_input" name="Filedata" type="file" style={{opacity:'0',width:'72px'}} onChange={this.handleImageUpload}/></form><button type="button" className="btn btn-file fileW">选择文件</button>
                                    <div className="file-img"><img id="d_inmage_1" onClick={this.handleClickImg} src={__uri("/static/images/photo2.png")}/><button id="d_inmage_1_delete" type="button" className="btn  file-img-del" onClick={this.deleteImg}>删除</button></div>
                                </li>
                                <li className="form-group">驾驶证副页照片：<form id="d_inmage_2_form" style={{position:'absolute',top:'251px',left:'639px'}}><input id="d_inmage_2_input" name="Filedata" type="file" style={{opacity:'0',width:'72px'}} onChange={this.handleImageUpload}/></form><button type="button" className="btn btn-file fileW">选择文件</button>
                                    <div className="file-img"><img id="d_inmage_2" onClick={this.handleClickImg} src={__uri("/static/images/photo3.png")}/><button id="d_inmage_2_delete" type="button" className="btn  file-img-del" onClick={this.deleteImg}>删除</button></div>
                                </li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.handleDriverSubmit}>提 交</button>
                            <button type="button" className="btn btn-default" onClick={this.resetDriver}>清空</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var DriverDetailModal = React.createClass({
    getInitialState: function() {
        return {}
    },
    componentDidMount: function() {
        this.unsubscribe = DriverStore.listen(this.listenEvent);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    listenEvent: function(type, result) {
        switch(type) {
            case 'driverDetailEvent' :
                this.listenDriverDetailEvent(result);
                break;
        }
    },
    listenDriverDetailEvent: function(result) {
        this.setState({operType:'detail'});
        this.clearDriver();
        this.editDriver(result);
    },
    clearDriver: function() {
        var operModal = $("#driver_detail_modal");

        operModal.find("#d_name").val('');
        operModal.find("#d_sex").val('');
        operModal.find("#d_birth_time").val('');
        operModal.find("#d_card").val('');
        operModal.find("#d_mobile").val('');
        operModal.find("#d_arrive_time").val('');
        operModal.find("#d_driver_no").val('');
        operModal.find("#d_driver_type").val('');
    },
    editDriver: function(driver) {
        var sexResults = {'1':'男','2':'女'};

        var operModal = $("#driver_detail_modal");

        operModal.find("#d_name").val(driver.name);
        operModal.find("#d_sex").val(sexResults[driver.sex]);
        operModal.find("#d_birth_time").val(driver.birth);
        operModal.find("#d_card").val(driver.card);
        operModal.find("#d_mobile").val(driver.mobile);
        operModal.find("#d_arrive_time").val(driver.arrive);
        operModal.find("#d_driver_no").val(driver.driver_no);
        operModal.find("#d_driver_type").val(driver.driver_type);
        operModal.find("#d_p_image").attr("src",!driver.p_image?__uri('/static/images/photo1.png'):Urls.imgUrl+driver.p_image);
        operModal.find("#d_d_inmage_1").attr("src",!driver.d_inmage_1?__uri('/static/images/photo2.png'):Urls.imgUrl+driver.d_inmage_1);
        operModal.find("#d_d_inmage_2").attr("src",!driver.d_inmage_2?__uri('/static/images/photo3.png'):Urls.imgUrl+driver.d_inmage_2);
    },
    hideModal: function() {
        $("#driver_detail_modal").modal("hide");
    },
    handleClickImg: function(event){
        var imgUrl = $(event.target)[0].src;
        if(!!imgUrl){
            CommonStore.trigger("showImgModal",{imgUrl:imgUrl});
        }
    },
    render: function() {
        return (
            <div className="modal fade bs-example-modal-lg top-mar" id="driver_detail_modal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" style={{overflowY:"scroll"}}>
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">查看驾驶员信息</h4>
                        </div>
                        <div className="modal-body">
                            <ul className="modal-form-con">
                                <li><span className="span">驾驶员姓名：</span><input type="text" id="d_name" readOnly="true"/></li>
                                <li><span className="span">性别：</span><input type="text" id="d_sex" readOnly="true"/></li>
                                <li><span className="span">出生日期：</span><input type="text" id="d_birth_time" readOnly="true"/></li>
                                <li><span className="span">身份证号：</span><input type="text" id="d_card" readOnly="true"/></li>
                                <li><span className="span">手机号：</span><input type="text" id="d_mobile" readOnly="true"/></li>
                                <li><span className="span">上岗时间：</span><input type="text" id="d_arrive_time" readOnly="true"/></li>
                                <li><span className="span">驾驶证编号：</span><input type="text" id="d_driver_no" readOnly="true"/></li>
                                <li><span className="span">准驾车型：</span><input type="text" id="d_driver_type" readOnly="true"/></li>
                            </ul>
                            <ul className="fileUp-con">
                                <li>人员照片：
                                    <div className="file-img"><img id="d_p_image" onClick={this.handleClickImg} src={__uri("/static/images/photo1.png")}/></div>
                                </li>
                                <li>驾驶证正本照片：
                                    <div className="file-img"><img id="d_d_inmage_1" onClick={this.handleClickImg} src={__uri("/static/images/photo2.png")}/></div>
                                </li>
                                <li>驾驶证副页照片：
                                    <div className="file-img"><img id="d_d_inmage_2" onClick={this.handleClickImg} src={__uri("/static/images/photo3.png")}/></div>
                                </li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" onClick={this.hideModal}>关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var DriverStatusModal = React.createClass({
    getInitialState: function() {
        return {}
    },
    componentDidMount: function() {
        this.unsubscribe = DriverStore.listen(this.listenEvent);
        DateTimePicker.init("input[name='start']");
        DateTimePicker.init("input[name='end']");
        this.listenStatusSelect();
    },
    listenStatusSelect: function() {
        $("#d_status").on("change", function() {
            var status = $(this).val();
            if(status && status != '1') {
                $("#start_li").css("display","");
                $("#end_li").css("display","");
            } else {
                $("#start_li").css("display","none");
                $("#end_li").css("display","none");
            }
        });
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    listenEvent: function(type, result) {
        switch(type) {
            case 'driverStatusEvent' :
                this.listenDriverStatusEvent(result);
                break;
        }
    },
    listenDriverStatusEvent: function(result) {
        this.clearDriverStatus();
        this.editDriverStatus(result);
    },
    clearDriverStatus: function() {
        var operModal = $("#driver_status_modal");

        operModal.find("#s_driver_id").val('');
        operModal.find("#s_name").val('');
        operModal.find("#s_driver_no").val('');
        operModal.find("#s_oname").val('');
        operModal.find("#s_d_status").val('');
        operModal.find("#s_start").val('');
        operModal.find("#s_end").val('');
        $("#start_li").css("display","none");
        $("#end_li").css("display","none");
        operModal.find("#s_texts").val('');
    },
    editDriverStatus: function(driver) {
        var operModal = $("#driver_status_modal");

        operModal.find("#s_driver_id").val(driver.id);
        operModal.find("#s_name").val(driver.name);
        operModal.find("#s_driver_no").val(driver.driver_no);
        operModal.find("#s_oname").val(driver.oname);
        operModal.find("#s_d_status").val(driver.d_status);
        operModal.find("#s_start").datetimepicker('update', !driver.start?"":driver.start.split(" ")[0]);
        operModal.find("#s_end").datetimepicker('update', !driver.end?"":driver.end.split(" ")[0]);
        if(driver.d_status && driver.d_status != '1') {
            $("#start_li").css("display","");
            $("#end_li").css("display","");
        }
        operModal.find("#s_texts").val(driver.texts);
    },
    resetDriverStatus: function() {
        var operModal = $("#driver_status_modal");

        operModal.find("#s_d_status").val('');
        operModal.find("#s_start").val('');
        operModal.find("#s_end").val('');
        $("#start_li").css("display","none");
        $("#end_li").css("display","none");
        operModal.find("#s_texts").val('');
    },
    handleDriverStatusUpdate: function() {
        var operModal = $("#driver_status_modal");
        var driverStatus = {
            id: operModal.find("#s_driver_id").val(),
            name: operModal.find("#s_name").val(),
            driver_no: operModal.find("#s_driver_no").val(),
            org: operModal.find("#s_oname").val(),
            d_status: operModal.find("#s_d_status").val(),
            start: operModal.find("#s_start").val(),
            end: operModal.find("#s_end").val(),
            texts: operModal.find("#s_texts").val()
        };

        DriverAction.updateDriverStatus(driverStatus);
    },
    render: function() {
        return (
            <div className="modal fade bs-example-modal-lg top-mar" id="driver_status_modal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">更改驾驶员工作状态</h4>
                        </div>
                        <div className="modal-body">
                            <ul className="modal-form-con">
                                <input type="hidden" id="s_driver_id"/>
                                <li><span className="span">驾驶员姓名：</span><input type="text" id="s_name" readOnly="true"/></li>
                                <li><span className="span">驾驶证号：</span><input type="text" id="s_driver_no" readOnly="true"/></li>
                                <li><span className="span">所属单位：</span><input type="text" id="s_oname" readOnly="true"/></li>
                                <li><span className="span"><span className="red">*&nbsp;</span>工作状态：</span>
                                    <select id="s_d_status">
                                        <option value="1">在岗</option>
                                        <option value="2">公休</option>
                                        <option value="3">长期事假</option>
                                        <option value="4">长期病假</option>
                                        <option value="5">待岗</option>
                                    </select>
                                </li>
                                <li id="start_li" style={{display:'none'}}><span className="span"><span className="red">*&nbsp;</span>开始时间：</span><input type="text" className="date-icon" name="start" id="s_start"/></li>
                                <li id="end_li" style={{display:'none'}}><span className="span"><span className="red">*&nbsp;</span>结束时间：</span><input type="text" className="date-icon" name="end" id="s_end"/></li>
                                <li className="li01"><span className="span">备注：</span><textarea id="s_texts" rows="3" className="textarea"/></li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.handleDriverStatusUpdate}>提 交</button>
                            <button type="button" className="btn btn-default" onClick={this.resetDriverStatus}>清空</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var DriverModal = React.createClass({
    getInitialState: function() {
        return {};
    },
    render: function() {
        return (
            <div>
                <DriverOperModal/>
                <DriverDetailModal/>
                <DriverStatusModal/>
                <MemberDriverModal/>
            </div>
        )
    }
});

export default DriverModal;