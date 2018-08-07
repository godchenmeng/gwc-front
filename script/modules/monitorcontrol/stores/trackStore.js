/**
 * @file 历史轨迹管理台Reflux Store
 * @author CM 2017.07.24
 */
import CommonFun from '../../../common/commonfun';
import CommonStore from '../../common/stores/commonStore';

import TrackAction from '../actions/trackAction'
import Urls from '../../../common/urls';

var TrackStore = Reflux.createStore({
    listenables: [TrackAction],
    init: function() {
    },
    data: {
        isFirstimeLoadMarkers: true,//是否第一次加载地图MARKER
        allTrackRoutePoint: [], //所有的轨迹点集合
        runCar: null, //轨迹回放的车对象
        trackRoutePoint:[], //监控中的轨迹点集合
        allDriverLine:[], //所有的行车路段集合
        allAlertInfo:[], //所有的警报事件集合
        allSanJiInfo:[], //所有的三急事件集合
        deviceInfo:null,//当前车辆绑定的设备信息
    },
    /**
     * 获取车辆轨迹信息
     * @param carNo 车牌号
     * @param selDate 查询日期
     */
    onSearchtrack:function (carNo,selDate) {
        let that = this;
        let param = {
            car:'',
            car_no:carNo,
            time:selDate
        };
        Urls.post(Urls.searchtrack,param,function (result) {
            if (result.status == 400) {
                $('#loading').modal('hide');
                mapControl.clearOverlays();
                that.trigger('clearTrack', result);
                toastr.warning("此车辆未绑定设备!");
            }else if(result.status == 404){
                $('#loading').modal('hide');
                mapControl.clearOverlays();
                that.trigger('clearTrack', result);
                toastr.warning("无此车辆，请输入正确的车牌信息");
            }else if(result.status == 401){
                $('#loading').modal('hide');
                mapControl.clearOverlays();
                that.trigger('clearTrack', result);
                toastr.warning("此车辆当日无轨迹信息");
            }else{
                //$('#loading').modal('hide');
                that.trigger('cartrack', result);
                that.data.allDriverLine = result.allDriverLine;
                that.data.allAlertInfo = result.alertInfo;
                that.data.allSanJiInfo = result.sanJi;

                that.onSearchtrackgps(result.device,result.todayDriverLine.start,result.todayDriverLine.end);
                mapControl.initTrackPointOverlay();
            }
        });
    },
    /**
     *  响应Action searchtrackgps 查询车辆轨迹GPS信息
     * @param deviceID 车辆设备ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param allTime 查询时段的总时间长度(毫秒)
     */
    onSearchtrackgps:function (deviceID,startTime,endTime) {
        let that = this;
        let param = {
            entity_name:deviceID,
            start_time: new Date(startTime).getTime() / 1000,
            end_time: new Date(endTime).getTime() / 1000
        };
        Urls.post(Urls.searchtrackgps,param,function (result) {
            let status = result.status;
            if (status == '0') {
            that.data.allTrackRoutePoint = result.points;
            that.data.deviceInfo = result.driverInfo[0];
            that.onGettrackgps(startTime, endTime);
            that.setPointTrackInfo();
            that.onSetTrackInfoBox(0);
        }else{
                $('#loading').modal('hide');
                that.trigger('clearTrack', result);
                toastr.warning("此车辆当日无轨迹信息");
            }
        })
    },
    /**
     * 响应 Action gettrackgps 查询车辆分段轨迹GPS信息
     * @param startTime
     * @param endTime
     */
    onGettrackgps:function (startTime,endTime) {
        let that = this;
        let start_time = new Date(startTime).getTime() / 1000;
        let end_time = new Date(endTime).getTime() / 1000;
        let arrPois = []; //轨迹MAP坐标点集合
        let runSpeed = []; //点上的行驶实时速度集合
        let runDistance = []; //行驶距离集合
        let allDistance = 0; //轨迹的总长度
        let allTime = 0; //轨迹总行程时间
        that.data.trackRoutePoint = [];
        for(let i = 0; i < that.data.allDriverLine.length; i++){
            let tmpLine = that.data.allDriverLine[i];
            if((new Date(tmpLine.start).getTime() / 1000 <= start_time || new Date(tmpLine.start).getTime() / 1000 <= end_time)
                && (new Date(tmpLine.end).getTime() / 1000 >= start_time || new Date(tmpLine.end).getTime() / 1000 >= end_time)){
                let divTime = new Date(tmpLine.end).getTime() - new Date(tmpLine.start).getTime();
                allTime += divTime;
            }
        }
        for(let i = 0; i < that.data.allTrackRoutePoint.length; i++){
            let tmpPoint = that.data.allTrackRoutePoint[i];
            if(tmpPoint.loc_time >= start_time && tmpPoint.loc_time <= end_time){
                if(that.data.trackRoutePoint.length > 1){
                    let lastTmpPoint = that.data.trackRoutePoint[that.data.trackRoutePoint.length - 2];
                    let pxB = mapControl.lngLatToPoint(new BMap.Point(tmpPoint.longitude, tmpPoint.latitude));
                    let pxA = mapControl.lngLatToPoint(new BMap.Point(lastTmpPoint.longitude, lastTmpPoint.latitude));
                    let pointDistance = Math.sqrt(Math.pow(pxA.x - pxB.x, 2) + Math.pow(pxA.y - pxB.y, 2));
                    allDistance += pointDistance;
                }
                tmpPoint.index = i;
                that.data.trackRoutePoint.push(tmpPoint);
                arrPois.push(new BMap.Point(tmpPoint.longitude,tmpPoint.latitude));
                runSpeed.push(tmpPoint.speed);
                runDistance.push(allDistance);
            }
        }
        that.drawTrack();
        that.trigger('settimeline',allTime);
        let stepSpeed = (allTime / 1000) / allDistance; // stepSpeed秒/m 间隔步长
        that.setRunCar(arrPois, runSpeed, runDistance, stepSpeed);
        $('#loading').modal('hide');
    },
    /**
     * 响应Action getaddress 进行地址解析
     *
     * @param {Object} point 点对象
     */
    onGetcaraddress:function (point) {
        let that = this;
        let param = {
            ak:Urls.baiduAK,
            location: point.lat + ',' + point.lng,
            output: 'json'
        };
        Urls.jsonp(Urls.getCarAddress, param, function (data) {
            let infoBoxObject = that.getTrackPointInfo(data, point);
            mapControl.setTrackInfoBox(infoBoxObject);
        });
    },
    /**
     * 响应Action setTrackInfoBox 设置坐标事件表格
     *
     * @param {Object} nowIndex 当前坐标点索引
     */
    onSetTrackInfoBox:function (nowIndex) {
        let showTrackInfo = [];
        showTrackInfo.push(this.data.trackRoutePoint[nowIndex]);
        if(nowIndex + 1 < this.data.trackRoutePoint.length){
            showTrackInfo.push(this.data.trackRoutePoint[nowIndex + 1]);
        }
        this.trigger('settrackinfobox',showTrackInfo);
    },
    /**
     * 设置坐标点信息
     */
    setPointTrackInfo:function () {
        let that = this;
        let startDistance = 0;
        let countDivTime = 0;//距离上次停车时间
        let geoc = new BMap.Geocoder();
        for(let i = 0; i < that.data.allTrackRoutePoint.length; i++){
            let tmpPoint = that.data.allTrackRoutePoint[i];
            tmpPoint.timeText = CommonFun.getLocalTime(tmpPoint.loc_time);
            tmpPoint.distanceText = '0 Km';
            tmpPoint.gpsText = tmpPoint.latitude + ',' + tmpPoint.longitude;
            if(i > 0){
                let lastTmpPoint = that.data.allTrackRoutePoint[i - 1];
                let divDistance = (tmpPoint.mileage - startDistance);
                tmpPoint.distanceText = divDistance.toFixed(2) + ' Km';
            }else{
                startDistance = tmpPoint.mileage;
            }
            if(i < that.data.allTrackRoutePoint.length - 1){
                let nextTmpPoint = that.data.allTrackRoutePoint[i + 1];
                //获取车辆方向
                tmpPoint.directText = CommonFun.getDirection(nextTmpPoint.direction);

                //获取车辆ACC时间
                if(tmpPoint.acc == 1 && nextTmpPoint.acc == 0){
                    countDivTime = tmpPoint.loc_time;
                    tmpPoint.accText = "ACC开 定位";
                }else if(tmpPoint.acc == 0){
                    tmpPoint.accText = "ACC关 停车时间：" + CommonFun.formatTime(tmpPoint.loc_time - countDivTime);
                    if(nextTmpPoint.acc == 1){
                        countDivTime = 0;
                    }
                }else{
                    tmpPoint.accText = "ACC开 定位";
                }

                //匹配三急数据
                tmpPoint.sanJiJiaSu = 0;
                tmpPoint.sanJiJianSu = 0;
                tmpPoint.sanJiZhuanWan = 0;
                for(let j = 0; j < that.data.allSanJiInfo.length; j++){
                    let tmpSanji = that.data.allSanJiInfo[j];
                    if((tmpSanji.senddate.time / 1000) >= tmpPoint.loc_time && (tmpSanji.senddate.time / 1000) < nextTmpPoint.loc_time){
                        switch (tmpSanji.alm_id){
                            case  '0111':
                                tmpPoint.sanJiJiaSu = 1;
                                break;
                            case '0112':
                                tmpPoint.sanJiJianSu = 1;
                                break;
                            case '0113':
                                tmpPoint.sanJiZhuanWan = 1;
                                break;
                        }
                    }
                }

                //匹配触发事件
                tmpPoint.eventText = '';
                for(let j = 0; j < that.data.allAlertInfo.length; j++){
                    let tmpAlertInfo = that.data.allAlertInfo[j];
                    if((new Date(tmpAlertInfo.happen_time).getTime() / 1000) >= tmpPoint.loc_time && (new Date(tmpAlertInfo.happen_time).getTime() / 1000) < nextTmpPoint.loc_time) {
                        switch (tmpAlertInfo.illegal_type){
                            case  '0':
                                tmpPoint.eventText = '违章行驶';
                                break;
                            case '1':
                                tmpPoint.eventText = '越界行驶';
                                break;
                            case '2':
                                tmpPoint.eventText = '超速行驶';
                                break;
                            case '3':
                                tmpPoint.eventText = '非规定时段行驶';
                                break;
                            case '4':
                                tmpPoint.eventText = '拔出设备报警';
                                break;
                        }
                    }
                }
            }
            that.data.allTrackRoutePoint[i] = tmpPoint;
        }

    },
    /**
     * 绘制轨迹运行路线
     */
    drawTrack:function () {
        let that = this;
        let points = that.data.trackRoutePoint;
        let totalPoints = [];
        let starttime = '';
        let endtime = '';

        if (points.length === 0) {
            return;
        }
        if (!starttime) {
            starttime = points[0].loc_time;
        }
        if (!endtime) {
            endtime = points[points.length -  1].loc_time;
        }
        for (let i = 0; i < points.length; i++) {
            if (points[i].loc_time >= starttime && points[i].loc_time <= endtime) {
                let tempPoint = new BMap.Point(points[i].longitude, points[i].latitude);
                tempPoint.speed = points[i].speed ? points[i].speed : 0;
                tempPoint.loc_time = points[i].loc_time;
                tempPoint.printTime = CommonFun.getLocalTime(points[i].loc_time);
                tempPoint.printSpeed = points[i].speed.toFixed(1) + 'Km/h';
                tempPoint.lnglat = points[i].longitude.toFixed(2) + ',' + points[i].latitude.toFixed(2);
                tempPoint.fuel = points[i].fuel ? points[i].fuel - (points[0].fuel ? points[0].fuel : 0) : 0;
                tempPoint.mileage = points[i].mileage ? points[i].mileage - (points[0].mileage ? points[0].mileage : 0) : 0;
                totalPoints.push(tempPoint);
            }
        }
        map.setViewport(totalPoints, {margins: [80, 0, 0, 200]});

        let updatePointer = function () {
            let nextArray = [];
            let ctx = this.canvas.getContext('2d');
            if (!ctx) {
                return;
            }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            if (totalPoints.length !== 0) {
                var lines = 1;
                let lineObj = {};
                let pixelPart = 0;
                const pixelPartUnit = 40;
                for (let i = 0, len = totalPoints.length; i < len - 1; i = i + 1) {
                    let pixel = map.pointToPixel(totalPoints[i]);
                    let nextPixel = map.pointToPixel(totalPoints[i + 1]);
                    pixelPart = pixelPart + Math.pow(Math.pow(nextPixel.x - pixel.x, 2) + Math.pow(nextPixel.y - pixel.y, 2), 0.5);
                    if (pixelPart <= pixelPartUnit) {
                        continue;
                    }
                    pixelPart = 0;
                    ctx.beginPath();

                    if (totalPoints[i + 1].loc_time - totalPoints[i].loc_time <= 5 * 60) {
                        // 箭头一共需要5个点：起点、终点、中心点、箭头端点1、箭头端点2

                        let midPixel = new BMap.Pixel(
                            (pixel.x + nextPixel.x) / 2,
                            (pixel.y + nextPixel.y) / 2
                        );

                        // 起点终点距离
                        let distance = Math.pow((Math.pow(nextPixel.x - pixel.x, 2) + Math.pow(nextPixel.y - pixel.y, 2)), 0.5);
                        // 箭头长度
                        let pointerLong = 4;
                        let aPixel = {};
                        let bPixel = {};
                        if (nextPixel.x - pixel.x === 0) {
                            if (nextPixel.y - pixel.y > 0) {
                                aPixel.x = midPixel.x - pointerLong * Math.pow(0.5, 0.5);
                                aPixel.y = midPixel.y - pointerLong * Math.pow(0.5, 0.5);
                                bPixel.x = midPixel.x + pointerLong * Math.pow(0.5, 0.5);
                                bPixel.y = midPixel.y - pointerLong * Math.pow(0.5, 0.5);
                            } else if (nextPixel.y - pixel.y < 0) {
                                aPixel.x = midPixel.x - pointerLong * Math.pow(0.5, 0.5);
                                aPixel.y = midPixel.y + pointerLong * Math.pow(0.5, 0.5);
                                bPixel.x = midPixel.x + pointerLong * Math.pow(0.5, 0.5);
                                bPixel.y = midPixel.y + pointerLong * Math.pow(0.5, 0.5);
                            } else {
                                continue;
                            }
                        } else {
                            let k0 = ((-Math.pow(2, 0.5) * distance * pointerLong + 2 * (nextPixel.y - pixel.y) * midPixel.y) / (2 * (nextPixel.x - pixel.x))) + midPixel.x;
                            let k1 = -((nextPixel.y - pixel.y) / (nextPixel.x - pixel.x));
                            let a = Math.pow(k1, 2) + 1;
                            let b = 2 * k1 * (k0 - midPixel.x) - 2 * midPixel.y;
                            let c = Math.pow(k0 - midPixel.x, 2) + Math.pow(midPixel.y, 2) - Math.pow(pointerLong, 2);

                            aPixel.y = (-b + Math.pow(b * b - 4 * a * c, 0.5)) / (2 * a);
                            bPixel.y = (-b - Math.pow(b * b - 4 * a * c, 0.5)) / (2 * a);
                            aPixel.x = k1 * aPixel.y + k0;
                            bPixel.x = k1 * bPixel.y + k0;
                        }
                        ctx.moveTo(aPixel.x, aPixel.y);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = '#eee';
                        ctx.lineTo(midPixel.x, midPixel.y);
                        ctx.lineTo(bPixel.x, bPixel.y);
                        ctx.lineCap = 'round';
                    }
                    if (totalPoints[i].loc_time >= starttime && totalPoints[i + 1].loc_time <= endtime) {
                        ctx.stroke();
                    }
                }
            }
        };
        let updateBack = function () {
            let nextArray = [];
            let ctx = this.canvas.getContext('2d');
            if (!ctx) {
                return;
            }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            if (totalPoints.length !== 0) {
                var lines = 1;
                let lineObj = {};

                for (let i = 0, len = totalPoints.length; i < len - 1; i++) {

                    let pixel = map.pointToPixel(totalPoints[i]);
                    let nextPixel = map.pointToPixel(totalPoints[i + 1]);
                    ctx.beginPath();

                    ctx.moveTo(pixel.x, pixel.y);
                    //防止时间条过长，小车跑动时间不准确，设置最多两点间不能超过5分钟。
                    // if (totalPoints[i + 1].loc_time - totalPoints[i].loc_time <= 5 * 60) {
                    if (true) {
                        // 绘制轨迹的时候绘制两次line，一次是底色，一次是带速度颜色的。目的是实现边框效果
                        ctx.lineWidth = 10;
                        ctx.strokeStyle = '#8b8b89';
                        ctx.lineTo(nextPixel.x, nextPixel.y);
                        ctx.lineCap = 'round';

                    } else {
                        lines = lines + 1;
                        let lineNum = lines;
                        nextArray.push([pixel, nextPixel]);
                    }
                    if (totalPoints[i].loc_time >= starttime && totalPoints[i + 1].loc_time <= endtime) {
                        ctx.stroke();
                    }

                }
            }
        };
        let update = function () {
            let nextArray = [];
            let ctx = this.canvas.getContext('2d');
            if (!ctx) {
                return;
            }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            if (totalPoints.length !== 0) {
                var lines = 1;
                let lineObj = {};
                for (let i = 0, len = totalPoints.length; i < len - 1; i++) {

                    let pixel = map.pointToPixel(totalPoints[i]);
                    let nextPixel = map.pointToPixel(totalPoints[i + 1]);
                    ctx.beginPath();
                    ctx.moveTo(pixel.x, pixel.y);
                    // if (totalPoints[i + 1].loc_time - totalPoints[i].loc_time <= 5 * 60) {
                    if (true) {
                        // 绘制带速度颜色的轨迹
                        ctx.lineCap = 'round';
                        ctx.lineWidth = 8;
                        let grd = ctx.createLinearGradient(pixel.x, pixel.y, nextPixel.x, nextPixel.y);
                        let speed = totalPoints[i].speed;
                        let speedNext = totalPoints[i + 1].speed;
                        grd.addColorStop(0, that.getColorBySpeed(speed));
                        grd.addColorStop(1, that.getColorBySpeed(speedNext));
                        ctx.strokeStyle = grd;
                        ctx.lineTo(nextPixel.x, nextPixel.y);
                    } else {
                        lines = lines + 1;
                        let lineNum = lines;
                        nextArray.push([pixel, nextPixel]);
                    }
                    if (totalPoints[i].loc_time >= starttime && totalPoints[i + 1].loc_time <= endtime) {
                        ctx.stroke();
                    }

                }
            }

            if (totalPoints[0].loc_time >= starttime) {
                let imgStart = new Image();
                imgStart.src = __uri('/static/images/startpoint.png');
                imgStart.onload = function () {
                    let width = [4, 8];
                    ctx.drawImage(imgStart, map.pointToPixel(totalPoints[0]).x - 10, map.pointToPixel(totalPoints[0]).y - 30);
                    ctx.font = 'lighter 14px arial';
                    ctx.fillStyle = 'white';
                    ctx.fillText('始', map.pointToPixel(totalPoints[0]).x - 6, map.pointToPixel(totalPoints[0]).y - 15);
                };
            }
            if (totalPoints[totalPoints.length - 1].loc_time <= endtime) {
                let imgEnd = new Image();
                imgEnd.src = __uri('/static/images/endpoint.png');
                imgEnd.onload = function () {
                    let width = [4, 8];
                    ctx.drawImage(imgEnd, map.pointToPixel(totalPoints[totalPoints.length - 1]).x - 10, map.pointToPixel(totalPoints[totalPoints.length - 1]).y - 30);
                    ctx.font = 'lighter 14px arial';
                    ctx.fillStyle = 'white';
                    ctx.fillText('终', map.pointToPixel(totalPoints[totalPoints.length - 1]).x - 6, map.pointToPixel(totalPoints[totalPoints.length - 1]).y - 15);
                };
            }
        }
        if (totalPoints.length > 0) {
            if(typeof(canvasLayer) !== 'undefined' || typeof(canvasLayerBack) !== 'undefined' || typeof(CanvasLayerPointer) !== 'undefined') {
                map.removeOverlay(CanvasLayerPointer);
                map.removeOverlay(canvasLayer);
                map.removeOverlay(canvasLayerBack);

            }
            window.canvasLayerBack =  new CanvasLayer({
                map: map,
                update: updateBack
            });
            window.canvasLayer =  new CanvasLayer({
                map: map,
                update: update
            });
            window.CanvasLayerPointer =  new CanvasLayer({
                map: map,
                update: updatePointer
            });

        }


        if (typeof(pointCollection) !== 'undefined') {
            map.removeOverlay(pointCollection);
        }
        let options = {
            size: BMAP_POINT_SIZE_HUGE,
            shape: BMAP_POINT_SHAPE_CIRCLE,
            color: 'rgba(0, 0, 0, 0)'
        };
        window.pointCollection = new BMap.PointCollection(totalPoints, options);  // 初始化PointCollection
        pointCollection.addEventListener('mouseover', function (e) {
            mapControl.addTrackPointOverlay(e.point, 'trackpointOverlay');
        });
        pointCollection.addEventListener('mouseout', function (e) {
            mapControl.removeTrackPointOverlay('trackpointOverlay');
        });
        pointCollection.addEventListener('click', function (e) {
            mapControl.removeTrackInfoBox();
            TrackAction.getcaraddress(e.point);
            mapControl.removeTrackPointOverlay('trackpointonOverlay');
            mapControl.addTrackPointOverlay(e.point, 'trackpointonOverlay');

        });
        map.addOverlay(pointCollection);  // 添加Overlay
    },
    /**
     * view内部方法，根据速度获取对应的轨迹绘制颜色
     *
     * @param {number} speed 速度
     *
     * @return {string} 颜色RGB字符串
     */
    getColorBySpeed: function(speed) {
        var color = '';
        var red = 0;
        var green = 0;
        var blue = 0;
        speed = speed > 50 ? 50 : speed;
        switch (Math.ceil(speed / 16)) {
            case 0:
                red = 187;
                green = 0;
                blue = 0;

                break;
            case 1:
                speed = speed;
                red = 187 + Math.ceil((241 - 187) / 25 * speed);
                green = 0 + Math.ceil((48 - 0) / 25 * speed);
                blue = 0 + Math.ceil((48 - 0) / 25 * speed);
                break;
            case 2:
                speed = speed - 16;
                red = 241 + Math.ceil((255 - 241) / 25 * speed);
                green = 48 + Math.ceil((200 - 48) / 25 * speed);
                blue = 48 + Math.ceil((0 - 48) / 25 * speed);
                break;
            case 3:
                speed = speed - 32;
                red = 255 + Math.ceil((22 - 255) / 25 * speed);
                green = 200 + Math.ceil((191 - 200) / 25 * speed);
                blue = 0 + Math.ceil((43 - 0) / 25 * speed);
                break;
            case 4:
                red = 22;
                green = 191;
                blue = 43;
                break;
        }
        red = red.toString(16).length === 1 ? '0' + red.toString(16) : red.toString(16);
        green = green.toString(16).length === 1 ? '0' + green.toString(16) : green.toString(16);
        blue = blue.toString(16).length === 1 ? '0' + blue.toString(16) : blue.toString(16);
        color = '#' + red + green + blue;
        return color;
    },
    /**
     * store 内部，整合轨迹点信息窗口的数据格式
     *
     * @param {Object} data 逆地址解析返回的结果
     * @param {Object} point 轨迹点对象数据
     *
     * @return {Object} 轨迹点信息窗口所需数据
     */
     getTrackPointInfo: function(data, point) {
        let address = '';
        if (data.status === 0) {
            if (data.result.formatted_address !== '') {
                address = data.result.formatted_address;
            } else {
                address = data.result.addressComponent.city + ', ' + data.result.addressComponent.country;
            }
        } else {
            address = '地址未解析成功';
        }
        let infoBoxObject = {
            point: point,
            print: point.print,
            infor: [
                ['地址:', address],
                ['速度:', point.printSpeed],
                ['时间:', point.printTime]
            ]
        };
        return infoBoxObject;
    },
    setRunCar: function(arrPois,runSpeed,runDistance,stepSpeed) {
        if(this.data.runCar){
            this.data.runCar.stop();
            this.trigger('resettimeline');
        }
        let carTypeCode = CommonStore.getCarTypeCodeByDevice(this.data.deviceInfo.device);
        let iconUri = __uri('/static/images/carruneast.png');
        if(carTypeCode) iconUri = "/static/images/car/east/run-"+carTypeCode+"-east.png";
        this.data.runCar = new BMapLib.LuShu(map,arrPois,{
            autoView:true,//是否开启自动视野调整，如果开启那么小车在运动过程中会根据视野自动调整
            icon  : iconUri,
            speed: stepSpeed,
            runSpeed: runSpeed,
            runDistance: runDistance,
            playBarObj: $.playBar.Begin(),
            enableRotation:true//是否设置小车随着道路的走向进行旋转
        });
    },
});

export default TrackStore