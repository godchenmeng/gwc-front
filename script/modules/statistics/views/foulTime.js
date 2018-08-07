/**
 * @file 非规定时段用车统计 Reflux View
 * @author Banji 2017.09.05
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import FoulTimeSearch from 'foulTimeSearch'
import FoulTimeList from 'foulTimeList'
import FoulTimeChart from 'foulTimeChart'

var FoulTime = React.createClass({
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />统计管理 > 非规定时段用车统计 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <FoulTimeSearch />
                <FoulTimeChart/>
                <FoulTimeList />
            </div>

        )
    }
});

export default FoulTime;
