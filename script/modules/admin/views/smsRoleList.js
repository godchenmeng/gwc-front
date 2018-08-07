/**
 * @file 短信角色管理 Reflux View
 * @author Banji 2017.10.30
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共模块加载
import SmsRoleAction from '../actions/smsRoleAction';
import SmsRoleStore from '../stores/smsRoleStore';
import CommonStore from '../../common/stores/commonStore';

//模块加载
import SmsRoleListFilter from 'smsRoleListFilter';
import SmsRoleAdd from 'smsRoleAdd';

var SmsRoleList = React.createClass({
    componentDidMount: function () {
        let queryParam = function (params) {  //配置参数
            let param = {
                name:$("input#sms_role_name").val(),
                limit: params.limit,
                pageIndex: params.pageNumber - 1
            };
            return param;
        }
        SmsRoleAction.getSmsRoleList(queryParam);
    },
    handleSmsRoleAddShow:function (event) {
        $("#sms_role_title").html("新增短信角色");
        $("#smsRoleAdd").modal("show");
    },
    render:function () {
        return(
            <div className="right_col">
                <div className="page-title" style={{height: "65px"}}>
                    <div className="title_left" style={{marginTop: "5px"}}> <img src={__uri("/static/images/bread-nav.png")} />后台管理 > 短信角色管理 </div>
                    <div className="title_right" style={{textAlign:"right"}}>
                        <button type="button" className={CommonStore.verifyPermission('smsrole/add')?"btnOne btn-bule":"hide"} onClick={this.handleSmsRoleAddShow}><i className="icon-bg addUser-icon"></i>新增短信角色</button>
                    </div>
                </div>
                <br /><br />
                <SmsRoleListFilter />
                <table id="sms_role_list_table" className="table-striped mart12 clear" style={{width:"100%",borderCollapse:"collapse"}}></table>
                <SmsRoleAdd />
            </div>
        )
    }
});

export default SmsRoleList;
