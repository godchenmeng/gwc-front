/**
 * @file 越界统计 Reflux View
 * @author Banji 2017.09.05
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import OutsideSearch from 'outsideSearch';
import OutsideList from 'outsideList';
import OutsideChart from 'outsideChart';

var Outside = React.createClass({
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />统计管理 > 越界统计 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <OutsideSearch />
                <OutsideChart/>
                <OutsideList />
            </div>

        )
    }
});

export default Outside;
