/**
 * @file 调度 Reflux View
 * @author Banji 2017.07.25
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import DispatchSearch from 'dispatchSearch';
import DispatchList from 'dispatchList';
import DispatchModal from 'dispatchModal';

var Dispatch = React.createClass({
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />调度管理 > 调度 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <DispatchSearch />
                <DispatchList />
                <DispatchModal/>
            </div>

        )
    }
});

export default Dispatch;
