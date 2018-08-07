/**
 * @file 公共Reflux Actoin
 * @author CM 2017.07.20
 */


var CommonAction = Reflux.createActions([
    // 切换功能模块
    'blurUserName',
    'userLogin', //用户登录
    'loadindexdata', //加载首页监控
    'opmonitorcar', //新增、删除监控车辆
    'userlogout', //用户登出
    'updateInfoStatus',//消息标记已读，置顶，取消置顶
    'loadDeviceCarType',//获取设备绑定的车辆类型
    'loadDataDictionary',//获取数据字典数据列表
    'getAddressByGps',//获取当前gps坐标地址
]);

export default CommonAction