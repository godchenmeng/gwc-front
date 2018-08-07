/**
 * @file 切换功能Slidebar
 * @author CM 2017.07.20
 */

import React, { Component } from 'react'
import { render } from 'react-dom'
import CommonAction from '../actions/commonAction'
import Urls from '../../../common/urls';
import GlobalParam from '../../../common/globalParam';

var Slidebar = React.createClass({
    getInitialState: function() {
        return {
            currentIndex: -1,//当前模块
            tabsChildIsShow: false,
            tabsArray:[]//模块数组
        };
    },
    componentDidMount: function () {
        this.setData();
    },
    setData: function() {
        var that = this;
        var params = {};
        //存储周期超过1天重新获取
        var menu = GlobalParam.getExpire("menu", 24 * 60 * 60 * 1000);
        if(menu){
            that.setState({tabsArray: menu});
        }else{
            Urls.get(Urls.loadmenu,params,function (data) {
                that.setState({tabsArray: data.datas});
                GlobalParam.set("menu",data.datas);
            })
        }
    },
    render: function () {
        var that = this;
        let tabsArray = that.state.tabsArray;
        let currentKey = this.props.pageKey ? this.props.pageKey : '';
        return (
            <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
                <div className="menu_section">
                    <ul className="nav side-menu">
                        <li className={currentKey == ''?'active':''}>
                            <a onClick={ () => { window.location.href='index.html'} }>
                                <i className='fa fa-home'></i><span className="show1">首页</span><span className="show2">首页</span>
                            </a>
                            <span className="dot-left"></span>
                        </li>
                {
                    tabsArray.map(function(item, key){
                        return (
                            <li className={item.url === currentKey?'active':''} key={key}>
                                <a key={key} onClick={ () => { (that.state.tabsChildIsShow === true && that.state.currentIndex === key) ? that.setState({tabsChildIsShow : false}) : that.setState({tabsChildIsShow : true});that.setState({currentIndex : key});} }>
                                {/*<a key={key} onMouseEnter={() => {console.log(key);that.setState({tabsChildIsShow : true,currentIndex:key});}} onMouseLeave={() => {that.setState({tabsChildIsShow : false});}}>*/}
                                    <i className={item.key == 1 ? 'fa path2': item.key == 2 ? 'fa path3' : item.key == 3 ? 'fa path4' : item.key == 4 ? 'fa path5' : item.key == 5 ? 'fa path6' : 'fa path7'}></i><span className="show1">{item.name}</span><span className="show2">{item.name+"管理"}</span> <span className="fa fa-chevron-down"></span>
                                </a>
                                <ul className={(key === that.state.currentIndex && that.state.tabsChildIsShow) ? 'nav child_menu_show':'nav child_menu'}>
                                {/*<ul className={(key === that.state.currentIndex && that.state.tabsChildIsShow) ? 'nav child_menu_show':'nav child_menu'} onMouseEnter={() => {that.setState({tabsChildIsShow : true});}} onMouseLeave={() => {that.setState({tabsChildIsShow : false});}}>*/}
                                    {
                                    item.children.map(function (cItem, cKey) {
                                        return (<li key={cKey}><a key={cKey} onClick={ () => {that.setState({tabsChildIsShow : false});window.location.href=cItem.url + '?act=' + cItem.key} }>{cItem.name}</a></li>)
                                    })
                                }
                                </ul>
                            </li>
                        )
                    })
                }
                    </ul>
                </div>
            </div>
        )
    }
});

export default Slidebar;
