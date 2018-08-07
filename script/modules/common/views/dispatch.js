/**
 * @file 调度管理 Reflux View
 * @author CM 2017.09.13
 */
import React, {Component} from 'react';
import {render} from 'react-dom';

import CommonAction from '../actions/commonAction'
import CommonStore from '../stores/commonStore'
import CommonFun from '../../../common/commonfun'

import Top from 'top';
import Left from 'left';
import Footer from 'footer';
import Loading from 'loading';
import Modal from 'modal';
import Dispatch from '../../dispatch/views/dispatch';
import Apply from '../../dispatch/views/apply';
import Approval from '../../dispatch/views/approval';
import ApplyList from '../../dispatch/views/applyList';
import Control from '../../dispatch/views/control';
import DispatchData from '../../dispatch/views/dispatchData';
import GlobalParam from "../../../common/globalParam";

var DispatchIndex = React.createClass({
    getInitialState: function() {
        return {
            selTabID: '', // 选择的模块ID
        }
    },
    componentDidMount: function () {
        this.unsubscribe = CommonStore.listen(this.onStatusChange);
    },
    componentWillUnmount: function () {
        this.unsubscribe(); //解除监听
    },
    onStatusChange: function (type,data) {
        switch (type){
            case 'switchtab':
                this.listenSwitchTab(data);
                break;
        }
    },
    /**
     * 响应Store switchtab事件，隐藏manage
     *
     * @param {data} 标签页标识
     */
    listenSwitchTab: function(data) {
        this.setState({selTabID: data});
    },
    render: function() {
        let selTabID = '';
        let params = '';
        let content = null;
        if(this.state.selTabID != ''){
            selTabID = this.state.selTabID.toLocaleLowerCase();
        }else{
            if(CommonFun.getQueryString("act") != ''){
                selTabID = CommonFun.getQueryString("act").toLocaleLowerCase();
            }else{
                window.location.href = 'index.html';
            }
            if(CommonFun.getQueryString("params")){
                params = CommonFun.getQueryString("params");
            }
        }
        switch(selTabID){
            case 'dispatch': //调度列表模块
                content = <Dispatch/>
                break;
            case 'apply'://用车申请模块
                content = <Apply/>
                break;
            case 'approval'://用车审批模块
                content = <Approval/>
                break;
            case 'applylist'://用车申请列表模块
                content = <ApplyList/>
                break;
            case 'control'://派遣列表模块
                content = <Control />
                break;
            case 'dispatchdata'://调度数据模块
                content = <DispatchData />
                break;
        }
        if(GlobalParam.get("user")) {
            let colMinHeight = $("body").height() - 39;//减去footer的高度
            setTimeout(function(){
                $("div.right_col").css("min-height",colMinHeight);
            });
            return (
                <div className="main_container">
                    <Left pageKey={'dispatch'}/>
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

if (location.pathname.indexOf('/dispatch') > -1) {
    render(
        <DispatchIndex />,
        $('#main_content')[0]
    )
}