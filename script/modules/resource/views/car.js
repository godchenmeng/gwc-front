/**
 * @file 车辆管理 Reflux View
 * @author XuHong 2017.08.30
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import CarSearch from 'carSearch';
import CarList from 'carList';
import CarModal from 'carModal';

import CommonStore from '../../common/stores/commonStore';

import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';
import BootstrapTree from '../../../common/bootstrapTree';

import CarStore from '../stores/carStore';

var Car = React.createClass({
    getInitialState: function() {
        return {}
    },
    componentDidMount: function() {
        this.initOrgTree();
        BootstrapTable.initTable("car_table",10,[10,20],Urls.carPage,CarStore.data.columns,CarStore.data.queryParams,Urls.post,CarStore.onCarTableLoadSuccess,CommonStore.verifyPermission('get/car/delete'),CommonStore.verifyPermission('car/check'));
    },
    initOrgTree: function() {
        $("#car_org_tree").css({
            top:$("#show_name").position().top + $("#show_name").outerHeight() + 1,
            left:$("#show_name").position().left
        });
        Urls.get(Urls.loadorgtree,{},function(data) {
            BootstrapTree.initTree('car_org_tree',data,'show_name','hide_org');
        });
    },
    handleCarAdd: function() {
        $("#car_oper_modal").modal("toggle");
        CarStore.trigger('carAddEvent',null);
    },
    render: function() {
        var tabID = this.state.tabID;
        var selTabID = this.state.selTabID;
        return ( <div className="right_col visible">
            <div className="page-title">
                <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />资源管理 > 车辆管理</div>
                <div className="title_right" style={{textAlign:'right'}}>
                    <button type="submit" className={CommonStore.verifyPermission('get/car/add')?"btnOne btn-bule":"hide"} data-toggle="modal" onClick={this.handleCarAdd}><i className="icon-bg add-icon"/>新增车辆</button>
                </div>
            </div>
            <br /><br />
            <CarSearch/>
            <CarList/>
            <CarModal/>
        </div>
        )
    }
});

export default Car;