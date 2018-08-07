/**
 * @file 超速查询管理台Reflux Actoin
 * @author CM 2017.09.18
 */


var SpeedingAction = Reflux.createActions([
    'setcartree',//加载左侧机构车辆树
    'setoverlay', //绘制图形
    'getspeeding', //获取超速查询结果
    'setmonitorcars', //设置查询车辆数组
    'clearmap', //清除地图绘制
    'setspeedingtab', //设置当前TAB
    'getspeedingset', //获取超速设置
    'speedingswitch', //设置超速查询状态
    'savespeedingset', //保存超速设置
    'deletespeeding', //删除超速设置
]);

export default SpeedingAction