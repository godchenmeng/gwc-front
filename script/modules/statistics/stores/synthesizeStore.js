/**
 * @file 综合统计 Reflux Store
 * @author Banji 2017.09.08
 */

import SynthesizeAction from '../actions/synthesizeAction'
import Urls from '../../../common/urls'
import CommonFun from '../../../common/commonfun'
import BootstrapTree from '../../../common/bootstrapTree'

var SynthesizeStore = Reflux.createStore({
    listenables: [SynthesizeAction],
    data: {
        time_columns:[{
            field:'date_time',
            title:'时间',
            align:'center',
            valign:'middle'
        },{
            field:'online_rate',
            title:'上线率',
            align:'center',
            valign:'middle'
        },{
            field:'overspeed',
            title:'超速',
            align:'center',
            valign:'middle'
        },{
            field:'not_return',
            title:'未入库',
            align:'center',
            valign:'middle'
        },{
            field:'foul_park',
            title:'违停',
            align:'center',
            valign:'middle'
        },{
            field:'foul_task',
            title:'无单违规',
            align:'center',
            valign:'middle'
        },{
            field:'foul_time',
            title:'非规定时段',
            align:'center',
            valign:'middle'
        },{
            field:'break_rule',
            title:'违章',
            align:'center',
            valign:'middle'
        },{
            field:'mileage',
            title:'里程（千米）',
            align:'center',
            valign:'middle'
        },{
            field:'fuel',
            title:'油耗（升）',
            align:'center',
            valign:'middle'
        },{
            field:'duration',
            title:'时长',
            align:'center',
            valign:'middle'
        }],
        time_queryParams:function(params){
            var car_ids = $('.selectpicker').val();
            var show_type = $(".search-box a.active[data-type]").data("type");
            var param = {
                show_type:show_type,
                car_ids:car_ids,
                start_time : $("input[name='start_date']").val(),
                end_time : $("input[name='end_date']").val(),
                limit : params.limit, // 页面大小
                pageIndex : this.pageNumber - 1,
            }
            return param;
        },
        org_columns:[{
            field:'org_name',
            title:'部门',
            align:'center',
            valign:'middle'
        },{
            field:'online_rate',
            title:'上线率',
            align:'center',
            valign:'middle'
        },{
            field:'overspeed',
            title:'超速',
            align:'center',
            valign:'middle'
        },{
            field:'not_return',
            title:'未入库',
            align:'center',
            valign:'middle'
        },{
            field:'foul_park',
            title:'违停',
            align:'center',
            valign:'middle'
        },{
            field:'foul_task',
            title:'无单违规',
            align:'center',
            valign:'middle'
        },{
            field:'foul_time',
            title:'非规定时段',
            align:'center',
            valign:'middle'
        },{
            field:'break_rule',
            title:'违章',
            align:'center',
            valign:'middle'
        },{
            field:'mileage',
            title:'里程（千米）',
            align:'center',
            valign:'middle'
        },{
            field:'fuel',
            title:'油耗（升）',
            align:'center',
            valign:'middle'
        },{
            field:'duration',
            title:'时长',
            align:'center',
            valign:'middle'
        }],
        org_queryParams:function(params){
            var org_ids = [];
            if(!!$('#org_tree').treeview(true).getChecked){
                org_ids  = BootstrapTree.getChecked("org_tree",true);
            }
            var show_type = $(".search-box a.active[data-type]").data("type");
            var param = {
                show_type:show_type,
                org_ids:org_ids,
                start_time : $("input[name='start_date']").val(),
                end_time : $("input[name='end_date']").val(),
                limit : params.limit, // 页面大小
                pageIndex : this.pageNumber - 1,
            }
            return param;
        },
        car_columns:[{
            field:'car_no',
            title:'车牌号',
            align:'center',
            valign:'middle'
        },{
            field:'online_rate',
            title:'上线率',
            align:'center',
            valign:'middle'
        },{
            field:'overspeed',
            title:'超速',
            align:'center',
            valign:'middle'
        },{
            field:'not_return',
            title:'未入库',
            align:'center',
            valign:'middle'
        },{
            field:'foul_park',
            title:'违停',
            align:'center',
            valign:'middle'
        },{
            field:'foul_task',
            title:'无单违规',
            align:'center',
            valign:'middle'
        },{
            field:'foul_time',
            title:'非规定时段',
            align:'center',
            valign:'middle'
        },{
            field:'break_rule',
            title:'违章',
            align:'center',
            valign:'middle'
        },{
            field:'mileage',
            title:'里程（千米）',
            align:'center',
            valign:'middle'
        },{
            field:'fuel',
            title:'油耗（升）',
            align:'center',
            valign:'middle'
        },{
            field:'duration',
            title:'时长',
            align:'center',
            valign:'middle'
        }],
        car_queryParams:function(params){
            var car_ids = $('.selectpicker').val();
            var show_type = $(".search-box a.active[data-type]").data("type");
            var param = {
                show_type:show_type,
                car_ids:car_ids,
                start_time : $("input[name='start_date']").val(),
                end_time : $("input[name='end_date']").val(),
                limit : params.limit, // 页面大小
                pageIndex : this.pageNumber - 1,
            }
            return param;
        },
        listDate: CommonFun.getDateArray("listDate",new Date(CommonFun.getDateArray("listWeek")[6]),new Date(CommonFun.getDateArray("listWeek")[0])),
        listWeek: CommonFun.getDateArray("listWeek"),
        listMonth: CommonFun.getDateArray("listMonth"),
        isChangeDate:false,//是否改变查询时间
    },
    /**
     * 响应Action seerch，综合统计搜索功能
     * @param {dataType} paramName  说明
     */
    onSearch: function(){
        $('#synthesize_table').bootstrapTable('refresh');
    },
    /**
     * 综合统计数据导出
     * @param {object} data 提交的数据
     */
    onExport: function(data){
        Urls.open(Urls.synthesizeExport,data);
    },
    getQueryParams: function(){
        var show_type = $('.search-box a.active[data-type]').data("type");
        var params;
        if(show_type == "time"){
            var car_ids = $('.selectpicker').val();
            params = {
                show_type:show_type,
                car_ids:car_ids,
                start_time : $("input[name='start_date']").val(),
                end_time : $("input[name='end_date']").val()
            }
        }else if(show_type == "org"){
            var org_ids = BootstrapTree.getChecked("org_tree",true);
            params = {
                show_type:show_type,
                org_ids:org_ids,
                start_time : $("input[name='start_date']").val(),
                end_time : $("input[name='end_date']").val()
            }
        }else if(show_type == "car"){
            var car_ids = $('.selectpicker').val();
            params = {
                show_type:show_type,
                car_ids:car_ids,
                start_time : $("input[name='start_date']").val(),
                end_time : $("input[name='end_date']").val()
            }
        }
        return params;
    }
});

export default SynthesizeStore