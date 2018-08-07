/**
 * @file 历史轨迹管理台Reflux Actoin
 * @author CM 2017.07.24
 */


var TrackAction = Reflux.createActions([
    'searchtrack', //查询车辆轨迹信息
    'searchtrackgps', //查询车辆轨迹GPS信息
    'getcaraddress',// 进行逆地址解析
    'gettrackgps', //获取车辆分段轨迹信息
    'setTrackInfoBox', //设置坐标点事件信息表格
]);

export default TrackAction