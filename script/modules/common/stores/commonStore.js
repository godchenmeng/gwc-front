/**
 * @file 公共Reflux Store
 * @author CM 2017.07.20
 */

import CommonAction from '../actions/commonAction'
import Urls from '../../../common/urls'
import GlobalParam from "../../../common/globalParam";

var CommonStore = Reflux.createStore({
    listenables: [CommonAction],
    data: {
        // 当前标签页 0为轨迹监控，1为终端管理
        currentIndex: 0,
        // 当前登录系统所有设备绑定的车辆类型信息
        deviceCarType: null,
        // 系统数据字典 使用前请先新增对应分支属性,并确保分支名唯一 如  dataDictionary.carType = []
        dataDictionary: {},
        ajaxTimeOut:8000,//ajax请求超时时长阀值，当请求超过这个阀值时就记录接口请求异常
        ajaxStartTime:0,//用于记录ajax请求开始时间
        ajaxCompleteTime:0,//用于记录ajax请求完成时间
    },
    onBlurUserName: function(user_name,callBakFun){
        Urls.post(Urls.loadUserOrg,{name:user_name},function(result){
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                if(!!callBakFun) callBakFun(result.datas);
            }else{
                toastr.error(result.responseMsg);
            }
        });
    },
    /**
     * 用户登录
     * @param param
     */
    onUserLogin: function(param,callBack){
        let that = this;
        Urls.post(Urls.userLogin, param, function(result){
            if(result.responseCode=="1"&&result.responseMsg=="success"){
                GlobalParam.clearAll();
                GlobalParam.set("user",result.datas);
                that.getUserOperationPermission({},function(){
                    // that.trigger('loginsuccess');
                    if(!!callBack){
                        callBack();
                    }
                    window.location.href = 'index.html';
                });
            }else{
                toastr.error(result.responseMsg);
                $("#verification").slider("restore");
                //$(".verification-box").find("img").attr("src",Urls.jcaptchaCode + '?_time=' + new Date().getTime());
            }
        });
    },
    /**
     * 响应Action userlogout 用户登出
     */
    onUserlogout:function () {
      let that = this;
      Urls.get(Urls.userLogout,{},function (result) {
          if(result.responseCode=="1"&&result.responseMsg=="success"){
              GlobalParam.clearAll();
              window.location.href = 'login.html';
          }else{
              toastr.error(result.responseMsg);
          }
      })
    },
    /**
     * 响应Action loadindexdata 加载首页数据
     */
    onLoadindexdata:function () {
        let that = this;
        Urls.get(Urls.indexmonitor,{},function (result) {
            if(result.code=="10000"){
                that.trigger('loadedindexdata',result.data);
            }else{
                toastr.error(result.msg);
            }
        });
    },
    /**
     * 响应Action opmonitorcar 新增、删除监控车辆
     * @param param
     */
    onOpmonitorcar:function (param) {
        let that = this;
        Urls.get(Urls.opmonitorcar,param,function (result) {
            if(result.code=="10000"){
                that.trigger('opmonitorcarsuccess',result.data);
            }else{
                toastr.error(result.msg);
            }
        })
    },
    /**
     * 响应Action updateInfoStatus 消息标记已读，置顶，取消置顶
     * @param param
     */
    onUpdateInfoStatus:function (param,callBackFun) {
        Urls.post(Urls.updateInfoStatus,param,function(result){
            if(result.responseCode == "1" && result.responseMsg == "success"){
                if(!!callBackFun) callBackFun(result);
                toastr.success("操作成功");
            }else{
                toastr.error(result.responseMsg);
            }
        });
    },
    /**
     * 响应Action loadDeviceCarType 获取设备绑定的车辆类型
     * @param param
     */
    onLoadDeviceCarType:function (param) {
        let that = this;
        that.data.deviceCarType = new Object();
        //存储周期超过1天重新获取
        var deviceCarType = GlobalParam.getExpire("carType", 24 * 60 * 60 * 1000);
        if(deviceCarType){
            deviceCarType.forEach(function (deviceCar) {
                that.data.deviceCarType[deviceCar.device] = deviceCar.type_code;
            });
        }else {
            Urls.post(Urls.loadDeviceCarType, param, function (result) {
                if (result.responseCode == "1" && result.responseMsg == "success") {
                    if (result.datas.length > 0) {
                        result.datas.forEach(function (deviceCar) {
                            that.data.deviceCarType[deviceCar.device] = deviceCar.type_code;
                        });
                        GlobalParam.set("carType",result.datas);
                    }
                } else {
                    toastr.error(result.responseMsg);
                }
            });
        }
    },
    /**
     * 通过设备号获取，设备绑定的车辆类型code
     * @param device 设备号
     */
    getCarTypeCodeByDevice:function (device){
        if(this.data.deviceCarType && this.data.deviceCarType[device]) return this.data.deviceCarType[device];
        return false;
    },
    /**
     * 获取用户所有（非菜单）操作权限
     * @param param
     */
    getUserOperationPermission:function (param,callBakFun) {
        Urls.get(Urls.userOperationPermission,param,function(result){
            if(result.responseCode == "1" && result.responseMsg == "success"){
                if (result.datas.length > 0) {
                    let permissions = [];
                    result.datas.forEach(function(permission){
                        permissions.push(permission.url);
                    });
                    GlobalParam.set("permissions",'@'+permissions.join('@')+'@');
                }
                if(!!callBakFun) callBakFun();
            }else{
                toastr.error(result.responseMsg);
            }
        });
    },
    /**
     * 验证是否拥有该url权限
     * @param url
     * @return Boolean
     */
    verifyPermission:function (url) {
        url = '@'+ url + '@';
        if(GlobalParam.get("permissions")){
            if(GlobalParam.get("permissions").indexOf(url) > -1){
                return true;
            }else{
                return false;
            }
        }
        return false;
    },
    /**
     * 响应Action loadDataDictionary 获取数据字典数据列表
     * @param param
     */
    onLoadDataDictionary:function (typeName,params,callBakFun) {
        let that = this;
        Urls.get(Urls.loadDataDictionary,params,function(result){
            if(result.responseCode == "1" && result.responseMsg == "success"){
                if (result.datas.length > 0) {
                    that.data.dataDictionary[typeName] = result.datas;
                }
                if(!!callBakFun) callBakFun(result);
            }else{
                toastr.error(result.responseMsg);
            }
        });
    },
    /**
     * 响应Action getAddressByGps 获取当前gps坐标地址
     * @param latitude 纬度
     * @param longitude 纬度
     * @param callBack 回调函数
     */
    onGetAddressByGps:function (latitude,longitude,callBack) {
        let param = {
            ak:Urls.baiduAK,
            location: latitude + ',' + longitude,
            output: 'json'
        };
        Urls.jsonp(Urls.getCarAddress, param, function (data) {
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
            callBack(address);
        });

    },
    getUserRegionDatas:function(callBakFun){
        //存储周期超过1月重新获取
        var regionData = GlobalParam.getExpire("regionData", 31 * 24 * 60 * 60 * 1000);
        if(regionData){
            if (!!callBakFun) {
                callBakFun(regionData);
            }
        }else {
            Urls.get(Urls.loadRegionDatas, {}, function (result) {
                if (result.responseCode == "1" && result.responseMsg == "success") {
                    if (result.datas.length > 0) {
                        if (!!callBakFun) {
                            callBakFun(result.datas);
                        }
                    }
                    GlobalParam.set("regionData",result.datas);
                } else {
                    toastr.error(result.responseMsg);
                }
            });
        }
    },
});

export default CommonStore