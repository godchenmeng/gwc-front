/**
 * @file 调度Reflux Store
 * @author XuHong 2017.08.30
 */

import CarAction from '../actions/carAction';

import CommonStore from '../../common/stores/commonStore';

import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';

var CarStore = Reflux.createStore({
    listenables: [CarAction],
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
            field: 'oname',
            title: '所属部门',
            align: 'center',
            valign: 'middle'
        },{
            field: 'intime',
            title: '入单位时间',
            align: 'center',
            valign: 'middle'
        },{
            field: 'type_name',
            title: '车辆类型',
            align: 'center',
            valign: 'middle'
        },{
            field: 'car_status',
            title: '审核状态',
            align: 'center',
            valign: 'middle',
            formatter: function(value,row,index) {
                var results = {'1':'已审核','2':'未审核'};
                return !value ? '-' : !results[value] ? '-' : results[value];
            }
        },{
            field: 'status',
            title: '处理状态',
            align: 'center',
            valign: 'middle',
            formatter: function(value,row,index) {
                var results = {'1':'正常','2':'报废'};
                return !value ? '-' : !results[value] ? '-' : results[value];
            }
        },{
            field: 'cname',
            title: '录入人',
            align: 'center',
            valign: 'middle'
        },{
            field: 'insurance_time',
            title: '交保时间',
            align: 'center',
            valign: 'middle'
        },{
            field: 'inspection_time',
            title: '年检时间',
            align: 'center',
            valign: 'middle'
        },{
            field: 'mt_mileage',
            title: '保养里程',
            align: 'center',
            valign: 'middle'
        },{
            field: 'current_mileage',
            title: '当前里程',
            align: 'center',
            valign: 'middle'
        },{
            field: '',
            title: '操作',
            align: 'center',
            valign: 'middle',
            formatter: function(value,row,index) {
                let html = [];
                html.push('<div class="action-icon1" style="width: 100%;">');
                if(CommonStore.verifyPermission('get/car/add')) html.push('<a class="c-add" title="复制并新增"/>');
                if(CommonStore.verifyPermission('get/car/modify')) html.push('<a class="edit" title="编辑"/>');
                html.push('<a class="details-icon" title="详情"/>');
                html.push('</div>');
                return html.join('');
            },
            events: {
                'click .details-icon' : function(e, value, row, index) {
                    CarStore.trigger('carDetailEvent', row);
                    $("#car_detail_modal").modal("toggle");
                },
                'click .edit' : function(e, value, row, index) {
                    CarStore.trigger('carUpdateEvent', row);
                    $("#car_oper_modal").modal("toggle");
                },
                'click .c-add' : function(e, value, row, index) {
                    CarStore.trigger('carCopyAddEvent', row);
                    $("#car_oper_modal").modal("toggle");
                }
            }
        }],
        queryParams: function(params) {
            var param = {
                car_no_r: $("#car_no_r").val(),
                type: $("#type").val(),
                show_name: $("#show_name").val(),
                hide_org: $("#hide_org").val(),
                check: $("#check").val(),
                status: $("#status").val(),
                limit: params.limit,
                pageIndex: this.pageNumber - 1
            };

            return param;
        }
    },
    /**
     * 响应Action getCarList获取车辆信息列表
     */
    onGetCarList: function() {
        $("#car_table").bootstrapTable("refresh");
    },
    /**
     * 响应Action updateCar更新车辆信息
     * @param car
     */
    onUpdateCar: function(car) {
        var that = this;
        Urls.post(Urls.updateCar,car,function(data) {
            if(data.responseCode=="1" && data.responseMsg=="success"){
                $("#car_oper_modal").modal('hide');
                that.onGetCarList();
                toastr.success("编辑车辆成功!");
            }else{
                toastr.error(data.responseMsg);
            }
        });
    },
    /**
     * 响应Action addCar新增车辆信息
     * @param car
     */
    onAddCar: function(car) {
        var that = this;
        Urls.post(Urls.addCar,car,function(data) {
            if(data.responseCode=="1" && data.responseMsg=="success"){
                $("#car_oper_modal").modal('hide');
                that.onGetCarList();
                toastr.success("新增车辆成功!");
            }else{
                toastr.error(data.responseMsg);
            }
        });
    },
    onCarTableLoadSuccess: function() {
        var that = this;
        $("#multi_sub").on('click', function() {
            var ids = [];
            var rows = BootstrapTable.getSelected("car_table");
            if(rows.length < 1){
                toastr.warning("请选择需要提交审核的记录！");
                return;
            }
            for(var i = 0; i < rows.length; i++) {
                ids.push(rows[i].id);
            }
            CommonStore.trigger("showModal",{msg:"是否确认车辆信息提交审核？",btnclShow:true,callback:function(){
                var param = {ids:ids};
                Urls.post(Urls.checkCar,param,function(data) {
                    if(data.responseCode=="1" && data.responseMsg=="success"){
                        that.onGetCarList();
                        toastr.success("车辆信息提交审核成功!");
                    }else{
                        toastr.error(data.responseMsg);
                    }
                });
            }});
        });
        $("#mutli_del").on('click', function() {
            var ids = [];
            var rows = BootstrapTable.getSelected("car_table");
            if(rows.length < 1){
                toastr.warning("请选择需要删除的记录！");
                return;
            }
            for(var i = 0; i < rows.length; i++) {
                ids.push(rows[i].id);
            }
            CommonStore.trigger("showModal",{msg:"是否确认删除车辆信息？",btnclShow:true,callback:function(){
                var param = {ids:ids};
                Urls.post(Urls.deleteCar,param,function(data) {
                    if(data.responseCode=="1" && data.responseMsg=="success"){
                        that.onGetCarList();
                        toastr.success("删除车辆信息成功!");
                    }else{
                        toastr.error(data.responseMsg);
                    }
                });
            }});
        });
    }
});

export default CarStore;