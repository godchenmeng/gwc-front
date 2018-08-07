/**
 * @file 超速查询-搜索框 Reflux View
 * @author CM 2017.09.18
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

//公共方法加载
import Commonfun from "../../../common/commonfun"

//模块加载
import Datetimepicker from '../../../common/datetimepicker';

var SpeedingSearch = React.createClass({
    componentDidMount: function () {
        let dateOpts = {
            endDate: Commonfun.getCurrentDate()
        };
        Datetimepicker.init("#searchDate",dateOpts);
        Datetimepicker.setDate("#searchDate",Commonfun.getCurrentDate());
    },
    handleLimitInput:function (event) {
        let val = $('#searchLimit').val();
        if(isNaN(val)) {
            $('#searchLimit').val(val.substring(0,val.length - 1));
        }
    },
    render: function () {
        return (
            <div className="Monitor-left">
                <div className="state-box mart5">
                    <input type="text" placeholder="查询日期" className="input-date ml-10" style={{width:"88%"}} id="searchDate" />
                    <input type="text" placeholder="请输入限速数值" className="input-data ml-10 mart8" style={{width:"88%"}} id="searchLimit" onChange={this.handleLimitInput} maxLength="3" size="150"  />
                </div>
            </div>
        )
    }
});

export default SpeedingSearch;