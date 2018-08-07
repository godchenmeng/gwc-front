/**
 * @file 调度Reflux Store
 * @author Banji 2017.07.25
 */

import DispatchAction from '../actions/dispatchAction'
import Urls from '../../../common/urls'
import BootstrapTable from '../../../common/bootstrapTable'

var DispatchStore = Reflux.createStore({
    listenables: [DispatchAction],
    data: {
        columns:[{
            field: 'select',
            checkbox: true,
            align: 'center',
            valign: 'middle',
            checked: false
        },{
            field:'id',
            title:'序号',
            align:'center',
            valign:'middle',
            visible:false
        },{
            field:'use_name',
            title:'用车人',
            align:'center',
            valign:'middle'
        },{
            field:'use_number',
            title:'用车人数',
            align:'center',
            valign:'middle'
        },{
            field:'type_name',
            title:'用车类型',
            align:'center',
            valign:'middle'
        },{
            field:'plan_time',
            title:'开始时间',
            align:'center',
            valign:'middle'
        },{
            field:'plan_return',
            title:'结束时间',
            align:'center',
            valign:'middle'
        },{
            field:'start_place',
            title:'上车地点',
            align:'center',
            valign:'middle'
        },{
            field:'end_place',
            title:'目的地',
            align:'center',
            valign:'middle'
        },{
            field:'reason',
            title:'用车事由',
            align:'center',
            valign:'middle'
        },{
            field:'apply_status',
            title:'状态',
            align:'center',
            valign:'middle',
            formatter : function (value,row,index){
                var apply_status = {
                    "1":"待办",
                    "1.5":"驾驶员反馈",
                    "2":"同意",
                    "3":"驳回",
                    "4":"已撤销"
                }
                return !!apply_status[value]?apply_status[value]:"-";
            }
        },{
            field:'operate',
            title:'操作',
            align:'center',
            valign:'middle',
            events: {
                'click .Agree-icon': function(e, value, row, index) {
                    $("#dispatch_agree_modal").modal('toggle');
                    DispatchStore.trigger('dispatchEvent',row);
                    $("#dispatch_car_table").bootstrapTable("destroy");
                    $("#dispatch_driver_table").bootstrapTable("destroy");
                    BootstrapTable.initTable("dispatch_car_table",10,[5,10],Urls.dispatchCarList,DispatchStore.data.car_columns,DispatchStore.data.car_queryParams,Urls.post);
                    BootstrapTable.initTable("dispatch_driver_table",10,[5,10],Urls.dispatchDriverList,DispatchStore.data.driver_columns,DispatchStore.data.driver_queryParams,Urls.post);
                },
                'click .Reject-icon': function(e, value, row, index) {
                    $("#dd_reason,#li_dd_result,#li_dd_reason,#li_repeal_reason,.li_driver_info,#li_driver_feedback,#li_pq_status,#btn-green,#btn-edit").addClass("hide");
                    $("#dd_reason").removeClass("hide");
                    $("#btn-green").removeClass("hide");
                    $("#dispatch_reject_modal").modal('toggle');
                    DispatchStore.trigger('dispatchEvent',row);
                }
            },
            formatter : function (value,row,index){
                return row.apply_status == '1'?[
                    '<div class="action-icon1" style="width: 100%;">',
                    '<a class="Agree-icon" title="同意"></a>',
                    '<a class="Reject-icon" title="驳回"></a>',
                    '<div/>'
                ].join(''):"-";
            }
        }],
        queryParams:function(params){
            var apply_status = $("a.active[data-status]").data("status");
            var param = {
                apply_status:apply_status,
                use_name : $("input[name='use_name']").val(),
                start_time : $("input[name='start_date']").val(),
                end_time : $("input[name='end_date']").val(),
                limit : params.limit, // 页面大小
                pageIndex : this.pageNumber - 1,
            };
            DispatchStore.data.dispatchSearchParam = param;
            return param;
        },
        car_columns:[{
            field: 'select',
            checkbox: true,
            align: 'center',
            valign: 'middle',
            checked: false
        },{
            field:'id',
            title:'序号',
            align:'center',
            valign:'middle',
            visible:false
        },{
            field:'oname',
            title:'部门',
            align:'center',
            valign:'middle'
        },{
            field:'car_no',
            title:'车牌号',
            align:'center',
            valign:'middle'
        },{
            field:'type_name',
            title:'车辆类型',
            align:'center',
            valign:'middle'
        }],
        car_queryParams:function(params){
            var car_no = $("#dispatch_agree_modal input[name='car_no']").val();
            var apply = $("#dispatch_agree_modal input[name='apply_id']").val();
            var param = {
                car_no_r:car_no,
                apply:apply,
                obd:"1",
                limit : params.limit, // 页面大小
                pageIndex : this.pageNumber - 1,
            }
            return param;
        },
        driver_columns:[{
            field: 'select',
            checkbox: true,
            align: 'center',
            valign: 'middle',
            checked: false
        },{
            field:'id',
            title:'序号',
            align:'center',
            valign:'middle',
            visible:false
        },{
            field:'oname',
            title:'部门',
            align:'center',
            valign:'middle'
        },{
            field:'name',
            title:'姓名',
            align:'center',
            valign:'middle'
        },{
            field:'driver_type',
            title:'驾驶证类型',
            align:'center',
            valign:'middle'
        }],
        driver_queryParams:function(params){
            var driver_name = $("#dispatch_agree_modal input[name='driver_name']").val();
            var apply = $("#dispatch_agree_modal input[name='apply_id']").val();
            var param = {
                apply:apply,
                driver_name:driver_name,
                limit : params.limit, // 页面大小
                pageIndex : this.pageNumber - 1,
            }
            return param;
        },
        dispatchSearchParam:undefined,
    },
    /**
     * 响应Action seerch，搜索调度列表
     *
     * @param {dataType} paramName  说明
     */
    onSearch: function(){
        $('#dispatch_table').bootstrapTable('refresh');
    },
    /**
     * 用车调度列表数据导出
     * @param {object} data 提交的数据
     */
    onExport: function(data){
        Urls.open(Urls.dispatchExport,data);
    },
    /**
     * 响应Action emergency 紧急调度
     *
     * @param {object} data  请求数据
     * @param {function} callBackFun 请求成功回调
     */
    onEmergency:function(data,callBackFun){
        Urls.post(Urls.dispatchEmergency,data,function(result){
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                toastr.success("提交成功！");
                if(!!callBackFun) callBackFun();
                DispatchStore.onSearch();
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    /**
     * 响应Action car seerch，可调度车辆搜索
     *
     * @param {dataType} paramName  说明
     */
    onCarSearch: function(){
        $('#dispatch_car_table').bootstrapTable('refresh');
    },
    /**
     * 响应Action driver seerch，可调度司机搜索
     *
     * @param {dataType} paramName  说明
     */
    onDriverSearch: function(){
        $('#dispatch_driver_table').bootstrapTable('refresh');
    },
    /**
     * 响应Action agree，同意调度
     *
     * @param {object} data  请求数据
     * @param {function} callBackFun 请求成功回调
     */
    onAgree:function(data,callBackFun){
        Urls.post(Urls.dispatchAgree,data,function(result){
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                toastr.success("操作成功！");
                if(!!callBackFun) callBackFun();
                DispatchStore.onSearch();
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    /**
     * 响应Action reject，调度驳回
     *
     * @param {object} data  请求数据
     * @param {function} callBackFun 请求成功回调
     */
    onReject: function(data,callBackFun){
        Urls.post(Urls.dispatchReject,data,function(result){
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                toastr.success("驳回成功！");
                if(!!callBackFun) callBackFun();
                DispatchStore.onSearch();
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    onSearchCar: function(){
        $('#dispatch_car_table').bootstrapTable('refresh');
    },
    onSearchDriver: function(){
        $('#dispatch_driver_table').bootstrapTable('refresh');
    },

});

export default DispatchStore