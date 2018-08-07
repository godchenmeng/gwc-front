/**
 * @file 派遣-列表 Reflux View
 * @author Banji 2017.08.21
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';

import DispatchDataStore from '../stores/dispatchDataStore';

var DispatchDataList = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        BootstrapTable.initTable("dispatch_data_table",20,[10,20,30,40],Urls.dispatchDataPage,DispatchDataStore.data.columns,DispatchDataStore.data.queryParams,Urls.post);
        $("#dispatch_data_table").on('click-row.bs.table', function (e, row, ele,field) {
            DispatchDataStore.trigger("dispatchDataEvent",row);
            $("#dispatch_data_modal").modal('toggle');
        })

    },
    render: function () {
        return (
            <table id="dispatch_data_table"  className="table-striped"></table>
        )
    }
});

export default DispatchDataList;