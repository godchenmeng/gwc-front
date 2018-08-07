/**
 * @file bootstrapTree公共方法
 * @author Banji 2017.08.08
 * @see http://www.htmleaf.com/jQuery/Menu-Navigation/201502141379.html
 */

var bootstrapTree = {
    /**
     * @param {string} divID 树容器
     * @param {Array} data 树数据数组
     * @param {string} textID 机构名称显示控件ID
     * @param {string} hideID 机构编码隐藏控件ID
     * @param {object} store 传入store类控制选中事件
     * @param {boolean} isShowCheckbox 是否显示多选框
     * @param {boolean} isHadType 是否还有type属性判定节点图标显示
     * @param {boolean} isNotLinkP 选中时是否不联动父级
     */
    initTree:function(divID,data,textID,hideID,store,isShowCheckbox,isHadType,isNotLinkP){
        let that = this;
        if(null == isHadType) isHadType = true;
        isNotLinkP =  !!isNotLinkP ? true:false;
        that.treeData = that.dataFormat(data,isHadType);
        $("#"+divID).treeview({
            emptyIcon:"tree-icon-empty",//设置列表树中没有子节点的节点的图标
            collapseIcon:"tree-icon-minus",//设置列表树可收缩节点的图标
            expandIcon:"tree-icon-add",//设置列表树可展开节点的图标
            uncheckedIcon: "tree-icon tree-Check",//设置图标为未选择状态的checkbox图标
            checkedIcon: "tree-icon tree-active",//设置处于checked状态的复选框图标
            showCheckbox: isShowCheckbox ? isShowCheckbox : false,//是否在节点上显示checkboxes
            showBorder: false,//是否在节点上显示边框
            showTags: false,//是否在每个节点右边显示tags标签。tag值必须在每个列表树的data结构中给出
            data: that.treeData,
            onNodeSelected:function (event, node) {
                if(textID && hideID && !isShowCheckbox){
                    $("#"+divID).hide();
                    $("#"+textID).val(node.text);
                    $("#"+textID).trigger("change");
                    $("#"+hideID).val(node.org_id);
                    if(store) store.trigger("treeselected",node);
                }else if(store){
                    store.trigger("treeselected",node);
                }
            },
            onNodeChecked:function (event, node) {
                if(!isNotLinkP && node.parentId >= 0){
                    that.setParentNodeCheck(divID,node);
                }
                if(node.nodes.length > 0){
                    that.setNodeCheck(divID,node.nodes);
                }
                if(store){
                    store.trigger("setchecked",$('#' + divID).treeview(true).getChecked());
                }
                if(textID && hideID && isShowCheckbox){
                    let nodes = $('#' + divID).treeview(true).getChecked();
                    if(nodes.length > 0){
                        let org_names = [];
                        let org_ids = [];
                        $.each(nodes,function(index,node){
                            org_names.push(node.text);
                            org_ids.push(node.org_id);
                        });
                        $("#"+textID).val(org_names.join(",")).attr("title",org_names.join(",").length > 255?org_names.join(",").substring(0,249)+"......":org_names.join(","));
                        $("#"+hideID).val(org_ids.join(","));
                    }else{
                        $("#"+textID).val("").attr("title","");
                        $("#"+hideID).val("");
                    }
                }
            },
            onNodeUnchecked:function (event, node) {
                if(!isNotLinkP && node.parentId >= 0){
                    that.setParentNodeUnCheck(divID,node);
                }
                if(node.nodes.length > 0){
                    that.setNodeUnCheck(divID,node.nodes);
                }
                if(store){
                    store.trigger("setchecked",$('#' + divID).treeview(true).getChecked());
                }
                if(textID && hideID && isShowCheckbox){
                    let nodes = $('#' + divID).treeview(true).getChecked();
                    if(nodes.length > 0){
                        let org_names = [];
                        let org_ids = [];
                        $.each(nodes,function(index,node){
                            org_names.push(node.text);
                            org_ids.push(node.org_id);
                        });
                        $("#"+textID).val(org_names.join(",")).attr("title",org_names.join(",").length > 255?org_names.join(",").substring(0,249)+"......":org_names.join(","));
                        $("#"+hideID).val(org_ids.join(","));
                    }else{
                        $("#"+textID).val("").attr("title","");
                        $("#"+hideID).val("");
                    }
                }
            }
        });
        if(textID && hideID) {
            $("input#" + textID).click(function (e) {
                $("div#" + divID).show();
                e.stopPropagation();//取消事件冒泡
                $("div#" + divID).on("click",function(event){
                    if(event.stopPropagation){
                        event.stopPropagation();//取消事件冒泡
                    }else{
                        event.cancelBubble = true;
                    }
                });
                $(document).on("click",function () {
                    $("div#" + divID).hide();
                });
            });
        }
    },
    expandTree:function (divID) {
        $("#" + divID).treeview(true).expandAll();
    },
    dataFormat:function(data,isHadType){
        let that = this;
        let treeArray = [];
        for(let i = 0; i < data.length; i++){
            let tmp_data = data[i];
            let treeData = {
                text:tmp_data.name,
                icon:'',
                state:{
                    checked:false,
                    expanded:false
                },
                org_id:tmp_data.id,
                nodes:[]
            };
            if(isHadType){
                if(tmp_data.type == '1'){
                    treeData.icon = 'tree-icon tree-org';
                }else{
                    treeData.icon = 'tree-icon tree-dep';
                }
            }else{
                if(tmp_data.type == '1'){
                    treeData.icon = 'tree-icon tree-org';
                }else if(tmp_data.type == '2'){
                    treeData.icon = 'tree-icon tree-dep';
                }
            }
            if(tmp_data.children.length > 0){
                treeData.nodes = that.dataFormat(tmp_data.children);
            }
            treeArray[i] = treeData;
        }
        return treeArray;
    },
    /**
     * 选中子节点
     *
     * @param {divID} 树容器ID
     * @param {nodes} 子节点数据
     */
    setNodeCheck:function (divID,nodes) {
        let that = this;
        for(let i=0; i<nodes.length; i++){
            let node = nodes[i];
            $('#' + divID).treeview(true).checkNode(node.nodeId,{ silent: true });
            if(node.nodes.length > 0){
                that.setNodeCheck(divID,node.nodes);
            }
        }
    },
    /**
     * 选中父节点
     *
     * @param {divID} 树容器ID
     * @param {node} 选中的节点
     */
    setParentNodeCheck:function (divID,node) {
        let that = this;
        var parentNode = $('#' + divID).treeview(true).getParent(node);
        if(!!parentNode){
            $('#' + divID).treeview(true).checkNode(parentNode.nodeId,{ silent: true });
            if(parentNode.parentId >= 0){
                that.setParentNodeCheck(divID,parentNode);
            }
        }
    },
    /**
     * 取消子节点
     *
     * @param {divID} 树容器ID
     * @param {nodes} 子节点数据
     */
    setNodeUnCheck:function (divID,nodes) {
        let that = this;
        for(let i=0; i<nodes.length; i++){
            let node = nodes[i];
            $('#' + divID).treeview(true).uncheckNode(node.nodeId,{ silent: true });
            if(node.nodes.length > 0){
                that.setNodeUnCheck(divID,node.nodes);
            }
        }
    },
    /**
     * 取消父节点
     *
     * @param {divID} 树容器ID
     * @param {node} 取消选中的节点数据
     */
    setParentNodeUnCheck:function (divID,node) {
        let that = this;
        var parentNode = $('#' + divID).treeview(true).getParent(node);
        if(parentNode.nodes.length > 0){
            let count = 0;
            for(let i=0; i<parentNode.nodes.length; i++){
                let node = parentNode.nodes[i];
                if(node.state.checked){
                    count++;
                    break;
                }
            }
            if(count == 0){
                $('#' + divID).treeview(true).uncheckNode(parentNode.nodeId,{ silent: true });
            }
        }
        if(parentNode.parentId >= 0){
            that.setParentNodeUnCheck(divID,parentNode);
        }
    },
    /**
     * 选中子节点
     *
     * @param {divID} 树容器ID
     * @param {nodes} 子节点数据
     */
    setNodeCheckByOrgID:function (divID,orgIDs, callBakFun) {
        let that = this;
        for(let i=0; i<orgIDs.length; i++){
            let orgID = orgIDs[i];
            let re = eval("/^" + orgID + "$/;");
            let orgNode = $("#" + divID).treeview(true).findNodes(re,null,'org_id');
            if(orgNode.length > 0){
                $('#' + divID).treeview(true).checkNode(orgNode[0].nodeId,{ silent: true });
                if(!!callBakFun && $.isFunction(callBakFun)) callBakFun(orgNode[0]);
            }
        }
    },
    setAllNodeCheck:function (divID) {
        $('#' + divID).treeview(true).checkAll({ silent: true });
    },
    setAllNodeUnCheck:function (divID) {
        $('#' + divID).treeview(true).uncheckAll({ silent: true });
    },
    setUnSelectNode:function(divID,node) {
        $('#' + divID).treeview(true).unselectNode(node, { silent: true });
    },
    getSelected:function(divID) {
        return $('#' + divID).treeview(true).getSelected();
    },
    /**
     * 获取被勾选的节点
     *
     * @param {divID} 树容器ID
     * @param {isOnlyId} 只获取勾选的节点id
     * @return 节点数组或节点ID数组
     */
    getChecked:function(divID,isOnlyId) {
        if(!isOnlyId) return $('#' + divID).treeview(true).getChecked();
        var nodeIds = [],nodes = [];
        nodes = $('#' + divID).treeview(true).getChecked();
        if(nodes.length > 0){
            $.each(nodes,function(index,node){
                nodeIds.push(node.org_id);
            });
        }
        return nodeIds;
    },
    treeData:undefined
};
export default bootstrapTree;