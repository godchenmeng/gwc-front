/**
 * @file 驾驶员管理 Reflux View
 * @author XuHong 2017.09.09
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';

import CommonStore from '../../common/stores/commonStore';

import DriverStore from "../stores/driverStore";
import DriverSearch from 'driverSearch';
import DriverModal from 'driverModal';

var Driver = React.createClass({
    getInitialState: function() {
        return {}
    },
    componentDidMount: function() {
        BootstrapTable.initTable("driver_table",10,[10,20],Urls.loadDriverList,DriverStore.data.columns,DriverStore.data.queryParams,Urls.post,DriverStore.onDriverTableSuccess,CommonStore.verifyPermission('driver/delete'));
    },
    handleDriverAdd: function() {
        DriverStore.trigger('driverAddEvent',null);
        $("#driver_oper_modal").modal("show");
    },
    render: function() {
        var tabID = this.state.tabID;
        var selTabID = this.state.selTabID;
        return ( <div className="right_col visible">
            <div className="page-title">
                <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />资源管理 > 驾驶员管理</div>
                <div className="title_right" style={{textAlign:'right'}}>
                    <button type="submit" className={CommonStore.verifyPermission('driver/add')?"btnOne btn-bule":"hide"} data-toggle="modal" onClick={this.handleDriverAdd}><i className="icon-bg add-icon"/>新增驾驶员</button>
                </div>
            </div>
            <br /><br />
            <DriverSearch/>
            <table id="driver_table" cellSpacing="0" className="table-striped mart12" cellPadding="0" width="100%"></table>
            <DriverModal/>
        </div>
        )
    }
});

export default Driver;