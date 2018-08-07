/**
 * @file 短信管理过滤 Reflux View
 * @author CM 2017.08.23
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共模块加载
import SmsAction from '../actions/smsAction';
import SmsStore from '../stores/smsStore';
import Datetimepicker from '../../../common/datetimepicker';
import Commonfun from '../../../common/commonfun';

var SmsListFilter = React.createClass({
    getInitialState: function() {
        return{
            isSpeed:false,
            isCross:false,
            isLllegal:false,
            isPlug:false,
            isOuttime:false,
        }
    },
    componentDidMount: function () {
        let dateOpts = {
            endDate: Commonfun.getCurrentDate()
        };
        Datetimepicker.init("#sms_start_date",dateOpts);
        Datetimepicker.init("#sms_end_date",dateOpts);
    },
    handleSetFilter:function (type,event) {
        switch(type){
            case 1:
                this.setState({
                    isSpeed:this.state.isSpeed ? false : true
                });
                break;
            case 2:
                this.setState({
                    isCross:this.state.isCross ? false : true
                });
                break;
            case 3:
                this.setState({
                    isLllegal:this.state.isLllegal ? false : true
                });
                break;
            case 4:
                this.setState({
                    isPlug:this.state.isPlug ? false : true
                });
                break;
            case 5:
                this.setState({
                    isOuttime:this.state.isOuttime ? false : true
                });
                break;
        }
    },
    setTypeFilter:function () {
        let typeFilters = "";
        if(this.state.isSpeed){
            typeFilters += "2,"
        }
        if(this.state.isCross){
            typeFilters += "1,"
        }
        if(this.state.isLllegal){
            typeFilters += "0,"
        }
        if(this.state.isPlug){
            typeFilters += "4,"
        }
        if(this.state.isOuttime){
            typeFilters += "3,"
        }
        typeFilters = typeFilters.substr(0,typeFilters.length - 1);
        $("#filter_type").val(typeFilters);
    },
    handleSmsSearch:function (event) {
        this.setTypeFilter();
        SmsAction.getsmslist(null);
    },
    handleSmsReset: function(event){
        this.setState({
            isSpeed:false,
            isCross:false,
            isLllegal:false,
            isPlug:false,
            isOuttime:false
        });
        $("input#sms_start_date").val("");
        $("input#sms_end_date").val("");
    },
    render:function () {
        return(
            <div className="search-box">
                <input type="hidden" id="filter_type" />
                <a className={this.state.isSpeed ? "active" : ""} onClick={this.handleSetFilter.bind(null,1)}>超速</a>
                <a className={this.state.isCross ? "active" : ""} onClick={this.handleSetFilter.bind(null,2)}>越界</a>
                <a className={this.state.isLllegal ? "active" : ""} onClick={this.handleSetFilter.bind(null,3)}>违章</a>
                <a className={this.state.isPlug ? "active" : ""} onClick={this.handleSetFilter.bind(null,4)}>拔插设备</a>
                <a className={this.state.isOuttime ? "active" : ""} onClick={this.handleSetFilter.bind(null,5)}>非规定时段</a>
                <input type="text" className="date-icon" placeholder="开始日期" id="sms_start_date" />至&nbsp;&nbsp;<input type="text" className="date-icon" placeholder="结束日期" id="sms_end_date" />
                <button type="button" className="btn-search" onClick={this.handleSmsSearch}>搜索</button>
                <button type="button" className="btn-reset" onClick={this.handleSmsReset}>重置</button>
            </div>
        )
    }
});
export default SmsListFilter;
