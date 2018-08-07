/**
 * @file 非规定时段用车统计列表 Reflux View
 * @author Banji 2017.09.05
 */
import React, { Component } from 'react'
import { render } from 'react-dom'


import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';

import FoulTimeStore from '../stores/foulTimeStore';

var FoulTimeList = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        let that = this;
        that.showTableByOrg();
        that.unsubscribe = FoulTimeStore.listen(that.listenEvent);
    },
    componentWillUnmount: function () {
        this.unsubscribe(); //解除监听
    },
    listenEvent: function(type,result){
        switch (type){
            case 'showTableByOrg':
                this.showTableByOrg(result);
                break;
            case 'showTableByCar':
                this.showTableByCar(result);
                break;
        }
    },
    showTableByOrg:function(value){
        let that = this;
        $("#foul_time_table").unbind("load-success.bs.table");
        $("#foul_time_table").bootstrapTable("destroy");
        var org_columns = that.getOrgColumns();
        BootstrapTable.initTable("foul_time_table",5,[5],Urls.foulTimePage,org_columns,FoulTimeStore.data.org_queryParams,Urls.post);
        $("#foul_time_table").on("load-success.bs.table",function(e,data){
            FoulTimeStore.trigger("showFoulTimeChart",data.rows);
        });
    },
    showTableByCar:function(value){
        $("#foul_time_table").unbind("load-success.bs.table");
        $("#foul_time_table").bootstrapTable("destroy");
        BootstrapTable.initTable("foul_time_table",5,[5],Urls.foulTimePage,FoulTimeStore.data.car_columns,FoulTimeStore.data.car_queryParams,Urls.post);
    },
    getOrgColumns:function() {
        var org_columns = [{
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
        var listWeek = FoulTimeStore.data.listWeek || [];
        listWeek.forEach(function(item,index){
            var column = {
                field:'',
                title:'',
                align:'center',
                valign:'middle'
            };
            column.field = item;
            column.title = item;
            org_columns.push(column);
        })
        return org_columns;
    },
    render: function () {
        return (
            <table id="foul_time_table"  className="table-striped"></table>
        )
    }
});

export default FoulTimeList;