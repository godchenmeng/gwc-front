/**
 * @file 调度Reflux Actoin
 * @author Banji 2017.07.25
 */


var DispatchAction = Reflux.createActions([
    'search',//调度分页搜索
    'export',//调度列表数据导出
    'emergency',//紧急调度
    'carSearch',//可调度车辆搜索
    'driverSearch',//可调度司机搜索
    'agree',//同意调度
    'reject',//调度驳回
    'searchCar',//搜索司机
    'searchDriver'
]);

export default DispatchAction