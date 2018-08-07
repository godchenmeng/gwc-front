/**
 * @file 管理平台左部
 * @author CM 2017.07.20
 */

import React, { Component } from 'react'
import { render } from 'react-dom';
import Slidebar from '/script/modules/common/views/slidebar';
import GlobalParam from "../../../common/globalParam";

var Left = React.createClass({
    getInitialState:function () {
        return{
            logo:GlobalParam.get("user").logo
        }
    },
    render: function () {
        return (
            <div className="col-md-3 left_col">
                <div className="left_col scroll-view">
                    <div className="navbar nav_title border_none">
                        <a href="index.html" className="site_title"><i><img src={(this.state.logo && this.state.logo != 'null')?this.state.logo:__uri("/static/images/logo.png")} /></i> <span>公车管理云平台</span></a>
                    </div>
                    <div className="clearfix"></div>
                    <Slidebar pageKey={this.props.pageKey} />
                </div>
            </div>
    )
    }
});

export default Left;