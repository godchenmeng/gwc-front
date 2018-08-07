/**
 * @file 驾驶统计 Reflux View
 * @author Banji 2017.09.07
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import DriveSearch from 'driveSearch'
import DriveList from 'driveList'
import DriveChart from 'driveChart'

var Drive = React.createClass({
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />统计管理 > 驾驶统计 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <DriveSearch />
                <DriveChart/>
                <DriveList />
            </div>

        )
    }
});

export default Drive;
