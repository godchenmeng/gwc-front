/**
 * @file 用车申请列表 Reflux View
 * @author Banji 2017.08.03
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import ApplyListSearch from '../views/applyListSearch'
import ApplyListTable from '../views/applyListTable'
import ApplyListModal from 'applyListModal'

var ApplyList = React.createClass({
    render: function () {
        return (
            <div className="right_col visible">
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />调度管理 > 用车申请列表
                        <div className="title_right"></div>
                    </div>
                </div>
                <br /><br />
                <ApplyListSearch />
                <ApplyListTable />
                <ApplyListModal />
            </div>
        )
    }
});

export default ApplyList;