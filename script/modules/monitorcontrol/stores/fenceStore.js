/**
 * @file 越界查询管理台Reflux Store
 * @author CM 2017.08.24
 */

//公共方法加载
import FenceAction from '../actions/fenceAction'
import Commonfun from "../../../common/commonfun"
import Urls from '../../../common/urls';

import BootstrapTable from '../../../common/bootstrapTable';
import MonitorNewAction from "../actions/monitorNewAction";
import GlobalParam from "../../../common/globalParam";


var FenceStore = Reflux.createStore({
    listenables: [FenceAction],
    init: function() {
    },
    data: {
        isFenceSetTab: false, //是否是越界设置页面
        fenceColumns:null,//列名称
        isFenceLoadTable:false,
        historyCacheSize: 100, //缓存大小
        devicePointHistory:[], //缓存查询过的设备的坐标点集合
        treecars:[],//树包含的所有车辆
        monitorcars:[],//需要查询的车辆集合
        monitorcarsno:[], //需要查询的车辆的车牌号集合
        carstree:[],//树容器数据集合
        treeDivID:'', //树容器ID
        drawPolygons:null, //绘制的多边形
        drawType:null, //绘制类型 1-多边形、2-线
        drawPath:[], //绘制路径
        drawOverlay:[], //绘制的图形的本体
        devicePoint:[], //需要对比的设备的坐标集
        alertPoints:[], //触发警报的点
        alertDevice:[], //触发警报的设备
        tableData:[], //表格数据
        modifyFenceId:0, //修改的栅栏ID
    },
    /**
     * 响应Action setfencetab 设置当前是否是越界设置界面
     * @param isFenceSetTab
     */
    onSetfencetab:function (isFenceSetTab) {
        this.data.isFenceSetTab = isFenceSetTab;
    },
    /**
     * 响应Action setcartree，创建机构车辆树
     *
     * @param {divID} 树DIV的ID
     * @param {data} 机构车辆数组
     */
    onSetcartree:function (divID) {
        let that = this;
        let params = {};
        //存储周期超过1天重新获取
        var carTree = GlobalParam.getExpire("carTree", 24 * 60 * 60 * 1000);
        if(carTree){
            that.data.carstree = that.getTreeData(carTree);
            that.data.treeDivID = divID;
            treeControl.initTree(that.data.treeDivID, that.data.carstree, FenceAction);
            mapControl.setMapCenter();
            that.trigger("loadedtree");
        }else {
            Urls.get(Urls.loadorgcartree, params, function (data) {
                that.data.carstree = that.getTreeData(data);
                that.data.treeDivID = divID;
                treeControl.initTree(that.data.treeDivID, that.data.carstree, FenceAction);
                mapControl.setMapCenter();
                that.trigger("loadedtree");
                GlobalParam.set("carTree", data);
            });
        }
    },
    /**
     * 响应 Action setoverlay 绘制图形完成后触发返回结果
     * @param event
     */
    onSetoverlay:function (event) {
        this.data.drawOverlay = [];
        this.data.drawOverlay.push(event.overlay);
        let points = event.overlay.getPath();
        this.data.drawType = 1;
        if(event.drawingMode == 'polyline'){
            this.data.drawType = 2;
            points.push(points[0]);
        }

        this.data.drawPolygons = new BMap.Polygon(points);
    },
    /**
     * 响应 Action getfence 查询越界信息
     * @param columns
     * @returns {boolean}
     */
    onGetfence:function (columns) {
        let that = this;
        if(!Commonfun.checkDate($("#searchDate").val())){
            toastr.warning("请选择查询日期!");
            return false;
        }
        if($("#selCondition").val() == 0){
            toastr.warning("请选择触发条件!");
            return false;
        }

        if(this.data.monitorcars.length <= 0){
            toastr.warning("请选择要查询的车辆!");
            return false;
        }
        if(this.data.drawPolygons == null){
            toastr.warning("请绘制区域图形!");
            return false;
        }

        $("#fence_map").addClass("r-shortA");
        $("#fence_car_tree").addClass("l-shortA");
        $("#outputFence").removeClass("hidden");

        //清理坐标点
        for(let i = 1; i < this.data.drawOverlay.length; i++){
            mapControl.clearDrawing(this.data.drawOverlay[i]);
        }
        let tmpOverlay = this.data.drawOverlay[0];
        this.data.drawOverlay = [tmpOverlay];
        this.data.alertPoints = [];
        this.data.devicePoint = [];

        //判定缓存是否有值
        let devices = this.getDeviceNotInCache(this.data.monitorcars,$("#searchDate").val().replace("-",""));
        let geo = new BMap.Geocoder();
        if(devices.length <= 0){
            this.drawPointOnMap();
            this.setTableData(geo,0);
        }else{
            $('#loading').modal('show');
            let param = {
                entity_name:devices.join(','),
                start_time:Date.parse(new Date($("#searchDate").val() + ' 00:00:00')) / 1000,
                end_time:Date.parse(new Date($("#searchDate").val() + ' 23:59:59')) / 1000,
            };
            Urls.post(Urls.searchtrackgps,param,function (result) {
                if(result.status == 0){
                    for(let i = 0; i < result.points.length; i++){
                        let point = result.points[i];
                        point.car_no = that.data.monitorcarsno[point.device];
                        if(that.data.devicePoint[point.device]){
                            that.data.devicePoint[point.device].point.push(point);
                        }else{
                            that.data.devicePoint[point.device] = {point:[point]}
                        }
                    }
                    for(let i = 0; i < result.driverInfo.length; i++){
                        let driver = result.driverInfo[i];
                        if(that.data.devicePoint[driver.device]){
                            that.data.devicePoint[driver.device].driver = driver.name;
                            that.data.devicePoint[driver.device].org = driver.org;
                            that.data.devicePoint[driver.device].type = driver.type;
                            that.data.devicePoint[driver.device].type_name = driver.type_name;
                        }
                    }
                    that.drawPointOnMap();
                    that.data.fenceColumns = columns;
                    that.setTableData(geo,0);
                }else{
                    toastr.warning("未查询到数据!");
                }
                $('#loading').modal('hide');
            })
        }
        return true;
    },
    onGetfenceset:function (columns) {
        let queryParam = function (params) {  //配置参数
            let param = {
                limit: params.limit,
                pageIndex: params.pageNumber - 1
            };
            return param;
        }
        BootstrapTable.initTable("fence_set_table", 4, [4, 10], Urls.loadfenceset, columns, queryParam, Urls.post);
        BootstrapTable.onClickRow("fence_set_table", this.fenceSetClickRow);
    },
    /**
     * 响应Action setmonitorcars，设置查询车辆数组信息
     *
     * @param {device} 设备号数组
     */
    onSetmonitorcars:function (devices) {
        this.data.monitorcars = devices;
        for(let i = 0; i < devices.length; i++){
            let node = treeControl.findByDevice(this.data.treeDivID,devices[i]);
            this.data.monitorcarsno[devices[i]] = node[0].text;
        }
        if(!this.data.isFenceSetTab){
            if(this.data.monitorcars.length >= 5){
                treeControl.disableNode(this.data.treeDivID);
            }else{
                treeControl.enableNode(this.data.treeDivID);
            }
        }
    },
    /**
     * 响应Action clearmap 清除地图绘制
     */
    onClearmap:function () {
        for(let i = 0; i < this.data.drawOverlay.length; i++){
            mapControl.clearDrawing(this.data.drawOverlay[i]);
        }
        this.data.drawOverlay = [];
        this.data.drawPolygons = null;
    },
    /**
     * 响应Action fenceswitch 设置电子栅栏状态
     * @param status
     */
    onFenceswitch:function (status,id) {
        let param = {
            id:id,
            fence_status:status ? 1 : 2
        }
        Urls.post(Urls.modifyfence,param,function (result) {
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                if(status){
                    toastr.success("开启成功");
                }else{
                    toastr.success("关闭成功");
                }
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    /**
     * 响应Actions savefenceset 保存电子栅栏设置
     */
    onSavefenceset:function () {
        let that = this;
        if ($("#ruleName").val() == "") {
            toastr.warning("请填写规则名称!");
            return false;
        }
        if ($("#selCondition").val() == 0) {
            toastr.warning("请选择触发条件!");
            return false;
        }

        if (this.data.monitorcars.length <= 0) {
            toastr.warning("请选择要查询的车辆!");
            return false;
        }
        let carIdStr = '';
        for(let key in this.data.treecars){
            if($.inArray(this.data.treecars[key].device,this.data.monitorcars) >= 0){
                carIdStr += key + ',';
            }
        }
        if (this.data.drawOverlay.length <= 0) {
            toastr.warning("请绘制区域图形!");
            return false;
        }
        let drawPathStr = [];
        for(let i = 0;i < this.data.drawOverlay[0].getPath().length; i++){
            let tmpPoint = this.data.drawOverlay[0].getPath()[i];
            drawPathStr.push(tmpPoint.lat + ',' + tmpPoint.lng);
        }
        if(this.data.modifyFenceId == 0){
            drawPathStr.pop();
        }
        let param = {
            id:this.data.modifyFenceId,
            fence_name:$("#ruleName").val(),
            fence_type:$("#selCondition").val(),
            fence_draw_type:this.data.drawType,
            fence_draw_path:drawPathStr.join('@'),
            fence_relation_car_ids:carIdStr.substr(0,carIdStr.length - 1),
        };
        if(this.data.modifyFenceId > 0){
            Urls.post(Urls.modifyfence, param, function (result) {
                if(result.responseCode=="1"&&result.responseMsg=="success"){
                    toastr.success("修改成功！");
                    BootstrapTable.render("fence_set_table");
                    that.trigger("fencesetsuccess");
                }else{
                    toastr.error(result.responseMsg);
                }
            })
        }else{
            Urls.post(Urls.addfence, param, function (result) {
                if(result.responseCode=="1"&&result.responseMsg=="success"){
                    toastr.success("新增成功！");
                    BootstrapTable.render("fence_set_table");
                    that.trigger("fencesetsuccess");
                }else{
                    toastr.error(result.responseMsg);
                }
            })
        }

    },
    /**
     * 响应Actions deletefence 删除指定栅栏
     * @param id
     */
    onDeletefence:function (id) {
        let param = {
            id:id
        }
        Urls.post(Urls.deletefence,param,function (result) {
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                toastr.success("删除成功！");
                BootstrapTable.render("fence_set_table");
            }else{
                toastr.error(result.responseMsg);
            }
        })
    },
    /**
     * 创建机构车辆树数组
     *
     * @param {data} 机构车辆数组
     */
    getTreeData: function (data) {
        let that = this;
        let treeArray = [];
        for(let i = 0; i < data.length; i++){
            let tmp_data = data[i];
            let treeData = {
                text:tmp_data.name,
                icon:'',
                tags:[],
                state:{
                    checked:false,
                    expanded:false
                },
                sn:'',
                nodes:[]
            };
            if(tmp_data.type == '3'){
                that.data.treecars[tmp_data.id] = [];
                that.data.treecars[tmp_data.id].car_no = tmp_data.name;
                that.data.treecars[tmp_data.id].device = tmp_data.short_name;
                treeData.sn = tmp_data.short_name;
                treeData.icon = 'tree-icon tree-carGreen';
            }else{
                treeData.tags = [' (' + that.getTreeOrgCarNum(tmp_data.children,0) + ')'];
                treeData.icon = 'tree-icon ' + (tmp_data.type == '1' ? 'tree-org' : 'tree-dep');
                if(!that.data.isFenceSetTab){
                    treeData.state.root = true;
                }
            }
            if(tmp_data.children.length > 0){
                treeData.nodes = that.getTreeData(tmp_data.children);
            }
            treeArray[i] = treeData;
        }

        return treeArray;
    },
    /**
     * 获取树机构下车辆数目
     * @param childNode 机构下子节点数组
     * @param carNum 计数器
     * @returns {int} 计数器
     */
    getTreeOrgCarNum:function (childNode,carNum) {
        let that = this;
        let countCar = 0;
        for(let i = 0; i < childNode.length; i++){
            let tmp_node = childNode[i];
            if(tmp_node.type == '3'){
                countCar++;
            }else{
                if(tmp_node.children.length > 0){
                    countCar = countCar + that.getTreeOrgCarNum(tmp_node.children,carNum);
                }
            }
        }
        return carNum + countCar;
    },
    /**
     * 绘制图标在地图上
     */
    drawPointOnMap:function () {
        for(let key in this.data.devicePoint) {
            let val = this.data.devicePoint[key];
            this.setDeviceCache(key,$("#searchDate").val().replace("-",""),val)
            if(val.point.length > 0){
                let isInPolygon = mapControl.checkPointOnPolygon(val.point[0], this.data.drawPolygons); //上一个点是否在多边形内
                for(let i = 1; i < val.point.length; i++){
                    let point = val.point[i];
                    point.type = val.type;
                    point.type_name = val.type_name;
                    point.driver = val.driver;
                    point.org = val.org;
                    let checkResult = mapControl.checkPointOnPolygon(point, this.data.drawPolygons);
                    if($("#selCondition").val() == 1){//驶入判定，上一个点不在多边形内，这一个点在多边形内，判定为驶入触发
                        if(checkResult && !isInPolygon){
                            point.rule = '驶入触发';
                            this.data.alertPoints.push(point);
                        }
                    }else if($("#selCondition").val() == 2){//驶出判定，上一个点在多边形内，这一个点不在多边形内，判定为驶出触发
                        if(!checkResult && isInPolygon){
                            point.rule = '驶出触发';
                            this.data.alertPoints.push(point);
                        }
                    }else if($("#selCondition").val() == 3){
                        if(checkResult && !isInPolygon){
                            point.rule = '驶入触发';
                            this.data.alertPoints.push(point);
                        }
                        if(!checkResult && isInPolygon){
                            point.rule = '驶出触发';
                            this.data.alertPoints.push(point);
                        }
                    }
                    isInPolygon = checkResult;
                }
            }
        }
        mapControl.drawPoints(this.data.alertPoints,this.data.drawOverlay)
    },
    /**
     * 获取没有在缓存中的设备ID
     * @param devices
     * @param date
     * @returns {Array}
     */
    getDeviceNotInCache:function (devices,date) {
        let deviceCache = [];
        for(let i = 0; i < devices.length; i++){
            let tmp = this.data.devicePointHistory[devices[i] + '@' + date];
            if(tmp){
                this.data.devicePoint[devices[i]] = tmp;
            }else{
                deviceCache.push(devices[i]);
            }
        }
        return deviceCache;
    },
    /**
     * 将设备ID的数据缓存
     * @param device
     * @param date
     * @param data
     */
    setDeviceCache:function (device,date,data) {
        let tmp = this.data.devicePointHistory[device + '@' + date];
        if(tmp){
            return;
        }else{
            if(this.data.devicePointHistory.length + 1 > this.data.historyCacheSize){
                for(let key in this.data.devicePointHistory){
                    delete this.data.devicePointHistory[key];
                    break;
                }
            }
            this.data.devicePointHistory[device + '@' + date] = data;
        }
    },
    /**
     * 设置表格的内容
     */
    setTableData:function (geo,index) {
        let that = this;
        let tmpPoint = this.data.alertPoints[index];
        if(tmpPoint){
            let point = new BMap.Point(tmpPoint.longitude,tmpPoint.latitude);
            geo.getLocation(point, function(rs){
                let gpsAddress = rs.addressComponents;
                let address = gpsAddress.city + "" + gpsAddress.district + "" + gpsAddress.street + "" + gpsAddress.streetNumber;
                let tmpRow = {
                    org: tmpPoint.org.substr(0,tmpPoint.org.length - 1),
                    car_no: tmpPoint.car_no,
                    type: tmpPoint.type,
                    type_name: tmpPoint.type_name,
                    datetime:  Commonfun.getLocalTime(tmpPoint.loc_time),
                    address: address,
                    rule: tmpPoint.rule
                };
                that.data.tableData.push(tmpRow);
                index = index + 1;
                if(index < that.data.alertPoints.length){
                    that.setTableData(geo,index);
                }else{
                    if(!that.data.isFenceLoadTable){
                        BootstrapTable.initTableByData("fence_table", 4, [4, 10], that.data.fenceColumns, that.data.tableData);
                        that.data.isFenceLoadTable = true;
                    }else{
                        BootstrapTable.load("fence_table",that.data.tableData);
                    }
                }
            });
        }

    },
    /**
     * 点击表格触发事件
     * @param row
     * @param ele
     */
    fenceSetClickRow:function (event,field,val,row) {
        if(field){
            this.onClearmap();
            this.data.drawOverlay = [];
            let tmpDrawPath = [];
            treeControl.setAllNodeUnCheck('fence_car_tree');
            let tmpPath = row.fence_draw_path.split('@');
            for(let i = 0; i < tmpPath.length; i++){
                tmpDrawPath.push(new BMap.Point(tmpPath[i].split(',')[1],tmpPath[i].split(',')[0]));
            }
            this.data.drawType = row.fence_draw_type;
            $("#ruleName").val(row.fence_name);
            $("#selCondition").val(row.fence_type);
            this.data.modifyFenceId = row.id;
            let tmpCarIds = row.fence_relation_car_ids.split(',');
            this.data.monitorcars = [];
            let tmpTreeNode = [];
            for(let i = 0; i < tmpCarIds.length; i++){
                let tmpDevice = this.data.treecars[tmpCarIds[i]].device;
                this.data.monitorcars.push(tmpDevice);
                tmpTreeNode.push(treeControl.findByDevice("fence_car_tree",tmpDevice)[0])
            }

            treeControl.setNodeCheck("fence_car_tree",tmpTreeNode);
            let tmpOverlay = null;
            if(row.fence_draw_type == 2){
                tmpOverlay = new BMap.Polyline(tmpDrawPath);
            }else{
                tmpOverlay = new BMap.Polygon(tmpDrawPath);
            }
            map.addOverlay(tmpOverlay);
            this.data.drawOverlay.push(tmpOverlay);
        }
    }
});

export default FenceStore