//API查看 http://www.bootcdn.cn/bootstrap-treeview/readme/
import MonitorAction from '../actions/monitorAction'
import LocateAction from '../actions/locateAction'
import FenceAction from '../actions/fenceAction'
import CommonStore from '../../common/stores/commonStore'

window.treeControl = {
    /**
     * 初始化树插件
     *
     * @param {divID} 树容器ID
     * @param {data} 数组数据
     */
    initTree: function (divID,data,action) {
        let that = this;
        $('#' + divID).treeview({
            emptyIcon:"tree-icon-empty",
            collapseIcon:"tree-icon-minus",
            expandIcon:"tree-icon-add",
            uncheckedIcon: "tree-icon tree-Check",
            checkedIcon: "tree-icon tree-active",
            nodeIcon: "tree-icon tree-carGreen",
            showCheckbox: true,
            showBorder: false,
            showTags: true,
            data: data,
            onNodeChecked:function (event, node) {
                if(node.nodes.length > 0){
                    let nodes = [];
                    that.getChildNode(node.nodes,nodes);
                    $('#' + divID).treeview(true).checkNode(nodes,{ silent: true});
                }
                let devices = [];
                let nodes = $('#' + divID).treeview(true).getChecked();
                that.setCheckDevice(nodes,devices);
                action.setmonitorcars(devices);
            },
            onNodeUnchecked:function (event, node) {
                if(node.nodes.length > 0){
                    let nodes = [];
                    that.getChildNode(node.nodes,nodes);
                    $('#' + divID).treeview(true).uncheckNode(nodes,{ silent: true});
                }
                let devices = [];
                let nodes = $('#' + divID).treeview(true).getChecked();
                that.setCheckDevice(nodes,devices);
                action.setmonitorcars(devices);
            }
        });
    },
    showAllTree:function (divID) {
        $("#" + divID).treeview(true).enableAll({silent:true});
        $("#" + divID).treeview(true).uncheckAll({silent:true});
    },
    /**
     * 根据关键字搜索车辆节点
     * @param divID 容器ID
     * @param keyword 关键词
     * @returns {*|Number|Array|{isMatch, score}|jQuery}
     */
    searchByKeyword:function (divID, keyword) {
        return $("#" + divID).treeview(true).search(keyword,{exactMatch:false,revealResults:true,silent:true});
    },
    /**
     * 设置车辆节点状态图标
     *
     * @param {divID} 树容器ID
     * @param {cars} 车辆状态信息
     */
    setCarStatusICON:function (divID,cars) {
        let re = eval("/^[a-zA-Z0-9]{11,13}$/;");
        let carsNodes = $("#" + divID).treeview(true).findNodes(re,null,'sn'); //由于ES5不支持正则/\S/匹配加修饰参数的形式，暂时使用SN匹配有0的则是车辆节点
        let carsStatus = new Object();
        $.each(cars, function (i, car){
            carsStatus[car.device] = car.acc;
        });
        for(let i=0; i < carsNodes.length; i++){
            let carsNode = carsNodes[i];
            let carTypeCode = CommonStore.getCarTypeCodeByDevice(carsNode.sn);
            if(carsStatus[carsNode.sn] == '1'){
                carsNode.icon = 'tree-icon tree-carGreen';
                if(carTypeCode) carsNode.icon = 'tree-icon tree-'+carTypeCode+'-green';
            }else if(carsStatus[carsNode.sn] == '2'){
                carsNode.icon = 'tree-icon tree-carBule';
                if(carTypeCode) carsNode.icon = 'tree-icon tree-'+carTypeCode+'-red';
            }else{
                carsNode.icon = 'tree-icon tree-carGray';
                if(carTypeCode) carsNode.icon = 'tree-icon tree-'+carTypeCode+'-gray';
            }

            $("#" + divID).treeview(true).setNode(carsNode);
        }
        $("#" + divID).treeview(true).render();
        return carsStatus;
    },
    /**
     * 通过车辆在线状态设置车辆节点选中状态
     *
     * @param {divID} 树容器ID
     * @param {cars} 车辆状态信息
     * @param {selectAcc} 选择的车辆状态
     *
     */
    setCarCheckedStateByCarStatus:function (divID,cars,selectAcc) {
        let re = eval("/^[a-zA-Z0-9]{11,13}$/;");
        let carsNodes = $("#" + divID).treeview(true).findNodes(re,null,'sn'); //由于ES5不支持正则/\S/匹配加修饰参数的形式，暂时使用SN匹配有0的则是车辆节点
        let carsStatus = new Object();
        $.each(cars, function (i, car){
            carsStatus[car.device] = car.acc;
        });
        let devices = [];
        for(let i=0; i < carsNodes.length; i++){
            let carsNode = carsNodes[i];
            if(carsStatus[carsNode.sn] == '1'){
                if(selectAcc.indexOf('1') > -1){
                    carsNode.state.checked = true;
                    devices.push(carsNode.sn);
                }else{
                    carsNode.state.checked = false;
                }
            }else if(carsStatus[carsNode.sn] == '2'){
                if(selectAcc.indexOf('2') > -1){
                    carsNode.state.checked = true;
                    devices.push(carsNode.sn);
                }else{
                    carsNode.state.checked = false;
                }
            }else {
                if(selectAcc.indexOf('0') > -1){
                    carsNode.state.checked = true;
                    devices.push(carsNode.sn);
                }else{
                    carsNode.state.checked = false;
                }
            }
            $("#" + divID).treeview(true).setNode(carsNode);
        }
        $("#" + divID).treeview(true).render();
        return devices;
    },
    /**
     * 设置选中的设备
     *
     * @param {nodes} 树节点
     * @param {devices} 设备编号数组
     */
    setCheckDevice:function (nodes,devices) {
        let that = this;
        for(let i=0; i < nodes.length; i++){
            let node = nodes[i];
            if(node.sn && node.state.checked && $.inArray(node.sn, devices) < 0) {
                devices.push(node.sn);
            }
            if(node.nodes.length > 0){
                that.setCheckDevice(node.nodes, devices);
            }
        }
    },
    /**
     * 选中子节点
     *
     * @param {divID} 树容器ID
     * @param {nodes} 子节点数据
     */
    setNodeCheck:function (divID,nodes) {
        $('#' + divID).treeview(true).checkNode(nodes,{ silent: true });
    },
    /**
     * 取消子节点
     *
     * @param {divID} 树容器ID
     * @param {nodes} 子节点数据
     */
    setNodeUnCheck:function (divID,nodes) {
        $('#' + divID).treeview(true).uncheckNode(nodes,{ silent: true });
    },
    setAllNodeUnCheck:function (divID) {
        $('#' + divID).treeview(true).uncheckAll({ silent: true });
    },
    getChildNode:function (node,re) {
        for(let i = 0; i < node.length; i++){
            re.push(node[i]);
            if(node[i].nodes.length > 0){
                this.getChildNode(node[i].nodes,re);
            }
        }
    },
    /**
     * 隐藏其他未选中节点
     * @param divID
     */
    disableNode:function (divID) {
        let checkedNodes = $('#' + divID).treeview(true).getChecked();
        $('#' + divID).treeview(true).disableAll({silent: true});
        $.each(checkedNodes, function (index, node) {
            node.state.disabled = false;
            node.state.checked = true;
        })
        $('#' + divID).treeview(true).revealNode(checkedNodes, {silent: true});
    },
    /**
     * 显示所有节点
     * @param divID
     */
    enableNode:function (divID) {
        $('#' + divID).treeview(true).enableAll({silent: true});
    },
    /**
     * 根据设备ID查找NODE
     * @param divID
     * @param device
     * @returns {Array|*|jQuery}
     */
    findByDevice:function (divID,device) {
        let re = eval("/^" + device + "$/;");
        return $('#' + divID).treeview(true).findNodes(re,null,'sn');
    },
    /**
     * 根据车牌号选中树
     * @param divID
     * @param carNo
     */
    setNodeCheckByCarNo:function (divID,carNo) {
        let re = eval("/^" + carNo + "$/;");
        let node = $('#' + divID).treeview(true).findNodes(re,null,'text');
        $('#' + divID).treeview(true).checkNode(node);
    }
}