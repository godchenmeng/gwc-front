/**
 * @file 实时监控管理台Reflux Store
 * @author CM 2017.07.24
 */

import MonitorNewAction from '../actions/monitorNewAction'
import Urls from '../../../common/urls';
import GlobalParam from "../../../common/globalParam";


var MonitorNewStore = Reflux.createStore({
    listenables: [MonitorNewAction],
    init: function() {
    },
    data: {
        allcars:[],//当前所有车辆
        monitorcars:[],//正在监控的车辆集合
        carstree:[],//树容器数据集合
        carmarkers: [],//地图MARKER集合
        allcarspoint:{},//所有车辆的实时坐标
        isFirstimeLoadMarkers: true,//是否第一次加载地图MARKER
        treeDivID:'', //树容器ID
        isSetTreeCheckedState:false,
        ws:null, //websocket连接
        wsConnectSuccess: false, //ws是否连接成功
        errCount:0, //连接失败次数
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
            that.data.allcars = that.data.monitorcars;
            that.data.treeDivID = divID;
            treeControl.initTree(that.data.treeDivID,that.data.carstree,MonitorNewAction);
            mapControl.setMapCenter();
            that.onSetcargps();
            that.onGetcarstatus();
            that.data.monitorcars = [];
        }else {
            Urls.get(Urls.loadorgcartree, params, function (data) {
                that.data.carstree = that.getTreeData(data);
                that.data.allcars = that.data.monitorcars;
                that.data.treeDivID = divID;
                treeControl.initTree(that.data.treeDivID,that.data.carstree,MonitorNewAction);
                mapControl.setMapCenter();
                that.onSetcargps();
                that.onGetcarstatus();
                that.data.monitorcars = [];
                GlobalParam.set("carTree", data);
            });
        }
    },
    /**
     * 响应Action setcargps，获取车辆实时信息
     *
     */
    onSetcargps: function() {
        if(this.data.wsConnectSuccess){
            this.data.ws.send("");
        }
    },
    /**
     * 响应Action setmonitorcars，设置监控车辆数组信息
     *
     * @param {device} 设备号数组
     */
    onSetmonitorcars:function (devices) {
        let that = this;
        that.data.monitorcars = devices;
        for(let i = 0; i < that.data.allcarspoint.length; i++){
            let tmpCar = that.data.allcarspoint[i].device;
            if($.inArray(tmpCar,that.data.monitorcars) < 0){
                if(that.data.carmarkers[tmpCar] && that.data.carmarkers[tmpCar].showStatus) {
                    mapControl.hideMarker(that.data.carmarkers[tmpCar]);
                }
            }else{
                if(that.data.carmarkers[tmpCar] && !that.data.carmarkers[tmpCar].showStatus){
                    mapControl.showMarker(that.data.carmarkers[tmpCar]);
                }
            }
        }
        mgr.showMarkers();
        mapControl.setMarkerViewport(that.data.carmarkers);
    },
    /**
     * 响应Action getcarstatus，设置监控车辆数组信息
     *@param isSetTreeCheckedState   是否设置树节点选中状态
     *
     */
    onGetcarstatus:function (isSetTreeCheckedState) {
        if(isSetTreeCheckedState) {
            let devices = this.setTreeCheckedState(this.data.allcarspoint);
            this.onSetmonitorcars(devices);
        }
        // Urls.get(Urls.loadcarstatus,params,function (data) {
        //     let car_status = {
        //         total_online:0,
        //         total_stay:0,
        //         total_offline:0
        //     };
        //     for(let i = 0; i < data.length; i++){
        //         if(data[i].acc === '1'){
        //             car_status.total_online++;
        //         }else if(data[i].acc === '2'){
        //             car_status.total_stay++;
        //         }else{
        //             car_status.total_offline++;
        //         }
        //     }
        //     that.setTreeCarICON(data);
        //     that.trigger('carstatus', car_status);
        //     if(isSetTreeCheckedState) {
        //         let devices = that.setTreeCheckedState(data);
        //         that.onSetmonitorcars(devices);
        //     }
        // })
    },
    /**
     * 响应Action searchcar，根据车牌关键字搜索车辆
     * @param keyword 车牌号
     */
    onSearchcar:function (keyword) {
        let that = this;
        let device = [];
        if(keyword === ''){
            treeControl.showAllTree(that.data.treeDivID);
        }else{
            let nodes = treeControl.searchByKeyword(that.data.treeDivID,keyword);
            for(let i = 0; i < nodes.length; i++){
                let node = nodes[i];
                device.push(node.sn);
            }
        }
        that.onSetmonitorcars(device);
    },
    /**
     * 响应Action linkwebsocket，连接websocket
     */
    onLinkwebsocket:function(){
        this.data.ws = Urls.wsConnect(Urls.loadcargpsws,this.wsOpen,this.wsMsg,this.wsClose);
    },
    /**
     * websocket连接打开触发事件
     */
    wsOpen: function(event){
        if(!this.data.wsConnectSuccess){
            this.data.ws.send("");
        }
        this.data.wsConnectSuccess = true;
    },
    wsMsg: function(event){
        this.data.allcarspoint = JSON.parse(event.data);
        if(this.data.allcarspoint.length > 0){
            let reData = [];
            let car_status = {
                total_online:0,
                total_stay:0,
                total_offline:0
            };
            for(let i = 0; i < this.data.allcarspoint.length; i++){
                let carPoint = this.data.allcarspoint[i];
                if($.inArray(carPoint.device,this.data.monitorcars) >= 0){
                    reData.push(carPoint);
                }
                if(carPoint.acc === '1'){
                    car_status.total_online++;
                }else if(carPoint.acc === '2'){
                    car_status.total_stay++;
                }else{
                    car_status.total_offline++;
                }
            }
            this.setTreeCarICON(this.data.allcarspoint);
            this.trigger('carstatus', car_status);

            if(Object.keys(this.data.carmarkers).length === 0){
                mapControl.setCarMarker(this.data.allcarspoint, this.data.carmarkers, true);
            }
        }
    },
    wsClose: function(event){
        if(this.data.errCount >= 50){
            toastr.error("与服务器连接断开，无法获取最新gps请刷新页面尝试重新连接。");
        }else{
            this.data.errCount++;
            this.onLinkwebsocket();
        }
    },
    /**
     * 设置机构车辆树车辆状态图标
     *
     * @param {divID} 树容器ID
     * @param {carsStatus} 车辆状态数组
     */
    setTreeCarICON:function (carsStatus) {
        treeControl.setCarStatusICON(this.data.treeDivID, carsStatus);
    },
    /**
     * 设置机构车辆树车辆选中状态
     *
     * @param {divID} 树容器ID
     * @param {carsStatus} 车辆状态数组
     */
    setTreeCheckedState:function(carsStatus){
        let that = this;
        let acc =[];
        $('input[name="locateStateCK"]:checked').each(function(){
            acc.push($(this).val());
        });
        let devices = treeControl.setCarCheckedStateByCarStatus(that.data.treeDivID, carsStatus,acc.join(','));
        return devices;
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
                treeData.sn = tmp_data.short_name;
                that.data.monitorcars.push(tmp_data.short_name);
                treeData.tags = ['<i class="tree-icon tree-track-mr" style="top:8px;position:relative;" data-device="' + tmp_data.short_name + '"></i>'];
                treeData.click = 1;
                treeData.icon = 'tree-icon tree-carGray';
            }else{
                treeData.tags = [' (' + that.getTreeOrgCarNum(tmp_data.children,0) + ')'];
                treeData.icon = 'tree-icon ' + (tmp_data.type == '1' ? 'tree-org' : 'tree-dep');
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
    }
});

export default MonitorNewStore