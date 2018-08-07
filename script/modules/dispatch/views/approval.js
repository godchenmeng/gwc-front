/**
 * @file 审批 Reflux View
 * @author Banji 2017.08.14
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import ApprovalSearch from 'approvalSearch';
import ApprovalList from 'approvalList';
import ApprovalModal from 'approvalModal';

var Approval = React.createClass({
    render: function() {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />调度管理 > 审批 </div>
                    <div className="title_right"></div>
                </div>
                <br /><br />
                <ApprovalSearch />
                <ApprovalList />
                <ApprovalModal />
            </div>

        )
    }
});

export default Approval;
