/**
 * @file 调度数据 Reflux View
 * @author Banji 2017.08.23
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import DispatchDataSearch from 'dispatchDataSearch';
import DispatchDataList from 'dispatchDataList';
import DispatchDataModal from 'dispatchDataModal';

var DispatchData = React.createClass({

    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />调度管理 > 调度数据 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <DispatchDataSearch />
                <DispatchDataList />
                <DispatchDataModal />
            </div>

        )
    }
});

export default DispatchData;
