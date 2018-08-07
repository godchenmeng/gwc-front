/**
 * @file 越界查询-搜索框 Reflux View
 * @author CM 2017.09.02
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

//公共方法加载
import Commonfun from "../../../common/commonfun"

//模块加载
import Datetimepicker from '../../../common/datetimepicker';

var FenceSearch = React.createClass({
    componentDidMount: function () {
        let dateOpts = {
            endDate: Commonfun.getCurrentDate()
        };
        Datetimepicker.init("#searchDate",dateOpts);
        Datetimepicker.setDate("#searchDate",Commonfun.getCurrentDate());
    },
    render: function () {
        return (
            <div className="Monitor-left">
                <div className="state-box mart5">
                    <input type="text" placeholder="查询日期" className="input-date ml-10" style={{width:"88%"}} id="searchDate" />
                    <select className="input-car" id="selCondition">
                        <option value="0">选择触发条件</option>
                        <option value="1">驶入触发</option>
                        <option value="2">驶出触发</option>
                        <option value="3">驶入驶出触发</option>
                    </select>
                </div>
            </div>
        )
    }
});

export default FenceSearch;