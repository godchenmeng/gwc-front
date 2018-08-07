/**
 * @file 后台管理 Reflux View
 * @author CM 2017.09.13
 */
import React, {Component} from 'react';
import {render} from 'react-dom';

import CommonFun from '../../../common/commonfun';

import Top from 'top';
import Left from 'left';
import Footer from 'footer';
import Loading from 'loading';
import Modal from 'modal';
import UserList from '../../admin/views/userList';
import AccountList from '../../admin/views/accountList';
import Department from '../../admin/views/department';
import RoleList from '../../admin/views/roleList';
import SmsList from '../../admin/views/smsList';
import SmsRoleList from '../../admin/views/smsRoleList';
import GlobalParam from "../../../common/globalParam";

var Admin = React.createClass({
    render: function() {
        let selTabID = '';
        if(CommonFun.getQueryString("act") != ''){
            selTabID = CommonFun.getQueryString("act").toLocaleLowerCase();
        }else{
            window.location.href = 'index.html';
        }
        let content = null;
        switch(selTabID){
            case 'userlist'://用户管理列表
                content = <UserList />
                break;
            case 'accountlist'://账号管理列表
                content = <AccountList />
                break;
            case 'department'://机构部门管理
                content = <Department />
                break;
            case 'rolelist'://角色管理
                content = <RoleList />
                break;
            case 'smslist'://短信管理模块
                content = <SmsList />
                break;
            case 'smsrolelist'://短信角色管理模块
                content =  <SmsRoleList />
        }
        if(GlobalParam.get("user")) {
            let colMinHeight = $("body").height() - 39;//减去footer的高度
            setTimeout(function(){
                $("div.right_col").css("min-height",colMinHeight);
            });
            return (
                <div className="main_container">
                    <Left pageKey={'admin'}/>
                    <Top/>
                    {content}
                    <Footer/>
                    <Loading/>
                    <Modal/>
                </div>
            );
        }else{
            window.location.href = 'login.html'
        }
    }
});

if (location.pathname.indexOf('/admin') > -1) {
    render(
        <Admin />,
        $('#main_content')[0]
    )
}