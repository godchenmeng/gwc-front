/**
 * @file 短信设置  该组件不符合需求，现在没有用了  2017.10.31
 * @author CM 2017.08.23
 */

import React, { Component } from 'react'
import { render } from 'react-dom'

import SmsAction from '../actions/smsAction';
import SmsStore from  '../stores/smsStore';
import BootstrapTree from '../../../common/bootstrapTree';

var SmsSet = React.createClass({
    getInitialState: function() {
        return{
            isOrg:true,
            isCustom:false,
            select_reciver:[],
        }
    },
    componentDidMount: function () {
        SmsAction.getuserorg();
        SmsStore.listen(this.listenFun);
    },
    listenFun:function (type,result) {
        switch (type){
            case "setchecked":
                this.setCheckedReciver(result);
                break;
        }
    },
    setCheckedReciver:function (nodes) {
        let tmpSel = [];
        for(let i = 0; i < nodes.length; i++){
            tmpSel.push(nodes[i].org_id);
        }
        this.setState({
            select_reciver:tmpSel
        });
    },
    handleSaveSmsSet:function (event) {

    },
    handleSelectReciver:function (event) {
        if(event.target.selectedIndex == 0){
            this.setState({
                isOrg:true,
                isCustom:false,
            });
        }else{
            this.setState({
                isOrg:false,
                isCustom:true,
            });
        }
    },
    render: function () {
        return (
            <div className="modal fade bs-example-modal-lg" id="smsSet">
                <form id="sms_set_form">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title">自动发送开关设置</h4>
                            </div>
                            <div className="modal-body">
                                <div className="mesSet-box">
                                    选择发送对象
                                    <select className="ml-10" onChange={this.handleSelectReciver} id="reciver">
                                        <option value="1">机构部门人员</option>
                                        <option value="2">自定义号码</option>
                                    </select>
                                    <div id="org_member_tree" style={{maxHeight:"290px",width:"250px",overflowY:"scroll",float:"right"}} className={this.state.isOrg ? "" : "hide"}></div>
                                    <div id="sendphones_div" style={{width:"250px",float:"right"}} className={this.state.isCustom ? "" : "hide"}>
                                        <input type="text" name="sendphones" style={{width:"225px"}} placeholder="可任意设置多个号码，以“,”分隔" />
                                    </div>
                                    <ul className="mesSet-con">
                                        <li>超速<label className="f-r"><input className="mui-switch mui-switch-anim" type="checkbox" /></label></li>
                                        <li>越界<label className="f-r"><input className="mui-switch mui-switch-anim" type="checkbox" /></label></li>
                                        <li>违章<label className="f-r"><input className="mui-switch mui-switch-anim" type="checkbox" /></label></li>
                                        <li>设备拔插<label className="f-r"><input className="mui-switch mui-switch-anim" type="checkbox" /></label></li>
                                        <li>非规定时间<label className="f-r"><input className="mui-switch mui-switch-anim" type="checkbox" /></label></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.handleSaveSmsSet}>保 存</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
});

export default SmsSet;