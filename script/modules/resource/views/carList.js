/**
 * @file 车辆管理-列表 Reflux View
 * @author XuHong 2017.08.30
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

var CarList = React.createClass({
    getInitialState: function() {
        return {}
    },
    render: function () {
        return (<table id="car_table" cellSpacing="0" className="table-striped mart12" cellPadding="0" width="100%"></table>)
    }
});

export default CarList;