/**
 * @file 违规停运统计 Reflux View
 * @author Banji 2017.09.05
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import FoulParkSearch from 'foulParkSearch'
import FoulParkList from 'foulParkList'
import FoulParkChart from 'foulParkChart'

var FoulPark = React.createClass({
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />统计管理 > 违规停运统计 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <FoulParkSearch />
                <FoulParkChart/>
                <FoulParkList />
            </div>

        )
    }
});

export default FoulPark;
