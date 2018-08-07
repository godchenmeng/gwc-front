/**
 * @file 短信角色管理 Reflux Store
 * @author Banji 2017.10.30
 */

import SmsRoleAction from '../actions/smsRoleAction';

import CommonStore from '../../common/stores/commonStore';

import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';

var SmsRoleStore = Reflux.createStore({
    listenables: [SmsRoleAction],
    init: function () {
    },
    data: {
        smsRoleColumns:[{
            field: '',
            checkbox: true,
            align: 'center',
            valign: 'middle',
            width:'5%',
        },{
            field:'name',
            title:'短信角色名称',
            align:'center',
            valign:'middle',
            width:'30%'
        },{
            field:'descr',
            title:'短信角色描述',
            align:'center',
            valign:'middle',
            width:'30%'
        },{
            field:'status',
            title:'状态',
            align:'center',
            valign:'middle',
            width:'20%',
            formatter:function (value,row,index) {
                switch (value){
                    case "1":
                        return "使用";
                        break;
                    case "2":
                        return "未使用";
                        break;
                    default:
                        return "未知状态";
                }
            }
        },{
            field:'op',
            title:'操作',
            align:'center',
            valign:'middle',
            width:'15%',
            events: {
                'click .edit': function(e, value, row, index) {//编辑
                    $("#smsRoleAdd").modal("show");
                    SmsRoleStore.trigger("updateSmsRole",row);
                },
                'click .delete': function(e, value, row, index) {//删除
                    CommonStore.trigger("showModal",{msg:"您确认要删除这个短信角色吗？",btnclShow:true,callback:function(){
                        let ids = [row.id];
                        SmsRoleAction.deleteSmsRole({ids:ids});
                    }});
                }
            },
            formatter : function (value,row,index){
                let opHTML = '<div class="action-icon1" style="width:100%">';
                // if(CommonStore.verifyPermission('smsrole/open')){//这里应该有一个快捷修改，角色使用状态的按钮
                //     if(row.status == 1){
                //         opHTML += '<label><input class="mui-switch mui-switch-anim" id="isOpen" type="checkbox" checked></label>';
                //     }else{
                //         opHTML += '</label><input class="mui-switch mui-switch-anim" id="isOpen" type="checkbox"></label>';
                //     }
                // }
                if(CommonStore.verifyPermission('smsrole/update')) opHTML += '<a class="edit" title="编辑"/>';
                if(CommonStore.verifyPermission('smsrole/delete')) opHTML += '&nbsp;&nbsp;<a class="delete" id="isDelete" title="删除"></a>';
                opHTML += '</div>';
                return opHTML;
            }
        }]
    },
    /**
     * 响应 Action getSmsRoleList 获取短信角色列表
     * @param param
     */
    onGetSmsRoleList:function (param) {
        let that = this;
        if(param){
            BootstrapTable.initTable("sms_role_list_table", 10, [10, 20], Urls.loadsmsrolelist, that.data.smsRoleColumns, param, Urls.post);
        }else{
            BootstrapTable.render("sms_role_list_table");
        }
    },
    /**
     * 响应 Action addSmsRole 新增短信角色
     */
    onAddSmsRole:function (params) {
        let that = this;
        Urls.post(Urls.addsmsrole,params,function(result){
            if(result.responseCode == '1' && result.responseMsg == "success"){
                toastr.success("新增成功");
                that.onGetSmsRoleList(null);
                $("#smsRoleAdd").modal("hide");
            } else {
                toastr.error(result.responseMsg);
            }
        })
    },
    /**
     * 响应 Action updateSmsRole 修改短信角色
     */
    onUpdateSmsRole:function (params,callBakFun) {
        let that = this;
        Urls.post(Urls.updatesmsrole,params,function(result){
            if(result.responseCode == '1' && result.responseMsg == "success"){
                toastr.success("编辑成功");
                that.onGetSmsRoleList(null);
                if(!!callBakFun) callBakFun();
            } else {
                toastr.error(result.responseMsg);
            }
        })
    },
    /**
     * 响应 Action deleteSmsRole 删除短信角色
     */
    onDeleteSmsRole:function (params) {
        let that = this;
        Urls.post(Urls.deletesmsrole,params,function(result){
            if(result.responseCode == '1' && result.responseMsg == "success"){
                toastr.success("删除成功");
                that.onGetSmsRoleList(null);
            } else {
                toastr.error(result.responseMsg);
            }
        })
    },
});

export default SmsRoleStore