/**
 * @file 无单违规用车统计列表 Reflux View
 * @author Banji 2017.09.05
 */
import React, { Component } from 'react'
import { render } from 'react-dom'


import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';

import FoulTaskStore from '../stores/foulTaskStore';

var FoulTaskList = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        let that = this;
        that.showTableByOrg();
        that.unsubscribe = FoulTaskStore.listen(that.listenEvent);
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
        $("#foul_task_table").unbind("load-success.bs.table");
        $("#foul_task_table").bootstrapTable("destroy");
        var org_columns = that.getOrgColumns();
        BootstrapTable.initTable("foul_task_table",5,[5],Urls.foulTaskPage,org_columns,FoulTaskStore.data.org_queryParams,Urls.post);
        $("#foul_task_table").on("load-success.bs.table",function(e,data){
            FoulTaskStore.trigger("showFoulTaskChart",data.rows);
        });
    },
    showTableByCar:function(value){
        $("#foul_task_table").unbind("load-success.bs.table");
        $("#foul_task_table").bootstrapTable("destroy");
        BootstrapTable.initTable("foul_task_table",5,[5],Urls.foulTaskPage,FoulTaskStore.data.car_columns,FoulTaskStore.data.car_queryParams,Urls.post);
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
        var listWeek = FoulTaskStore.data.listWeek || [];
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
            <table id="foul_task_table"  className="table-striped"></table>
        )
    }
});

export default FoulTaskList;