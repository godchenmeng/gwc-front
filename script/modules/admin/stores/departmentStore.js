/**
 * @file 机构部门管理台Reflux Store
 * @author CM 2017.08.21
 */

import DepartmentAction from '../actions/departmentAction';
import Urls from '../../../common/urls';
import BootstrapTree from '../../../common/bootstrapTree';

var DepartmentStore = Reflux.createStore({
    listenables: [DepartmentAction],
    init: function () {
    },
    data: {},
    /**
     * 响应 Action getdepartment 获取机构部门列表
     */
    onGetdepartment:function () {
        let that = this;
        Urls.get(Urls.loadorgtree,{},function(data){
            that.trigger("getdepartment",data);
            BootstrapTree.initTree("org_list", data, null, null, that);
            BootstrapTree.expandTree("org_list");
        });
    },
    /**
     * 响应 Action addagency 新增机构
     * @param agency
     */
    onAddagency:function (agency) {
        let that = this;
        Urls.post(Urls.adddepartment,agency,function (result) {
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                toastr.success("新增机构成功");
                that.trigger("updateagencysuccess",agency);
            }else{
                toastr.error(result.responseMsg);
            }
        });
    },
    /**
     * 响应 Action updateagency 修改机构
     * @param agency
     */
    onUpdateagency:function (agency) {
        let that = this;
        Urls.post(Urls.updatedepartment,agency,function (result) {
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                toastr.success("更新机构成功");
                that.trigger("updateagencysuccess",agency);
            }else{
                toastr.error(result.responseMsg);
            }
        });
    },
    /**
     * 响应 Action adddepartment 新增部门
     * @param department
     */
    onAdddepartment:function (department) {
        let that = this;
        Urls.post(Urls.adddepartment,department,function (result) {
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                toastr.success("新增部门成功");
                that.trigger("updatedepartmentsuccess",department);
            }else{
                toastr.error(result.responseMsg);
            }
        });
    },
    /**
     * 响应 Action updatedepartment 修改部门
     * @param department
     */
    onUpdatedepartment:function (department) {
        let that = this;
        Urls.post(Urls.updatedepartment,department,function (result) {
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                toastr.success("更新部门成功");
                that.trigger("updatedepartmentsuccess",department);
            }else{
                toastr.error(result.responseMsg);
            }
        });
    },
    /**
     * 响应 Action deletedepartment 删除机构部门
     * @param id
     */
    onDeletedepartment:function (id) {
        let that = this;
        let param = {
            id:id
        }
        Urls.post(Urls.deldepartment,param,function (result) {
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                that.trigger("updatedepartmentsuccess");
                toastr.success("删除机构/部门成功");
            }else{
                toastr.error(result.responseMsg);
            }
        });
    }
});

export default DepartmentStore