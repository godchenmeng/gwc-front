/**
 * @file 监控管理 Reflux View
 * @author CM 2017.09.13
 */
import React, {Component} from 'react';
import {render} from 'react-dom';

import CommonFun from '../../../common/commonfun'

import Top from 'top';
import Left from 'left';
import Footer from 'footer';
import Loading from 'loading';
import Modal from 'modal';
import Monitor from '../../monitorcontrol/views/monitor';
import MonitorNew from '../../monitorcontrol/views/monitor-new';
import Locate from '../../monitorcontrol/views/locate';
import Track from '../../monitorcontrol/views/track';
import Trace from '../../monitorcontrol/views/trace';
import Fence from '../../monitorcontrol/views/fence';
import FenceSet from '../../monitorcontrol/views/fenceSet';
import Speeding from '../../monitorcontrol/views/speeding';
import SpeedingSet from '../../monitorcontrol/views/speedingSet';
import GlobalParam from "../../../common/globalParam";

var MonitorIndex = React.createClass({
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
            case 'monitor': //实时监控模块
                content = <MonitorNew />
                break;
            case 'monitornew':
                content = <Monitor />
                break;
            case 'locate': //定位查询模块
                content = <Locate/>
                break;
            case 'track': //历史轨迹模块
                content = <Track param={params}/>
                break;
            case 'fence'://电子栅栏模块
                content = <Fence />;
                break;
            case 'fenceset'://电子栅栏设置模块
                content = <FenceSet param={params} />;
                break;
            case 'speeding'://超速查询模块
                content = <Speeding />;
                break;
            case 'speedingset'://超速查询设置模块
                content = <SpeedingSet param={params} />;
                break;
        }
        if(GlobalParam.get("user")) {
            let colMinHeight = $("body").height() - 39;//减去footer的高度
            setTimeout(function(){
                $("div.right_col").css("min-height",colMinHeight);
            });
            return (
                <div className="main_container">
                    <Left pageKey={'monitor'}/>
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

if (location.pathname.indexOf('/monitor') > -1) {
    if(CommonFun.getQueryString("modal") == 'trace'){
        render(
            <Trace />,
            $('#main_content')[0]
        )
    }else{
        render(
            <MonitorIndex />,
            $('#main_content')[0]
        )
    }
}