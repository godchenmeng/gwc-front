/**
 * @file 驾驶员管理Reflux Store
 * @author XuHong 2017.09.09
 */

import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';
import Commonfun from '../../../common/commonfun'

import CommonStore from '../../common/stores/commonStore';

import DriverAction from "../actions/driverAction";

var DriverStore = Reflux.createStore({
    listenables: [DriverAction],
    data: {
        columns: [{
            field: 'select',
            checkbox: true,
            align: 'center',
            valign: 'middle'
        },{
            field: 'oname',
            title: '单位名称',
            align: 'center',
            valign: 'middle'
        },{
            field: 'name',
            title: '驾驶员姓名',
            align: 'center',
            valign: 'middle'
        },{
            field: 'sex',
            title: '性别',
            align: 'center',
            valign: 'middle',
            formatter: function(value, row, index) {
                var results = {'1':'男','2':'女'};
                return !value ? '-' : !results[value] ? '-' : results[value];
            }
        },{
            field: 'birth',
            title: '出生日期',
            align: 'center',
            valign: 'middle'
        },{
            field: 'mobile',
            title: '手机号',
            align: 'center',
            valign: 'middle'
        },{
            field: 'arrive',
            title: '到岗时间',
            align: 'center',
            valign: 'middle'
        },{
            field: 'driver_no',
            title: '驾驶证号',
            align: 'center',
            valign: 'middle'
        },{
            field: 'driver_type',
            title: '准驾车型',
            align: 'center',
            valign: 'middle'
        },{
            field: 'd_status',
            title: '工作状态',
            align: 'center',
            valign: 'middle',
            formatter: function(value,row,index) {
                var results = {'1':'在岗','2':'公休','3':'长期事假','4':'长期病假','5':'待岗'};
                return !value ? '-' : !results[value] ? '-' : results[value];
            }
        },{
            field: 'operate',
            title: '操作',
            align: 'center',
            valign: 'middle',
            formatter: function(value,row,index) {
                let html = [];
                html.push('<div class="action-icon1" style="width: 100%;">');
                if(CommonStore.verifyPermission('driver/modify')) html.push('<a class="edit" title="编辑"/>');
                html.push('<a class="details-icon" title="详情"/>');
                if(CommonStore.verifyPermission('driver/work')) html.push('<a class="WorkState" title="工作状态管理"></a>');
                html.push('</div>');
                return html.join('');
            },
            events: {
                'click .edit': function(e, value, row, index) {
                    DriverStore.trigger('driverUpdateEvent', row);
                    $("#driver_oper_modal").modal("show");
                },
                'click .details-icon': function(e, value, row, index) {
                    DriverStore.trigger('driverDetailEvent', row);
                    $("#driver_detail_modal").modal("show");
                },
                'click .WorkState': function(e, value, row, index) {
                    DriverStore.trigger('driverStatusEvent', row);
                    $("#driver_status_modal").modal("show");
                }
            }
        }],
        queryParams: function(params) {
            var param = {
                driver_name: $("#q_driver_name").val(),
                driver_no: $("#q_driver_no").val(),
                driver_type: $("#q_driver_type").val()=='-1'?"":$("#q_driver_type").val(),
                limit: params.limit,
                pageIndex: this.pageNumber - 1
            };

            return param;
        }
    },
    memberData: {
        columns: [{
            field: 'select',
            radio: true,
            align: 'center',
            valign: 'middle'
        },{
            field: 'name',
            title: '人员姓名',
            align: 'center',
            valign: 'middle'
        },{
            field: 'sex',
            title: '性别',
            align: 'center',
            valign: 'middle',
            formatter: function(value, row, index) {
                var results = {'1':'男','2':'女'};
                return !value ? '-' : !results[value] ? '-' : results[value];
            }
        },{
            field: 'birth',
            title: '出生日期',
            align: 'center',
            valign: 'middle',
            formatter: function(value, row, index) {
                return !value ? '-' :Commonfun.getCurrentDate(new Date(parseInt(value)));
            }
        },{
            field: 'card',
            title: '身份证号',
            align: 'center',
            valign: 'middle'
        },{
            field: 'mobile',
            title: '手机号',
            align: 'center',
            valign: 'middle'
        },{
            field: 'oname',
            title: '机构/部门名称',
            align: 'center',
            valign: 'middle'
        }],
        queryParams: function(params) {
            var param = {
                name: $("#member_name").val(),
                limit: params.limit,
                pageIndex: this.pageNumber - 1
            };

            return param;
        }
    },
    /**
     * 响应Action getDriverList获取驾驶员信息列表
     */
    onGetDriverList: function() {
        $("#driver_table").bootstrapTable("refresh");
    },
    /**
     * 响应Action getMemberList获取用户列表中的驾驶员列表
     */
    onGetMemberList: function() {
        $("#member_driver_table").bootstrapTable("refresh");
    },
    /**
     * 响应Action addDriver新增驾驶员
     */
    onAddDriver: function(driver) {
        var that = this;
        Urls.post(Urls.addDriver,driver,function(data) {
            if(data.responseCode=="1" && data.responseMsg=="success"){
                $("#driver_oper_modal").modal('hide');
                that.onGetDriverList();
                toastr.success("新增驾驶员成功!");
            }else{
                toastr.error(data.responseMsg);
            }
        });
    },
    /**
     * 响应Action updateDriver更新驾驶员信息
     */
    onUpdateDriver: function(driver) {
        var that = this;
        Urls.post(Urls.updateDriver,driver,function(data) {
            if(data.responseCode=="1" && data.responseMsg=="success"){
                $("#driver_oper_modal").modal('hide');
                that.onGetDriverList();
                toastr.success("更新驾驶员信息成功!");
            }else{
                toastr.error(data.responseMsg);
            }
        });
    },
    /**
     * 响应Action updateDriverStatus更新驾驶员工作状态
     */
    onUpdateDriverStatus: function(driverStatus) {
        var that = this;
        Urls.post(Urls.updateDriverStatus,driverStatus,function(data) {
            if(data.responseCode=="1" && data.responseMsg=="success"){
                $("#driver_status_modal").modal('hide');
                that.onGetDriverList();
                toastr.success("更新驾驶员工作状态成功!");
            }else{
                toastr.error(data.responseMsg);
            }
        });
    },
    onDriverTableSuccess: function() {
        var that = this;
        $("#mutli_del").on('click', function() {
            var ids = [];
            var rows = BootstrapTable.getSelected("driver_table");
            if(rows.length < 1){
                toastr.warning("请选择要删除的记录！");
                return;
            }
            for(var i = 0; i < rows.length; i++) {
                ids.push(rows[i].id);
            }

            CommonStore.trigger("showModal",{msg:"是否确认删除选中驾驶员？",btnclShow:true,callback:function(){
                var param = {ids:ids};
                Urls.post(Urls.deleteDriver,param,function(data) {
                    if(data.responseCode=="1" && data.responseMsg=="success"){
                        that.onGetDriverList();
                        toastr.success("删除驾驶员成功!");
                    }else{
                        toastr.error(data.responseMsg);
                    }
                });
            }});
        });
    }
});

export default DriverStore;