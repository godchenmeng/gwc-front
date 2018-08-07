/**
 * @file 页面主 Reflux View
 * @author CM 2017.07.20
 */
import React, {Component} from 'react';
import {render} from 'react-dom';

import Top from 'top';
import Left from 'left';
import Footer from 'footer';
import Main from 'main';
import Loading from 'loading';
import Modal from 'modal';
import GlobalParam from "../../../common/globalParam";

let MainContent = React.createClass({
    render: function() {
        let colMinHeight = $("body").height() - 39;//减去footer的高度
        setTimeout(function(){
            $("div.right_col").css("min-height",colMinHeight);
        });
        return (
            <div className="main_container">
                <Left/>
                <Top />
                <Main />
                <Footer/>
                <Loading/>
                <Modal/>
            </div>
        );
    }
});

if (location.pathname.indexOf('/index') > -1 || location.pathname === '/') {
    if(GlobalParam.get("user")) {
        render(
            <MainContent/>,
            $('#main_content')[0]
        )
    }else{
        window.location.href = 'login.html'
    }
}

