/**
 * @file 上线率 Reflux View
 * @author Banji 2017.08.24
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import OnlineSearch from 'onlineSearch';
import OnlineList from 'onlineList';
import OnlineChart from 'onlineChart';

var Online = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />统计管理 > 上线率 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <OnlineSearch />
                <OnlineChart/>
                <OnlineList />
            </div>

        )
    }
});

export default Online;
