/**
 * @file 登录页面 Reflux View
 * @author CM 2017.09.13
 */
import React, {Component} from 'react'
import {render} from 'react-dom'

import CommonAction from '../actions/commonAction';
import GlobalParam from "../../../common/globalParam";
import CommonStore from "../stores/commonStore";

var Login = React.createClass({
    getInitialState: function() {
        return {
            verification: false,//是否拖拽验证通过
        };
    },
    componentDidMount:function(){
        let that = this;
        that.listenEnterEvent();
        that.getCookieData();
        that.loadQR();
        that.renderVerification();
        GlobalParam.clearAll();
    },
    handleBlurUserName:function(event){
        var user_name = $(event.target).val();
        if(!!user_name){
            CommonAction.blurUserName(user_name,function(org_name){
                $("span#org_name").html(org_name);
            });
        }
    },
    // handleUpdateJcaCode:function(event){
    //     $(event.target).parent().find("img").attr("src",Urls.jcaptchaCode + '?_time=' + new Date().getTime() + '&codeToken=' + localStorage.codeToken);
    // },
    handleClickLogin:function(event){
        let that = this;
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）;—|{}【】‘；：”“'。，、？]");
        var user_name = $("#username").val();
        var password = $("#password").val();
        //var jcaptchaCode = $("#jcaptchaCode").val();
        var verification = this.state.verification;
        if(!!user_name){
            if(pattern.test($("#username").val())){
                toastr.error("用户名不能输入非法字符！");
                $("#username").attr("value","");
                $("#username").focus();
                return false;
            }
        }else{
            toastr.error("用户名不能为空！");
            return false;
        }
        if(!!password){
            $("#password").val(escape($("#password").val()));
        }else{
            toastr.error("密码不能为空！");
            return false;
        }
        // if(!jcaptchaCode){
        //     toastr.error("验证码不能为空！");
        //     return false;
        // }
        if(!verification){
            toastr.error("请按住滑块，拖拽验证！");
            return false;
        }
        password = $("#password").val();
        var param = {
            username:user_name,
            password:password,
            //jcaptchaCode:jcaptchaCode
        };
        CommonAction.userLogin(param,function(){
            that.setCookieByUserAndPW();
        });
    },
    handleClickRemember:function(event){
        if($(event.target).is(':checked')) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）;—|{}【】‘；：”“'。，、？]");
            var user_name = $("#username").val();
            var password = $("#password").val();
            if(!!user_name){
                if(pattern.test($("#username").val())){
                    toastr.error("用户名不能输入非法字符！");
                    $("#username").attr("value","");
                    $("#username").focus();
                    return false;
                }
            }else{
                toastr.error("用户名不能为空！");
                return false;
            }
            if(!!password){
                $("#password").val(escape($("#password").val()));
            }else{
                toastr.error("密码不能为空！");
                return false;
            }
            $.cookie('username', user_name, { expires: 7 });
            $.cookie('password',($.base64.encode(password)).replace("=",""),{ expires: 7 });
        } else {
            $.removeCookie('username');
            $.removeCookie('password');
        }
    },
    setCookieByUserAndPW:function(){
        if($("input[name='remember']").is(':checked')) {
            var user_name = $("#username").val();
            var password = $("#password").val();
            $.cookie('username', user_name, { expires: 7 });
            $.cookie('password',($.base64.encode(password)).replace("=",""),{ expires: 7 });
        } else {
            $.removeCookie('username');
            $.removeCookie('password');
        }
    },
    listenEnterEvent:function(){
        let that = this;
        $(document).keyup(function(e){
            if(e.which == 13) {
                that.handleClickLogin();
            }
        });
    },
    getCookieData:function(){
        var user_name = $.cookie('username');
        var password = $.cookie('password');
        if(!!user_name && !!password){
            $("input[name='remember']").attr("checked",true);
            $("#username").val(user_name);
            $("#password").val($.base64.decode(password));
        }
    },
    loadQR:function () {
        $(".yb_conct").hover(function() {
            $(".yb_conct").css("left", "3px");
            $(".yb_bar .yb_ercode").css('height', '200px');
        }, function() {
            $(".yb_conct").css("left", "-200px");
            $(".yb_bar .yb_ercode").css('height', '53px');
        });
    },
    renderVerification: function(){
        let that = this;
        $("#verification").slider({
            width: 300, // width
            height: 45, // height
            sliderBg: "#f0fafe", // 滑块背景颜色
            color: "#666666", // 文字颜色
            fontSize: 14, // 文字大小
            // bgColor: "#33CC00", // 背景颜色
            textMsg: "按住滑块，拖拽验证", // 提示文字
            successMsg: "验证通过", // 验证成功提示文字
            // successColor: "red", // 滑块验证成功提示文字颜色
            time: 400, // 返回时间
            callback: function(result) { // 回调函数，true(成功),false(失败)
                that.setState({verification:result});
            }
        });
    },
    render: function () {
        let that = this;
        return (
            <div className="login-box">
                <div className="login-top-box">
                    <div className="login-logo">
                        <img src={__uri("/static/images/login/login_logo.png")}/>
                    </div>
                </div>
                <div className="login-center-box">
                    <div className="yb_conct">
                        <div className="yb_bar">
                            <ul>
                                <li className="yb_ercode" style={{height:'53px'}}><span  className="yb-title">手机端下载</span>
                                    <img src={__uri("/static/images/login/rightbar.png")} width="36"  className="yb-icon" /><br />
                                    <img className="hd_qr" src={__uri("/static/images/login/Ios.png")}  alt="ios下载" style={{marginTop: '-6px'}} />
                                    <img className="hd_qr" src={__uri("/static/images/login/Android.png")}  alt="安卓下载" style={{marginRight:'6px',marginTop:'-6px'}} />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="login-center">
                        <div className="notice">
                            <img src={__uri("/static/images/login/login_left.png")}/>
                        </div>
                        <div className="login-input">
                            <div className="login-label">用户登录<span style={{color:'#91aac8',fontSize:'16px'}}> Login</span></div>
                            <div className="login-mechanism">
                                <img src={__uri("/static/images/login/jigou-icon.png")}/>
                                <span id="org_name">机构名称</span>
                            </div>
                            <div className="username">
                                <i className="username-icon"></i>
                                <input type="text" id="username" placeholder="请输入用户名" onBlur={that.handleBlurUserName}/>
                            </div>
                            <div className="password">
                                <i className="password-icon"></i>
                                <input type="password" id="password" placeholder="请输入密码"/>
                            </div>
                            <div className="verification-box" id="verification">
                                {/*<div className="verification">*/}
                                    {/*<i className="verification-icon"></i>*/}
                                    {/*<input type="text" id="jcaptchaCode" placeholder="输验证码"/>*/}
                                {/*</div>*/}
                                {/*<div className="number">*/}
                                    {/*<img src={Urls.jcaptchaCode + '?_time=' + new Date().getTime() + '&codeToken=' + localStorage.codeToken} className="code_img" onClick={that.handleUpdateJcaCode} style={{cursor:'pointer'}}/>*/}
                                    {/*&nbsp;&nbsp;*/}
                                    {/*<a href="#" onClick={that.handleUpdateJcaCode}>换一张</a>*/}
                                {/*</div>*/}
                            </div>
                            <div className="usertext">
                                <span style={{float:'left'}}><input name="remember" type="checkbox" onClick={this.handleClickRemember}/>记住密码</span>
                                <span style={{float:'right'}}><a href="#">忘记密码?</a></span>
                            </div>
                            <div className="login-btn" onClick={this.handleClickLogin}>马上登录</div>
                        </div>
                    </div>
                </div>
                <div className="login-foot">优行公车管理云平台    v2.02</div>
            </div>
        )
    }
});

if (location.pathname.indexOf('/login') > -1) {
    render(
        <Login />,
        $('#main_content')[0]
    )
}