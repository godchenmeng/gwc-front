/**
 * @file 用户管理台Reflux Actoin
 * @author CM 2017.08.15
 */


var UserAction = Reflux.createActions([
    'getuserlist',//加载用户列表
    'adduser', //新增用户
    'updateuser', //更新用户信息
    'addaccount', //新增账号
    'adduseraccount', //新增用户账号
    'getaccountlist', //加载账号列表
    'changepassword', //修改密码
    'updateaccount', //更新账号信息
]);

export default UserAction