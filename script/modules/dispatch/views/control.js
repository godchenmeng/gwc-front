/**
 * @file 派遣 Reflux View
 * @author Banji 2017.08.21
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import ControlSearch from 'controlSearch';
import ControlList from 'controlList';
import ControlModal from 'controlModal';

var Control = React.createClass({
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />调度管理 > 派遣 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <ControlSearch />
                <ControlList />
                <ControlModal />
            </div>

        )
    }
});

export default Control;
