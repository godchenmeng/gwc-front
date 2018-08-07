/**
 * @file 用户管理 Reflux View
 * @author CM 2017.08.15
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共模块加载
import UserAction from '../actions/userAction';
import UserStore from '../stores/userStore';
import Urls from '../../../common/urls';
import BootstrapTree from '../../../common/bootstrapTree';
import BootstrapTable from '../../../common/bootstrapTable';
import CommonStore from '../../common/stores/commonStore';

//模块加载
import UserListFilter from "userListFilter";
import UserAdd from "userAdd";
import AccountAdd from "accountAdd";
import UserAccountAdd from "userAccountAdd";

var UserList = React.createClass({
    componentDidMount: function () {
        let queryParam = function (params) {  //配置参数
            let param = {
                name : $("#username").val(),
                sex : $("#usersex").val(),
                code: $("#usercode").val(),
                startDate: $("#startDate").val(),
                endDate: $("#endDate").val(),
                limit: params.limit,
                pageIndex: params.pageNumber - 1
            };
            return param;
        }
        UserAction.getuserlist(queryParam);
        this.initOrgTree();
    },
    /**
     * 初始化机构选取树
     */
    initOrgTree:function () {
        Urls.get(Urls.loadorgtree,{},function(data){
            $("#org_tree").css({
                top:$("#user_org_name").position().top + $("#user_org_name").outerHeight() + 1,
                left:$("#user_org_name").position().left + 105
            });
            BootstrapTree.initTree("org_tree",data,"user_org_name","user_org");
            // $("#acc_tree").css({
            //     top:$("#acc_org_name").position().top + $("#acc_org_name").outerHeight() + 1,
            //     left:$("#acc_org_name").position().left + 105
            // });
            //BootstrapTree.initTree("acc_tree",data,"acc_org_name","acc_org");
            $("#user_acc_org_tree").css({
                top:$("#user_acc_org_name").position().top + $("#user_acc_org_name").outerHeight() + 1,
                left:$("#user_acc_org_name").position().left + 105
            });
            BootstrapTree.initTree("user_acc_org_tree",data,"user_acc_org_name","user_acc_org");
        });
    },
    /**
     * 响应新增用户按钮
     * @param event
     */
    handleAddUserShow:function (event) {
        $("#userAdd").modal("show");
    },
    /**
     * 响应新增账号按钮
     * @param event
     */
    handleAddAccountShow:function (event) {
        let selRow = BootstrapTable.getSelected("user_list_table");
        if(selRow.length != 1){
            toastr.warning("请选择一个用户增加账号！");
        }else{
            let param = {
                mid: selRow[0].id,
            };
            Urls.post(Urls.checkuseraccount,param,function (result) {
                if(result.responseCode=="1" && result.responseMsg=="success") {
                    $("#accountAdd").modal("show");
                    $("#acc_name").val(selRow[0].name);
                    $("#acc_user_id").val(selRow[0].id);
                    $("#acc_org_name").val(selRow[0].oname);
                    $("#acc_org").val(selRow[0].org);
                }else{
                    toastr.error(result.responseMsg);
                }
            });
        }
    },
    /**
     * 响应新增账号和用户按钮
     * @param event
     */
    handleAddUserAccountShow:function (event) {
        $("#userAccountAdd").modal("show");
    },
    render:function () {
        return(
            <div className="right_col">
                <div className="page-title" style={{height: "65px"}}>
                    <div className="title_left" style={{marginTop: "5px"}}> <img src={__uri("/static/images/bread-nav.png")} />后台管理 > 用户管理 </div>
                    <div className="title_right" style={{textAlign:"right"}}>
                        <button type="button" className={CommonStore.verifyPermission('member/add')?"btnOne btn-bule":"hide"} onClick={this.handleAddUserShow}><i className="icon-bg addUser-icon"></i>新增用户</button>
                        <button type="button" className={CommonStore.verifyPermission('user/add')?"btnOne btn-green":"hide"} onClick={this.handleAddAccountShow}><i className="icon-bg add-icon"></i>新增账号</button>
                        <button type="button" className={CommonStore.verifyPermission('member/user/add')?"btnOne btn-green1":"hide"} onClick={this.handleAddUserAccountShow}><i className="icon-bg add-icon"></i>新增账号和用户</button>
                    </div>
                </div>
                <br /><br />
                <UserListFilter />
                <table id="user_list_table" className="table-striped mart12 clear" style={{width:"100%",borderCollapse:"collapse"}}></table>
                <UserAdd />
                <AccountAdd />
                <UserAccountAdd />
            </div>
        )
    }
});

export default UserList;
