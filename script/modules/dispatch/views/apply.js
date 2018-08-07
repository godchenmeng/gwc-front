/**
 * @file 用车申请 Reflux View
 * @author Banji 2017.08.03
 */
import React, { Component } from 'react';
import { render } from 'react-dom';
import ApplySubmit from 'applySubmit';
import ApplyOverView from 'applyOverview';
import ApplyInfo from 'applyInfo';
import ApplyModal from 'applyModal';

var Apply = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {

    },
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />调度管理 > 用车申请</div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <div className="row">
                    <div className="col-md-9">
                        <ApplySubmit/>
                    </div>
                    <div className="col-md-3">
                        <ApplyOverView/>
                        <ApplyInfo/>
                    </div>
                </div>
                <ApplyModal/>
            </div>
        )
    }
});

export default Apply;
