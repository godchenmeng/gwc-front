/**
 * @file 存放Jquery AJAX方法
 * @author CM 2017.07.21
 */

import IpConfig from 'ipconfig';

import CommonStore from '../modules/common/stores/commonStore';
import GlobalParam from "./globalParam";

var urls = {
    baiduAK:'pxBudaGK5Aez1hbfs5FQs1D5Ng0c19nH',
    baiduServiceID: '143894',

    imgUrl:IpConfig.imgUrl, //图片访问路径
    // 请求链接
    indexmonitor: IpConfig.apiUrl + 'index/monitor', //首页监控加载
    opmonitorcar: IpConfig.apiUrl + 'op/index/monitor/car', //首页新增、删除监控车辆
    loadInfo: IpConfig.apiUrl + 'info/find/page',//获取消息中心列表
    updateInfoStatus: IpConfig.apiUrl + 'info/update/status',//修改消息状态，未读，已读，置顶
    loadDeviceCarType: IpConfig.apiUrl + 'get/device/car/type',//获取设备绑定车辆的车辆类型列表
    loadDataDictionary: IpConfig.apiUrl + 'dictionary/list',//获取数据字典列表

    loadUserOrg: IpConfig.apiUrl + 'get/user/org', //获取登录用户机构名称
    jcaptchaCode: IpConfig.apiUrl + 'jcaptcha.jpg',//获取验证码
    userLogin: IpConfig.apiUrl + 'user/login',//用户登录
    userLogout: IpConfig.apiUrl + 'user/out', //用户登出
    userOperationPermission: IpConfig.apiUrl + 'user/operation/permission',//获取用户所有操作权限

    loadmenu: IpConfig.apiUrl + 'user/permission', //获取左侧菜单
    loadorgtree: IpConfig.apiUrl + 'org/tree', //获取机构树状结构
    loadorgcartree: IpConfig.apiUrl + 'org/car/tree',  //获取机构车辆树状结构
    loadorgcartreenew: IpConfig.apiUrl + 'org/car/tree/new',
    loadcargps: IpConfig.apiUrl + 'get/car/gpscurrent', //获取车辆当前GPS信息
    loadcargpsws: '/gpsHandler',//通过socket获取当前gps信息
    loadcarmil: IpConfig.apiUrl + 'get/car/milfuel',//获取车辆当月里程油耗信息
    loadcarstatus: IpConfig.apiUrl + 'get/car/status', //获取车辆当前状态信息
    loadlocate: IpConfig.apiUrl + 'get/car/notice/page', //获取车辆定位信息
    loadlocateexcel: IpConfig.apiUrl + 'get/car/notice/excel', //定位信息导出

    loadImage: IpConfig.apiUrl + 'get/image',//获取上传的图片
    uploadImage: IpConfig.apiUrl + 'upload/image',//上传图片
    loadOrgCarList: IpConfig.apiUrl + 'org/car/load',//获取机构下绑定obd的汽车

    loadfenceset: IpConfig.apiUrl + 'fence/page',//获取电子栅栏设置
    modifyfence: IpConfig.apiUrl + 'fence/modify', //开启/关闭电子栅栏
    deletefence: IpConfig.apiUrl + 'fence/delete', //删除电子栅栏
    addfence: IpConfig.apiUrl + 'fence/add', //添加电子栅栏

    loadspeedingset: IpConfig.apiUrl + 'speeding/page',//获取超速查询设置
    modifyspeeding: IpConfig.apiUrl + 'speeding/modify', //编辑/开启/关闭超速设置
    deletespeeding: IpConfig.apiUrl + 'speeding/delete', //删除超速设置
    addspeeding: IpConfig.apiUrl + 'speeding/add', //新增超速设置

    searchFoulParking: IpConfig.apiUrl + 'foulparking/search', //获取违规停运查询信息
    loadFoulParkingSet: IpConfig.apiUrl + 'foulparking/set/page',//分页获取违规停运设置信息列表
    modifyFoulParkingSet: IpConfig.apiUrl + 'foulparking/set/modify', //编辑/开启/关闭违规停运设置
    deleteFoulParkingSet: IpConfig.apiUrl + 'foulparking/set/delete', //删除违规停运设置
    addFoulParkingSet: IpConfig.apiUrl + 'foulparking/set/add', //新增违规停运设置

    applyadd:IpConfig.apiUrl + 'apply/add', //用车申请新增
    applyedit:IpConfig.apiUrl + 'apply/modify', //用车申请修改
    applyCount:IpConfig.apiUrl + 'apply/count', //获取用车申请未读统计
    applyFirst:IpConfig.apiUrl + 'get/first/apply', //获取用车申请最新记录
    applyPage:IpConfig.apiUrl + 'get/apply/page', //分页获取用车申请列表
    applyExport:IpConfig.apiUrl + 'apply/export', //用车申请数据导出
    applyRepeal:IpConfig.apiUrl + 'apply/repeal', //用车申请撤销

    approvalPage:IpConfig.apiUrl + 'get/apply/sp/page',//获取用车审批列表
    approvalExport:IpConfig.apiUrl + 'apply/sp/export',//导出用车审批列表数据
    approvalAgree:IpConfig.apiUrl + 'check/apply',//用车审批同意
    approvalReject:IpConfig.apiUrl + 'check/apply',//用车审批驳回

    dispatchPage:IpConfig.apiUrl + 'get/apply/dd/page',//分页获取车辆调度列表
    dispatchExport:IpConfig.apiUrl + 'apply/dd/export',//车辆调度列表数据导出
    dispatchEmergency:IpConfig.apiUrl + 'set/emergency/apply',//紧急调度接口
    dispatchCarList:IpConfig.apiUrl + 'car/page/filter',//获取可调度车辆列表
    dispatchDriverList:IpConfig.apiUrl + 'driver/page/filter',//获取可调度司机列表
    dispatchAgree:IpConfig.apiUrl + 'control/apply',//用车调度同意
    dispatchReject:IpConfig.apiUrl + 'check/select',//用车调度驳回

    controlPage:IpConfig.apiUrl + 'get/apply/pq/page',//分页获取派遣列表
    controlExport:IpConfig.apiUrl + 'apply/pq/export',//车辆派遣数据导出
    controlSign:IpConfig.apiUrl + 'apply/pq/sign',//派遣签收
    controlFeedback:IpConfig.apiUrl + 'apply/pq/feedback',//派遣反馈

    dispatchDataPage:IpConfig.apiUrl + 'apply/dd/data/page',//分页获取调度数据列表
    dispatchDataExport:IpConfig.apiUrl + 'apply/dd/data/export',//调度数据里列表导出
    dispatchDataTaskList:IpConfig.apiUrl + 'control/list',//派遣任务列表

    synthesizePage:IpConfig.apiUrl + 'statistics/synthesize/page',//车辆综合统计分页查询
    synthesizeExport:IpConfig.apiUrl + 'statistics/synthesize/export',//车辆综合统计列表数据导出
    synthesizeStatistics:IpConfig.apiUrl + 'statistics/synthesize',//车辆综合统计查询

    onlinePage:IpConfig.apiUrl + 'statistics/online/page',//车辆上线率分页查询
    onlineExport:IpConfig.apiUrl + 'statistics/online/export',//车辆上线率列表数据导出

    overSpeedPage:IpConfig.apiUrl + 'statistics/over_speed/page',//车辆超速统计分页查询
    overSpeedExport:IpConfig.apiUrl + 'statistics/over_speed/export',//车辆超速统计数据导出
    overSpeedStatistics:IpConfig.apiUrl + 'statistics/over_speed',//车辆超速统计查询

    outsidePage:IpConfig.apiUrl + 'statistics/outside/page',//车辆越界统计分页查询
    outsideExport:IpConfig.apiUrl + 'statistics/outside/export',//车辆越界统计数据导出
    outsideStatistics:IpConfig.apiUrl + 'statistics/outside',//车辆越界统计查询

    notReturnPage:IpConfig.apiUrl + 'statistics/not_return/page',//车辆未入库统计分页查询
    notReturnExport:IpConfig.apiUrl + 'statistics/not_return/export',//车辆未入库统计数据导出
    notReturnStatistics:IpConfig.apiUrl + 'statistics/not_return',//车辆未入库统计查询

    foulParkPage:IpConfig.apiUrl + 'statistics/foul_park/page',//车辆违规停运统计分页查询
    foulParkExport:IpConfig.apiUrl + 'statistics/foul_park/export',//车辆违规停运统计数据导出
    foulParkStatistics:IpConfig.apiUrl + 'statistics/foul_park',//车辆违规停运统计查询

    foulTaskPage:IpConfig.apiUrl + 'statistics/foul_task/page',//车辆无单违规用车统计分页查询
    foulTaskExport:IpConfig.apiUrl + 'statistics/foul_task/export',//车辆无单违规用车统计数据导出
    foulTaskStatistics:IpConfig.apiUrl + 'statistics/foul_task',//车辆无单违规用车统计查询

    foulTimePage:IpConfig.apiUrl + 'statistics/foul_time/page',//车辆非规定时段用车统计分页查询
    foulTimeExport:IpConfig.apiUrl + 'statistics/foul_time/export',//车辆非规定时段用车统计数据导出
    foulTimeStatistics:IpConfig.apiUrl + 'statistics/foul_time',//车辆非规定时段用车统计查询

    drivePage:IpConfig.apiUrl + 'statistics/drive/page',//车辆驾驶统计分页查询
    driveExport:IpConfig.apiUrl + 'statistics/drive/export',//车辆驾驶统计数据导出
    driveStatistics:IpConfig.apiUrl + 'statistics/drive',//车辆驾驶统计查询
    driveBreak:IpConfig.apiUrl + 'statistics/drive/break',//车辆三急驾驶统计查询

    violationPage:IpConfig.apiUrl + 'statistics/violation/page',//车辆违章统计分页查询
    violationExport:IpConfig.apiUrl + 'statistics/violation/export',//车辆违章统计数据导出
    violationStatistics:IpConfig.apiUrl + 'statistics/violation',//车辆违章统计查询

    queryCars: IpConfig.apiUrl + 'org/car/query',//根据车牌号查询车辆
    searchcars: IpConfig.apiUrl + 'car/loads', //根据车牌搜索车辆
    searchtrack: IpConfig.apiUrl + 'get/car/dr', //搜索车辆轨迹段
    searchtrackgps: IpConfig.apiUrl + 'get/car/track', //搜索车辆轨迹GPS信息

    loadcartrace: IpConfig.apiUrl + 'get/car/line',//获取车辆当前轨迹GPS信息

    loaduserlist: IpConfig.apiUrl + 'member/page', //搜索用户列表
    adduser: IpConfig.apiUrl + 'member/add', //新增用户
    deluser: IpConfig.apiUrl + 'member/delete', //删除用户
    updateuser: IpConfig.apiUrl + 'member/update', //更新用户
    loadsmsrole: IpConfig.apiUrl + 'sms/org/role', //获取用户机构下所有短信角色

    loadorgrole: IpConfig.apiUrl + 'org/role', //获取角色集合
    checkloginname: IpConfig.apiUrl + 'user/login/name', //检查登录名是否合法
    addaccount: IpConfig.apiUrl + 'user/add', //新增账号
    checkuseraccount: IpConfig.apiUrl + 'user/check/exist', //检查用户是否注册账号
    adduseraccount: IpConfig.apiUrl + 'member/user/add', //新增用户和账号
    loadaccountlist: IpConfig.apiUrl + 'user/page', //搜索账号列表
    delaccount: IpConfig.apiUrl + 'user/delete', //删除账号
    changepassword: IpConfig.apiUrl + 'user/pwd/reset', //修改密码
    updateaccount: IpConfig.apiUrl + 'user/modify', //更新账号

    adddepartment: IpConfig.apiUrl + 'org/add', //新增部门机构
    updatedepartment: IpConfig.apiUrl + 'org/modify', //修改部门机构
    deldepartment: IpConfig.apiUrl + 'org/del', //删除部门机构

    loadrolelist: IpConfig.apiUrl + 'role/page', //获取角色列表
    addrole: IpConfig.apiUrl + 'role/add', //新增角色
    updaterole: IpConfig.apiUrl + 'role/update', //更新角色
    deleterole: IpConfig.apiUrl + 'role/delete', //删除角色
    loadpermissionlist: IpConfig.apiUrl + 'permission/list', //获取权限列表
    loadrolepermission: IpConfig.apiUrl + 'role/permission', //获取角色权限

    loadsmslist: IpConfig.apiUrl + 'sms/page', //获取短信列表
    loadorguserlist: IpConfig.apiUrl + 'org/member/tree', //获取所有用户和机构
    loadsmsset: IpConfig.apiUrl + 'sms/get', //获取短信设置
    updatesmsset: IpConfig.apiUrl + 'sms/set', //修改短信设置
    deletesms: IpConfig.apiUrl + 'sms/delete', //删除短信信息

    loadsmsrolelist: IpConfig.apiUrl + 'sms/role/page',//分页获取短信角色列表
    addsmsrole: IpConfig.apiUrl + 'sms/role/add', //新增短信角色
    updatesmsrole: IpConfig.apiUrl + 'sms/role/update', //修改短信角色
    deletesmsrole: IpConfig.apiUrl + 'sms/role/delete', //删除短信角色


    carPage: IpConfig.apiUrl + 'car/page', //获取车辆管理列表
    carBrand: IpConfig.apiUrl + 'car/type', //获取车辆品牌
    carType: IpConfig.apiUrl + 'get/car/type', //获取车辆类型
    updateCar: IpConfig.apiUrl + 'car/modify', //更新车辆信息
    addCar: IpConfig.apiUrl + 'car/add', //新增车辆信息
    checkCar: IpConfig.apiUrl + 'car/check',//提交审核车辆
    deleteCar: IpConfig.apiUrl + 'car/delete',//删除车辆信息

    loadDeviceList: IpConfig.apiUrl + 'device/page',//获取设备管理列表
    addDevice: IpConfig.apiUrl + 'device/add',//新增设备信息
    updateDevice: IpConfig.apiUrl + 'device/modify',//更新设备信息
    deleteDeviceCar: IpConfig.apiUrl + 'all/delete',//注销设备（删车）
    deleteDevice: IpConfig.apiUrl + 'device/delete',//注销设备（不删车）
    simValide: IpConfig.apiUrl + 'device/sim',//sim卡唯一验证

    loadDriverList: IpConfig.apiUrl + 'driver/page',//获取驾驶员管理列表
    loadMemberDriver: IpConfig.apiUrl + 'member/driver',//获取用户列表中的驾驶员列表
    addDriver: IpConfig.apiUrl + 'driver/add',//新增驾驶员
    updateDriver: IpConfig.apiUrl + 'driver/modify',//更新驾驶员信息
    updateDriverStatus: IpConfig.apiUrl + 'driver/work',//更新驾驶员工作状态
    deleteDriver: IpConfig.apiUrl + 'driver/delete',//删除驾驶员信息

    loadRegionDatas: IpConfig.apiUrl + 'get/regionDatas',//获取用户区域数据
    addOverTime: IpConfig.apiUrl + 'overtime/add', //新增请求超时记录

    queryTableColumn:IpConfig.apiUrl + 'get/columns',//获取表格列名列表
    queryTableData:IpConfig.apiUrl + 'get/tableinfo',//查询表格数据
    queryDeviceNoData:IpConfig.apiUrl + 'gps/device/data',//查询无数据设备信息
    exportDeviceNoData:IpConfig.apiUrl + 'gps/device/data/ex',//导出无数据设备信息

    getCarAddress: '//api.map.baidu.com/geocoder/v2/',

    /**
     * Jquery AJAX POST
     *
     * @param {string} url 请求url
     * @param {object} params 请求参数
     * @param {function} success 请求成功回调函数
     * @param {function} before 请求前函数
     * @param {function} fail 请求失败回调函数
     * @param {function} after 请求完成回调函数
     */
    post: function (url, params, success, before, fail, after) {
        if (before) {
            before();
        }
        var user = GlobalParam.get("user");
        if(user){
            params.token = user.token;
            params.keyid = user.id;
            params.uorg = user.org;
        }

        params.timeStamp = new Date().getTime();
        fail = fail || function (resp) {
            if(resp.status == 401 && resp.responseJSON.code == 30010){
                GlobalParam.clearAll();
                location.reload();
            }
            if(resp.status == 401 && resp.responseJSON.code == 30018){
                CommonStore.trigger("showModal",{title:"下线提示",msg:resp.responseJSON.msg,smallShow:false,callback:function(){
                    GlobalParam.clearAll();
                    location.reload();
                }});
            }
            if(resp.status == 401 && resp.responseJSON.code == 20001){
                CommonStore.trigger("showModal",{title:"账号异常提示",msg:resp.responseJSON.msg,smallShow:false,callback:function(){
                    GlobalParam.clearAll();
                    location.reload();
                }});
            }
        };
        after = after || function () { };

        $.ajax({
            type: 'POST',
            url: url,
            data: params,
            dataType: 'json',
            success: success,
            error: fail,
            complete: after
        });
    },

    /**
     * Jquery AJAX GET
     *
     * @param {string} url 请求url
     * @param {object} params 请求参数
     * @param {function} success 请求成功回调函数
     * @param {function} before 请求前函数
     * @param {function} fail 请求失败回调函数
     * @param {function} after 请求完成回调函数
     */
    get: function (url, params, success, before, fail, after,isasync) {
        if (before) {
            before();
        }
        var user = GlobalParam.get("user");
        if(user) {
            params.token = user.token;
            params.keyid = user.id;
            params.uorg = user.org;
        }
        params.timeStamp = new Date().getTime();
        fail = fail || function (resp) {
            if(resp.status == 401 && resp.responseJSON.code == 30010){
                GlobalParam.clearAll();
                location.reload();
            }
            if(resp.status == 401 && resp.responseJSON.code == 30018){
                CommonStore.trigger("showModal",{title:"下线提示",msg:resp.responseJSON.msg,smallShow:false,callback:function(){
                    GlobalParam.clearAll();
                    location.reload();
                }});
            }
            if(resp.status == 401 && resp.responseJSON.code == 20001){
                CommonStore.trigger("showModal",{title:"账号异常提示",msg:resp.responseJSON.msg,smallShow:false,callback:function(){
                    GlobalParam.clearAll();
                    location.reload();
                }});
            }
        };
        after = after || function () { };

        $.ajax({
            type: 'GET',
            url: url,
            data: params,
            dataType: 'json',
            async:isasync,
            success: success,
            error: fail,
            complete: after
        });
    },
    /**
     *  自定义AJAX提交 （如果需要增加其他参数，请在最后添加）
     * @param url 默认值: 当前页地址。发送请求的地址。
     * @param params 发送到服务器的数据。将自动转换为请求字符串格式。
     * @param type 默认值: "GET")。请求方式 ("POST" 或 "GET")
     * @param dataType 预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息来智能判断，比如 XML MIME 类型就被识别为 XML。在 1.4 中，JSON 就会生成一个 JavaScript 对象，而 script 则会执行这个脚本。随后服务器端返回的数据会根据这个值解析后，传递给回调函数。
     * @param async 默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
     * @param success 请求成功后的回调函数。
     * @param timeout 设置请求超时时间（毫秒）。此设置将覆盖全局设置。
     * @param cache dataType 为 script 和 jsonp 时默认为 false。设置为 false 将不缓存此页面。
     * @param contentType 默认值: "application/x-www-form-urlencoded"。发送信息至服务器时内容编码类型。
     * @param context 这个对象用于设置 Ajax 相关回调函数的上下文。也就是说，让回调函数内 this 指向这个对象（如果不设定这个参数，那么 this 就指向调用本次 AJAX 请求时传递的 options 参数）。比如指定一个 DOM 元素作为 context 参数，这样就设置了 success 回调函数的上下文为这个 DOM 元素。
     * @param error 请求失败时调用此函数。有以下三个参数：XMLHttpRequest 对象、错误信息、（可选）捕获的异常对象。如果发生了错误，错误信息（第二个参数）除了得到 null 之外，还可能是 "timeout", "error", "notmodified" 和 "parsererror"。
     * @param before 发送请求前可修改 XMLHttpRequest 对象的函数，如添加自定义 HTTP 头。XMLHttpRequest 对象是唯一的参数。这是一个 Ajax 事件。如果返回 false 可以取消本次 ajax 请求。
     * @param after 请求完成后回调函数 (请求成功或失败之后均调用)。参数： XMLHttpRequest 对象和一个描述请求类型的字符串。
     * @param username 用于响应 HTTP 访问认证请求的用户名。
     * @param password 用于响应 HTTP 访问认证请求的密码
     * @param xhr 需要返回一个 XMLHttpRequest 对象。默认在 IE 下是 ActiveXObject 而其他情况下是 XMLHttpRequest 。用于重写或者提供一个增强的 XMLHttpRequest 对象。这个参数在 jQuery 1.3 以前不可用。
     */
    customAJAX:function (url,params,type,dataType,async,success,timeout,cache,contentType,context,fail,before,after,username,password,xhr) {
        var user = GlobalParam.get("user");
        if(user) {
            params.token = user.token;
            params.keyid = user.id;
            params.uorg = user.org;
        }
        params.timeStamp = new Date().getTime();
        before = before || function () { };
        fail = fail || function (resp) {
            if(resp.status == 401 && resp.responseJSON.code == 30010){
                GlobalParam.clearAll();
                location.reload();
            }
            if(resp.status == 401 && resp.responseJSON.code == 30018){
                CommonStore.trigger("showModal",{title:"下线提示",msg:resp.responseJSON.msg,smallShow:false,callback:function(){
                    GlobalParam.clearAll();
                    location.reload();
                }});
            }
            if(resp.status == 401 && resp.responseJSON.code == 20001){
                CommonStore.trigger("showModal",{title:"账号异常提示",msg:resp.responseJSON.msg,smallShow:false,callback:function(){
                    GlobalParam.clearAll();
                    location.reload();
                }});
            }
        };
        after = after || function () { };

        $.ajax({
            url: url,
            data: params,
            type: type,
            dataType: dataType,
            async:async,
            success: success,
            timeout:timeout,
            cache:cache,
            contentType:contentType,
            context:context,
            error: fail,
            beforeSend:before,
            complete: after,
            username:username,
            password:password,
            xhr:xhr,
        });
    },
    /**
     * JSONP
     *
     * @param {string} url 请求url
     * @param {object} params 请求参数
     * @param {function} callbakc 请求成功回调函数
     * @param {function} before 请求前函数
     */
    jsonp: function (url, params, callback, before) {
        var that = this;
        if (before) {
            before();
        }
        var user = GlobalParam.get("user");
        if(user) {
            params.token = user.token;
            params.keyid = user.id;
            params.uorg = user.org;
        }
        params.timeStamp = new Date().getTime();
        url = url + '?';
        for (let i in params) {
            url = url + i + '=' + params[i] + '&';
        }
        var timeStamp = (Math.random() * 100000).toFixed(0);
        window['ck' + timeStamp] = callback || function () {};
        var completeUrl = url + '&callback=ck' + timeStamp;
        var script = document.createElement('script');
        script.src = completeUrl;
        script.id = 'jsonp';
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = function (e) {
            $('#jsonp').remove();
        };
        script.onerror = function (e) {
            that.jsonp(url, params, callback, before)
        };
    },
    /**
     * window.open 用于数据导出
     *
     * @param {string} url 请求url
     * @param {object} params 请求参数
     */
    open: function (url, params) {
        var that = this;
        var user = GlobalParam.get("user");
        if(user) {
            params.token = user.token;
            params.keyid = user.id;
            params.uorg = user.org;
        }
        params.timeStamp = new Date().getTime();
        url = url + '?';
        for (let i in params) {
            url = url + i + '=' + params[i] + '&';
        }
        window.open(url);
    },
    /**
     * 用于大量数据提交，然后导出excel
     *
     * @param url
     * @param params
     */
    openForm: function (url,params) {
        var user = GlobalParam.get("user");
        if(user) {
            params.token = user.token;
            params.keyid = user.id;
            params.uorg = user.org;
        }
        params.timeStamp = new Date().getTime();

        var tmpDiv = document.createElement("div");
        tmpDiv.className = "hide";
        var tmpFrame = document.createElement("iframe");
        tmpFrame.name = "tmpFrame";
        tmpDiv.appendChild(tmpFrame);
        var tmpForm = document.createElement("form");
        tmpForm.id="tmpForm";
        tmpForm.method="post";
        tmpForm.action=url;
        tmpForm.target="tmpFrame";
        for(let key in params){
            var hideInput = document.createElement("input");
            hideInput.type="hidden";
            hideInput.name= key;
            hideInput.value= params[key];
            tmpForm.appendChild(hideInput);
        }
        tmpDiv.appendChild(tmpForm);
        document.body.appendChild(tmpDiv);

        tmpForm.submit();
        //不能立即删除，会导致提交不上去
        setTimeout(function () {
            document.body.removeChild(tmpDiv);
        },3000)
    },
    wsConnect: function (url,wsOpen,wsMsg,wsClose) {
        var ws = null;
        var wsUrl;
        var user = GlobalParam.get("user");
        if(user) {
            var param = "?keyid=" + user.id + "&token=" + user.token + "&uorg=" + user.org;
            if (window.location.protocol == 'http:') {
                wsUrl = 'ws://' + window.location.host + '/car/ws' + url + param;
            } else {
                wsUrl = 'wss://' + window.location.host + '/car/ws' + url + param;
            }

            if ('WebSocket' in window) {
                ws = new WebSocket(wsUrl);
            }
            else if ('MozWebSocket' in window) {
                ws = new MozWebSocket(wsUrl);
            }
            else {
                ws = new SockJS(url + param);
            }

            ws.onopen = wsOpen;
            ws.onmessage = function (event) {
                if(event.data == 402){
                    CommonStore.trigger("showModal",{title:"账号异常提示",msg:"您尚未登录或者登录信息已过期，请重新登录。",smallShow:false,callback:function(){
                            GlobalParam.clearAll();
                            location.reload();
                        }});
                }else{
                    wsMsg(event);
                }
            };
            ws.onclose = wsClose;
        }
        return ws;
    }
}
/**
 *  请求异常记录 start
 *
 *  设置ajax全局事件，用于监听ajax 发送和完成事件，记录发送时间，
 *  完成时ajax状态404或请求时长超过设置的时长，则记录
 */
$(document).ajaxSend(function(event){
    CommonStore.data.ajaxStartTime = event.timeStamp;
});
$(document).ajaxComplete(function(event,xhr,options){
    if(options.url.indexOf("overtime/add") < 0){
        CommonStore.data.ajaxCompleteTime = event.timeStamp;
        var ajaxTime = CommonStore.data.ajaxCompleteTime - CommonStore.data.ajaxStartTime;
        var timeOut = CommonStore.data.ajaxTimeOut;
        if(xhr.status == 404 || xhr.status == 500){
            urls.post(urls.addOverTime,{
                url:options.url,
                duration:0
            });
        }else if(xhr.status == 200 && ajaxTime >= timeOut){
            urls.post(urls.addOverTime,{
                url:options.url,
                duration:ajaxTime
            });
        }
    }
});
/* 请求异常记录 end */
export default urls;