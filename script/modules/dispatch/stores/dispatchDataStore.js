/**
 * @file 调度数据 Reflux Store
 * @author Banji 2017.08.23
 */

import DispatchDataAction from '../actions/dispatchDataAction'
import Urls from '../../../common/urls'

var DispatchDataStore = Reflux.createStore({
    listenables: [DispatchDataAction],
    data: {
        columns:[{
            field: '',
            checkbox: true,
            align: 'center',
            valign: 'middle',
            checked: false
        },{
            field:'use_name',
            title:'用车人',
            align:'center',
            valign:'middle'
        },{
            field:'use_number',
            title:'用车人数',
            align:'center',
            valign:'middle',
            formatter : function (value,row,index){
                return !!value?value:"0";
            }
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
            field:'reason',
            title:'用车事由',
            align:'center',
            valign:'middle'
        },{
            field:'plan_car_num',
            title:'用车数',
            align:'center',
            valign:'middle',
            formatter : function (value,row,index){
                return !!value?value:"0";
            }
        }],
        queryParams:function(params){
            var org_id = $("input[name='org_id']").val();
            var param = {
                use_org:org_id,
                use_name : $("input[name='use_name']").val(),
                start_time : $("input[name='start_date']").val(),
                end_time : $("input[name='end_date']").val(),
                limit : params.limit, // 页面大小
                pageIndex : this.pageNumber - 1,
            }
            DispatchDataStore.data.dispatchDataSearchParam = param;
            return param;
        },
        dispatchDataSearchParam:undefined,
    },
    /**
     * 响应Action seerch，搜索调度数据列表
     * @param {dataType} paramName  说明
     */
    onSearch: function(){
        $('#dispatch_data_table').bootstrapTable('refresh');
    },
    /**
     * 调度数据列表数据导出
     * @param {object} data 提交的数据
     */
    onExport: function(data){
        Urls.open(Urls.dispatchDataExport,data);
    },
    onTaskList:function(data,callBackFun){
        Urls.get(Urls.dispatchDataTaskList,data,function(result){
            if(result.length > 0){
                $('#control_task_table').bootstrapTable('load', result);
            }else{
                $('#control_task_table').bootstrapTable('removeAll', result);
            }
        })
    },
});

export default DispatchDataStore