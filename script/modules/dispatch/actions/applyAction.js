/**
 * @file 用车申请Reflux Actoin
 * @author Banji 2017.08.03
 */


var ApplyAction = Reflux.createActions([
    'search',//用车申请分页搜索
    'applySubmit',//用车申请提交
    'export',//用车申请列表数据导出
    'repeal',//用车申请撤销
    'editApply',//编辑用车申请
    'copyAddApply'//复制新增用车申请
]);

export default ApplyAction