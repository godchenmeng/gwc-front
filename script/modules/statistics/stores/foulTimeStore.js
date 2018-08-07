/**
 * @file 非规定时段用车统计 Reflux Store
 * @author Banji 2017.09.05
 */

import FoulTimeAction from '../actions/foulTimeAction';
import Urls from '../../../common/urls';
import CommonFun from '../../../common/commonfun';
import BootstrapTree from '../../../common/bootstrapTree';

var FoulTimeStore = Reflux.createStore({
    listenables: [FoulTimeAction],
    data: {
        org_columns:[],
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
            field:'id',
            title:'部门id',
            align:'center',
            valign:'middle',
            visible:false
        },{
            field:'orgName',
            title:'部门',
            align:'center',
            valign:'middle'
        },{
            field:'car_no',
            title:'车牌号',
            align:'center',
            valign:'middle'
        },{
            field:'trigger_time',
            title:'触发时间',
            align:'center',
            valign:'middle'
        },{
            field:'duration',
            title:'持续时长',
            align:'center',
            valign:'middle'
        },{
            field:'trigger_site',
            title:'触发地点',
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
        listWeek: CommonFun.getDateArray("listWeek"),
        listMonth: CommonFun.getDateArray("listMonth"),
        isChangeDate:false,//是否改变查询时间
    },
    /**
     * 响应Action seerch，非规定时段用车统计搜索功能
     * @param {dataType} paramName  说明
     */
    onSearch: function(){
        $('#foul_time_table').bootstrapTable('refresh');
    },
    /**
     * 非规定时段用车统计数据导出
     * @param {object} data 提交的数据
     */
    onExport: function(data){
        Urls.open(Urls.foulTimeExport,data);
    },
});

export default FoulTimeStore