/**
 * @file 追踪查询管理台Reflux Actoin
 * @author CM 2017.09.11
 */


var TraceAction = Reflux.createActions([
    'setcargps',//加载车辆GPS信息
    'loadcartrace', //加载车辆移动轨迹
    'getcaraddress',
]);

export default TraceAction