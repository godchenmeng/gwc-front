/**
 * @file 角色管理台Reflux Store
 * @author CM 2017.08.22
 */

import RoleAction from '../actions/roleAction';
import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';
import BootstrapTree from '../../../common/bootstrapTree';
import CommonStore from '../../common/stores/commonStore';

var RoleStore = Reflux.createStore({
    listenables: [RoleAction],
    init: function () {
    },
    data: {
        roleColumns:[{
            field: '',
            checkbox: true,
            align: 'center',
            valign: 'middle',
            width:'5%',
        },{
            field:'name',
            title:'角色名称',
            align:'center',
            valign:'middle',
            width:'30%',
        },{
            field:'descr',
            title:'角色描述',
            align:'center',
            valign:'middle',
            width:'50%',
        },{
            field:'status',
            title:'状态',
            align:'center',
            valign:'middle',
            width:'10%',
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
            width:'5%',
            events:{
                'click .edit': function (e, value, row, index) {
                    let param = {rid : row.id};
                    Urls.post(Urls.loadrolepermission,param,function (result) {
                        if(result.responseCode=="1"&&result.responseMsg=="success"){
                            RoleStore.trigger("editrole",row);
                            let pids = [];
                            for(let i = 0; i < result.datas.length; i++){
                                pids.push(result.datas[i].pid);
                            }
                            BootstrapTree.setNodeCheckByOrgID("role_tree",pids);

                        }else{
                            toastr.error(result.responseMsg);
                        }
                    })
                },
                'click .delete': function(e, value, row, index){
                    CommonStore.trigger("showModal",{msg:"是否确认删除角色?",btnclShow:true,callback:function(){
                        let param = {
                            ids:[row.id]
                        }
                        Urls.post(Urls.deleterole,param,function (result) {
                            if(result.responseCode=="1" && result.responseMsg=="success"){
                                RoleStore.onGetrolelist(null);
                                toastr.success("删除角色成功!");
                            }else{
                                toastr.error(result.responseMsg);
                            }
                        })
                    }});
                }
            },
            formatter:function (value,row,index) {
                let editClass = CommonStore.verifyPermission('role/update')?'edit':'hide';
                let deleteClass = CommonStore.verifyPermission('role/delete')?'delete':'hide';
                return "<div class=\"action-icon1\"><a class="+editClass+" title=\"编辑\"></a><a class="+deleteClass+" title=\"删除\"></a></div>";
            }
        }]
    },
    /**
     * 响应 Action getrolelist 获取角色列表
     * @param queryParam
     */
    onGetrolelist:function (queryParam) {
        let that = this;
        if(queryParam){
            BootstrapTable.initTable("role_list_table", 10, [10, 20], Urls.loadrolelist, that.data.roleColumns, queryParam, Urls.post, that.onRoleTableLoadSuccess, CommonStore.verifyPermission('role/delete'));
        }else{
            BootstrapTable.render("role_list_table");
        }
    },
    /**
     * 响应 Action getpermissionlist 获取权限列表
     */
    onGetpermissionlist:function () {
        let that = this;
        Urls.get(Urls.loadpermissionlist,{},function(data){
            BootstrapTree.initTree("role_tree", data, null, null, that, true, false);
        });
    },
    /**
     * 响应 Action addrole新增角色
     * @param role
     */
    onAddrole:function (role) {
        let that = this;
        Urls.post(Urls.addrole,role,function (result) {
            if(result.responseCode=="1" && result.responseMsg=="success"){
                that.onGetrolelist(null);
                that.trigger("updaterolesuccess");
                toastr.success("添加角色成功!");
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    /**
     * 响应 Action editrole更新角色
     * @param role
     */
    onUpdaterole:function (role) {
        let that = this;
        Urls.post(Urls.updaterole,role,function (result) {
            if(result.responseCode=="1" && result.responseMsg=="success"){
                that.onGetrolelist(null);
                that.trigger("updaterolesuccess");
                toastr.success("修改角色成功!");
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    onRoleTableLoadSuccess:function () {
        let that = this;
        $("#mutli_del").on('click',function () {
            let selIDs = [];
            let selRow = BootstrapTable.getSelected("role_list_table");
            if(selRow.length < 1){
                toastr.warning("请选择需要删除的记录");
                return;
            }
            for(let i = 0; i < selRow.length; i++){
                selIDs.push(selRow[i].id);
            }
            CommonStore.trigger("showModal",{msg:"是否确认删除角色？",btnclShow:true,callback:function(){
                let param = {
                    ids:selIDs
                }
                Urls.post(Urls.deleterole,param,function (result) {
                    if(result.responseCode=="1" && result.responseMsg=="success"){
                        that.onGetrolelist(null);
                        toastr.success("删除角色成功!");
                    }else{
                        toastr.error(result.responseMsg);
                    }
                })
            }});
        });
    },
});

export default RoleStore