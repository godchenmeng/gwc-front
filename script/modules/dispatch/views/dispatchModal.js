import React, { Component } from 'react';
import { render } from 'react-dom';

import Urls from '../../../common/urls';
import AreaControl from '../../../common/areaControl'
import BootstrapTable from '../../../common/bootstrapTable';
import DateTimePicker from '../../../common/datetimepicker';
import BootstrapTree from '../../../common/bootstrapTree';
import CommonFun from '../../../common/commonfun';

import CommonAction from '../../common/actions/commonAction';

import DispatchStore from '../stores/dispatchStore';
import DispatchAction from '../actions/dispatchAction';

var DispatchModal = React.createClass({
    getInitialState: function() {
        return {
            applyInfo:{
                "id": 0,
                "sq_id": 0,
                "sq_name": "",
                "sq_org": 0,
                "sq_org_name": "",
                "sq_mobile": "",
                "use_name": "",//用车人
                "use_org": 0,    //用车单位code
                "user_org_name": "",//用车单位名称
                "use_mobile": "",//用车人电话
                "use_number": 0,//用车人数
                "plan_time": "0000-00-00 00:00:00",//用车开始时间
                "plan_return": "0000-00-00 00:00:00",//用车结束时间
                "start_place": "",//上车地点
                "end_place": "",//目的地
                "car": "",//用车类型
                "reason": "",//用车事由
                "texts": "",//备注
                "apply_status": "",//申请单状态
            },
            carType:[],
        };
    },
    componentDidMount: function () {
        let that = this;
        that.unsubscribe = DispatchStore.listen(that.listenEvent);
        let dateOption = {startDate:CommonFun.getCurrentDate(),minView:'hour',format:'yyyy-mm-dd hh:ii'};
        DateTimePicker.init("input[name='plan_time']",dateOption);
        DateTimePicker.init("input[name='plan_return']",dateOption);
        AreaControl.initArea(["#startArea","#endArea"],["#startAreaTab","#endAreaTab"]);
        that.renderTree();
        that.fromValidator();
        // $('#dispatch_agree_modal').on('show.bs.modal', function () {
        //     //that.handleClearBox(null);
        //     console.log(that.state.applyInfo);
        //     $("#dispatch_car_table").bootstrapTable("destroy");
        //     $("#dispatch_driver_table").bootstrapTable("destroy");
        //     BootstrapTable.initTable("dispatch_car_table",10,[5,10],Urls.dispatchCarList,DispatchStore.data.car_columns,DispatchStore.data.car_queryParams,Urls.post);
        //     BootstrapTable.initTable("dispatch_driver_table",10,[5,10],Urls.dispatchDriverList,DispatchStore.data.driver_columns,DispatchStore.data.driver_queryParams,Urls.post);
        // })
        CommonAction.loadDataDictionary("carType",{parentId:1},function(data){
            that.setState({carType: data.datas});
        });
    },
    componentWillUnmount: function(){
        this.unsubscribe();
    },
    listenEvent: function(type,result){
        switch (type){
            case 'dispatchEvent':
                this.listenDispatchEvent(result);
                break;
        }
    },
    listenDispatchEvent:function(value){
        let that = this;
        that.setState({applyInfo:value});
        that.clearModal();
    },
    _getObjectIds:function(objectArray){
        var ids = [];
        for(var i = 0; i < objectArray.length ; i++){
            ids.push(objectArray[i].id);
        }
        return ids;
    },
    handleEmergencySubmit:function(event){
        var bootstrapValidator = $('#emergency_apply_form').data('bootstrapValidator');
        bootstrapValidator.validate();//触发验证
        if(bootstrapValidator.isValid()){
            var data = CommonFun.getFormData($('#emergency_apply_form'));
            var plan_time = new Date(data.plan_time).getTime();
            var plan_return = new Date(data.plan_return).getTime();
            if(plan_return <= plan_time){
                toastr.error("用车结束时间不能小于或等于用车开始时间！");
                return false;
            }
            DispatchAction.emergency(data,function(){
                $("#emergency_dispatch_modal").modal('toggle');
            });
        }
    },
    handleClickAgree:function(event){
        let that = this;
        var id = that.state.applyInfo.id;
        if(!id){
            toastr.error("申请单信息丢失，操作失败！");
            return;
        }
        var cars = $('#dispatch_car_table').bootstrapTable('getSelections');
        var drivers = $('#dispatch_driver_table').bootstrapTable('getSelections');
        if(cars.length == 0){
            toastr.error("请选择调度车辆！");
            return;
        }
        if(drivers.length == 0){
            toastr.error("请选择调度司机！");
            return;
        }
        if(cars.length != drivers.length){
            toastr.error("选择车辆数和驾驶员数不匹配！");
            return;
        }
        var carIds = that._getObjectIds(cars);
        var driverIds = that._getObjectIds(drivers);
        var param = {
            id:id,
            car:carIds,
            driver:driverIds
        };
        var car_id = that.state.applyInfo.car_id;
        var driver_id = that.state.applyInfo.driver_id;
        if(!!car_id && !!driver_id){//修改调度
            param.car_id = car_id;
            param.driver_id = driver_id;
        }
        DispatchAction.agree(param,function(){
            $("#dispatch_agree_modal").modal('toggle');
        });
    },
    handleClickReject:function(event){
        let that = this;
        var id = that.state.applyInfo.id;
        var dd_reason = $("#dispatch_reject_modal textarea[name='dd_reason']").val();
        if(!dd_reason){
            toastr.error("请填写驳回理由！");
            return;
        }
        var param = {
            id:id,
            reason:dd_reason
        };
        DispatchAction.reject(param,function(){
            $("#dispatch_reject_modal").modal('toggle');
        });
    },
    handleShowRejectModal:function(event){
        $("#dispatch_agree_modal").modal('toggle');
        $("#dd_reason,#li_dd_result,#li_dd_reason,#li_repeal_reason,.li_driver_info,#li_driver_feedback,#li_pq_status,#btn-green,#btn-edit").addClass("hide");
        $("#dd_reason").removeClass("hide");
        $("#btn-green").removeClass("hide");
        $("#dispatch_reject_modal").modal('toggle');
    },
    handleShowAgreeModal:function(event){
        $("#dispatch_agree_modal").modal('toggle');
        $("#dispatch_reject_modal").modal('toggle');
        $("#dispatch_car_table").bootstrapTable("destroy");
        $("#dispatch_driver_table").bootstrapTable("destroy");
        BootstrapTable.initTable("dispatch_car_table",10,[5,10],Urls.dispatchCarList,DispatchStore.data.car_columns,DispatchStore.data.car_queryParams,Urls.post);
        BootstrapTable.initTable("dispatch_driver_table",10,[5,10],Urls.dispatchDriverList,DispatchStore.data.driver_columns,DispatchStore.data.driver_queryParams,Urls.post);
    },
    handleOnChangeAddress:function(event){
        let _self = $(event.target);
        let type = _self.data("type");
        var address,area,street;
        street = _self.val();
        if(!street) return false;
        if(type == "start"){
            area = $("#emergency_apply_form input#startArea").val();
            if(!area) return false;
            address = area+"-"+street;
            $("#emergency_apply_form input[name='start_place']").val(address).trigger("change");
        }else if(type == "end"){
            area = $("#emergency_apply_form input#endArea").val();
            if(!area) return false;
            address = area+"-"+street;
            $("#emergency_apply_form input[name='end_place']").val(address).trigger("change");
        }
    },
    handleSearchCar:function(event){
        DispatchAction.searchCar();
    },
    handleSearchDriver:function(event){
        DispatchAction.searchDriver();
    },
    renderTree:function(){
        $("#org_tree").css({
            top:$("#use_org_name").position().top + $("#use_org_name").outerHeight() + 1,
            left:$("#use_org_name").position().left + 105
        });
        Urls.get(Urls.loadorgtree,{},function(data){
            BootstrapTree.initTree("org_tree",data,"use_org_name","use_org_code");
        });
    },
    fromValidator: function(){
        $('#emergency_apply_form').bootstrapValidator({
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
                plan__time: {
                    message: 'the plan use time is not valid',
                    container: '#err-info',
                    trigger: 'change',
                    validators: {
                        notEmpty: {
                            message: '请选择用车开始时间！'
                        }
                    }
                },
                plan_return: {
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
    clearModal: function () {
        $("#dispatch_reject_modal textarea[name='dd_reason']").val("");
    },
    render: function() {
        let that = this;
        let applyInfo = that.state.applyInfo;
        let carType = that.state.carType;
        let dd_result = {
            "1":"待办",
            "2":"同意",
            "3":"驳回",
            "4":"已撤回",
        };
        let pq_result = {
            "1":"待出车",
            "2":"待完成",
            "3":"待完成",
            "5":"待完成",
            "6":"已完成",
            "7":"作废",
            "8":"已撤销",
            "9":"已反馈",
        };
        return (
            <div>
                <div id="emergency_dispatch_modal" className="modal fade top-mar" style={{overflowY:"scroll"}}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"><span>&times;</span></button>
                                <h4 className="modal-title">紧急调度</h4>
                            </div>
                            <div className="modal-body">
                                <form className="form-horizontal form-label-left" id="emergency_apply_form">
                                    <ul className="modal-form-con">
                                        <li className="form-group">
                                            <span className="span" htmlFor="use_name"><span className="red">*&nbsp;</span>用车人：</span>
                                            <input type="text" id="use_name" name="use_name"/>
                                        </li>
                                        <li className="form-group">
                                            <span className="span" htmlFor="use_mobile"><span className="red">*&nbsp;</span>用车人电话：</span>
                                            <input type="text" id="use_mobile" name="use_mobile"/>
                                        </li>
                                        <li className="form-group">
                                            <span className="span" htmlFor="reason"><span className="red">*&nbsp;</span>用车事由：</span>
                                            <input type="text" id="reason" name="reason"/>
                                        </li>
                                        <li>
                                            <span className="span" htmlFor="use_org_name"><span className="red">*&nbsp;</span>用车部门：</span>
                                            <input type="text" id="use_org_name" name="use_org_name"/>
                                            <input type="hidden" id="use_org" name="use_org"></input>
                                            <div id="org_tree" className="openTree-menu" style={{width: "241px",maxHeight: "270px"}}></div>
                                        </li>
                                        <li className="form-group">
                                            <span className="span" htmlFor="use_number"><span className="red">*&nbsp;</span>用车人数：</span>
                                            <input type="text" id="use_number" name="use_number"/></li>
                                        <li>
                                            <span className="span" htmlFor="car"><span className="red">*&nbsp;</span>用车类型：</span>
                                            <select id="car" name="car">
                                                {
                                                    carType.map(function(item, index){
                                                        return (
                                                            <option value={item.value} key={index}>{item.text}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </li>
                                        <li className="li01 form-group">
                                            <span className="span" htmlFor="plan_time"><span className="red">*&nbsp;</span>用车时间：</span>
                                            <input type="text"  className="date-icon da-width155" placeholder="开始时间" name="plan_time" id="plan_time"/>
                                            &nbsp;&nbsp;-&nbsp;&nbsp;
                                            <input type="text"  className="date-icon da-width155" placeholder="结束时间" name="plan_return" id="plan_return"/>
                                        </li>
                                        <li className="li01 form-group">
                                            <span className="span" htmlFor="startArea"><span className="red">*&nbsp;</span>上车地点：</span>
                                            <input  data-action="0" type="text" id="startArea" className="add-input" placeholder="请选择上车地点"  style={{width:'200px'}}/>
                                            <div id="startAreaTab" className="area-tab"></div>
                                            <input  type="text" style={{width:'192px',marginLeft:'8px'}} data-type="start" placeholder="请输入街道名称" onChange={this.handleOnChangeAddress}/>
                                            <input type="hidden" name="start_place"></input>
                                        </li>
                                        <li className="li01 form-group">
                                            <span className="span" htmlFor="endArea"><span className="red">*&nbsp;</span>目的地：</span>
                                            <input  data-action="1" type="text" id="endArea" className="add-input" placeholder="请选择目的地"  style={{width:'200px'}}/>
                                            <div id="endAreaTab" className="area-tab"></div>
                                            <input  type="text" style={{width:'192px',marginLeft:'8px'}} data-type="end" placeholder="请输入街道名称" onChange={this.handleOnChangeAddress}/>
                                            <input type="hidden" name="end_place"></input>
                                        </li>
                                        <li className="li01 form-group">
                                            <span className="span" htmlFor="texts">备注：</span>
                                            <textarea id="texts" name="texts" rows="3"  className="textarea1"></textarea>
                                        </li>
                                        <li className="li01" id="err-info" style={{paddingLeft:'105px'}}></li>
                                    </ul>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.handleEmergencySubmit}>提 交</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="dispatch_agree_modal" className="modal fade Agree top-mar" style={{overflowY:"scroll"}}>
                    <div className="modal-dialog modal-lg" style={{marginTop:"10px"}}>
                        <div className="modal-content">
                            <div className="modal-header" style={{background:"#fff", borderBottom:"none"}}>
                                <button type="button" className="close" data-dismiss="modal"><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <input type="hidden" name="apply_id" value={applyInfo.id}/>
                                <ul className="modal-form-con" style={{marginTop: "-30px"}}>
                                    {/*<li><span className="span grey">用车人：</span>{applyInfo.use_name}&nbsp;&nbsp; <input type="checkbox"/>&nbsp;用车人自己作为司机</li>*/}
                                    <li><span className="span grey">用车人：</span>{applyInfo.use_name}</li>
                                    <li><span className="span grey">用车人电话：</span>{applyInfo.use_mobile}</li>
                                    <li><span className="span grey">用车时间：</span>{applyInfo.plan_time.substring(0,10)}&nbsp;至&nbsp;{applyInfo.plan_return.substring(0,10)}</li>
                                    <li><span className="span grey">用车部门：</span>{applyInfo.user_org_name}</li>
                                    <li><span className="span grey">用车人事由：</span>{applyInfo.reason}</li>
                                    <li><span className="span grey">上车地点：</span>{applyInfo.start_place}</li>
                                    <li><span className="span grey">用车类型：</span>{!!applyInfo.type_name?applyInfo.type_name:""}</li>
                                    <li><span className="span grey">目的地：</span>{applyInfo.end_place}</li>
                                    <li className="li01"><span className="span grey">备注：</span>{applyInfo.texts}</li>
                                    <li className="pad-l"><input type="text" name="car_no" placeholder="请输入车牌号" onBlur={this.handleSearchCar}/></li>
                                    <li className="pad-l"><input type="text" name="driver_name" placeholder="请输入司机姓名" onBlur={this.handleSearchDriver}/></li>
                                    <li className="pad12">
                                        <table id="dispatch_car_table" style={{width:"100%", cellSpacing:"0", cellPadding:"0"}} className="table-dispatch"></table>
                                    </li>
                                    <li className="pad12">
                                        <table id="dispatch_driver_table" style={{width:"100%", cellSpacing:"0", cellPadding:"0"}} className="table-dispatch"></table>
                                    </li>
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btnOne btn-green" onClick={this.handleClickAgree}><i className="icon-bg agree-icon"/>同意调度</button>
                                <button type="button" className="btnOne btn-orange" onClick={this.handleShowRejectModal}><i className="icon-bg reject-icon"></i>驳 回</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="dispatch_reject_modal" className="modal fade Reject">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header" style={{background:'#fff',borderBottom:'none'}}>
                                <button type="button" className="close" data-dismiss="modal"><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <ul className="modal-form-con" style={{marginTop:'-30px'}}>
                                    <li><span className="span grey">用车人：</span>{applyInfo.use_name}&nbsp;&nbsp;</li>
                                    <li><span className="span grey">用车人电话：</span>{applyInfo.use_mobile}</li>
                                    <li><span className="span grey">用车时间：</span>{applyInfo.plan_time.substring(0,10)}&nbsp;至&nbsp;{applyInfo.plan_return.substring(0,10)}</li>
                                    <li><span className="span grey">用车部门：</span>{applyInfo.user_org_name}</li>
                                    <li><span className="span grey">用车人事由：</span>{applyInfo.reason}</li>
                                    <li><span className="span grey">上车地点：</span>{applyInfo.start_place}</li>
                                    <li><span className="span grey">用车类型：</span>{!!applyInfo.type_name?applyInfo.type_name:""}</li>
                                    <li><span className="span grey">目的地：</span>{applyInfo.end_place}</li>
                                    <li className="li01"><span className="span grey">备注：</span>{applyInfo.texts}</li>
                                    <li className="li01" id="dd_reason">
                                        <span className="span grey"><span className="red">*&nbsp;</span>驳回原因：</span>
                                        <textarea name="dd_reason" rows="5"  style={{width:"60%", height:"120px"}} placeholder="如驳回，请填写驳回理由..."></textarea>
                                    </li>
                                    <li className="li01" id="li_dd_result"><span className="span grey">处理结果：</span>{dd_result[applyInfo.dd_status]}</li>
                                    <li className="li01" id="li_dd_reason"><span className="span grey">驳回原因：</span>{applyInfo.dd_reason}</li>
                                    <li className="li01" id="li_repeal_reason"><span className="span grey">撤销原因：</span>{applyInfo.repeal_reason}</li>
                                    <li className="li_driver_info"><span className="span grey">驾驶员：</span>{applyInfo.driver_name}</li>
                                    <li className="li_driver_info"><span className="span grey">车牌号：</span>{applyInfo.car_no}</li>
                                    <li className="li01 li_driver_info"><span className="span grey">驾驶员电话：</span>{applyInfo.driver_mobile}</li>
                                    <li className="li01" id="li_driver_feedback"><span className="span grey">驾驶员反馈：</span>{applyInfo.feedback}</li>
                                    <li className="li01" id="li_pq_status"><span className="span grey">任务状态：</span>{pq_result[applyInfo.pq_status]}</li>
                                </ul>
                                <div className="mesSet-box">

                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" id="btn-green" className="btnOne btn-green" data-status="3" onClick={this.handleClickReject}><i className="icon-bg agree-icon"/>提交</button>
                                <button type="button" id="btn-edit" className="btnOne btn-bule" onClick={this.handleShowAgreeModal}><i className="icon-bg edit-icon"></i>修 改</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export  default  DispatchModal;