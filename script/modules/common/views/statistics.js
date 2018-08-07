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
import Synthesize from '../../statistics/views/synthesize';
import Online from '../../statistics/views/online';
import OverSpeed from '../../statistics/views/overSpeed';
import Outside from '../../statistics/views/outside';
import NotReturn from '../../statistics/views/notReturn';
import FoulPark from '../../statistics/views/foulPark';
import FoulTask from '../../statistics/views/foulTask';
import FoulTime from '../../statistics/views/foulTime';
import Drive from '../../statistics/views/drive';
import Violation from '../../statistics/views/violation';
import DataQueryExport from '../../statistics/views/dataQueryExport';
import GlobalParam from "../../../common/globalParam";

var Statistics = React.createClass({
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
            case 'synthesize'://综合模块
                content = <Synthesize />
                break;
            case 'online'://上线率模块
                content = <Online />
                break;
            case 'overspeed'://超速统计模块
                content = <OverSpeed />
                break;
            case 'outside'://越界统计模块
                content = <Outside />
                break;
            case 'notreturn'://未入库统计模块
                content = <NotReturn />
                break;
            case 'foulpark'://违规停靠统计模块
                content = <FoulPark />
                break;
            case 'foultask'://无单违规用车统计模块
                content = <FoulTask />
                break;
            case 'foultime'://非规定时段统计模块
                content = <FoulTime />
                break;
            case 'drive'://驾驶统计模块
                content = <Drive />
                break;
            case 'violation'://违章统计模块
                content = <Violation />
                break;
            case 'dataqueryexport'://设备GPS数据查询导出
                content = <DataQueryExport />
                break;
        }
        if(GlobalParam.get("user")) {
            let colMinHeight = $("body").height() - 39;//减去footer的高度
            setTimeout(function(){
                $("div.right_col").css("min-height",colMinHeight);
            });
            return (
                <div className="main_container">
                    <Left pageKey={'statistics'}/>
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

if (location.pathname.indexOf('/statistics') > -1) {
    render(
        <Statistics />,
        $('#main_content')[0]
    )
}