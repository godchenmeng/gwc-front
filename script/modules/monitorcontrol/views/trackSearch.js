/**
 * @file 轨迹搜索框 Reflux View
 * @author CM 2017.08.08
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共方法加载
import Commonfun from "../../../common/commonfun"
import TrackAction from '../actions/trackAction';

//模块加载
import AutoComplete from '../../../common/autoComplete';
import Datetimepicker from '../../../common/datetimepicker';
import TrackBox from '../views/trackBox';

var TrackSearch = React.createClass({
    getInitialState: function() {
        return {}
    },
    componentDidMount: function () {
        let dateOpts = {
            endDate: Commonfun.getCurrentDate()
        };
        Datetimepicker.init("#trackDate",dateOpts);
        AutoComplete.initInput("#carInputer");
        Datetimepicker.setDate("#trackDate",Commonfun.getCurrentDate());
        if(this.props.carNo && "" != this.props.carNo){
            $("#carInputer").val(this.props.carNo);
            this.handleSearchClick(null);
        }
    },
    /**
     * DOM操作回调，搜索按钮点击事件
     * @param {object} event 事件对象
     */
    handleSearchClick:function (event) {
        $('#loading').modal('show');
        let carNo = $("#carInputer").val();
        let selDate = $("#trackDate").val();
        TrackAction.searchtrack(carNo,selDate);
    },
    render: function() {
        return (
            <div className="title_right" id="trackSearch" style={{marginTop: "-2px",position: "relative",textAlign:"right"}}>
                <input type="text" id="carInputer" placeholder="选择车辆"  className="in130" />
                <input type="text" placeholder="日期" readOnly id="trackDate" className="date-icon in130 ml-6" />
                <button type="button" className="btn-search ml-6 flipBtn" onClick={this.handleSearchClick}>搜 索</button>
                <TrackBox />
            </div>
        )
    }
});
export default TrackSearch;
