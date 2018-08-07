/**
 * @file 监控管理 Reflux View
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
import ImgModal from 'imgModal';
import Driver from '../../resource/views/driver';
import Car from '../../resource/views/car';
import Device from '../../resource/views/device';
import GlobalParam from "../../../common/globalParam";

var Resource = React.createClass({
    render: function() {
        let selTabID = '';
        let params = '';
        if(CommonFun.getQueryString("act") != ''){
            selTabID = CommonFun.getQueryString("act").toLocaleLowerCase();
        }else{
            window.location.href = 'index.html';
        }
        if(CommonFun.getQueryString("params")){
            params = CommonFun.getQueryString("params");
        }
        let content = null;
        switch(selTabID){
            case 'car': //车辆管理
                content = <Car/>
                break;
            case 'device': //设备管理
                content = <Device/>
                break;
            case 'driver'://驾驶员管理模块
                content = <Driver/>;
                break;
        }
        if(GlobalParam.get("user")) {
            let colMinHeight = $("body").height() - 39;//减去footer的高度
            setTimeout(function(){
                $("div.right_col").css("min-height",colMinHeight);
            });
            return (
                <div className="main_container">
                    <Left pageKey={'resource'}/>
                    <Top/>
                    {content}
                    <Footer/>
                    <Loading/>
                    <Modal/>
                    <ImgModal/>
                </div>
            );
        }else{
            window.location.href = 'login.html'
        }
    }
});

if (location.pathname.indexOf('/resource') > -1) {
    render(
        <Resource />,
        $('#main_content')[0]
    )
}