/**
 * @file 越界查询管理台Reflux Actoin
 * @author CM 2017.08.24
 */


var FenceAction = Reflux.createActions([
    'setcartree',//加载左侧机构车辆树
    'setoverlay', //绘制图形
    'getfence', //获取越界查询结果
    'setmonitorcars', //设置查询车辆数组
    'clearmap', //清除地图绘制
    'setfencetab', //设置当前TAB
    'getfenceset', //获取越界设置
    'fenceswitch', //设置电子栅栏状态
    'savefenceset', //保存越界设置
    'deletefence', //删除越界设置
]);

export default FenceAction