/**
 * @file 设备GPS数据查询导出 Reflux Store
 * @author Banji 2018.01.04
 */

import DataQueryExportAction from '../actions/dataQueryExportAction';
import Urls from '../../../common/urls';
import BootstrapTree from '../../../common/bootstrapTree';

var DataQueryExportStore = Reflux.createStore({
    listenables: [DataQueryExportAction],
    data: {
        queryTableParams:function(params){
            var param = {
                device:$("#device_no").val(),
                table_name:$("select#table_name").val(),
                col:$('#col_names').val().join(","),
                start_time : $("input[name='start_date']").val(),
                end_time : $("input[name='end_date']").val(),
                limit : params.limit, // 页面大小
                pageIndex : this.pageNumber - 1,
            }
            return param;
        },
        queryDeviceNoDataParams:function(params){
            var org_ids = [];
            if(!!$('#org_tree').treeview(true).getChecked){
                org_ids  = BootstrapTree.getChecked("org_tree",true);
            }
            var param = {
                type:$('#time_type').val(),
                col:$('#column_names').val().join(","),
                org_str:org_ids.join(","),
                limit : params.limit, // 页面大小
                pageIndex : this.pageNumber - 1,
            }
            return param;
        }
    },
    /**
     * 响应Action tableSeerch，表格数据搜索功能
     * @param {dataType} paramName  说明
     */
    onTableSearch: function(){
        //$('#data_query_export_table').bootstrapTable('refresh');
        this.trigger("showTable");
    },
    /**
     * 响应Action seerchDeviceNoData，表格数据搜索功能
     * @param {dataType} paramName  说明
     */
    onSearchDeviceNoData: function(){
       //$('#data_query_export_table').bootstrapTable('refresh');
        this.trigger("showGpsTable");
    },
    /**
     * 无数据设备导出数据
     * @param {object} param 提交的数据
     */
    onDeviceNoDateExport: function(param){
        Urls.openForm(Urls.exportDeviceNoData,param);
    },
    getTableColumns:function(select_id) {
        var table_columns = [];
        $("#"+select_id).find("option:selected").each(function(){
            var column = {
                field:'',
                title:'',
                align:'center',
                valign:'middle'
            };
            var $option = $(this);
            if(select_id == "column_names"){
                column.field = $option.val().split(".")[1];
            }else{
                column.field = $option.val();
            }
            column.title = $option.text();
            table_columns.push(column);
        });
        return table_columns;
    },
    getGpsColumns:function() {
        var gps_columns = [];
        $("#column_names").find("option:selected").each(function(){
            var column = {
                text:'',
                value:''
            };
            var $option = $(this);
            column.value = $option.val();
            column.text = $option.text();
            gps_columns.push(column);
        });
        return JSON.stringify(gps_columns);
    },
});

export default DataQueryExportStore