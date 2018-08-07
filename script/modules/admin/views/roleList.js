/**
 * @file 角色管理 Reflux View
 * @author CM 2017.08.22
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共模块加载
import RoleAction from '../actions/roleAction';
import RoleStore from '../stores/roleStore';
import CommonStore from '../../common/stores/commonStore'

//模块加载
import RoleListFilter from 'roleListFilter';
import RoleAdd from 'roleAdd';

var RoleList = React.createClass({
    componentDidMount: function () {
        let queryParam = function (params) {  //配置参数
            let param = {
                name : $("#s_role_name").val(),
                limit: params.limit,
                pageIndex: params.pageNumber - 1
            };
            return param;
        }
        RoleAction.getrolelist(queryParam);
    },

    handleAddRoleShow:function (event) {
        $("#roleAdd").modal("show");
    },
    render:function () {
        return(
            <div className="right_col">
                <div className="page-title" style={{height: "65px"}}>
                    <div className="title_left" style={{marginTop: "5px"}}> <img src={__uri("/static/images/bread-nav.png")} />后台管理 > 角色管理 </div>
                    <div className="title_right" style={{textAlign:"right"}}>
                        <button type="button" className={CommonStore.verifyPermission('role/add')?"btnOne btn-bule":"btnOne btn-bule hide"} onClick={this.handleAddRoleShow}><i className="icon-bg addUser-icon"></i>新增角色</button>
                    </div>
                </div>
                <br /><br />
                <RoleListFilter />
                <table id="role_list_table" className="table-striped mart12 clear" style={{width:"100%",borderCollapse:"collapse"}}></table>
                <RoleAdd />
            </div>
        )
    }
});

export default RoleList;
