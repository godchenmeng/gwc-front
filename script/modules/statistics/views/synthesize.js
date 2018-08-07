/**
 * @file 综合统计 Reflux View
 * @author Banji 2017.09.08
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import SynthesizeSearch from 'synthesizeSearch'
import SynthesizeList from 'synthesizeList'
import SynthesizeChart from 'synthesizeChart'

var Synthesize = React.createClass({
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />统计管理 > 综合统计 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <SynthesizeSearch />
                <SynthesizeChart/>
                <SynthesizeList />
            </div>

        )
    }
});

export default Synthesize;
