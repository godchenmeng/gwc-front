/**
 * @file 设备管理 Reflux View
 * @author XuHong 2017.09.06
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';
import BootstrapTree from '../../../common/bootstrapTree';

import CommonStore from '../../common/stores/commonStore';

import DeviceStore from "../stores/deviceStore";
import DeviceSearch from 'deviceSearch';
import DeviceOperModal from 'deviceModal';

var Device = React.createClass({
    getInitialState: function() {
        return {}
    },
    componentDidMount: function() {
        this.initOrgTree();
        var buttons = [];
        if(CommonStore.verifyPermission('all/delete')) buttons.push('<button type="button" class="btnOne btn-white" id="multi_del_car"><i class="icon-bg batch-icon"></i>注销设备(删车)</button>');
        if(CommonStore.verifyPermission('device/delete')) buttons.push('<button type="button" class="btnOne btn-white" id="multi_del_no"><i class="icon-bg batch-icon"></i>注销设备(不删车)</button>');
        BootstrapTable.initTable("device_table",10,[10,20],Urls.loadDeviceList,DeviceStore.data.columns,DeviceStore.data.queryParams,Urls.post,DeviceStore.onDeviceTableSuccess,false,false,buttons);
    },
    initOrgTree: function() {
        Urls.get(Urls.loadorgtree,{},function(data) {
            BootstrapTree.initTree('device_org_tree',data,'show_name','hide_org');
        });
    },
    handleDeviceAdd: function() {
        DeviceStore.trigger('deviceAddEvent',null);
        $("#device_oper_modal").modal("show");
    },
    render: function() {
        var tabID = this.state.tabID;
        var selTabID = this.state.selTabID;
        return ( <div className="right_col visible">
            <div className="page-title">
                <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />资源管理 > 设备管理</div>
                <div className="title_right" style={{textAlign:'right'}}>
                    <button type="submit" className={CommonStore.verifyPermission('device/add')?"btnOne btn-bule":"hide"} data-toggle="modal" onClick={this.handleDeviceAdd}><i className="icon-bg add-icon"/>注册设备</button>
                </div>
            </div>
            <br /><br />
            <DeviceSearch/>
            <table id="device_table" cellSpacing="0" className="table-striped mart12" cellPadding="0" width="100%"></table>
            <DeviceOperModal/>
        </div>
        )
    }
});

export default Device;