/**
 * @file 机构部门管理 Reflux View
 * @author CM 2017.08.21
 */
import React, { Component } from 'react';
import { render } from 'react-dom';

//公共模块加载
import DepartmentAction from '../actions/departmentAction';
import DepartmentStore from '../stores/departmentStore';
import CommonStore from '../../common/stores/commonStore';

//模块加载
import AgencyAdd from 'agencyAdd';
import DepartmentAdd from 'departmentAdd';

var Department = React.createClass({
    getInitialState:function () {
        return{
            tree_data:null,
            select_data:null,
            select_node:null,
            org_name:'',
            org_short_name:'',
            org_index:'',
            org_code:'',
            org_contact:'',
            org_tel:'',
            org_phone:'',
            org_addr:'',
            org_save_tel:'',
            org_mem:''
        }
    },
    componentDidMount: function () {
        this.initOrgTree();
        DepartmentStore.listen(this.listenFun);
    },
    /**
     * 初始化机构选取树
     */
    initOrgTree:function () {
        DepartmentAction.getdepartment();
    },
    listenFun:function (type, result) {
        let that = this;
        switch (type){
            case "getdepartment":
                that.setState({
                    tree_data:result
                });
                break;
            case "treeselected":
                this.setData(result);
                break;
            case "updateagencysuccess":
                this.initOrgTree();
                this.clearBox();
                break;
            case "updatedepartmentsuccess":
                this.initOrgTree();
                this.clearBox();
                break;
        }
    },
    handleAddAgencyShow:function (event) {
        if(this.state.select_data){
            if(this.state.select_data.type == 1){
                $("#agencyAdd").modal("show");
                $("#parent_id").val(this.state.select_data.id);
            }else{
                toastr.warning("部门为最低阶，无法在其下增加机构!");
            }
        }else{
            toastr.warning("请选择一个机构!");
        }
    },
    handleEditShow:function (event) {
        if(this.state.select_data){
            if(this.state.select_data.type == 1){
                DepartmentStore.trigger("editagency",this.state.select_data);
            }else{
                DepartmentStore.trigger("editdepartment",this.state.select_data);
            }
        }else{
            toastr.warning("请选择一个机构!");
        }
    },
    handleAddDepartment:function (event) {
        if(this.state.select_data){
            if(this.state.select_data.type == 1){
                $("#departmentAdd").modal("show");
                $("#dep_parent_id").val(this.state.select_data.id);
            }else{
                toastr.warning("部门为最低阶，无法在其下增加部门!");
            }
        }else{
            toastr.warning("请选择一个机构!");
        }
    },
    handleDelDepartment:function (event) {
        let that = this;
        if(this.state.select_data){
            CommonStore.trigger("showModal",{msg:"如果删除机构，其下属机构或者部门均会被同时删除，确定是否删除？",btnclShow:true,smallShow:false,callback:function(){
                DepartmentAction.deletedepartment(that.state.select_data.id);
            }});
        }else{
            toastr.warning("请选择一个需要删除的机构或者部门!");
        }

    },
    /**
     * 选中树的时候填充右侧数据
     * @param selRow
     */
    setData:function (selRow) {
        this.clearBox();
        this.setState({
            select_data:null,
            select_node:selRow
        });
        this.findSelectData(this.state.tree_data,selRow.org_id);
        this.setState({
            org_name:!!this.state.select_data.name?this.state.select_data.name:"",
            org_short_name:!!this.state.select_data.short_name?this.state.select_data.short_name:"",
            org_index:!!this.state.select_data.orders?this.state.select_data.orders:"",
            org_code:!!this.state.select_data.post_code?this.state.select_data.post_code:"",
            org_contact:!!this.state.select_data.relation?this.state.select_data.relation:"",
            org_tel:!!this.state.select_data.phone?this.state.select_data.phone:"",
            org_phone:!!this.state.select_data.mobile?this.state.select_data.mobile:"",
            org_addr:!!this.state.select_data.address?this.state.select_data.address:"",
            org_save_tel:!!this.state.select_data.emergency?this.state.select_data.emergency:"",
            org_mem:!!this.state.select_data.texts?this.state.select_data.texts:"",
        });
    },
    clearBox:function () {
        this.setState({
            select_data:null,
            org_name:'',
            org_short_name:'',
            org_index:'',
            org_code:'',
            org_contact:'',
            org_tel:'',
            org_phone:'',
            org_addr:'',
            org_save_tel:'',
            org_mem:'',
        });
    },
    /**
     * 迭代查找选中树的值
     * @param nodes
     * @param id
     */
    findSelectData:function (nodes,id) {
        for(let i = 0; i < nodes.length; i++){
            if(this.state.select_data) break;
            if(nodes[i].id === id){
                this.setState({
                    select_data:nodes[i]
                });
                break;
            }else if(nodes[i].children && nodes[i].children.length > 0){
                this.findSelectData(nodes[i].children, id);
            }
        }
    },
    render:function () {
        return(
            <div className="right_col">
                <div className="page-title" style={{height:"65px"}}>
                    <div className="title_left" style={{marginTop:"5px"}}> <img src={__uri("/static/images/bread-nav.png")} />后台管理 > 机构部门管理 </div>
                    <div className="title_right">
                    </div>
                </div>
                <div style={{width:"80%",margin:"60px auto"}}>
                    <div className="col-md-6">
                        <div className="inst-btnBox" style={{textAlign:"right"}}>
                            <button type="button" className={CommonStore.verifyPermission('org/add')?"btnOne btn-bule":"hide"} onClick={this.handleAddAgencyShow}><i className="icon-bg add-icon"></i>新增机构</button>
                            <button type="button" className={CommonStore.verifyPermission('org/add')?"btnOne btn-green":"hide"} onClick={this.handleAddDepartment}><i className="icon-bg addUser-icon"></i>新增部门</button>
                            <button type="button" className={CommonStore.verifyPermission('org/modify')?"btnOne btn-orange":"hide"} onClick={this.handleEditShow}><i className="icon-bg modify-icon"></i>修改</button>
                            <button type="button" className={CommonStore.verifyPermission('org/del')?"btnOne btn-gray":"hide"} onClick={this.handleDelDepartment}><i className="icon-bg delAcc-icon"></i>删除</button>
                        </div>
                        <div style={{maxHeight:"441px",overflow:"scroll"}} className="white-bg inst-conBox" id="org_list">
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="white-bg inst-conBox">
                            <ul className="inst-form-con">
                                <li><span className="span">机构名称：</span><input type="text" id="org_name_show" value={this.state.org_name} readOnly /></li>
                                <li><span className="span">机构简称：</span><input type="text" id="org_short_name_show" value={this.state.org_short_name} readOnly /></li>
                                <li><span className="span">排序号：</span><input type="text" id="org_index_show" value={this.state.org_index} readOnly /></li>
                                <li><span className="span">邮编：</span><input type="text" id="org_code_show" value={this.state.org_code} readOnly /></li>
                                <li><span className="span">联系人：</span><input type="text" id="org_contact_show" value={this.state.org_contact} readOnly /></li>
                                <li><span className="span">办公室电话：</span><input type="text" id="org_tel_show" value={this.state.org_tel} readOnly /></li>
                                <li><span className="span">移动电话：</span><input type="text" id="org_phone_show" value={this.state.org_phone} readOnly /></li>
                                <li><span className="span">地址：</span><input type="text" id="org_addr_show" value={this.state.org_addr} readOnly /></li>
                                <li><span className="span">保险救援电话：</span><input type="text" id="org_save_tel_show" value={this.state.org_save_tel} readOnly /></li>
                                <li><span className="span">备注：</span><input type="text" id="org_mem_show" value={this.state.org_mem} readOnly /></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <AgencyAdd />
                <DepartmentAdd />
            </div>
        )
    }
});

export default Department;
