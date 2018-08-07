/**
 * @file 管理平台脚部
 * @author CM 2017.07.20
 */

import React, { Component } from 'react'
import { render } from 'react-dom'


var Footer = React.createClass({
    render: function () {
        return (
            <footer>
                <div className="pull-right">
                    贵州优行车联科技有限公司 @coyright2017
                </div>
                <div className="clearfix"></div>
            </footer>
        )
    }
});

export default Footer;