/**
 * @file 用车申请 Reflux Store
 * @author Banji 2017.08.03
 */

import ApplyAction from '../actions/applyAction'

import CommonFun from '../../../common/commonfun'
import Urls from '../../../common/urls'

import CommonStore from '../../common/stores/commonStore'

var ApplyStore = Reflux.createStore({
    listenables: [ApplyAction],
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
            field:'createdate',
            title:'申请时间',
            align:'center',
            valign:'middle'
        },{
            field:'plan_time',
            title:'开始时间',
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
                    "1":"待审批",
                    "2":"待调度",
                    "3":"待出车",
                    "4":"待完成",
                    "5":"已完成",
                    "6":"驳回",
                    "7":"已撤销",
                    "8":"作废",
                    "9":"反馈"
                }
                return !!apply_status[value]?apply_status[value]:"-";
            }
        },{
            field:'operate',
            title:'操作',
            align:'center',
            valign:'middle',
            events:{
                'click .revoke': function (e, value, row, index) {
                    $("textarea[name='repeal_reason']").parent().removeClass("hide");
                    $("button#btn-green").removeClass("hide");
                    $("button#btn-revoke,button#btn-c-add,button#btn-edit").addClass("hide");
                    $("#apply_list_modal").modal('toggle');
                    ApplyStore.trigger('repealListApply',row);
                },
                'click .edit': function (e, value, row, index) {
                    CommonStore.trigger('switchtab', 'Apply');
                    ApplyStore.trigger('editApply',row);
                },
                'click .c-add': function(e, value, row, index){
                    CommonStore.trigger('switchtab', 'Apply');
                    ApplyStore.trigger('copyApply',row);
                }
            },
            formatter : function (value,row,index){
                var html = [];
                html.push('<div class="action-icon1" style="width:100%">');
                if(row.apply_status == "1" || row.apply_status == "2" || row.apply_status == "3" || row.apply_status == "5"){
                    html.push('<a class="revoke" title="撤销"></a>');
                }
                if(row.apply_status == "1" || row.apply_status == "6"){
                    html.push('<a class="edit" title="编辑"></a>');
                }
                html.push('<a class="c-add" title="复制并新增"></a>');
                html.push('</div>');
                return html.join('');
            }
        }],
        queryParams:function(params){
            var param = {
                apply_status: $("select[name='apply_status']").val(),
                use_name : $("input[name='use_name']").val(),
                start_time : $("input[name='start_date']").val(),
                end_time : $("input[name='end_date']").val(),
                limit : params.limit, // 页面大小
                pageIndex : this.pageNumber - 1
            }
            ApplyStore.data.applySearchParam = param;
            return param;
        },
        currentDate:CommonFun.getCurrentDate(),
        today:CommonFun.getCurrentTime("today"),
        yesterday:CommonFun.getCurrentTime("yesterday"),
        thisWeek:CommonFun.getCurrentTime("thisWeek"),
        lastWeek:CommonFun.getCurrentTime("lastWeek"),
        thisMonth:CommonFun.getCurrentTime("thisMonth"),
        lastMonth:CommonFun.getCurrentTime("lastMonth"),
        currentSelectStatus:undefined,
        applySearchParam:undefined,
    },
    /**
     * 响应Action seerch，搜索用车申请列表
     *
     * @param {dataType} paramName  说明
     */
    onSearch: function(){
        $('#apply_table').bootstrapTable('refresh');
    },
    /**
     * 用车申请表单提交
     * @param {object} data 提交的数据
     * @param {function} callBakFun 请求成功回调函数
     */
    onApplySubmit: function(data,callBakFun){
        if(!!data.id){
            Urls.post(Urls.applyedit,data,function(result){
                if(result.responseCode=="1"&&result.responseMsg=="success"){
                    toastr.success("编辑成功！");
                    if(!!callBakFun) callBakFun();
                }else{
                    toastr.error(result.responseMsg);
                }
            });
        }else{
            Urls.post(Urls.applyadd,data,function(result){
                if(result.responseCode=="1"&&result.responseMsg=="success"){
                    toastr.success("提交成功！");
                    if(!!callBakFun) callBakFun();
                }else{
                    toastr.error(result.responseMsg);
                }
            });
        }
    },
    /**
     * 用车申请列表数据导出
     * @param {object} data 提交的数据
     */
    onExport:function(data){
        Urls.open(Urls.applyExport,data);
    },
    /**
     * 用车申请撤销
     * @param {object} data 提交的数据
     * @param {function} callBakFun 请求成功回调函数
     */
    onRepeal:function(data,callBakFun){
        Urls.post(Urls.applyRepeal,data,function(result){
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                toastr.success("撤销成功！");
                if(!!callBakFun) callBakFun();
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    onEditApply:function(data){
        CommonStore.trigger('switchtab', 'Apply');
        ApplyStore.trigger('editApply',data);
    },
    onCopyAddApply:function(data){
        CommonStore.trigger('switchtab', 'Apply');
        ApplyStore.trigger('copyApply',data);
    }
});

export default ApplyStore