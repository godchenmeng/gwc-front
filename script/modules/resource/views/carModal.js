/**
 * @file 车辆管理-弹窗 Reflux View
 * @author XuHong 2017.08.30
 *
 */

import React, { Component } from 'react';
import { render } from 'react-dom';

import CarStore from "../stores/carStore";
import CarAction from "../actions/carAction";

import DateTimePicker from '../../../common/datetimepicker';
import Urls from '../../../common/urls';
import BootstrapTree from '../../../common/bootstrapTree';
import AutoComplete from '../../../common/autoComplete';

import CommonAction from "../../common/actions/commonAction";
import CommonStore from "../../common/stores/commonStore";
import GlobalParam from "../../../common/globalParam";

var CarDetailModal = React.createClass({
    getInitialState: function() {
        return {
            carInfo: {}
        }
    },
    componentDidMount: function() {
        this.unsubscribe = CarStore.listen(this.listenEvent);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    listenEvent: function(type, result) {
        switch(type) {
            case 'carDetailEvent':
                this.listenCarDetailEvent(result);
                break;
        }
    },
    listenCarDetailEvent: function(result) {
        this.setState({carInfo:result});
    },
    handleClickHide: function() {
        $("#car_detail_modal").modal("hide");
    },
    handleClickImg: function(event){
        var imgUrl = $(event.target)[0].src;
        if(!!imgUrl){
            CommonStore.trigger("showImgModal",{imgUrl:imgUrl});
        }
    },
    render: function() {
        var carInfo = this.state.carInfo;
        var ovValues = {
            '1':0.8,
            '2':1.0,
            '3':1.1,
            '4':1.3,
            '5':1.4,
            '6':1.5,
            '7':1.6,
            '8':1.7,
            '9':1.8,
            '10':2.0,
            '11':2.4,
            '12':2.5,
            '13':3.0,
            '14':3.6,
            '15':4.2,
            '16':4.7,
            '17':6.0
        };
        var ovTypeValues = {'1':'T','2':'L'};
        return (
            <div className="modal fade bs-example-modal-lg top-mar" id="car_detail_modal" style={{overflowY:'scroll'}} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">查看车辆详细信息</h4>
                        </div>
                        <div className="modal-body">
                            <ul className="modal-form-con">
                                <li><span className="span">车牌号码：</span><input type="text" readOnly={true} value={!carInfo.car_no?'':carInfo.car_no}/></li>
                                <li><span className="span">车辆别名：</span><input type="text" readOnly={true} value={!carInfo.self_num?'':carInfo.self_num}/></li>
                                <li><span className="span">品牌：</span><input type="text" readOnly={true} value={!carInfo.brand?'':carInfo.brand}/></li>
                                <li><span className="span">燃油类型：</span><input type="text" readOnly={true} value={!carInfo.fule_type_text?'':carInfo.fule_type_text}/></li>
                                <li><span className="span">排量：</span><input type="text" readOnly={true} value={!ovValues[carInfo.ov]?'':ovValues[carInfo.ov]}/></li>
                                <li><span className="span">排量类型：</span><input type="text" readOnly={true} value={!ovTypeValues[carInfo.ov_type]?'':ovTypeValues[carInfo.ov_type]}/></li>
                                <li><span className="span">入单位时间：</span><input type="text" readOnly={true} value={!carInfo.intime?'':carInfo.intime}/></li>
                                <li><span className="span">车辆类型：</span><input type="text" readOnly={true} value={!carInfo.type_name?'':carInfo.type_name}/></li>
                                <li><span className="span">发动机号：</span><input type="text" readOnly={true} value={!carInfo.engine_no?'':carInfo.engine_no}/></li>
                                <li><span className="span">车架号：</span><input type="text" readOnly={true} value={!carInfo.vin?'':carInfo.vin}/></li>
                                <li><span className="span">初始公里：</span><input type="text" readOnly={true} value={!carInfo.mileage?'':carInfo.mileage}/></li>
                                <li><span className="span">车辆所属单位：</span><input type="text" readOnly={true} value={!carInfo.oname?'':carInfo.oname}/></li>
                                <li><span className="span">年检时间：</span><input type="text" readOnly={true} value={!carInfo.inspection_time?'':carInfo.inspection_time}/></li>
                                <li><span className="span">缴纳保险时间：</span><input type="text" readOnly={true} value={!carInfo.insurance_time?'':carInfo.insurance_time}/></li>
                                <li><span className="span">保养里程：</span><input type="text" readOnly={true} value={!carInfo.mt_mileage?'':carInfo.mt_mileage=='0'?'':carInfo.mt_mileage+'km'}/></li>
                                <li><span className="span">当前里程：</span><input type="text" readOnly={true} value={!carInfo.current_mileage?'':carInfo.current_mileage}/></li>
                                <li className="li01"><span className="span">其他：</span><textarea rows="3" readOnly={true} className="textarea" value={!carInfo.texts?'':carInfo.texts}/></li>
                            </ul>
                            <ul className="fileUp-con">
                                <li>车辆照片：
                                    <div className="file-img"><img onClick={this.handleClickImg} src={!carInfo.car_image?__uri('/static/images/photo4.png'):Urls.imgUrl+carInfo.car_image}/></div>
                                </li>
                                <li>行驶证正本照片：
                                    <div className="file-img"><img onClick={this.handleClickImg} src={!carInfo.driver_image_1?__uri('/static/images/photo5.png'):Urls.imgUrl+carInfo.driver_image_1}/></div>
                                </li>
                                <li>行驶证副页照片：
                                    <div className="file-img"><img onClick={this.handleClickImg} src={!carInfo.driver_image_2?__uri('/static/images/photo6.png'):Urls.imgUrl+carInfo.driver_image_2}/></div>
                                </li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={this.handleClickHide} className="btn btn-default" >关 闭</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var CarOperModal = React.createClass({
    getInitialState: function() {
        return {
            operType: 'add',
            carType:[],
            fuleType:[],
            selectedBrand:false,//标记是否选择了品牌
        };
    },
    componentDidMount: function() {
        let that = this;
        DateTimePicker.init("input[name='in_time']");
        DateTimePicker.init("input[name='insurance_time']");
        DateTimePicker.init("input[name='inspection_time']");

        this.initCarTypeTree();
        this.initBrandSelect();
        this.unsubscribe = CarStore.listen(this.listenEvent);
        this.initCarFormValidator();
        this.initCarType();
        this.initFuelType();

        $('#car_oper_modal').on('hide.bs.modal', function (e) {
            if(e.target.tagName === "DIV") that.clearCar();
        });
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    initCarTypeTree: function() {
        Urls.get(Urls.loadorgtree,{},function(data) {
            $("#oper_car_org_tree").css({
                top:$("#oper_show_name").position().top + $("#oper_show_name").outerHeight() + 1,
                left:$("#oper_show_name").position().left + 105
            });
            BootstrapTree.initTree('oper_car_org_tree',data,'oper_show_name','oper_hide_org');
        });
    },
    initBrandSelect: function() {
        let that = this;
        Urls.get(Urls.carBrand,{},function(result){
            if(result.length > 0){
                let sourceArray = [];
                for(let i=0; i < result.length; i++){
                    let value = {brand:""};
                    value.brand = result[i].text;
                    sourceArray.push(value);
                }
                $("#brand").bsSuggest('init', {
                    clearable: true,
                    data:{
                        value:sourceArray
                    },
                    getDataMethod: "data",
                    showBtn: false,
                    autoSelect: false,
                }).on('onSetSelectValue', function (e, keyword, data) {
                    that.setState({
                        selectedBrand:true
                    })
                    $(this).trigger("change");
                }).on('onUnsetSelectValue', function (e) {
                    that.setState({
                        selectedBrand:false
                    })
                });
                $("div.input-group").css("width","63%");
            }
        });
    },
    initCarType: function () {
        let that = this;
        CommonAction.loadDataDictionary("carType",{parentId:1},function(data){
            that.setState({carType: data.datas});
        });
    },
    initFuelType: function () {
        let that = this;
        CommonAction.loadDataDictionary("fuleType",{parentId:30},function(data){
            that.setState({fuleType: data.datas});
        });
    },
    listenEvent: function(type, result) {
        switch(type) {
            case 'carUpdateEvent' :
                this.listenCarUpdateEvent(result);
                break;
            case 'carAddEvent' :
                this.listenCarAddEvent();
                break;
            case 'carCopyAddEvent' :
                this.listenCarCopyAddEvent(result);
                break;
        }
    },
    listenCarUpdateEvent: function(result) {
        this.setState({operType:'update'});
        this.editCar(result);
    },
    listenCarAddEvent: function() {
        this.setState({operType:'add'});
        $("#car_oper_modal").find("#car_title").text('新增车辆');
        $("#car_oper_modal").find("#car_id").val('');
        this.clearCar();
    },
    listenCarCopyAddEvent: function(result) {
        this.setState({operType:'copyAdd'});
        this.editCar(result);
    },
    editCar: function(car) {
        var operModal = $("#car_oper_modal");
        var title = '新增车辆';
        if(this.state.operType == 'update') {
            title = '编辑车辆';
            operModal.find("#car_id").val(car.id);
            this.setState({selectedBrand:true});
        } else {
            operModal.find("#car_id").val('');
        }

        operModal.find("#car_title").text(title);
        operModal.find("#car_no").val(car.car_no);
        operModal.find("#self_num").val(car.self_num);
        operModal.find("#brand").val(car.brand);
        operModal.find("#fule_type").val(car.fule_type);
        operModal.find("#ov").val(car.ov);
        operModal.find("#ov_type").val(car.ov_type);
        operModal.find("#in_time").val(car.intime);
        operModal.find("#type").val(car.type);
        operModal.find("#engine_no").val(car.engine_no);
        operModal.find("#vin").val(car.vin);
        operModal.find("#mileage").val(car.mileage);
        operModal.find("#oper_show_name").val(car.oname);
        operModal.find("#oper_hide_org").val(car.org);
        operModal.find("#insurance_time").val(car.insurance_time);
        operModal.find("#inspection_time").val(car.inspection_time);
        operModal.find("#mt_mileage").val(car.mt_mileage);
        operModal.find("#current_mileage").val(car.current_mileage);
        operModal.find("#texts").val(car.texts);
        operModal.find("#car_image").attr("src",!car.car_image?__uri('/static/images/photo4.png'):Urls.imgUrl+car.car_image);
        operModal.find("#driver_image_1").attr("src",!car.driver_image_1?__uri('/static/images/photo5.png'):Urls.imgUrl+car.driver_image_1);
        operModal.find("#driver_image_2").attr("src",!car.driver_image_2?__uri('/static/images/photo6.png'):Urls.imgUrl+car.driver_image_2);
    },
    clearCar: function() {
        var operModal = $("#car_oper_modal");
        if(operModal.data('bootstrapValidator')){
            setTimeout(function(){
                operModal.data('bootstrapValidator').resetForm();
            })
        }

        if(this.state.operType != 'update') {
            operModal.find("#car_id").val('');
        }

        operModal.find("#car_no").val('');
        operModal.find("#self_num").val('');
        operModal.find("#brand").val('');
        this.setState({
            selectedBrand:false
        })
        operModal.find("#fule_type").val('');
        operModal.find("#ov").val('');
        operModal.find("#ov_type").val('');
        operModal.find("#in_time").val('');
        operModal.find("#type").val('');
        operModal.find("#engine_no").val('');
        operModal.find("#vin").val('');
        operModal.find("#mileage").val('');
        operModal.find("#oper_show_name").val('');
        operModal.find("#oper_hide_org").val('');
        operModal.find("#insurance_time").val('');
        operModal.find("#inspection_time").val('');
        operModal.find("#mt_mileage").val('');
        operModal.find("#current_mileage").val('');
        operModal.find("#texts").val('');
        operModal.find("#car_image_form").resetForm();
        operModal.find("#driver_image_1_form").resetForm();
        operModal.find("#driver_image_2_form").resetForm();
        operModal.find("#car_image").attr("src",__uri('/static/images/photo4.png'));
        operModal.find("#driver_image_1").attr("src",__uri('/static/images/photo5.png'));
        operModal.find("#driver_image_2").attr("src",__uri('/static/images/photo6.png'));
    },
    handleCarUpdate: function() {
        var operModal = $("#car_oper_modal");
        var validator = $("#car_oper_modal").data("bootstrapValidator");
        validator.validate();
        if(!$.trim(operModal.find("#in_time").val())) {
            toastr.warning("请输入入单位时间！");
            return;
        }
        if(!operModal.find("#oper_show_name").val()) {
            toastr.warning("请选择车辆所属单位！");
            return;
        }
        if(!operModal.find("#oper_hide_org").val()) {
            toastr.warning("请选择车辆所属单位！");
            return;
        }
        if(validator.isValid()) {
            var that = this;
            if (!that.state.selectedBrand) {
                toastr.error("请输入品牌名称，并在提示的下拉框中选择一个！");
                return;
            }
            var car = {
                id: operModal.find("#car_id").val(),
                car_no: operModal.find("#car_no").val(),
                self_num: operModal.find("#self_num").val(),
                brand: operModal.find("#brand").val(),
                fule_type: operModal.find("#fule_type").val(),
                ov: operModal.find("#ov").val(),
                ov_type: operModal.find("#ov_type").val(),
                intimes: operModal.find("#in_time").val(),
                type: operModal.find("#type").val(),
                engine_no: operModal.find("#engine_no").val(),
                vin: operModal.find("#vin").val(),
                mileage: operModal.find("#mileage").val(),
                show_name_car_edit: operModal.find("#oper_show_name").val(),
                org: operModal.find("#oper_hide_org").val(),
                insurance_time: operModal.find("#insurance_time").val(),
                inspection_time: operModal.find("#inspection_time").val(),
                mt_mileage: operModal.find("#mt_mileage").val(),
                current_mileage: operModal.find("#current_mileage").val(),
                texts: operModal.find("#texts").val(),
                car_image: that.getImgFileUrl("car_image"),
                driver_image_1: that.getImgFileUrl("driver_image_1"),
                driver_image_2: that.getImgFileUrl("driver_image_2")
            };

            CarAction.updateCar(car);
        }
    },
    handleCarAdd: function() {
        var operModal = $("#car_oper_modal");
        var validator = $("#car_oper_modal").data("bootstrapValidator");
        validator.validate();
        if(!$.trim(operModal.find("#in_time").val())) {
            toastr.warning("请输入入单位时间！");
            return;
        }
        if(!operModal.find("#oper_show_name").val()) {
            toastr.warning("请选择车辆所属单位！");
            return;
        }
        if(!operModal.find("#oper_hide_org").val()) {
            toastr.warning("请选择车辆所属单位！");
            return;
        }
        if(validator.isValid()) {
            var that = this;
            if (!that.state.selectedBrand) {
                toastr.error("请输入品牌名称，并在提示的下拉框中选择一个！");
                return;
            }
            var car = {
                car_no: operModal.find("#car_no").val(),
                self_num: operModal.find("#self_num").val(),
                brand: operModal.find("#brand").val(),
                fule_type: operModal.find("#fule_type").val(),
                ov: operModal.find("#ov").val(),
                ov_type: operModal.find("#ov_type").val(),
                intimes: operModal.find("#in_time").val(),
                type: operModal.find("#type").val(),
                engine_no: operModal.find("#engine_no").val(),
                vin: operModal.find("#vin").val(),
                mileage: operModal.find("#mileage").val(),
                show_name_car_edit: operModal.find("#oper_show_name").val(),
                org: operModal.find("#oper_hide_org").val(),
                insurance_time: operModal.find("#insurance_time").val(),
                inspection_time: operModal.find("#inspection_time").val(),
                mt_mileage: operModal.find("#mt_mileage").val(),
                current_mileage: operModal.find("#current_mileage").val(),
                texts: operModal.find("#texts").val(),
                car_image: that.getImgFileUrl("car_image"),
                driver_image_1: that.getImgFileUrl("driver_image_1"),
                driver_image_2: that.getImgFileUrl("driver_image_2")
            };

            CarAction.addCar(car);
        }
    },
    initCarFormValidator: function(){
        $('#car_oper_modal').bootstrapValidator({
            message: 'This value is not valid',
            fields: {
                carNo: {
                    message: 'The carNo is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入车牌号码！'
                        },
                        stringLength: {
                            max: 50,
                            message: '车牌号码不能超过50位！'
                        }
                    }
                },
                selfNum: {
                    message: 'The self num is not valid',
                    container: '#err-info',
                    validators: {
                        stringLength: {
                            max: 50,
                            message: '车辆别名不能超过50位！'
                        }
                    }
                },
                brand: {
                    message: 'The brand is not valid',
                    container: '#err-info',
                    trigger: 'change',
                    validators: {
                        notEmpty: {
                            message: '请输入品牌名称，并在提示的下拉框中选择一个！'
                        },
                    }
                },
                vin: {
                    message: 'The vin is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入车架号！'
                        },
                    }
                },
                mileage: {
                    message: 'The mileage is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入初始公里！'
                        },
                    }
                }
            }
        });
    },
    handleImageUpload: function(event) {
        var inputId = event.target.id;
        var imgId = inputId.substring(0, inputId.indexOf("_input"));

        var img = $("#car_oper_modal").find("#" + imgId);
        $("#car_oper_modal").find("#" + imgId + "_form").ajaxSubmit({
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
    handleClickImg: function(event){
        var imgUrl = $(event.target)[0].src;
        if(!!imgUrl){
            CommonStore.trigger("showImgModal",{imgUrl:imgUrl});
        }
    },
    deleteImg: function(event) {
        var operModal = $("#car_oper_modal");
        var imgSrcs = {"car_image":"4","driver_image_1":"5","driver_image_2":"6"};

        var deleteId = event.target.id;
        var imgId = deleteId.substring(0, deleteId.indexOf("_delete"));

        var imgSrc = __uri("/static/images/photo" + imgSrcs[imgId] + ".png");
        operModal.find("#" + imgId).attr("src", imgSrc);
        operModal.find("#" + imgId + "_form").resetForm();
    },
    getImgFileUrl: function(imgId) {
        var imgFileUrl = "";
        var operModal = $("#car_oper_modal");
        var imgSrc = operModal.find("#"+imgId).attr("src");
        if(imgSrc.indexOf(Urls.imgUrl) >= 0) {
            imgFileUrl = imgSrc.replace(Urls.imgUrl,"");
        }
        return imgFileUrl;
    },
    render: function() {
        var operType = this.state.operType;
        let carType = this.state.carType;
        let fuleType = this.state.fuleType;
        return (
            <div className="modal fade bs-example-modal-lg top-mar" id="car_oper_modal" style={{overflowY:'scroll'}} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="car_title">新增车辆</h4>
                        </div>
                        <div className="modal-body">
                            <ul className="modal-form-con">
                                <input id="car_id" type="hidden"/>
                                <li className="form-group">
                                    <span className="span"><span className="red">*&nbsp;</span>车牌号码：</span>
                                    <input id="car_no" name="carNo" type="text" />
                                </li>
                                <li className="form-group">
                                    <span className="span">车辆别名：</span>
                                    <input id="self_num" name="selfNum" type="text" />
                                </li>
                                <li className="form-group">
                                    <span className="span"><span className="red">*&nbsp;</span>品牌：</span>
                                    <div className="input-group" style={{position:"absolute",left:"27%",top:"-1px"}}>
                                        <input type="text" id="brand" name="brand" style={{width: "100%"}}/>
                                        <div className="input-group-btn">
                                            <button type="button" className="btn btn-default dropdown-toggle">
                                                <span className="caret"></span>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-right">
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li className="form-group"><span className="span">燃油类型：</span>
                                    <select id="fule_type">
                                        {
                                            fuleType.map(function(item, index){
                                                return (
                                                    <option value={item.value} key={index}>{item.text}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </li>
                                <li className="form-group">
                                    <span className="span">排量：</span>
                                    <select id="ov" name="ov">
                                        <option value="1">0.8</option>
                                        <option value="2">1.0</option>
                                        <option value="3">1.1</option>
                                        <option value="4">1.3</option>
                                        <option value="5">1.4</option>
                                        <option value="6">1.5</option>
                                        <option value="7">1.6</option>
                                        <option value="8">1.7</option>
                                        <option value="9">1.8</option>
                                        <option value="10">2.0</option>
                                        <option value="11">2.4</option>
                                        <option value="12">2.5</option>
                                        <option value="13">3.0</option>
                                        <option value="14">3.6</option>
                                        <option value="15">4.2</option>
                                        <option value="16">4.7</option>
                                        <option value="17">6.0</option>
                                    </select>
                                </li>
                                <li className="form-group">
                                    <span className="span">排量类型：</span>
                                    <select id="ov_type" name="ovType">
                                        <option value="1">T</option>
                                        <option value="2">L</option>
                                    </select>
                                </li>
                                <li className="form-group">
                                    <span className="span"><span className="red">*&nbsp;</span>入单位时间：</span>
                                    <input id="in_time" type="text" name="in_time" className="date-icon"/>
                                </li>
                                <li className="form-group"><span className="span">车辆类型：</span>
                                    <select id="type">
                                        {
                                            carType.map(function(item, index){
                                                return (
                                                    <option value={item.value} key={index}>{item.text}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </li>
                                <li className="form-group"><span className="span">发动机号：</span><input id="engine_no" type="text"/></li>
                                <li className="form-group"><span className="span"><span className="red">*&nbsp;</span>车架号：</span><input id="vin" name="vin" type="text"/></li>
                                <li className="form-group"><span className="span"><span className="red">*&nbsp;</span>初始公里：</span><input id="mileage" name="mileage" type="text"/></li>
                                <li className="form-group"><span className="span">
                                    <span className="red">*&nbsp;</span>车辆所属单位：</span>
                                    <input id="oper_show_name" name="operShowName" type="text" placeholder="请选择机构部门" style={{width:'240px'}}/>
                                    <input id="oper_hide_org" name="operHideOrg" type="hidden"/>
                                    <div id="oper_car_org_tree" className="openTree-menu" style={{width:'240px',maxHeight:'180px'}}></div>
                                </li>
                                <li className="form-group">
                                    <span className="span">年检时间：</span>
                                    <input id="inspection_time" type="text" name="inspection_time" className="date-icon"/>
                                </li>
                                <li className="form-group">
                                    <span className="span">缴纳保险时间：</span>
                                    <input id="insurance_time" type="text" name="insurance_time" className="date-icon"/>
                                </li>
                                <li className="form-group"><span className="span">保养里程：</span>
                                    <select id="mt_mileage">
                                        <option value="0"></option>
                                        <option value="5000">5000km</option>
                                        <option value="6000">6000km</option>
                                        <option value="7000">7000km</option>
                                        <option value="8000">8000km</option>
                                        <option value="9000">9000km</option>
                                        <option value="10000">10000km</option>
                                    </select>
                                </li>
                                <li className="form-group"><span className="span">当前里程：</span><input id="current_mileage" type="text"/></li>
                                <li className="li01 form-group"><span className="span input-large">其他：</span><textarea id="texts" name="textarea" rows="3" className="textarea"/></li>
                                <li id="err-info" style={{paddingLeft:'110px'}}>

                                </li>
                            </ul>
                            <ul className="fileUp-con">
                                <li className="form-group">车辆照片：<form id="car_image_form" style={{position:'absolute',top:'513px',left:'118px'}}><input id="car_image_input" name="Filedata" type="file" style={{opacity:'0',width:'72px'}} onChange={this.handleImageUpload}/></form><button type="button" className="btn btn-file fileW">选择文件</button>
                                    <div className="file-img"><img onClick={this.handleClickImg} src={__uri("/static/images/photo4.png")} id="car_image"/><button id="car_image_delete" type="button" className="btn  file-img-del" onClick={this.deleteImg}>删除</button></div>
                                </li>
                                <li className="form-group">行驶证正本照片：<form id="driver_image_1_form" style={{position:'absolute',top:'513px',left:'398px'}}><input id="driver_image_1_input" name="Filedata" type="file" style={{opacity:'0',width:'72px'}} onChange={this.handleImageUpload}/></form><button type="button" className="btn btn-file fileW">选择文件</button>
                                    <div className="file-img"><img onClick={this.handleClickImg} src={__uri("/static/images/photo5.png")} id="driver_image_1"/><button id="driver_image_1_delete" type="button" className="btn  file-img-del" onClick={this.deleteImg}>删除</button></div>
                                </li>
                                <li className="form-group">行驶证副页照片：<form id="driver_image_2_form" style={{position:'absolute',top:'513px',left:'640px'}}><input id="driver_image_2_input" name="Filedata" type="file" style={{opacity:'0',width:'72px'}} onChange={this.handleImageUpload}/></form><button type="button" className="btn btn-file fileW">选择文件</button>
                                    <div className="file-img"><img onClick={this.handleClickImg} src={__uri("/static/images/photo6.png")} id="driver_image_2"/><button id="driver_image_2_delete" type="button" className="btn  file-img-del" onClick={this.deleteImg}>删除</button></div>
                                </li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={operType=='update'?this.handleCarUpdate:this.handleCarAdd}>提 交</button>
                            <button type="button" className="btn btn-default" onClick={this.clearCar}>清 空</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var CarModal = React.createClass({
    getInitialState: function() {
        return {}
    },
    render: function() {
        return (
            <div>
                <CarDetailModal/>
                <CarOperModal/>
            </div>
        )
    }
});

export default CarModal;