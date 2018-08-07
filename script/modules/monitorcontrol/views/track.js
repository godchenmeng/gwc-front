/**
 * @file 历史轨迹 Reflux View
 * @author CM 2017.08.08
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

import Commfun from '../../../common/commonfun';
import CommonAction from "../../common/actions/commonAction";

//模块加载
import TrackSearch from 'trackSearch';
import MapComponent from 'mapComponent';
import TimeLineComponent from 'timeLineComponent';
import TrackTable from 'trackTable';
import SpeedComponent from 'speedComponent';

var Track = React.createClass({
    componentDidMount: function () {
        CommonAction.loadDeviceCarType({});
    },
    render: function() {
        let carNo = this.props.param ? Commfun.getSplitParam(this.props.param,'car_no') : '';
        return (
            <div className='right_col visible'>
                <div className="page-title">
                    <div className="title_left"> <img src={__uri("/static/images/bread-nav.png")} />监控管理 > 轨迹管理 </div>
                    <TrackSearch carNo={carNo} />
                </div>
                <br /><br />
                <div className="map-box">
                    <MapComponent mapName={"track_map"}/>
                    <div className="map-control">
                        <TimeLineComponent />
                        <SpeedComponent />
                        <TrackTable />
                    </div>
                </div>
            </div>

        )
    }
});

export default Track;
