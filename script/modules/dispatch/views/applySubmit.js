/**
 * @file 用车申请填写 Reflux View
 * @author Banji 2017.08.03
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import DateTimePicker from '../../../common/datetimepicker'
import AreaControl from '../../../common/areaControl'
import Urls from '../../../common/urls'
import BootstrapTree from '../../../common/bootstrapTree'
import CommonFun from '../../../common/commonfun'

import CommonAction from '../../common/actions/commonAction'
import CommonStore from '../../common/stores/commonStore'

import ApplyAction from '../actions/applyAction'
import ApplyStore from "../stores/applyStore";
import GlobalParam from "../../../common/globalParam";

var ApplySubmit = React.createClass({
    getInitialState: function() {
        return {
            carType:[]
        }
    },
    componentDidMount: function () {
        let that = this;
        that.unsubscribe = ApplyStore.listen(that.listenEvent);
        let dateOption = {startDate:CommonFun.getCurrentDate(),minView:'hour',format:'yyyy-mm-dd hh:ii'};
        DateTimePicker.init("input[name='plan_use_time']",dateOption);
        DateTimePicker.init("input[name='plan_return_time']",dateOption);
        AreaControl.initArea(["#startArea","#endArea"],["#startAreaTab","#endAreaTab"]);
        that.renderTree();
        that.fromValidator();
        $("input[name='plan_use_time']").on('changeDate', function() {
            $(this).trigger("change");
        });
        $("input[name='plan_return_time']").on('changeDate', function() {
            $(this).trigger("change");
        });
        if(GlobalParam.get("user")) $("input[name='use_name']").val(GlobalParam.get("user").name).on("focus",function(){
            $(this).val("").unbind("focus");
        });
        if(GlobalParam.get("user")) $("input[name='use_mobile']").val(GlobalParam.get("user").tel);
        CommonAction.loadDataDictionary("carType",{parentId:1},function(data){
            that.setState({carType: data.datas});
        });
    },
    componentWillUnmount:function(){
        this.unsubscribe();//解除监听
    },
    listenEvent: function(type,result){
        switch (type){
            case 'editApply':
                this.editApplyInfo(result);
                break;
            case 'copyApply':
                this.copyApplyInfo(result);
                break;
        }
    },
    editApplyInfo:function(value){
        let that = this;
        that.fillFrom(value);
    },
    copyApplyInfo: function(value){
        let that = this;
        $("#apply_form").data('bootstrapValidator').resetForm();//重置验证
        value.id="";
        that.fillFrom(value);
    },
    clearForm: function () {
        $("#apply_form input[name='id']").val("");
        $("#apply_form label#sq_name").html(GlobalParam.get("user") != 'null'?GlobalParam.get("user").name:"");
        $("#apply_form input[name='use_name']").val("");
        $("#apply_form input[name='use_mobile']").val("");
        $("#apply_form input[name='reason']").val("");
        $("#apply_form input[name='use_org_name']").val("");
        $("#apply_form input[name='use_org']").val("");
        $("#apply_form input[name='use_number']").val("");
        let $selectCarType = $("#apply_form select[name='car']");
        $selectCarType.val($selectCarType.find("option:eq(0)").val());
        $("#apply_form input[name='plan_use_time']").val("");
        $("#apply_form input[name='plan_return_time']").val("");
        $("#apply_form input[name='start_place']").val("");
        $("#apply_form input#startArea").val("");
        $("#apply_form input[data-type='start']").val("");
        $("#apply_form input#endArea").val("");
        $("#apply_form input[data-type='end']").val("");
        $("#apply_form textarea[name='texts']").val("");
        if(!$("#apply_form").data('bootstrapValidator').isValid()) {
            setTimeout(function(){
                $("#apply_form").data('bootstrapValidator').resetForm();
            });
        }
    },
    fillFrom:function(data){
        $("#apply_form input[name='id']").val(data.id);
        $("#apply_form label#sq_name").html(data.sq_name);
        $("#apply_form input[name='use_name']").val(data.use_name);
        $("#apply_form input[name='use_mobile']").val(data.use_mobile);
        $("#apply_form input[name='reason']").val(data.reason);
        $("#apply_form input[name='use_org_name']").val(data.user_org_name);
        $("#apply_form input[name='use_org']").val(data.use_org);
        $("#apply_form input[name='use_number']").val(data.use_number);
        $("#apply_form select[name='car']").val(data.car);
        !!data.plan_time && DateTimePicker.setDate("input[name='plan_use_time']",data.plan_time);
        !!data.plan_return && DateTimePicker.setDate("input[name='plan_return_time']",data.plan_return);
        $("#apply_form input[name='start_place']").val(data.start_place);
        if(!!data.start_place){
            var area = data.start_place.substring(0,data.start_place.lastIndexOf("-"));
            var street = data.start_place.substring(data.start_place.lastIndexOf("-")+1);
            $("#apply_form input#startArea").val(area);
            $("#apply_form input[data-type='start']").val(street);
        }
        $("#apply_form input[name='end_place']").val(data.end_place);
        if(!!data.end_place){
            var area = data.end_place.substring(0,data.end_place.lastIndexOf("-"));
            var street = data.end_place.substring(data.end_place.lastIndexOf("-")+1);
            $("#apply_form input#endArea").val(area);
            $("#apply_form input[data-type='end']").val(street);
        }
        $("#apply_form textarea[name='texts']").val(data.texts);
    },
    renderTree:function(){
        $("#org_tree").css({
            top:$("#use_org_name").position().top + 32,
            left:$("#use_org_name").position().left + 150
        });
        Urls.get(Urls.loadorgtree,{},function(data){
            BootstrapTree.initTree("org_tree",data,"use_org_name","use_org_code");
        });
        //用车单位默认显示当前登录用户机构，树控件没有渲染完成，导致findNodeS方法报 is not function的错误   后面解决
        // setTimeout(function(){
        //     if(!!localStorage.org){
        //         var orgIDs = [];
        //         orgIDs.push(localStorage.org);
        //         BootstrapTree.setNodeCheckByOrgID("org_tree",orgIDs,function(org_node){
        //             $("#use_org_name").val(org_node.text);
        //             $("#use_org_code").val(org_node.org_id);
        //         });
        //     }
        // });
    },
    handleOnChangeAddress:function(event){
        let _self = $(event.target);
        let type = _self.data("type");
        var address,area,street;
        street = _self.val();
        if(!street) return false;
        if(type == "start"){
            area = $("#apply_form input#startArea").val();
            if(!area) return false;
            address = area+"-"+street;
            $("#apply_form input[name='start_place']").val(address).trigger("change");
        }else if(type == "end"){
            area = $("#apply_form input#endArea").val();
            if(!area) return false;
            address = area+"-"+street;
            $("#apply_form input[name='end_place']").val(address).trigger("change");
        }
    },
    handleApplySubmit:function(event){
        let that = this;
        var bootstrapValidator = $('#apply_form').data('bootstrapValidator');
        bootstrapValidator.validate();//触发验证
        if(bootstrapValidator.isValid()){
            var data = CommonFun.getFormData($('#apply_form'));
            var plan_use_time = new Date(data.plan_use_time).getTime();
            var plan_return_time = new Date(data.plan_return_time).getTime();
            if(plan_return_time <= plan_use_time){
                toastr.error("用车结束时间不能小于或等于用车开始时间！");
                return false;
            }
            ApplyAction.applySubmit(data,function(){
                that.clearForm();
                ApplyStore.trigger('addApply');
            });
        }
    },
    fromValidator: function(){
        $('#apply_form').bootstrapValidator({
            excluded: [':disabled'],
            message: 'This value is not valid',
            fields: {
                use_name: {
                    message: 'The use_name is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入用车人！'
                        },
                        stringLength: {
                            max: 10,
                            message: '用车人名字长度不符！'
                        }
                    }
                },
                use_mobile: {
                    message: 'The use mobile is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入用车人电话！'
                        },
                        stringLength: {
                            min: 11,
                            max: 11,
                            message: '用车人电话应为11位手机号码！'
                        },
                        regexp: {
                            regexp: /^1[3|5|7|8]{1}[0-9]{9}$/,
                            message: '请输入正确的车人电话号码！'
                        }
                    }
                },
                reason: {
                    message: 'The reason is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入用车事由！'
                        },
                        stringLength: {
                            min: 4,
                            max: 20,
                            message: '用车事由请用4-20字做简短描述！'
                        }
                    }
                },
                use_org_name: {
                    message: 'the user org name is not valid',
                    container: '#err-info',
                    trigger: 'change',
                    validators: {
                        notEmpty: {
                            message: '请选择用车单位！'
                        },
                    }
                },
                use_number: {
                    message: 'the use number is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty: {
                            message: '请输入用车人数！'
                        },
                        regexp: {
                            regexp: /^\+?[1-9][0-9]*$/,
                            message: '用车人数应为整数！'
                        },
                        stringLength: {
                            max: 2,
                            message: '用车人数小于两位数！'
                        }
                    }
                },
                car: {
                    message: 'the car type is not valid',
                    container: '#err-info',
                    validators: {
                        notEmpty: {
                            message: '请选择用车类型！'
                        }
                    }
                },
                plan_use_time: {
                    message: 'the plan use time is not valid',
                    container: '#err-info',
                    trigger: 'change',
                    validators: {
                        notEmpty: {
                            message: '请选择用车开始时间！'
                        }
                    }
                },
                plan_return_time: {
                    message: 'the plan return time is not valid',
                    container: '#err-info',
                    trigger: 'change',
                    validators: {
                        notEmpty: {
                            message: '请选择用车结束时间！'
                        }
                    }
                },
                start_place: {
                    message: 'the start place is not valid',
                    container: '#err-info',
                    trigger: 'change',
                    validators: {
                        notEmpty: {
                            message: '请选择上车地点，并输入街道名称！'
                        }
                    }
                },
                end_place: {
                    message: 'the end place is not valid',
                    container: '#err-info',
                    trigger: 'change',
                    validators: {
                        notEmpty: {
                            message: '请选择目的地，并输入街道名称！'
                        }
                    }
                },
                texts: {
                    message: 'the texts is not valid',
                    container: '#err-info',
                    validators: {
                        stringLength: {
                            max: 20,
                            message: '备注请用20字以内做简短描述！'
                        }
                    }
                },
            }
        });
    },
    render: function () {
        let that = this;
        let carType = that.state.carType;
        return (
            <div className="bg-box Apply-car-left">
                <form className="form-horizontal form-label-left" id="apply_form">
                    <input type="hidden" name="id"></input>
                    <span className="section">用车申请填写</span>
                    <div className="item form-group">
                        <label className="control-label col-md-3">申请人 &nbsp;&nbsp;
                        </label>
                        <div className="input-div">
                            <label className="control-label col-md-3" id="sq_name">{GlobalParam.get("user").name}</label>
                        </div>
                    </div>
                    <div className="item form-group">
                        <label className="control-label col-md-3" htmlFor="use_name">用车人 &nbsp;<span className="red">*</span>
                        </label>
                        <div className="input-div">
                            <input type="text" id="use_name" name="use_name" className="form-control"/>
                        </div>
                    </div>
                    <div className="item form-group">
                        <label className="control-label col-md-3" htmlFor="use_mobile">用车人电话&nbsp;<span className="red">*</span>
                        </label>
                        <div className="input-div">
                            <input type="text" id="use_mobile" name="use_mobile" className="form-control"/>
                        </div>
                    </div>
                    <div className="item form-group">
                        <label className="control-label col-md-3" htmlFor="reason">用车事由&nbsp;<span className="red">*</span>
                        </label>
                        <div className="input-div">
                            <input type="text" id="reason" name="reason" className="form-control" placeholder="请用4-20字做简短描述"/>
                        </div>
                    </div>
                    <div className="item form-group">
                        <label className="control-label col-md-3" htmlFor="use_org_name">用车单位&nbsp;<span className="red">*</span>
                        </label>
                        <div className="input-div">
                            <input type="text" id="use_org_name" name="use_org_name" style={{width:"404px"}} readOnly/>
                            <input type="hidden" id="use_org_code" name="use_org"></input>
                        </div>
                        <div id="org_tree" style={{border:'1px solid #DBD9D9',position: "absolute", zIndex: "999", width: "404px",maxHeight: "270px", overflow: "scroll",background:"#fff",display:"none"}}></div>
                    </div>
                    <div className="item form-group">
                        <label className="control-label col-md-3" htmlFor="use_number">用车人数&nbsp;<span className="red">*</span>
                        </label>
                        <div className="input-div" style={{width: '150px',float: 'left'}}>
                            <input type="text" id="use_number" name="use_number" className="form-control"/>
                        </div>
                        <div className="control-label" htmlFor="car" style={{width: '100px',float: 'left'}}>用车类型&nbsp;<span className="red">*</span>
                        </div>
                        <div  className="input-div" style={{width: '175px',float: 'left'}}>
                            <select id="car" name="car" style={{width: '154px',height: '32px'}}>
                                {
                                    carType.map(function(item,index){
                                        return (
                                            <option value={item.value} key={index}>{item.text}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="item form-group">
                        <label className="control-label col-md-3" htmlFor="plan_use_time">用车时间 &nbsp;<span className="red">*</span>
                        </label>
                        <div className="input-div">
                            <input type="text"  className="da-width date-icon"  placeholder="开始时间" name="plan_use_time" id="plan_use_time" readOnly/>
                            <span className="text-mar">至</span>
                            <input type="text"  className="da-width date-icon"   placeholder="结束时间" name="plan_return_time" id="plan_return_time" readOnly/>
                        </div>
                    </div>
                    <div className="item form-group">
                        <label className="control-label col-md-3" htmlFor="startArea">上车地点&nbsp;<span className="red">*</span>
                        </label>
                        <div className="input-div">
                            <input data-action="0" type="text" id="startArea" className="add-input" placeholder="请选择上车地点" readOnly/>
                            <div id="startAreaTab" className="area-tab"></div>
                            <input  type="text" placeholder="请输入街道名称" style={{width:'192px',marginLeft:'8px'}} data-type="start" onChange={this.handleOnChangeAddress}/>
                            <input type="hidden" id="start_place" name="start_place"></input>
                        </div>
                    </div>
                    <div className="item form-group">
                        <label className="control-label col-md-3" htmlFor="endArea">目的地 &nbsp;<span className="red">*</span>
                        </label>
                        <div className="input-div">
                            <input data-action="1" type="text" id="endArea" className="add-input" placeholder="请选择目的地" readOnly/>
                            <div id="endAreaTab" className="area-tab"></div>
                            <input  type="text" placeholder="请输入街道名称" style={{width:'192px',marginLeft:'8px'}} data-type="end" onChange={this.handleOnChangeAddress}/>
                            <input type="hidden" name="end_place"></input>
                        </div>
                    </div>
                    <div className="item form-group">
                        <label className="control-label col-md-3" htmlFor="texts">备注 &nbsp;&nbsp;&nbsp;
                        </label>
                        <div className="input-div">
                            <textarea id="texts" name="texts" className="form-control"></textarea>
                        </div>
                    </div>
                    <div className="item" id="err-info" style={{paddingLeft:'313px'}}>

                    </div>
                    <div className="ln_solid"></div>
                    <div className="form-group">
                        <div className="col-md-6 col-md-offset-3" style={{textAlign:'center'}}>
                            <button className={CommonStore.verifyPermission('apply/add')?"btn btn-success":"hide"} onClick={this.handleApplySubmit}>提交</button>
                            <button className="btn" onClick={this.clearForm}>重置</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
});

export default ApplySubmit;