/**
 * @file bootstrapTable公共方法
 * @author Banji 2017.07.31
 * @see http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
 */

var bootstrapTable = {
    /**
     *
     * @param {string} tableId 被渲染的表格对象ID
     * @param {int} pageSize 表格单页条数
     * @param {Array} pageList 表格页面条数列表
     * @param {string} url 服务器数据的加载地址
     * @param {Array} columns 表格列参数
     * @param {Function} queryParams 请求服务器数据时，自定义查询的参数
     * @param {Function} ajaxMethod ajax请求方法
     * @param {Function} loadSuccessMethod 加载Table成功回调方法
     * @param {boolean} isShowMultiDel 是否显示批量删除按钮
     * @param {boolean} isShowMultiSub 是否显示批量提交按钮
     * @param {Array} buttons 页码栏增加的键钮组，例：['<button></button>','<button></button>',....]
     */
    initTable:function(tableId,pageSize,pageList,url,columns,queryParams,ajaxMethod,loadSuccessMethod,isShowMultiDel,isShowMultiSub,buttons){
        $("#"+tableId).bootstrapTable({
            url:url,
            dataType:"json",
            cache:false,
            pagination:true,
            sidePagination:"server",
            striped:true,
            queryParams:queryParams,
            pageNumber:1,
            pageSize:pageSize,
            pageList:pageList,
            uniqueId:"id",
            columns:columns,
            search:false,
            ajaxMethod : ajaxMethod,
            isShowMultiDeleteButton : isShowMultiDel,
            isShowMultiSubmitButton : isShowMultiSub,
            buttonArray : buttons,
            responseHandler:function responseHandler(res) {
                if (res) {
                    return {
                        "rows" : res.rows,
                        "total" : res.totalCount
                    };
                } else {
                    return {
                        "rows" : [],
                        "total" : 0
                    };
                }
            },
            onLoadSuccess:loadSuccessMethod,
        })
    },
    initTableByData:function(tableId,pageSize,pageList,columns,data,loadSuccessMethod,isShowMultiDel,isShowMultiSub){
        $("#"+tableId).bootstrapTable({
            dataType:"json",
            cache:false,
            pagination:true,
            sidePagination:"client",
            pageNumber:1,
            pageSize:pageSize,
            pageList:pageList,
            uniqueId:"id",
            columns:columns,
            search:false,
            data : data,
            isShowMultiDeleteButton : isShowMultiDel,
            isShowMultiSubmitButton : isShowMultiSub,
            responseHandler:function responseHandler(res) {
                if (res) {
                    return {
                        "rows" : res.rows,
                        "total" : res.totalCount
                    };
                } else {
                    return {
                        "rows" : [],
                        "total" : 0
                    };
                }
            },
            onLoadSuccess:loadSuccessMethod,
        })
    },
    render:function (tableId) {
        $("#"+tableId).bootstrapTable('refresh',{pageNumber:1});
    },
    load:function (tableId,data) {
        $("#"+tableId).bootstrapTable('load',data);
    },
    /*
    *  获取选择的行数据
    *  @param String tableId  表格id
    *  @param Boolean isOnlyId  是否只获取表格行数据的id字段只
    *  @return 选择的行数据数组或行数据id数组
    * */
    getSelected:function(tableId,isOnlyId){
        if(!isOnlyId) return $("#" + tableId).bootstrapTable('getSelections');
        var ids = [];
        var datas = $("#" + tableId).bootstrapTable('getSelections');
        if(datas.length > 0){
            $.each(datas,function(index,data){
                ids.push(data.id);
            });
        }
        return ids;
    },
    onClickRow:function (tableId,doClickRowMethod) {
        $("#" + tableId).on('click-cell.bs.table', doClickRowMethod);
    }
};
export default bootstrapTable;