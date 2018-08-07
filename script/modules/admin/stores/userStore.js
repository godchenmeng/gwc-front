/**
 * @file 用户管理台Reflux Store
 * @author CM 2017.08.15
 */
import UserAction from '../actions/userAction';

import CommonStore from '../../common/stores/commonStore';

import CommonFun from '../../../common/commonfun';
import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';


var UserStore = Reflux.createStore({
    listenables: [UserAction],
    init: function() {
    },
    data: {
        userColumns:[{
            field: '',
            checkbox: true,
            align: 'center',
            valign: 'middle'
        },{
            field:'name',
            title:'用户姓名',
            align:'center',
            valign:'middle'
        },{
            field:'sex',
            title:'性别',
            align:'center',
            valign:'middle',
            formatter:function (value,row,index) {
                switch (value){
                    case "1":
                        return "男";
                        break;
                    case "2":
                        return "女";
                        break;
                }
            }
        },{
            field:'code',
            title:'工号',
            align:'center',
            valign:'middle',
        },{
            field:'oname',
            title:'单位名称',
            align:'center',
            valign:'middle'
        },{
            field:'phone',
            title:'工作电话',
            align:'center',
            valign:'middle',
        },{
            field:'mobile',
            title:'手机号',
            align:'center',
            valign:'middle',
        },{
            field:'status',
            title:'状态',
            align:'center',
            valign:'middle',
            formatter:function (value,row,index) {
                switch (value){
                    case "1":
                        return "使用";
                        break;
                    case "2":
                        return "不使用";
                        break;
                }
            }
        },{
            field:'rname',
            title:'角色描述',
            align:'center',
            valign:'middle',
            formatter:function (value,row,index) {
                if(value){
                    return value;
                }else{
                    return "未注册账号";
                }
            }
        },{
            field:'createdate',
            title:'创建时间',
            align:'center',
            valign:'middle',
            formatter:function (value,row,index) {
                return CommonFun.getLocalTime(value / 1000);
            }
        },{
            field:'op',
            title:'操作',
            align:'center',
            valign:'middle',
            events:{
                'click .edit': function (e, value, row, index) {
                    UserStore.trigger("edituser",row);
                },
                'click .delete': function(e, value, row, index){
                    CommonStore.trigger("showModal",{msg:"是否删除用户？",btnclShow:true,callback:function(){
                        let param = {
                            ids:[row.id]
                        }
                        Urls.post(Urls.deluser,param,function (result) {
                            if(result.responseCode=="1" && result.responseMsg=="success"){
                                UserStore.onGetuserlist(null);
                                toastr.success("删除用户成功!");
                            }else{
                                toastr.error(result.responseMsg);
                            }
                        })
                    }});
                }
            },
            formatter:function (value,row,index) {
                let editClass = CommonStore.verifyPermission('member/update')?'edit':'hide';
                let deleteClass = CommonStore.verifyPermission('member/delete')?'delete':'hide';
                return "<div class=\"action-icon1\" style=\"width:100%\"><a class="+editClass+" title=\"编辑\"></a><a class="+deleteClass+" title=\"删除\"></a></div>";
            }
        }],
        accountColumns:[{
            field: '',
            checkbox: true,
            align: 'center',
            valign: 'middle'
        },{
            field:'user_name',
            title:'用户姓名',
            align:'center',
            valign:'middle'
        },{
            field:'name',
            title:'登录用户名',
            align:'center',
            valign:'middle',
        },{
            field:'oname',
            title:'所属机构',
            align:'center',
            valign:'middle',
        },{
            field:'app',
            title:'登录APP',
            align:'center',
            valign:'middle',
            formatter:function (value,row,index) {
                switch (value){
                    case "1":
                        return "能";
                        break;
                    case "2":
                        return "不能";
                        break;
                    default:
                        return "不能";
                }
            }
        },{
            field:'web',
            title:'登录WEB',
            align:'center',
            valign:'middle',
            formatter:function (value,row,index) {
                switch (value){
                    case "1":
                        return "能";
                        break;
                    case "2":
                        return "不能";
                        break;
                    default:
                        return "不能";
                }
            }
        },{
            field:'leader',
            title:'是否领导',
            align:'center',
            valign:'middle',
            formatter:function (value,row,index) {
                switch (value){
                    case "1":
                        return "是";
                        break;
                    case "2":
                        return "不是";
                        break;
                    default:
                        return "不是";
                }
            }
        },{
            field:'status',
            title:'状态',
            align:'center',
            valign:'middle',
            formatter:function (value,row,index) {
                switch (value){
                    case "1":
                        return "使用";
                        break;
                    case "2":
                        return "不使用";
                        break;
                }
            }
        },{
            field:'op',
            title:'操作',
            align:'center',
            valign:'middle',
            events:{
                'click .edit': function (e, value, row, index) {
                    UserStore.trigger("editaccount",row);
                },
                'click .delete': function(e, value, row, index){
                    CommonStore.trigger("showModal",{msg:"是否删除账号？",btnclShow:true,callback:function(){
                        let param = {
                            ids:[row.id]
                        }
                        Urls.post(Urls.delaccount,param,function (result) {
                            if(result.responseCode=="1" && result.responseMsg=="success"){
                                UserStore.onGetaccountlist(null);
                                toastr.success("删除账号成功!");
                            }else{
                                toastr.error(result.responseMsg);
                            }
                        })
                    }});
                }
            },
            formatter:function (value,row,index) {
                let editClass = CommonStore.verifyPermission('user/modify')?'edit':'hide';
                let deleteClass = CommonStore.verifyPermission('user/delete')?'delete':'hide';
                return "<div class=\"action-icon1\" style=\"width:100%\"><a class="+editClass+" title=\"编辑\"></a><a class="+deleteClass+" title=\"删除\"></a></div>";
            }
        }],
    },
    /**
     * 响应Action getuserllist 获取用户列表
     * @param queryParam 查询条件
     */
    onGetuserlist:function (queryParam) {
        let that = this;
        if(queryParam){
            BootstrapTable.initTable("user_list_table", 10, [10, 20], Urls.loaduserlist, that.data.userColumns, queryParam, Urls.post, that.onUserTableLoadSuccess, CommonStore.verifyPermission('member/delete'));
        }else{
            BootstrapTable.render("user_list_table");
        }
    },
    /**
     * 响应 Action adduser 新增用户
     * @param user
     */
    onAdduser:function (user) {
        let that = this;
        Urls.post(Urls.adduser,user,function (result) {
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                that.onGetuserlist(null);
                $("#userAdd").modal("hide");
                toastr.success("新增用户成功!");
                that.trigger('updateusersuccess',null);
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    /**
     * 响应 Action updateuser 更新用户信息
     * @param user
     */
    onUpdateuser:function (user) {
        let that = this;
        Urls.post(Urls.updateuser,user,function (result) {
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                that.onGetuserlist(null);
                $("#userAdd").modal("hide");
                toastr.success("编辑用户成功!");
                that.trigger('updateusersuccess',null);
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    /**
     * 表格加载成功以后触发的事件
     */
    onUserTableLoadSuccess:function () {
        let that = this;
        $("#mutli_del").on('click',function () {
            let selIDs = [];
            let selRow = BootstrapTable.getSelected("user_list_table");
            if(selRow.length < 1){
                toastr.warning("请选择要删除的记录");
                return;
            }
            for(let i = 0; i < selRow.length; i++){
                selIDs.push(selRow[i].id);
            }
            CommonStore.trigger("showModal",{msg:"是否确认删除?",btnclShow:true,callback:function(){
                let param = {
                    ids:selIDs
                }
                Urls.post(Urls.deluser,param,function (result) {
                    if(result.responseCode=="1" && result.responseMsg=="success"){
                        that.onGetuserlist(null);
                        toastr.success("删除用户成功!");
                    }else{
                        toastr.error(result.responseMsg);
                    }
                })
            }});
        });
    },
    /**
     * 响应 Action addaccount 新增账号
     * @param account
     */
    onAddaccount:function (account) {
        let that = this;
        Urls.post(Urls.addaccount,account,function (result) {
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                that.onGetuserlist(null);
                $("#accountAdd").modal("hide");
                toastr.success("新增账号成功!");
                that.trigger('updateaccountsuccess',null);
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    /**
     * 响应 Action adduseraccount 新增用户账号
     * @param userAccount
     */
    onAdduseraccount:function (userAccount) {
        let that = this;
        Urls.post(Urls.adduseraccount,userAccount,function (result) {
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                that.onGetuserlist(null);
                $("#userAccountAdd").modal("hide");
                toastr.success("新增用户和账号成功!");
                that.trigger('adduseraccountsuccess',null);
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    /**
     * 响应Action getaccountlist 获取用户列表
     * @param queryParam 查询条件
     */
    onGetaccountlist:function (queryParam) {
        let that = this;
        if(queryParam){
            BootstrapTable.initTable("account_list_table", 10, [10, 20], Urls.loadaccountlist, that.data.accountColumns, queryParam, Urls.post, that.onAccountTableLoadSuccess, CommonStore.verifyPermission('user/delete'));
        }else{
            BootstrapTable.render("account_list_table");
        }
    },
    /**
     * 表格加载成功以后触发的事件
     */
    onAccountTableLoadSuccess:function () {
        let that = this;
        $("#mutli_del").on('click',function () {
            let selIDs = [];
            let selRow = BootstrapTable.getSelected("account_list_table");
            if(selRow.length < 1){
                toastr.warning("请选择需要删除的记录！");
                return;
            }
            for(let i = 0; i < selRow.length; i++){
                selIDs.push(selRow[i].id);
            }
            CommonStore.trigger("showModal",{msg:"是否确认删除账号?",btnclShow:true,callback:function(){
                let param = {
                    ids:selIDs
                }
                Urls.post(Urls.delaccount,param,function (result) {
                    if(result.responseCode=="1" && result.responseMsg=="success"){
                        that.onGetaccountlist(null);
                        toastr.success("删除账号成功!");
                    }else{
                        toastr.error(result.responseMsg);
                    }
                })
            }});
        });
    },
    /**
     * 修改密码
     * @param id 账号ID
     * @param password 新密码
     */
    onChangepassword:function (id,password,modal) {
        let that = this;
        let param = {
            id : id,
            password : password
        }
        Urls.post(Urls.changepassword,param,function (result) {
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                $("#" + modal).modal("hide");
                that.trigger("changepwsuccess");
                toastr.success("重置成功!");
            }else{
                toastr.error(result.responseMsg);
            }
        });
    },
    /**
     * 更新账号信息
     * @param account
     */
    onUpdateaccount:function (account) {
        let that = this;
        Urls.post(Urls.updateaccount,account,function (result) {
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                that.onGetaccountlist(null);
                $("#accountAdd").modal("hide");
                toastr.success("编辑账号成功!");
                that.trigger('updateaccountsuccess',null);
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    /**
     * 获取用户短信角色
     * @param selectId select标签id
     */
    initSmsRoleSelect:function (selectId) {
        let param = {};
        Urls.get(Urls.loadsmsrole,param,function (result) {
            let smsRoleSelecter = $("#"+selectId);
            for(let i = 0; i < result.length; i++){
                smsRoleSelecter.append("<option value='" + result[i].id + "'>" + result[i].name + "</option>");
            }
        })
    },
});

export default UserStore