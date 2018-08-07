/**
 * @file 实时监控-地图 Reflux View
 * @author CM 2017.07.21
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import MapControl from 'mapControl';

var MapComponent = React.createClass({
    componentDidMount: function () {
        let mapName = this.props.mapName ? this.props.mapName : "baidu_map";
        mapControl.loadMap(mapName);
    },
    render: function () {
        let mapName = this.props.mapName ? this.props.mapName : "baidu_map";
        return (
            <div id={mapName} className="Monitor-con">
            </div>
        )
    }
});

export default MapComponent;