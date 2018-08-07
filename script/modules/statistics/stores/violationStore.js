/**
 * @file 违章统计 Reflux Store
 * @author Banji 2017.09.07
 */

import ViolationAction from '../actions/violationAction';
import Urls from '../../../common/urls';
import CommonFun from '../../../common/commonfun';
import BootstrapTree from '../../../common/bootstrapTree';

var ViolationStore = Reflux.createStore({
    listenables: [ViolationAction],
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
            field:'violation_time',
            title:'违章时间',
            align:'center',
            valign:'middle'
        },{
            field:'violation_site',
            title:'违章地点',
            align:'center',
            valign:'middle'
        },{
            field:'violation_type',
            title:'违章类型',
            align:'center',
            valign:'middle'
        },{
            field:'driver_name',
            title:'驾驶员姓名',
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
     * 响应Action seerch，违章统计搜索功能
     * @param {dataType} paramName  说明
     */
    onSearch: function(){
        $('#violation_table').bootstrapTable('refresh');
    },
    /**
     * 违章统计数据导出
     * @param {object} data 提交的数据
     */
    onExport: function(data){
        Urls.open(Urls.violationExport,data);
    },
});

export default ViolationStore