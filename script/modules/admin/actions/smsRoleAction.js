/**
 * @file 短信角色管理 Reflux Actoin
 * @author Banji 2017.10.30
 */


var SmsRoleAction = Reflux.createActions([
    'getSmsRoleList',//获取短信角色列表
    'addSmsRole',//新增短信角色
    'updateSmsRole', //更新短信角色
    'deleteSmsRole', //删除短信角色
]);

export default SmsRoleAction