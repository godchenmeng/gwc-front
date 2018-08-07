/**
 * @file 实时监控-列表 Reflux View
 * @author CM 2017.07.21
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import TreeControl from 'treeControl';

var TreeComponent = React.createClass({
    render: function () {
        let treeName = this.props.treeName ? this.props.treeName : "monitor_org_tree";
        return (
            <div className="Monitor-left-tree" id={treeName}>

            </div>
        )
    }
});

export default TreeComponent;