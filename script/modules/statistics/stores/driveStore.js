/**
 * @file 驾驶统计 Reflux Store
 * @author Banji 2017.09.05
 */

import DriveAction from '../actions/driveAction';
import Urls from '../../../common/urls';
import CommonFun from '../../../common/commonfun';
import BootstrapTree from '../../../common/bootstrapTree';

var DriveStore = Reflux.createStore({
    listenables: [DriveAction],
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
            field:'org_name',
            title:'部门',
            align:'center',
            valign:'middle'
        },{
            field:'car_no',
            title:'车牌号',
            align:'center',
            valign:'middle'
        },{
            field:'mileage',
            title:'里程（千米）',
            align:'center',
            valign:'middle'
        },{
            field:'drive_duration',
            title:'驾驶时长',
            align:'center',
            valign:'middle'
        },{
            field:'fuel',
            title:'油耗（升）',
            align:'center',
            valign:'middle'
        },{
            field:'break_drive',
            title:'三急',
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
     * 响应Action seerch，驾驶统计搜索功能
     * @param {dataType} paramName  说明
     */
    onSearch: function(){
        $('#drive_table').bootstrapTable('refresh');
    },
    /**
     * 驾驶统计数据导出
     * @param {object} data 提交的数据
     */
    onExport: function(data){
        Urls.open(Urls.driveExport,data);
    },
});

export default DriveStore