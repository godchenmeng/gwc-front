/**
 * @file 初始化地图样式和组件
 * @author CM 2017.07.21
 */
import Commonfun from '../../../common/commonfun';
import CommonAction from '../../common/actions/commonAction';
import CommonStore from '../../common/stores/commonStore'

import LocateStore from '../stores/locateStore'
import MonitorStore from '../stores/monitorStore'

window.mapControl = {
    /**
     * 加载地图信息
     */
    loadMap:function (mapName) {
        window.mapName = mapName;
        var mainScript = document.createElement('script');
        mainScript.src = 'https://api.map.baidu.com/api?v=2.0&ak=pxBudaGK5Aez1hbfs5FQs1D5Ng0c19nH&callback=mapControl.initLocation';
        document.getElementsByTagName('head')[0].appendChild(mainScript);
    },
    /**
     * 根据浏览器定位确定地图位置
     */
    initLocation: function() {
        let that = this;
        window.map = new BMap.Map(mapName, {enableMapClick: false});    // 创建Map实例
        map.centerAndZoom(new BMap.Point(106.7,26.6), 9);  // 初始化地图,设置中心点坐标和地图级别
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        this.initPlus();
        this.addMapControl();
        CommonStore.trigger("loadedmap",mapName);
        CommonStore.getUserRegionDatas(function(datas){
            that.drawRegionPoints(datas);
        });
    },
    /**
     * 加载所需地图插件
     */
    initPlus:function () {
        var mmScript = document.createElement('script');
        mmScript.src = __uri('/static/javascript/MarkerManager_min.js');
        document.getElementsByTagName('head')[0].appendChild(mmScript);
        mmScript.onload = mmScript.onreadystatechange = function () {
            window.mgr = new BMapLib.MarkerManager(map,{//标注管理器
                borderPadding: 200,
                maxZoom: 19
            });
        }
        var mcScript = document.createElement('script');
        mcScript.src = __uri('/static/javascript/MarkerClusterer.js');
        document.getElementsByTagName('head')[0].appendChild(mcScript);
        mcScript.onload = mcScript.onreadystatechange = function () {
            window.markerClusterer = new BMapLib.MarkerClusterer(map,{girdSize:100});//marker聚合管理器
        }
        var tioScript = document.createElement('script');
        tioScript.src = __uri('/static/javascript/TextIconOverlay_min.js');
        document.getElementsByTagName('head')[0].appendChild(tioScript);
        var clScript = document.createElement('script');
        clScript.src = __uri('/static/javascript/CanvasLayer.js');
        document.getElementsByTagName('head')[0].appendChild(clScript);
        var ibScript = document.createElement('script');
        ibScript.src = 'https://api.map.baidu.com/library/InfoBox/1.2/src/InfoBox_min.js';
        document.getElementsByTagName('head')[0].appendChild(ibScript);
        var pbScript = document.createElement('script');
        pbScript.src = __uri('/static/javascript/jquery.playbar.js');
        document.getElementsByTagName('head')[0].appendChild(pbScript);
        var coScript = document.createElement('script');
        coScript.src = __uri('/static/javascript/CarOverlay.js');
        document.getElementsByTagName('head')[0].appendChild(coScript);
        var lsScript = document.createElement('script');
        lsScript.src = __uri('/static/javascript/LuShu.js');
        document.getElementsByTagName('head')[0].appendChild(lsScript);
        var geoScript = document.createElement('script');
        geoScript.src = 'https://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js';
        document.getElementsByTagName('head')[0].appendChild(geoScript);
    },
    setMapCenter:function () {
        map.centerAndZoom(new BMap.Point(106.7,26.6), 9);
    },
    setMapCenterByPoint:function (point,zoom) {
        map.centerAndZoom(point, zoom);
    },
    /**
     * 设置车辆状态位置
     * @param carData 车辆数据
     * @param carmarkers 车辆Marker集合
     * @param isFirstimeLoadMarkers 是否第一次加载Marker
     */
    setCarMarker:function (carData, carmarkers, isFirstimeLoadMarkers, notFollow) {
        let that = this;
        for(let i = 0; i < carData.length; i++){
            let carInfo = carData[i];
            let carMarker;

            let carPoint = new BMap.Point(carInfo.longitude,carInfo.latitude);
            let carIconUrl = '';
            let carLabelStyle = '';
            //第一次加载初始化，第二次加载直接修改
            if(isFirstimeLoadMarkers){
                carMarker = new BMap.Marker();
                carMarker.show();
                carMarker.showStatus = false;
                carMarker.senddate = carInfo.senddate;
                carMarker.startPoint = new BMap.Point(carInfo.start_longitude,carInfo.start_latitude);
                carMarker.startdate = carInfo.startdate;
                //mgr.addMarker(carMarker);
                //markerClusterer.addMarker(carMarker);
                that.initMarkerInfoWindow(carMarker,carInfo);
                that.markerClickTrigger(carMarker);
            }else{
                if(!carmarkers[carInfo.device]){
                    carMarker = new BMap.Marker();
                    mgr.addMarker(carMarker);
                    markerClusterer.addMarker(carMarker);
                }else{
                    carMarker = carmarkers[carInfo.device];
                }
            }
            carMarker.disableDragging();
            let carTypeCode = CommonStore.getCarTypeCodeByDevice(carInfo.device);
            if(carInfo.acc == '1'){
                carIconUrl = __uri("/static/images/car-green.png");
                if(carTypeCode) carIconUrl = "/static/images/car/"+carTypeCode+"-green.png";
                carLabelStyle = { padding : "0 10px",lineHeight : "24px",borderRadius:"0 12px 12px 12px",border:"none",background: "rgba(10,188,16,.8)",color:"#fff",maxWidth:"none"};
            }else if(carInfo.acc == '2'){
                carIconUrl = __uri("/static/images/car-red.png");
                if(carTypeCode) carIconUrl = "/static/images/car/"+carTypeCode+"-red.png";
                carLabelStyle = { padding : "0 10px",lineHeight : "24px",borderRadius:"0 12px 12px 12px",border:"none",background: "rgba(218,0,15,.75)",color:"#fff",maxWidth:"none"};
            }else{
                carIconUrl = __uri("/static/images/car-gray.png");
                if(carTypeCode) carIconUrl = "/static/images/car/"+carTypeCode+"-gray.png";
                carLabelStyle = { padding : "0 10px",lineHeight : "24px",borderRadius:"0 12px 12px 12px",border:"none",background: "rgba(144,144,144,.8)",color:"#fff",maxWidth:"none"};
            }
            if(isFirstimeLoadMarkers) {
                let carLabel = new BMap.Label(carInfo.car_no,{
                    offset : new BMap.Size(0, 41)
                });
                carLabel.setStyle(carLabelStyle);
                carMarker.setLabel(carLabel);
            }else{
                if(carMarker.getLabel()){
                    carMarker.getLabel().setStyle(carLabelStyle);
                }
            }
            let carIcon = new BMap.Icon(carIconUrl, new BMap.Size(20, 41), {
                offset: new BMap.Size(0, 0)
            });
            let shadowIcon = new BMap.Icon(__uri("/static/images/blank.png"), new BMap.Size(14, 14), {
                offset: new BMap.Size(0, 0)
            });
            carMarker.setIcon(carIcon);
            carMarker.setRotation(carInfo.direction);
            carMarker.setPosition(carPoint);
            carMarker.setShadow(shadowIcon);
            carmarkers[carInfo.device] = carMarker;
        }
        if(isFirstimeLoadMarkers){
            mgr.showMarkers();
            if(!notFollow){
                that.setMarkerViewport(carmarkers);
            }
        }
    },
    /**
     * 设置车辆状态位置
     * @param carData 车辆数据
     * @param carmarkers 车辆Marker集合
     * @param isFirstimeLoadMarkers 是否第一次加载Marker
     */
    setSingleCarMarker:function (carInfo,runCar) {
        let carPoint = new BMap.Point(carInfo.longitude,carInfo.latitude);
        let carIcon = '';
        let carLabelStyle = '';
        let carTypeCode = CommonStore.getCarTypeCodeByDevice(carInfo.device);
        if(carInfo.acc == '1'){
            carIcon = __uri("/static/images/run-car-green.png");
            if(carTypeCode) carIcon = "/static/images/car/run/run-"+carTypeCode+"-green.png";
            carLabelStyle = { padding : "0 10px","line-height" : "24px","border-radius":"0 12px 12px 12px",border:"none",background: "rgba(10,188,16,.8)",color:"#fff","max-width":"none","white-space": "nowrap","display": "inline-block"};
        }else if(carInfo.acc == '2'){
            carIcon = __uri("/static/images/run-car-red.png");
            if(carTypeCode) carIcon = "/static/images/car/run/run-"+carTypeCode+"-red.png";
            carLabelStyle = { padding : "0 10px","line-height" : "24px","border-radius":"0 12px 12px 12px",border:"none",background: "rgba(218,0,15,.75)",color:"#fff","max-width":"none","white-space": "nowrap","display": "inline-block"};
        }else{
            carIcon = __uri("/static/images/run-car-gray.png");
            if(carTypeCode) carIcon = "/static/images/car/run/run-"+carTypeCode+"-gray.png";
            carLabelStyle = { padding : "0 10px","line-height": "24px","border-radius":"0 12px 12px 12px",border:"none",background: "rgba(144,144,144,.8)",color:"#fff","max-width":"none","white-space": "nowrap","display": "inline-block"};
        }
        runCar = new BMapLib.RunCar(map,carPoint,{
            autoView:false,//是否开启自动视野调整，如果开启那么小车在运动过程中会根据视野自动调整
            icon  : carIcon,
            car_no : carInfo.car_no,
            carLabelStyle : carLabelStyle,
            enableRotation:true//是否设置小车随着道路的走向进行旋转
        });
        return runCar;
    },
    /**
     * 点击车辆触发的事件
     * @param marker
     */
    markerClickTrigger:function (marker) {
        let that = marker;
        marker.addEventListener("click",function(e){
            let infoWindow = that.infowindow;
            let sendate = that.senddate.time;
            let startdate = that.startdate.time;
            let startpoint = that.startPoint;
            var openPos = new BMap.Point(e.point.lng,e.point.lat);
            if(!startpoint.lat || !startpoint.lng) startpoint = openPos;
            let geoc = new BMap.Geocoder();
            geoc.getLocation(startpoint, function(rs) {
                let gpsAddress = rs.addressComponents;
                let address = gpsAddress.city + "" + gpsAddress.district + "" + gpsAddress.street + "" + gpsAddress.streetNumber;
                address = !!address ? address : '位置信息获取异常';
                let tmpHtml = infoWindow.getContent().replace('@addr@',address);
                tmpHtml = tmpHtml.replace('@st@',Commonfun.getLocalTime(startdate / 1000));
                tmpHtml = tmpHtml.replace('@time@',Commonfun.getLocalTime(sendate / 1000));
                infoWindow.setContent(tmpHtml);
                map.openInfoWindow(infoWindow,openPos);
            });
        });
    },
    /**
     * 设置地图显示范围
     *
     * @param carmarkers 车辆信息集合
     */
    setMarkerViewport:function (carmarkers) {
        let that = this;
        let showMarkersPoint = [];
        for(let key in carmarkers){
            let marker = carmarkers[key];
            if(marker.showStatus) showMarkersPoint.push(marker.point);
        }
        if(showMarkersPoint.length > 0){
            map.setViewport(showMarkersPoint);
        }
    },
    /**
     * 隐藏MARKER
     * @param marker
     */
    hideMarker:function (marker) {
        if(marker.showStatus){
            mgr.toggle(marker);
            markerClusterer.removeMarker(marker);
            marker.showStatus = false;
        }
    },
    /**
     * 显示MARKER
     * @param marker
     */
    showMarker:function (marker) {
      if(!marker.showStatus){
          mgr.toggle(marker);
          markerClusterer.addMarker(marker);
          marker.showStatus = true;
      }
    },
    /**
     * 初始化车辆的信息窗口
     * @param marker
     * @param carInfo 车辆信息
     */
    initMarkerInfoWindow:function (marker,carInfo) {
        let that = this;
        let address = '@addr@';
        let starttime = '@st@';
        let time = '@time@';
        let addHtml = [];
        let opts = {width : 280,height: 190}
        addHtml.push('<div class="map-dialog-box">');
        addHtml.push('    <div class="dialog-text">');
        addHtml.push('        <p>出发地点：<span class="span-con">'+ address +'</span></p>');
        addHtml.push('        <p>出发时间：<span class="span-con">'+ starttime +'</span></p>');
        addHtml.push('        <p>上报时间：<span class="span-con">'+ time +'</span></p>');
        addHtml.push('        <p>归属部门：<span class="span-con">'+carInfo.org+'</span></p>');
        if(carInfo.total_oil != null && carInfo.total_oil != undefined && carInfo.total_oil !== 0 && carInfo.remain_oil != null && carInfo.remain_oil != undefined && carInfo.remain_oil >= 0){
            opts.height += 20;
            let percent = Math.round(carInfo.remain_oil/carInfo.total_oil*100);//剩余百分比
            addHtml.push('    <p>总油量：<span class="span-con" style="color: #0093ff;">'+carInfo.total_oil+'&nbsp;L</span>&nbsp;&nbsp;&nbsp;&nbsp;剩余油量：<span class="span-con" style="color: #ff0000;">'+carInfo.remain_oil+'&nbsp;L</span>&nbsp;&nbsp;（<span class="span-con" style="color: #ff0000;">'+percent+'%</span>）</p>');
        }
        if(!!carInfo.turn_state){
            opts.height += 30;
            if(carInfo.turn_state == '1'){
                addHtml.push('    <p>罐体状态：<span class="span-con">正转</span>&nbsp;&nbsp;&nbsp;&nbsp;<img src="' + __uri("/static/images/reversal-icon.png") + '" style="height: 17px; vertical-align: text-bottom;"/></p>');
            }else if(carInfo.turn_state == '2'){
                addHtml.push('    <p>罐体状态：<span class="span-con">反转</span>&nbsp;&nbsp;&nbsp;&nbsp;<img src="' + __uri("/static/images/forward-icon.png") + '" style="height: 17px; vertical-align: text-bottom;"/></p>');
            }
        }
        addHtml.push('    </div>');
        addHtml.push('    <ul class="module-menu">');
        addHtml.push('        <li><i class="module-icon mod-icon1"></i><button class="nomal_button" onClick=\'mapControl.redirectMil("' + carInfo.car_id + '")\'>里程</button></li>');
        addHtml.push('        <li><i class="module-icon mod-icon2"></i><button class="nomal_button" onClick=\'mapControl.redirectTrack("' + carInfo.car_no + '")\'>轨迹</button></li>');
        addHtml.push('        <li><i class="module-icon mod-icon3"></i><button class="nomal_button" onClick=\'mapControl.redirectFence("' + carInfo.car_no + '")\'>栅栏</button></li>');
        addHtml.push('    </ul>');
        addHtml.push('</div>');
        marker.infowindow =  new BMap.InfoWindow(addHtml.join(""), opts);
    },
    redirectMil: function(car_id){
        let $mod = $("div.modal.fade.Mileage");
        if($mod.length > 0){//判断里程窗口是否存在
            let modId = $mod.attr("id");
            if(modId == "locate_mileage_modal"){//定位信息查询模块点击里程
                LocateStore.trigger("showMileageModal",car_id);
            }else{
                MonitorStore.trigger("showMileageModal",car_id)
            };
            $("#" + modId).modal('toggle');
        }
    },
    redirectTrack:function (car_no) {
        window.location.href='monitor.html?act=Track&params=car_no:' + escape(car_no);
    },
    redirectFence:function (car_no) {
        window.location.href='monitor.html?act=FenceSet&params=car_no:' + escape(car_no);
    },
    /**
     * 添加地图缩放控件
     */
    addMapControl:function () {
        let top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
        let top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
        map.addControl(top_left_control);
        map.addControl(top_left_navigation);
    },

    /**
     * 初始化轨迹点信息覆盖物
     *
     */
    initTrackPointOverlay: function(){
        this.trackPointOverlay = function (point, type) {
            this._point = point;
            this.type = type;
        };
        this.trackPointOverlay.prototype = new BMap.Overlay();
        this.trackPointOverlay.prototype.initialize = function (map) {
            let that = this;
            this._map = map;
            let div = this._div = document.createElement('div');
            div.className = this.type;
            let innerDiv = document.createElement('div');
            innerDiv.className = 'trackpoint_in';
            div.appendChild(innerDiv);
            map.getPanes().labelPane.appendChild(div);
            return div;
        };
        this.trackPointOverlay.prototype.draw = function () {
            let map = this._map;
            let pixel = map.pointToOverlayPixel(this._point);
            this._div.style.left = pixel.x - 8 + 'px';
            this._div.style.top  = pixel.y  - 8 + 'px';
        };
    },

    /**
     * 添加轨迹点信息覆盖物
     *
     * @param {Object} point 点
     * @param {string} type 点类型
     */
    addTrackPointOverlay: function(point, type) {
        let myCompOverlay = new this.trackPointOverlay(point, type);
        map.addOverlay(myCompOverlay);
    },

    /**
     * 删除轨迹点信息覆盖物
     *
     * @param {string} type 类型，分为鼠标浮动和点击两种
     */
    removeTrackPointOverlay: function(type) {
        let overlays = map.getOverlays();
        let length = overlays.length;
        let trackPointOverlays = [];
        for (let i = 0; i < length; i++) {
            if (overlays[i].type === type) {
                trackPointOverlays.push(overlays[i]);
            }
        }
        for (let j = 0; j < trackPointOverlays.length; j++) {
            map.removeOverlay(trackPointOverlays[j]);
        }
    },
    /**
     * 初始化车辆信息详情和轨迹点详情infobox
     *
     * @param {Object} data 数据
     */
    setTrackInfoBox: function(data) {
        let infoContentFrontArr = [
            '<div class="carInfoWindow">',
            '<div class="carInfoHeader0">',
            '<abbr title="' + data.print + '">',
            data.print,
            '</abbr>',
            '</div>',
            '<div class="carInfoContent">'
        ];
        data.infor.map(function (item) {
            let itemPushArr = [
                '<div class="carInfoItem">',
                '<div class="infoItemTitle">',
                item[0],
                '</div>',
                '<div class="infoItemContent">',
                item[1],
                '</div>',
                '</div>'
            ];
            infoContentFrontArr.push(itemPushArr.join(''));
        });
        let infoContentNextArr = [
            '</div>',
            '</div>'
        ];

        this.trackInfoBox = new BMapLib.InfoBox(
            map,
            infoContentFrontArr.concat(infoContentNextArr).join(''),
            {
                boxClass:'carInfoBox',
                closeIconMargin: '15px 20px 0 0',
                alignBottom: false,
                closeIconUrl: __uri('/static/images/closeinfowindow.png')
            }
        );
        map.addEventListener('click', function () {
            $('div').remove('.carInfoBox');
            $('div').remove('.trackpointonOverlay');
        });
        this.trackInfoBox.open(data.point);

        map.panTo(data.point);
    },

    /**
     * 删除infobox
     *
     */
    removeTrackInfoBox: function() {
        map.removeOverlay(this.trackInfoBox);
        this.trackInfoBox = null;
    },
    /**
     * 把屏幕分为 width * height 个区域，获取经纬度对应坐标点
     * @param lnglat 经纬度
     * @returns {*} XY坐标点
     */
    lngLatToPoint:function (lnglat) {
        return window.map.getMapType().getProjection().lngLatToPoint(lnglat);
    },
    /**
     * 初始化绘制工具
     */
    initDrawingManager:function (action) {
        let that = this;
        let dmScript = document.createElement('script');
        dmScript.src = 'https://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js';
        document.getElementsByTagName('head')[0].appendChild(dmScript);
        dmScript.onload = dmScript.onreadystatechange = function () {
            let styleOptions = {

            }
            window.drawingManager = new BMapLib.DrawingManager(map, {
                isOpen: false, //是否开启绘制模式
                enableDrawingTool: false, //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                },
                circleOptions: styleOptions, //圆的样式
                polylineOptions: styleOptions, //线的样式
                polygonOptions: styleOptions, //多边形的样式
                rectangleOptions: styleOptions //矩形的样式
            });
            that.setDrawingListen(action);
        }
    },
    /**
     * 设置绘制完成监听事件
     * @param fun 监听完成处理方法
     */
    setDrawingListen:function (action) {
        drawingManager.addEventListener("overlaycomplete",function (e) {
            action.setoverlay(e);
        });
    },
    /**
     *设置绘制方式
     * @param type
     */
    setDrawingMode:function (type) {
        switch (type){
            case 1:
                drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);//设置画笔为画多边形画笔
                drawingManager.open();
                break;
            case 2:
                drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);//设置画笔为画线画笔
                drawingManager.open();
                break;
            default:
                drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);//设置画笔默认为画多边形画笔
                drawingManager.open();
                break;
        }
    },
    /**
     * 清除绘制图形
     * @param overlays
     */
    clearDrawing:function (overlay) {
        map.removeOverlay(overlay);
    },
    /**
     * 检查点是否在多边形内
     * @param point 需要检查的点
     * @param polygon 需要验证的多边形(已实例化new BMap.Polygon(points))
     * @returns {*}
     */
    checkPointOnPolygon:function (point,polygon) {
        let cPoint = new BMap.Point(point.longitude,point.latitude);
        return BMapLib.GeoUtils.isPointInPolygon(cPoint, polygon);
    },
    /**
     * 绘制指定点到地图上
     * @param points
     * @param overlays
     */
    drawPoints:function (points,overlays) {
        for(let i = 0; i < points.length; i++){
            let point = points[i];
            let cPoint = new BMap.Point(point.longitude,point.latitude);
            let carIcon = new BMap.Icon(__uri("/static/images/dingw.png"), new BMap.Size(48, 48), {anchor: new BMap.Size(24, 48)});
            let carLabelStyle = { padding : "0 10px",lineHeight : "24px",borderRadius:"0 12px 12px 12px",border:"none",background: "rgba(10,188,16,.8)",color:"#fff",maxWidth:"none"};
            var carPoint = new BMap.Marker(cPoint,{icon:carIcon});
            let carLabel = new BMap.Label(point.car_no,{
                offset : new BMap.Size(25, 50)
            });
            carLabel.setStyle(carLabelStyle);
            carPoint.setLabel(carLabel);
            this.initFenceInfoWindow(carPoint,point);
            this.fenceCarClickTrigger(carPoint);
            overlays.push(carPoint);
            map.addOverlay(carPoint);
        }
    },
    /**
     * 初始化越界的信息窗口
     * @param marker
     * @param carInfo 车辆信息
     */
    initFenceInfoWindow:function (marker,carInfo) {
        let address = '@addr@';
        let addHtml = [];
        addHtml.push('<div class="map-dialog-box">');
        addHtml.push('    <div class="dialog-text">');
        addHtml.push('        <p>触发时间：<span class="span-con">'+ carInfo.create_time +'</span></p>');
        addHtml.push('        <p>触发地点：<span class="span-con">'+address+'</span></p>');
        if(carInfo.rule){
            addHtml.push('        <p>触发规则：<span class="span-con">'+ carInfo.rule +'</span></p>');
        }
        if(carInfo.speeding){
            addHtml.push('        <p>触发规则：<span class="span-con">超速</span></p>');
            addHtml.push('        <p>最高时速：<span class="span-con">' + carInfo.maxspeed + 'Km/h</span></p>');
            addHtml.push('        <p>持续时长：<span class="span-con">' + carInfo.lasttime + '</span></p>');
        }
        if(carInfo.driver){
            addHtml.push('        <p>驾驶员：<span class="span-con">'+ carInfo.driver +'</span></p>');
        }
        addHtml.push('    </div>');
        addHtml.push('</div>');

        let opts = {width : 280,height: 150,offset:new BMap.Size(0, -48)}
        marker.infowindow =  new BMap.InfoWindow(addHtml.join(""), opts);
        marker.infowindow.point = new BMap.Point(carInfo.longitude,carInfo.latitude);
    },
    /**
     * 越界查询点击车辆触发的事件
     * @param marker
     */
    fenceCarClickTrigger:function (car) {
        let that = car;
        car.addEventListener("click",function(e){
            let infoWindow = that.infowindow;
            let geoc = new BMap.Geocoder();
            geoc.getLocation(infoWindow.point, function(rs) {
                let gpsAddress = rs.addressComponents;
                let address = gpsAddress.city + "" + gpsAddress.district + "" + gpsAddress.street + "" + gpsAddress.streetNumber;
                address = !!address ? address : '位置信息获取异常';
                let tmpHtml = infoWindow.getContent().replace('@addr@',address);
                infoWindow.setContent(tmpHtml);
                map.openInfoWindow(infoWindow,infoWindow.point);
            });
        });
    },
    /**
     * 绘制指定区域到地图上 包括点、区域、线条   主要用于在地图上显示公司名称、公司区域等
     * @param data 需要绘制的区域数据
     * @param overlays
     */
    drawRegionPoints:function (datas,overlays) {
        for(var i = 0; i < datas.length; i++){
            let data = datas[i];
            if(data.drawing === "marker"){//现在只有画点的需求
                let point = data.regionRelation[0];
                let rPoint = new BMap.Point(point.lon,point.lat);
                let rMarker = new BMap.Marker(rPoint);
                let rLabel = new BMap.Label(data.name,{
                    offset : new BMap.Size(-100, 25)
                });
                let labelStyle = { padding : "0 10px",lineHeight : "24px",borderRadius:"0 12px 12px 12px",border:"none",background: "rgba(10,188,16,.8)",color:"#fff",maxWidth:"none"};
                rLabel.setStyle(labelStyle);
                rMarker.setLabel(rLabel);
                map.addOverlay(rMarker);
            }
        }
    },
    /**
     * 清楚地图全部覆盖物
     * @param
     */
    clearOverlays:function () {
        map.clearOverlays();
    },
}
