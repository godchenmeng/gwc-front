/**
 * @file 驾驶员管理Reflux Action
 * @author XuHong 2017.09.09
 */

var DriverAction = Reflux.createActions([
    'getDriverList',//驾驶员管理分页搜索
    'getMemberList',//用户列表中的驾驶员列表搜索
    'addDriver',//新增驾驶员
    'updateDriver',//更新驾驶员信息
    'updateDriverStatus',//更新驾驶员工作状态
]);

export default DriverAction;