/**
 * @file 驾驶统计列表 Reflux View
 * @author Banji 2017.09.05
 */
import React, { Component } from 'react'
import { render } from 'react-dom'


import Urls from '../../../common/urls'
import BootstrapTable from '../../../common/bootstrapTable'

import DriveStore from '../stores/driveStore'

var DriveList = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        let that = this;
        that.showTableByOrg();
        that.unsubscribe = DriveStore.listen(that.listenEvent);
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
        $("#drive_table").unbind("load-success.bs.table");
        $("#drive_table").bootstrapTable("destroy");
        var org_columns = that.getOrgColumns();
        BootstrapTable.initTable("drive_table",5,[5],Urls.drivePage,org_columns,DriveStore.data.org_queryParams,Urls.post);
        $("#drive_table").on("load-success.bs.table",function(e,data){
            DriveStore.trigger("showDriveMileageChart",data.rows);
        });
    },
    showTableByCar:function(value){
        $("#drive_table").unbind("load-success.bs.table");
        $("#drive_table").bootstrapTable("destroy");
        BootstrapTable.initTable("drive_table",5,[5],Urls.drivePage,DriveStore.data.car_columns,DriveStore.data.car_queryParams,Urls.post);
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
        var listWeek = DriveStore.data.listWeek || [];
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
            <table id="drive_table"  className="table-striped"></table>
        )
    }
});

export default DriveList;