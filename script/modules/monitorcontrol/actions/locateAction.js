/**
 * @file 定位查询管理台Reflux Actoin
 * @author CM 2017.07.24
 */


var LocateAction = Reflux.createActions([
    'setcartree',//加载左侧机构车辆树
    'setcargps', // 加载车辆实时信息
    'setmonitorcars', //设置监控车辆数组
    'getcarstatus', //获取所有车辆当前状态
    'getlocate', //查询车辆定位信息
    'exportexcel', //导出excel
]);

export default LocateAction