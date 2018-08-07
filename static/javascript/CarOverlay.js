/**
 * @fileoverview 百度地图的轨迹跟随类，对外开放。
 * 用户可以在地图上自定义轨迹运动
 * 可以自定义路过某个点的图片，文字介绍等。
 * 主入口类是<a href="symbols/BMapLib.RunCar.html">RunCar</a>，
 * 基于Baidu Map API 1.2。.
 *
 * @author Baidu Map Api Group CM修改集成入公车系统
 * @version 1.2
 */

/**
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib = window.BMapLib = BMapLib || {};

(function() {
    //声明baidu包
    var T, baidu = T = baidu || {version: '2.0.0'};
    baidu.guid = '$BAIDU$';
    //以下方法为百度Tangram框架中的方法，请到http://tangram.baidu.com 查看文档
    (function() {
        window[baidu.guid] = window[baidu.guid] || {};
        baidu.dom = baidu.dom || {};
        baidu.dom.g = function(id) {
            if ('string' == typeof id || id instanceof String) {
                return document.getElementById(id);
            } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
                return id;
            }
            return null;
        };
        baidu.g = baidu.G = baidu.dom.g;
        baidu.lang = baidu.lang || {};
        baidu.lang.isString = function(source) {
            return '[object String]' == Object.prototype.toString.call(source);
        };
        baidu.isString = baidu.lang.isString;
        baidu.dom._g = function(id) {
            if (baidu.lang.isString(id)) {
                return document.getElementById(id);
            }
            return id;
        };
        baidu._g = baidu.dom._g;
        baidu.dom.getDocument = function(element) {
            element = baidu.dom.g(element);
            return element.nodeType == 9 ? element : element.ownerDocument || element.document;
        };
        baidu.browser = baidu.browser || {};
        baidu.browser.ie = baidu.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;
        baidu.dom.getComputedStyle = function(element, key) {
            element = baidu.dom._g(element);
            var doc = baidu.dom.getDocument(element),
                styles;
            if (doc.defaultView && doc.defaultView.getComputedStyle) {
                styles = doc.defaultView.getComputedStyle(element, null);
                if (styles) {
                    return styles[key] || styles.getPropertyValue(key);
                }
            }
            return '';
        };
        baidu.dom._styleFixer = baidu.dom._styleFixer || {};
        baidu.dom._styleFilter = baidu.dom._styleFilter || [];
        baidu.dom._styleFilter.filter = function(key, value, method) {
            for (var i = 0, filters = baidu.dom._styleFilter, filter; filter = filters[i]; i++) {
                if (filter = filter[method]) {
                    value = filter(key, value);
                }
            }
            return value;
        };
        baidu.string = baidu.string || {};


        baidu.string.toCamelCase = function(source) {

            if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
                return source;
            }
            return source.replace(/[-_][^-_]/g, function(match) {
                return match.charAt(1).toUpperCase();
            });
        };
        baidu.dom.getStyle = function(element, key) {
            var dom = baidu.dom;
            element = dom.g(element);
            key = baidu.string.toCamelCase(key);

            var value = element.style[key] ||
                (element.currentStyle ? element.currentStyle[key] : '') ||
                dom.getComputedStyle(element, key);

            if (!value) {
                var fixer = dom._styleFixer[key];
                if (fixer) {
                    value = fixer.get ? fixer.get(element) : baidu.dom.getStyle(element, fixer);
                }
            }

            if (fixer = dom._styleFilter) {
                value = fixer.filter(key, value, 'get');
            }
            return value;
        };
        baidu.getStyle = baidu.dom.getStyle;
        baidu.dom._NAME_ATTRS = (function() {
            var result = {
                'cellpadding': 'cellPadding',
                'cellspacing': 'cellSpacing',
                'colspan': 'colSpan',
                'rowspan': 'rowSpan',
                'valign': 'vAlign',
                'usemap': 'useMap',
                'frameborder': 'frameBorder'
            };

            if (baidu.browser.ie < 8) {
                result['for'] = 'htmlFor';
                result['class'] = 'className';
            } else {
                result['htmlFor'] = 'for';
                result['className'] = 'class';
            }

            return result;
        })();
        baidu.dom.setAttr = function(element, key, value) {
            element = baidu.dom.g(element);
            if ('style' == key) {
                element.style.cssText = value;
            } else {
                key = baidu.dom._NAME_ATTRS[key] || key;
                element.setAttribute(key, value);
            }
            return element;
        };
        baidu.setAttr = baidu.dom.setAttr;
        baidu.dom.setAttrs = function(element, attributes) {
            element = baidu.dom.g(element);
            for (var key in attributes) {
                baidu.dom.setAttr(element, key, attributes[key]);
            }
            return element;
        };
        baidu.setAttrs = baidu.dom.setAttrs;
        baidu.dom.create = function(tagName, opt_attributes) {
            var el = document.createElement(tagName),
                attributes = opt_attributes || {};
            return baidu.dom.setAttrs(el, attributes);
        };
        baidu.object = baidu.object || {};
        baidu.extend =
            baidu.object.extend = function(target, source) {
                for (var p in source) {
                    if (source.hasOwnProperty(p)) {
                        target[p] = source[p];
                    }
                }
                return target;
            };
    })();

    /**
     * @exports RunCar as BMapLib.RunCar
     */
    var RunCar =
        /**
         * RunCar类的构造函数
         * @class RunCar <b>入口</b>。
         * 实例化该类后，可调用,start,end,pause等方法控制覆盖物的运动。

         * @constructor
         * @param {Map} map Baidu map的实例对象.
         * @param {Array} path 构成路线的point的数组.
         * @param {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：<br />
         * {<br />"<b>landmarkPois</b>" : {Array} 要在覆盖物移动过程中，显示的特殊点。格式如下:landmarkPois:[<br />
         *      {lng:116.314782,lat:39.913508,html:'加油站',pauseTime:2},<br />
         *      {lng:116.315391,lat:39.964429,html:'高速公路收费站,pauseTime:3}]<br />
         * <br />"<b>icon</b>" : {Icon} 覆盖物的icon,
         * <br />"<b>speed</b>" : {Number} 覆盖物移动速度，单位米/秒    <br />
         * <br />"<b>defaultContent</b>" : {String} 覆盖物中的内容    <br />
         * }<br />.
         * @example <b>参考示例：</b><br />
         * var RunCar = new BMapLib.RunCar(map,arrPois,{defaultContent:"从北京到天津",landmarkPois:[]});
         */
        BMapLib.RunCar = function(map, point, opts) {

            this.initPoint = point;
            this.targetPoint = point;
            this._map = map;
            //存储一条路线
            this._path = [];
            //进行坐标转换的类
            this._projection = this._map.getMapType().getProjection();
            this._opts = {
                icon: null,
                car_no:'',
                carLabelStyle:null,
                step: 1,//播放速度
                //默认速度 秒/米
                speed: 100,
                defaultContent: '',
                enableRotation: true
            };
            this._setOptions(opts);
            this._rotation = 0;//小车转动的角度
            this._addMarker();
        }
    /**
     * 根据用户输入的opts，修改默认参数_opts
     * @param {Json Object} opts 用户输入的修改参数.
     * @return 无返回值.
     */
    RunCar.prototype._setOptions = function(opts) {
        if (!opts) {
            return;
        }
        for (var p in opts) {
            if (opts.hasOwnProperty(p)) {
                this._opts[p] = opts[p];
            }
        }
    }

    /**
     * @description 开始运动
     * @param none
     * @return 无返回值.
     *
     * @example <b>参考示例：</b><br />
     * RunCar.start();
     */
    RunCar.prototype.movePoint = function(path) {
        if(path.length > 1){
            this._path = [];
            this._path.push(new BMap.Point(path[0].longitude,path[0].latitude))
            this._path.push(new BMap.Point(path[1].longitude,path[1].latitude))
            this.targetPoint = this._path[1];
            this._moveNext(0);
        }
    }


    //RunCar私有方法
    baidu.object.extend(RunCar.prototype, {
        /**
         * 添加marker到地图上
         * @param {Function} 回调函数.
         * @return 无返回值.
         */
        _addMarker: function(callback) {
            if (this._markerOverlay) {
                this._map.removeOverlay(this._markerOverlay);
            }
            var markerOverlay = new CarOverlay(this.initPoint, this._opts.icon, this._opts.car_no, this._opts.carLabelStyle,this);
            this._map.addOverlay(markerOverlay);
            this._markerOverlay = markerOverlay;

        },

        /**
         * 获取墨卡托坐标
         * @param {Point} poi 经纬度坐标.
         * @return 无返回值.
         */
        _getMercator: function(poi) {
            return this._map.getMapType().getProjection().lngLatToPoint(poi);
        },
        /**
         * 计算两点间的距离
         * @param {Point} poi 经纬度坐标A点.
         * @param {Point} poi 经纬度坐标B点.
         * @return 无返回值.
         */
        _getDistance: function(pxA, pxB) {
            return Math.sqrt(Math.pow(pxA.x - pxB.x, 2) + Math.pow(pxA.y - pxB.y, 2));
        },
        //目标点的  当前的步长,position,总的步长,动画效果,回调
        /**
         * 移动小车
         * @param {Number} poi 当前的步长.
         * @param {Point} initPos 经纬度坐标初始点.
         * @param {Point} targetPos 经纬度坐标目标点.
         * @param {Function} effect 缓动效果.
         * @return 无返回值.
         */
        _move: function(initPos,targetPos,effect) {
            var me = this,
                //当前的帧数
                currentCount = 0,
                //步长，米/秒
                timer = 10,
                step = this._opts.speed / (1000 / timer),
                //初始坐标
                init_pos = this._projection.lngLatToPoint(initPos),
                //获取结束点的(x,y)坐标
                target_pos = this._projection.lngLatToPoint(targetPos),
                //总的步长
                count = Math.round(me._getDistance(init_pos, target_pos) / step);
            //如果小于1直接移动到下一点
            if (count < 1) {
                me._markerOverlay.setPosition(targetPos);
                return;
            }
            //两点之间匀速移动
            me._intervalFlag = setInterval(function() {
                //两点之间当前帧数大于总帧数的时候，则说明已经完成移动
                if (currentCount >= count) {
                    clearInterval(me._intervalFlag);
                }else {
                    currentCount++;
                    var x = effect(init_pos.x, target_pos.x, currentCount, count),
                        y = effect(init_pos.y, target_pos.y, currentCount, count),
                        pos = me._projection.pointToLngLat(new BMap.Pixel(x, y));
                    //设置marker
                    if(currentCount == 1){
                        var proPos = null;
                        if(me._opts.enableRotation == true){
                            me.setRotation(proPos,initPos,targetPos);
                        }
                    }
                    //正在移动
                    me._markerOverlay.setPosition(pos);
                }
            },timer);
        },
        /**
         *在每个点的真实步骤中设置小车转动的角度
         */
        setRotation : function(prePos,curPos,targetPos){
            var me = this;
            var deg = 0;
            //start!
            curPos =  me._map.pointToPixel(curPos);
            targetPos =  me._map.pointToPixel(targetPos);

            if(targetPos.x != curPos.x){
                var tan = (targetPos.y - curPos.y)/(targetPos.x - curPos.x),
                    atan  = Math.atan(tan);
                deg = atan*360/(2*Math.PI);
                //degree  correction;
                if(targetPos.x < curPos.x){
                    deg = -deg + 90 + 90;

                } else {
                    deg = -deg;
                }

                me._markerOverlay.setRotation(-deg);

            }else {
                var disy = targetPos.y- curPos.y ;
                var bias = 0;
                if(disy > 0)
                    bias=-1
                else
                    bias = 1
                me._markerOverlay.setRotation(-bias * 90);
            }
            return;

        },

        linePixellength : function(from,to){
            return Math.sqrt(Math.abs(from.x- to.x) * Math.abs(from.x- to.x) + Math.abs(from.y- to.y) * Math.abs(from.y- to.y) );

        },
        pointToPoint : function(from,to ){
            return Math.abs(from.x- to.x) * Math.abs(from.x- to.x) + Math.abs(from.y- to.y) * Math.abs(from.y- to.y)

        },
        /**
         * 移动到下一个点
         * @param {Number} index 当前点的索引.
         * @return 无返回值.
         */
        _moveNext: function(index) {
            var me = this;
            if (index < this._path.length - 1) {
                me._move(me._path[index], me._path[index + 1], me._tween.linear);

            }
        },


        //缓动效果
        _tween: {
            //初始坐标，目标坐标，当前的步长，总的步长
            linear: function(initPos, targetPos, currentCount, count) {
                var b = initPos, c = targetPos - initPos, t = currentCount,
                    d = count;
                return c * t / d + b;
            }
        },

        /**
         * 否经过某个点的index
         * @param {Point} markerPoi 当前小车的坐标点.
         * @return 无返回值.
         */
        _troughPointIndex: function(markerPoi) {
            var t = this._opts.landmarkPois, distance;
            for (var i = 0, len = t.length; i < len; i++) {
                //landmarkPois中的点没有出现过的话
                if (!t[i].bShow) {
                    distance = this._map.getDistance(new BMap.Point(t[i].lng, t[i].lat), markerPoi);
                    //两点距离小于10米，认为是同一个点
                    if (distance < 10) {
                        t[i].bShow = true;
                        return i;
                    }
                }
            }
            return -1;
        }
    });


    /**
     * 自定义的overlay，显示小车
     * @param {Point} Point 要定位的点.
     * @param {String} ico overlay中要显示的东西.
     * @return 无返回值.
     */
    function CarOverlay(point,ico,car_no,carLabelStyle,runCarMain) {
        this._carPoint = point;
        this._carIco = ico;
        this._carNo = car_no;
        this._carLableStyle =  carLabelStyle;
        this.runCarMain = runCarMain;
    }
    CarOverlay.prototype = new BMap.Overlay();
    CarOverlay.prototype.initialize = function(map) {
        var div = this._div = baidu.dom.create('div');
        div.className = 'runCarOverlay';
        var imgCar = this._img = baidu.dom.create('img');
        imgCar.src = this._carIco;
        div.appendChild(imgCar);
        //div.innerHTML = this._carIco;
        if(!!this._carNo){
            var labelCar = this._lableCar = baidu.dom.create("lable");
            labelCar.innerHTML = this._carNo;
            var carLableStyle = [];
            for(var s in this._carLableStyle){
                var style = s + ":" + this._carLableStyle[s];
                carLableStyle.push(style);
            }
            labelCar.setAttribute('style',carLableStyle.join(';'));
            div.appendChild(labelCar);
        }
        map.getPanes().floatPane.appendChild(div);
        this._map = map;
        return div;
    }
    CarOverlay.prototype.draw = function() {
        this.setPosition(this.runCarMain.targetPoint);
    }
    baidu.object.extend(CarOverlay.prototype, {
        setRotation: function(deg) {
            setCss3(this._img,{transform:"rotate("+deg+"deg)"});
            //this._div.style.rotate = deg;
            //console.log(deg);
        },
        //设置overlay的position
        setPosition: function(poi) {
            var px = this._map.pointToOverlayPixel(poi),
                //this._div.style.left = px.x - 10 + 'px';
                //this._div.style.top  = px.y  - 10 + 'px';
                styleW = baidu.dom.getStyle(this._div, 'width'),
                styleH = baidu.dom.getStyle(this._div, 'height');
            overlayW = parseInt(this._div.clientWidth || styleW, 10),
                overlayH = parseInt(this._div.clientHeight || styleH, 10);
            this._div.style.left = px.x - (overlayW / 2) + 'px';
            this._div.style.top = px.y - (overlayH / 2) + 'px';
        },
        //设置overlay的内容
        setHtml: function(html) {
            this._div.innerHTML = html;
        },

    });
    function setCss3(obj,objAttr){
        //循环属性对象
        for(var i in objAttr){
            var newi=i;
            //判断是否存在transform-origin这样格式的属性
            if(newi.indexOf("-")>0){
                var num=newi.indexOf("-");
                newi=newi.replace(newi.substr(num,2),newi.substr(num+1,1).toUpperCase());
            }
            //考虑到css3的兼容性问题,所以这些属性都必须加前缀才行
            obj.style[newi]=objAttr[i];
            newi=newi.replace(newi.charAt(0),newi.charAt(0).toUpperCase());
            obj.style[newi]=objAttr[i];
            obj.style["webkit"+newi]=objAttr[i];
            obj.style["moz"+newi]=objAttr[i];
            obj.style["o"+newi]=objAttr[i];
            obj.style["ms"+newi]=objAttr[i];
        }
    }
})();

