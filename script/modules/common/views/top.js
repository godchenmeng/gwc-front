/**
 * @file 管理平台头部
 * @author CM 2017.07.20
 */

import React, { Component } from 'react'
import { render } from 'react-dom'

import CommonAction from '../actions/commonAction'
import CommonStore from '../stores/commonStore'
import ChangePassword from '../../admin/views/changePassword';

import Info from 'info';
import GlobalParam from "../../../common/globalParam";

var Top = React.createClass({
    getInitialState:function () {
      return{
          username:GlobalParam.get("user").name
      }
    },
    handleLogout:function () {
        CommonAction.userlogout();
    },
    handleChangePWShow:function () {
        $("#top_changepassword").modal("show");
        $("#top_userid").val(GlobalParam.get("user").id);
    },
    handleInfoModalShow:function () {
        $("#info_center_modal").modal("show");
        CommonStore.trigger("showInfoList","1");//点击消息中心，只查询未读和置顶的记录
    },
    handleMenuToggle:function () {
        $("body").hasClass("nav-md") ? ($("#sidebar-menu").find("li.active ul").hide(), $("#sidebar-menu").find("li.active").addClass("active-sm").removeClass("active")):($("#sidebar-menu").find("li.active-sm ul").show(), $("#sidebar-menu").find("li.active-sm").addClass("active").removeClass("active-sm")), $("body").toggleClass("nav-md nav-sm");
    },
    render: function () {
        return (
            <div className="top_nav">
                <div className="nav_menu">
                    <nav>
                        <div className="nav toggle">
                            <a id="menu_toggle" onClick={this.handleMenuToggle}><i className="fa path-8"></i></a>
                        </div>
                        {/*<div className="Unit-name">贵州优行科技有限公司</div>*/}
                        <ul className="nav navbar-right">
                            <li >
                                <a onClick={this.handleLogout} title='退出登录'>
                                    <i className="fa path-20"></i>
                                </a>
                            </li>
                            <li role="presentation"  className="dropdown">
                                <a href="javascript:;" id="dLabel" data-target="#"  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" >
                                    <i className="fa path-app"></i>
                                </a>
                                <ul className="dropdown-menu App-down" aria-labelledby="dLabel">
                                    <li><img src={__uri("/static/images/login/Android.png")}></img></li>
                                    <li><img src={__uri("/static/images/login/Ios.png")}></img></li>
                                </ul>
                            </li>
                            <li role="presentation" >
                                <a onClick={this.handleChangePWShow} title='修改密码' >
                                    <i className="fa path-19"></i>
                                </a>
                            </li>
                            <li className="">
                                <span className="user-profile" style={{padding:"18px 15px",borderRight:"1px rgba(204, 204, 204, 0.15) solid",height:"61px",position:"relative",display:"block"}}>
                                    <img src={__uri("/static/images/img.jpg")} alt="" />
                                    <span style={{verticalAlign:'top'}}>{this.state.username}</span>
                                    {/*<span className="fa path-13"></span>*/}
                                </span>
                            </li>
                            {/*<li>*/}
                                {/*<a href="javascript:;">*/}
                                    {/*<i className="fa path-10"></i>*/}
                                {/*</a>*/}
                            {/*</li>*/}
                            <li className={CommonStore.verifyPermission('info/infoCenter')?"":"hide"}>
                                <a onClick={this.handleInfoModalShow} title='消息'>
                                    <i className="fa path-9"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <ChangePassword formName={"top_re_pass_form"} cpName={'top_changepassword'} userIDName={'top_userid'} chPassIDName={'top_ch_pass'} rePassIDName={'top_re_pass'} chErrInfoName={'top_ch_err_info'}/>
                <Info />
            </div>
    )
    }
});

export default Top;