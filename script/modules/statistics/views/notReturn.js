/**
 * @file 未入库统计 Reflux View
 * @author Banji 2017.09.05
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import NotReturnSearch from 'notReturnSearch'
import NotReturnList from 'notReturnList'
import NotReturnChart from 'notReturnChart'

var NotReturn = React.createClass({
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />统计管理 > 未入库统计 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <NotReturnSearch />
                <NotReturnChart/>
                <NotReturnList />
            </div>

        )
    }
});

export default NotReturn;
