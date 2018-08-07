/**
 * @file 设备管理Reflux Store
 * @author XuHong 2017.09.08
 */

import Urls from '../../../common/urls';
import DeviceAction from "../actions/deviceAction";

import BootstrapTable from '../../../common/bootstrapTable';
import CommonStore from '../../common/stores/commonStore';

var DeviceStore = Reflux.createStore({
    listenables: [DeviceAction],
    data: {
        columns: [{
            field: 'select',
            checkbox: true,
            align: 'center',
            valign: 'middle'
        },{
            field: 'car_no',
            title: '车牌号码',
            align: 'center',
            valign: 'middle'
        },{
            field: 'device',
            title: '设备编号',
            align: 'center',
            valign: 'middle'
        },{
            field: 'org',
            title: '所属机构/部门',
            align: 'center',
            valign: 'middle'
        },{
            field: 'sim',
            title: 'sim卡号',
            align: 'center',
            valign: 'middle'
        },{
            field: 'createdate',
            title: '创建时间',
            align: 'center',
            valign: 'middle'
        },{
            field: 'updatedate',
            title: '更新时间',
            align: 'center',
            valign: 'middle'
        },{
            field: 'status',
            title: '状态',
            align: 'center',
            valign: 'middle',
            formatter: function(value,row,index) {
                var results = {'1':'正常使用'};
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
                if(CommonStore.verifyPermission('device/modify')) html.push('<a class="edit" title="编辑"/>');
                html.push('</div>');
                return html.join('');
            },
            events: {
                'click .edit': function(e, value, row, index) {
                    DeviceStore.trigger('deviceUpdateEvent', row);
                    $("#device_update_modal").modal("show");
                }
            }
        }],
        queryParams: function(params) {
            var param = {
                car_no_r: $("#car_no_r").val(),
                device_qr: $("#device_qr").val(),
                show_name: $("#show_name").val(),
                hide_org: $("#hide_org").val(),
                limit: params.limit,
                pageIndex: this.pageNumber - 1
            };

            return param;
        }
    },
    /**
     * 响应Action getDeviceList获取设备信息列表
     */
    onGetDeviceList: function() {
        $("#device_table").bootstrapTable("refresh");
    },
    /**
     * 响应Action addDevice新增设备信息
     * @param device
     */
    onAddDevice: function(device) {
        var that = this;
        Urls.post(Urls.addDevice,device,function(data) {
            if(data.responseCode=="1" && data.responseMsg=="success"){
                $("#device_oper_modal").modal('hide');
                that.onGetDeviceList();
                toastr.success("注册设备成功!");
            }else{
                toastr.error(data.responseMsg);
            }
        });
    },
    /**
     * 响应Action updateDevice更新设备信息
     * @param device
     */
    onUpdateDevice: function(device) {
        var that = this;
        Urls.post(Urls.updateDevice,device,function(data) {
            if(data.responseCode=="1" && data.responseMsg=="success"){
                $("#device_update_modal").modal('hide');
                that.onGetDeviceList();
                toastr.success("换设备成功!");
            }else{
                toastr.error(data.responseMsg);
            }
        });
    },
    onDeviceTableSuccess: function() {
        var that = this;
        $("#multi_del_car").on('click', function() {
            var ids = [];
            var rows = BootstrapTable.getSelected("device_table");
            if(rows.length < 1){
                toastr.warning("请选择需要注销的设备（删车）！");
                return;
            }
            for(var i = 0; i < rows.length; i++) {
                ids.push(rows[i].id);
            }

            CommonStore.trigger("showModal",{msg:"是否确认注销选中设备（删车）？",btnclShow:true,callback:function(){
                var param = {ids:ids};
                Urls.post(Urls.deleteDeviceCar,param,function(data) {
                    if(data.responseCode=="1" && data.responseMsg=="success"){
                        that.onGetDeviceList();
                        toastr.success("注销设备（删车）成功!");
                    }else{
                        toastr.error(data.responseMsg);
                    }
                });
            }});
        });

        $("#multi_del_no").on('click', function() {
            var ids = [];
            var rows = BootstrapTable.getSelected("device_table");
            if(rows.length < 1){
                toastr.warning("请选择需要注销的设备（不删车）！");
                return;
            }
            for(var i = 0; i < rows.length; i++) {
                ids.push(rows[i].id);
            }

            CommonStore.trigger("showModal",{msg:"是否确认注销选中设备（不删车）？",btnclShow:true,callback:function(){
                var param = {ids:ids};
                Urls.post(Urls.deleteDevice,param,function(data) {
                    if(data.responseCode=="1" && data.responseMsg=="success"){
                        that.onGetDeviceList();
                        toastr.success("注销设备（不删车）成功!");
                    }else{
                        toastr.error(data.responseMsg);
                    }
                });
            }});
        });
    }
});

export default DeviceStore;