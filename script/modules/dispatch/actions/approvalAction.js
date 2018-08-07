/**
 * @file 审批Reflux Actoin
 * @author Banji 2017.08.14
 */


var ApprovalAction = Reflux.createActions([
    'search',//审批分页搜索
    'export',//审批列表数据导出
    'agree',//审批同意
    'reject'//审批驳回
]);

export default ApprovalAction