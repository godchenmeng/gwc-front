/**
 * @file 机构部门管理台Reflux Actoin
 * @author CM 2017.08.21
 */


var DepartmentAction = Reflux.createActions([
    'getdepartment', //获取机构部门信息
    'addagency',//新增机构
    'updateagency', //更新机构
    'adddepartment',//新增部门
    'updatedepartment', //更新部门
    'deletedepartment' //删除机构部门
]);

export default DepartmentAction