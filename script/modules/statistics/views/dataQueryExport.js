/**
 * @file 设备GPS数据查询导出 Reflux View
 * @author Banji 2018.01.04
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import DataQueryExportSearch from 'dataQueryExportSearch'
import DataQueryExportList from 'dataQueryExportList'

var DataQueryExport = React.createClass({
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />统计管理 > 设备GPS数据查询导出 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <DataQueryExportSearch />
                <DataQueryExportList />
            </div>

        )
    }
});

export default DataQueryExport;
