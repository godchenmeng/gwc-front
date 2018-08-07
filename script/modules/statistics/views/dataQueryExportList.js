/**
 * @file 设备GPS数据查询导出 Reflux View
 * @author Banji 2018.01.05
 */
import React, { Component } from 'react'
import { render } from 'react-dom'


import Urls from '../../../common/urls'
import BootstrapTable from '../../../common/bootstrapTable'

import DataQueryExportStore from '../stores/dataQueryExportStore'

var DataQueryExportList = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        let that = this;
        that.unsubscribe = DataQueryExportStore.listen(that.listenEvent);
    },
    componentWillUnmount: function () {
        this.unsubscribe(); //解除监听
    },
    listenEvent: function(type,result){
        switch (type){
            case 'showTable':
                this.showTable(result);
                break;
            case 'showGpsTable':
                this.showGpsTable(result);
                break;
        }
    },
    showTable:function(data){
        let that = this;
        $("#data_query_export_table").bootstrapTable("destroy");
        var columns = DataQueryExportStore.getTableColumns("col_names");
        BootstrapTable.initTable("data_query_export_table",5,[5],Urls.queryTableData,columns,DataQueryExportStore.data.queryTableParams,Urls.post);
    },
    showGpsTable:function(data){
        let that = this;
        $("#data_query_export_table").bootstrapTable("destroy");
        var columns = DataQueryExportStore.getTableColumns("column_names");
        BootstrapTable.initTable("data_query_export_table",5,[5],Urls.queryDeviceNoData,columns,DataQueryExportStore.data.queryDeviceNoDataParams,Urls.post);
    },
    render: function () {
        return (
            <table id="data_query_export_table"  className="table-striped"></table>
        )
    }
});

export default DataQueryExportList;