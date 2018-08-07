/**
 * @file 实时监控管理台Reflux Actoin
 * @author CM 2017.07.24
 */


var MonitorAction = Reflux.createActions([
    'setcartree',//加载左侧机构车辆树
    'setcargps', // 加载车辆实时信息
    'setmonitorcars', //设置监控车辆数组
    'getcarstatus', //获取所有车辆当前状态
    'searchcar', //模糊搜索车辆
]);

export default MonitorAction