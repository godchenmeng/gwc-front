/**
 * @file 短信管理台Reflux Actoin
 * @author CM 2017.08.23
 */


var SmsAction = Reflux.createActions([
    'getsmslist',//获取短信列表
    'setsms',//短信发送设置
    'getuserorg', //获取用户和机构列表
]);

export default SmsAction