/**
 * @file 上线率列表 Reflux View
 * @author Banji 2017.08.24
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import OnlineStore from '../stores/onlineStore'

import BootstrapTable from '../../../common/bootstrapTable'
import Urls from '../../../common/urls'

var OnlineList = React.createClass({
    componentDidMount: function () {
        let that = this;
        that.showTable();
        that.unsubscribe = OnlineStore.listen(that.listenEvent);
    },
    componentWillUnmount: function () {
        this.unsubscribe(); //解除监听
    },
    listenEvent: function(type,result){
        switch (type){
            case 'showTable':
                this.showTable(result);
                break;
        }
    },
    showTable:function(value){
        let that = this;
        $("#online_rate_table").unbind("load-success.bs.table");
        $("#online_rate_table").bootstrapTable("destroy");
        var columns = that.getColumns();
        BootstrapTable.initTable("online_rate_table",5,[5],Urls.onlinePage,columns,OnlineStore.data.queryParams,Urls.post);
        $("#online_rate_table").on("load-success.bs.table",function(e,data){
            OnlineStore.trigger("showOnlineChart",data.rows);
        });
    },
    getColumns:function() {
        var columns = [{
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
        }];
        var listWeek = OnlineStore.data.listWeek || [];
        listWeek.forEach(function(item,index){
            var column = {
                field:'',
                title:'',
                align:'center',
                valign:'middle',
                formatter:function(value,row,index){
                    return value + "%";
                }
            };
            column.field = item;
            column.title = item;
            columns.push(column);
        });
        columns.push({
            field:'average_value',
            title:'平均上线率',
            align:'center',
            valign:'middle',
            formatter:function(value,row,index){
                return value + "%";
            }
        });
        return columns;
    },
    render: function () {
        return (
            <table id="online_rate_table"  className="table-striped"></table>
        )
    }
});

export default OnlineList;