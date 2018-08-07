/**
 * @file 派遣 Reflux Store
 * @author Banji 2017.08.21
 */

import ControlAction from '../actions/controlAction'
import Urls from '../../../common/urls'

var ControlStore = Reflux.createStore({
    listenables: [ControlAction],
    data: {
        columns:[{
            field: '',
            checkbox: true,
            align: 'center',
            valign: 'middle',
            checked: false
        },{
            field:'car_no',
            title:'车牌号',
            align:'center',
            valign:'middle'
        },{
            field:'driver_name',
            title:'驾驶员',
            align:'center',
            valign:'middle'
        },{
            field:'use_name',
            title:'用车人',
            align:'center',
            valign:'middle'
        },{
            field:'user_org_name',
            title:'用车部门',
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
            field:'type_name',
            title:'用车类型',
            align:'center',
            valign:'middle'
        },{
            field:'apply_status',
            title:'状态',
            align:'center',
            valign:'middle',
            formatter : function (value,row,index){
                var apply_status = {
                    "1":"待签收",
                    "2":"反馈",
                    "3":"待完成",
                    "4":"已撤销",
                    "5":"已完成",
                    "6":"作废"
                }
                return !!apply_status[value]?apply_status[value]:"-";
            }
        },{
            field:'operate',
            title:'操作',
            align:'center',
            valign:'middle',
            events: {
                'click .Sign-icon': function(e, value, row, index) {
                    var id = row.pq_id;
                    if(!id){
                        toastr.error("派遣单信息丢失，操作失败！");
                        return;
                    }
                    ControlStore.onSign({id:id});
                },
                'click .feedback-icon': function(e, value, row, index) {
                    $("#driver_feedback,#li_dd_result,#li_repeal_reason,.li_driver_info,#li_driver_feedback,#li_pq_status,#btn-green,#btn-orange,#btn-submit").addClass("hide");
                    $("#driver_feedback").removeClass("hide");
                    $("#btn-submit").removeClass("hide");
                    $("#control_modal").modal('toggle');
                    ControlStore.trigger('controlEvent',row);
                }
            },
            formatter : function (value,row,index){
                if(row.apply_status == '1'){//待签收
                    return [
                        '<div class="action-icon1" style="width: 100%;">',
                        '<a class="Sign-icon" title="签收"></a>',
                        '<a class="feedback-icon" title="反馈"></a>',
                        '<div/>'
                    ].join('');
                }else if(row.apply_status == '2'){//反馈
                    return [
                        '<div class="action-icon1" style="width: 100%;">',
                        '<a class="Sign-icon" title="签收"></a>',
                        '<div/>'
                    ].join('');
                }else{
                    return "-";
                }
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
            }
            ControlStore.data.controlSearchParam = param;
            return param;
        },
        controlSearchParam:undefined,
    },
    /**
     * 响应Action seerch，搜索派遣列表
     * @param {dataType} paramName  说明
     */
    onSearch: function(){
        $('#control_table').bootstrapTable('refresh');
    },
    /**
     * 用车派遣列表数据导出
     * @param {object} data 提交的数据
     */
    onExport: function(data){
        Urls.open(Urls.controlExport,data);
    },
    /**
     * 响应Action sign 派遣签收
     *
     * @param {object} data  请求数据
     * @param {function} callBackFun 请求成功回调
     */
    onSign:function(data,callBackFun){
        Urls.post(Urls.controlSign,data,function(result){
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                toastr.success("签收成功！");
                if(!!callBackFun) callBackFun();
                ControlStore.onSearch();
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    /**
     * 响应Action feedback 派遣反馈
     *
     * @param {object} data  请求数据
     * @param {function} callBackFun 请求成功回调
     */
    onFeedback: function(data,callBackFun){
        Urls.post(Urls.controlFeedback,data,function(result){
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                toastr.success("操作成功！");
                if(!!callBackFun) callBackFun();
                ControlStore.onSearch();
            }else{
                toastr.error(result.responseMsg);
            }
        })
    }

});

export default ControlStore