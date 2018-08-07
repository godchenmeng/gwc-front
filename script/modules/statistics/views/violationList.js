/**
 * @file 违章统计列表 Reflux View
 * @author Banji 2017.09.07
 */
import React, { Component } from 'react'
import { render } from 'react-dom'


import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';

import ViolationStore from '../stores/violationStore';

var ViolationList = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        let that = this;
        that.showTableByOrg();
        that.unsubscribe = ViolationStore.listen(that.listenEvent);
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
        $("#violation_table").unbind("load-success.bs.table");
        $("#violation_table").bootstrapTable("destroy");
        var org_columns = that.getOrgColumns();
        BootstrapTable.initTable("violation_table",5,[5],Urls.violationPage,org_columns,ViolationStore.data.org_queryParams,Urls.post);
        $("#violation_table").on("load-success.bs.table",function(e,data){
            ViolationStore.trigger("showViolationChart",data.rows);
        });
    },
    showTableByCar:function(value){
        $("#violation_table").unbind("load-success.bs.table");
        $("#violation_table").bootstrapTable("destroy");
        BootstrapTable.initTable("violation_table",5,[5],Urls.violationPage,ViolationStore.data.car_columns,ViolationStore.data.car_queryParams,Urls.post);
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
        var listWeek = ViolationStore.data.listWeek || [];
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
            <table id="violation_table"  className="table-striped"></table>
        )
    }
});

export default ViolationList;