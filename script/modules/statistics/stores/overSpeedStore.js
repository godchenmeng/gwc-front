/**
 * @file 超速统计 Reflux Store
 * @author Banji 2017.08.30
 */

import OverSpeedAction from '../actions/overSpeedAction';
import Urls from '../../../common/urls';
import CommonFun from '../../../common/commonfun';
import BootstrapTree from '../../../common/bootstrapTree';

var OverSpeedStore = Reflux.createStore({
    listenables: [OverSpeedAction],
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
            field:'start_time',
            title:'超速开始时间',
            align:'center',
            valign:'middle'
        },{
            field:'end_time',
            title:'超速结束时间',
            align:'center',
            valign:'middle'
        },{
            field:'duration',
            title:'持续时长（秒）',
            align:'center',
            valign:'middle'
        },{
            field:'max_speed',
            title:'最高速度',
            align:'center',
            valign:'middle'
        },{
            field:'start_site',
            title:'超速开始地点',
            align:'center',
            valign:'middle'
        },{
            field:'end_site',
            title:'超速结束地点',
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
     * 响应Action seerch，超速统计搜索功能
     * @param {dataType} paramName  说明
     */
    onSearch: function(){
        $('#over_speed_table').bootstrapTable('refresh');
    },
    /**
     * 超速统计数据导出
     * @param {object} data 提交的数据
     */
    onExport: function(data){
        Urls.open(Urls.overSpeedExport,data);
    },
});

export default OverSpeedStore