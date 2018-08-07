/**
 * @file 角色管理台Reflux Actoin
 * @author CM 2017.08.22
 */


var RoleAction = Reflux.createActions([
    'getrolelist',//获取角色列表
    'getpermissionlist', //获取权限列表
    'addrole',//新增角色
    'updaterole', //更新角色
]);

export default RoleAction