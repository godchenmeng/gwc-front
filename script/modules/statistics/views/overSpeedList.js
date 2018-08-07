/**
 * @file 超速统计列表 Reflux View
 * @author Banji 2017.08.30
 */
import React, { Component } from 'react'
import { render } from 'react-dom'


import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';

import OverSpeedStore from '../stores/overSpeedStore';

var OverSpeedList = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        let that = this;
        that.showTableByOrg();
        that.unsubscribe = OverSpeedStore.listen(that.listenEvent);
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
        $("#over_speed_table").unbind("load-success.bs.table");
        $("#over_speed_table").bootstrapTable("destroy");
        var org_columns = that.getOrgColumns();
        BootstrapTable.initTable("over_speed_table",5,[5],Urls.overSpeedPage,org_columns,OverSpeedStore.data.org_queryParams,Urls.post);
        $("#over_speed_table").on("load-success.bs.table",function(e,data){
            OverSpeedStore.trigger("showOverSpeedChart",data.rows);
        });
    },
    showTableByCar:function(value){
        $("#over_speed_table").unbind("load-success.bs.table");
        $("#over_speed_table").bootstrapTable("destroy");
        BootstrapTable.initTable("over_speed_table",5,[5],Urls.overSpeedPage,OverSpeedStore.data.car_columns,OverSpeedStore.data.car_queryParams,Urls.post);
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
        var listWeek = OverSpeedStore.data.listWeek || [];
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
            <table id="over_speed_table"  className="table-striped"></table>
        )
    }
});

export default OverSpeedList;