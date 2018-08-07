/**
 * @file 超速统计 Reflux View
 * @author Banji 2017.08.30
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import OverSpeedSearch from 'overSpeedSearch';
import OverSpeedList from 'overSpeedList';
import OverSpeedChart from 'overSpeedChart';

var OverSpeed = React.createClass({
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />统计管理 > 超速统计 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <OverSpeedSearch />
                <OverSpeedChart/>
                <OverSpeedList />
            </div>

        )
    }
});

export default OverSpeed;
