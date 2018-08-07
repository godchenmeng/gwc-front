/**
 * @file 审批Reflux Store
 * @author Banji 2017.08.14
 */

import ApprovalAction from '../actions/approvalAction'

import Urls from '../../../common/urls'
import CommonStore from "../../common/stores/commonStore";

var ApprovalStore = Reflux.createStore({
    listenables: [ApprovalAction],
    data: {
        columns:[{
            field: '',
            checkbox: true,
            align: 'center',
            valign: 'middle'
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
            field:'sp_status',
            title:'状态',
            align:'center',
            valign:'middle',
            formatter : function (value,row,index){
                var sp_status = {
                    "1":"待办",
                    "2":"同意",
                    "3":"驳回",
                    "4":"已撤销"
                }
                return !!sp_status[value]?sp_status[value]:"-";
            }
        },{
            field:'operate',
            title:'操作',
            align:'center',
            valign:'middle',
            events:{
                'click .Agree-icon': function (e, value, row, index) {
                    var sp_status = $("button#btn-green").data("status");
                    var data = {
                        id:row.id,
                        sp_status:sp_status
                    };
                    ApprovalAction.agree(data);
                },
                'click .Reject-icon': function (e, value, row, index) {
                    $("li#li_sp_reason,li#li_sp_result,li#li_reason,li#li_repeal_reason,button#btn-green,button#btn-orange,button#btn-submit").addClass("hide");
                    $("li#li_sp_reason").removeClass("hide");
                    $("button#btn-submit").removeClass("hide");
                    $("#approval_modal").modal('toggle');
                    ApprovalStore.trigger("rejectApply",row);
                }
            },
            formatter : function (value,row,index){
                let opHtml = [];
                opHtml.push('<div class="action-icon1" style="width:100%">');
                if(CommonStore.verifyPermission('check/apply')) opHtml.push('<a class="Agree-icon" title="同意"></a>');
                opHtml.push('<a class="Reject-icon" title="驳回"></a>');
                opHtml.push('</div>');
                return row.sp_status == '1'?opHtml.join(''):"-";
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
            ApprovalStore.data.approvalSearchParam = param;
            return param;
        },
        approvalSearchParam:undefined,
    },
    /**
     * 响应Action seerch，搜索审批列表
     *
     */
    onSearch: function(){
        $('#approval_table').bootstrapTable('refresh');
    },
    /**
     * 用车审批列表数据导出
     * @param {object} data 提交的数据
     */
    onExport: function(data){
        Urls.open(Urls.approvalExport,data);
    },
    /**
     * 响应Action agree，审批同意
     *
     * @param {object} data  请求数据
     * @param {function} callBackFun 请求成功回调
     */
    onAgree: function(data,callBackFun){
        $('#loading').modal('show');
        Urls.post(Urls.approvalAgree,data,function(result){
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                if(!!callBackFun) callBackFun();
                ApprovalStore.onSearch();
                $('#loading').modal('hide');
                toastr.success("操作成功！");
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    /**
     * 响应Action reject，审批驳回
     *
     * @param {object} data  请求数据
     * @param {function} callBackFun 请求成功回调
     */
    onReject: function(data,callBackFun){
        Urls.post(Urls.approvalReject,data,function(result){
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                toastr.success("驳回成功！");
                $("#approval_modal").modal('toggle');
                if(!!callBackFun) callBackFun();
                ApprovalStore.onSearch();
            }else{
                toastr.error(result.responseMsg);
            }
        })
    }

});

export default ApprovalStore