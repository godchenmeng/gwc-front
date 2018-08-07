/**
 * @file 实时监控-表 Reflux View
 * @author CM 2017.08.07
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

var TableComponent = React.createClass({
    render: function () {
        let tableName = this.props.tableName ? this.props.tableName : "monitor_table";
        return (
            <table id={tableName} className="table-striped mart12 clear" style={{width:"100%",borderCollapse:"collapse"}}></table>
        )
    }
});

export default TableComponent;