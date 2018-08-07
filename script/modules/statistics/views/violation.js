/**
 * @file 违章统计 Reflux View
 * @author Banji 2017.09.07
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import ViolationSearch from 'violationSearch'
import ViolationList from 'violationList'
import ViolationChart from 'violationChart'

var Violation = React.createClass({
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />统计管理 > 违章统计 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <ViolationSearch />
                <ViolationChart/>
                <ViolationList />
            </div>

        )
    }
});

export default Violation;
