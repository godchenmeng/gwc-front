/**
 * @file 无单违规用车统计 Reflux View
 * @author Banji 2017.09.05
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import FoulTaskSearch from 'foulTaskSearch'
import FoulTaskList from 'foulTaskList'
import FoulTaskChart from 'foulTaskChart'

var FoulTask = React.createClass({
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />统计管理 > 无单违规用车统计 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <FoulTaskSearch />
                <FoulTaskChart/>
                <FoulTaskList />
            </div>

        )
    }
});

export default FoulTask;
