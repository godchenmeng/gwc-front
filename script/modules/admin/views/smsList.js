/**
 * @file 短信管理 Reflux View
 * @author CM 2017.08.23
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共模块加载
import SmsAction from '../actions/smsAction';
import SmsStore from '../stores/smsStore';

//模块加载
import SmsListFilter from 'smsListFilter';

var SmsList = React.createClass({
    componentDidMount: function () {
        let queryParam = function (params) {  //配置参数
            let param = {
                type : $("#filter_type").val(),
                startDate: $("#sms_start_date").val(),
                endDate: $("#sms_end_date").val(),
                limit: params.limit,
                pageIndex: params.pageNumber - 1
            };
            return param;
        }
        SmsAction.getsmslist(queryParam);
    },

    handleSmsSetShow:function (event) {
        $("#smsSet").modal("show");
    },
    render:function () {
        return(
            <div className="right_col">
                <div className="page-title" style={{height: "65px"}}>
                    <div className="title_left" style={{marginTop: "5px"}}> <img src={__uri("/static/images/bread-nav.png")} />后台管理 > 短信管理 </div>
                    <div className="title_right" style={{textAlign:"right"}}></div>
                </div>
                <br /><br />
                <SmsListFilter />
                <table id="sms_list_table" className="table-striped mart12 clear" style={{width:"100%",borderCollapse:"collapse"}}></table>
            </div>
        )
    }
});

export default SmsList;
